let likeBtns = document.querySelectorAll('.like-action__btn');
const allBrands = document.querySelectorAll('.brand-li');
const isLogged = document.querySelector('.user__span').dataset.user;

const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
const showAlert = (type, msg, time = 1.7) => {
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
    showAlert('error', err.response.data.message);
    // console.error('error', err.response.data.message);
  }
};

function renderProducts(productsArr, likedProducts) {
  const productContainer = document.querySelector('.product-list');
  productContainer.innerHTML = '';

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

    const actionItem = document.createElement('li');
    actionItem.classList.add('card-action-item');

    const actionBtn = document.createElement('button');

    actionBtn.className = likedProducts.map((lp) => lp.ProductId).includes(p.id)
      ? 'likeBtn'
      : '';
    actionBtn.classList.add('card-action-btn', 'like-action__btn');
    actionBtn.setAttribute('data-productId', p.id);
    actionBtn.setAttribute('aria-labelledby', 'card-label-2');

    const ionIcon = document.createElement('ion-icon');
    ionIcon.setAttribute('name', 'heart-outline');

    const actionLabel = document.createElement('div');
    actionLabel.id = 'card-label-2';
    actionLabel.classList.add('card-action-tooltip');
    actionLabel.textContent = 'Add to Wishlist';

    actionBtn.appendChild(ionIcon);
    actionItem.appendChild(actionBtn);
    actionItem.appendChild(actionLabel);
    cardActionList.appendChild(actionItem);

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

  likeBtns = document.querySelectorAll('.like-action__btn');
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
}

async function fetchProducts(brandId, typeOfFilter) {
  try {
    const url =
      typeOfFilter === 'all'
        ? `/api/v1/products/productsSelectedAllBrands`
        : `/api/v1/products/productsSelectedBrand?brandId=${brandId}`;

    const response = await axios({
      method: 'GET',
      url: url,
    });

    const { products, likedProducts } = response.data;

    renderProducts(products, likedProducts);
  } catch (err) {
    showAlert('error', 'Somthing went wrong');
    // console.error('Error fetching products:', error);
  }
}

allBrands.forEach((el) => {
  el.addEventListener('click', (event) => {
    const activeBrandsBtns = document.getElementsByClassName('active-brand-btn');
    while (activeBrandsBtns.length)
      activeBrandsBtns[0].className = activeBrandsBtns[0].className.replace(
        /\bactive-brand-btn\b/g,
        '',
      );

    el.classList.add('active-brand-btn');
    const { brandId } = event.target.dataset;
    const typeOfFilter = brandId === 'allBrands' ? 'all' : brandId;
    // console.log(typeOfFilter);
    fetchProducts(brandId, typeOfFilter);
    likeBtns = document.querySelectorAll('.like-action__btn');
  });
});

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
