document.addEventListener('DOMContentLoaded', () => {
  const liElem = document.querySelector('.li_size');

  const colorOptions = document.querySelectorAll('.li-color__label');
  const sizeOptions = document.querySelectorAll('.size');

  let selectedColor = colorOptions[0].textContent;
  let selectedSize;

  const priceDisplay = document.querySelector('.details h4 span');

  const updatePrice = async () => {
    try {
      const response = await fetch(
        `/products/1/price?color=${selectedColor}&size=${selectedSize}`,
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      priceDisplay.textContent = `$${data.price}`;
    } catch (error) {
      console.error('Error fetching price:', error);
    }
  };

  function createSizeElements(sizes) {
    liElem.innerHTML = '';
    console.log(sizes[0]);
    sizes.forEach(size => {
      // Create input element
      const input = document.createElement('input');
      input.id = 'productsize_' + size;
      input.className = 'li-size size';
      input.setAttribute('data-size', size);
      input.type = 'radio';
      input.name = 'product_size';
      input.value = size;
      if (sizes[0] === size) {
        input.setAttribute('checked', true);
        selectedSize = sizes[0];
      }
      // Create label element
      const label = document.createElement('label');
      label.className = 'li_size__label';
      label.setAttribute('for', input.id);
      label.textContent = size;

      // Append input and label to the liElem
      liElem.appendChild(input);
      liElem.appendChild(label);
      updatePrice(selectedSize);
    });
  };

  const updateSize = async () => {
    try {
      const response = await fetch(`/products/1/size?color=${selectedColor}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      createSizeElements(data.sizes);
    } catch (error) {
      console.error('Error fetching Size:', error);
    }
  };

  colorOptions.forEach(el => {
    el.addEventListener('click', (event) => {
      console.log('---------------!!!!!-------------');
      selectedColor = event.target.innerHTML;
      updateSize();
    });
  });

  sizeOptions.forEach(el => {
    el.addEventListener('click', (event) => {
      selectedSize = event.target.innerHTML;
      updatePrice();
    });
  });

  updateSize();
});
