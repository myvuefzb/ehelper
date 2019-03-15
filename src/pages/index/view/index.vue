<template>
<div class="home">
    <group>
      <cell title="跳转至" value="在库查询" is-link @click.native="goLibQuery" style="height: 60px;"></cell>
      <cell title="跳转至" value="客户咨询" is-link @click.native="goClientQuery" style="height: 60px;"></cell>
      <cell title="跳转至" value="客户客户跟进" is-link @click.native="goClinetFollow" style="height: 60px;"></cell>
    </group>
</div>
</template>
<script>
import { Group, Cell, CellBox } from 'vux';
import Native from '@/common/native';
export default {
    components:{
        Group,
        Cell,
        CellBox
    },
    methods:{
        goLibQuery() {
            Native.NRouter.open({
                url:'lib-query.html'
            })
        },
        goClientQuery() {
            Native.NRouter.open({
                url:'client-query.html'
            })
        },
        goClinetFollow() {
            Native.NRouter.open({
                url:'client-follow.html'
            })
        }
    },
    mounted(){

    }
}
</script>
<style lang='less' scoped>
@import '~@/styles/base.less';

</style>
