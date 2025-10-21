from rest_framework import routers
from .views import FacultyViewSet, SubjectViewSet
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'faculty', FacultyViewSet)
router.register(r'subjects', SubjectViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
