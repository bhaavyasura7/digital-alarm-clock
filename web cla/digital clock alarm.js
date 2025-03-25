let alarms = [];
let alarmHistory = [];
const maxAlarms = 20;
let currentAlarmIndex = -1;
let currentAlarmData = null;

// Predefined alarm tunes with actual URLs
const alarmTunes = {
  tune1: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
  tune2: 'https://assets.mixkit.co/active_storage/sfx/2868/2868-preview.mp3',
  tune3: 'https://assets.mixkit.co/active_storage/sfx/2867/2867-preview.mp3',
  tune4: 'https://assets.mixkit.co/active_storage/sfx/2866/2866-preview.mp3',
  tune5: 'https://assets.mixkit.co/active_storage/sfx/2865/2865-preview.mp3'
};

// Function to update the clock
function updateClock() {
  const now = new Date();

  // Get time components in 12-hour format
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM'; // Determine AM or PM

  // Convert hours to 12-hour format
  hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

  // Get date components
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const month = months[now.getMonth()];
  const day = now.getDate();
  const year = now.getFullYear();

  // Get day of the week
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayOfWeek = days[now.getDay()];

  // Update the DOM
  document.getElementById('time').textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
  document.getElementById('date').textContent = `${month} ${day}, ${year}`;
  document.getElementById('day').textContent = dayOfWeek;

  // Check if any alarm matches the current time
  alarms.forEach((alarm, index) => {
    const alarmDateTime = new Date(alarm.date + 'T' + alarm.time);
    if (now >= alarmDateTime && !alarm.triggered) {
      playAlarm(alarm, index);
      alarm.triggered = true;
      alarmHistory.push({ ...alarm, triggeredAt: new Date() }); // Add to history
      alarms.splice(index, 1); // Remove from active alarms
      updateAlarmList();
      updateAlarmHistory();
    }
  });

  // Update time remaining for each alarm
  updateTimeRemaining(now);
}

// Function to calculate and display time remaining for each alarm
function updateTimeRemaining(now) {
  alarms.forEach((alarm) => {
    if (!alarm.triggered) {
      const alarmDateTime = new Date(alarm.date + 'T' + alarm.time);
      const timeDiff = alarmDateTime - now; // Difference in milliseconds
      if (timeDiff > 0) {
        const hoursRemaining = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutesRemaining = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const secondsRemaining = Math.floor((timeDiff % (1000 * 60)) / 1000);
        alarm.timeRemaining = `${hoursRemaining}h ${minutesRemaining}m ${secondsRemaining}s`;
      } else {
        alarm.timeRemaining = 'Ringing soon!';
      }
    }
  });

  updateAlarmList();
}

// Function to show toast notification
function showToast(title, message) {
  const toast = document.getElementById('alarmToast');
  document.getElementById('toastTitle').textContent = title;
  document.getElementById('toastMessage').textContent = message;
  toast.classList.add('show');
}

// Function to hide toast notification
function hideToast() {
  const toast = document.getElementById('alarmToast');
  toast.classList.remove('show');
}

// Function to play the alarm tune
function playAlarm(alarm, index) {
  const audio = document.getElementById('alarmAudio');
  const source = document.getElementById('audioSource');

  // Store current alarm data for snooze functionality
  currentAlarmIndex = index;
  currentAlarmData = alarm;

  // Set the audio source to the selected tune
  source.src = alarmTunes[alarm.tune];
  audio.load();

  // Play the alarm sound
  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise.then(() => {
      // Show toast notification
      const alarmLabel = alarm.label;
      showToast(`Alarm: ${alarmLabel}`, `Time: ${alarm.time} - ${alarm.date}`);

      // Stop alarm automatically after 2 minutes if no action
      setTimeout(() => {
        stopAlarm();
      }, 120000);
    }).catch(error => {
      console.error("Error playing alarm sound:", error);
      alert("Error playing alarm sound. Please check your browser settings.");
    });
  }
}

// Function to stop the alarm
function stopAlarm() {
  const audio = document.getElementById('alarmAudio');
  audio.pause();
  audio.currentTime = 0;
  hideToast();
  currentAlarmIndex = -1;
  currentAlarmData = null;
}

// Function to snooze the current alarm
function snoozeCurrentAlarm() {
  if (currentAlarmData) {
    const audio = document.getElementById('alarmAudio');
    audio.pause();
    audio.currentTime = 0;
    hideToast();

    // Create a new alarm with updated time
    const snoozeMinutes = parseInt(currentAlarmData.snooze);
    const alarmDateTime = new Date();
    alarmDateTime.setMinutes(alarmDateTime.getMinutes() + snoozeMinutes);

    const hours = String(alarmDateTime.getHours()).padStart(2, '0');
    const minutes = String(alarmDateTime.getMinutes()).padStart(2, '0');
    const newTime = `${hours}:${minutes}`;

    const year = alarmDateTime.getFullYear();
    const month = String(alarmDateTime.getMonth() + 1).padStart(2, '0');
    const day = String(alarmDateTime.getDate()).padStart(2, '0');
    const newDate = `${year}-${month}-${day}`;

    const newAlarm = {
      ...currentAlarmData,
      time: newTime,
      date: newDate,
      triggered: false,
      timeRemaining: `${snoozeMinutes}m`
    };

    alarms.push(newAlarm);
    updateAlarmList();

    alert(`Alarm snoozed for ${snoozeMinutes} minutes`);

    currentAlarmIndex = -1;
    currentAlarmData = null;
  }
}

