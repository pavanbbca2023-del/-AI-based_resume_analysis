document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('resumeInput');
    const fileNameDisplay = document.getElementById('fileName');
    const dropArea = document.getElementById('dropArea');
    const form = document.getElementById('uploadForm');
    const loadingDiv = document.getElementById('loading');
    const resultSection = document.getElementById('resultSection');
    const resultContent = document.getElementById('resultContent');

    // Display filename when selected
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (fileInput.files.length > 0) {
                fileNameDisplay.textContent = `Selected: ${fileInput.files[0].name}`;
            }
        });
    }

    // Handle form submission
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (fileInput.files.length === 0) {
                alert("Please pick a resume file first (PDF or DOCX).");
                return;
            }

            const formData = new FormData();
            formData.append('file', fileInput.files[0]);

            // Show loading, hide previous results if present
            if (resultSection) resultSection.classList.add('hidden');
            if (loadingDiv) loadingDiv.classList.remove('hidden');

            // Fake progress animation
            const progressText = document.getElementById('progressText');
            let progress = 0;
            if (progressText) progressText.textContent = '0%';

            const progressInterval = setInterval(() => {
                if (progress < 90) {
                    progress += Math.floor(Math.random() * 5) + 1;
                    if (progress > 90) progress = 90;
                    if (progressText) progressText.textContent = `${progress}%`;
                }
            }, 500);

            try {
                console.log("Sending request to API...");

                // Use the global api instance from api.js
                const data = await api.uploadResume(fileInput.files[0]);
                console.log("Success:", data);

                // Store results and redirect
                sessionStorage.setItem('resumeAnalysis', JSON.stringify(data));
                window.location.href = 'results.html';

            } catch (error) {
                console.error("Error:", error);
                alert("Error: " + error.message);
            } finally {
                clearInterval(progressInterval);
                if (loadingDiv) loadingDiv.classList.add('hidden');
            }
        });
    }

    function displayResults(data) {
        resultContent.innerHTML = ''; // Reset

        const fields = [
            { label: 'Full Name', key: 'full_name', icon: 'user' },
            { label: 'Email', key: 'email', icon: 'mail' },
            { label: 'Phone', key: 'phone', icon: 'phone' },
            { label: 'Profile Links', key: 'links', isList: true, icon: 'link' },
            { label: 'Resume Score', key: 'resume_score', icon: 'percent' },
            { label: 'Education', key: 'education', icon: 'graduation-cap' },
            { label: 'Skills', key: 'skills', isList: true, icon: 'code-2' },
            { label: 'Experience', key: 'experience_summary', icon: 'file-text' },
            { label: 'Projects', key: 'projects', isList: true, icon: 'layout' },
            { label: 'Certifications', key: 'certifications', isList: true, icon: 'award' },
            { label: 'Strengths', key: 'key_strengths', isList: true, icon: 'zap' }
        ];

        fields.forEach(field => {
            const value = data[field.key];
            if (!value || (Array.isArray(value) && value.length === 0)) return;

            const itemDiv = document.createElement('div');
            itemDiv.className = 'result-item';

            const label = document.createElement('span');
            label.className = 'result-label';
            label.innerHTML = `<i data-lucide="${field.icon}" style="width: 16px; height: 16px;"></i> ${field.label}`;
            itemDiv.appendChild(label);

            const valContainer = document.createElement('div');
            valContainer.className = 'result-value';

            if (field.isList && Array.isArray(value)) {
                const ul = document.createElement('ul');
                ul.className = 'list-style';
                value.forEach(text => {
                    const li = document.createElement('li');
                    li.textContent = text;
                    ul.appendChild(li);
                });
                valContainer.appendChild(ul);
            } else {
                valContainer.textContent = value;
            }

            itemDiv.appendChild(valContainer);
            resultContent.appendChild(itemDiv);
        });

        if (resultSection.classList.contains('hidden')) {
            resultSection.classList.remove('hidden');
        }

        // Re-run lucide to pick up new icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Check if we are on the results page
    if (window.location.pathname.includes('results.html')) {
        const storedData = sessionStorage.getItem('resumeAnalysis');
        if (storedData) {
            try {
                const data = JSON.parse(storedData);
                displayResults(data);
            } catch (e) {
                console.error("Error parsing stored data", e);
                window.location.href = 'index.html';
            }
        } else {
            // If no data, send back to home
            window.location.href = 'index.html';
        }
    }
});
