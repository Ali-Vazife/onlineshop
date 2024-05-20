document.addEventListener('DOMContentLoaded', () => {
  const colorOptions = document.querySelectorAll('.color');
  const sizeOptions = document.querySelectorAll('.size');
  const priceDisplay = document.querySelector('.details h4 span');
  let selectedColor = "#{defaultVariant.Attributes.find(attr => attr.type === 'color').value}";
  let selectedSize = "#{defaultVariant.Attributes.find(attr => attr.type === 'size').value}";

  const updatePrice = async () => {
    try {
      const response = await fetch(`/product/${product.id}/price?color=${selectedColor}&size=${selectedSize}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      priceDisplay.textContent = `$${data.price}`;
    } catch (error) {
      console.error('Error fetching price:', error);
    }
  };

  colorOptions.forEach(option => {
    option.addEventListener('click', (event) => {
      selectedColor = event.target.getAttribute('data-color');
      updatePrice();
    });
  });

  sizeOptions.forEach(option => {
    option.addEventListener('click', (event) => {
      selectedSize = event.target.getAttribute('data-size');
      updatePrice();
    });
  });
});