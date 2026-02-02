const initHome = () => {
  const ctaButton = document.querySelector('#cta-button');
  if (!ctaButton) {
    return;
  }

  if (getToken()) {
    ctaButton.textContent = 'Go to Dashboard';
    ctaButton.href = 'dashboard.html';
  }
};

document.addEventListener('DOMContentLoaded', initHome);
