document.addEventListener('DOMContentLoaded', () => {
  const liElem = document.querySelector('.li_size');
  const productId = document.querySelector('.li-color.selected').dataset.productid;

  const colorButtons = document.querySelectorAll('.li-color');
  let selectedColor =
    document.querySelector('.li-color.selected').dataset.color;

  let selectedSize;
  let sizeButtons;

  const priceDisplay = document.querySelector('.details h4 span');
  const quantityDisplay = document.querySelector('.quantity');

  const updatePrice = async () => {
    try {
      // console.log('selectedColor,selectedSize', selectedColor, selectedSize);
      const response = await axios({
        method: 'GET',
        url: `/api/v1/products/${productId}/price?color=${selectedColor}&size=${selectedSize}`,
      });

      const { price } = response.data.price[0];
      console.log('data', response.data);

      priceDisplay.textContent = `$ ${price}`;
      quantityDisplay.textContent = `Quantity in stock: ${response.data.price[0].qtyInStock}`;
    } catch (error) {
      console.error('Error fetching price:', error);
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
      // console.log(sizes);

      createSizeElements(sizes);
    } catch (error) {
      console.error('Error fetching Size:', error);
    }
  };

  colorButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      colorButtons.forEach(btn => btn.classList.remove('selected'));
      event.target.classList.add('selected');
      selectedColor = event.target.getAttribute('data-color');
      updateSize();
    });
  });
  updateSize();
});
