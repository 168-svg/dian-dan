'use strict';

const app = getApp();
const { apiGetCategories, apiGetHotFoods, apiGetBanners } = require('../../utils/api');

Page({
    data: {
        banners: [],
        categories: [],
        hotList: [],
        cartCount: 0
    },

    onLoad() {
        this.loadData();
    },

    onShow() {
        this.setData({ cartCount: app.getCartCount() });
    },

    async loadData() {
        wx.showLoading({ title: '加载中...' });

        try {
            const [bannersRes, cateRes, foodsRes] = await Promise.all([
                apiGetBanners(),
                apiGetCategories(),
                apiGetHotFoods()
            ]);

            if (bannersRes.code === 0 && bannersRes.data && bannersRes.data.length > 0) {
                this.setData({ banners: bannersRes.data });
            } else {
                this.setData({
                    banners: [
                        { id: 1, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop' },
                        { id: 2, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=400&fit=crop' },
                        { id: 3, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&fit=crop' }
                    ]
                });
            }

            if (cateRes.code === 0 && cateRes.data && cateRes.data.length > 0) {
                this.setData({ categories: cateRes.data });
            }

            if (foodsRes.code === 0 && foodsRes.data && foodsRes.data.length > 0) {
                const hotList = foodsRes.data.map(item => ({
                    id: item.id,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    sales: item.sales || 0,
                    tag: item.sales > 2000 ? '爆款' : '热销'
                }));
                this.setData({ hotList });
            }
        } catch (err) {
            console.error('首页数据加载失败', err);
            // 本地兜底数据
            this.setData({
                banners: [
                    { id: 1, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop' },
                    { id: 2, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=400&fit=crop' },
                    { id: 3, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&fit=crop' }
                ],
                categories: [
                    { id: 1, name: '招牌推荐', icon: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=150&h=150&fit=crop' },
                    { id: 2, name: '主食', icon: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=150&h=150&fit=crop' },
                    { id: 3, name: '小吃', icon: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=150&h=150&fit=crop' },
                    { id: 4, name: '饮品', icon: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=150&h=150&fit=crop' },
                    { id: 5, name: '甜品', icon: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=150&h=150&fit=crop' },
                    { id: 6, name: '汤品', icon: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=150&h=150&fit=crop' },
                    { id: 7, name: '套餐', icon: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=150&h=150&fit=crop' },
                    { id: 8, name: '新品', icon: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=150&h=150&fit=crop' }
                ]
            });
        } finally {
            wx.hideLoading();
        }
    },

    onCategoryTap(e) {
        const { id, name } = e.currentTarget.dataset;
        wx.switchTab({ url: '/pages/menu/menu' });
        setTimeout(() => {
            wx.setStorageSync('targetCategory', { id, name });
        }, 100);
    },

    onFoodTap(e) {
        const { id } = e.currentTarget.dataset;
        wx.navigateTo({ url: `/pages/detail/detail?id=${id}` });
    },

    onCartTap() {
        wx.switchTab({ url: '/pages/cart/cart' });
    },

    onSearchTap() {
        wx.showToast({ title: '搜索功能开发中', icon: 'none' });
    },

    onMoreTap() {
        wx.switchTab({ url: '/pages/menu/menu' });
    }
});
