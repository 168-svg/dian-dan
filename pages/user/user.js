'use strict';

const app = getApp();

Page({
    data: {
        userInfo: null,
        hasLogin: false,
        isGuest: false,
        showLoginModal: false,
        loginType: 'login',
        loginForm: { username: '', password: '', nickname: '', phone: '' },
        orderSummary: { pending: 0, cooking: 0, done: 0, total: 0 }
    },

    onShow() {
        this.loadUserInfo();
    },

    loadUserInfo() {
        this.setData({
            userInfo: app.globalData.userInfo,
            hasLogin: app.globalData.hasLogin,
            isGuest: app.globalData.isGuest
        });
    },

    onGuestLoginTap() {
        this.setData({ showLoginModal: true, loginType: 'guest', loginForm: { username: '', password: '', nickname: '', phone: '' } });
    },

    onLoginTap() {
        this.setData({ showLoginModal: true, loginType: 'login', loginForm: { username: '', password: '', nickname: '', phone: '' } });
    },

    onRegisterTap() {
        this.setData({ showLoginModal: true, loginType: 'register', loginForm: { username: '', password: '', nickname: '', phone: '' } });
    },

    switchLoginType(e) {
        const { type } = e.currentTarget.dataset;
        this.setData({ loginType: type });
    },

    onInput(e) {
        const { field } = e.currentTarget.dataset;
        this.setData({ [`loginForm.${field}`]: e.detail.value });
    },

    async confirmLogin() {
        const { loginType, loginForm } = this.data;

        if (loginType === 'guest') {
            wx.showLoading({ title: '登录中...' });
            const ok = await app.guestLogin();
            wx.hideLoading();
            if (ok) {
                this.setData({ showLoginModal: false });
                this.loadUserInfo();
                wx.showToast({ title: '游客登录成功', icon: 'success' });
            } else {
                wx.showToast({ title: '登录失败', icon: 'none' });
            }
            return;
        }

        if (loginType === 'login') {
            if (!loginForm.username || !loginForm.password) {
                wx.showToast({ title: '请填写用户名和密码', icon: 'none' });
                return;
            }
            wx.showLoading({ title: '登录中...' });
            const ok = await app.loginUser(loginForm.username, loginForm.password);
            wx.hideLoading();
            if (ok === true) {
                this.setData({ showLoginModal: false });
                this.loadUserInfo();
                wx.showToast({ title: '登录成功', icon: 'success' });
            } else {
                wx.showToast({ title: (ok && ok.msg) || '登录失败', icon: 'none' });
            }
            return;
        }

        if (loginType === 'register') {
            if (!loginForm.username || !loginForm.password) {
                wx.showToast({ title: '请填写用户名和密码', icon: 'none' });
                return;
            }
            wx.showLoading({ title: '注册中...' });
            const ok = await app.registerUser(loginForm.username, loginForm.password, loginForm.nickname || loginForm.username, loginForm.phone || '');
            wx.hideLoading();
            if (ok === true) {
                this.setData({ showLoginModal: false });
                this.loadUserInfo();
                wx.showToast({ title: '注册成功', icon: 'success' });
            } else {
                wx.showToast({ title: (ok && ok.msg) || '注册失败', icon: 'none' });
            }
        }
    },

    closeLoginModal() {
        this.setData({ showLoginModal: false });
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
        wx.switchTab({ url: '/pages/order/order' });
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
            title: '关于点餐系统',
            content: '点餐系统 v1.0.0\n为您提供最优质的餐饮服务',
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
                    wx.showToast({ title: '已清除', icon: 'success' });
                }
            }
        });
    }
});
