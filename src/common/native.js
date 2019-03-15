/**
 * native模块，common子模块
 * 和客户端通讯相关模块
 * @module native
 */
/*eslint-disable*/
import Utils from './utils';
import "./adapter"
import Vue from 'vue'
import router from 'vue-router'

var App = window.App || {},
    defaultCallback = function () {};
var Native = {

    NRouter: {
        open: defaultCallback,
        assign: defaultCallback,
        back: defaultCallback,
        openNative: defaultCallback,
        getUserLoginInfo:defaultCallback,
        getUserLocation:defaultCallback,
        getUserContactBook:defaultCallback,
        getResultInfo:defaultCallback,
        openThreeParty:defaultCallback,
        callPhone:defaultCallback,
        openIdentityAuth:defaultCallback
    },

    NUI: {
        setHeader: defaultCallback,
        setLeftBtn: defaultCallback,
        setRightBtn: defaultCallback,
        loading: defaultCallback,
        loadFinish: defaultCallback,
        refresh: defaultCallback,
        tip: defaultCallback,
        hide: defaultCallback,
        setRightButtons: defaultCallback,
        refreshNative: defaultCallback,
        setNavigationBar: defaultCallback,
    }
}

var __handle = {
    NRouter: {
        open: function (options) {
            var data = options.data,
                url = options.url,
                env=options.target;
            url = Utils.urlParam(url, data);
            // 本地开发浏览器环境
            if (App.IS_LOCAL) {
                location.href = url;
                return false;
            }
            options.url = url;
            return true;
        },

        assign: function (options) {
            var data = options.data,
                url = options.url,
                env=options.target;
            url = Utils.urlParam(url, data);

            // 本地开发浏览器环境
            if (App.IS_LOCAL) {
                location.href = url;
                return false;
            }
            options.url = url;
            return true;
        },

        back: function (options) {
            var url = '',
                data = '',
                env=options.target;
            if (options && options.url) {
                url = options.url;
                if (!(/^https*:\/\//.test(url))) {
                    url = url;
                }
            }
            if (options && options.data) {
                data = options.data;
            }
            // 本地开发浏览器环境
            if (App.IS_LOCAL) {
                location.href = url;
                return false;
            }
            options.page = url;
            options.args = data;
            return true;
        },
        getUserLoginInfo:function(options){
          return true;
        },
      getUserLocation:function (options) {
        return true
      },
      getUserContactBook:function (options) {
        return true
      },
      toTaoBaoAuth:function () {
        return true;
      },
      getResultInfo:function(options) {
        return true;
      },
      openThreeParty:function(options){
        return true;
      },
      callPhone:function(options){
        return true;
      },
      openIdentityAuth:function(options){
        return true;
      },
      openNative:function(options){
        return true;
      }
    },
    NUI: {
        setLeftBtn: function (options) {
            options.leftIcon = options.icon;
            options.leftCallback = options.callback;
            return true;
        },
        setRightBtn: function (options) {
            options.rightIcon = options.icon;
            options.rightCallback = options.callback;
            return true;
        },
        loading: function (options) {
            options.loadingText = options.text;
            return true;
        },
        tip: function (options) {
            options.text = options.text || '';
            options.style = options.style || 'info';
            // 本地开发浏览器环境
            if (App.IS_LOCAL) {
                alert(options.text);
                return false;
            }
            return true;
        },
        setHeader:function(options){
          options.title = options.title || '';
          options.isBack = options.isBack || '';
          options.backUrl = options.backUrl || '';
          options.rightText  = options.rightText || '';
          options.rightIcon = options.rightIcon || '';
          options.rightCallback = options.rightCallback || '';
          return true;
        }
    }
}

for (var _module in Native) {
    if (Native.hasOwnProperty(_module)) {
        for (var method in Native[_module]) {
            if (Native[_module].hasOwnProperty(method)) {
                Native[_module][method] = (function (module, method) {
                    return function (options) {
                        var result = true;
                        options = options || {};
                        if (__handle[module] && __handle[module][method] && Object.prototype.toString.call(__handle[module][method]) == '[object Function]') {
                            result = __handle[module][method].call(this, options);
                        }
                        if (result) {
                            App.call(module + '.' + method, options);
                        }
                    }
                })(_module, method);
            }
        }
    }
}

export default Native;
