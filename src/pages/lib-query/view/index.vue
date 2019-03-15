<template>
<div class="lib-query">
    <div class="box">
        <my-line-input item-name="姓名" v-model="cardName" placeholder="请输入姓名"></my-line-input>
        <my-line-input item-name="身份证号码" v-model="cardId" placeholder="请输入身份证号码" :left-text-width="140"></my-line-input>
        <box gap="30px 30px 0px 30px">
            <x-button type="warn" class="custom-warm-blue" :class="{'custom-warm-disabled': !cardName || !cardId}"  @click.native="query" :disabled="!cardName || !cardId">查询</x-button>
        </box>
    </div>
    <div class="search-content-wrap" v-if="searchResultFlag">
        <div class="search-content">
            <div class="search-title">客户基本资料</div>
            <div  v-if="searchResult.Customers && searchResult.Customers.length">  
                <div class="search-item" v-for=" (customer, index) in searchResult.Customers" :key="customer.Code" :class="{'mt-10': index>0}">
                    <p><span class="item-name">创建机构:</span><span class="item-content">{{customer.FrameWorkName}}</span></p>
                    <p><span class="item-name">姓名：</span><span class="item-content">{{customer.CustomerName}}</span></p>
                </div>
            </div>
            <div class="search-item" v-else><div class="none-record">暂无记录</div></div>
        </div>
        <div class="search-content" v-if=" searchResult.QuerystartLogs && searchResult.QuerystartLogs.length">
            <div class="search-title">查询日志 <span class="more" @click="more('log',searchResult.QuerystartLogs)" v-if="searchResult.QuerystartLogs.length>3">更多<i class="more-icon"></i></span></div>
            <div class="search-item" v-for=" (log, index) in searchResult.QuerystartLogs" :key="log.Num" :class="{'mt-10': index>0}" v-if="index<3">
                <p><span class="item-name">查询部门：</span><span class="item-content">{{log.DepartName}}</span></p>
                <p><span class="item-name">查询时间：</span><span class="item-content">{{log.ConsultDate}}</span></p>
                <p><span class="item-name">查询人：</span><span class="item-content">{{log.QueryName}}</span></p>
            </div>
        </div>
        <div class="search-content"  v-if=" searchResult.BackPlan && searchResult.BackPlan.length">
            <div class="search-title">还款历史<span class="more" @click="more('backPlan',searchResult.BackPlan)" v-if="searchResult.BackPlan.length>3">更多<i class="more-icon"></i></span></div>
            <div class="search-item" v-for=" (backPlan, index) in searchResult.BackPlan" :key="index" :class="{'mt-10': index>0}" v-if="index<3">
                <p><span class="item-name">日期:</span><span class="item-content">{{backPlan.checkplandateText}}</span></p>
                <p><span class="item-name">业务类型：</span><span class="item-content">{{backPlan.loantype}}</span></p>
                <p><span class="item-name">状况：</span><span class="item-content">{{backPlan.backmoneytest}}</span></p>
            </div>
        </div>
        <div class="search-content" v-if=" searchResult.ReCode && searchResult.ReCode.length">
            <div class="search-title">借款历史<span class="more" @click="more('reCode',searchResult.ReCode)" v-if="searchResult.ReCode.length>3">更多<i class="more-icon"></i></span></div>
            <div class="search-item" v-for=" (reCode, index) in searchResult.ReCode" :key="index" :class="{'mt-10': index>0}" v-if="index<3">
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
        <div class="search-content" v-if="searchResult.SpouseApply && searchResult.SpouseApply.length">
            <div class="search-title">配偶贷款信息<span class="more" @click="more('spouseApply',searchResult.SpouseApply)" v-if="searchResult.SpouseApply.length>3">更多<i class="more-icon"></i></span></div>
            <div class="search-item" v-for=" (spouseApply, index) in searchResult.SpouseApply" :key="index" :class="{'mt-10': index>0}" v-if="index<3">
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
        <div class="search-content" v-if=" searchResult.Refuse && searchResult.Refuse.length">
            <div class="search-title">拒贷历史及原因<span class="more" @click="more('refuse',searchResult.Refuse)" v-if="searchResult.Refuse.length>3">更多<i class="more-icon"></i></span></div>
            <div class="search-item" v-for=" (refuse, index) in searchResult.Refuse" :key="index" :class="{'mt-10': index>0}" v-if="index<3">
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
        <div class="search-content" v-if=" searchResult.Doubtfuls && searchResult.Doubtfuls.length">
            <div class="search-title">可疑客户信息<span class="more" @click="more('doubtfuls',searchResult.Doubtfuls)" v-if="searchResult.Doubtfuls.length>3">更多<i class="more-icon"></i></span></div>
            <div class="search-item" v-for=" (doubtful, index) in searchResult.Doubtfuls" :key="index" :class="{'mt-10': index>0}" v-if="index<3">
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
        <div class="search-content" v-if=" searchResult.BlackCustomers  && searchResult.BlackCustomers.length">
            <div class="search-title">黑名单信息<span class="more" @click="more('blackCustomer',searchResult.BlackCustomers)" v-if="searchResult.BlackCustomers.length>3">更多<i class="more-icon"></i></span></div>
            <div class="search-item" v-for=" (blackCustomer, index) in searchResult.BlackCustomers" :key="index" :class="{'mt-10': index>0}" v-if="index<3">
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
    <div class="confirm-layout" v-transfer-dom>
      <confirm
        v-model="showConfirm"
        :confirm-text="confirmBtnText"
        @on-confirm="onConfirm">
        <p style="text-align:center;">{{confirmText}}</p>
      </confirm>
    </div>
