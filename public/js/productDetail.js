document.addEventListener('DOMContentLoaded', () => {
  const liElem = document.querySelector('.li_size');
  let colorBtn = document.querySelector('.li-color.selected');
  const productId = colorBtn.dataset.productid;
  const cartBtn = document.querySelector('.addRemoveCart');
  const isLogged = document.querySelector('.user__span').dataset.user;

  const colorButtons = document.querySelectorAll('.li-color');
  let selectedColor =
    document.querySelector('.li-color.selected').dataset.color;

  let selectedSize;
  let sizeButtons;

  const priceDisplay = document.querySelector('.details h4 span');
  const quantityDisplay = document.querySelector('.quantity');

  const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
  };

  const showAlert = (type, msg, time = 1.7) => {
    hideAlert();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, time * 1000);
  };

  const handleBasketBtn = async (variantId) => {
    const addToBasketBtn = document.querySelector('.addRemoveCart');
    try {
      const response = await axios({
        method: 'GET',
        url: `/api/v1/baskets/isInTheBasket/${variantId}`,
      });

      if (response.data.data === 'y') {
        addToBasketBtn.classList.add('addedToBasket');
        addToBasketBtn.innerHTML = 'Remove from basket';
      } else if (response.data.data === 'n') {
        addToBasketBtn.classList.remove('addedToBasket');
        addToBasketBtn.innerHTML = 'Add to basket';
      }
    } catch (err) {
      showAlert('error', err);
      // console.error('Error fetching price:', err);
    }
  };

  const updatePrice = async () => {
    try {
      colorBtn = document.querySelector('.selected');
      // console.log('selectedColor,selectedSize', selectedColor, selectedSize);
      const response = await axios({
        method: 'GET',
        url: `/api/v1/products/${productId}/price?color=${selectedColor}&size=${selectedSize}`,
      });

      const { price, id } = response.data.price[0];
      priceDisplay.textContent = `$ ${price}`;
      colorBtn.setAttribute('data-variantId', id);
      quantityDisplay.textContent = `Quantity in stock: ${response.data.price[0].qtyInStock}`;

      if (isLogged !== 'notlogged') {
        handleBasketBtn(id);
      }
    } catch (err) {
      showAlert('error', 'Error fetching price');
      // console.error('Error fetching price:', err);
    }
  };

  function createSizeElements(sizes) {
    liElem.innerHTML = '';

    sizes.forEach(size => {
      const button = document.createElement('button');
      button.id = 'productsize_' + size;
      button.className = 'li-size size';
      button.setAttribute('data-size', size);
      button.textContent = size;
      if (sizes[0] === size) {
        button.classList.add('selected');
        selectedSize = sizes[0];
      }

      liElem.appendChild(button);
    });

    sizeButtons = document.querySelectorAll('.li-size');
    sizeButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        sizeButtons.forEach(btn => btn.classList.remove('selected'));
        event.target.classList.add('selected');
        selectedSize = event.target.getAttribute('data-size');
        updatePrice();
      });
    });

    updatePrice(selectedSize);
  }

  const updateSize = async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: `/api/v1/products/${productId}/size?color=${selectedColor}`,
      });
      const { sizes } = response.data;

      createSizeElements(sizes);
    } catch (error) {
      showAlert('error', 'Error fetching Size:');
      // console.error('Error fetching Size:', error);
    }
  };

  colorButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      colorButtons.forEach(btn => btn.classList.remove('selected'));
      event.target.classList.add('selected');
      selectedColor = event.target.getAttribute('data-color');
      colorBtn = document.querySelector('.selected');
      updateSize();
    });
  });

  const handleCart = async (isAdded) => {
    try {
      const url = isAdded
        ? '/api/v1/baskets/removeFromBasket'
        : '/api/v1/baskets/addToBasket';
      const variantId =
        document.querySelector('.li-color.selected').dataset.variantid;
      const method = isAdded ? 'DELETE' : 'POST';
      const data = { variantId };
      const response = await axios({ method, url, data });
      if (response.data.status === 'success') {
        cartBtn.classList.toggle('addedToBasket');
        isAdded
          ? (cartBtn.innerHTML = 'Add to basket')
          : (cartBtn.innerHTML = 'Remove from basket');
        const msg = isAdded ? 'Removed from basket!' : 'Added to basket!';
        showAlert('success', msg);
      }
    } catch (err) {
      showAlert('error', err.response.data.message);
      // console.error('error', err.response.data.message);
    }
  };

  cartBtn.addEventListener('click', () => {
    const isAdded = cartBtn.classList.contains('addedToBasket');
    handleCart(isAdded);
  });

  updateSize();
});
