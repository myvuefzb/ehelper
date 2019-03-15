/**
 * 拦截器处理业务逻辑
 */
import client from './client';
import Utils from '../utils';
import Constant from '../constant';
import md5 from '../md5';
import Env from '../env';
const env = Env.ssEnv;
export default function (request, next) {
    const UA = navigator.userAgent;

    const proxyUrl =  (request.url.indexOf('/') === 0 ? request.url : '/' + request.url);
    switch (true) {
        case UA.indexOf('lark') !== -1 || UA.indexOf('hybridKit') !== -1: // App环境走原生接口
            request.client = client;
            break;
        case location.hostname.indexOf('quncaotech.com') !== -1: // 线上访问
            request.url = proxyUrl;
            request.emulateJSON = true;
            break;
        case App.IS_LOCAL && request.url.trim().indexOf('../data') === 0:
            break;
      default:
          const loginInfo = Utils.data(Constant.DataKey.USER_LOGIN_INFO);
            const defaultParams = {
                ver: '2.0-DEBUG',
                protocol_ver: '1',
                dsn: UA,
                appid: '',
                dev: 4,
                channel: '',
                os: '',
                screen_resolution: ''
            };

            if (!request.data['userId'] && !!loginInfo) {
                defaultParams.userId = loginInfo.userId || '';
            }
            if (!request.data['token'] && !!loginInfo) {
                defaultParams.token = loginInfo.token || '';
            }
            request.url = proxyUrl;
            request.data = Utils.assign({}, defaultParams, request.data);

            var sign = '';
            var postfix = 'quanyan2016';
            var userCookiesName = env === 'TEST' ? 'be299fac230285f529c73ef190c5c44ac3cdd68e' : '6f03efc5c06e0bad74c7b19b55468236b5709d81';
            if (toString.call(request.data) === '[object Object]') {
                sign = md5.hex_md5(JSON.stringify(request.data) + postfix);
            } else {
                sign = md5.hex_md5(request.data + postfix);
            }

            if (!request.headers.has('sign')) request.headers.set('sign', sign);
            if (!request.headers.has('userCookiesName')) request.headers.set('userCookiesName', userCookiesName);
            request.headers.set('Content-Type', 'application/json');
            break;
    }
    request.body = request.data;
    if (request.method.toUpperCase() === 'GET') {
        request.params = request.data;
    }

    next();
}
