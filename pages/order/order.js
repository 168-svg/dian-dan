'use strict';

const app = getApp();

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

    loadOrders() {
        const allOrders = app.globalData.orders || [];
        const { currentTab } = this.data;

        let orders = allOrders;
        if (currentTab === 1) {
            orders = allOrders.filter(o => o.status === 'pending');
        } else if (currentTab === 2) {
            orders = allOrders.filter(o => o.status === 'cooking');
        } else if (currentTab === 3) {
            orders = allOrders.filter(o => o.status === 'done');
        }

        const formattedOrders = orders.map(order => ({
            ...order,
            items: order.items.map(item => ({
                ...item,
                count: item.count || 0
            })),
            totalText: order.total.toFixed(2)
        }));

        this.setData({
            orders: formattedOrders,
            isEmpty: orders.length === 0
        });
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
            content: `订单号：${order.id}
时间：${order.createTime}
状态：${order.statusText}
菜品：
${itemsStr}
${order.remark ? '备注：' + order.remark : ''}
合计：¥${order.total.toFixed(2)}`,
            showCancel: false,
            confirmText: '知道了'
        });
    },

    onDeleteOrder(e) {
        const { id } = e.currentTarget.dataset;
        wx.showModal({
            title: '提示',
            content: '确定要删除此订单吗？',
            success: (res) => {
                if (res.confirm) {
                    const orders = app.globalData.orders.filter(o => o.id !== id);
                    app.globalData.orders = orders;
                    app.saveOrdersToStorage();
                    this.loadOrders();
                }
            }
        });
    },

    onGoMenu() {
        wx.switchTab({ url: '/pages/menu/menu' });
    }
});