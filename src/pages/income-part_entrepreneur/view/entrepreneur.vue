<template>
  <div class="income-part">
    <!--<div class="income-part-title"></div>-->
    <my-line-input item-name="企业名称：" v-model="formObj.entreName" placeholder="请输入"></my-line-input>
    <my-line-input item-name="业务开始时间：">
      <datetime v-model="formObj.businessTime" format="YYYY-MM-DD" placeholder="点击选择" :start-date="startTime"
                :end-date="endTime"></datetime>
    </my-line-input>
    <my-line-input item-name="所属行业：">
      <group>
        <popup-picker v-model="formObj.industry" :data="formObj.industryAttr" show-name
                      placeholder="点击选择"></popup-picker>
      </group>
    </my-line-input>
    <my-line-input item-name="行业分类：">
      <group>
        <popup-picker v-model="formObj.industryType" :data="formObj.industryTypeAttr" :columns="1" show-name
                      placeholder="点击选择"></popup-picker>
      </group>
    </my-line-input>
    <my-line-input item-name="公司性质：">
      <group>
        <popup-picker v-model="formObj.companyType" :data="formObj.companyTypeAttr" show-name
                      placeholder="点击选择"></popup-picker>
      </group>
    </my-line-input>
    <my-line-input item-name="雇员人数：" v-model="formObj.employerNum" type="number"></my-line-input>
    <my-line-input item-name="企业法人：" v-model="formObj.entreprise"></my-line-input>
    <my-line-input item-name="股东人数：" v-model="formObj.stockNum" type="number" :is-required="false"></my-line-input>
    <my-line-input item-name="股份占比：">
      <div class="common-part-right">
        <input class="common-input1" v-model="formObj.stockPercent" type="number"><span
        style="font-size: 15px;">%</span>
      </div>
    </my-line-input>

    <my-line-input item-name="企业电话：" v-model="formObj.telephone" :is-required="false"
                   placeholder="格式：010-84521254-123"></my-line-input>
    <my-line-input item-name="营业执照：">
      <my-check-radio v-model="formObj.license" :trueValueText="'有'" falseValueText="无"></my-check-radio>
    </my-line-input>
    <my-line-input v-if="formObj.license" item-name="执照编号：" v-model="formObj.licenseNo"></my-line-input>
    <my-line-input item-name="企业经营许可证：">
      <group>
        <popup-picker v-model="formObj.certificate" :data="formObj.certificateAttr" show-name
                      placeholder="点击选择"></popup-picker>
      </group>
    </my-line-input>
    <my-line-input item-name="企业纳税信用等级：">
      <group>
        <popup-picker v-model="formObj.creditLevel" :data="formObj.creditLevelAttr" show-name
                      placeholder="点击选择"></popup-picker>
      </group>
    </my-line-input>
    <my-line-input item-name="企业年缴税额：" v-model="formObj.revenue" type="number"></my-line-input>
    <my-line-input item-name="主营业务：" v-model="formObj.businessType">
    </my-line-input>
    <my-line-input item-name="经营场所：" :is-required="false">
      <group>
        <popup-picker v-model="formObj.businessAddress" :data="formObj.businessAddressAttr" @on-change="changeRent"
                      show-name placeholder="请选择">
        </popup-picker>
      </group>
    </my-line-input>
    <my-line-input :item-name="formObj.rentTitle" v-model="formObj.rent" :is-required="false"></my-line-input>
    <my-line-input item-name="经营面积：" type="number" :is-required="false">
      <div class="common-part-right">
        <input class="common-input1" v-model="formObj.businessArea"><span style="font-size: 15px;">平米</span>
      </div>
    </my-line-input>
    <my-line-input item-name="实际经营地址:">
      <group>
        <x-address :title="formObj.actualAddress.addressTitle" v-model="formObj.actualAddress.cityValue"
                   :list="this.listAddress" placeholder="请选择" :show.sync="formObj.actualAddress.showAddress">
        </x-address>
      </group>
    </my-line-input>
    <div class="common-part-right">
      <input class="common-input" v-model="formObj.actualAddress.addressDetail" :is-required="false" placeholder="详细地址">
    </div>

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
  import MyCheckRadio from '@/components_custom/my-check-icon-ticket';
  import {getParameter} from '@/common/utils/url';
  import {strategy, Valitor} from '@/common/validForm';
  import Native from '@/common/native';
  import {Confirm, Datetime, Group, PopupPicker, Selector, TransferDomDirective as TransferDom, XAddress} from 'vux';

  export default {
    directives: {
      TransferDom
    },
    components: {
      MyLineInput,
      Group,
      XAddress,
      Selector,
      PopupPicker,
      Datetime,
      MyCheckRadio,
      Confirm
    },
    data() {
      return {
        showConfirm: false,
        guidId: getParameter('customerGuid'), // 客户id
        formObj: {
          entreName: '',
          industry: [],
          industryAttr: [],
          industryType: [],
          industryTypeAttr: [],
          employerNum: '',
          entreprise: '',
          stockNum: '',
          businessTime: '',
          stockPercent: '',
          companyType: [],
          companyTypeAttr: [],
          telephone: '',
          license: false,
          licenseNo: '',
          rentTitle: '其它',
          rent: '',
          businessArea: '',
          revenue: '',
          certificate: [],
          certificateAttr: [],
          creditLevel: [],
          creditLevelAttr: [],
          /*经营场所*/
          businessAddress: [],
          businessAddressAttr: [],
          actualAddress: {
            showAddress: false,
            addressTitle: '',
            cityValue: [],
            addressDetail: ''
          },
          businessType: '',
        },
        listAddress: [],
        userLoginInfo: {},
        businessInfo: {},
        nowTime: new Date(),
        customerUserGuid: getParameter('userGuid'),
        realName: getParameter('realName'),
        cardNo: getParameter('cardNo'),
        applyGuid: getParameter('applyGuid'),
        dateInfoSource: getParameter('dateInfoSource'), // 是否是恒e家的数据1为是，否则否
        slotProps: {
          tempest: 10
        }
      }
    },
    watch: {
      'formObj.industry': function (newValue, oldValue) {
        // if (newValue != oldValue)
        this.getIndustryType(newValue, oldValue);
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
      // 组装省份区域
      exchangeArea(ArrObj, parentId) {
        /*转换省市格式，递归省市树换成一维数组*/
        if (Array.isArray(ArrObj) && ArrObj.length) {
          for (let i = 0; i < ArrObj.length; i++) {
            let item = ArrObj[i];
            let tempestObj = {
              value: item.Id,
              name: item.Name,
            };
            if (parentId) {
              tempestObj.parent = parentId
            }
            this.listAddress.push(tempestObj);
            this.exchangeArea(item['Sub'], item.Id)
          }
        } else {
          return ArrObj
        }
      },
      // 查询省市区地址
      getArea() {
        this.$axios({
          url: '/Apply/GetAreas',
          data: {},
          method: 'get',
          typeName: '85',
          showLoading: true
        }).then((area) => {
          if (area && area.data.Model) {
            this.exchangeArea(area.data.Model.Result);
          }
        }, (error) => {
          console.log(error);
        })
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
          Native.NRouter.getUserLoginInfo({
            'callback': 'getUserLoginInfo'
          });
        }
      },
      //所属行业
      getIndustry() {
        this.$axios({
          url: '/Apply/GetIndustrys',
          params: {
            parentguid: '{DE559C80-178C-4BB0-B418-F56CFEA15307}'
          },
          method: 'Get',
          typeName: '85'
        }).then((success) => {
          this.formObj.industryAttr.push(success.data.Model.Result.map(function (item) {
            let tt = {
              name: item.Value,
              value: item.Key,
              parent: 0
            };
            return tt;
          }));
        });
      },
      //行业分类
      getIndustryType(industry, oldIndustry) {
        //this.formObj.industryType = [];
        if (industry != "null" && industry != "" && industry != undefined) {
          this.$axios({
            url: '/Apply/GetSubIndustrys',
            params: {
              parentguid: industry
            },
            method: 'Get',
            typeName: '85'
          }).then((success) => {
            this.formObj.industryTypeAttr = success.data.Model.Result.map(function (item) {
              let tt = {
                name: item.NAME,
                value: item.GUID
              };
              return tt;
            });
            if (industry != oldIndustry)
              this.formObj.industryType = this.formObj.industryTypeAttr[0].value && [this.formObj.industryTypeAttr[0].value];
          });
        }
      },
      //公司性质
      getCompanyType() {
        this.$axios({
          url: '/Apply/GetPubcodeInfos',
          params: {
            code: 'UnitType'
          },
          method: 'Get',
          typeName: '85'
        }).then((success) => {
          this.formObj.companyTypeAttr.push(success.data.Model.map(function (item) {
            let tt = {
              name: item.Name,
              value: item.Guid
            };
            return tt;
          }));
        });
      },
      //企业资质
      getQualification() {
        this.$axios({
          url: '/Apply/GetPubcodeInfos',
          params: {
            code: 'EntQualification'
          },
          method: 'Get',
          typeName: '85'
        }).then((success) => {
          this.formObj.certificateAttr.push(success.data.Model.map(function (item) {
            let tt = {
              name: item.Name,
              value: item.Guid
            };
            return tt;
          }));
        });
      },
      //企业纳税信用等级
      getCreditLevel() {
        this.$axios({
          url: '/Apply/GetPubcodeInfos',
          params: {
            code: 'TaxLevel'
          },
          method: 'Get',
          typeName: '85'
        }).then((success) => {
          this.formObj.creditLevelAttr.push(success.data.Model.map(function (item) {
            let tt = {
              name: item.Name,
              value: item.Name
            };
            return tt;
          }));
        });
      },
      //经营场所
      getBusinessAddress() {
        this.$axios({
          url: '/Apply/GetPubcodeInfos',
          params: {
            code: 'RunType'
          },
          method: 'Get',
          typeName: '85'
        }).then((success) => {
          this.formObj.businessAddressAttr.push(success.data.Model.map(function (item) {
            let tt = {
              name: item.Name,
              value: item.Guid
            };
            return tt;
          }));
        });
      },
      //获取企业信息
      getBusinessInfo() {
        this.$axios({
          url: '/Apply/GetAppBusiness',
          params: {guid: this.guidId},
          method: 'get',
          typeName: '85',
          showLoading: true
        }).then((area) => {
          if (area && area.data.Model) {
            if (area.data.Model.Business) {
              let business = area.data.Model.Business;
              // 固定电话格式
              let fixPhone= '';
              if(business.PHONE_AREA) {
                fixPhone+=business.PHONE_AREA+'-';
              }
              if(business.PHONE_NO) {
                fixPhone+=business.PHONE_NO+ '-';
              }
              if(business.PHONE_EXT) {
                fixPhone +=business.PHONE_EXT;
              }
              this.businessInfo = business;
              this.formObj.entreName = business.CORPORATE_NAME;
              this.formObj.industry.push(business.INDUSTRY_TYPE);
              // this.getIndustryType(business.INDUSTRY_TYPE);
              this.formObj.industryType.push(business.INDUSTRY_SUB_TYPE);
              this.formObj.employerNum = business.STAFF_COUNT;
              this.formObj.entreprise = business.CORP_OWNER;
              this.formObj.stockNum = business.SHAREHOLDER_COUNT;
              this.formObj.businessTime = business.BUSINESS_BEGIN_DATE.substring(0, 10);
              this.formObj.stockPercent = (business.CORP_PERCENT != 'NaN' && business.CORP_PERCENT != null) ? business.CORP_PERCENT : '';
              this.formObj.companyType.push(business.CORP_TYPE);
              this.formObj.telephone = fixPhone;
              this.formObj.license = business.IS_HASLICENCE === 'Y' ? true : false;
              this.formObj.licenseNo = business.HASLICENCE_NO;
              if (business.LOCALE_TYPE === '{8AA0F0DD-F9DB-4DDB-A5CD-5497A4731700}') {
                this.formObj.rentTitle = '月租';
                this.formObj.rent = business.LOCALE_HIRE;
              } else {
                this.formObj.rentTitle = '其他';
                this.formObj.rent = business.LOCALE_OTHER_INFO;
              }
              this.formObj.businessArea = business.LOCALE_AREA;
              this.formObj.revenue = business.TAX_AMOUNT;
              this.formObj.certificate.push(business.EntQualification);
              this.formObj.creditLevel.push(business.TAX_LEVEL);
              this.formObj.businessAddress.push(business.LOCALE_TYPE);
              this.formObj.actualAddress.cityValue = [business.ADDRESS_PROVINCE + '', business.ADDRESS_CITY + '', business.ADDRESS_COUNTY + ''];
              this.formObj.actualAddress.addressDetail = business.ADDRESS_DETAIL;
              this.formObj.businessType = business.BUSINESS_TYPE;
            }
          }
        }, (error) => {
          console.log(error);
        })
      },
      changeRent(value) {
        if (value[0] === '{8AA0F0DD-F9DB-4DDB-A5CD-5497A4731700}') {
          this.formObj.rentTitle = '月租';
        } else {
          this.formObj.rentTitle = '其他';
        }
      },
      validAll() {
        let msgNot = '请填写';
        let selectNot = '请选择';
        let numOver = '字数超出50限制';
        let formatError = '格式有误';
        let validObj = new Valitor();
        validObj.add(strategy.isNotEmpty(this.formObj.entreName, msgNot + '企业名称'));
        validObj.add(strategy.isNotEmpty(this.formObj.businessTime, msgNot + '业务开始时间'));
        validObj.add(strategy.isNotEmpty(this.formObj.industry, selectNot + '所属行业'));
        validObj.add(strategy.isNotEmpty(this.formObj.industryType, selectNot + '行业分类'));
        validObj.add(strategy.isNotEmpty(this.formObj.companyType, selectNot + '公司性质'));
        validObj.add(strategy.isNotEmpty(this.formObj.employerNum, msgNot + '雇员人数'));
        validObj.add(strategy.isNotEmpty(this.formObj.entreprise, msgNot + '企业法人'));
        validObj.add(strategy.decimalByTwoFormat(this.formObj.stockPercent, '股份占比' + formatError));
        if (this.formObj.license)
          validObj.add(strategy.isNotEmpty(this.formObj.licenseNo, msgNot + '执照编号'));
        if (this.formObj.telephone)
          validObj.add(strategy.landLineTelephoneFormat(this.formObj.telephone, '企业电话' + formatError));
        validObj.add(strategy.isNotEmpty(this.formObj.certificate, selectNot + '企业经营许可证'));
        validObj.add(strategy.isNotEmpty(this.formObj.creditLevel, selectNot + '企业纳税信用等级'));
        validObj.add(strategy.isNotEmpty(this.formObj.revenue, msgNot + '企业年缴税额'));
        if (this.formObj.rent != null) {
          if (this.formObj.rentTitle === '月租')
            validObj.add(strategy.numberFormat(this.formObj.rent, '月租只能输入数字'));
          else
            validObj.add(strategy.isMaxLength(this.formObj.rent, '其它项' + numOver, 50));
        }
        validObj.add(strategy.isNotEmpty(this.formObj.businessType, selectNot + '主营业务'));
        validObj.add(strategy.isNotEmpty(this.formObj.actualAddress.cityValue, selectNot + '实际经营地址'));

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
        let telephone= this.formObj.telephone.split('-');
        let telephoneArea = telephone[0]?telephone[0]:''; // 区号
        let telephoneNum = telephone[1]?telephone[1]:''; // 办公号码
        let telephoneExt = telephone[2]?telephone[2]:''; // 分机号码
        let cusGuid = getParameter('customerGuid');
        let addData = {
          CREATE_USER_ID: this.userLoginInfo.UserGuid,
          CUSTOMER_GUID: cusGuid,
          LAST_UPDATE_USER_ID: this.userLoginInfo.UserGuid,
          BUSINESS_BEGIN_DATE: this.formObj.businessTime,
          INDUSTRY_TYPE: '' + this.formObj.industry,
          CORPORATE_NAME: this.formObj.entreName,
          CORP_OWNER: this.formObj.entreprise,
          CORP_TYPE: '' + this.formObj.companyType,
          CORP_PERCENT: parseFloat(this.formObj.stockPercent),
          HASLICENCE_NO: this.formObj.licenseNo,
          BUSINESS_TYPE: this.formObj.businessType,
          INDUSTRY_SUB_TYPE: '' + this.formObj.industryType,
          EntQualification: '' + this.formObj.certificate,
          TAX_LEVEL: '' + this.formObj.creditLevel,
          IS_HASLICENCE: this.formObj.license ? "Y" : "N",
          LOCALE_TYPE: '' + this.formObj.businessAddress,
          LOCALE_AREA: this.formObj.businessArea,
          LOCALE_HIRE: this.formObj.rent,
          LOCALE_OTHER_INFO: this.formObj.rent,
          TAX_AMOUNT: this.formObj.revenue,
          SHAREHOLDER_COUNT: this.formObj.stockNum,
          PHONE_NO: telephoneNum,
          PHONE_AREA: telephoneArea,
          PHONE_EXT: telephoneExt,
          STAFF_COUNT: this.formObj.employerNum,
          ADDRESS_PROVINCE: this.formObj.actualAddress.cityValue[0] + '',
          ADDRESS_CITY: this.formObj.actualAddress.cityValue[1] + '',
          ADDRESS_COUNTY: this.formObj.actualAddress.cityValue[2] + '',
          ADDRESS_DETAIL: this.formObj.actualAddress.addressDetail,
        };
        let strUrl = '/Apply/InsertBusiness';
        if (this.businessInfo.ID) {
          strUrl = '/Apply/EditBusiness';
          addData.ID = this.businessInfo.ID;
        }
        if (this.formObj.businessAddress[0] === '{8AA0F0DD-F9DB-4DDB-A5CD-5497A4731700}')
          addData.LOCALE_OTHER_INFO = '';
        else
          addData.LOCALE_HIRE = '';
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
                information: true
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
        window.platformAdapter.entrepreneurBtnEvent = () => {
          this.addBtnEvent();
        };
        Native.NUI.setHeader({
          title: '企业信息',
          isBack: true,
          rightTitle: '保存',
          rightText: '保存',
          rightCallback: 'entrepreneurBtnEvent',
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
      this.getIndustry();
      this.getArea();
      // this.getIndustryType();
      this.getCompanyType();
      this.getQualification();
      this.getCreditLevel();
      this.getBusinessAddress();
    },
    created() {
      // this.setLoginInfo(); /**测试用，正式环境删除 */
      this.getLoginInfo();
      this.getBusinessInfo();
    }
  }
</script>

<style lang="less">
  @import '~@/styles/base.less';

  @inputHeight: 104px;
  @spanFontSize: 28px;

  .income-part {
  }

  .income-part-title {
    height: 40px;
    line-height: 40px;
    background: #44a4ef;
  }

  .common-part-right {
    width: 100%;
    height: inherit;
    float: right;
    border-bottom: 1px solid #ddd;
  }

  .common-input {
    float: right;
    height: @inputHeight;
    line-height: @inputHeight;
    border: none;
    width: 93%;
    text-align: left;;
    background: none;
    font-size: @spanFontSize;
    padding-right: 40px;
  }

  .common-input1 {
    width: 70%;
    height: 50%;
    border: 1px solid #ddd;
    text-align: left;
    font-size: @spanFontSize;
  }

  .common-part-list {
  }

  .income-part__input-name {
  }

  .shell {
    //line-height: 22vw;
    text-align: center;
  }

  .delBtn {
    width: 35vw;
    height: 7vw;
    border: 0px;
    color: white;
    border-radius: 15px;
    text-align: center;
    background: #44a4ef;
    font-size: 3.733vw;
  }

  .confirm-layout {
    .weui-dialog__btn_primary {
      color: #44A4EF;
    }
  }
</style>
