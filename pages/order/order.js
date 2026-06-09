'use strict';

const app = getApp();
const { apiGetOrders, apiDeleteOrder, apiUpdateOrderStatus } = require('../../utils/api');

function formatTime(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    const pad = n => n < 10 ? '0' + n : '' + n;
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function getStatusText(status) {
    const map = {
        pending: '待处理',
        cooking: '制作中',
        done: '已完成',
        cancelled: '已取消'
    };
    return map[status] || '未知';
}

Page({
    data: {
        orders: [],
        currentTab: 0,
        tabs: ['全部', '待处理', '制作中', '已完成'],
        isEmpty: true
    },

    onShow() {
        this.loadOrders();
    },

    async loadOrders() {
        const user_id = app.getUserId();
        if (!user_id) {
            this.setData({ orders: [], isEmpty: true });
            return;
        }

        wx.showLoading({ title: '加载中...' });

        try {
            const res = await apiGetOrders(user_id);
            wx.hideLoading();

            if (res.code === 0) {
                const { currentTab } = this.data;
                let allOrders = (res.data || []).map(o => ({
                    id: o.id,
                    order_no: o.order_no,
                    items: (o.items && typeof o.items === 'string' ? JSON.parse(o.items || '[]') : (o.items || [])),
                    total: o.total,
                    totalText: Number(o.total).toFixed(2),
                    status: o.status,
                    statusText: getStatusText(o.status),
                    createTime: formatTime(o.created_at || o.createdAt),
                    remark: o.remark || ''
                })).sort((a, b) => b.id - a.id);

                let orders = allOrders;
                if (currentTab === 1) orders = allOrders.filter(o => o.status === 'pending');
                else if (currentTab === 2) orders = allOrders.filter(o => o.status === 'cooking');
                else if (currentTab === 3) orders = allOrders.filter(o => o.status === 'done');

                this.setData({ orders, isEmpty: orders.length === 0 });
            } else {
                this.setData({ orders: [], isEmpty: true });
            }
        } catch (e) {
            wx.hideLoading();
            this.setData({ orders: [], isEmpty: true });
        }
    },

    onTabTap(e) {
        const { index } = e.currentTarget.dataset;
        this.setData({ currentTab: index });
        this.loadOrders();
    },

    onOrderDetail(e) {
        const { id } = e.currentTarget.dataset;
        const order = this.data.orders.find(o => o.id === id);
        if (!order) return;

        const itemsStr = order.items.map(i => `${i.name} x${i.count}`).join('\n');

        wx.showModal({
            title: '订单详情',
            content: `订单号：${order.order_no}\n时间：${order.createTime}\n状态：${order.statusText}\n菜品：\n${itemsStr}\n${order.remark ? '备注：' + order.remark : ''}\n合计：¥${order.totalText}`,
            showCancel: false,
            confirmText: '知道了'
        });
    },

    onCancelOrder(e) {
        const { id } = e.currentTarget.dataset;
        wx.showModal({
            title: '提示',
            content: '确定要取消此订单吗？',
            success: async (res) => {
                if (res.confirm) {
                    try {
                        const r = await apiUpdateOrderStatus(id, 'cancelled');
                        if (r.code === 0) {
                            wx.showToast({ title: '已取消', icon: 'success' });
                            this.loadOrders();
                        } else {
                            wx.showToast({ title: '取消失败', icon: 'none' });
                        }
                    } catch (err) {
                        wx.showToast({ title: '操作失败', icon: 'none' });
                    }
                }
            }
        });
    },

    onDeleteOrder(e) {
        const { id } = e.currentTarget.dataset;
        wx.showModal({
            title: '提示',
            content: '确定要删除此订单吗？',
            success: async (res) => {
                if (res.confirm) {
                    try {
                        const r = await apiDeleteOrder(id);
                        if (r.code === 0) {
                            wx.showToast({ title: '已删除', icon: 'success' });
                            this.loadOrders();
                        } else {
                            wx.showToast({ title: '删除失败', icon: 'none' });
                        }
                    } catch (err) {
                        wx.showToast({ title: '操作失败', icon: 'none' });
                    }
                }
            }
        });
    },

    onGoMenu() {
        wx.switchTab({ url: '/pages/menu/menu' });
    }
});
