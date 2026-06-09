'use strict';

const app = getApp();
const { apiGetFood, apiGetFoods } = require('../../utils/api');

Page({
    data: {
        food: null,
        videoPlaying: false,
        cartCount: 0,
        itemCount: 0,
        relatedFoods: []
    },

    onLoad(options) {
        const foodId = parseInt(options.id);
        if (foodId) {
            this.loadFood(foodId);
        }
    },

    onShow() {
        this.updateCartCount();
    },

    async loadFood(foodId) {
        try {
            const res = await apiGetFood(foodId);
            if (res.code === 0 && res.data) {
                this.setData({ food: res.data });
                this.loadRelatedFoods(foodId);
                this.updateCartCount();
            }
        } catch (err) {
            console.error('加载菜品详情失败', err);
        }
    },

    async loadRelatedFoods(currentId) {
        try {
            const res = await apiGetFoods();
            if (res.code === 0 && res.data) {
                const related = res.data
                    .filter(item => item.id !== currentId)
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 4);
                this.setData({ relatedFoods: related });
            }
        } catch (err) {
            console.error('加载推荐菜品失败', err);
        }
    },

    onVideoPlay() {
        this.setData({ videoPlaying: true });
    },

    onVideoPause() {
        this.setData({ videoPlaying: false });
    },

    onVideoEnd() {
        this.setData({ videoPlaying: false });
    },

    onAddToCart() {
        const { food } = this.data;
        if (!food) return;
        app.addToCart(food);
        this.updateCartCount();

        wx.showToast({
            title: '已加入购物车',
            icon: 'success',
            duration: 1000
        });
    },

    onReduceFromCart() {
        const { food } = this.data;
        if (!food) return;
        app.reduceFromCart(food.id);
        this.updateCartCount();
    },

    updateCartCount() {
        const { food } = this.data;
        if (!food) return;

        const cart = app.globalData.cart;
        const cartItem = cart.find(c => c.id === food.id);
        this.setData({
            cartCount: app.getCartCount(),
            itemCount: cartItem ? cartItem.count : 0
        });
    },

    async onRelatedTap(e) {
        const { id } = e.currentTarget.dataset;
        try {
            const res = await apiGetFood(id);
            if (res.code === 0 && res.data) {
                this.setData({ food: res.data, itemCount: 0 });
                this.loadRelatedFoods(id);
                this.updateCartCount();
            }
        } catch (err) {
            console.error('加载推荐菜品失败', err);
        }
    },

    onCartTap() {
        wx.switchTab({ url: '/pages/cart/cart' });
    },

    onShareAppMessage() {
        const { food } = this.data;
        return {
            title: food ? `${food.name} - ¥${food.price}` : '美味餐厅',
            path: `/pages/detail/detail?id=${food ? food.id : ''}`
        };
    }
});