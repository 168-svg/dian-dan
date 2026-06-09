'use strict';

const app = getApp();
const { formatDateTime } = require('../../utils/util');

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

    onSubmit() {
        if (this.data.cartItems.length === 0) {
            wx.showToast({ title: '购物车为空', icon: 'none' });
            return;
        }

        const order = {
            id: 'ORD' + Date.now(),
            items: [...this.data.cartItems],
            total: this.data.cartTotal,
            remark: this.data.remark,
            status: 'pending',
            statusText: '待处理',
            createTime: formatDateTime(new Date())
        };

        const orders = app.globalData.orders;
        orders.unshift(order);
        app.globalData.orders = orders;
        app.saveOrdersToStorage();

        app.clearCart();
        this.setData({ remark: '' });

        wx.showToast({
            title: '下单成功！',
            icon: 'success',
            duration: 1500
        });

        setTimeout(() => {
            wx.switchTab({ url: '/pages/order/order' });
        }, 1500);
    },

    onGoMenu() {
        wx.switchTab({ url: '/pages/menu/menu' });
    }
});