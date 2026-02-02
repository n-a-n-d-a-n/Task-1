const showLoading = (button, isLoading) => {
  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.textContent = 'Please wait...';
    button.disabled = true;
  } else {
    button.textContent = button.dataset.originalText || button.textContent;
    button.disabled = false;
  }
};

const handleRegister = async (event) => {
  event.preventDefault();

  const alertContainer = document.querySelector('#register-alert');
  const submitButton = document.querySelector('#register-submit');

  const payload = {
    name: document.querySelector('#register-name').value.trim(),
    email: document.querySelector('#register-email').value.trim(),
    password: document.querySelector('#register-password').value
  };

  showLoading(submitButton, true);
  alertContainer.innerHTML = '';

  try {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    setToken(data.token);
    window.location.href = 'dashboard.html';
  } catch (error) {
    showAlert(alertContainer, error.message);
  } finally {
    showLoading(submitButton, false);
  }
};

const handleLogin = async (event) => {
  event.preventDefault();

  const alertContainer = document.querySelector('#login-alert');
  const submitButton = document.querySelector('#login-submit');

  const payload = {
    email: document.querySelector('#login-email').value.trim(),
    password: document.querySelector('#login-password').value
  };

  showLoading(submitButton, true);
  alertContainer.innerHTML = '';

  try {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    setToken(data.token);
    window.location.href = 'dashboard.html';
  } catch (error) {
    showAlert(alertContainer, error.message);
  } finally {
    showLoading(submitButton, false);
  }
};

const initAuth = () => {
  if (getToken() && window.location.pathname.includes('login')) {
    window.location.href = 'dashboard.html';
  }

  const registerForm = document.querySelector('#register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }

  const loginForm = document.querySelector('#login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
};

document.addEventListener('DOMContentLoaded', initAuth);
