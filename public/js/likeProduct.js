const likeBtns = document.querySelectorAll('.like-action__btn');
// const likeBtn = document.querySelectorAll('.like-action__btn');
// const removeLikeBtn = document.querySelectorAll('.likeBtn');
const isLogged = document.querySelector('.user__span').dataset.user;

const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg, time = 1) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, time * 1000);
};

const handleLike = async (btn, isLiked) => {
  const productId = btn.dataset.productid;
  try {
    const url = isLiked ? '/api/v1/likes/unlike' : '/api/v1/likes/like';
    const method = isLiked ? 'DELETE' : 'POST';
    const data = { productId };
    const response = await axios({ method, url, data });
    if (response.data.status === 'success') {
      btn.classList.toggle('likeBtn');
      const msg = isLiked ? 'Removed from wishlist!' : 'Added to wishlist!';
      showAlert('success', msg);
    }
  } catch (err) {
    showAlert('error', 'Something went wrong!');
  }
};

likeBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (isLogged === 'notlogged') {
      showAlert('error', 'You are not logged in!');
      setTimeout(() => location.assign('/login'), 1000);
      return;
    }
    const isLiked = btn.classList.contains('likeBtn');
    handleLike(btn, isLiked);
  });
});
