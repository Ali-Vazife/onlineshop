const loginForm = document.querySelector('.form--login');
// const { hideAlert, showAlert } = require('./alert');

const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
const showAlert = (type, msg, time = 5) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, time * 1000);
};

const login = async (emailAddress, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        emailAddress,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      // console.log('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    // console.log('error', err.response.data.message);
  }
};

if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const emailAddress = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(emailAddress, password);
  });
