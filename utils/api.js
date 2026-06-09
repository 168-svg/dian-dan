'use strict';

// API 基础地址 - 本地开发使用，部署到线上时请替换为实际域名
const API_BASE = 'http://localhost:3000/api';

function apiRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: API_BASE + url,
            method: options.method || 'GET',
            data: options.data || {},
            header: {
                'content-type': 'application/json',
                ...(options.header || {})
            },
            success: (res) => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    if (res.data && typeof res.data.code !== 'undefined') {
                        resolve(res.data);
                    } else {
                        resolve({ code: 0, data: res.data });
                    }
                } else {
                    reject({ code: -1, msg: '网络请求失败: ' + res.statusCode });
                }
            },
            fail: (err) => {
                reject({ code: -1, msg: err.errMsg || '网络错误' });
            }
        });
    });
}

// 分类
const apiGetCategories = () => apiRequest('/categories');

// 商品
const apiGetFoods = (params = {}) => {
    let url = '/foods';
    if (params.category_id) url += '?category_id=' + params.category_id;
    return apiRequest(url);
};
const apiGetHotFoods = () => apiRequest('/foods/hot');
const apiGetFood = (id) => apiRequest('/foods/' + id);

// 订单
const apiGetOrders = (user_id) => apiRequest('/orders' + (user_id ? '?user_id=' + user_id : ''));
const apiCreateOrder = (data) => apiRequest('/orders', {
    method: 'POST',
    data
});
const apiUpdateOrderStatus = (id, status) => apiRequest('/orders/' + id + '/status', {
    method: 'PUT',
    data: { status }
});
const apiDeleteOrder = (id) => apiRequest('/orders/' + id, { method: 'DELETE' });

// 轮播图
const apiGetBanners = () => apiRequest('/banners');

// 用户
const apiRegister = (data) => apiRequest('/users/register', { method: 'POST', data });
const apiLogin = (data) => apiRequest('/users/login', { method: 'POST', data });
const apiGuestLogin = () => apiRequest('/users/guest-login', { method: 'POST', data: {} });
const apiGetUser = (id) => apiRequest('/users/' + id);
const apiUpdateUser = (id, data) => apiRequest('/users/' + id, { method: 'PUT', data });

module.exports = {
    API_BASE,
    apiRequest,
    apiGetCategories,
    apiGetFoods,
    apiGetHotFoods,
    apiGetFood,
    apiGetOrders,
    apiCreateOrder,
    apiUpdateOrderStatus,
    apiDeleteOrder,
    apiGetBanners,
    apiRegister,
    apiLogin,
    apiGuestLogin,
    apiGetUser,
    apiUpdateUser
};
