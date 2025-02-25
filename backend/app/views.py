from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .models import Task
from .serializers import TaskSerializer



def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    refresh["username"] = user.username 
    return{
        "refresh": str(refresh),
        "access": str(refresh.access_token)
    } 


@api_view(["POST"])
def signup(request):
    username = request.data.get("username").strip()
    email = request.data.get("email").strip()
    password = request.data.get("password").strip()
    confirmpassword = request.data.get("confirmpassword").strip()

    if not username or not email or not password or not confirmpassword:
        return Response({"error":"All fields are required"},status=400)
    
    if password != confirmpassword:
        return Response({"error": "PAsswords do not match"},status=400)
    
    if User.objects.filter(username=username).exists():
        return Response({"error": "Username is already taken"}, status=400)
    
    user = User.objects.create_user(username=username, email=email, password=password)
    tokens = get_tokens_for_user(user)

    return Response({"message": "Registered Successfully", "tokens":tokens},status=201)

@api_view(["POST"])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)
    if user is not None:
        tokens = get_tokens_for_user(user)
        return Response({
            "access": tokens['access'],
            "username":user.username,
            "message":"Login successful",
            })
    return Response({"error": "Invalid credentials"},status=400)
class HomeView(APIView):
    permission_classes = (IsAuthenticated, )
    def get(self,request):
        content = {'message': 'Welcome to dashboard'}
        return Response(content)
    
@api_view(["POST"])
def sent_reset_email(request):
    email = request.data.get("email")

    if not email:
        return Response({"error":"Required field"},status=400)
    try:
        user=User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error":"No user Found"},status=404)
    token=default_token_generator.make_token(user)
    uid=urlsafe_base64_encode(force_bytes(user.pk))
    reset_link=f"http://localhost:3000/reset-password/{uid}/{token}/"

    html_message = render_to_string("emailtemp/email_template.html", {"reset_link": reset_link, "username": user.username})
    plain_message = strip_tags(html_message)
    send_mail(
        subject="Password Reset Request",
        message=plain_message,  
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,  
        fail_silently=False,
    )
    return Response({"message":"Mail sent"},status=200)
    
@api_view(["POST"])
def reset_password(request, uidb64, token):
    try:
        print(f"Received uidb64: {uidb64}, token: {token}")  

        uid = urlsafe_base64_decode(uidb64).decode()
        print(f"Decoded UID: {uid}")  

        user = User.objects.get(pk=uid)
        print(f"User Found: {user.username}")  
        
        if not default_token_generator.check_token(user, token):
            print("Invalid or expired token!")  
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        new_password = request.data.get("password")
        if not new_password:
            return Response({"error": "Password is required"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({"message": "Password reset success!"}, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        print("User not found") 
        return Response({"error": "Invalid user"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(f"Error: {str(e)}")  
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def task_list_create(request):
    if request.method == "GET":
        tasks = Task.objects.all()  
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)  

    elif request.method == "POST":
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def task_detail(request, pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = TaskSerializer(task, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        task.delete()
        return Response({"message": "Task deleted successfully"}, status=status.HTTP_204_NO_CONTENT)