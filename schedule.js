const calendar = document.getElementById("calendar");
const monthTitle = document.getElementById("monthTitle");

let currentDate = new Date();

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/* -----------------------------
   SHIFT DATA
------------------------------*/
const shifts = {
  "2026-04-01": { assigned: ["You: 9AM–5PM"] },
  "2026-04-02": { assigned: ["You: 10AM–6PM"] },

  "2026-04-03": {
    assigned: ["You: 8AM–4PM"],
    open: [{ id: "w1a", text: "Evening 4PM–8PM" }],
  },

  "2026-04-04": { assigned: ["You: 9AM–3PM"] },

  "2026-04-05": { assigned: ["You: 11AM–7PM"] },
  "2026-04-06": { assigned: ["You: 8AM–2PM"] },
  "2026-04-07": { assigned: ["You: 9AM–5PM"] },

  "2026-04-08": { assigned: ["You: 10AM–6PM"] },

  "2026-04-09": {
    assigned: ["You: 12PM–8PM"],
    open: [{ id: "w2b", text: "Morning 8AM–12PM" }],
  },

  "2026-04-10": {},
  "2026-04-11": {
    open: [{ id: "w2c", text: "Weekend Shift 9AM–1PM" }],
  },

  "2026-04-12": {
    assigned: ["You: 9AM–5PM"],
    open: [{ id: "w3a", text: "Evening 4PM–8PM" }],
  },

  "2026-04-13": { assigned: ["You: 10AM–6PM"] },
  "2026-04-14": { assigned: ["You: 8AM–4PM"] },
  "2026-04-15": { assigned: ["You: 9AM–3PM"] },
  "2026-04-16": { assigned: ["You: 11AM–7PM"] },

  "2026-04-18": {
    open: [{ id: "w3c", text: "Weekend 9AM–1PM" }],
  },

  "2026-04-19": { assigned: ["You: 9AM–5PM"] },
  "2026-04-20": { assigned: ["You: 10AM–6PM"] },
  "2026-04-21": { assigned: ["You: 8AM–4PM"] },
  "2026-04-22": { assigned: ["You: 9AM–12PM"] },

  "2026-04-23": {
    open: [{ id: "w4b", text: "Morning 8AM–12PM" }],
  },

  "2026-04-24": { assigned: ["You: 11AM–7PM"] },

  "2026-04-25": {
    open: [{ id: "w4c", text: "Weekend 9AM–1PM" }],
  },

  "2026-04-27": { assigned: ["You: 12PM–8PM"] },
  "2026-04-29": { assigned: ["You: 9AM–5PM"] },
  "2026-04-30": { assigned: ["You: 10AM–6PM"] },

  "2026-05-01": {
    assigned: ["You: 9AM–5PM"],
    open: [{ id: "m1", text: "Evening 4PM–8PM" }],
  },

  "2026-05-02": { assigned: ["You: 10AM–6PM"] },

  "2026-05-03": {
    open: [{ id: "m3", text: "Weekend Shift 9AM–1PM" }],
  },
};

/* -----------------------------
   HELPERS
------------------------------*/

// Count workdays in a week (baseline tracker only)
function getWorkDaysThisWeek(dateKey) {
  const target = new Date(dateKey);
  const start = new Date(target);
  start.setDate(target.getDate() - target.getDay());

  let count = 0;

  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    if (shifts[key]?.assigned?.length > 0) {
      count++;
    }
  }

  return count;
}

/* -----------------------------
   CLAIM SHIFT
------------------------------*/
function claimShift(dateKey, shiftId) {
  const day = shifts[dateKey];
  if (!day) return;

  day.assigned ??= [];
  day.open ??= [];

  const index = day.open.findIndex((s) => s.id === shiftId);
  if (index === -1) return;

  const shift = day.open.splice(index, 1)[0];
  day.assigned.push(`You: ${shift.text}`);

  renderCalendar();
}

/* -----------------------------
   RENDER CALENDAR
------------------------------*/
function renderCalendar() {
  calendar.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthTitle.textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.classList.add("day");
    empty.style.visibility = "hidden";
    calendar.appendChild(empty);
  }

  for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;

    const box = document.createElement("div");
    box.classList.add("day");

    if (
      dayNum === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      box.classList.add("today");
    }

    const s = shifts[dateKey] || { assigned: [], open: [] };

    let html = `<strong>${dayNum}</strong>`;

    (s.assigned || []).forEach((a) => {
      html += `<div class="shift assigned">${a}</div>`;
    });

    (s.open || []).forEach((o) => {
      html += `
        <div class="shift open">
          ${o.text}
          <button onclick="claimShift('${dateKey}','${o.id}')">Claim</button>
        </div>
      `;
    });

    box.innerHTML = html;
    calendar.appendChild(box);
  }
}

/* -----------------------------
   MONTH SWITCHING
------------------------------*/
document.getElementById("prevMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};

document.getElementById("nextMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};

renderCalendar();
