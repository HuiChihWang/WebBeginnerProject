// elements
const elements = {
    shoppingButton: document.querySelector('.banner-btn'),
    productBoard: document.querySelector('.products'),
}

const elementsString = {
    productList: 'products-center',
    addBagButton: 'bag-btn',
}

/* product model */
class Products {
    constructor() {

    }

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
}

/* view controller */
class ProductView {

    constructor() {
        this._initProductBoard();
    }

    _initProductBoard() {
        const markUp = `
        <div class="section-title">
            <h2>Our Product</h2>
        </div>
        <div class="${elementsString.productList}">
        </div>
        `;
        elements.productBoard.insertAdjacentHTML('afterbegin', markUp);
    }

    renderProducts(products) {
        const productsBoard = document.querySelector(`.${elementsString.productList}`);

        products.forEach(product => {
            const productHTML = this.createProductHTML(product);
            productsBoard.insertAdjacentHTML('beforeend', productHTML);
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


/* event control */
const initProductsView = async () => {
    const products = new Products();
    const productView = new ProductView();
    await products.fetchProducts();
    productView.renderProducts(products.productList);

}

const controlAddToCart = event => {
    const button = event.target.closest(`.${elementsString.addBagButton}`);
    if (button) {
        const id = button.dataset.id;
        console.log(`button press ${id}`);
    }
};

elements.shoppingButton.addEventListener('click', initProductsView);
document.addEventListener('click', controlAddToCart);







