'use strict';

const app = getApp();

Page({
    data: {
        userInfo: null,
        hasLogin: false,
        isGuest: false,
        orderSummary: {
            pending: 0,
            cooking: 0,
            done: 0,
            total: 0
        }
    },

    onShow() {
        this.loadUserInfo();
        this.loadOrderSummary();
    },

    loadUserInfo() {
        this.setData({
            userInfo: app.globalData.userInfo,
            hasLogin: app.globalData.hasLogin,
            isGuest: app.globalData.isGuest
        });
    },

    loadOrderSummary() {
        const orders = app.globalData.orders || [];
        const pending = orders.filter(o => o.status === 'pending').length;
        const cooking = orders.filter(o => o.status === 'cooking').length;
        const done = orders.filter(o => o.status === 'done').length;

        this.setData({
            orderSummary: {
                pending,
                cooking,
                done,
                total: orders.length
            }
        });
    },

    onWechatLogin() {
        wx.getUserProfile({
            desc: '用于完善会员资料',
            success: (res) => {
                app.login(res.userInfo);
                this.loadUserInfo();
                wx.showToast({ title: '登录成功', icon: 'success' });
            },
            fail: () => {
                wx.showToast({ title: '已取消登录', icon: 'none' });
            }
        });
    },

    onGuestLogin() {
        app.guestLogin();
        this.loadUserInfo();
        wx.showToast({ title: '游客登录成功', icon: 'success' });
    },

    onLogout() {
        wx.showModal({
            title: '提示',
            content: '确定要退出登录吗？',
            success: (res) => {
                if (res.confirm) {
                    app.logout();
                    this.loadUserInfo();
                    wx.showToast({ title: '已退出登录', icon: 'success' });
                }
            }
        });
    },

    onOrderTap(e) {
        const { status } = e.currentTarget.dataset;
        wx.switchTab({ url: '/pages/order/order' });
        wx.setStorageSync('orderTab', status);
    },

    onAllOrders() {
        wx.switchTab({ url: '/pages/order/order' });
    },

    onAddress() {
        wx.showToast({ title: '地址管理功能开发中', icon: 'none' });
    },

    onCoupon() {
        wx.showToast({ title: '优惠券功能开发中', icon: 'none' });
    },

    onService() {
        wx.showModal({
            title: '联系客服',
            content: '客服电话：400-888-8888\n工作时间：09:00-21:00',
            showCancel: false,
            confirmText: '知道了'
        });
    },

    onAbout() {
        wx.showModal({
            title: '关于美味餐厅',
            content: '美味餐厅 v1.0.0\n为您提供最优质的餐饮服务',
            showCancel: false,
            confirmText: '知道了'
        });
    },

    onClearCache() {
        wx.showModal({
            title: '提示',
            content: '确定要清除所有缓存数据吗？（包括购物车和订单记录）',
            success: (res) => {
                if (res.confirm) {
                    app.clearCart();
                    app.globalData.orders = [];
                    app.saveOrdersToStorage();
                    this.loadOrderSummary();
                    wx.showToast({ title: '已清除', icon: 'success' });
                }
            }
        });
    }
});