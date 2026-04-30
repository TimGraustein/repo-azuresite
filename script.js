// Show / Hide Password (pure UI)
const togglePassword = document.getElementById("togglePassword");
const passwordField = document.getElementById("password");

togglePassword.addEventListener("click", () => {
  const type = passwordField.getAttribute("type");

  if (type === "password") {
    passwordField.setAttribute("type", "text");
    togglePassword.src = "images/eyeclosed.png";
  } else {
    passwordField.setAttribute("type", "password");
    togglePassword.src = "images/eye.png";
  }
});

document.getElementById("loginBtn").addEventListener("click", () => {
  window.location.href = "schedule.html";
});
