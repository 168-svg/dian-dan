const app = getApp();
const { getFoodById, getAllFoods } = require('../../utils/foodData');

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
            const food = getFoodById(foodId);
            if (food) {
                this.setData({ food });
                this.loadRelatedFoods(foodId);
            }
        }
    },

    onShow() {
        this.updateCartCount();
    },

    loadRelatedFoods(currentId) {
        const allFoods = getAllFoods();
        const related = allFoods
            .filter(item => item.id !== currentId)
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);
        this.setData({ relatedFoods: related });
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

    onRelatedTap(e) {
        const { id } = e.currentTarget.dataset;
        const food = getFoodById(id);
        if (food) {
            this.setData({ food, itemCount: 0 });
            this.loadRelatedFoods(id);
            this.updateCartCount();
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