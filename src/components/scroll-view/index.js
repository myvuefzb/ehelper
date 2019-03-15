import ScrollView from './src/scroll-view'

/* istanbul ignore next */
ScrollView.install = function(Vue) {
  Vue.component("scroll-view", ScrollView)
}

export default ScrollView
