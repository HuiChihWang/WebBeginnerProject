// elements
const elements = {
    shoppingButton: document.querySelector('.banner-btn'),
    productBoard: document.querySelector('.products'),
    productList: document.querySelector('.products-center'),
    cartOverlay: document.querySelector('.cart-overlay'),
    cartBoard: document.querySelector('.cart'),
    cartContent: document.querySelector('.cart-content'),
    cartFooter: document.querySelector('.cart-footer'),
}

const elementsString = {
    addBagButton: 'bag-btn',
    closeCartButton: 'close-cart',
}

const state = {};

/* product model */
class Products {
    async fetchProducts() {
        try {
            await fetch('./js/products.json')
                .then(res => { return res.json(); })
                .then(result => { this._products = result.items; });

            this._products = this._products.map(this.processData);
        }
        catch{
            alert('fetch json error');
        }
    }

    processData(item) {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, id, image };
    }

    get productList() {
        return this._products;
    }

    getProductById(productId) {
        const productIndex = this._products.findIndex(product => product.id === productId);
        return this._products[productIndex];
    }
}

/* Cart Model */
class CartList {
    constructor() {
        this.totalPrice = 0;
        this.mapIdCartItem = new Map();
    }

    addItemToCart(product, amount = 1) {
        if (this.mapIdCartItem.has(product.id)) {
            const cartItemQuery = this.mapIdCartItem.get(product.id);
            console.log(cartItemQuery);
            cartItemQuery.amout += amount;
        }
        else {
            const cartItem = {
                price: product.price,
                amount: amount,
                title: product.title,
                image: product.image,
                id: product.id,
            }

            this.mapIdCartItem.set(product.id, cartItem);
        }

        this.totalPrice += (product.price * amount);
    }

    removeItemFromCart(product) {
        const removeItem = this.mapIdCartItem.get(product.id);
        if (removeItem) {
            this.totalPrice -= (removeItem.amount * removeItem.price);
            this.mapIdCartItem.delete(product.id);
        }
    }

    decreaseItemFromCart(product, decreaseAmount = 1) {
        const cartItemQuery = this.mapIdCartItem.get(product.id);
        if (cartItemQuery) {
            cartItemQuery.amount -= decreaseAmount;
            cartItemQuery.amount = Math.max(1, cartItemQuery.amount);
            this.totalPrice -= (cartItemQuery.amount * cartItemQuery.price);
        }
    }

    getItemByProductId(productId) {
        return this.mapIdCartItem.get(productId);
    }

    isItemInCart(productId) {
        return this.mapIdCartItem.has(productId);
    }

}

/* view controller */
class ProductView {
    _initProductBoard() {
        const productBoardHeader = elements.productBoard.querySelector('.section-title');
        if (!productBoardHeader) {
            const markUp = `
            <div class="section-title">
                <h2>Our Product</h2>
            </div>
            `;
            elements.productBoard.insertAdjacentHTML('afterbegin', markUp);
        }
    }

    _clearProducts() {
        elements.productList.innerHTML = '';
    }

    renderProducts(products) {
        this._initProductBoard();
        this._clearProducts();
        products.forEach(product => {
            const productHTML = this.createProductHTML(product);
            elements.productList.insertAdjacentHTML('beforeend', productHTML);
        });
    }

    createProductHTML(product) {
        const markUp = `
        <article class="product">
        <div class="img-container">
          <img
            src="${product.image}"
            alt="product"
            class="product-img"
          />
          <button class="bag-btn" data-id="${product.id}">
            <i class="fas fa-shopping-cart"></i>
            add to bag
          </button>
        </div>
    
        <h3>${product.title}</h3>
        <h4>$${product.price}</h4>
        </article>
        `;

        return markUp;
    }
}

/*cart View */
class CartView {
    showCartView() {
        elements.cartOverlay.style.visibility = 'visible';
        elements.cartBoard.classList.add('show-cart');
    }

    hideCartView() {
        elements.cartBoard.classList.remove('show-cart');
        elements.cartOverlay.style.visibility = 'hidden';
    }

    createItemIntoCart(cartItem) {
        const cartItemHTML = this.createCartItemHTML(cartItem);
        elements.cartContent.insertAdjacentHTML('beforeend', cartItemHTML);
    }

    updateItemAmountInCart(cartItem) {
        const cartElement = elements.cartContent.querySelector(`[data-id="${cartItem.id}"]`);

        if (cartElement) {
            const amount = cartElement.querySelector('.item-amount');
            amount.textContent = cartItem.amount;
        }
    }

    updateTotalCost(totalAmount) {
        const cartAmount = elements.cartFooter.querySelector('.cart-total');
        cartAmount.textContent = totalAmount;
    }

    removeItemFromCart(cartItem) {

    }

    createCartItemHTML(cartItem) {
        return `
        <div class="cart-item" data-id="${cartItem.id}">
            <img src="${cartItem.image}" alt="cartItem" />
            <div>
                <h4>${cartItem.title}</h4>
                <h5>$${cartItem.price}</h5>
                <span class="remove-item"> remove </span>
            </div>
            <div>
                <i class="fas fa-chevron-up"></i>
                <p class="item-amount">1</p>
                <i class="fas fa-chevron-down"></i>
            </div>
      </div> 
        `;
    }
}

/* event control */
const initSetting = () => {
    state.products = new Products();
    state.productView = new ProductView();
    state.cartList = new CartList();
    state.cartView = new CartView();
};

const initProductsView = async () => {
    await state.products.fetchProducts();
    state.productView.renderProducts(state.products.productList);
}

const controlAddToCart = event => {
    const button = event.target.closest(`.${elementsString.addBagButton}`);
    if (button) {
        const productId = button.dataset.id;
        const isCartItemFirstAdded = !state.cartList.isItemInCart(productId);

        if (isCartItemFirstAdded) {
            const productItem = state.products.getProductById(productId);
            state.cartList.addItemToCart(productItem);

            const cartItem = state.cartList.getItemByProductId(productId);
            state.cartView.createItemIntoCart(cartItem);
            state.cartView.updateTotalCost(state.cartList.totalPrice);
            state.cartView.showCartView();

            // change product tag
        }
 


    }
};

window.onload = initSetting();

elements.shoppingButton.addEventListener('click', initProductsView);
elements.productList.addEventListener('click', controlAddToCart);

elements.cartBoard.addEventListener('click', event => {
    if (event.target.matches(`.${elementsString.closeCartButton}, .${elementsString.closeCartButton} *`)) {
        state.cartView.hideCartView();
    }
})







