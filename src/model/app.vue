<template>
  <div id="app">
    <transition name="page">
      <router-view  class="child-view"></router-view>
    </transition>
  </div>
</template>

<script>
  import pageApp from './../common/mixins/pageApp';
  export default {
    mixins: [pageApp]
  }
</script>

<style lang='postcss'>
@import '@/styles/variables.css';
body,html,#app{
  height: 100%;
}
.child-view {
  position: absolute;
  top: -1px;
  left: 0;
  right: 0;
  bottom: 0;
  padding-top: 1px;
  transition: all .3s cubic-bezier(.55,0,.1,1);
}
.slide-left-enter, .slide-right-leave-active {
  opacity: 0;
  transform: translate(100%, 0);
  transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active, .slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>
