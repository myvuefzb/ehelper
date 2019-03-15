<template>
	<!--scroll-view-->
	<div class="scroll-view" ref="area">
		<slot></slot>
    	<p class="showText" v-if="text && text.length>0">{{text}}</p>
	</div>
	<!--scroll-view-->
</template>

<script>
	export default {
		name: 'scroll-view',
		data() {
			return {

			}
		},
		props:{
      loadData: Function,
      text: String,
    },
		created: function() {
      
		},
		mounted: function() {
			this.$nextTick(()=>{
        let _this = this;
        let winHeight = window.innerHeight || window.screen.height;
        let startScrollTop = 0;//开始时的scrollTop
        let startY = 0;
        let $el = this.$refs.area;
        $el.addEventListener("touchstart",e=>{
        	startY = e.touches[0].pageY;
        },false)
        $el.addEventListener("touchend",e=>{
        	//从底部开始滑动 
        	if(this.isReachBottom()){
        		//上滑动手势
        		if(e.changedTouches[0].pageY < startY){
        			//触发loadData
							_this.$emit("loadData")
        		}
        	}
        },false)
      })
		},
		methods: {
			getScrollTop() {
					//浏览器版本兼容，解析方式可能会不一样
				return document.documentElement.scrollTop || document.body.scrollTop;
			},
			getWinHeight(){
				// 浏览器可见内容高度 || 浏览器所有内容高度(考虑到浏览器版本兼容性问题，解析方式可能会不一样)
  			return document.documentElement.clientHeight || document.body.clientHeight;
			},
			getScrollHeight() {
				let bodyScrollHeight = 0;
				let documentScrollHeight = 0;
				if (document.body) {
					bodyScrollHeight = document.body.scrollHeight;
				}
				if (document.documentElement) {
					documentScrollHeight = document.documentElement.scrollHeight;
				}
				// 当页面内容超出浏览器可视窗口大小时，Html的高度包含body高度+margin+padding+border所以html高度可能会大于body高度
				return (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
			},
			isReachBottom () {
				const scrollTop = this.getScrollTop() // 获取滚动条的高度
				const winHeight = this.getWinHeight() // 一屏的高度
				const scrollHeight = this.getScrollHeight() // 获取文档总高度
				return scrollTop >= parseInt(scrollHeight) - winHeight
			}
		},
		beforeDestroy:function(){
      //取消监听
      let $el = this.$refs.area;
      $el.removeEventListener('touchstart', function (event) {},false);
      $el.removeEventListener('touchend', function (event) {},false);

		}
	}
</script>
<style lang="less" scoped>
.scroll-view{
  position: relative;
  .showText{
    text-align: center;
    height: 100px;
    line-height: 100px;
		color: #666;
		font-size: 26px;
  }
}
</style>