// Function to set the alarm
function setAlarm() {
  if (alarms.length >= maxAlarms) {
    alert('Maximum of 20 alarms reached!');
    return;
  }

  const alarmInput = document.getElementById('alarmTime').value;
  const alarmDateInput = document.getElementById('alarmDate').value;
  const tuneInput = document.getElementById('alarmTune').value;
  const snoozeInput = document.getElementById('snoozeTime').value;
  const alarmLabel = document.getElementById('alarmLabel').value;

  if (!alarmInput) {
    alert('Please set a valid time for the alarm.');
    return;
  }
  if (!alarmDateInput) {
    alert('Please set a valid date for the alarm.');
    return;
  }

  // Check if the alarm time is in the past
  const now = new Date();
  const alarmDateTime = new Date(alarmDateInput + 'T' + alarmInput);
  if (alarmDateTime < now) {
    alert('The selected alarm time or date is in the past. Please choose a current time or date.');
    return;
  }
  // Check for duplicate alarms
  const duplicateAlarm = alarms.find(alarm => alarm.time === alarmInput && alarm.date === alarmDateInput);
  if (duplicateAlarm) {
    alert('An alarm is already set for this time . Please choose a different time .');
    return;
  }

  const newAlarm = {
    time: alarmInput,
    date: alarmDateInput,
    label: alarmLabel,
    tune: tuneInput,
    snooze: snoozeInput,
    triggered: false,
    timeRemaining: 'Calculating...',
  };

  alarms.push(newAlarm);
  updateAlarmList();
  alert(`Alarm ${alarmLabel ? `"${alarmLabel}"` : ""} set for ${alarmDateInput} at ${alarmInput} with ${tuneInput} and snooze time of ${snoozeInput} minutes`);
}

// Function to delete an active alarm
function deleteAlarm(index) {
  alarms.splice(index, 1); // Remove the alarm from the active list
  updateAlarmList(); // Update the DOM
}

// Function to reuse an alarm from history
function reuseAlarm(index) {
  const alarm = alarmHistory[index];
  if (alarms.length >= maxAlarms) {
    alert('Maximum of 20 alarms reached!');
    return;
  }

  // Increment the date by one day
  const alarmDateTime = new Date();
  alarmDateTime.setDate(alarmDateTime.getDate() + 1);
  const nextDate = alarmDateTime.toISOString().split('T')[0];

  const newAlarm = {
    time: alarm.time, // Keeps original alarm time
    date: alarmDateTime.toISOString().split('T')[0], // Next day
    label: alarm.label,
    tune: alarm.tune,
    snooze: "1", // Reset snooze to 1 minute
    triggered: false,
    timeRemaining: 'Calculating...',
  };

  alarms.push(newAlarm);
  updateAlarmList();
  alert(`Alarm ${alarm.label ? `"${alarm.label}"` : ""} reused for ${newAlarm.date} at ${newAlarm.time} with ${newAlarm.tune} and snooze time of ${newAlarm.snooze} minutes`);
}

// Function to update the active alarm list in the DOM
function updateAlarmList() {
  const alarmList = document.getElementById('alarmList');

  if (alarms.length === 0) {
    alarmList.innerHTML = '<p style="color: #777; text-align: center;">No active alarms</p>';
    return;
  }

  alarmList.innerHTML = alarms
      .map(
          (alarm, index) => `
              <div>
                  Alarm ${index + 1}: ${alarm.label} ${alarm.date} at ${alarm.time} (${alarm.tune})
                  ⏰ ${alarm.timeRemaining}
                  <br>Snooze: ${alarm.snooze} minutes
                  <button class="delete-button" onclick="deleteAlarm(${index})">Delete</button>
              </div>
              `
      )
      .join('');
}

// Function to update the alarm history in the DOM
function updateAlarmHistory() {
  const alarmHistoryElement = document.getElementById('alarmHistory');

  if (alarmHistory.length === 0) {
    alarmHistoryElement.innerHTML = '<h3>Alarm History</h3><p style="color: #777; text-align: center;">No alarm history</p>';
    return;
  }

  alarmHistoryElement.innerHTML = `
          <h3>Alarm History</h3>
          ${alarmHistory
      .map(
          (alarm, index) => `
                  <div>
                      Alarm ${index + 1}: ${alarm.label} ${alarm.date} at ${alarm.time} (${alarm.tune})
                      ✅ Triggered at ${alarm.triggeredAt.toLocaleTimeString()}
                      <br>Snooze: ${alarm.snooze} minutes
                      <button class="reuse-button" onclick="reuseAlarm(${index})">Reuse</button>
                  </div>
                  `
      )
      .join('')}
          `;
}

// Update the clock every second
setInterval(updateClock, 1000);

// Initialize the clock and alarm lists immediately
updateClock();
updateAlarmList();
updateAlarmHistory();