</div>
</template>
<script>
import MyLineInput from '@/components_custom/my-line-input';
import {Valitor, strategy} from '@/common/validForm';
import { XButton ,Flexbox , FlexboxItem, Box, Confirm, TransferDomDirective as TransferDom } from 'vux';
import Native from '@/common/native';
import request from '@/common/request';
export default {
components:{
    MyLineInput,
    XButton,
    Flexbox ,
    FlexboxItem,
    Box,
    Confirm
  },
  directives:{
    TransferDom
  },
  data(){
      return {
          cardName: '',
          cardId: '',
          showConfirm: false,
          confirmBtnText: '确定',
          confirmText: '身份证号码和姓名输入不匹配请核对后重新输入！',
          isNewClientMessage: false,
          searchResultFlag: false,
          searchResult: {}
      }
  },
  methods: {
      getloginInfo() {
          Native.NRouter.getUserLoginInfo({'callback': 'getUserLoginInfo'});
        // let loginInfo = localStorage.getItem('loginInfo');
        // if (!loginInfo) {
        //   Native.NRouter.getUserLoginInfo({'callback': 'getUserLoginInfo'});
        // }
      },
    setHeader(myTitle){
        Native.NUI.setHeader({
            'title':myTitle,
            isBack: true
        })
    },
    // 验证
    validAll() {
        let msgNot = '请填写';
        let formatError = '格式有误';
        let validObj = new Valitor();
        validObj.add(strategy.isNotEmpty(this.cardName, msgNot + '姓名'));
        validObj.add(strategy.checkChineseName(this.cardName, '输入姓名'+formatError));
        validObj.add(strategy.isNotEmpty(this.cardId, msgNot + '身份证号'));
        validObj.add(strategy.checkCardno(this.cardId, '输入身份证号码'+formatError));
        return validObj.start();
    },
    query () {
        let resultMsg = this.validAll();
        if (resultMsg) {
            this.$toast({
                message: resultMsg,
                duration: 2000
            });
            return false;
        }
        const loginInfo = JSON.parse(window.localStorage.getItem("loginInfo"));
        this.searchResultFlag= false;
        this.$axios({
          url: '/Apply/GetCardCertification',
          data: {
              CustomerName: this.cardName,
              IDCARD: this.cardId,
              UserGuid: loginInfo.UserGuid
          },
          method: 'post',
          typeName: '85',
          showLoading: true
        }).then((success) => {
          if (success && success.data.Model) {
            this.$axios({
                url: '/apply/GetAppSelects',
                data: {
                    CustomerName:this.cardName,
                    IDCARD:this.cardId,
                    UserGuid:loginInfo.UserGuid,
                    DepetGuid:loginInfo.DepartmentGuid
                },
                method: 'post',
                typeName: '85',
                showLoading: true

            }).then((getAppSelects) => {
                if(getAppSelects && getAppSelects.data.Model && getAppSelects.data.Model.Result) {
                    if(getAppSelects.data.Model.Result.Customers && getAppSelects.data.Model.Result.Customers.length) {
                        this.searchResultFlag= true;
                        this.searchResult= getAppSelects.data.Model.Result;
                    } else {
                        this.confirmBtnText='新增';
                        this.confirmText= '客户在系统中不存在';
                        this.isNewClientMessage= true;
                        this.showConfirm= true;
                    }
                    
                } else {
                    this.$toast(getAppSelects.data.Message);
                }
            },(error)=> {
                console.log(error);
            })
          } else {
            this.confirmBtnText='确定';
            this.confirmText= '身份证号码和姓名输入不匹配请核对后重新输入！';
            this.isNewClientMessage= false;
            this.showConfirm= true;
          }
        }, function (error) {
          console.log(error);
        })
       
        
    },
    // 更多
    more (type,data) {
        if(type && data) {
            let moreInfoStr= JSON.stringify(data);
            localStorage.setItem('queryMoreInfo', moreInfoStr);
            Native.NRouter.open({
                data: {
                    type: type
                },
                url:'lib-query_more.html'
            })
        }
        
    },
    onConfirm () {
        if(this.isNewClientMessage) {
            Native.NRouter.open({
                data:{
                cardName: this.cardName,
                cardId: this.cardId
                },
                url:'client-query.html'
            })
        }
        
    }
  },
  mounted () {
      this.setHeader('在库查询');
  },
  created() {
      this.getloginInfo();
  }
}
</script>
<style lang='less'>
@import '~@/styles/base.less';
.confirm-layout {
    .weui-dialog__btn_primary {
        color: #44A4EF;
    }
}
.lib-query {
    height: 100%;
    padding-bottom: 40px;
    background-color: #f4f4f4;
    .search-content-wrap {
        background-color: #f4f4f4;
        padding-bottom: 60px;
    }
    .box {
        margin-top: 20px;
        padding-bottom: 60px;
        background-color: #ffffff;
        .box-item {
            border-bottom: solid 1px #f0f0f0;
            .box-item-content {
                position: relative;
                padding-left: 20px;
                font-size: 32px;
                color: #1A1A1A;
                .write {
                    height: 126px;
                }
                .error {
                    position: absolute;
                    left: 10px;
                    top: 48px;
                    color: #ff0000;
                }
                input::-webkit-input-placeholder {
                    color: #D7D7D7;
                    font-size: 28px;
                }
            }

        }
        .custom-warm-blue {
            height: 80px;
            border-radius: 5px!important;
            border-color: #44A4EF!important;
            background-color: #44A4EF;
            color:#efefef!important;
            font-size: 32px;
            &:active {
                border-color: #44A4EF!important;
                color:#efefef!important;
                background-color: #44A4EF;
            }
        }
        .custom-warm-blue.custom-warm-disabled {
            background-color: #dcdada;
            border-color: #eee !important;
            color: #fff !important;
        }
    }
    .search-content {
        padding-left: 30px;
        padding-right: 30px;
        .none-record {
            height: 120px;
            text-align: center;
            padding-top: 60px;
            font-size: 28px;
            font-weight: 700;
        }
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
            .more {
                position: absolute;
                display: block;
                width: 90px;
                height: 32px;
                right: 0px;
                top: 0;
                font-size: 28px;
                line-height: 32px;
                color:#44A4EF;
                .more-icon {
                    position: absolute;
                    display: inline-block;
                    right: 0;
                    top: 0;
                    height: 32px;
                    width: 32px;
                    background: url(~@/assets/img/next.png) no-repeat center center;
                }
            }
        }
        .mt-10 {
            margin-top: 10px;
        }
        .search-item {
            padding-left: 19px;
            padding-right: 19px;
            padding-bottom: 19px;
            background-color: #FFFEFF;
            border-radius: 4px;
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
}
</style>
