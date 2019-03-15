/**
 * 基于Vue resource改造的 ajax 方法
 */
import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);
import interceptor from './interceptor';
import envJson from '../env';
import {
    isPlainObject
} from '../utils/lang';
import Native from '../native';
import Flag from '../flag';

Vue.http.interceptors.push(interceptor); // 增加拦截器
const env = envJson.ssEnv;

export default function (url, data, options) {
    if (arguments.length < 1) return;
    const method = env === 'DEVELOPMENT' ? 'GET' : 'POST';
    options = isPlainObject(arguments[0]) ? arguments[0] : {
        url,
        data: data || {},
        ...options
    };
    if (!options.method) options.method = method;

    return Vue.http(options)
        .then(handleThen)
        .then(success, error);
}

function handleThen(response) {
    return response.body;
}

function success(res) {
    /*eslint-disable*/
    if (res && res.flag != Flag.SUCCESS) {
        if (res.flag == Flag.FAIL || res.flag == Flag.REFRESH_CODE) {
            // 当判断状态码为2或9时，需自动调起native接口进行跳转到登录页
            Native.gotoLogin(res.flag);
        } else if (res.flag == Flag.LOGIN_TIMEOUT || res.flag == Flag.ERROR) {
            // 登录超时的时候跳转到登录页
            account.logout();
            if (env !== 'DEVELOPMENT') {
                Native.NUI.tip({
                    text: res.msg
                });
            } else {
                var url = 'login.html?redirectURL=' + encodeURIComponent(location.href);
            }
        } else {
            var code = res.flag;
            // 集合内的code值不提示
            var whiteCode = [''];

            if (res.msg && whiteCode.indexOf(code) === -1) {
                if (env !== 'DEVELOPMENT') {
                    if (res.msg && res.msg !== '失败') {
                        Native.NUI.tip({
                            text: res.msg
                        });
                    }
                } else {

                }
            }
        }
    }
    /*eslint-enable*/
    return res;
}

function error(response) {
    const res = response.body;
    const errmsg = res.errmsg ? res.errmsg : '网络异常，请稍后再试！';
    if (env !== 'DEVELOPMENT') {
        Native.NUI.tip({
            text: errmsg
        });
    } else {
        
    }
    return Promise.reject(res);
}
