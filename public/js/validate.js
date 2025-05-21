const validateEmail = (email) => {
  if (!email) return null;
  
  // Chuyển email về chữ thường
  email = String(email).toLowerCase();
  
  // Regex pattern chuẩn cho email
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  // Kiểm tra độ dài tối đa
  if (email.length > 254) return false;
  
  // Kiểm tra phần local (trước @) không quá 64 ký tự
  const localPart = email.split('@')[0];
  if (localPart.length > 64) return false;
  
  // Kiểm tra các trường hợp đặc biệt
  if (email.includes('..')) return false;
  if (email.startsWith('.') || email.endsWith('.')) return false;
  if (email.includes('@.') || email.includes('.@')) return false;
  
  // Kiểm tra với regex pattern
  return emailPattern.test(email);
}

const validatePhone = (phone) => {
  if(!phone) return null;
  // Pattern cho số điện thoại quốc tế
  const intlPattern = /^\+?\d{1,3}[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4,6}$/;
  // Pattern cho số điện thoại Việt Nam
  const vnPattern = /^(0\d{9}|[1-9]\d{8})$/;
  return intlPattern.test(phone) || vnPattern.test(phone.replace(/[-.\s()]/g, ''));
}

const validatePassword = (password) => {
  if(password === "") return null;
  return /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password) &&
    password.length > 4;
}

const validateRePassword = (password, rePassword) => {
  if(rePassword === "") return null;
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

email.addEventListener("input", () => {
  if(email.value === "") {
    email.nextElementSibling.textContent = "Email is required";
    email.nextElementSibling.style.color = "gray";
  } else if(!validateEmail(email.value)) {
    email.nextElementSibling.textContent = "Invalid email";
    email.nextElementSibling.style.color = "red";
  } else {
    email.nextElementSibling.textContent = "";
  }
});

phone.addEventListener("input", () => {
  if(phone.value === "") {
    phone.nextElementSibling.textContent = "Phone is required";
    phone.nextElementSibling.style.color = "gray";
  } else if(!validatePhone(phone.value)) {
    phone.nextElementSibling.textContent = "Invalid phone number";
    phone.nextElementSibling.style.color = "red";
  } else {
    phone.nextElementSibling.textContent = "";
  }
});

password.addEventListener('input', () => {
  if(password.value === "") {
    password.nextElementSibling.textContent = "Password is required";
    password.nextElementSibling.style.color = "gray";
  } else if(!validatePassword(password.value)) {
    password.nextElementSibling.textContent = "Invalid password";
    password.nextElementSibling.style.color = "red";
  } else {
    password.nextElementSibling.textContent = "Valid password";
    password.nextElementSibling.style.color = "green";
  }

  if (!validateRePassword(password.value, checkPassword.value)) {
    checkPassword.nextElementSibling.textContent = "Passwords do not match";
    checkPassword.nextElementSibling.style.color = "red";
  } else {
    checkPassword.nextElementSibling.textContent = "Passwords match";
    checkPassword.nextElementSibling.style.color = "green";
  }
});

checkPassword.addEventListener('input', () => {
  if(checkPassword.value === "") {
    checkPassword.nextElementSibling.textContent = "Confirm password is required";
    checkPassword.nextElementSibling.style.color = "gray";
  } else if(!validateRePassword(password.value, checkPassword.value)) {
    checkPassword.nextElementSibling.textContent = "Passwords do not match";
    checkPassword.nextElementSibling.style.color = "red";
  } else {
    checkPassword.nextElementSibling.textContent = "Passwords match";
    checkPassword.nextElementSibling.style.color = "green";
  }
});
