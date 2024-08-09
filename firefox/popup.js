document.addEventListener("DOMContentLoaded", function () {
  const countdownsDiv = document.getElementById("countdowns");
  const optionsButton = document.getElementById("options");

  function updateCountdowns() {
    chrome.storage.sync.get(["events"], function (result) {
      let events = result.events || [];
      const now = new Date();
      //now.setHours(0, 0, 0, 0); // Set the current time to midnight to compare only the date

      // Filter out past events based on date
      events = events.filter((event) => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0); // Set event time to midnight to compare only the date
        return eventDate >= now;
      });

      countdownsDiv.innerHTML = "";

      events.forEach((event) => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0); // Set the event date to midnight

        const timeLeft = eventDate.getTime() - now.getTime(); // Calculate time difference from midnight of event date
        const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hoursLeft = Math.floor(
          (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutesLeft = Math.floor(
          (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
        );
        const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);

        const eventDiv = document.createElement("div");
        eventDiv.className = "event";
        eventDiv.innerHTML = `<strong>${event.name}</strong>: ${daysLeft} days, ${hoursLeft} hrs, ${minutesLeft} mins, ${secondsLeft} secs left`;
        countdownsDiv.appendChild(eventDiv);
      });

      // Update storage with only upcoming events
      chrome.storage.sync.set({ events: events });
    });
  }

  optionsButton.addEventListener("click", function () {
    chrome.runtime.openOptionsPage();
  });

  updateCountdowns();
  // Refresh countdown every second
  setInterval(updateCountdowns, 1000);
});
