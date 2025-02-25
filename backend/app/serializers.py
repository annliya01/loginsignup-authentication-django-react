from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    priority = serializers.IntegerField()
    title = serializers.CharField()
    description = serializers.CharField()
    status = serializers.ChoiceField(choices=["Pending", "Completed"])

    class Meta:
        model = Task
        fields = '__all__'
