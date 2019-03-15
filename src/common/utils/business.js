/**
 * 业务逻辑用到的工具函数
 */

import {isArray, each} from './lang';

/*eslint-disable*/
export const RegexMap = {
    // 制表符
    table: /\t/g,
    // 换行符
    line: /\n/g,
    // 正负整数或浮点数
    intOrFloat: /^(-)?\d+(\.\d+)?$/,
    // 组织机构代码
    enterpriseCode: /^[a-zA-Z0-9]{8}\-[a-zA-Z0-9]$/,
    // 工商执照注册号
    enterpriseRegCode: /^\d{13}$|^\d{15}$/, //   以前是13位,08年以后变15位
    // 身份证
    idCard: /^\d{15}$|^\d{18}$|^\d{17}(\d|X|x)$/,
    // 手机号码
    MobileNo: /^1[34587]\d{9}$/,
    // 银行卡号（大于或等于16位的数字）
    CardNo: /^\d{16,}$/,
    // 短验证码（6位数字以上）
    MobileCode: /^\d{6,}$/,
    // 交易密码(6-16位数字或字母)
    OrderPassword: /^\S{6,16}$/,
    // 千分位正则
    parseThousands: /(\d{1,3})(?=(\d{3})+(?:$|\.))/g,
    // 每4位字符用空格隔开
    bankCardNo: /(\d{4})(?=\d)/g,
    // 金额检测
    moneyTest: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
    // 卡号屏蔽
    parseToStarNumber: /^(\d{4})(\d+)(\d{4})$/,
    // 后四位屏蔽
    parseRightFourStar: /^(\w+)(\w{4})$/,
    // 日期格式检测
    parseDateFormat: /\b(\d{4})\b[^\d]+(\d{1,2})\b[^\d]+(\d{1,2})\b(\s(\d{1,2})\:(\d{1,2})\:(\d{1,2}))?[^\d]?/,
    // 出生日期掩码，显示格式（"19**年**月*2日")
    userBirthdayStarRegex: /(\d{2})\d{2}([^\d]+)\d+([^\d]+)\d?(\d)([^\d]+)?/,
    // 金额转换
    moneyReplace: /[^0-9\.]/g,
    // POS机编号
    posNumberREG: /^[0123456789]\d{14}$/,
    // lufax's name
    lufaxName: /^[a-zA-Z0-9-_]{4,30}$/g,
    // 手机号格式化
    mobileNum: /^(\d{3})(\d{4})(\d{4})$/
};

export const RegexReplacement = {
    parseThousands: '$1,',
    parseToStarNumber: function ($0, $1, $2, $3) {
        return $1 + $2.replace(/\d/g, '*') + $3;
    },
    parseRightFourStar: function ($0, $1, $2) {
        return $1.replace(/\w/g, '*') + $2;
    }
};

export const parseThousands = function (priceVal) {
    return ((priceVal || '0') + '').replace(RegexMap.parseThousands, RegexReplacement.parseThousands);
};

/**
 * 本地数据操作
 * @param key
 * @param value
 * @param type{0-localStorage, 1-sessionStorage}
 */
export function data (key, value, type) {
    var storage = localStorage;
    if (type && (type === '1' || type === 1)) {
        storage = sessionStorage;
    }
    var getItemValue = function () {
        var data = storage.getItem(key);
        try {
            data = JSON.parse(data);
        } catch (e) {
            console.error(e.message);
        }
        return data;
    };

    if (key && value === undefined) {
        return getItemValue();
    } else if (key && value === null) {
        storage.removeItem(key);
    } else {
        storage.setItem(key, JSON.stringify(value));
    }
};

/**
 * 获取填写身份证相关的信息
 * @ param str 截取的出生日期字符串 或 身份证号
 * @ param type 传入第二个值是证明需返回的是string，否则是boolean
 * 检测身份证中的日期是否有效
 *
 */
export function strDateTime (str, type) {
    type = type || true;
    // 如果传入的是身份证号时，从第6位开始截取8个字符
    if (str.length === 18) {
        str = str.substr(6, 8);
    }
    var r = str.match(/^(\d{1,4})(-|\/)?(\d{1,2})\2(\d{1,2})$/);
    if (r == null) return false;
    var d = new Date(r[1], r[3] - 1, r[4]);
    var now = new Date();
    var minDate = new Date('1900-01-01');
    var maxDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // 如果不符合最大当前日期，最小1900年1月1日，则不通过日期校验
    if (d < minDate || d > maxDate) {
        return false;
    }
    if (type) {
        return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '月';
    }

    return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]);
};

// 判断对象中属性的值为空的个数
export function isEmptyAttrValObject(obj) {
    var count = 0;
    if (isArray(obj)) {
        for (var i = 0, len = obj.length; i < len; i++) {
            count = filter(obj[i], function (val) {
                return !!val == false;
            }).length;
        }
    } else {
        count = filter(obj, function (val) {
            return !!val == false;
        }).length;
    }
    return !!count;

};

