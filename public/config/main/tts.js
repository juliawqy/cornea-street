document.addEventListener('DOMContentLoaded', (event) => {
    const textInput = document.getElementById('text-input');
    const speakButton = document.getElementById('speak-button');

    speakButton.addEventListener('click', () => {
        const text = textInput.value;
        if (text.trim() !== '') {
            speakText(text);
        }
    });

    function speakText(text) {
        // Check if the browser supports the Web Speech API
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);

            // Optionally set more properties
            utterance.lang = 'en-US'; // Set the language
            utterance.pitch = 1; // Set the pitch (0 to 2)
            utterance.rate = 1; // Set the rate (0.1 to 10)
            utterance.volume = 1; // Set the volume (0 to 1)

            // Speak the text
            window.speechSynthesis.speak(utterance);
        } else {
            alert('Sorry, your browser does not support text to speech.');
        }
    }
});