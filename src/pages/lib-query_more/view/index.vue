<template>
<div class="home">
    <div class="search-content" v-if=" moreContent && moreContent.length && type==='log'">
        <div class="search-item mt-10" v-for=" (log, index) in moreContent" :key="index" >
            <p><span class="item-name">查询部门：</span><span class="item-content">{{log.DepartName}}</span></p>
            <p><span class="item-name">查询时间：</span><span class="item-content">{{log.ConsultDate}}</span></p>
            <p><span class="item-name">查询人：</span><span class="item-content">{{log.QueryName}}</span></p>
        </div>
    </div>
    <div class="search-content" v-if=" moreContent && moreContent.length && type==='backPlan'">
        <div class="search-item mt-10" v-for=" (log, index) in moreContent" :key="index" >
            <p><span class="item-name">日期：</span><span class="item-content">{{log.checkplandateText}}</span></p>
            <p><span class="item-name">业务类型：</span><span class="item-content">{{log.loantype}}</span></p>
            <p><span class="item-name">状况：</span><span class="item-content">{{log.backmoneytest}}</span></p>
        </div>
    </div>
    <div class="search-content" v-if=" moreContent && moreContent.length && type==='reCode'">
        <div class="search-item mt-10" v-for=" (reCode, index) in moreContent" :key="index" >
             <flexbox >
                <flexbox-item><p><span class="item-name">贷款日期:</span><span class="item-content">{{reCode.loanbackdateText}}</span></p></flexbox-item>
                <flexbox-item><p><span class="item-name">产品名称：</span><span class="item-content">{{reCode.LOAN_TYPE_NAME}}</span></p></flexbox-item>
            </flexbox >
            <flexbox >
                <flexbox-item><p><span class="item-name">终审决议:</span><span class="item-content">{{reCode.loantype}}</span></p></flexbox-item>
                <flexbox-item><p><span class="item-name">所属分行：</span><span class="item-content">{{reCode.objectname}}</span></p></flexbox-item>
            </flexbox >
            <flexbox >
                <flexbox-item><p><span class="item-name">产品类型:</span><span class="item-content">{{reCode.loan_group_name}}</span></p></flexbox-item>
                <flexbox-item><p><span class="item-name">在库状态：</span><span class="item-content">{{reCode.customertext}}</span></p></flexbox-item>
            </flexbox >
        </div>
    </div>
    <div class="search-content" v-if=" moreContent && moreContent.length && type==='spouseApply'">
        <div class="search-item mt-10" v-for=" (spouseApply, index) in moreContent" :key="index" >
             <flexbox >
                <flexbox-item><p><span class="item-name">姓名:</span><span class="item-content">{{spouseApply.customername}}</span></p></flexbox-item>
                <flexbox-item><p><span class="item-name">产品名称：</span><span class="item-content">{{ spouseApply.loan_group_name}}</span></p></flexbox-item>
            </flexbox >
            <flexbox >
                <flexbox-item><p><span class="item-name">身份证:</span><span class="item-content">{{ spouseApply.idcard}}</span></p></flexbox-item>
                <flexbox-item><p><span class="item-name">申请状态：</span><span class="item-content">{{ spouseApply.status_description}}</span></p></flexbox-item>
            </flexbox >
            <flexbox >
                <flexbox-item><p><span class="item-name">申请日期:</span><span class="item-content">{{ spouseApply.apply_date}}</span></p></flexbox-item>
                <flexbox-item><p><span class="item-name">所属分行：</span><span class="item-content">{{ spouseApply.objectname}}</span></p></flexbox-item>
            </flexbox >
            <flexbox >
                <flexbox-item><p><span class="item-name">在库状态:</span><span class="item-content">{{ spouseApply.customertext}}</span></p></flexbox-item>
            </flexbox >
        </div>
    </div>
    <div class="search-content" v-if=" moreContent && moreContent.length && type==='refuse'">
        <div class="search-item mt-10" v-for=" (refuse, index) in moreContent" :key="index" >
             <flexbox >
                <flexbox-item><p><span class="item-name">申请日期:</span><span class="item-content">{{refuse.applydateText}}</span></p></flexbox-item>
            </flexbox >
            <flexbox >
                <flexbox-item><p><span class="item-name">产品类型:</span><span class="item-content">{{refuse.loantype}}</span></p></flexbox-item>
            </flexbox >
            <flexbox >
                <flexbox-item><p><span class="item-name">拒贷原因:</span><span class="item-content">{{refuse.refuseText}}</span></p></flexbox-item>
            </flexbox >
        </div>
    </div>
    <div class="search-content" v-if=" moreContent && moreContent.length && type==='doubtfuls'">
        <div class="search-item mt-10" v-for=" (doubtful, index) in moreContent" :key="index" >
             <flexbox >
                <flexbox-item><p><span class="item-name">电话:</span><span class="item-content">{{doubtful.TelePhone}}</span></p></flexbox-item>
            </flexbox >
            <flexbox >
                <flexbox-item><p><span class="item-name">地址:</span><span class="item-content">{{doubtful.Address}}</span></p></flexbox-item>
            </flexbox >
            <flexbox >
                <flexbox-item><p><span class="item-name">备注:</span><span class="item-content">{{doubtful.DoubtReason}}</span></p></flexbox-item>
            </flexbox >
        </div>
    </div>
    <div class="search-content" v-if=" moreContent && moreContent.length && type==='blackCustomer'">
        <div class="search-item mt-10" v-for=" (blackCustomer, index) in moreContent" :key="index" >
            <flexbox >
                <flexbox-item><p><span class="item-name">创建机构:</span><span class="item-content">{{blackCustomer.FrameWorkName}}</span></p></flexbox-item>
                <flexbox-item><p><span class="item-name">黑名单级别:</span><span class="item-content">{{blackCustomer.LevelName}}</span></p></flexbox-item>
            </flexbox >
            <flexbox >
                <flexbox-item><p><span class="item-name">客户来源:</span><span class="item-content">{{blackCustomer.SourceName}}</span></p></flexbox-item>
                <flexbox-item><p><span class="item-name">备注:</span><span class="item-content">{{blackCustomer.Remark}}</span></p></flexbox-item>
            </flexbox >
        </div>
    </div>
