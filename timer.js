const startTimer = () => {
    state.timer = setInterval(() => {
      let [minutes, seconds] = state.time.split(':');
      if (state.time === '0:00') {
        // render();
        clearInterval(state.timer);
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

  const render = () => {

  const time = document.getElementsByClassName('time')[0];
  time.textContent = state.time;
  }