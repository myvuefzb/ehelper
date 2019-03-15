import axios from 'axios';
import config from './axios.config';
import {hideLoading, showLoading} from './axios.loading'
import VcToast from '@/components/toast'

const axiosInstance = axios.create(config);

let baseUrlObj = {
  '93': process.env.BASE_API, //port
  '85': process.env.OTHER_API,
};

axiosInstance.interceptors.request.use(function (config) {
  // Do something before request is sent
  if (config.typeName) {
    config.url = (config.typeName ? baseUrlObj[config.typeName] : baseUrlObj['93']) + '/api' + config.url;
  }

  if (config.showLoading) {
    /*config.showLoading 类型 boolean | string*/
    let loadingText;
    if (typeof config.showLoading === 'string') {
      loadingText = config.showLoading
    }
    showLoading(loadingText)
  }
  // if(config.method&&config.method.toLowerCase()==='post'){
  //   config.data=config.paramsSerializer(config.data);
  // }
  return config;
}, function (error) {
  // Do something with request error
  VcToast({message: '请求错误', duration: 2000});
  return Promise.reject(error);
});

// Add a response interceptor
axiosInstance.interceptors.response.use(function (response) {
  // Do something with response data

  if (response.config.showLoading) {
    hideLoading()
  }

  let resData = response.data;
  resData.ResultType = parseInt(response.data.ResultType);
  if (resData) {
    switch (resData.ResultType) {
      /*resData.ResultType===0 成功*/
      case 0:
        break;
      case 1:
        VcToast({message: (resData.Message ? resData.Message : 'response error:' + '参数错误'), duration: 2000});
        break;
      case 2:
        VcToast({message: (resData.Message ? resData.Message : 'response error:' + '逻辑错误'), duration: 2000});
        break;
      case 3:
        VcToast({message: (resData.Message ? resData.Message : 'response error:' + '内部错误'), duration: 2000});
        break;
      case 4:
        VcToast({message: (resData.Message ? resData.Message : 'response error:' + '认证错误'), duration: 2000});
        break;
      default:
        VcToast({message: 'response error:' + '其他错误', duration: 2000});
        break;
    }
  }

  return response;
}, function (error) {

  if (error.config.showLoading) {
    hideLoading()
  }
  if (error.response && error.response.data) {
    VcToast({
      message: (error.response.data.retMsg) ? (error.response.data.retMsg) : ('response code:' + error.response.status),
      duration: 2000
    });
  } else {
    if (error.message && (error.message.indexOf('timeout') >= 0)) {
      VcToast({message: '网络超时', duration: 2000});
    } else {
      VcToast({message: '网络异常', duration: 2000});
    }
  }

  // Do something with response error
  return Promise.reject(error);
});
export default axiosInstance
