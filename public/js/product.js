document.addEventListener('DOMContentLoaded', () => {
  const liElem = document.querySelector('.li_size');

  const colorOptions = document.querySelectorAll('.li-color__label');
  let sizeOptions;

  let selectedColor = colorOptions[0].textContent;
  let selectedSize;

  const priceDisplay = document.querySelector('.details h4 span');

  const updatePrice = async () => {
    try {
      console.log('DUO:', selectedColor, selectedSize);
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
      console.log('adwdwawa', sizeOptions);
    });

    sizeOptions = document.querySelectorAll('.li_size__label');
    sizeOptions.forEach(el => {
      el.addEventListener('click', (event) => {
        console.log('tap');
        selectedSize = event.target.innerHTML;
        console.log('selectedSize', selectedSize);
        updatePrice();
      });
    });

    updatePrice(selectedSize);
  };

  const updateSize = async () => {
    try {
      const response = await fetch(`/products/1/size?color=${selectedColor}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      createSizeElements(data.sizes);
    } catch (error) {
      console.error('Error fetching Size:', error);
    }
  };

  colorOptions.forEach(el => {
    el.addEventListener('click', (event) => {
      selectedColor = event.target.innerHTML;
      updateSize();
    });
  });

  updateSize();
});
