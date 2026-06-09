'use strict';

App({
    globalData: {
        cart: [],
        cartTotal: 0,
        cartCount: 0,
        userInfo: null,
        hasLogin: false,
        isGuest: false,
        orders: []
    },

    onLaunch() {
        this.loadCartFromStorage();
        this.loadOrdersFromStorage();
        this.loadUserFromStorage();
    },

    loadUserFromStorage() {
        const userInfo = wx.getStorageSync('userInfo');
        const hasLogin = wx.getStorageSync('hasLogin');
        const isGuest = wx.getStorageSync('isGuest');
        if (userInfo && hasLogin === true) {
            this.globalData.userInfo = userInfo;
            this.globalData.hasLogin = true;
            this.globalData.isGuest = isGuest === true;
        } else if (userInfo) {
            wx.removeStorageSync('userInfo');
            wx.removeStorageSync('hasLogin');
            wx.removeStorageSync('isGuest');
        }
    },

    saveUserToStorage() {
        if (this.globalData.userInfo) {
            wx.setStorageSync('userInfo', this.globalData.userInfo);
            wx.setStorageSync('hasLogin', this.globalData.hasLogin);
            wx.setStorageSync('isGuest', this.globalData.isGuest);
        }
    },

    login(userInfo) {
        this.globalData.userInfo = userInfo;
        this.globalData.hasLogin = true;
        this.globalData.isGuest = false;
        this.saveUserToStorage();
    },

    guestLogin() {
        this.globalData.userInfo = {
            nickName: '游客用户',
            avatarUrl: '/images/user/default-avatar.png',
            isGuest: true
        };
        this.globalData.hasLogin = true;
        this.globalData.isGuest = true;
        this.saveUserToStorage();
    },

    logout() {
        this.globalData.userInfo = null;
        this.globalData.hasLogin = false;
        this.globalData.isGuest = false;
        wx.removeStorageSync('userInfo');
        wx.removeStorageSync('hasLogin');
        wx.removeStorageSync('isGuest');
    },

    loadCartFromStorage() {
        const cart = wx.getStorageSync('cart') || [];
        this.globalData.cart = cart.map(item => ({
            ...item,
            count: item.count || 0
        }));
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