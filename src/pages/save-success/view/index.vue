<template>
<div class="home">
    <save-success></save-success>
</div>
</template>
<script>
import SaveSuccess from '@/components_custom/save-success';
import Native from '@/common/native';
import utils from "@/common/utils";
const {
      getParameter
    } = utils;
export default {
    components: {
        SaveSuccess
    },
    methods:{
        
    },
    mounted(){
        Native.NUI.setHeader({
            title:'保存成功',
            isBack: true
        })
    }
}
</script>
<style lang='less' scoped>
@import '~@/styles/base.less';

</style>
