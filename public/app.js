document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('form[action*="?_method=DELETE"]').forEach(form => {
    form.addEventListener('submit', e => {
      if (!confirm("Are you sure you want to delete this movie?")) {
        e.preventDefault();
      }
    });
  });
});
