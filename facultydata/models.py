# facultydata/models.py
from django.db import models
from classes.models import ClassRoom  # <-- Import ClassRoom from the classes app

class Faculty(models.Model):
    name = models.CharField(max_length=100)
    classes = models.ManyToManyField(ClassRoom, blank=True)  # Faculties can belong to multiple classes

    def __str__(self):
        return self.name


class Subject(models.Model):
    name = models.CharField(max_length=100)
    faculty = models.ForeignKey(
        Faculty,
        on_delete=models.CASCADE,
        related_name="subjects"  # This is critical for serializer to fetch faculty.subjects
    )
    class_obj = models.ForeignKey(
        ClassRoom,
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        related_name="subjects"  # Optional: allows class_obj.subjects if needed
    )
    weight = models.IntegerField(default=0)
    tutorial = models.BooleanField(default=False)
    is_lab = models.BooleanField(default=False)
    is_mini = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} ({self.class_obj.name})"
