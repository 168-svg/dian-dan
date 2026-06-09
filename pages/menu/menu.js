'use strict';

const app = getApp();
const { apiGetCategories, apiGetFoods } = require('../../utils/api');

Page({
    data: {
        categories: [],
        activeCategory: 1,
        foodList: [],
        cartCount: 0,
        cartTotal: 0
    },

    onLoad() {
        this.loadCategories();
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

    async loadCategories() {
        try {
            const res = await apiGetCategories();
            if (res.code === 0 && res.data && res.data.length > 0) {
                const sorted = [...res.data].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
                this.setData({ categories: sorted });
                if (sorted.length > 0) {
                    const firstId = sorted[0].id;
                    this.setData({ activeCategory: firstId });
                    this.loadFoodList(firstId);
                }
            } else {
                this.setData({
                    categories: [
                        { id: 1, name: '招牌推荐', icon: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop' },
                        { id: 2, name: '主食', icon: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=100&h=100&fit=crop' },
                        { id: 3, name: '小吃', icon: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=100&h=100&fit=crop' },
                        { id: 4, name: '饮品', icon: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=100&h=100&fit=crop' },
                        { id: 5, name: '甜品', icon: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=100&h=100&fit=crop' }
                    ],
                    activeCategory: 1
                });
                this.loadFoodList(1);
            }
        } catch (err) {
            console.error('加载分类失败', err);
            this.loadFoodList(1);
        }
    },

    async loadFoodList(categoryId) {
        try {
            const res = await apiGetFoods({ category_id: categoryId });
            if (res.code === 0) {
                const foods = (res.data || []).map(f => ({
                    id: f.id,
                    name: f.name,
                    image: f.image,
                    price: f.price,
                    desc: f.description || '',
                    sales: f.sales || 0,
                    count: 0
                }));
                const cart = app.globalData.cart;
                foods.forEach(f => {
                    const ci = cart.find(c => c.id === f.id);
                    f.count = ci ? ci.count : 0;
                });
                this.setData({ foodList: foods, cartCount: app.getCartCount(), cartTotal: app.getCartTotal() });
            }
        } catch (err) {
            console.error('加载商品失败', err);
        }
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
            cartTotal: app.getCartTotal()
        });
    },

    onCartTap() {
        wx.switchTab({ url: '/pages/cart/cart' });
    }
});
