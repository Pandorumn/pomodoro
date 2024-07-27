let timerDisplay = document.getElementById("timer-display");
let timerInterval;
let isPaused = false;
let isOverdue = false;
let timerType = "blue"; // 'blue' for 25 min, 'green' for 5 min
let startTime, pausedTime, overdueStartTime;

function formatTime(seconds) {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  let secs = seconds % 60;
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  } else {
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }
}

function updateDisplay(time) {
  timerDisplay.textContent = formatTime(time);
}

function startTimer(duration) {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    let elapsed = Math.floor((Date.now() - startTime) / 1000);
    if (elapsed >= duration) {
      clearInterval(timerInterval);
      isOverdue = true;
      overdueStartTime = Date.now();
      timerDisplay.style.backgroundColor = "blue";
      timerDisplay.classList.add("border-red");
      startStopwatch();
    } else {
      updateDisplay(duration - elapsed);
    }
  }, 1000);
}

function startStopwatch() {
  timerInterval = setInterval(() => {
    let elapsed = Math.floor((Date.now() - overdueStartTime) / 1000);
    timerDisplay.textContent = `+${formatTime(elapsed)}`;
  }, 1000);
}

timerDisplay.addEventListener("click", () => {
  if (isPaused) {
    let pausedDuration = Math.floor((Date.now() - pausedTime) / 1000);
    startTime += pausedDuration * 1000;
    overdueStartTime += pausedDuration * 1000;
    timerDisplay.classList.remove("border-orange");
    timerDisplay.classList.add(isOverdue ? "border-red" : "border-blue");
    isPaused = false;
    if (isOverdue) {
      startStopwatch();
    } else {
      startTimer(timerType === "blue" ? 25 * 60 : 5 * 60);
    }
  } else {
    if (timerInterval) {
      clearInterval(timerInterval);
      pausedTime = Date.now();
      isPaused = true;
      timerDisplay.classList.remove("border-blue", "border-red");
      timerDisplay.classList.add("border-orange");
    } else {
      if (isOverdue) {
        isOverdue = false;
        timerType = timerType === "blue" ? "green" : "blue";
        startTimer(timerType === "blue" ? 25 * 60 : 5 * 60);
        timerDisplay.style.backgroundColor =
          timerType === "blue" ? "blue" : "green";
        timerDisplay.classList.add("border-blue");
      } else {
        startTimer(25 * 60);
        timerDisplay.style.backgroundColor = "blue";
        timerDisplay.classList.add("border-blue");
      }
    }
  }
});
