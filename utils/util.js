'use strict';

const formatTime = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`;
};

const formatDateTime = date => {
    const y = date.getFullYear();
    const M = ('0' + (date.getMonth() + 1)).slice(-2);
    const d = ('0' + date.getDate()).slice(-2);
    const h = ('0' + date.getHours()).slice(-2);
    const m = ('0' + date.getMinutes()).slice(-2);
    return `${y}-${M}-${d} ${h}:${m}`;
};

const formatNumber = n => {
    n = n.toString();
    return n[1] ? n : `0${n}`;
};

module.exports = {
    formatTime,
    formatDateTime
};