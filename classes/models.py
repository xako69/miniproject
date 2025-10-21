from django.db import models
from django.core.exceptions import ValidationError

class ClassRoom(models.Model):
    COURSE_CHOICES = [
        ("BCA", "BCA"),
        ("MCA", "MCA"),
    ]
    # allow S1..S6; validation below enforces MCA max 3
    SEM_CHOICES = [(f"S{i}", f"Semester {i}") for i in range(1, 7)]

    name = models.CharField(max_length=50, unique=True)  # e.g., "S1 BCA"
    course = models.CharField(max_length=10, choices=COURSE_CHOICES)
    semester = models.CharField(max_length=10, choices=SEM_CHOICES)

    def clean(self):
        # Ensure MCA only up to S3
        if self.course == "MCA":
            if self.semester not in ["S1", "S2", "S3"]:
                raise ValidationError("MCA classes must have semester S1 - S3.")
        # BCA allows S1..S6; no extra check.

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
