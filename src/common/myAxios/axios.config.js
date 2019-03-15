import Qs from 'qs';
let baseUrl = process.env.BASE_API + '/api';
let config = {
  method: 'get', // default
  baseURL: baseUrl,
  transformRequest: [function (data, headers) {
    // Do whatever you want to transform the data
    return Qs.stringify(data);
  }],
  transformResponse: [function (data) {
    // Do whatever you want to transform the data
    return data;
  }],

  // `headers` are custom headers to be sent
  headers: {'X-Requested-With': 'XMLHttpRequest'},
  paramsSerializer: function (params) {
    return Qs.stringify(params, {arrayFormat: 'brackets'})
  },
  timeout: 10000, // default is `0` (no timeout)
  withCredentials: false, // default
  responseType: 'json', // default
  responseEncoding: 'utf8', // default
  xsrfCookieName: 'XSRF-TOKEN', // default
  xsrfHeaderName: 'X-XSRF-TOKEN', // default
  // `onUploadProgress` allows handling of progress events for uploads
  onUploadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },
  // `onDownloadProgress` allows handling of progress events for downloads
  onDownloadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },

  // `maxContentLength` defines the max size of the http response content in bytes allowed
  maxContentLength: 2000,
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },
  maxRedirects: 5, // default
  socketPath: null, // default

  /*  proxy: {
    host: '127.0.0.1',
      port: 9000,
      auth: {
      username: 'mikeymike',
        password: 'rapunz3l'
    }
  },*/


}
export default config;
