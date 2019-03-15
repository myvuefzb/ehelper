let needLoadingRequestCount = 0;
import Native from '../../common/native.js';
function startLoading(loadingText='加载中...') {
  /*调用原生loading*/
  Native.NUI.loading({text:loadingText})
}

function endLoading() {
  /*调用原生loading 完成*/
  Native.NUI.loadFinish();
}
function showLoading(text) {
  if (needLoadingRequestCount === 0) {
    startLoading(text)
  }
  needLoadingRequestCount++
}

 function hideLoading() {
  if (needLoadingRequestCount < 0) {
    return;
  }
  needLoadingRequestCount--;
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

export {
  showLoading,
  hideLoading
}
