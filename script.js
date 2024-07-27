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

const initialState = {
  intervalType: null,
  timerInterval: null,
  isOverdue: false,
  startedAt: null,
  pausedAt: null,
};

const state = { ...initialState };

const arr = [
  "work",
  "work paused",
  "work overdue",
  "break",
  "break paused",
  "break overdue",
];

clickContainerEl.addEventListener("click", onClick);
clickContainerEl.addEventListener("contextmenu", onContextMenu);

function onClick() {
  const isIntervalActive = !!state.timerInterval;
  const isPaused = !!state.pausedAt;

  if (isPaused) {
    continueTimer();
    return;
  }

  if (!isIntervalActive) {
    startInterval(INTERVALS.work);
    return;
  }

  if (isIntervalActive) {
    if (state.isOverdue) {
      startInterval(
        state.intervalType === INTERVAL_TYPES.work
          ? INTERVALS.break
          : INTERVALS.work
      );
    } else {
      pauseTimer();
    }
  }
}

function onContextMenu(e) {
  e.preventDefault();

  if (state.intervalType === INTERVAL_TYPES.work) {
    startInterval(INTERVALS.break);
    return;
  }
  if (state.intervalType === INTERVAL_TYPES.break) {
    startInterval(INTERVALS.work);
    return;
  }
}

function startInterval(interval) {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
  }

  Object.assign(state, initialState);
  state.intervalType = interval.name;
  state.startedAt = Date.now();
  state.timerInterval = setInterval(onTick, 1000);

  mainContainerEl.classList.value = interval.name;
  setDisplayedTime(formatTime(interval.duration));
}

function pauseTimer() {
  clearInterval(state.timerInterval);
  state.timerInterval = null;

  state.pausedAt = Date.now();

  mainContainerEl.classList.add("paused");
}

function continueTimer() {
  state.startedAt += Date.now() - state.pausedAt;
  state.pausedAt = null;
  state.timerInterval = setInterval(onTick, 1000);
  mainContainerEl.classList.remove("paused");
}

function onTick() {
  const elapsed = Math.floor((Date.now() - state.startedAt) / 1000);
  const intervalDuration = INTERVALS[state.intervalType].duration;

  state.isOverdue = elapsed > intervalDuration;

  if (state.isOverdue) {
    mainContainerEl.classList.add("overdue");
    setDisplayedTime(`+${formatTime(elapsed - intervalDuration)}`);
  } else {
    mainContainerEl.classList.remove("overdue");
    setDisplayedTime(formatTime(intervalDuration - elapsed));
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
