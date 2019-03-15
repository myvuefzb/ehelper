let Valitor = function () {
  this.cache = []
};
Valitor.prototype.add = function (msg) {
  this.cache.push(msg)
};
Valitor.prototype.start = function () {
  let cache = this.cache;
  for (let i = 0; i < cache.length; i++) {
    if (cache[i]) {
      return cache[i]
    }
  }
};
let strategy = {
  isNotEmpty: function (value, msg) {
    if (value===''|| value==null ||value&&value.length === 0||value=="null") {
      return msg
    }
  },
  isMailBox: function (value, msg) {
    let reg = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/;
    if (!reg.test(value)) {
      return msg;
    }
  },
  isMaxLength: function (value, msg, length) {
    if (value.length > length) {
      return msg;
    }
  },
  isMinLength: function (value, msg, length) {
    if (value.length < length) {
      return msg;
    }
  },
  isHomePhoneFormat: function (value, msg) {
    let reg = /^\d{3,4}\-\d{7,8}/g;
    if (!reg.test(value)) {
      return msg;
    }
  },
  identityNum: function (value, msg) {
    let reg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/g;
    if (!reg.test(value)) {
      return msg
    }
  },
  phoneNumFormat: function (value, msg) {
    let reg = /^1[3456789]\d{9}$/g;
    if (!reg.test(value)) {
      return msg
    }
  },
  chineseFormat: function (value, msg) {
    let reg = /[\u4e00-\u9fa5·]/g
    if (!reg.test(value)) {
      return msg
    }
  },
  numberFormat:function(value,msg){
    let reg = /^[\d]+$/g;
    if (!reg.test(value)) {
      return msg
    }
  },
  /*人行登录名*/
  bankUserName: function (value, msg) {
    let reg = /[A-z\d\/\\_\-]+/;
    if (!reg.test(value)) {
      return msg
    }

  },
  isMaxValue:function (value,maxValue,msg) {
    value=parseFloat(value);
    maxValue=parseFloat(maxValue);
    if(value>maxValue){
      return msg
    }
  },
  isMinValue:function(value,minValue,msg){
    value=parseFloat(value);
    minValue=parseFloat(minValue);
    if(value<minValue){
      return msg
    }
  },
  decimalByTwoFormat:function (value,msg) {
    let reg= /^[1-9][0-9]*\.?\d{0,2}$/;
    if(!reg.test(value)){
      return msg;
    }
  },
  decimalByStock:function (value,msg) {
    let reg= /^[0-9]*\.?\d{0,2}$/;
    if(!reg.test(value)){
      return msg;
    }
  },
  landLineTelephoneFormat:function (value,msg) {
    /*固定电话*/
    let reg=/(^\d{3,4}-\d{7,8}$)|(^\d{3,4}-\d{7,8}-\d{1,4}$)/;
    if(!reg.test(value)){
      return msg
    }

  },
  // 验证手机号码
  checkCellPhone: function (value, msg) {
    let reg = /^1[34578]\d{9}$/g;
    if(!reg.test(value)){
      return msg
    }
  },
  // 验证身份证id
  checkCardno: function (value, msg) {
    let reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
    if(!reg.test(value)){
      return msg
    }
  },
  // 验证中文姓名
  checkChineseName: function (value, msg) {
    let reg = /^[\u4e00-\u9fa5]{2,4}$/g;
    if(!reg.test(value)){
      return msg
    }
  },
  // 验证邮箱
  checkEmail: function (value, msg) {
    let reg = /^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/g;
    if(!reg.test(value)){
      return msg
    }
  },
};
export {
  Valitor,
  strategy
}
