document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const translateBtn = document.getElementById('translateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const speakBtn = document.getElementById('speakBtn');
    const saveBtn = document.getElementById('saveBtn');
    const domainSelect = document.getElementById('domainSelect');
    const charCount = document.getElementById('charCount');
    const loaderIcon = document.getElementById('loaderIcon');
    const apiStatus = document.getElementById('apiStatus');

    // API Configuration
    const API_ENDPOINT = 'http://localhost:5000/translate'; // ✅ correct

    // const API_KEY = 'EDU_2024';

    // Character Counter
    inputText.addEventListener('input', function() {
        const count = this.value.length;
        charCount.textContent = `${count}/5000`;
        charCount.className = count >= 5000 ? 
            'text-sm text-red-500' : 'text-sm text-gray-500';
    });

    // Translation Function
    async function translateText() {
        const text = inputText.value.trim();
        if (!text) {
            alert('Please enter text to translate');
            return;
        }
    
        translateBtn.disabled = true;
        loaderIcon.classList.remove('hidden');
        outputText.innerHTML = '<p class="text-gray-500">Translating...</p>';
    
        try {
            const response = await fetch('http://localhost:5000/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    q: text,
                    source: 'en',
                    target: 'hi',
                    format: 'text'
                })
            });
    
            const data = await response.json();
            outputText.innerHTML = `<p class="leading-relaxed">${data.translatedText}</p>`;
    
            apiStatus.textContent = 'API Connected';
            apiStatus.previousElementSibling.className = 'inline-block w-3 h-3 rounded-full bg-green-500 mr-2';
        } catch (error) {
            console.error('Translation error:', error);
            outputText.innerHTML = `<p class="text-red-600">Error: ${error.message}</p>`;
            apiStatus.textContent = 'API Connection Failed';
            apiStatus.previousElementSibling.className = 'inline-block w-3 h-3 rounded-full bg-red-500 mr-2';
        } finally {
            translateBtn.disabled = false;
            loaderIcon.classList.add('hidden');
        }
    }
    

    // Event Listeners
    translateBtn.addEventListener('click', translateText);
    
    clearBtn.addEventListener('click', function() {
        inputText.value = '';
        outputText.innerHTML = '<p class="text-gray-400">Translated Hindi text will appear here...</p>';
        charCount.textContent = '0/5000';
        charCount.className = 'text-sm text-gray-500';
    });
    
    copyBtn.addEventListener('click', function() {
        const textToCopy = outputText.innerText;
        if (textToCopy && !textToCopy.includes('Translated Hindi text')) {
            navigator.clipboard.writeText(textToCopy);
            copyBtn.textContent = 'Copied!';
            setTimeout(() => copyBtn.textContent = 'Copy', 2000);
        }
    });
    
    speakBtn.addEventListener('click', function() {
        const textToSpeak = outputText.innerText;
        if (textToSpeak && !textToSpeak.includes('Translated Hindi text')) {
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = 'hi-IN';
            speechSynthesis.speak(utterance);
        }
    });
    
    saveBtn.addEventListener("click", () => {
        const translatedTextContent = translatedTextDiv.innerText.trim();
      
        if (!translatedTextContent || translatedTextContent === "Translated Hindi text will appear here...") {
          alert("No translated text to save as PDF!");
          return;
        }
      
        const { jsPDF } = window.jspdf;  // Ensure jsPDF is available
        const doc = new jsPDF();
        
        // Set font and size
        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);
        
        // Add text to the PDF
        doc.text("Translated Hindi Text", 10, 10);  // Title or heading
        doc.text(translatedTextContent, 10, 20);  // Actual translated content
      
        // Save the PDF as a file
        doc.save("translated_text.pdf");
      });
      

    inputText.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            translateText();
        }
    });
});