from django.urls import path
from .views import signup,login,HomeView,sent_reset_email,reset_password,TaskListCreate,TaskRetrieveUpdateDestroy


urlpatterns = [
    path('signup/',signup,name='signup'),
    path('login/',login,name='login'),
    path('home/', HomeView.as_view() , name='home'),
    path("password-reset/",sent_reset_email,name="password_reset"),
    path("password-reset-confirm/<uidb64>/<token>/",reset_password,name="password_reset_confirm"),
    path('tasks/', TaskListCreate.as_view(), name='task-list-create'),
    path('tasks/<int:pk>/', TaskRetrieveUpdateDestroy.as_view(), name='task-detail'),
]