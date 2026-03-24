const API_BASE_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('ssp_token');

const setToken = (token) => {
  localStorage.setItem('ssp_token', token);
};

const clearToken = () => {
  localStorage.removeItem('ssp_token');
};

const apiRequest = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed');
    error.details = data.errors || null;
    throw error;
  }

  return data;
};

const showAlert = (container, message, type = 'danger') => {
  container.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
};


const showLoading = (button, isLoading, loadingText = 'Please wait...') => {
  if (!button) return;
  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.textContent = loadingText;
    button.disabled = true;
  } else {
    button.textContent = button.dataset.originalText || button.textContent;
    button.disabled = false;
  }
};
