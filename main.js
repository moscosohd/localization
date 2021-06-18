function openTab(evt, tabName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("tab");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" w3-red", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " w3-red";
}

function openTabText() {
    var tabName = document.getElementById('language_select_text').value;
    var i, x;
    x = document.getElementsByClassName("tab_text");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";
}

function openTabAudio() {
    var tabName = document.getElementById('language_select_audio').value;
    var i, x;
    x = document.getElementsByClassName("tab_audio");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";
}

const players = Plyr.setup('audio', {
    controls: ['play', 'current-time', 'progress', 'duration', 'mute', 'volume']
});

var startButton = document.getElementById('start_button');
var final_transcript = '';
var recognizing = false;

if ('webkitSpeechRecognition' in window) {
    var recognition = new webkitSpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function () {
        recognizing = true;
    };

    recognition.onerror = function (event) {
        console.log(event.error);
    };

    recognition.onend = function () {
        recognizing = false;
    };

    recognition.onresult = function (event) {
        var interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
        final_transcript = capitalize(final_transcript);
        final.innerHTML = linebreak(final_transcript);
        interim.innerHTML = linebreak(interim_transcript);
    };
}

var two_line = /\n\n/g;
var one_line = /\n/g;

function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

function capitalize(s) {
    return s.replace(s.substr(0, 1), function (m) {
        return m.toUpperCase();
    });
}

function startDictation(event) {
    if (recognizing) {
        startButton.innerHTML = 'Start Dictation';
        if (startButton.classList.contains('w3-red')) startButton.classList.remove('w3-red');
        document.getElementById('language_select').disabled = false;
        recognition.stop();
        return;
    }
    recognition.lang = document.getElementById('language_select').value;
    startButton.innerHTML = 'Stop Dictation';
    if (!startButton.classList.contains('w3-red')) startButton.classList.add('w3-red');
    document.getElementById('language_select').disabled = true;
    recognition.start();
}