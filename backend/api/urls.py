from django.urls import path
from .views import api_root, ResumeUploadView

urlpatterns = [
    path('', api_root, name='api-root'),
    path('api/upload/', ResumeUploadView.as_view(), name='resume-upload'),
]
