const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const passwordConfirm = document.getElementById("passwordConfirm");
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const usernameValue = username.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();

  const usernameError = document.getElementById("usernameError");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const passwordConfirmError = document.getElementById("passwordConfirmError");

  const ErrorFromApi = document.getElementById("error-fromApi");

  let hasError = false;

  if (!usernameValue) {
    usernameError.textContent = "Username is required";
    hasError = true;
  } else if (!/^[a-zA-Z]+[0-9a-zA-Z]{4,14}[a-zA-Z]+$/.test(usernameValue)) {
    usernameError.textContent =
      "Username must consist of 5 to 15 characters, only letters and numbers are allowed, with no numbers at the beginning or the end";
    hasError = true;
    usernameError.style.display = "block";
  } else {
    usernameError.textContent = "";
  }

  if (!emailValue) {
    emailError.textContent = "Email is required";
    hasError = true;
  } else if (
    !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailValue)
  ) {
    emailError.textContent = "Email must be in a valid format";
    hasError = true;
    emailError.style.display = "block";
  } else {
    emailError.textContent = "";
  }

  if (!passwordValue) {
    passwordError.textContent = "Password is required";
    hasError = true;
  } else if (passwordValue.length < 8) {
    passwordError.textContent = "Password must be at least 8 characters";
    hasError = true;
    passwordError.style.display = "block";
  } else {
    passwordError.textContent = "";
  }

  if (!passwordConfirm.value.trim()) {
    passwordConfirmError.textContent = "Password confirmation is required";
    hasError = true;
  } else if (passwordValue !== passwordConfirm.value.trim()) {
    passwordConfirmError.textContent = "Password confirmation does not match";
    hasError = true;
    passwordError.style.display = "block";
  } else {
    passwordConfirmError.textContent = "";
  }

  if (!hasError) {
    // Send data to API
    const data = {
      username: usernameValue,
      email: emailValue,
      password: passwordValue,
      password_confirmation: passwordConfirm.value.trim(),
    };
    fetch("https://goldblv.com/api/hiring/tasks/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        console.log(response.json());
        return response.json();
      })
      .then((data) => {
        // Display API validation errors
        if (data.errors) {
          for (const error in data.errors) {
            if (error === "username") {
              usernameError.textContent = data.errors[error][0];
            } else if (error === "email") {
              emailError.textContent = data.errors[error][0];
            } else if (error === "password") {
              passwordError.textContent = data.errors[error][0];
            }
          }
        } else {
          // Redirect to logged in page
          sessionStorage.setItem("email", emailValue);
          window.location.href = "loggedPage.html";
        }
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
        ErrorFromApi.textContent = error.message + " " + "please try agin";
        ErrorFromApi.style.display = "block";
      });
  }
});
