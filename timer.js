let noteInProgess = {}
let timeStorage = ''

const startTimer = () => {
  timeStorage = document.getElementsByClassName("time")[0].value
  state.time = document.getElementsByClassName("time")[0].value
  document.getElementById("myBtn").disabled = true;
  document.getElementsByClassName("time")[0].disabled = true;
  document.getElementsByClassName("time")[0].disabled = true;

  document.getElementsByClassName("completed")[0].disabled = true;
  document.getElementsByClassName("not-completed")[0].disabled = true;
  state.timer = setInterval(() => {
    let [minutes, seconds] = state.time.split(':');
    if (state.time === '0:00' || state.time === '00:00') {
      beep(1500, 900);
      clearInterval(state.timer);
      resetRender();
    } else {
      if (seconds === '00') {
        minutes -= 1;
        seconds = 59;
      } else {
        seconds -= 1;
        if (seconds < 10) {
          seconds = `0${seconds}`;
        }
      }
      state.time = [minutes, seconds].join(':');
      render();
    }
  }, 1000);
};

const render = async () => {
  const time = document.getElementsByClassName('time')[0];
  time.value = state.time;
  if (!state.loaded) {
  await renderNotes();
  state.loaded = true;
  }
}

const resetRender = () => {
  document.getElementById("myBtn").disabled = false;
  document.getElementsByClassName("completed")[0].disabled = false;
  document.getElementsByClassName("not-completed")[0].disabled = false;
  const time = document.getElementsByClassName('time')[0];
  time.value = timeStorage;
}

let audioCtx = new (window.AudioContext || window.webkitAudioContext || window.audioContext);

const beep = (duration, frequency, volume, type, callback) => {
  let oscillator = audioCtx.createOscillator();
  let gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  if (volume) { gainNode.gain.value = volume; }
  if (frequency) { oscillator.frequency.value = frequency; }
  if (type) { oscillator.type = type; }
  if (callback) { oscillator.onended = callback; }

  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + ((duration || 500) / 1000));
};



const storeNote = async (event) => {
      if (event.charCode === 13) {
        document.getElementsByClassName("text")[0].disabled = true;
        event.preventDefault();
        let newNote = await postToDatabase(event.target.value ? event.target.value : {text: noteInProgess.text});
        renderNote(newNote)
        let input = document.getElementsByClassName('text')
        noteInProgess = newNote
        input[0].value = ''
      }
}

const renderNotes = async () => {
  let notes = await getNotesFromDatabase()
  notes.forEach(renderNote)
}

const renderNote = (noteObj) => {
  const postedNotes = document.getElementsByClassName('notes')[0]
  const newNote = `<div class='note'>${noteObj.text}</div>`
  postedNotes.innerHTML = newNote + postedNotes.innerHTML
}

const enableInput = () => {
  document.getElementsByClassName("text")[0].disabled = false;
  noteInProgess = []
}

const tryAgain = () => {
  /// RIGHT NOW THIS IS RENDERING ALL NOTES I THINK .... yes
  renderNote(noteInProgess)
  storeNote()
  startTimer();
}