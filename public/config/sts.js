function startRecording() {
    if (window.hasOwnProperty('webkitSpeechRecognition')) {
        console.log("recording")
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-SG';
        recognition.start();
        recognition.onresult = (event) => {
            console.log(event.results[0][0].transcript);
            this.speechOrigin = event.results[0][0].transcript;
        };

        recognition.onerror = function(event) {
            recognition.stop();
        };
    };
}

function stopRecording(id) {
    console.log("stopping")
    document.getElementById(id).value = this.speechOrigin;
    recognition.stop();
}