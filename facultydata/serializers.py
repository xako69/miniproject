from rest_framework import serializers
from .models import Faculty, Subject
from classes.models import ClassRoom

# Nested serializer for ClassRoom info
class ClassRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassRoom
        fields = ["id", "name"]

class SubjectSerializer(serializers.ModelSerializer):
    # Nested read-only for frontend display
    class_obj_detail = ClassRoomSerializer(source='class_obj', read_only=True)

    class Meta:
        model = Subject
        fields = ["id", "name", "faculty", "class_obj", "class_obj_detail", "weight", "tutorial", "is_lab", "is_mini"]

    def validate_class_obj(self, value):
        if not value:
            raise serializers.ValidationError("Please select the correct class for this subject.")
        return value

class FacultySerializer(serializers.ModelSerializer):
    # Include subjects related to this faculty
    subjects = SubjectSerializer(many=True, read_only=True)

    class Meta:
        model = Faculty
        fields = ["id", "name", "subjects"]
