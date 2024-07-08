const removeFromBasketBtn = document.querySelectorAll('.remove-basket__btn');
const totalPriceBtn = document.querySelector('.totalPrice');
const emptyPage = document.querySelector('.empty-page');

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

const fetchPrice = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/baskets/myBasketTotalPrice',
    });
    totalPriceBtn.innerHTML = `Total Price: $${res.data.totalPrice}`;
  } catch (err) {
    showAlert('error', 'Something went wrong!');
    console.log(err);
  }
};

const handleCart = async (variantId) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: '/api/v1/baskets/removeFromBasket',
      data: {
        variantId,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Removed from basket!');
      fetchPrice();
      window.setTimeout(() => {
        location.assign('/myBasket');
      }, 1500);
    }
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

if (!emptyPage) fetchPrice();
