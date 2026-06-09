const app = getApp();

Page({
    data: {
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
        ],
        hotList: [],
        cartCount: 0
    },

    onLoad() {
        this.loadHotFoods();
    },

    onShow() {
        this.setData({ cartCount: app.getCartCount() });
    },

    loadHotFoods() {
        const hotList = [
            { id: 1, name: '宫保鸡丁', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=400&fit=crop', price: 32, sales: 1256, tag: '招牌' },
            { id: 2, name: '麻辣小龙虾', image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=400&fit=crop', price: 68, sales: 986, tag: '爆款' },
            { id: 3, name: '番茄牛腩面', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop', price: 28, sales: 2341, tag: '人气' },
            { id: 4, name: '珍珠奶茶', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop', price: 18, sales: 3856, tag: '热卖' },
            { id: 5, name: '红烧排骨', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop', price: 45, sales: 768, tag: '推荐' },
            { id: 6, name: '水果拼盘', image: 'https://images.unsplash.com/photo-1564093497595-593b96d80180?w=400&h=400&fit=crop', price: 22, sales: 1567, tag: '清爽' }
        ];

        this.setData({ hotList });
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