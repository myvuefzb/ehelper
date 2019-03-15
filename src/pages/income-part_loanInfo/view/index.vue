<template>
  <div class="income-part">
    <my-line-input item-name="产品类型:">
      <group v-if="formObj.produceTypeArr">
        <popup-picker v-model="formObj.produceType" :data="formObj.produceTypeArr" show-name :columns="1"
                      placeholder="请选择"></popup-picker> <!--@on-change="revProductType" -->
      </group>
    </my-line-input>
    <my-line-input item-name="产品名称：">
      <group>
        <popup-picker v-model="formObj.produceName" :data="formObj.produceNameArr" show-name :columns="1"
                      placeholder="请选择"></popup-picker> <!-- @on-change="revProduceName"-->
      </group>

    </my-line-input>
    <my-line-input item-name="工作性质：">
      <group>
        <popup-picker v-model="formObj.jobNature" :data="formObj.jobNatureArr" show-name :columns="1"
                      placeholder="请选择"></popup-picker>
      </group>
    </my-line-input>
    <my-divide-line></my-divide-line>
    <my-line-input item-name="申请金额：" v-model="formObj.loanAmount"></my-line-input>
    <my-line-input item-name="申请期限：">
      <group v-if="formObj.termArr">
        <popup-picker v-model="formObj.term" :data="formObj.termArr" :columns="1" show-name
                      placeholder="请选择"></popup-picker>
      </group>
      <span v-else></span>
    </my-line-input>
    <my-line-input item-name="借款目的：">
      <group>
        <popup-picker v-model="formObj.loanPurpose" :data="formObj.loanPurposeArr" placeholder="请选择" :columns="1"
                      show-name></popup-picker>
      </group>
    </my-line-input>

    <my-line-input :is-required="false" item-name="资金缺口：" v-model="formObj.moneyGap"></my-line-input>
    <my-line-input :is-required="false" item-name="可承受月还款额：" v-model="formObj.monthCanRepay"
                   :left-text-width="140"></my-line-input>
    <my-line-input item-name="是否有同行借款历史：" :left-text-width="160">
      <my-check-radio v-model="formObj.isCounterpart"></my-check-radio>
      <!--<group>
        <popup-picker v-model="formObj.peerHistory" :data="formObj.peerHistoryArr" :columns="1"  placeholder="请选择" show-name></popup-picker>
      </group>-->
    </my-line-input>
    <my-line-input item-name="贷款总额：" v-model="formObj.totalLoanAmount" v-if="formObj.isCounterpart"></my-line-input>
    <my-divide-line></my-divide-line>
    <my-line-input item-name="申请分行：" v-model="formObj.applyBranchStr" :read-only="true" placeholder="">
      <!-- <group>
         <popup-picker v-model="formObj.applyBranch" :data="formObj.applyBranchArr" placeholder="请选择"></popup-picker>
       </group>-->
    </my-line-input>
    <my-line-input item-name="开发人员：" v-model="developer" :disabled="true"></my-line-input>
    <my-line-input item-name="审批模式：" v-model="formObj.approvalDec" :read-only="true" placeholder=""></my-line-input>
    <my-divide-line></my-divide-line>
    <my-line-input item-name="信息渠道：">
      <group>
        <popup-picker v-model="formObj.infoChannel" :data="formObj.infoChannelArr" placeholder="请选择" :columns="1"
                      show-name @on-change="changeInfoChannel"></popup-picker>
      </group>
    </my-line-input>
    <my-line-input item-name="信息明细：" :is-required="false">
      <group v-if="formObj.channelDetailArr">
        <popup-picker v-model="formObj.channelDetail" :data="formObj.channelDetailArr" placeholder="请选择" :columns="1"
                      show-name></popup-picker>
      </group>
      <span v-else></span>
    </my-line-input>
    <my-line-input item-name="其他渠道：" :is-required="false" v-model="formObj.otherChannel"></my-line-input>
    <div class="confirm-layout" v-transfer-dom>
      <confirm v-model="showConfirm" confirm-text="需要" cancel-text="不需要" @on-confirm="onConfirm" @on-cancel="onCancel">
        <p style="text-align:center;">您还未保存，是否需要保存填写内容？</p>
      </confirm>
    </div>
  </div>
