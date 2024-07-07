const removeFromBasketBtn = document.querySelectorAll('.remove-basket__btn');

const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg, time = 5) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, time * 1000);
};

const handleCart = async (variantId) => {
  try {
    const response = await axios({
      method: 'DELETE',
      url: '/api/v1/baskets/removeFromBasket',
      data: {
        variantId,
      },
    });

    showAlert('success', 'Removed from basket!');
  } catch (err) {
    showAlert('error', 'Something went wrong!');
    // console.error('error', err.response.data.message);
  }
};

removeFromBasketBtn.forEach(el => {
  el.addEventListener('click', () => {
    const variantId = el.dataset.variantid;
    handleCart(variantId);
  });
});
