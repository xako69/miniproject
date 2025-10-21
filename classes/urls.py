# classes/urls.py
from rest_framework import routers
from .views import ClassRoomViewSet
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'classes', ClassRoomViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