</div>
</template>
<script>
import { Flexbox , FlexboxItem } from 'vux';
import Native from '@/common/native';
import utils from "@/common/utils";
const {
      getParameter
    } = utils;
export default {
    components:{
        Flexbox ,
        FlexboxItem
    },
    data() {
        return {
            type: getParameter('type'),
            moreContent:[]
        }
    },
    methods:{
        setHeader(myTitle){
            Native.NUI.setHeader({
                title:myTitle,
                isBack: true
            })
        }
    },
    mounted(){
        let content= localStorage.getItem('queryMoreInfo');
        if(this.type) {
            switch(this.type) {
                case 'log': this.setHeader('日志');break;
                case 'backPlan': this.setHeader('还款历史');break;
                case 'reCode': this.setHeader('借款历史');break;
                case 'refuse': this.setHeader('refuse');break;
                case 'spouseApply': this.setHeader('配偶贷款信息');break;
                case 'doubtfuls': this.setHeader('可疑客户');break;
                case 'blackCustomer': this.setHeader('黑名单');break;
                default: this.setHeader('更多');break;
            }
        }
        this.moreContent= JSON.parse(content);
    }
}
</script>
<style lang='less' scoped>
@import '~@/styles/base.less';
.search-content {
    padding-left: 30px;
    padding-right: 30px;
    background-color: #f4f4f4;
    padding-top: 10px;
    .search-title {
        position: relative;
        color: #1a1a1a;
        font-size: 32px;
        line-height: 32px;
        border-left: solid 6px #44A4EF;
        padding-left: 8px;
        margin-top: 30px;
        margin-bottom: 30px;
        font-weight: 700;
    }
    .search-item {
        padding-left: 19px;
        padding-right: 19px;
        padding-bottom: 19px;
        background-color: #FFFEFF;
        border-radius: 4px;
        box-shadow: 0 0 20px #ddd;
        margin-bottom: 20px;
        p {
            padding-top: 19px;
            .item-name {
                display: inline-block;
                font-size: 28px;
                color: #1A1A1A;
                font-weight: 700;
                min-width: 130px;
            }
            
            .item-content {
                font-size: 26px;
                color: #595757;
            }
        }
    }
}
</style>
