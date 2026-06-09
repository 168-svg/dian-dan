App({
    globalData: {
        cart: [],
        cartTotal: 0,
        cartCount: 0,
        userInfo: null,
        orders: []
    },

    onLaunch() {
        this.loadCartFromStorage();
        this.loadOrdersFromStorage();
    },

    loadCartFromStorage() {
        const cart = wx.getStorageSync('cart') || [];
        this.globalData.cart = cart;
        this.updateCartInfo();
    },

    loadOrdersFromStorage() {
        const orders = wx.getStorageSync('orders') || [];
        this.globalData.orders = orders;
    },

    saveCartToStorage() {
        wx.setStorageSync('cart', this.globalData.cart);
    },

    saveOrdersToStorage() {
        wx.setStorageSync('orders', this.globalData.orders);
    },

    addToCart(food) {
        const cart = this.globalData.cart;
        const index = cart.findIndex(item => item.id === food.id);

        if (index > -1) {
            cart[index].count += 1;
        } else {
            cart.push({...food, count: 1 });
        }

        this.globalData.cart = cart;
        this.saveCartToStorage();
        this.updateCartInfo();
    },

    reduceFromCart(foodId) {
        const cart = this.globalData.cart;
        const index = cart.findIndex(item => item.id === foodId);

        if (index > -1) {
            if (cart[index].count > 1) {
                cart[index].count -= 1;
            } else {
                cart.splice(index, 1);
            }
        }

        this.globalData.cart = cart;
        this.saveCartToStorage();
        this.updateCartInfo();
    },

    removeFromCart(foodId) {
        const cart = this.globalData.cart;
        const index = cart.findIndex(item => item.id === foodId);

        if (index > -1) {
            cart.splice(index, 1);
        }

        this.globalData.cart = cart;
        this.saveCartToStorage();
        this.updateCartInfo();
    },

    clearCart() {
        this.globalData.cart = [];
        this.saveCartToStorage();
        this.updateCartInfo();
    },

    updateCartInfo() {
        const cart = this.globalData.cart;
        let total = 0;
        let count = 0;

        cart.forEach(item => {
            total += item.price * item.count;
            count += item.count;
        });

        this.globalData.cartTotal = Math.round(total * 100) / 100;
        this.globalData.cartCount = count;
    },

    getCartCount() {
        return this.globalData.cartCount;
    },

    getCartTotal() {
        return this.globalData.cartTotal;
    }
});