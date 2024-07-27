let timerElement = document.getElementById("timer");
let timer;
let time = 0;
let isRunning = false;
let isPaused = false;
let isOverdue = false;
let currentTimerType = "blue"; // blue for 25 mins, green for 5 mins

const updateTime = () => {
  let hours = Math.floor(time / 3600);
  let minutes = Math.floor((time % 3600) / 60);
  let seconds = time % 60;

  let displayTime = `${hours > 0 ? hours + ":" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
  timerElement.textContent = displayTime;
};

const startTimer = (duration) => {
  isRunning = true;
  isPaused = false;
  isOverdue = false;
  time = duration;
  updateTime();

  timer = setInterval(() => {
    if (!isPaused) {
      time--;
      if (time < 0) {
        isOverdue = true;
        timerElement.classList.add("red-border");
        time = Math.abs(time);
      }
      updateTime();
    }
  }, 1000);
};

timerElement.addEventListener("click", () => {
  if (isRunning && !isPaused) {
    isPaused = true;
  } else if (isRunning && isPaused) {
    isPaused = false;
  } else if (!isRunning) {
    if (isOverdue) {
      currentTimerType = "green";
      document.body.classList.remove("blue");
      document.body.classList.add("green");
      timerElement.classList.remove("red-border");
      startTimer(5 * 60);
    } else {
      currentTimerType = "blue";
      document.body.classList.add("blue");
      startTimer(25 * 60);
    }
  }
});
