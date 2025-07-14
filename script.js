let data = JSON.parse(localStorage.getItem("attendanceData")) || [];

let baseSalary = parseInt(localStorage.getItem("baseSalary")) || 500000;
let otSalary = parseInt(localStorage.getItem("otSalary")) || 300000;

document.getElementById("baseSalaryInput").value = baseSalary;
document.getElementById("otSalaryInput").value = otSalary;

const attendanceList = document.getElementById("attendanceList");
const totalSalaryEl = document.getElementById("totalSalary");
const normalDaysEl = document.getElementById("normalDays"); // phần mới
const otHoursEl = document.getElementById("otHours");       // phần mới

function saveData() {
  localStorage.setItem("attendanceData", JSON.stringify(data));
}

function renderTable() {
  attendanceList.innerHTML = "";
  let total = 0;
  let normalDays = 0;
  let totalOtHours = 0;

  data.forEach((item, index) => {
    const row = document.createElement("tr");

    const salary = calculateSalary(item);
    total += salary;

    // Đếm số ngày thường
    if (item.type === "Thường") {
      normalDays++;
    }

    // Tính giờ tăng ca
    if (item.type === "Tăng ca" && item.start && item.end) {
      const start = new Date(`1970-01-01T${item.start}`);
      const end = new Date(`1970-01-01T${item.end}`);
      const hours = (end - start) / 3600000;
      totalOtHours += Math.max(0, hours);
    }

    row.innerHTML = `
      <td>${item.date}</td>
      <td>${item.type}</td>
      <td>${item.start || "-"}</td>
      <td>${item.end || "-"}</td>
      <td>${salary.toLocaleString()} VND</td>
      <td><button class="delete-btn" onclick="deleteRow(${index})">X</button></td>
    `;
    attendanceList.appendChild(row);
  });

  totalSalaryEl.textContent = total.toLocaleString();
  normalDaysEl.textContent = normalDays;
  otHoursEl.textContent = totalOtHours.toFixed(2);
}

function calculateSalary(item) {
  if (item.type === "Thường") {
    return baseSalary;
  } else if (item.type === "Tăng ca") {
    if (!item.start || !item.end) return 0;
    const start = new Date(`1970-01-01T${item.start}`);
    const end = new Date(`1970-01-01T${item.end}`);
    const diffHours = (end - start) / 3600000;
    return Math.max(0, diffHours * otSalary);
  }
  return 0;
}

function addAttendance() {
  const date = document.getElementById("dateInput").value;
  const type = document.getElementById("typeInput").value;
  const start = document.getElementById("startInput").value;
  const end = document.getElementById("endInput").value;

  if (!date) {
    alert("Vui lòng chọn ngày");
    return;
  }

  // Không cho trùng ngày
  if (data.some(item => item.date === date && item.type === type)) {
    alert("Ngày này đã được chấm công rồi!");
    return;
  }

  const newItem = { date, type, start, end };
  data.push(newItem);
  saveData();
  renderTable();

  // Clear input
  document.getElementById("dateInput").value = "";
  document.getElementById("startInput").value = "";
  document.getElementById("endInput").value = "";
}

function saveSalary() {
  baseSalary = parseInt(document.getElementById("baseSalaryInput").value) || 0;
  otSalary = parseInt(document.getElementById("otSalaryInput").value) || 0;
  localStorage.setItem("baseSalary", baseSalary);
  localStorage.setItem("otSalary", otSalary);
  renderTable();
}

function deleteRow(index) {
  if (confirm("Bạn có chắc chắn muốn xóa?")) {
    data.splice(index, 1);
    saveData();
    renderTable();
  }
}

// 🌙 DARK MODE
document.getElementById('toggle-dark').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('mode', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

window.onload = () => {
  if (localStorage.getItem('mode') === 'dark') {
    document.body.classList.add('dark-mode');
  }
  renderTable();
};