function filter(obj, callback) {
    if (!obj) return;
    var arr = [];
    each(obj, (val) => {
        if (callback(val)) arr.push(val)
    })
    return arr;
}
/** 金额格式化
 * @param s : number | string 类型，需要格式化的金额
 * @param n : number ，保留的小数点位数
 * @exmaple formatMoney(90, 1) 输出90.0
 * */
export function formatMoney(s, n) {
    if (!s && s !== 0) return s
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
    t = "";
    for (i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
};
/** 转换日期格式
 * @param date : 日期格式|String类型 (如：'2012-12-12' | '2012年12月12日' | new Date())
 * @param format : String类型 （如: 'yyyy年MM月dd日'或'yyyy年MM月dd日 hh时mm分ss秒',默认'yyyy-MM-dd'）
 * @example C.parseDateFormat(new Date(), 'yyyy年MM月dd日') 输出："2014年04月29日"
 * @example C.parseDateFormat(new Date()) 输出："2014-04-29"
 * @exmaple C.parseDateFormat("2014-05-07 16:09:47","yyyy年MM月dd日 hh时mm分ss秒")
 *          输出："2014年05月07日 16时09分47秒"
 **/
export function parseDateFormat(date, format) {
    if (!date) {
        return date;
    }
    if (!isNaN(date) && String(date).length == 8) {
        date = (date + '').replace(/^(\d{4})(\d{2})(\d{2})$/, "$1/$2/$3");
    }
    var addZero = function (val) {
        return /^\d{1}$/.test(val) ? '0' + val : val;
    };
    format = format || 'yyyy-MM-dd';
    var year = '',
        month = '',
        day = '',
        hours = "",
        minutes = "",
        seconds = "";
    if (typeof date == 'string') {
        var dateReg = RegexMap.parseDateFormat;
        var dateMatch = date.match(dateReg);
        if (dateMatch) {
            year = dateMatch[1];
            month = dateMatch[2];
            day = dateMatch[3];
            hours = dateMatch[5];
            minutes = dateMatch[6];
            seconds = dateMatch[7];
        }
    } else {
        year = date.getFullYear();
        month = date.getMonth() + 1;
        day = date.getDate();
        hours = date.getHours();
        minutes = date.getMinutes();
        seconds = date.getSeconds();
    }
    month = addZero(month);
    day = addZero(day);
    hours = addZero(hours);
    minutes = addZero(minutes);
    seconds = addZero(seconds);
    return format.replace('yyyy', year).replace('MM', month).replace('dd', day).replace("hh", hours).replace("mm", minutes).replace("ss", seconds);
};

// 为界面金额添加分隔逗号
export function regMoneyAndDou(money) {
    if (money == '0') {
        return '0';
    }
    money = money.toString();
    var source = money.replace(/,/g, '').split('.');
    source[0] = source[0].replace(/(\d)(?=(\d{3})+$)/ig, '$1,');
    if (source[1]) {
        money = source[0] + "." + source[1];
    } else {
        money = source[0];
    }
    return money;
};

// 每4个字符用空格隔开
export function formatCardNo(num) {
    num = num.toString();
    return num.replace(RegexMap.bankCardNo, '$1 ').replace(/\s*$/, '');
};

// 手机号码每4个字符用空格隔开
export function formatMobileNo(num) {
    num = num + '';
    return num.replace(RegexMap.mobileNum, '$1 $2 $3').replace(/\s*$/, '');
};
/**
 * 费率小数换算
 * 如：后台返回费率均是%之前的返回数据，即：如果费率为0.78%，后台实际返回0.0078.前端要做%处理。
 * 0.07--->0.0070--->00.70--->0.70
 * 0.0078--->0.0070--->00.70--->0.70
 * 0.00792--->0.0079--->00.79--->0.79
 * 0.1278--->0.1270--->12.70--->12.70
 */
export function toChangeXS(num) {
    var temp = num.toString();
    if (temp.length <= 5) {
        var cha = 6 - temp.length;
        for (var i = 0; i < cha; i++) {
            temp = temp + "0";
        }
    } else if (temp.length <= 6) {
        temp = temp.substring(0, 5) + "0";
    } else {
        temp = temp.substring(0, 6);
    }
    var index = temp.indexOf(".");
    var start = temp.substring(2, 4);
    var end = temp.substring(4, 6);
    if (start.indexOf(0) == "0") {
        start = start.substring(1);
    }
    return start + "." + end;
};
/**
 * 小数加法运算，并保证小数点保留两位小数
 */
export function accAdd(arg1, arg2) {
    var r1, r2, m;
    try {
        r1 = arg1.toString().split(".")[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split(".")[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2));
    var value = (arg1 * m + arg2 * m) / m;
    if (value.toString().indexOf(".") == -1) {
        value = value + ".00";
    } else {
        var afterDoitLen = value.toString().substring(value.toString().indexOf("."), value.toString().length).length;
        if (afterDoitLen < 3) {
            var cha = 3 - afterDoitLen;
            for (var i = 0; i < cha; i++) {
                value = value + "0";
            }
        }
    }
    return value;
};
/**
 * 计算month月day日的日期+monthDays间隔天数（其实就是这个月month的天数）之后的日期
 * 如果当前day>这个月的天数，就说明是下一个月的了，求取多出的天数nextDay
 * 返回{month：加后的月份，day：加后的日}
 */
export function calcDay(month, day, monthDays) {
    var self = this,
        nextDay = 0;
    if (day > monthDays) {
        nextDay = day % monthDays;
    }
    if (nextDay != 0) {
        month = month + 1;
        if (month == 13) { //加到下一年
            month = 1;
        }
        day = nextDay;
    }
    return {
        month: month,
        day: day
    };
}
export function leapYear(year) {
    year = parseInt(year);
    return !(year % (year % 100 ? 4 : 400));
};

/**
 * 转义<>, 页面带出数据时需先调用该方法替换，避免跨站脚本攻击
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
export function escape(str) {
    return str ? str.toString().replace(/[<]/g, '&lt;').replace(/[>]/g, '&gt;').replace(/\\"/g, '&quot;') : '';
};

/**
 * 时间戳转日期格式字符串
 * @param timestamp: 时间戳，string类型（如 1471512589）
 * @param fomat: string类型 （如: 'yyyy年MM月dd日'或'yyyy年MM月dd日 hh时mm分ss秒',默认'yyyy-MM-dd'）
 * @example parseTimestamp("1471512589", "yyyy年MM月dd日 hh时mm分ss秒")  输出 2016年08月18日 17时29分49秒
 * */
export function parseTimestamp (timestamp, format) {
    if (!timestamp || !/^\d+$/.test(timestamp)) {
        timestamp = 0;
    }
    var addZero = function (val) {
        return /^\d{1}$/.test(val) ? '0' + val : val;
    };
    format = format || 'yyyy-MM-dd';
    var year = '',
        month = '',
        day = '',
        hours = '',
        minutes = '',
        seconds = '';
    var date = new Date(timestamp * 1000);

    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    hours = date.getHours();
    minutes = date.getMinutes();
    seconds = date.getSeconds();

    month = addZero(month);
    day = addZero(day);
    hours = addZero(hours);
    minutes = addZero(minutes);
    seconds = addZero(seconds);

    return format.replace('yyyy', year).replace('MM', month).replace('dd', day).replace("hh", hours).replace("mm", minutes).replace("ss", seconds);
};
/**
 * 米转千米
 * @param meter: number|string 类型
 * @param num: number类型 保留的小数点个数,默认保留3位小数
 * @param 输出 千米
 * */
export function parseMeterToKM(meter, num) {
    if (!meter) {
        return meter;
    }
    if (!/^\d+$/.test(meter)) {
        return meter;
    }
    num = num || 3;
    return (meter / 1000).toFixed(num);
};
/** 字符串截断
 * @param str: string | number 类型，需要截断的字符串
 * @param num: number 类型，需要截取的字符个数,默认截取20个字符
 * @example: cutOffString("abcdefg", 3)， 输出 "abc..."
 * */
export function cutOffString(str, num) {
    if (!str) {
        return '';
    }
    num = num || 20;
    if (str.length > num) {
        str = str.substr(0, num) + '...';
    }
    return str;
};

export function _getRad(d) {
    return d * Math.PI / 180.0;
};

/**
 * 计算两个经纬度间的距离
 * @param lat1 :number 类型, 起始点纬度
 * @param lng1 :number 类型, 起始点经度
 * @param lat2 :number 类型, 终点纬度
 * @param lng2 :number 类型, 终点经度
 * @example getFlatternDistance(10.555,20.6666,12.1111,21.3333), 输出186882.29326607854 （单位 米）
 * */
export function getFlatternDistance(lat1, lng1, lat2, lng2) {
    var self = this;
    var EARTH_RADIUS = 6378137.0;
    var f = self._getRad((lat1 + lat2) / 2);
    var g = self._getRad((lat1 - lat2) / 2);
    var l = self._getRad((lng1 - lng2) / 2);
    var sg = Math.sin(g);
    var sl = Math.sin(l);
    var sf = Math.sin(f);

    var s, c, w, r, d, h1, h2;
    var a = EARTH_RADIUS;
    var fl = 1 / 298.257;

    sg = sg * sg;
    sl = sl * sl;
    sf = sf * sf;

    s = sg * (1 - sl) + (1 - sf) * sl;
    c = (1 - sg) * (1 - sl) + sf * sl;

    w = Math.atan(Math.sqrt(s / c));
    r = Math.sqrt(s * c) / w;
    d = 2 * w * a;
    h1 = (3 * r - 1) / 2 / c;
    h2 = (3 * r + 1) / 2 / s;
    return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
}
