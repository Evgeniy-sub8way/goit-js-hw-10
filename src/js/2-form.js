const formData = {
  email: '',
  message: '',
};

const KEY_STORAGE = 'feedback-form-state';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.feedback-form');

  form.addEventListener('input', e => {
    formData[e.target.name] = e.target.value.trim();
    localStorage.setItem(KEY_STORAGE, JSON.stringify(formData));
  });

  const saved = JSON.parse(localStorage.getItem(KEY_STORAGE));
  if (saved) {
    formData.email = saved.email || '';
    formData.message = saved.message || '';
    form.elements.email.value = formData.email;
    form.elements.message.value = formData.message;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!formData.email || !formData.message) {
      alert('Fill please all fields');
      return;
    }
    console.log(formData);
    localStorage.removeItem(KEY_STORAGE);
    formData.email = '';
    formData.message = '';
    form.reset();
  });
});
