import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate = null;

const input = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('button[data-start]');
const daysEl = document.querySelector('span[data-days]');
const hoursEl = document.querySelector('span[data-hours]');
const minutesEl = document.querySelector('span[data-minutes]');
const secondsEl = document.querySelector('span[data-seconds]');

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates.length > 0) {
      const chosenDate = selectedDates[0];
      const now = new Date();

      if (chosenDate <= now) {
        iziToast.error({
          title: 'Error',
          message: 'Please choose a date in the future',
        });
        userSelectedDate = null;
        startBtn.disabled = true;
        return;
      }

      userSelectedDate = chosenDate;
      startBtn.disabled = false;
    }
  },
};

flatpickr(input, options);

const timer = {
  intervalId: null,
  isActive: false,
};

startBtn.addEventListener('click', onStartBtnClick);

function onStartBtnClick() {
  if (timer.isActive) {
    return;
  }

  if (!userSelectedDate) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a valid date first',
    });
    return;
  }

  timer.isActive = true;
  startBtn.disabled = true;
  input.disabled = true;

  const now = new Date();
  const diff = userSelectedDate - now;

  updateTimer(convertMs(diff));

  timer.intervalId = setInterval(() => {
    const diff = userSelectedDate - new Date();
    if (diff <= 0) {
      clearInterval(timer.intervalId);
      timer.isActive = false;
      input.disabled = false;
      startBtn.disabled = true;
      updateTimer(convertMs(0));
      return;
    }
    updateTimer(convertMs(diff));
  }, 1000);
}

function updateTimer({ days, hours, minutes, seconds }) {
  daysEl.textContent = days.toString().padStart(2, '0');
  hoursEl.textContent = hours.toString().padStart(2, '0');
  minutesEl.textContent = minutes.toString().padStart(2, '0');
  secondsEl.textContent = seconds.toString().padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
