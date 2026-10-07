// Small enhancement only: mark the current year without adding visual noise.
document.querySelector('.site-footer span').textContent =
  `© ${new Date().getFullYear()} Sangram Ganguly`;
