from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import ResumeUploadSerializer
from .utils import extract_text_from_pdf, extract_text_from_docx
from .services import analyze_resume

def api_root(request):
    return JsonResponse({
        "message": "Resume AI Backend is Running",
        "endpoints": {
            "upload": "/api/upload/",
            "status": "active"
        }
    })

class ResumeUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        serializer = ResumeUploadSerializer(data=request.data)
        if serializer.is_valid():
            file_obj = request.FILES['file']
            filename = file_obj.name.lower()
            text = ""

            try:
                if filename.endswith('.pdf'):
                    text = extract_text_from_pdf(file_obj)
                elif filename.endswith('.docx'):
                    text = extract_text_from_docx(file_obj)
                
                print(f"DEBUG: Extracted text length: {len(text)}")
                
                if not text:
                    return Response({"error": "No text could be extracted from the file."}, status=status.HTTP_400_BAD_REQUEST)
                
                # Call AI
                print("DEBUG: Calling Groq API...")
                analysis_result = analyze_resume(text)
                print(f"DEBUG: AI Result: {analysis_result}")
                
                if "error" in analysis_result:
                     return Response(analysis_result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                return Response(analysis_result, status=status.HTTP_200_OK)

            except Exception as e:
                print(f"DEBUG: Exception: {str(e)}")
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
