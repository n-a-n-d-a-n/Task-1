const dashboardState = {
  userId: null
};

const setLoading = (isLoading) => {
  const overlay = document.querySelector('#dashboard-loading');
  if (!overlay) return;
  overlay.classList.toggle('d-none', !isLoading);
};

const loadProfile = async () => {
  setLoading(true);
  try {
    const data = await apiRequest('/users/me');
    const user = data.user;
    dashboardState.userId = user._id;

    document.querySelector('#welcome-name').textContent = user.name;
    document.querySelector('#profile-name').textContent = user.name;
    document.querySelector('#profile-email').textContent = user.email;
    document.querySelector('#profile-id').textContent = user._id;

    document.querySelector('#update-name').value = user.name;
    document.querySelector('#update-email').value = user.email;
  } catch (error) {
    const alertContainer = document.querySelector('#dashboard-alert');
    showAlert(alertContainer, error.message);
  } finally {
    setLoading(false);
  }
};

const handleUpdate = async (event) => {
  event.preventDefault();

  const alertContainer = document.querySelector('#dashboard-alert');
  const submitButton = document.querySelector('#update-submit');

  const payload = {
    name: document.querySelector('#update-name').value.trim(),
    email: document.querySelector('#update-email').value.trim()
  };

  const newPassword = document.querySelector('#update-password').value;
  if (newPassword) {
    payload.password = newPassword;
  }

  showLoading(submitButton, true);
  alertContainer.innerHTML = '';

  try {
    const data = await apiRequest(`/users/${dashboardState.userId}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });

    showAlert(alertContainer, data.message, 'success');
    document.querySelector('#update-password').value = '';
    await loadProfile();
  } catch (error) {
    showAlert(alertContainer, error.message);
  } finally {
    showLoading(submitButton, false);
  }
};

const handleDelete = async () => {
  const alertContainer = document.querySelector('#dashboard-alert');

  if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) {
    return;
  }

  try {
    await apiRequest(`/users/${dashboardState.userId}`, { method: 'DELETE' });
    clearToken();
    window.location.href = 'register.html';
  } catch (error) {
    showAlert(alertContainer, error.message);
  }
};

const handleLogout = async () => {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error(error);
  } finally {
    clearToken();
    window.location.href = 'login.html';
  }
};

const initDashboard = () => {
  if (!getToken()) {
    window.location.href = 'login.html';
    return;
  }

  document.querySelector('#logout-button').addEventListener('click', handleLogout);
  document.querySelector('#delete-button').addEventListener('click', handleDelete);
  document.querySelector('#update-form').addEventListener('submit', handleUpdate);

  loadProfile();
};

document.addEventListener('DOMContentLoaded', initDashboard);
