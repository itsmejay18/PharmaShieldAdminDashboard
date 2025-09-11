// Login Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const deviceBindingCheckbox = document.getElementById('deviceBinding');
  const deviceCodeGroup = document.querySelector('.device-code-group');
  const deviceCodeInput = document.getElementById('deviceCode');

  // Check if already logged in
  if (sessionStorage.getItem('pharmashield_logged_in')) {
    window.location.href = '../dashboard/dashboard.html';
  }

  // Handle device binding checkbox
  deviceBindingCheckbox.addEventListener('change', function() {
    if (this.checked) {
      deviceCodeGroup.style.display = 'block';
      deviceCodeInput.required = true;
      // Auto-generate a demo device code
      deviceCodeInput.value = 'DEV-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    } else {
      deviceCodeGroup.style.display = 'none';
      deviceCodeInput.required = false;
      deviceCodeInput.value = '';
    }
  });

  // Handle form submission
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const deviceCode = deviceCodeInput.value.trim();
    
    // Remove any existing error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    // Validate credentials against dummy data
    if (username === ADMIN_CRED.username && password === ADMIN_CRED.password) {
      // If device binding is enabled, validate device code
      if (deviceBindingCheckbox.checked && !deviceCode) {
        showError('Device code is required when device binding is enabled.');
        return;
      }

      // Show loading state
      loginForm.classList.add('loading');

      // Simulate login delay
      setTimeout(() => {
        // Store login state
        sessionStorage.setItem('pharmashield_logged_in', 'true');
        sessionStorage.setItem('pharmashield_user', JSON.stringify({
          username: username,
          loginTime: new Date().toISOString(),
          deviceBound: deviceBindingCheckbox.checked,
          deviceCode: deviceCode || null
        }));

        // Redirect to dashboard
        window.location.href = '../dashboard/dashboard.html';
      }, 1500);

    } else {
      showError('Invalid username or password. Please check your credentials and try again.');
    }
  });

  function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    errorDiv.style.display = 'block';
    
    loginForm.insertBefore(errorDiv, loginForm.firstChild);

    // Remove error after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 5000);
  }

  // Auto-fill demo credentials for convenience
  usernameInput.value = 'admin';
  passwordInput.value = 'pharmashield123';

  // Add enter key support for better UX
  document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !loginForm.classList.contains('loading')) {
      loginForm.dispatchEvent(new Event('submit'));
    }
  });
});