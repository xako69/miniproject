from rest_framework import viewsets
from .models import ClassRoom
from .serializers import ClassRoomSerializer

class ClassRoomViewSet(viewsets.ModelViewSet):
    queryset = ClassRoom.objects.all().order_by('name')
    serializer_class = ClassRoomSerializer
