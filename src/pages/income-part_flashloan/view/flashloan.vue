<template>
  <div class="income-part">
    <!--<div class="income-part-title">-->

    <!--</div>-->
    <my-line-input item-name="授信渠道：">
      <group v-if="formObj.creditChannelAttr.length">
        <popup-picker v-model="formObj.creditChannel" :data="formObj.creditChannelAttr" :columns="1" show-name
                      placeholder="点击选择"></popup-picker>
      </group>
    </my-line-input>
    <my-line-input item-name="微粒贷：" v-model="formObj.wechatLoan" type="number"
                   :is-required="formObj.creditChannel+''=='1'"></my-line-input>
    <my-line-input item-name="京东金条：" v-model="formObj.jdLoan" type="number"
                   :is-required="formObj.creditChannel+''=='2'"></my-line-input>
    <my-line-input item-name="借呗：" v-model="formObj.taobaoLoan" type="number"
                   :is-required="formObj.creditChannel+''=='3'"></my-line-input>
    <my-line-input item-name="年龄：" v-model="formObj.age" type="number"></my-line-input>
    <my-line-input item-name="上班/经营时间：">
      <datetime v-model="formObj.openingTime" format="YYYY-MM-DD" placeholder="点击选择" :start-date="startTime"
                :end-date="endTime"></datetime>
    </my-line-input>

    <div class="shell"><span>信用卡信息</span></div>
    <my-line-input item-name="信用卡总额度：" v-model="formObj.creditAmount" type="number"
                   @change="computeUsage(formObj.usedAmount,formObj.creditAmount)"></my-line-input>
    <my-line-input item-name="已用额度：" v-model="formObj.usedAmount" type="number"
                   @change="computeUsage(formObj.usedAmount,formObj.creditAmount)"></my-line-input>
    <my-line-input item-name="使用率：" v-model="formObj.usePercent"></my-line-input>
    <my-line-input item-name="近5年逾期次数：" v-model="formObj.fiveyearsDelay" type="number"></my-line-input>
    <my-line-input item-name="当前是否逾期：" placeholder="点击选择">
      <group>
        <popup-picker v-model="formObj.isDelay" :data="formObj.isDelayAttr" show-name placeholder="点击选择"></popup-picker>
      </group>
    </my-line-input>

    <div class="shell"><span>信用贷款</span></div>
    <my-line-input item-name="信用贷款笔数：" v-model="formObj.loanTimes" type="number" :is-required="false">
    </my-line-input>
    <my-line-input item-name="总金额：" v-model="formObj.loanAmount" type="number" :is-required="false"></my-line-input>
    <my-line-input item-name="剩余金额：" v-model="formObj.leaveAmount" type="number"></my-line-input>

    <div class="shell"><span>征信查询</span></div>
    <my-line-input item-name="近一个月查询次数：" v-model="formObj.oneQueryTimes" type="number"></my-line-input>
    <my-line-input item-name="近三个月查询次数：" v-model="formObj.threeQueryTimes" type="number"></my-line-input>
    <my-line-input item-name="近半年查询次数：" v-model="formObj.sixQueryTimes" type="number"></my-line-input>

    <div class="shell"><span>其它信息</span></div>
    <my-line-input item-name="居住信息：">
      <group>
        <popup-picker v-model="formObj.liveInfo" :data="formObj.liveInfoAttr" :columns="1" show-name
                      placeholder="点击选择"></popup-picker>
      </group>
    </my-line-input>
    <my-line-input v-if="formObj.liveInfo+''=='0'" item-name="租金/元：" v-model="formObj.rent"
                   type="number"></my-line-input>
    <my-line-input item-name="同盾分值：" v-model="formObj.tdScore" type="number" :is-required="false"></my-line-input>
    <my-line-input item-name="手机入网时长(小时)：" v-model="formObj.phoneLive" type="number"
                   :is-required="false"></my-line-input>

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
  import {Confirm, Datetime, Group, PopupPicker, TransferDomDirective as TransferDom} from 'vux';
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
      Confirm,
      Datetime
    },
    data() {
      return {
        showConfirm: false,
        formObj: {
          age: '',
          wechatLoan: '',
          jdLoan: '',
          taobaoLoan: '',
          creditChannel: [],
          creditChannelAttr: [],
          creditAmount: '',
          usedAmount: '',
          usePercent: '',
          fiveyearsDelay: '',
          openingTime: '',
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
          liveInfo: [],
          liveInfoAttr: [
            {
              name: '租房',
              value: '0'
            },
            {
              name: '宿舍',
              value: '1'
            }, {
              name: '自有房产',
              value: '2'
            }, {
              name: '亲属房产',
              value: '3'
            }, {
              name: '单位分配',
              value: '4'
            }
          ],
          rent: '',
          tdScore: '',
          phoneLIve: '',
          loanTimes: '',
          loanAmount: '',
          leaveAmount: '',
          oneQueryTimes: '',
          threeQueryTimes: '',
          sixQueryTimes: ''
        },
        applyGuid: '',
        userLoginInfo: {},
        flashLoan: {},
        nowTime: new Date(),
        customerUserGuid: getParameter('userGuid'),
        realName: getParameter('realName'),
        cardNo: getParameter('cardNo'),
        dateInfoSource: getParameter('dateInfoSource'), // 是否是恒e家的数据1为是，否则否
        slotProps: {
          tempest: 10
        }
      }
    },
    computed: {
      startTime() {
        let nowTime = this.nowTime;
        let startYear = nowTime.getFullYear() - 40;
        let timeDate = new Date(startYear + '');
        let timeStr = timeDate.toISOString().slice(0, 10);
        return timeStr
      },
      endTime() {
        let nowTime = this.nowTime;
        let timeStr = nowTime.toISOString();
        return timeStr.slice(0, 10)
      }
    },
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
      //授信渠道
      getCreditChannel() {
        this.$axios({
          url: '/Apply/GetCreditlines',
          method: 'Get',
          typeName: '85'
        }).then((success) => {
          for (var item in success.data.Model) {
            this.formObj.creditChannelAttr.push({
              name: success.data.Model[item],
              value: item
            });
          }
          ;
          //console.log(creditChannelAttr);
        });
      },
      computeUsage(param1, param2) {
        if (param1 && param2) {
          this.formObj.usePercent = (param1 * 1.0 / param2 * 1.0 * 100).toFixed(2) + '%';
        }
      },
      getFlashLoan() {
        this.applyGuid = getParameter('applyGuid');
        let sendData = {
          CUSTOMERGUID: getParameter('customerGuid'),
          APPLYGUID: getParameter('applyGuid')
        };
        this.$axios({
          method: 'post',
          url: '/Apply/GetAPPSDAPPLYCUSTOMERINFO',
          data: sendData,
          typeName: '85'
        }).then((success) => {
          if (success && success.data.ResultType === 0) {
            if (success.data.Model.Result.length > 0) {
              let flash = success.data.Model.Result[0];
              this.flashLoan = flash;
              this.formObj.wechatLoan = flash.TINYLOANQUOTA;
              this.formObj.jdLoan = flash.JDGOLDBARS;
              this.formObj.taobaoLoan = flash.BYCHANTING;
              this.formObj.age = flash.CUSTOMERAGE;
              this.formObj.openingTime = flash.OPERATETIMES != '0001-01-01 00:00:00' ? flash.OPERATETIMES.substr(0, 10) : '';
              this.formObj.creditAmount = flash.CREDITCARDQUOTA;
              this.formObj.creditChannel.push(flash.CREDITLINES + '');
              this.formObj.usedAmount = flash.CREDITCARDCANBEUSEQUOTA;
              this.formObj.usePercent = flash.CREDITCARDUSERATE + '%';
              this.formObj.isDelay.push(flash.ISHAVEOVERDUEOFCREDITCARD + '');
              this.formObj.fiveyearsDelay = flash.CREDITCARDOVERDUETIMES;
              this.formObj.loanAmount = flash.CREDITLOANAMOUNT;
              this.formObj.leaveAmount = flash.CREDITLOANBANLANCE;
              this.formObj.loanTimes = flash.CREDITLOANTIMES;
              this.formObj.oneQueryTimes = flash.QUERYTIMESOFMONTH;
              this.formObj.threeQueryTimes = flash.QUERYTIMESOFTHREEMONTH;
              this.formObj.sixQueryTimes = flash.QUERYTIMESOFHALFYEAR;
              this.formObj.liveInfo.push(flash.LIVEINFO + '');
              this.formObj.rent = flash.RENTCORPUS;
              this.formObj.tdScore = flash.TDSCORES;
              this.formObj.phoneLive = flash.PHONEONLIVE;
            }
          }
        });
      },
      validAll() {
        let msgNot = '请填写';
        let selectNot = '请选择';
        let validObj = new Valitor();
        validObj.add(strategy.isNotEmpty(this.formObj.creditChannel, selectNot + '授信渠道'));
        if (this.formObj.creditChannel + '' === '1')
          validObj.add(strategy.isNotEmpty(this.formObj.wechatLoan, msgNot + '微粒贷'));
        if (this.formObj.creditChannel + '' === '2')
          validObj.add(strategy.isNotEmpty(this.formObj.jdLoan, msgNot + '京东金条'));
        if (this.formObj.creditChannel + '' === '3')
          validObj.add(strategy.isNotEmpty(this.formObj.taobaoLoan, msgNot + '借呗'));
        validObj.add(strategy.isNotEmpty(this.formObj.age, msgNot + '年龄'));
        validObj.add(strategy.isNotEmpty(this.formObj.openingTime, msgNot + '上班/经营时间'));
        validObj.add(strategy.isNotEmpty(this.formObj.creditAmount, msgNot + '信用卡总额度'));
        validObj.add(strategy.isNotEmpty(this.formObj.usedAmount, msgNot + '已用额度'));
        validObj.add(strategy.isNotEmpty(this.formObj.usePercent, msgNot + '使用率'));
        validObj.add(strategy.isNotEmpty(this.formObj.fiveyearsDelay, msgNot + '近五年逾期次数'));
        validObj.add(strategy.isNotEmpty(this.formObj.isDelay, selectNot + '当前是否逾期'));
        validObj.add(strategy.isNotEmpty(this.formObj.leaveAmount, msgNot + '剩余金额'));
        validObj.add(strategy.isNotEmpty(this.formObj.oneQueryTimes, msgNot + '近一个月查询次数'));
        validObj.add(strategy.isNotEmpty(this.formObj.threeQueryTimes, msgNot + '近三个月查询次数'));
        validObj.add(strategy.isNotEmpty(this.formObj.sixQueryTimes, msgNot + '近半年查询次数'));
        validObj.add(strategy.isNotEmpty(this.formObj.liveInfo, selectNot + '居住信息'));
        if (this.formObj.liveInfo + '' == '0')
          validObj.add(strategy.isNotEmpty(this.formObj.rent, msgNot + '租金'));
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
          APPLYGUID: this.applyGuid === "" ? this.flashLoan.APPLYGUID : this.applyGuid,
          CUSTOMERGUID: getParameter('customerGuid'),
          TINYLOANQUOTA: this.formObj.wechatLoan,
          DEPARTMENTGUID: this.userLoginInfo.DepartmentGuid,
          CUSTOMERAGE: this.formObj.age,
          OPERATETIMES: this.formObj.openingTime,
          JDGOLDBARS: this.formObj.jdLoan,
          BYCHANTING: this.formObj.taobaoLoan,
          CREDITCARDQUOTA: this.formObj.creditAmount,
          CREDITLINES: '' + this.formObj.creditChannel,
          CREDITCARDCANBEUSEQUOTA: this.formObj.usedAmount,
          CREDITCARDUSERATE: this.formObj.usePercent.replace('%', ''),
          ISHAVEOVERDUEOFCREDITCARD: '' + this.formObj.isDelay,
          CREDITCARDOVERDUETIMES: this.formObj.fiveyearsDelay,
          CREDITLOANAMOUNT: this.formObj.loanAmount,
          CREDITLOANBANLANCE: this.formObj.leaveAmount,
          CREDITLOANTIMES: this.formObj.loanTimes,
          QUERYTIMESOFMONTH: this.formObj.oneQueryTimes,
          QUERYTIMESOFTHREEMONTH: this.formObj.threeQueryTimes,
          QUERYTIMESOFHALFYEAR: this.formObj.sixQueryTimes,
          LIVEINFO: '' + this.formObj.liveInfo,
          RENTCORPUS: this.formObj.rent,
          TDSCORES: this.formObj.tdScore,
          PHONEONLIVE: this.formObj.phoneLive
        };
        // window.localStorage.setItem('applyLoan', JSON.stringify(sendData));
        let strUrl = '/Apply/InsertSDAPPLYCUSTOMERINFO';
        if (this.flashLoan.ID) {
          strUrl = '/Apply/UpdateSDAPPLYCUSTOMERINFO';
          addData.ID = this.flashLoan.ID;
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
                sdloan: true
              });
            }

            this.toSuccessLink({
              data: {
                realName: this.realName,
                cardNo: this.cardNo,
                userGuid: this.customerUserGuid,
                ApplyGuid: this.applyGuid
              },
              url: 'save-success.html'
            });
          }
        });
      },
      setHeader() {
        window.platformAdapter.flashLoanBtnEvent = () => {
          this.addBtnEvent();
        };
        Native.NUI.setHeader({
          title: '闪电贷',
          isBack: true,
          rightTitle: '保存',
          rightText: '保存',
          rightCallback: 'flashLoanBtnEvent',
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
      // this.setLoginInfo();/**测试用，正式环境删除 */
      this.getLoginInfo();
      this.getCreditChannel();
      this.getFlashLoan();
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

  .box {
    ul {
      width: 690px;
      margin: 0 auto;

      li {
        height: 88px;
        line-height: 88px;
        .w100;
        .fl;

        &.comli {
          .placeholder(#999999, 28px);
        }
      }
    }
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
