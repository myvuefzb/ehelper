var platformAdapter = {
  callback: function (fun, obj = '', json = {}) {
    platformAdapter[fun](json);
  },
  getUserLoginInfo: function (json) {
    let oldUserDataString = window.localStorage.getItem("loginInfo");
    const loginInfo = {
      "UserLoginId": json.UserLoginId,
      "RealName": json.RealName,
      "Token": json.Token,
      "UserGuid": json.UserGuid,
      "DepartmentGuid": json.DepartmentGuid,
      "DepartmentName": json.DepartmentName,
      "APPROVETYPEGUID": json.APPROVETYPEGUID
    };
    // Native.NUI.tip({text: JSON.stringify(loginInfo)});
    // 首次登录或者退出登录换新的账号登录时reload一次
    if (!oldUserDataString) {
      window.localStorage.setItem("loginInfo", JSON.stringify(loginInfo));
      window.location.reload();
    } else {
      let oldUserData = JSON.parse(oldUserDataString);
      if (json.UserLoginId != oldUserData.UserLoginId) {
        window.localStorage.setItem("loginInfo", JSON.stringify(loginInfo));
        window.location.reload();
      }
    }

  },
  //修改保存认证信息
  saveIdentityAuthResult: function (json) {
    let loginInfo = window.localStorage.getItem('loginInfo');
    loginInfo.ISAUTHENTICATION = json.ISAUTHENTICATION;
    window.localStorage.setItem("loginInfo", JSON.stringify(loginInfo));
    window.location.reload();
  },
  //清除loginInfo
  loginOut: function () {
    window.localStorage.removeItem('loginInfo');
    window.location.reload();
  },
  // 进件申请处理恒e家传过来的数据
  initFromEFamily: function () {
    // 总共12种状态
    let init = {
      infobase: false,
      infoloan: false,
      infocontacts: false,
      assess: false,
      inspectionTable: false,
      workUnit: false,
      information: false,
      sdloan: false,
      jyloan: false,
      hsloan: false,
      rxloan: false,
      rhloan: false
    };
    window.localStorage.setItem("fromEFamilyData", JSON.stringify(init));
  },
  // 设置进件申请处理恒e家传过来的数据(传json)
  setEFromFamily: function (setJson) {
    let dataString = window.localStorage.getItem("fromEFamilyData");
    let data = JSON.parse(dataString);
    for (let i in data) {
      for (let n in setJson) {
        if (i === n) {
          data[i] = setJson[n];
        }
      }
    }
    window.localStorage.setItem("fromEFamilyData", JSON.stringify(data));
  },
  // 获取进件申请处理恒e家传过来的数据
  getEFromFamily: function () {
    let initString = window.localStorage.getItem("fromEFamilyData");
    return JSON.parse(initString);
  },
  // 清空进件申请处理恒e家传过来的数据
  cleanEFromEFamily: function () {
    window.localStorage.removeItem('fromEFamilyData');
  }
};
window.platformAdapter = platformAdapter;
if (window.Vue) {
  window.Vue.use(platformAdapter)
}

export {
  platformAdapter
}
