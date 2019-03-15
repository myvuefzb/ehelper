import {each, assign, data} from './utils/lang';
import Flag from './flag';
import Constant from './constant';

var Account = function () {};

Account.prototype = {

    Flag: assign(Flag, {}),

    // 是否登录
    isLogin: function () {
        return !!data(Constant.DataKey.USER_LOGIN_INFO);
    },

    // 退出
    logout: function () {
        each([
            Constant.DataKey.USER_LOGIN_INFO
        ], function (item) {
            data(item, null);
        });
    }
};

export default new Account();
