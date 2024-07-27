const mainContainerEl = document.querySelector("body");
const clickContainerEl = document.getElementById("click-container");
const timerEl = document.getElementById("timer");

const INTERVAL_TYPES = {
  work: "work",
  break: "break",
};

const INTERVALS = {
  [INTERVAL_TYPES.work]: { name: INTERVAL_TYPES.work, duration: 25 * 60 },
  [INTERVAL_TYPES.break]: { name: INTERVAL_TYPES.break, duration: 5 * 60 },
};

const state = {
  intervalType: null,
  timerInterval: null,
  isOverdue: false,
  startedAt: null,
  pausedAt: null,
};

const arr = [
  "work",
  "work paused",
  "work overdue",
  "break",
  "break paused",
  "break overdue",
];

clickContainerEl.addEventListener("click", onClick);

function onClick() {
  const isIntervalActive = !!state.timerInterval;
  const isPaused = !!state.pausedAt;

  if (isPaused) {
    continueInterval();
    return;
  }

  if (!isIntervalActive) {
    startInterval(INTERVALS.work);
    return;
  }

  if (isIntervalActive) {
    if (isOverdue) {
      startInterval(
        state.intervalType === INTERVALS.work ? INTERVALS.break : INTERVALS.work
      );
    } else {
      pauseTimer();
    }
  }
}

function startInterval(intervalType) {
  const interval = INTERVALS[intervalType];

  state.intervalType = intervalType;
  state.isOverdue = false;
  state.startedAt = Date.now();
  state.timerInterval = setInterval(onTick, 1000);

  mainContainerEl.classList.value = interval.name;
}

function startTimer(duration) {
  state.startedAt = Date.now();
  state.timerInterval = setInterval(onTick, 1000);
}

function pauseTimer() {
  clearInterval(state.timerInterval);

  state.pausedAt = Date.now();

  mainContainerEl.classList.add("paused");
}

function continueTimer() {
  state.startedAt += Date.now() - state.pausedAt;
  state.pausedAt = null;

  timerEl.classList.remove("paused");
}

function onTick() {
  const elapsed = Math.floor((Date.now() - state.startedAt) / 1000);

  if (elapsed >= duration) {
    mainContainerEl.classList.add("overdue");
    setDisplayedTime(`+${formatTime(elapsed)}`);
  } else {
    mainContainerEl.classList.remove("overdue");
    setDisplayedTime(formatTime(duration - elapsed));
  }
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  } else {
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }
}

function setDisplayedTime(time) {
  timerEl.textContent = time;
}
