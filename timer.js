
let timeStorage = ''

const startTimer = () => {
  timeStorage = document.getElementsByClassName("time")[0].value
  state.time = document.getElementsByClassName("time")[0].value
  state.timer = setInterval(() => {
    document.getElementById("myBtn").disabled = true;
    document.getElementsByClassName("time")[0].disabled = true;
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
  await renderNotes();
}

const resetRender = () => {
  document.getElementById("myBtn").disabled = false;
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
        event.preventDefault();
        let newNote = await postToDatabase(event.target.value);
        renderNote(newNote)
        let input = document.getElementsByClassName('text')
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
  postedNotes.innerHTML = postedNotes.innerHTML + newNote
}