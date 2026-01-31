from rest_framework import serializers

class ResumeUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, value):
        valid_extensions = ['.pdf', '.docx']
        ext = '.' + value.name.split('.')[-1].lower()
        if ext not in valid_extensions:
            raise serializers.ValidationError("Unsupported file extension. Only PDF and DOCX allowed.")
        
        # 5MB limit
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("File size too large. Maximum limit is 5MB.")
            
        return value
