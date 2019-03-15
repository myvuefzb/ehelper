<template>
  <div class="income-part">
    <!--<div class="income-part-title">-->

    <!--</div>-->
    <transition>
      <credit-all :creditFormObj="formObj"></credit-all>
    </transition>
    <my-line-input item-name="工作性质:">
      <group v-if="formObj.workPropertyAttr">
        <popup-picker v-model="formObj.workProperty" :data="formObj.workPropertyAttr" :columns="1" show-name
                      placeholder="点击选择"></popup-picker>
      </group>
    </my-line-input>

    <div class="shell"><span>淘宝信息</span></div>
    <my-line-input item-name="芝麻信用分:" v-model="formObj.tbCreditScore" type="number"></my-line-input>
    <my-line-input item-name="花呗额度:" v-model="formObj.tbShopingAount" type="number"
                   @change="computeUsage(1,formObj.tbShopingUsedAmount,formObj.tbShopingAount)"></my-line-input>
    <my-line-input item-name="花呗可用额度:" v-model="formObj.tbShopingUsedAmount" type="number"
                   @change="computeUsage(1,formObj.tbShopingUsedAmount,formObj.tbShopingAount)"></my-line-input>
    <my-line-input item-name="借呗额度:" v-model="formObj.tbLoanAmount" type="number"
                   @change="computeUsage(2,formObj.tbLoanUsedAmount,formObj.tbLoanAmount)"></my-line-input>
    <my-line-input item-name="借呗可用额度:" v-model="formObj.tbLoanUsedAmount" type="number"
                   @change="computeUsage(2,formObj.tbLoanUsedAmount,formObj.tbLoanAmount)"></my-line-input>
    <my-line-input item-name="年总消费额:" v-model="formObj.tbYearsAmount" type="number"
                   @change="computeUsage(3,formObj.tbYearsAmount,12)"></my-line-input>
    <my-line-input item-name="花呗使用率:" v-model="formObj.tbShoppingPercent" placeholder="">
    </my-line-input>
    <my-line-input item-name="借呗使用率:" v-model="formObj.tbLoanPercent" placeholder="">
    </my-line-input>
    <my-line-input item-name="月均消费额:" v-model="formObj.tbMonthsAmount" placeholder=""></my-line-input>

    <div class="shell"><span>京东信息</span></div>
    <my-line-input item-name="小白信用分:" v-model="formObj.jdCreditScore" type="number"></my-line-input>
    <my-line-input item-name="京东白条总额度:" v-model="formObj.jdSilverAmount" type="number"
                   @change="computeUsage(4,formObj.jdSilverUsedAmount,formObj.jdSilverAmount)"></my-line-input>
    <my-line-input item-name="京东白条可用额度:" v-model="formObj.jdSilverUsedAmount" type="number"
                   @change="computeUsage(4,formObj.jdSilverUsedAmount,formObj.jdSilverAmount)"></my-line-input>
    <my-line-input item-name="京东金条额度:" v-model="formObj.jdGoldenAmount" type="number"
                   @change="computeUsage(5,formObj.jdGoldenUsedAmount,formObj.jdGoldenAmount)"></my-line-input>
    <my-line-input item-name="京东金条可用额度:" v-model="formObj.jdGoldenUsedAmount" type="number"
                   @change="computeUsage(5,formObj.jdGoldenUsedAmount,formObj.jdGoldenAmount)"></my-line-input>
    <my-line-input item-name="年总消费额:" v-model="formObj.jdYearsAmount" type="number"
                   @change="computeUsage(6,formObj.jdYearsAmount,12)"></my-line-input>
    <my-line-input item-name="京东白条使用率:" v-model="formObj.jdSilverPercent" placeholder="">
    </my-line-input>
    <my-line-input item-name="京东金条使用率:" v-model="formObj.jdGoldenPercent" placeholder="">
    </my-line-input>
    <my-line-input item-name="月均消费额:" v-model="formObj.jdMonthsAmount" placeholder=""></my-line-input>
    <div class="confirm-layout" v-transfer-dom>
      <confirm v-model="showConfirm" confirm-text="需要" cancel-text="不需要" @on-confirm="onConfirm" @on-cancel="onCancel">
        <p style="text-align:center;">您还未保存，是否需要保存填写内容？</p>
      </confirm>
    </div>
    <!--<div class="shell">-->
    <!--<button class="delBtn" @click="addBtnEvent">保存</button>-->
    <!--</div>-->
  </div>
</template>

