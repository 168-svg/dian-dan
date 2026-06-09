'use strict';

const app = getApp();
const { foodData } = require('../../utils/foodData');

Page({
    data: {
        categories: [
            { id: 1, name: '招牌推荐', icon: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop' },
            { id: 2, name: '主食', icon: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=100&h=100&fit=crop' },
            { id: 3, name: '小吃', icon: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=100&h=100&fit=crop' },
            { id: 4, name: '饮品', icon: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=100&h=100&fit=crop' },
            { id: 5, name: '甜品', icon: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=100&h=100&fit=crop' },
            { id: 6, name: '汤品', icon: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=100&h=100&fit=crop' },
            { id: 7, name: '套餐', icon: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=100&h=100&fit=crop' },
            { id: 8, name: '新品', icon: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100&h=100&fit=crop' }
        ],
        activeCategory: 1,
        foodList: [],
        cartCount: 0,
        cartTotal: 0,
        cartItems: []
    },

    onLoad() {
        this.loadFoodList(1);
    },

    onShow() {
        this.updateCart();
        const targetCategory = wx.getStorageSync('targetCategory');
        if (targetCategory && targetCategory.id) {
            this.setData({ activeCategory: targetCategory.id });
            this.loadFoodList(targetCategory.id);
            wx.removeStorageSync('targetCategory');
        }
    },

    loadFoodList(categoryId) {
        this.setData({
            foodList: foodData[categoryId] || [],
            scrollTop: 0
        });
    },

    onCategoryTap(e) {
        const { id } = e.currentTarget.dataset;
        this.setData({ activeCategory: id });
        this.loadFoodList(id);
    },

    onFoodTap(e) {
        const { id } = e.currentTarget.dataset;
        wx.navigateTo({ url: `/pages/detail/detail?id=${id}` });
    },

    onAddToCart(e) {
        const { item } = e.currentTarget.dataset;
        app.addToCart(item);
        this.updateCart();

        wx.showToast({
            title: '已加入购物车',
            icon: 'success',
            duration: 1000
        });
    },

    onReduceFromCart(e) {
        const { id } = e.currentTarget.dataset;
        app.reduceFromCart(id);
        this.updateCart();
    },

    updateCart() {
        const cart = app.globalData.cart;
        const foodList = this.data.foodList.map(food => {
            const cartItem = cart.find(c => c.id === food.id);
            return {...food, count: cartItem ? cartItem.count : 0 };
        });

        this.setData({
            foodList,
            cartCount: app.getCartCount(),
            cartTotal: app.getCartTotal(),
            cartItems: cart
        });
    },

    onCartTap() {
        wx.switchTab({ url: '/pages/cart/cart' });
    }
});