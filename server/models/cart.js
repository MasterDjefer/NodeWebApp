class Cart {
    constructor(oldCart) {
        this._goods = oldCart;
    }

    add(goods) {
        const cartItem = this._goods.find(((element) => {
            return element.phone.brand === goods.brand && element.phone.model === goods.model;
        }));

        if (cartItem) {
            cartItem.count++;
        } else {
            this._goods.push({ phone: goods , count: 1} );
        }
    }

    formatCart() {
        return JSON.stringify(this._goods);
    }
}

module.exports = Cart;