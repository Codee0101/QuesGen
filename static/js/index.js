

try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
    $('.no-browser-support').hide();
  } catch (e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
  }
  
  
  var noteTextarea = $('#note-textarea');
  var instructions = $('#recording-instructions');
  var notesList = $('ul#notes');
  
  var noteContent = '';
  
  // Get all notes from previous sessions and display them.
  // var notes = getAllNotes();
  // renderNotes(notes);
  
  
  
  /*-----------------------------
      Voice Recognition 
  ------------------------------*/
  
  // If false, the recording will stop after a few seconds of silence.
  // When true, the silence period is longer (about 15 seconds),
  // allowing us to keep recording even when the user pauses. 
  recognition.continuous = true;
  
  // This block is called every time the Speech APi captures a line. 
  recognition.onresult = function(event) {
  
    // event is a SpeechRecognitionEvent object.
    // It holds all the lines we have captured so far. 
    // We only need the current one.
    var current = event.resultIndex;
  
    // Get a transcript of what was said.
    var transcript = event.results[current][0].transcript;
  
  
  
    // Add the current transcript to the contents of our Note.
    // There is a weird bug on mobile, where everything is repeated twice.
    // There is no official solution so far so we have to handle an edge case.
    var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);
  
    if (!mobileRepeatBug) {
        noteContent += transcript;
        noteTextarea.val(noteContent);
    }
  };
  
  recognition.onstart = function() {
    instructions.text('Voice recognition activated. Try speaking into the microphone.');
  }
  
  recognition.onspeechend = function() {
    instructions.text('Voice recognised turned off.');
  }
  
  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
        instructions.text('No speech was detected. Try again.');
    };
  }
  
  
  
  /*-----------------------------
      App buttons and input 
  ------------------------------*/
  
  $('#start-record-btn').on('click', function(e) {
    if (noteContent.length) {
        noteContent += ' ';
    }
    recognition.start();
  });
  
  
  $('#pause-record-btn').on('click', function(e) {
    recognition.stop();
    instructions.text('Voice recognition paused.');
  });
  
  // Sync the text inside the text area with the noteContent variable.
  noteTextarea.on('input', function() {
    noteContent = $(this).val();
  })
  
  $('#save-note-btn').on('click', function(e) {
    recognition.stop();
  
    if (!noteContent.length) {
        instructions.text('Could not save empty note. Please add a message to your note.');
    } else {
        // Save note to localStorage.
        // The key is the dateTime with seconds, the value is the content of the note.
  
        saveNote(new Date().toLocaleString(), noteContent);
        // Reset variables and update UI.
        noteContent = '';
  
        renderNotes(getAllNotes());
        noteTextarea.val('');
        instructions.text('Note saved successfully.');
        location.reload();
    }
  
  })

  
  notesList.on('click', function(e) {
    e.preventDefault();
    var target = $(e.target);
  
    // Listen to the selected note.
    if (target.hasClass('blog-slider__button-listen')) {
        var content = target.closest('.blog-slider__content').find('.blog-slider__text').text();
        readOutLoud(content);
    }
  
    // Delete note.
    if (target.hasClass('blog-slider__button-delete')) {
      // alert("Hello");
      
        var dateTime = target.closest('.blog-slider__content').find('.blog-slider__code').text();
        deleteNote(dateTime);
        target.closest('.blog-slider swiper-container-fade swiper-container-horizontal').remove();
        location.reload();
    }
  
    // convert Node to text file
    if (target.hasClass('convert-note')) {
        var dateTime = target.siblings('.date').text();
        convertToText(dateTime);
        // deleteNote(dateTime);
        // target.closest('.note').remove();
    }
    if (target.hasClass('blog-slider__button-question')) {
        var dateTime = target.closest('.blog-slider__content').find('.blog-slider__code').text();;
        // questionType(dateTime);
        var text = localStorage.getItem('note-' + dateTime);
        window.open('/questionType?myvar='+ encodeURI(text));
    }
  });
  
  
  
  /*-----------------------------
      Speech Synthesis 
  ------------------------------*/
  
  function readOutLoud(message) {
    var speech = new SpeechSynthesisUtterance();
  
    // Set the text and voice attributes.
    speech.text = message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
  
    window.speechSynthesis.speak(speech);
  }
  
  
  
  /*-----------------------------
      Helper Functions 
  ------------------------------*/
  /*
  function renderNotes(notes) {
    var html = '';
    if (notes.length) {
        notes.forEach(function(note) {
            html += `<li class="note">
              <p class="header">
                <span class="date">${note.date}</span>
                <a href="#" class="listen-note" title="Listen to Note">Listen to Note</a>
                <a href="#" class="delete-note" title="Delete">Delete</a>
                <a href="#" class ="convert-note" title= "Convert">Convert</a>
              </p>
              <p class="content">${note.content}</p>
            </li>`;
        });
    } else {
        html = '<li><p class="content">You don\'t have any notes yet.</p></li>';
    }
    notesList.html(html);
  }
  
  
  function saveNote(dateTime, content) {
    localStorage.setItem('note-' + dateTime, content);
  }
  
  
  
  function getAllNotes() {
    var notes = [];
    var key;
    for (var i = 0; i < localStorage.length; i++) {
        key = localStorage.key(i);
        console.log(i)
        console.log(key)
  
        if (key.substring(0, 5) == 'note-') {
            notes.push({
                date: key.replace('note-', ''),
                content: localStorage.getItem(localStorage.key(i))
            });
        }
    }
    console.log(notes)
    return notes;
  }
  
  
  function deleteNote(dateTime) {
    localStorage.removeItem('note-' + dateTime);
  }
  localStorage.removeItem('note-' + dateTime);
  
  
  function convertToText(dateTime) {
    var text = localStorage.getItem('note-' + dateTime);
    console.log(text);
    var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    console.log(blob);
    // saveAs(blob, "filename.txt");
  }
  
  */
  
  var swiper = new Swiper('.blog-slider', {
    spaceBetween: 30,
    effect: 'fade',
    loop: true,
    mousewheel: {
      invert: false,
    },
    // autoHeight: true,
    pagination: {
      el: '.blog-slider__pagination',
      clickable: true,
    }
  });
  