</template>
<script>
  import MyButton from '@/components_custom/my-private-btn';
  import MyLineInput from '@/components_custom/my-line-input';
  import MyCheckRadio from '@/components_custom/my-check-icon-ticket';
  import MyDivideLine from '../components_inner/devide-line'
  import {Confirm,CheckIcon, Group, PopupPicker,TransferDomDirective as TransferDom} from 'vux';
  import {strategy, Valitor} from "../../../common/validForm";
  import Native from '@/common/native';
  import {getParameter} from "../../../common/utils/url";

  export default {
    directives: {
      TransferDom
    },
    components: {
      MyButton,
      MyLineInput,
      MyCheckRadio,
      MyDivideLine,
      Group,
      PopupPicker,
      CheckIcon,
      Confirm
    },
    data() {
      return {
        formObj: {
          Id: null,
          produceType: [],
          produceTypeArr: null,
          produceName: [],
          produceNameArr: [],
          jobNature: [],
          jobNatureArr: [
            {name: '上班人士', value: '0'},
            {name: '做生意', value: '1'}
          ],
          loanAmount: '',
          isCounterpart: true,
          term: [],
          termArr: null,
          loanPurpose: [],
          loanPurposeArr: [[]],
          infoChannel: [],
          infoChannelArr: [[]],
          applyBranchStr: '',
          applyBranch: [],
          applyBranchArr: [[]],
          developer: null,
          approvalMode: '',
          approvalDec: '', //审核模式 描述方式
          moneyGap: '', //资金缺口
          monthCanRepay: '', //可承受月还款额,
          totalLoanAmount: '',
          channelDetail: [],
          channelDetailArr: null,
          otherChannel: '',
          LOAN_TYPE_GUID: null
        },
        /*征信三要素*/
        loginInfo: (function () {
          let loginInfo = localStorage.getItem('loginInfo');
          return JSON.parse(loginInfo)
        })(),
        nowTime: new Date(),
        customerUserGuid: getParameter('userGuid'),
        realName: getParameter('realName'),
        cardNo: getParameter('cardNo'),
        dateInfoSource:getParameter('dateInfoSource'),
        loadTag: true, //产品类型flag标记 表示是否加载过
        showConfirm:false
      }
    },
    computed: {
      developer() {
        let loginInfo = this.loginInfo;
        if (loginInfo) {
          return loginInfo.RealName
        }
      }

    },
    methods: {
      showSave() {
        this.showConfirm = true;
      },
      onConfirm() {
        this.saveBtnEvent();
      },
      onCancel() {
        Native.NRouter.back();
      },
      toSuccessLink(option) {
        let assignObj = {
          url: 'save-success.html'
        };
        let openObj = option ? Object.assign(assignObj, option) : assignObj;
        // 恒e家导入借款信息保存
        window.platformAdapter.setEFromFamily({borrow: true});
        Native.NUI.refresh({
          refreh_page: 'income-part_apply.html'
        });
        Native.NRouter.assign(openObj)
      },
      dueSelectData(data) {
        return data ? [data] : []
      },
      clearNull(value) {
        return value == null ? '' : value;
      },
      getBaseInfoReq() {
        /*初始查询用户借款信息*/
        let loginInfo = this.loginInfo;
        if (!loginInfo) {
          return false;
        }
        let formObj = this.formObj;
        formObj.applyBranchStr = loginInfo.DepartmentName;
        this.$axios({
          url: '/Apply/getappapplys',
          method: 'get',
          params: {
            // guid: loginInfo.UserGuid
            guid: this.customerUserGuid
          },
          typeName: '85',
          showLoading: true
        }).then((res) => {
          let resData = res.data;
          let Model = resData.Model;
          let loanInfo = Model && Model.Model;
          if (Model) {
            let loanGroup = Model.loangroup;
            let loanType = Model.LaonTypeNew;
            formObj.produceTypeArr = this.exchangePopupFormat(loanGroup);
            formObj.loanPurposeArr = this.exchangePopupFormat(loanType);
            if (loanInfo) {
              //信息回填

              formObj.Id = loanInfo.ID;
              formObj.produceName = this.dueSelectData(loanInfo.APPLY_PROD_NAME_GUID);
              formObj.produceType = this.dueSelectData(loanInfo.APPLY_PROD_TYPE_GUID);
              loanInfo.WORKNATURE && formObj.jobNature.push(loanInfo.WORKNATURE);
              formObj.loanAmount = loanInfo.APPLY_LOAN_AMOUNT;
              formObj.term = this.dueSelectData(loanInfo.APPLY_TENOR + '');
              formObj.loanPurpose = this.dueSelectData(loanInfo.LAON_PURPOSE_GUID);
              formObj.moneyGap = loanInfo.FINANCING_GAP;
              formObj.monthCanRepay = loanInfo.HIGH_MONTH_CANPAY;
              formObj.isCounterpart =  loanInfo.IS_LOAN_BEFORE === 'Y';
              formObj.infoChannel = this.dueSelectData(loanInfo.INFO_SOURCE_GUID);
              formObj.channelDetail = this.dueSelectData(loanInfo.INFO_SOURCE_DETAIL);
              formObj.otherChannel = this.clearNull(loanInfo.INFO_SOURCE_OTHERS);
              formObj.totalLoanAmount = this.clearNull(loanInfo.TOTALLOAN);
            }

          }
        })
      },
      getChannelReq() {
        /*获取渠道请求*/
        this.$axios({
          url: '/Apply/GetPubcodeInfos',
          method: 'get',
          params: {
            code: 'InfoType'
          },
          typeName: '85'
        }).then((res) => {
          let resData = res.data;
          if (res && resData) {
            let Model = resData.Model;
            if (Model) {
              this.formObj.infoChannelArr = this.exchangePopupFormat(Model, 'Name', 'Guid')
            }
          }
        })
      },
      changeInfoChannel() {
        /*信息渠道popup-picker on-change回调 */
        let infoChannel = this.formObj.infoChannel;
        let infoChannelReq = infoChannel + '';
        this.formObj.channelDetail = [];
        this.formObj.channelDetailArr = null;
        if (!infoChannelReq) {
          return false;
        }
        this.$axios({
          url: '/Apply/GetPubcode',
          method: 'get',
          params: {
            code: infoChannelReq
          },
          typeName: '85',
          showLoading: true
        }).then((res) => {
          let resData = res.data;
          if (res && resData) {
            let Model = resData.Model;
            if (Model && Model.Result && Model.Result.length) {
              this.formObj.channelDetailArr = this.exchangePopupFormat(Model.Result, 'Name', 'Guid');
              this.formObj.channelDetail[0] = this.formObj.channelDetailArr && this.formObj.channelDetailArr[0].value;
            }
          }
        })


      },
      exchangePopupFormat(Arr, nameStr = 'Value', valueStr = 'Key') {
        /*转换popup-pickup*/
        return Arr.map(function (item) {
          return {
            name: item[nameStr],
            value: item[valueStr],
          }
        })
      },
      saveBtnEvent() {
        /*保存或修改 按钮事件*/
        let loginInfo = this.loginInfo;
        if (!loginInfo) {
          return false;
        }
        let formObj = this.formObj;
        /*表单验证 start*/
        let notEmptyStr = '请填写';
        let notEmptySelect = '请选择';
        let numberTips = '格式有误:不是有效数字';
        let validator = new Valitor();
        validator.add(strategy.isNotEmpty(formObj.produceType, notEmptySelect + '产品类型'));
        validator.add(strategy.isNotEmpty(formObj.produceName, notEmptySelect + '产品名称'));
        validator.add(strategy.isNotEmpty(formObj.jobNature, notEmptySelect + '工作性质'));
        validator.add(strategy.isNotEmpty(formObj.loanAmount, notEmptyStr + '申请金额'));
        validator.add(strategy.isNotEmpty(formObj.term, notEmptySelect + '申请期限'));
        validator.add(strategy.isNotEmpty(formObj.loanPurpose, notEmptySelect + '借款目的'));
        // validator.add(strategy.isNotEmpty(formObj.moneyGap, notEmptySelect + '资金缺口'));
     /*   validator.add(strategy.decimalByTwoFormat(formObj.moneyGap, '资金缺口' + numberTips));*/
        // validator.add(strategy.isNotEmpty(formObj.monthCanRepay, notEmptySelect + '可承受月还款额'));
        /*   validator.add(strategy.decimalByTwoFormat(formObj.monthCanRepay, '可承受月还款额' + numberTips));*/
        validator.add(strategy.isNotEmpty(formObj.infoChannel, notEmptySelect + '信息渠道'));
        validator.add(strategy.decimalByTwoFormat(formObj.loanAmount, '申请金额' + numberTips));
        validator.add(strategy.isMaxValue(formObj.loanAmount, 20 * 10000, '申请金额' + '不得超过20万'));

        if (formObj.isCounterpart) {
          validator.add(strategy.isNotEmpty(formObj.totalLoanAmount, notEmptySelect + '贷款总额'));
          validator.add(strategy.decimalByTwoFormat(formObj.totalLoanAmount, '资金缺口' + numberTips));
        }

        let result = validator.start();
        if (result) {
          this.$toast({
            message: result
          });
          return false;
        }
        /*表单验证 end*/
        let sendUrl = '/Apply/InsertApply', formId = null;
        if (formObj.Id) {
          sendUrl = '/Apply/EditApply';
          formId = formObj.Id;
        }
        let sendData = {
          Id: formId,
          APPLY_DATE: +new Date(),
          APPLY_DEPARTMENT_GUID: loginInfo.DepartmentGuid,
          APPLY_LOAN_AMOUNT: formObj.loanAmount,
          APPLY_PROD_NAME_GUID: formObj.produceName + '',
          APPLY_PROD_TYPE_GUID: formObj.produceType + '',
          APPLY_TENOR: +formObj.term,
          APPROVE_TYPE: formObj.approvalMode,
          CREATE_USER_ID: loginInfo.UserGuid,
          CUSTOMER_GUID: this.customerUserGuid,
          DEVELOPER_GUID: loginInfo.UserGuid,
          FINANCING_GAP: formObj.moneyGap,
          HIGH_MONTH_CANPAY: formObj.monthCanRepay,
          INFO_SOURCE_DETAIL: formObj.channelDetail + '',
          INFO_SOURCE_GUID: formObj.infoChannel + '',
          INFO_SOURCE_OTHERS: formObj.otherChannel,
          IS_LOAN_BEFORE: formObj.isCounterpart ? 'Y' : 'N',
          LAON_PURPOSE_GUID: formObj.loanPurpose + '',
          LAST_UPDATE_USER_ID: loginInfo.UserGuid,
          TOTALLOAN: formObj.totalLoanAmount,
          WORKNATURE: formObj.jobNature + '',
          DATE_INFO_SOURCE:this.dateInfoSource,
        };
        this.$axios({
          url: sendUrl,
          method: 'post',
          data: sendData,
          typeName: '85',
          showLoading: true,
          headers:{'clientType': 1}  /*clientType:1 //1代表app,0代表PC端*/
        }).then((res) => {
          if (res && res.data && res.data.ResultType === 0) {
            /*success page direct*/
            if(this.dateInfoSource=='1') {
              window.platformAdapter.setEFromFamily({infoloan: true});
            }
            this.toSuccessLink()
          }
        })


      },
      revProductType(productGuid) {
        /* 根据产品类型 去获取具体产品列表 */
        let loginInfo = this.loginInfo;
        if (!loginInfo) {
          return false;
        }
        this.$axios({
          url: '/Apply/GetLoanParamByDept',
          params: {
            guid: productGuid + '',
            deptguid: loginInfo.DepartmentGuid,
       /*     deptguid: '{0DC463E0-4DA6-4F4B-A2F7-1B5028BEA8B9}',*///暂时写死
          },
          method: 'get',
          typeName: '85',
          showLoading: true
        }).then((res) => {
          let resData = res.data;
          let Model = resData.Model;
          if (Model.Result && Model.Result.length) {
            this.formObj.produceNameArr = this.exchangePopupFormat(Model.Result, 'Name', 'Value');
            if (this.loadTag === false) {
              this.formObj.produceName = this.formObj.produceNameArr[0].value && [this.formObj.produceNameArr[0].value];
            }
            this.loadTag = false;


            //
          }
        })

      },
      revProduceName(productTypeGuid) {
        /*查询期限*/
        this.$axios({
          url: '/Apply/GetPeriod',
          params: {
            LOAN_GROUP_GUID: this.formObj.produceType + '',
            LOAN_TYPE_GUID: productTypeGuid + '',
          },
          method: 'get',
          typeName: '85',
          showLoading: true,
        }).then((res) => {
          let resData = res.data;
          let Model = resData.Model;
          if (Model.Result && Model.Result.length) {
            this.formObj.termArr = Model.Result.map(function (item) {
              return {
                name: item['LOAN_PERIOD'] + '月',
                value: item['LOAN_PERIOD'] + '',
              }
            });
            if (this.loadTag === false) {
              this.formObj.term[0] = this.formObj.termArr[0].value;
            }
          }
        });

        /*查询审批模式*/
        this.$axios({
          url: '/LoanTypeApprove/GetAppModelByLoanTypeGuid',
          params: {
            LoanTypeGuid: productTypeGuid
          },
          method: 'get',
          typeName: '85',
          showLoading: true
        }).then((res) => {
          let resData = res.data;
          let Model = resData.Model;
          if (Model && Model.Result) {
            this.formObj.approvalMode = Model.Result.APPROVE_TYPE;
            this.formObj.approvalDec = Model.Result.APPROVE_TYPE_desc
          }

        })

      },
      setHeader() {
        window.platformAdapter.saveLoanInfoEvent = () => {
          this.saveBtnEvent();
        };
        window.platformAdapter.isSaveThisFormBtnEvent = () => {
          this.showSave()
        }
        Native.NUI.setHeader({
          isBack: true,
          title: '借款信息',
          rightText: '保存',
          rightTitle: '保存',
          rightCallback: 'saveLoanInfoEvent',
          leftCallback: 'isSaveThisFormBtnEvent'
        })
      }
    },
    mounted() {
      this.setHeader()
      this.getBaseInfoReq();
      this.getChannelReq();
      /*income-part_loanInfo.html?userGuid={25FB0C3A-E997-4C24-86A8-9B2275FFD683}#/index*/
    },
    watch: {
      /*监听produceType的值变化*/
      'formObj.produceType': function (value) {
        this.revProductType(value)
      },
      'formObj.produceName': function (newValue, oldValue) {
        if (newValue + '' === oldValue + '') {
          return false
        }
        this.revProduceName(newValue)
      }
    }
  }
</script>
<style lang='less'>
  @import '~@/styles/base.less';

  .income-part-title {
    height: 40px;
    line-height: 40px;
    background: #44a4ef;
  }

  /* .my-common-part-title {
    line-height: 80px;
    height: 80px;
    padding-left: 25px;
    font-size: 28px;
    font-weight: bold;
  } */

  /*  .weui-cells:after, .weui-cells:before{
      border:none !important
    }*/


</style>
