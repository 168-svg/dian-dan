'use strict';

const app = getApp();
const { apiCreateOrder } = require('../../utils/api');

Page({
    data: {
        cartItems: [],
        cartTotal: 0,
        isEmpty: true,
        remark: ''
    },

    onShow() {
        this.loadCart();
    },

    loadCart() {
        const cart = app.globalData.cart;
        const total = app.getCartTotal();

        const cartItems = cart.map(item => ({
            ...item,
            count: item.count || 0,
            subtotal: (item.price * (item.count || 0)).toFixed(2)
        }));

        this.setData({
            cartItems,
            cartTotal: total,
            cartTotalText: total.toFixed(2),
            isEmpty: cart.length === 0
        });
    },

    onAdd(e) {
        const { item } = e.currentTarget.dataset;
        app.addToCart(item);
        this.loadCart();
    },

    onReduce(e) {
        const { id } = e.currentTarget.dataset;
        app.reduceFromCart(id);
        this.loadCart();
    },

    onRemove(e) {
        const { id, name } = e.currentTarget.dataset;
        wx.showModal({
            title: '提示',
            content: `确定要删除「${name}」吗？`,
            success: (res) => {
                if (res.confirm) {
                    app.removeFromCart(id);
                    this.loadCart();
                }
            }
        });
    },

    onClearCart() {
        if (this.data.cartItems.length === 0) return;

        wx.showModal({
            title: '提示',
            content: '确定要清空购物车吗？',
            success: (res) => {
                if (res.confirm) {
                    app.clearCart();
                    this.loadCart();
                }
            }
        });
    },

    onRemarkInput(e) {
        this.setData({ remark: e.detail.value });
    },

    async onSubmit() {
        if (this.data.cartItems.length === 0) {
            wx.showToast({ title: '购物车为空', icon: 'none' });
            return;
        }

        const user_id = app.getUserId();
        if (!user_id) {
            wx.showModal({
                title: '提示',
                content: '请先登录后再下单',
                confirmText: '去登录',
                success: (res) => {
                    if (res.confirm) {
                        wx.switchTab({ url: '/pages/user/user' });
                    }
                }
            });
            return;
        }

        wx.showLoading({ title: '提交订单中...' });

        try {
            const items = this.data.cartItems.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                count: item.count
            }));

            const res = await apiCreateOrder({
                items,
                total: this.data.cartTotal,
                remark: this.data.remark,
                table_no: '',
                user_id
            });

            wx.hideLoading();

            if (res.code === 0) {
                app.clearCart();
                this.setData({ remark: '' });
                wx.showToast({ title: '下单成功！', icon: 'success', duration: 1500 });
                setTimeout(() => {
                    wx.switchTab({ url: '/pages/order/order' });
                }, 1500);
            } else {
                wx.showToast({ title: res.msg || '下单失败', icon: 'none' });
            }
        } catch (e) {
            wx.hideLoading();
            wx.showToast({ title: '网络错误，下单失败', icon: 'none' });
        }
    },

    onGoMenu() {
        wx.switchTab({ url: '/pages/menu/menu' });
    }
});
