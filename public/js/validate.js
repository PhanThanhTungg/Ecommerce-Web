const validateEmail = (email) => {
  if (!email) return null;
  email = String(email).toLowerCase();
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (email.length > 254) return false;
  const localPart = email.split('@')[0];
  if (localPart.length > 64) return false;
  if (email.includes('..')) return false;
  if (email.startsWith('.') || email.endsWith('.')) return false;
  if (email.includes('@.') || email.includes('.@')) return false;
  return emailPattern.test(email);
}

const validatePhone = (phone) => {
  if (!phone) return null;
  const intlPattern = /^\+?\d{1,3}[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4,6}$/;
  const vnPattern = /^(0\d{9}|[1-9]\d{8})$/;
  return intlPattern.test(phone) || vnPattern.test(phone.replace(/[-.\s()]/g, ''));
}

const hasUppercase = (password) => /[A-Z]/.test(password);
const hasLowercase = (password) => /[a-z]/.test(password);
const hasNumber = (password) => /[0-9]/.test(password);
const hasSpecialChar = (password) => /[^A-Za-z0-9]/.test(password);
const hasMinLength = (password) => password.length >= 8;

const validateRePassword = (password, rePassword) => {
  if (rePassword === "") return null;
  return password === rePassword;
}

const email = document.getElementById("email");
const phone = document.getElementById("phone");
const password = document.getElementById("password");
const checkPassword = document.getElementById("check-password");
const emailNotice = document.querySelector("#email ~ .notice");
const phoneNotice = document.querySelector("#phone ~ .notice");
const passwordNotice = document.querySelector("#password ~ .notice");
const checkPasswordNotice = document.querySelector("#check-password ~ .notice");

// Toggle password visibility
const togglePassword = document.getElementById("toggle-password");
const toggleCheckPassword = document.getElementById("toggle-check-password");

email.addEventListener("input", () => {
  if (email.value === "") {
    email.nextElementSibling.textContent = "Email is required";
    email.nextElementSibling.style.color = "gray";
  } else if (!validateEmail(email.value)) {
    email.nextElementSibling.textContent = "Invalid email";
    email.nextElementSibling.style.color = "red";
  } else {
    email.nextElementSibling.textContent = "";
  }
});

phone.addEventListener("input", () => {
  if (phone.value === "") {
    phone.nextElementSibling.textContent = "Phone is required";
    phone.nextElementSibling.style.color = "gray";
  } else if (!validatePhone(phone.value)) {
    phone.nextElementSibling.textContent = "Invalid phone number";
    phone.nextElementSibling.style.color = "red";
  } else {
    phone.nextElementSibling.textContent = "";
  }
});

password.addEventListener('input', () => {
  if (password.value === "") {
    password.nextElementSibling.textContent = "Password is required";
    password.nextElementSibling.style.color = "gray";
  } else if (!hasLowercase(password.value)) {
    password.nextElementSibling.textContent = "Password must contain at least 1 lowercase letter";
    password.nextElementSibling.style.color = "red";
  } else if (!hasUppercase(password.value)) {
    password.nextElementSibling.textContent = "Password must contain at least 1 uppercase letter";
    password.nextElementSibling.style.color = "red";
  } else if (!hasNumber(password.value)) {
    password.nextElementSibling.textContent = "Password must contain at least 1 number";
    password.nextElementSibling.style.color = "red";
  } else if (!hasSpecialChar(password.value)) {
    password.nextElementSibling.textContent = "Password must contain at least 1 special character";
    password.nextElementSibling.style.color = "red";
  } else if (!hasMinLength(password.value)) {
    password.nextElementSibling.textContent = "Password must be at least 8 characters long";
    password.nextElementSibling.style.color = "red";
  } else {
    password.nextElementSibling.textContent = "Valid password";
    password.nextElementSibling.style.color = "green";
  }

  if (checkPassword.value !== "") {
    if (!validateRePassword(password.value, checkPassword.value)) {
      checkPassword.nextElementSibling.textContent = "Passwords do not match";
      checkPassword.nextElementSibling.style.color = "red";
    } else {
      checkPassword.nextElementSibling.textContent = "Passwords match";
      checkPassword.nextElementSibling.style.color = "green";
    }
  }
});

checkPassword.addEventListener('input', () => {
  if (checkPassword.value === "") {
    checkPassword.nextElementSibling.textContent = "Confirm password is required";
    checkPassword.nextElementSibling.style.color = "gray";
  } else if (!validateRePassword(password.value, checkPassword.value)) {
    checkPassword.nextElementSibling.textContent = "Passwords do not match";
    checkPassword.nextElementSibling.style.color = "red";
  } else {
    checkPassword.nextElementSibling.textContent = "Passwords match";
    checkPassword.nextElementSibling.style.color = "green";
  }
});

// Toggle password visibility functions
togglePassword.addEventListener('click', () => {
  const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
  password.setAttribute('type', type);
  
  // Toggle icon
  if (type === 'text') {
    togglePassword.classList.remove('fa-eye-slash');
    togglePassword.classList.add('fa-eye');
  } else {
    togglePassword.classList.remove('fa-eye');
    togglePassword.classList.add('fa-eye-slash');
  }
});

toggleCheckPassword.addEventListener('click', () => {
  const type = checkPassword.getAttribute('type') === 'password' ? 'text' : 'password';
  checkPassword.setAttribute('type', type);
  
  // Toggle icon
  if (type === 'text') {
    toggleCheckPassword.classList.remove('fa-eye-slash');
    toggleCheckPassword.classList.add('fa-eye');
  } else {
    toggleCheckPassword.classList.remove('fa-eye');
    toggleCheckPassword.classList.add('fa-eye-slash');
  }
});
