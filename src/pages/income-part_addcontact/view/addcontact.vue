<template>
  <div class="income-part">
    <!--<div class="income-part-title">-->

    <!--</div>-->

    <my-line-input item-name="姓名:" v-model="formObj.name" placeholder="请填写">
    </my-line-input>
    <my-line-input item-name="性别:">
      <group>
        <popup-picker v-model="formObj.sex" :data="formObj.sexAttr" show-name placeholder="请选择"></popup-picker>
      </group>
    </my-line-input>
    <my-line-input item-name="关系:">
      <group>
        <popup-picker v-model="formObj.relationship" :data="formObj.relationshipAttr" :columns="1" show-name
                      placeholder="请选择"></popup-picker>
      </group>
    </my-line-input>
    <my-line-input item-name="手机号:" v-model="formObj.cellphone" type="number"></my-line-input>
    <my-line-input item-name="手机号1:" v-model="formObj.cellphone1" type="number" :isRequired="false"></my-line-input>
    <my-line-input item-name="身份证号:" v-model="formObj.idcard"
                   :isRequired="this.formObj.relationship[0]==='配偶'"></my-line-input>
    <my-line-input item-name="是否知晓借款:" :leftTextWidth="200">
      <group>
        <popup-picker :columns="1" v-model="formObj.isknowloan" :data="formObj.isknowloanAttr" show-name
                      placeholder="请选择"></popup-picker>
      </group>
    </my-line-input>
    <my-line-input item-name="单位名称:" v-model="formObj.department" :isRequired="false"></my-line-input>
    <my-line-input item-name="职务:" v-model="formObj.position" :isRequired="false"></my-line-input>
    <my-line-input item-name="股份占比:" type="number" :isRequired="false">
      <div class="common-part-right">
        <input class="common-input1" v-model="formObj.stockpercent"><span style="font-size: 15px;">%</span>
      </div>
    </my-line-input>
    <my-line-input item-name="固定电话:" v-model="formObj.telephone" :isRequired="false"></my-line-input>
    <my-line-input item-name="家庭地址:" :isRequired="false">
      <group>
        <x-address :title="formObj.familyAddress.addressTitle" v-model="formObj.familyAddress.cityValue"
                   :list="this.addressList" placeholder="请选择" :show.sync="formObj.familyAddress.showAddress">
        </x-address>
      </group>
    </my-line-input>
    <div class="common-part-right">
      <input class="common-input" v-model="formObj.familyAddress.addressDetails" placeholder="请输入详细地址">
    </div>
    <my-line-input item-name="工作地址:" :isRequired="false">
      <group>
        <x-address :title="formObj.companyMyAddress.addressTitle" v-model="formObj.companyMyAddress.cityValue"
                   :list="this.addressList" placeholder="请选择" :show.sync="formObj.companyMyAddress.showAddress">
        </x-address>
      </group>
    </my-line-input>
    <div class="common-part-right">
      <input class="common-input" v-model="formObj.companyMyAddress.addressDetails" placeholder="请输入详细地址">
    </div>
    <!--<div class="shell">-->
    <!--<button class="delBtn" @click="addBtnEvent">保存</button>-->
    <!--</div>-->
  </div>
</template>

