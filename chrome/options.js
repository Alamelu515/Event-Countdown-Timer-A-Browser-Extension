document.addEventListener("DOMContentLoaded", function () {
  const eventForm = document.getElementById("eventForm");
  const eventList = document.getElementById("eventList");

  function renderEvents() {
    chrome.storage.sync.get(["events"], function (result) {
      const events = result.events || [];
      eventList.innerHTML = "";

      events.forEach((event, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${event.name} - ${new Date(
          event.date
        ).toLocaleDateString()}</span>
                                <button data-index="${index}">Delete</button>`;
        eventList.appendChild(li);
      });
    });
  }

  eventForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const eventName = document.getElementById("eventName").value;
    const eventDate = document.getElementById("eventDate").value;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight for comparison
    const selectedDate = new Date(eventDate);
    selectedDate.setHours(0, 0, 0, 0); // Set time to midnight for comparison

    if (selectedDate < today) {
      alert("Cannot add an event for a past date.");
      return;
    }

    if (selectedDate.getTime() === today.getTime()) {
      alert(
        "The event is today and there are 0 days left for it. Hence, it requires no further action, and it shall not be added to the list."
      );
      return;
    }

    chrome.storage.sync.get(["events"], function (result) {
      const events = result.events || [];
      events.push({ name: eventName, date: eventDate });
      chrome.storage.sync.set({ events: events }, function () {
        eventForm.reset();
        renderEvents();
      });
    });
  });

  eventList.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON") {
      const index = e.target.getAttribute("data-index");
      chrome.storage.sync.get(["events"], function (result) {
        const events = result.events || [];
        events.splice(index, 1);
        chrome.storage.sync.set({ events: events }, function () {
          renderEvents();
        });
      });
    }
  });

  renderEvents();
});
