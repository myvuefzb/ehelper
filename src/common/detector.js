/**
 * 环境检测
 * @exports common/detector
 */
let detector = {};

let ua = navigator.userAgent.toUpperCase();

// 当前环境是否为IOS平台
detector.IS_IOS = /ip(hone|ad|od)/i.test(ua);
detector.IS_ANDROID = /Android\s+(\d+(\.\d+)*);/i.test(ua);
if (detector.IS_IOS) {
    /OS\s+(\d+(_\d+)*)/.test(ua);
    detector.OS_VER = RegExp['$1'].replace('_', '.');
    /AppleWebKit\/(\d+(\.\d+)*)/i.test(ua);
    detector.BROWSER_VER = RegExp['$1'];
} else if (detector.IS_ANDROID) {
    // 当前环境是否为Android平台
    // Mozilla/5.0 (Linux; Android 4.4.4; MI 3 Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/33.0.0.0 Mobile Safari/537.36
    detector.OS_VER = RegExp['$1'];

    /AppleWebKit\/(\d+(\.\d+)*)/i.test(ua);
    detector.BROWSER_VER = RegExp['$1'];
}

// hybrid
// hybrid/0.1.234 (env/DEVELOPMENT; build/1231324)
// hybrid/1.0.0 (env/stg1; build/1.0.0)

// Lark APP
// Mozilla/5.0 (Linux; Android 6.0; GO N3S Build/MRA58K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/44.0.2403.119 Mobile Safari/537.36 lark/2.5 (env/QA)
// Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_3 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13G34 lark/2.6 (env/DEV; build/1)
// @todo Native没有标准化useragent，app name and 分号错误
detector.IS_APP = /lark\/(\d+(\.\d+)*)\s*\(((\w+\/[.\-\w]+[;:]?\s*)*)\)/i.test(ua);
detector.IS_WECHAT = /MICROMESSENGER\/(\d+(\.\d+)*)/i.test(ua);
if (detector.IS_APP) {
    detector.APP_VER = RegExp['$1'];
    let fields = RegExp['$3'];
    fields = fields.split(/[;:\s]+/i);
    Array.isArray(fields) && fields.forEach(function (v) {
        v = v.split('/');
        detector[ 'APP_' + v[0] ] = v[1];
    });
} else if (detector.IS_WECHAT) {
    // Mozilla/5.0 (iPhone; CPU iPhone OS 5_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9B176 MicroMessenger/4.3.2
    // Mozilla/5.0 (Linux; U; Android 2.3.6; zh-cn; GT-S5660 Build/GINGERBREAD) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1 MicroMessenger/4.5.255
    detector.APP_VER = RegExp['$1'];
}

detector.IS_BROWSER = !(detector.IS_APP || detector.IS_WECHAT);

export default detector;