<script>
  import {strategy, Valitor} from '@/common/validForm';
  import MyLineInput from '@/components_custom/my-line-input';
  import Native from '@/common/native';
  import {getParameter} from '@/common/utils/url';
  import {ChinaAddressV4Data, Datetime, Group, PopupPicker, Selector, XAddress} from 'vux';

  export default {
    components: {
      MyLineInput,
      Group,
      XAddress,
      Selector,
      PopupPicker,
      Datetime,
      ChinaAddressV4Data
    },
    data() {
      return {
        formObj: {
          name: '',
          sex: [],
          sexAttr: [
            [{
              name: '男',
              value: '{EBAF5B30-ABDE-461B-B56F-020566BB5455}'
            }, {
              name: '女',
              value: '{BDD35C56-549C-47D6-8402-C1612462390D}'
            }]
          ],
          relationship: [],
          relationshipAttr: [],
          cellphone: '',
          cellphone1: '',
          idcard: '',
          isknowloan: [],
          isknowloanAttr: [{
            name: '是',
            value: 'Y'
          }, {
            name: '否',
            value: 'N'
          }],
          department: '',
          position: '',
          stockpercent: '',
          telephone: '',
          /*家庭地址*/
          familyAddress: {
            showAddress: false,
            addressTitle: '',
            cityValue: [],
            addressDetails: ''
          },
          companyMyAddress: {
            showAddress: false,
            addressTitle: '',
            cityValue: [],
            addressDetails: ''
          },
          /*用来接收后台传来的全国省市的数组*/
          backgroundAddress: [],
          /*用来转换用的全国省市的数组*/
          emptyAddressArr: []
        },
        addressList: [],
        userLoginInfo: {},
        contactDetail: {},
        slotProps: {
          tempest: 10
        }
      }
    },
    computed: {},
    methods: {
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
            this.addressList.push(tempestObj);
            this.exchangeArea(item['Sub'], item.Id)
          }
        } else {
          return ArrObj
        }
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
      //关系
      getRelation() {
        this.$axios({
          url: '/Apply/GetPubcodeInfos',
          params: {
            code: 'RelationType'
          },
          method: 'Get',
          typeName: '85'
        }).then((success) => {
          this.formObj.relationshipAttr = success.data.Model.map(function (item) {
            let tt = {
              name: item.Name,
              value: item.Guid
            };
            return tt;
          });
          let _this = this;
          if (_this.formObj.relationshipAttr.length) {
            let customerGuid = getParameter('customerGuid');
            if (customerGuid) {
              let sendData = {
                Guid: customerGuid
              };
              this.$axios({
                method: 'get',
                url: '/Apply/GetAppCustomerInfo',
                params: sendData,
                typeName: '85'
              }).then((success) => {
                if (success && success.data.ResultType === 0) {
                  let customer = success.data.Model.CustomerInfo;
                  if (customer.MARRYORNOT === '{17E6E22F-939B-499F-95F7-A1A39363A960}') {
                    let tt = _this.formObj.relationshipAttr.findIndex(item =>
                      item.value === '{75C77C94-C632-4f86-B8C4-5CC920831120}'
                    );
                    _this.formObj.relationshipAttr.splice(tt, 1);
                  }
                }
              })
            }
          }
        });
      },
      getContractDetail() {
        let id = getParameter('Id');
        if (id) {
          let sendData = {
            Id: id
          };
          this.$axios({
            method: 'get',
            url: '/Apply/GetContactDetail',
            params: sendData,
            typeName: '85'
          }).then((success) => {
            if (success && success.data.ResultType === 0) {
              let detail = success.data.Model;
              this.contactDetail = detail;
              this.formObj.name = detail.FULL_NAME;
              if (detail.GENDER_GUID)
                this.formObj.sex = [detail.GENDER_GUID + ''];
              this.formObj.idcard = detail.ID_NO;
              this.formObj.department = detail.COMPANY_NAME;
              this.formObj.position = detail.POSITON;
              this.formObj.stockpercent = (detail.CORP_PERCENT != 'NaN' && detail.CORP_PERCENT != null) ? detail.CORP_PERCENT : '';
              if (detail.IS_KNOW_LOAN)
                this.formObj.isknowloan = [detail.IS_KNOW_LOAN + ''];
              if (detail.RELATION_GUID)
                this.formObj.relationship = [detail.RELATION_GUID + ''];
              this.formObj.cellphone = detail.PHONE_NO;
              let familyAddr = detail.AddList.find((value) => value.ADDRESS_TYPE == '2');
              let companyAddr = detail.AddList.find((value) => value.ADDRESS_TYPE == '0');
              let cell = detail.PhoneList.filter((value) => value.PHONE_TYPE === '0');
              let tele = detail.PhoneList.find((value) => value.PHONE_TYPE === '1');
              if (familyAddr != undefined) {
                this.formObj.familyAddress.cityValue = [familyAddr.ADDRESS_PROVINCE + '', familyAddr.ADDRESS_CITY + '',
                  familyAddr.ADDRESS_COUNTY + ''
                ];
                this.formObj.familyAddress.addressDetails = familyAddr.ADDRESS_DETAIL;
              }
              if (companyAddr != undefined) {
                this.formObj.companyMyAddress.cityValue = [companyAddr.ADDRESS_PROVINCE + '', companyAddr.ADDRESS_CITY + '',
                  companyAddr.ADDRESS_COUNTY + ''
                ];
                this.formObj.companyMyAddress.addressDetails = companyAddr.ADDRESS_DETAIL;
              }
              if (cell != undefined) {
                this.formObj.cellphone = cell[0].PHONE_NO;
                this.formObj.cellphone1 = cell.length > 1 ? cell[1].PHONE_NO : '';
              }
              if (tele != undefined) {
                this.formObj.telephone = (tele.PHONE_AREA == null ? '' : tele.PHONE_AREA + '-') + (tele.PHONE_NO == null ? '' : tele.PHONE_NO);
              }
            }
          });
        }
      },
      validAll() {
        let msgNot = '请填写';
        let selectNot = '请选择';
        let formatError = '格式有误';
        let validObj = new Valitor();
        validObj.add(strategy.isNotEmpty(this.formObj.name, msgNot + '姓名'));
        validObj.add(strategy.isNotEmpty(this.formObj.sex, selectNot + '性别'));
        validObj.add(strategy.isNotEmpty(this.formObj.relationship, selectNot + '关系'));
        validObj.add(strategy.isNotEmpty(this.formObj.cellphone, msgNot + '手机号'));
        validObj.add(strategy.phoneNumFormat(this.formObj.cellphone, '手机号' + formatError));
        if (this.formObj.cellphone1)
          validObj.add(strategy.phoneNumFormat(this.formObj.cellphone1, '手机号1' + formatError));
        if (this.formObj.relationship[0] === '{75C77C94-C632-4f86-B8C4-5CC920831120}')
          validObj.add(strategy.isNotEmpty(this.formObj.idcard, msgNot + '身份证号'));
        if (this.formObj.idcard)
          validObj.add(strategy.identityNum(this.formObj.idcard, '身份证号' + formatError));
        if (this.formObj.telephone)
          validObj.add(strategy.isHomePhoneFormat(this.formObj.telephone, '固定电话' + formatError));
        validObj.add(strategy.isNotEmpty(this.formObj.isknowloan, selectNot + '是否知晓贷款'));
        if (this.formObj.stockpercent != '') {
          validObj.add(strategy.decimalByStock(this.formObj.stockpercent, '股份占比' + formatError));
        }
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
          CREATE_USER_ID: this.userLoginInfo.UserGuid,
          LAST_UPDATE_USER_ID: this.userLoginInfo.UserGuid,
          CUSTOMER_GUID: getParameter('customerGuid'),
          FULL_NAME: this.formObj.name,
          GENDER_GUID: '' + this.formObj.sex,
          ID_NO: this.formObj.idcard,
          COMPANY_NAME: this.formObj.department,
          POSITON: this.formObj.position,
          CORP_PERCENT: this.formObj.stockpercent ? parseFloat(this.formObj.stockpercent) : '',
          IS_KNOW_LOAN: '' + this.formObj.isknowloan,
          RELATION_GUID: '' + this.formObj.relationship,
          PHONE_AREA: this.formObj.telephone.substr(0, this.formObj.telephone.indexOf('-')),
          PHONE_NO: this.formObj.telephone.substr(this.formObj.telephone.indexOf('-') + 1),
          PHONE_TYPE: 1,
          PhoneList: [{
            ID: 0,
            PHONE_NO: this.formObj.cellphone,
            PHONE_TYPE: '0',
          }, {
            ID: 1,
            PHONE_NO: this.formObj.cellphone1,
            PHONE_TYPE: '0',
          }, {
            ID: 2,
            PHONE_AREA: this.formObj.telephone.substr(0, this.formObj.telephone.indexOf('-')),
            PHONE_NO: this.formObj.telephone.substr(this.formObj.telephone.indexOf('-') + 1),
            PHONE_TYPE: '1',
          }],
          ADDRESS_PROVINCE: this.formObj.familyAddress.cityValue[0] + '',
          ADDRESS_CITY: this.formObj.familyAddress.cityValue[1] + '',
          ADDRESS_COUNTY: this.formObj.familyAddress.cityValue[2] + '',
          ADDRESS_DETAIL: this.formObj.familyAddress.addressDetails,
          ADDRESS_TYPE: 2,
          AddList: [{
            ADDRESS_PROVINCE: this.formObj.familyAddress.cityValue[0] + '',
            ADDRESS_CITY: this.formObj.familyAddress.cityValue[1] + '',
            ADDRESS_COUNTY: this.formObj.familyAddress.cityValue[2] + '',
            ADDRESS_DETAIL: this.formObj.familyAddress.addressDetails,
            ADDRESS_TYPE: 2
          }, {
            ADDRESS_PROVINCE: this.formObj.companyMyAddress.cityValue[0] + '',
            ADDRESS_CITY: this.formObj.companyMyAddress.cityValue[1] + '',
            ADDRESS_COUNTY: this.formObj.companyMyAddress.cityValue[2] + '',
            ADDRESS_DETAIL: this.formObj.companyMyAddress.addressDetails,
            ADDRESS_TYPE: 0
          }]
        };
        // window.localStorage.setItem('applyLoan', JSON.stringify(sendData));
        let strUrl = '/Apply/InsertContact';
        if (this.contactDetail.ID) {
          strUrl = '/Apply/EditContact';
          addData.CUSTOMER_GUID = this.contactDetail.CUSTOMER_GUID;
          addData.ID = this.contactDetail.ID;
        }
        this.$axios({
          method: 'post',
          url: strUrl,
          data: addData,
          typeName: '85',
          showLoading: true
        }).then((success) => {
          if (success && success.data.ResultType === 0) {
            Native.NUI.refresh({
              refreh_page: 'income-part_contact-list.html'
            });
            Native.NRouter.back({
              data: {
                customerGuid: addData.CUSTOMER_GUID
              },
              url: 'income-part_contact-list.html'
            });
            //  window.location.href='/applyloantwo.html';
          }
        });
      },
      setHeader() {
        window.platformAdapter.addContractBtnEvent = () => {
          this.addBtnEvent();
        };
        Native.NUI.setHeader({
          title: '添加联系人',
          isBack: true,
          rightTitle: '保存',
          rightText: '保存',
          rightCallback: 'addContractBtnEvent'
        })
      }
    },
    mounted() {
      this.setHeader();
      this.getRelation();
      this.getArea()
    },
    created() {
      // this.setLoginInfo(); /**测试用，正式环境删除 */
      this.getLoginInfo();
      this.getContractDetail();
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

  .common-part-list {
  }

  .income-part__input-name {
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
    width: 80%;
    height: 50%;
    border: 1px solid #ddd;
    text-align: left;
    font-size: @spanFontSize;
  }

  .shell {
    line-height: 22vw;
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
</style>
