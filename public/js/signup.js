const signupForm = document.querySelector('.form--signup');
import { hideAlert, showAlert } from './alert';

const signup = async (
  firstName,
  lastName,
  emailAddress,
  password,
  passwordConfirm,
) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        firstName,
        lastName,
        emailAddress,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      // showAlert('success', 'Logged in successfully!');
      console.log('success', 'registered in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log('error', err.response.data.message);
  }
};

if (signupForm)
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const emailAddress = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup(firstName, lastName, emailAddress, password, passwordConfirm);
  });
