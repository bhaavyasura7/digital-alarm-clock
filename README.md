# digital-alarm-clock
This a Digital Clock application with Alarm History we can reuse(that means for next 24 hrs). It includes a digital clock that displays the current time, date, and day. Users can set alarms with additional options like selecting a name, date, tune, and snooze duration.

Features:

Clock Display: 
	Shows the real-time clock with hours, minutes, seconds, AM/PM, current date, and day of the week.

Alarm Setup:

	Users can set an alarm by selecting a time and an optional label.
	They can choose a date (useful for one-time alarms).
	Different alarm tunes are available.
	A snooze duration can be set (from 1 to 15 minutes).

Alarm List & History:
	
	The Active Alarms List displays currently set alarms, they have option to delete.
	The Alarm History records past alarms that have been triggered. We have another option in the alarm history, that the alarm can be reused for next one day.

Toast Notification:

	When an alarm rings, a toast popup appears with the alarm title and message.
	The user can choose to stop or snooze the alarm.

Audio Alarm:
	
	An <audio> element plays the selected alarm tune when the alarm goes off.
	The audio source changes dynamically based on the selected tune.