<script>
  import MyLineInput from '@/components_custom/my-line-input';
  import {getParameter} from '@/common/utils/url';
  import {guid} from '@/common/utils/guid';
  import {CreditAll} from '@/components_custom/my-loan-form/index';
  import {Confirm, Group, PopupPicker, TransferDomDirective as TransferDom} from 'vux';
  import {strategy, Valitor} from '@/common/validForm';
  import Native from '@/common/native';

  export default {
    directives: {
      TransferDom
    },
    components: {
      MyLineInput,
      Group,
      PopupPicker,
      CreditAll,
      Confirm
    },
    data() {
      return {
        showConfirm: false,
        formObj: {
          creditAmount: '',
          usedAmount: '',
          usePercent: '',
          fiveyearsDelay: '',
          isDelay: [],
          isDelayAttr: [
            [{
              name: '是',
              value: '1'
            }, {
              name: '否',
              value: '0'
            }]
          ],
          workProperty: [],
          workPropertyAttr: [{
            name: '上班',
            value: '1'
          }, {
            name: '私营业主',
            value: '2'
          }, {
            name: '自雇人士',
            value: '3'
          }],
          loanTimes: '',
          loanAmount: '',
          leaveAmount: '',
          oneQueryTimes: '',
          threeQueryTimes: '',
          sixQueryTimes: '',
          tbCreditScore: '',
          tbShopingAount: '',
          tbShopingUsedAmount: '',
          tbLoanAmount: '',
          tbLoanUsedAmount: '',
          tbYearsAmount: '',
          tbShoppingPercent: '',
          tbLoanPercent: '',
          tbMonthsAmount: '',
          jdCreditScore: '',
          jdSilverAmount: '',
          jdSilverUsedAmount: '',
          jdGoldenAmount: '',
          jdGoldenUsedAmount: '',
          jdYearsAmount: '',
          jdSilverPercent: '',
          jdGoldenPercent: '',
          jdMonthsAmount: ''
        },
        userLoginInfo: {},
        applyGuid: '',
        enjoyLoan: {},
        customerUserGuid: getParameter('userGuid'),
        realName: getParameter('realName'),
        cardNo: getParameter('cardNo'),
        dateInfoSource: getParameter('dateInfoSource'), // 是否是恒e家的数据1为是，否则否
        slotProps: {
          tempest: 10
        }
      }
    },
    computed: {},
    methods: {
      showSave() {
        this.showConfirm = true;
      },
      onConfirm() {
        this.addBtnEvent();
      },
      //
      onCancel() {
        Native.NRouter.back();
      },
      toSuccessLink(option) {
        let assignObj = {
          url: 'save-success.html'
        };
        let openObj = option ? Object.assign(assignObj, option) : assignObj;
        Native.NRouter.assign(openObj)
      },
      getLoginInfo() {
        let loginInfo = localStorage.getItem('loginInfo');
        if (loginInfo) {
          loginInfo = JSON.parse(loginInfo);
          this.userLoginInfo = loginInfo
        } else {
          Native.NRouter.getUserLoginInfo({'callback': 'getUserLoginInfo'});
        }
      },
      //计算使用率与消费额
      computeUsage(type, param1, param2) {
        if (param1 && param2) {
          switch (type) {
            case 1:
              this.formObj.tbShoppingPercent = ((1 - param1 * 1.0 / param2 * 1.0) * 100).toFixed(2) + '%';
              break;
            case 2:
              this.formObj.tbLoanPercent = ((1 - param1 * 1.0 / param2 * 1.0) * 100).toFixed(2) + '%';
              break;
            case 3:
              this.formObj.tbMonthsAmount = (param1 * 1.0 / param2 * 1.0).toFixed(2);
              break;
            case 4:
              this.formObj.jdSilverPercent = ((1 - param1 * 1.0 / param2 * 1.0) * 100).toFixed(2) + '%';
              break;
            case 5:
              this.formObj.jdGoldenPercent = ((1 - param1 * 1.0 / param2 * 1.0) * 100).toFixed(2) + '%';
              break;
            case 6:
              this.formObj.jdMonthsAmount = (param1 * 1.0 / param2 * 1.0).toFixed(2);
              break;
            default :
              break;
          }
        }
      },
      getEnjoyLoan() {
        this.applyGuid = getParameter('applyGuid');
        let sendData = {
          loan_TypeGuid: getParameter('loanTypeGuid'),
          apply_Guid: getParameter('applyGuid')
        };
        this.$axios({
          method: 'get',
          url: '/Apply/GetAPPRxdApplyInfo',
          params: sendData,
          typeName: '85'
        }).then((success) => {
          if (success && success.data.ResultType === 0) {
            if (success.data.Model != null) {
              let enjoy = success.data.Model;
              this.enjoyLoan = enjoy;
              this.formObj.creditAmount = enjoy.CREDITCARDQUOTA;
              this.formObj.usedAmount = enjoy.CREDITCARDUSEDMOUNT;
              this.formObj.usePercent = enjoy.CREDITCARDUSERATE + '%';
              this.formObj.isDelay.push(enjoy.ISHAVEOVERDUEOFCREDITCARD + '');
              this.formObj.workProperty.push(enjoy.WORKNATURE + '');
              this.formObj.fiveyearsDelay = enjoy.CREDITCARDOVERDUETIMES;
              this.formObj.loanAmount = enjoy.CREDITLOANAMOUNT;
              this.formObj.leaveAmount = enjoy.CREDITLOANBANLANCE;
              this.formObj.loanTimes = enjoy.CREDITLOANTIMES;
              this.formObj.oneQueryTimes = enjoy.QUERYTIMESOFMONTH;
              this.formObj.threeQueryTimes = enjoy.QUERYTIMESOFTHREEMONTH;
              this.formObj.sixQueryTimes = enjoy.QUERYTIMESOFHALFYEAR;
              if (enjoy.RxdssInfo != null) {
                this.formObj.tbCreditScore = enjoy.RxdssInfo.ZM_CREDIT;
                this.formObj.tbShopingAount = enjoy.RxdssInfo.HB_ALL_CREDIT;
                this.formObj.tbShopingUsedAmount = enjoy.RxdssInfo.HB_SURPLUS_CREDIT;
                this.formObj.tbShoppingPercent = enjoy.RxdssInfo.HB_USE_RATIO + '%';
                this.formObj.tbLoanAmount = enjoy.RxdssInfo.JB_ALL_CREDIT;
                this.formObj.tbLoanUsedAmount = enjoy.RxdssInfo.JB_SURPLUS_CREDIT;
                this.formObj.tbLoanPercent = enjoy.RxdssInfo.JB_USE_RATIO + '%';
                this.formObj.tbYearsAmount = enjoy.RxdssInfo.TB_YEAR_USE_AMOUNT;
                this.formObj.tbMonthsAmount = enjoy.RxdssInfo.TB_PER_MONTH_AMOUNT;
                this.formObj.jdCreditScore = enjoy.RxdssInfo.XB_CREDIT;
                this.formObj.jdSilverAmount = enjoy.RxdssInfo.BT_ALL_CREDIT;
                this.formObj.jdSilverUsedAmount = enjoy.RxdssInfo.BT_SURPLUS_CREDIT;
                this.formObj.jdSilverPercent = enjoy.RxdssInfo.BT_USE_RATIO + '%';
                this.formObj.jdGoldenAmount = enjoy.RxdssInfo.JT_ALL_CREDIT;
                this.formObj.jdGoldenUsedAmount = enjoy.RxdssInfo.JT_SURPLUS_CREDIT;
                this.formObj.jdGoldenPercent = enjoy.RxdssInfo.JT_USE_RATIO + '%';
                this.formObj.jdYearsAmount = enjoy.RxdssInfo.JD_YEAR_USE_AMOUNT;
                this.formObj.jdMonthsAmount = enjoy.RxdssInfo.JD_PER_MONTH_AMOUNT;
              }
            }
          }
        });
      },
      validAll() {
        let msgNot = '请填写';
        let selectNot = '请选择';
        let formatError = '格式有误，请填写数字';
        let validObj = new Valitor();
        validObj.add(strategy.isNotEmpty(this.formObj.creditAmount, msgNot + '信用卡总额度'));
        validObj.add(strategy.isNotEmpty(this.formObj.usedAmount, msgNot + '已用额度'));
        validObj.add(strategy.isNotEmpty(this.formObj.usePercent, msgNot + '使用率'));
        validObj.add(strategy.isNotEmpty(this.formObj.fiveyearsDelay, msgNot + '近五年逾期次数'));
        validObj.add(strategy.isNotEmpty(this.formObj.isDelay, selectNot + '当前是否逾期'));
        validObj.add(strategy.isNotEmpty(this.formObj.loanTimes, msgNot + '信用贷款笔数'));
        validObj.add(strategy.isNotEmpty(this.formObj.loanAmount, selectNot + '总金额'));
        validObj.add(strategy.isNotEmpty(this.formObj.leaveAmount, msgNot + '剩余金额'));
        validObj.add(strategy.isNotEmpty(this.formObj.oneQueryTimes, msgNot + '近一个月查询次数'));
        validObj.add(strategy.isNotEmpty(this.formObj.threeQueryTimes, msgNot + '近三个月查询次数'));
        validObj.add(strategy.isNotEmpty(this.formObj.sixQueryTimes, msgNot + '近半年查询次数'));
        validObj.add(strategy.isNotEmpty(this.formObj.workProperty, msgNot + '工作性质'));

        validObj.add(strategy.isNotEmpty(this.formObj.tbCreditScore, msgNot + '芝麻信用分'));
        validObj.add(strategy.isNotEmpty(this.formObj.tbShopingAount, msgNot + '花呗额度'));
        if (this.formObj.tbShopingAount)
          validObj.add(strategy.numberFormat(this.formObj.tbShopingAount, '花呗额度' + formatError));
        validObj.add(strategy.isNotEmpty(this.formObj.tbShopingUsedAmount, msgNot + '花呗可用额度'));
        if (this.formObj.tbShopingUsedAmount)
          validObj.add(strategy.numberFormat(this.formObj.tbShopingUsedAmount, '花呗可用额度' + formatError));
        validObj.add(strategy.isNotEmpty(this.formObj.tbLoanAmount, msgNot + '借呗额度'));
        if (this.formObj.tbLoanAmount)
          validObj.add(strategy.numberFormat(this.formObj.tbLoanAmount, '借呗额度' + formatError));
        validObj.add(strategy.isNotEmpty(this.formObj.tbLoanUsedAmount, selectNot + '借呗可用额度'));
        if (this.formObj.tbLoanUsedAmount)
          validObj.add(strategy.numberFormat(this.formObj.tbLoanUsedAmount, '借呗可用额度' + formatError));
        validObj.add(strategy.isNotEmpty(this.formObj.tbYearsAmount, msgNot + '淘宝年总消费额'));
        if (this.formObj.tbYearsAmount)
          validObj.add(strategy.numberFormat(this.formObj.tbYearsAmount, '淘宝年总消费额' + formatError));
        validObj.add(strategy.isNotEmpty(this.formObj.jdCreditScore, selectNot + '小白信用分'));
        validObj.add(strategy.isNotEmpty(this.formObj.jdSilverAmount, msgNot + '京东白条总额度'));
        if (this.formObj.jdSilverAmount)
          validObj.add(strategy.numberFormat(this.formObj.jdSilverAmount, '京东白条总额度' + formatError));
        validObj.add(strategy.isNotEmpty(this.formObj.jdSilverUsedAmount, msgNot + '京东白条可用额度'));
        if (this.formObj.jdSilverUsedAmount)
          validObj.add(strategy.numberFormat(this.formObj.jdSilverUsedAmount, '京东白条可用额度' + formatError));
        validObj.add(strategy.isNotEmpty(this.formObj.jdGoldenAmount, msgNot + '京东金条额度'));
        if (this.formObj.jdGoldenAmount)
          validObj.add(strategy.numberFormat(this.formObj.jdGoldenAmount, '京东金条额度' + formatError));
        validObj.add(strategy.isNotEmpty(this.formObj.jdGoldenUsedAmount, msgNot + '京东金条可用额度'));
        if (this.formObj.jdGoldenUsedAmount)
          validObj.add(strategy.numberFormat(this.formObj.jdGoldenUsedAmount, '京东金条可用额度' + formatError));
        validObj.add(strategy.isNotEmpty(this.formObj.jdYearsAmount, msgNot + '京东年总消费额'));
        if (this.formObj.jdYearsAmount)
          validObj.add(strategy.numberFormat(this.formObj.jdYearsAmount, '京东年总消费额' + formatError));
        return validObj.start()
      },
      addBtnEvent() {
        /*逐项验证所有表单*/
        let resultMsg = this.validAll();
        if (resultMsg) {
          this.$toast({
            message: resultMsg,
            duration: 2000
          });
          return false;
        }
        let addData = {
          GUID: guid(),
          APPLYGUID: this.applyGuid === undefined ? this.enjoyLoan.APPLYGUID : this.applyGuid,
          CREATE_USER_ID: this.userLoginInfo.UserGuid,
          LAST_UPDATE_USER_ID: this.userLoginInfo.UserGuid,
          LAST_UPDATE_DATETIME: new Date(),
          CUSTOMERGUID: getParameter('customerGuid'),
          CREDITCARDQUOTA: this.formObj.creditAmount,
          CREDITCARDUSEDMOUNT: this.formObj.usedAmount,
          CREDITCARDUSERATE: this.formObj.usePercent.replace('%', ''),
          ISHAVEOVERDUEOFCREDITCARD: '' + this.formObj.isDelay,
          CREDITCARDOVERDUETIMES: this.formObj.fiveyearsDelay,
          CREDITLOANAMOUNT: this.formObj.loanAmount,
          CREDITLOANBANLANCE: this.formObj.leaveAmount,
          CREDITLOANTIMES: this.formObj.loanTimes,
          QUERYTIMESOFMONTH: this.formObj.oneQueryTimes,
          QUERYTIMESOFTHREEMONTH: this.formObj.threeQueryTimes,
          QUERYTIMESOFHALFYEAR: this.formObj.sixQueryTimes,
          LOAN_TYPE: '{D52510FD-94C5-467D-A137-3E7373C91CBF}', //瑞享贷
          WORKNATURE: '' + this.formObj.workProperty,
          RxdssInfo: {
            ZM_CREDIT: this.formObj.tbCreditScore,
            HB_ALL_CREDIT: this.formObj.tbShopingAount,
            HB_SURPLUS_CREDIT: this.formObj.tbShopingUsedAmount,
            HB_USE_RATIO: this.formObj.tbShoppingPercent.replace('%', ''),
            JB_ALL_CREDIT: this.formObj.tbLoanAmount,
            JB_SURPLUS_CREDIT: this.formObj.tbLoanUsedAmount,
            JB_USE_RATIO: this.formObj.tbLoanPercent.replace('%', ''),
            TB_YEAR_USE_AMOUNT: this.formObj.tbYearsAmount,
            TB_PER_MONTH_AMOUNT: this.formObj.tbMonthsAmount,
            XB_CREDIT: this.formObj.jdCreditScore,
            BT_ALL_CREDIT: this.formObj.jdSilverAmount,
            BT_SURPLUS_CREDIT: this.formObj.jdSilverUsedAmount,
            BT_USE_RATIO: this.formObj.jdSilverPercent.replace('%', ''),
            JT_ALL_CREDIT: this.formObj.jdGoldenAmount,
            JT_SURPLUS_CREDIT: this.formObj.jdGoldenUsedAmount,
            JT_USE_RATIO: this.formObj.jdGoldenPercent.replace('%', ''),
            JD_YEAR_USE_AMOUNT: this.formObj.jdYearsAmount,
            JD_PER_MONTH_AMOUNT: this.formObj.jdMonthsAmount
          }
        };
        // window.localStorage.setItem('applyLoan', JSON.stringify(sendData));
        let strUrl = '/Apply/InsertAPPRxdApply';
        if (this.enjoyLoan.GUID) {
          strUrl = '/Apply/UpdateAPPRxdApply';
          addData.GUID = this.enjoyLoan.GUID;
          addData.RxdssInfo.GUID = this.enjoyLoan.RxdssInfo.GUID;
          addData.RxdssInfo.STATUS = 1;
        }
        else {
          addData.CREATE_DATETIME = new Date();
        }
        this.$axios({
          method: 'post',
          url: strUrl,
          data: addData,
          typeName: '85'
        }).then((success) => {
          if (success && success.data.ResultType === 0) {
            // 恒e家导入基本信息保存
            if (this.dateInfoSource) {
              window.platformAdapter.setEFromFamily({
                rhloan: true
              });
            }

            this.toSuccessLink({
              data: {
                realName: this.realName,
                cardNo: this.cardNo,
                userGuid: this.customerUserGuid,
                ApplyGuid: addData.APPLYGUID
              },
              url: 'save-success.html'
            });
          }
        });
      },
      setHeader() {
        window.platformAdapter.enjoyLoanBtnEvent = () => {
          this.addBtnEvent();
        };
        Native.NUI.setHeader({
          title: '瑞享贷',
          isBack: true,
          rightTitle: '保存',
          rightText: '保存',
          rightCallback: 'enjoyLoanBtnEvent',
          leftCallback: 'isSaveThisFormBtnEvent'
        })
      }
    },
    mounted() {
      this.setHeader();
      // 调用app 返回的方法
      window.platformAdapter.isSaveThisFormBtnEvent = () => {
        this.showSave()
      }
    },
    created() {
      //this.setLoginInfo();/**测试用，正式环境删除 */
      this.getLoginInfo();
      this.getEnjoyLoan();
    }
  }
</script>

<style lang="less">
  @import '~@/styles/base.less';

  .income-part {
  }

  .income-part-title {
    height: 40px;
    line-height: 40px;
    background: #44a4ef;
  }

  .common-part-list {
  }

  .income-part__input-name {
  }

  .confirm-layout {
    .weui-dialog__btn_primary {
      color: #44A4EF;
    }
  }

  .shell {
    width: 100%;
    line-height: 200%;
    text-align: center;
    background: rgba(239, 239, 244, 1);
    font-size: 3.733vw;
  }
</style>
