class ResumeAPI {
    // CHANGE 'http://127.0.0.1:8000' TO YOUR RENDER BACKEND URL IN PRODUCTION
    // Example: 'https://my-resume-analyzer.onrender.com'
    constructor(baseUrl = 'http://127.0.0.1:8000') {
        this.baseUrl = baseUrl;
    }

    async uploadResume(file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${this.baseUrl}/api/upload/`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Something went wrong on the server.');
            }

            return await response.json();
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }
}

// Create a global instance
const api = new ResumeAPI();
