from rest_framework import generics, permissions
from rest_framework.views import APIView
from utils.response import success_response, error_response
from .models import Store
from .serializers import StoreCreateSerializer

class StoreCreateView(generics.CreateAPIView):
    serializer_class = StoreCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return success_response("가게 등록이 완료되었습니다.", response.data, status_code=201)

class MyStoreView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            store = request.user.store
            serializer = StoreCreateSerializer(store)
            return success_response("가게 정보를 불러왔습니다.", serializer.data)
        except Store.DoesNotExist:
            return error_response("가게 정보가 등록되어 있지 않습니다.", status_code=404)
