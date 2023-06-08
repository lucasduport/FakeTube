// Get the form element
const registrationForm = document.querySelector("form");

// Get the input values
const usernameField = document.getElementById("username");
const emailField = document.getElementById("email");
const passwordField = document.getElementById("password");
const passwordConfField = document.getElementById("passwordconf");

// Get the checkbox inputs
const ageCheckbox = document.getElementById("13+");
const agreeCheckbox = document.getElementById("TOS");

// Get the error outputs
const usernameError = document.getElementById("username-error");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const passwordConfError = document.getElementById("passwordconf-error");

// Regex rules
const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{2,}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[/*\-+!@#$^&~\[\]]).{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

usernameField.addEventListener("input", function (event) {
  if (!usernameRegex.test(event.target.value)) {
    usernameError.textContent =
      "Username must begin with a character and be 3 or more alphanumeric characters";
  } else {
    usernameError.textContent = "";
  }
});

emailField.addEventListener("input", function (event) {
  if (!emailRegex.test(event.target.value)) {
    emailError.textContent = "Email must be valid";
  } else {
    emailError.textContent = "";
  }
});

passwordField.addEventListener("input", function (event) {
  if (!passwordRegex.test(event.target.value)) {
    passwordError.textContent =
      "Password must be 8 or more characters and contain at least 1 uppercase letter, 1 number, and 1 of the following special characters: / * - + ! @ # $ ^ & ~ [ ]";
  } else {
    passwordError.textContent = "";
  }
});

passwordConfField.addEventListener("input", function (event) {
  if (passwordField.value !== passwordConfField.value) {
    passwordConfError.textContent = "The two passwords must match";
  } else {
    passwordConfError.textContent = "";
  }
});

// Add an event listener for form submission
registrationForm.addEventListener("submit", function (event) {
  // Prevent the form from submitting
  event.preventDefault();

  // It's the only thing that our middleware doesn't check for
  if (passwordField.value !== passwordConfField.value) return;

  // Submit the form if all validations pass
  registrationForm.submit();
});
