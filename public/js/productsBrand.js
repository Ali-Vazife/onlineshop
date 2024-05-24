const allBrands = document.querySelectorAll('.brand-li');

function renderProducts(productsArr) {
  let productContainer = document.querySelector('.product-list');
  productContainer.innerHTML = ''

  productsArr.forEach(p => {
    const productItem = document.createElement('li');
    productItem.classList.add('product-item');

    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.setAttribute('tabindex', '0');

    const cardBanner = document.createElement('figure');
    cardBanner.classList.add('card-banner');

    const img = document.createElement('img');
    img.classList.add('image-contain');
    img.src = `/images/${p.imagecover}`;
    img.width = 312;
    img.height = 350;
    img.loading = 'lazy';
    img.alt = p.name;

    const cardActionList = document.createElement('ul');
    cardActionList.classList.add('card-action-list');

    const actions = [
      { name: 'cart-outline', label: 'Add to Cart' },
      { name: 'heart-outline', label: 'Add to Wishlist' },
      { name: 'eye-outline', label: 'Quick View' },
      { name: 'repeat-outline', label: 'Compare' },
    ];

    actions.forEach((action, index) => {
      const actionItem = document.createElement('li');
      actionItem.classList.add('card-action-item');

      const actionBtn = document.createElement('button');
      actionBtn.classList.add('card-action-btn');
      actionBtn.setAttribute('aria-labelledby', `card-label-${index + 1}`);

      const ionIcon = document.createElement('ion-icon');
      ionIcon.setAttribute('name', action.name);

      const actionLabel = document.createElement('div');
      actionLabel.id = `card-label-${index + 1}`;
      actionLabel.classList.add('card-action-tooltip');
      actionLabel.textContent = action.label;

      actionBtn.appendChild(ionIcon);
      actionItem.appendChild(actionBtn);
      actionItem.appendChild(actionLabel);
      cardActionList.appendChild(actionItem);
    });

    cardBanner.appendChild(img);
    cardBanner.appendChild(cardActionList);

    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');

    const cardCat = document.createElement('div');
    cardCat.classList.add('card-cat');

    const genderLink = document.createElement('a');
    genderLink.classList.add('card-cat-link');
    genderLink.href = `/productsGender/${p.genderid}`;
    genderLink.textContent = p.gendername;

    const brandLink = document.createElement('a');
    brandLink.classList.add('card-cat-link');
    brandLink.href = `/productsBrand/${p.brandid}`;
    brandLink.textContent = p.brandname;

    cardCat.appendChild(genderLink);
    cardCat.appendChild(brandLink);

    const cardTitle = document.createElement('h3');
    cardTitle.classList.add('h3', 'card-title');

    const titleLink = document.createElement('a');
    titleLink.href = `/products/${p.id}`;
    titleLink.textContent = p.name;

    cardTitle.appendChild(titleLink);

    const cardPrice = document.createElement('data');
    cardPrice.classList.add('card-price');
    cardPrice.textContent =
      p.minPrice === p.maxPrice
        ? `$ ${p.minPrice}`
        : `$ ${p.minPrice} - ${p.maxPrice}`;

    cardContent.appendChild(cardCat);
    cardContent.appendChild(cardTitle);
    cardContent.appendChild(cardPrice);

    productCard.appendChild(cardBanner);
    productCard.appendChild(cardContent);

    productItem.appendChild(productCard);
    productContainer.appendChild(productItem);
  });
}

async function fetchProducts(brandId, typeOfFilter) {
  try {
    const url =
      typeOfFilter === 'all'
        ? `/productsSelectedAllBrands`
        : `/productsSelectedBrand?brandId=${brandId}`;

    const response = await fetch(url);
    const products = await response.json();
    // const productsArr = products.products;
    console.log(products.products);
    renderProducts(products.products);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

allBrands.forEach((el) => {
  el.addEventListener('click', (event) => {
    let { brandId } = event.target.dataset;
    let typeOfFilter = brandId === 'allBrands' ? 'all' : brandId;
    console.log(typeOfFilter);
    fetchProducts(brandId, typeOfFilter);
  });
});
