'use strict';

const { apiGetCategories, apiGetFoods, apiGetHotFoods, apiGetBanners, apiGetOrders, apiCreateOrder, apiLogin, apiGuestLogin, apiRegister } = require('./utils/api');

App({
    globalData: {
        cart: [],
        cartTotal: 0,
        cartCount: 0,
        userInfo: null,
        hasLogin: false,
        isGuest: false,
        userId: null,
        orders: []
    },

    onLaunch() {
        this.loadCartFromStorage();
        this.loadUserFromStorage();
    },

    loadUserFromStorage() {
        try {
            const userInfo = wx.getStorageSync('userInfo');
            const userId = wx.getStorageSync('userId');
            const hasLogin = wx.getStorageSync('hasLogin');
            const isGuest = wx.getStorageSync('isGuest');
            if (userInfo && hasLogin) {
                this.globalData.userInfo = userInfo;
                this.globalData.hasLogin = true;
                this.globalData.isGuest = !!isGuest;
                this.globalData.userId = userId;
            }
        } catch (e) {
            console.error('加载用户信息失败', e);
        }
    },

    saveUserToStorage() {
        try {
            wx.setStorageSync('userInfo', this.globalData.userInfo);
            wx.setStorageSync('userId', this.globalData.userId);
            wx.setStorageSync('hasLogin', this.globalData.hasLogin);
            wx.setStorageSync('isGuest', this.globalData.isGuest);
        } catch (e) {
            console.error('保存用户信息失败', e);
        }
    },

    login(userData) {
        this.globalData.userInfo = {
            id: userData.id,
            nickname: userData.nickname || userData.username || '用户',
            username: userData.username,
            avatar: userData.avatar || userData.avatarUrl || '/images/user/default-avatar.png',
            phone: userData.phone
        };
        this.globalData.userId = userData.id;
        this.globalData.hasLogin = true;
        this.globalData.isGuest = false;
        this.saveUserToStorage();
    },

    async guestLogin() {
        try {
            const res = await apiGuestLogin();
            if (res.code === 0) {
                this.globalData.userInfo = {
                    id: res.data.id,
                    nickname: res.data.nickname || '游客用户',
                    username: res.data.username,
                    avatar: '/images/user/default-avatar.png',
                    phone: ''
                };
                this.globalData.userId = res.data.id;
                this.globalData.hasLogin = true;
                this.globalData.isGuest = true;
                this.saveUserToStorage();
                return true;
            }
            return false;
        } catch (e) {
            console.error('游客登录失败', e);
            return false;
        }
    },

    async registerUser(username, password, nickname, phone) {
        try {
            const res = await apiRegister({ username, password, nickname, phone });
            if (res.code === 0) {
                this.login(res.data);
                return true;
            }
            return { success: false, msg: res.msg };
        } catch (e) {
            return { success: false, msg: '注册失败' };
        }
    },

    async loginUser(username, password) {
        try {
            const res = await apiLogin({ username, password });
            if (res.code === 0) {
                this.login(res.data);
                return true;
            }
            return { success: false, msg: res.msg };
        } catch (e) {
            return { success: false, msg: '登录失败' };
        }
    },

    logout() {
        this.globalData.userInfo = null;
        this.globalData.userId = null;
        this.globalData.hasLogin = false;
        this.globalData.isGuest = false;
        wx.removeStorageSync('userInfo');
        wx.removeStorageSync('userId');
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

    saveCartToStorage() {
        wx.setStorageSync('cart', this.globalData.cart);
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
    },

    getUserId() {
        return this.globalData.userId;
    }
});
