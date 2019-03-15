import Vue from 'vue';
import FastClick from 'fastclick';
import './adapter';
import './flexible';
import account from './account';
import env from './env';
import flag from './flag';
import constant from './constant';
import utils from './utils';
import md5 from './md5';
import request from './request';
import native from './native';
import api from './api';
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

// 定义与Native相关的事件监听
$$.EventListener = {
    // 页面回退刷新
    onRefresh: function() {},
    // 返回（点击返回按钮或Android物理返回键）
    onBack: function(url, data) {},
    pageDidAppear: function() {}
};


export default {
    // 环境变量
    Env: env.ssEnv,
    // API
    Api: api,
    // API
    Flag: flag,
    // 常量
    Constant: constant,
    // 工具类
    Utils: utils,
    // Native接口
    Native: native,

    Account: account,

    md5: md5,
    request: request,
    start(App, options) {
        if (!App) return;
        const vue = new Vue({
            ...options,
            ...App
        });
        vue.$mount('#app'); // 挂载
        return vue;
    }
};
