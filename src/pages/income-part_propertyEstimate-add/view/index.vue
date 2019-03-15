<template>
  <div class="income-part">
    <my-line-input item-name="资产类型:">
      <group v-if="myParams.type!=='edit'">
        <popup-picker v-model="propertyType" :data="propertyTypeArr" placeholder="请选择" :columns="1"
                      show-name></popup-picker>
      </group>
      <div class="income-part-my-text" v-else>
        {{editType}}
      </div>
    </my-line-input>
    <!--房产-->
    <div class="house-type" v-if="propertyType[0]==='房产'">
      <my-line-input item-name="购买方式:">
        <group>
          <popup-picker v-model="houseObj.buyType" :data="houseObj.buyTypeArr" :columns="1" show-name
                        placeholder="请选择"></popup-picker>
        </group>
      </my-line-input>
      <my-line-input item-name="购买日期:">
        <group>
          <datetime v-model="houseObj.buyDate" format="YYYY-MM-DD" placeholder="请选择" :start-date="buyHouseStartDate"
                    :end-date="buyHouseEndDate"></datetime>
        </group>
      </my-line-input>
      <my-line-input item-name="购买价(万):" v-model="houseObj.price" maxlength="10"></my-line-input>
      <my-line-input item-name="房产面积（m²）:" v-model="houseObj.area" :left-text-width="125"
                     maxlength="10"></my-line-input>
      <my-line-input item-name="共有产权人:" v-model="houseObj.publicRightPerson" :left-text-width="125"></my-line-input>
      <my-line-input item-name="房屋地址:">
        <group>
          <x-address v-model="houseObj.addressProvinceCity" :list="addressData" placeholder="请选择地址" title=""
                     :show.sync="houseObj.showAddress"></x-address>
        </group>
      </my-line-input>
      <my-line-input :half-line="false" placeholder="请输入详细地址" v-model="houseObj.addressDetail"></my-line-input>
      <div class="btn-group">
        <!-- <my-button :active-status="true" @btn-event="houseBtnEvent">保存</my-button>-->
        <my-button :active-status="true" @btn-event="delBtnEvent(1)" v-if="houseObj.id">删除</my-button>
      </div>
    </div>

    <!--车产类型-->
    <div class="car-type" v-else-if="propertyType[0]==='车产'">
      <my-line-input item-name="购买方式:">
        <group>
          <popup-picker v-model="carObj.buyType" :data="carObj.buyTypeArr" placeholder="请选择" :columns="1" show-name></popup-picker>
        </group>
      </my-line-input>
      <my-line-input item-name="购买日期:">
        <datetime v-model="carObj.buyDate" format="YYYY-MM-DD" placeholder="请选择" :start-date="buyCarStartDate"
                  :end-date="buyCarEndDate"></datetime>
      </my-line-input>
      <my-line-input item-name="购买价(万):" v-model="carObj.price" maxlength="4"></my-line-input>
      <my-line-input item-name="品牌车型:" v-model="carObj.carType"></my-line-input>
      <my-line-input item-name="车牌号码:" v-model="carObj.cardNumber" maxlength="8"></my-line-input>
      <my-line-input item-name="车辆识别代号:" v-model="carObj.resNum"></my-line-input>
      <my-line-input item-name="发动机号码:" v-model="carObj.machineNum"></my-line-input>
      <my-line-input item-name="是否二手车:" :left-text-width="125">
        <my-check-radio v-model="carObj.isSecondHand"></my-check-radio>
      </my-line-input>
      <div class="btn-group">
        <!-- <my-button :active-status="true" @btn-event="carBtnEvent">保存</my-button>-->
        <my-button :active-status="true" @btn-event="delBtnEvent(2)" v-if="carObj.id">删除</my-button>
      </div>
    </div>
    <div class="other-type" v-else>
      <my-line-input item-name="资产金额:" v-model="otherAssetsObj.propertyAmount"></my-line-input>
      <my-line-input item-name="备注:" v-model="otherAssetsObj.remark" :is-required="false"></my-line-input>
      <div class="btn-group">
        <!--<my-button :active-status="true" @btn-event="otherBtnEvent">保存</my-button>-->
        <my-button :active-status="true" @btn-event="delBtnEvent(3)" v-if="otherAssetsObj.id">删除</my-button>
      </div>
    </div>
    <!--<div class="btn-group">-->
    <!--<my-button :active-status="true" @btn-event="totalSaveBtnEvent">保存</my-button>-->
    <!--</div>-->
    <confirm v-model="popupInfo.show" @on-confirm="popupConfirm">
      <p style="text-align:center;">{{ popupInfo.text }}</p>
    </confirm>

    <div class="confirm-layout" v-transfer-dom>
      <confirm v-model="showConfirm" confirm-text="需要" cancel-text="不需要" @on-confirm="onConfirm" @on-cancel="onCancel">
        <p style="text-align:center;">您还未保存，是否需要保存填写内容？</p>
      </confirm>
    </div>
  </div>
</template>
<script>
  import MyLineInput from '@/components_custom/my-line-input';
  import MyButton from '@/components_custom/my-private-btn';
  import MyCheckRadio from '@/components_custom/my-check-icon-ticket';
  import {CheckIcon, ChinaAddressV4Data, Confirm, Datetime, Group, PopupPicker, XAddress,TransferDomDirective as TransferDom} from 'vux';
  import {strategy, Valitor} from "../../../common/validForm";
  import Native from '@/common/native';
  import {getParameter} from "../../../common/utils/url";

  export default {
    directives:{
      TransferDom
    },
    components: {
      MyLineInput,
      MyButton,
      MyCheckRadio,
      Group,
      PopupPicker,
      CheckIcon,
      Datetime,
      XAddress,
      Confirm,
      ChinaAddressV4Data
    },
    data() {
      return {
        myParams: {
          type: getParameter('type'),
          propertyType: getParameter('propertyType'),
          id: getParameter('id'),
          userGuid: getParameter('userGuid'),
          dateInfoSource:getParameter('dateInfoSource')
        },
        popupInfo: {
          type: 0, //1房产，2车产,3其他
          title: '',
          text: '确定删除信息吗？',
          show: false
        },
        propertyType: ['房产'],
        propertyTypeArr: [
          {name: '房产', value: '1', parent: 0},
          {name: '车产', value: '2', parent: 0},
          {name: '股票和其他资产', value: '3', parent: 0}
        ],
        editType: '',
        /*房产*/
        houseObj: {
          id: null,
          buyType: [],
          buyTypeArr: [],
          buyDate: '',
          price: '',
          area: '',
          publicRightPerson: '',
          addressProvinceCity: [],
          addressDetail: '',
          showAddress: false
        },
        /*车产*/
        carObj: {
          id: null,
          buyType: [],
          buyTypeArr: [{
            "name": "一次性",
            "value": "{84D7828F-7462-45D4-85E0-D2201750015F}"
            },
            {
              "name": "按揭",
              "value": "{E53309B2-1B8F-4A80-A5AC-C358A96CC62F}"
            }
          ],
          buyDate: '',
          price: '',
          carType: '',
          cardNumber: '',
          isSecondHand: false,
          resNum: '',
          machineNum: ''

        },
        /*股票和其他资产*/
        otherAssetsObj: {
          id: null,
          propertyType: [],
          propertyTypeArr: null,
          propertyAmount: '',
          remark: ''
        },
        nowTime: new Date(),
        addressData: ChinaAddressV4Data,
        loginInfo: (function () {
          let loginInfo = localStorage.getItem('loginInfo');
          return JSON.parse(loginInfo)
        })(),
        showConfirm:false
      }
    },
    computed: {
      buyHouseStartDate() {
        let nowTime = this.nowTime;
        let startYear = nowTime.getFullYear() - 70;
        let timeDate = new Date(startYear + '');
        return timeDate.toISOString().slice(0, 10);
      },
      buyHouseEndDate() {
        let nowTime = this.nowTime;
        let timeStr = nowTime.toISOString();
        return timeStr.slice(0, 10)
      },
      buyCarStartDate() {
        let nowTime = this.nowTime;
        let startYear = nowTime.getFullYear() - 50;
        let timeDate = new Date(startYear + '');
        return timeDate.toISOString().slice(0, 10);
      },
      buyCarEndDate() {
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
        this.totalSaveBtnEvent();
      },
      onCancel() {
        Native.NRouter.back();
      },
      toSuccessLink(option) {
        if(this.myParams.dateInfoSource){
          window.platformAdapter.setEFromFamily({assess: true});
        }
        let assignObj = {
          url: 'save-success.html'
        };
        let openObj = option ? Object.assign(assignObj, option) : assignObj;
        Native.NUI.refresh({
          refreh_page: 'income-part_propertyEstimate.html'
        });
        Native.NRouter.assign(openObj)
      },
      queryHouseReq(id, propertyType) {
        /*获取房产信息*/
        this.propertyType = [propertyType];
        this.editType = propertyType;
        this.$axios({
          url: '/Apply/GetHouse',
          params: {
            ID: id
          },
          typeName: '85'
        }).then((res) => {
          let resData = res.data;
          let houseRes = resData.Model && resData.Model.house;
          let houseObj = this.houseObj;
          if (houseRes) {
            houseObj.id = houseRes.ID;
            houseObj.buyType = [houseRes.BUY_STATE];
            houseObj.buyDate = houseRes.BUY_DATE && houseRes.BUY_DATE.substring(0, 10);
            houseObj.price = houseRes.BUY_PRICE;
            houseObj.area = houseRes.AREAGE;
            houseObj.publicRightPerson = houseRes.SHARED_WITH;
            houseObj.addressProvinceCity = [houseRes.ADDRESS_PROVINCE + '', houseRes.ADDRESS_CITY + '', houseRes.ADDRESS_COUNTY + ''];
            houseObj.addressDetail = houseRes.ADDRESS_DETAIL;
          }

        })
      },
      queryCarReq(id, propertyType) {
        this.propertyType = [propertyType];
        this.editType = propertyType;
        this.$axios({
          url: '/Apply/GetCar',
          params: {
            ID: id
          },
          typeName: '85'
        }).then((res) => {
          let resData = res.data;
          let carRes = resData.Model && resData.Model.house;
          let carObj = this.carObj;
          carObj.id = carRes.ID;
          carObj.buyType = [carRes.BUY_STATE];
          carObj.buyDate = carRes.BUY_DATE && carRes.BUY_DATE.substring(0, 10);
          carObj.price = carRes.BUY_PRICE;
          carObj.carType = carRes.CAR_BRAND;
          carObj.cardNumber = carRes.CAR_NO;
          carObj.isSecondHand = carRes.IS_NEW === '0';
          carObj.resNum = carRes.CAR_NUM;
          carObj.machineNum = carRes.ENGINE_NUM
        })

      },
      queryOtherReq(id, propertyType) {
        /*  let myAsset=window.localStorage.getItem('myAssetsType');
          myAsset=JSON.parse(myAsset);
          this.propertyTypeArr=myAsset;*/
        this.editType = this.myParams.propertyType;
        let countPropertyType = this.propertyTypeArr.length && this.propertyTypeArr.find(function (item) {
          if (item.name !== '房产' && item.name !== '车产') {
            return item;
          }
        });
        this.propertyType = [countPropertyType.value];
        this.$axios({
          url: '/Apply/GetOther',
          params: {
            ID: id
          },
          typeName: '85'
        }).then((res) => {
          let resData = res.data;
          console.log(resData);
          let otherRes = resData.Model && resData.Model.house;
          let otherAssetsObj = this.otherAssetsObj;
          otherAssetsObj.id = otherRes.ID;
          otherAssetsObj.propertyType = [otherRes.ASSET_TYPE];
          otherAssetsObj.propertyAmount = otherRes.ASSET_AMOUNT;
          otherAssetsObj.remark = otherRes.REMARK;
        })
      },
      getPageTypeInit() {
        let type = this.myParams.type;
        let propertyType = this.myParams.propertyType ? decodeURIComponent(this.myParams.propertyType) : this.propertyType + '';
        let id = this.myParams.id;
        if (type === 'edit') {
          switch (propertyType) {
            case '房产':
              this.queryHouseReq(id, propertyType);
              break;
            case '车产':
              this.queryCarReq(id, propertyType);
              break;
            default:
              this.queryOtherReq(id, propertyType);
              break;
          }
        }
      },
      houseBtnEvent() {
        let loginInfo = this.loginInfo;
        if (!loginInfo) {
          return
        }
        let houseObj = this.houseObj;
        let notEmptyStr = '请填写';
        let validator = new Valitor();
        validator.add(strategy.isNotEmpty(houseObj.buyType, notEmptyStr + '购买方式'));
        validator.add(strategy.isNotEmpty(houseObj.buyDate, notEmptyStr + '购买日期'));
        validator.add(strategy.isNotEmpty(houseObj.price, notEmptyStr + '购买价格'));
        validator.add(strategy.isNotEmpty(houseObj.area, notEmptyStr + '房产面积'));
        validator.add(strategy.isNotEmpty(houseObj.price, notEmptyStr + '房产面积'));
        validator.add(strategy.decimalByTwoFormat(houseObj.area, '房产面积格式错误:小数点最多两位'));
        validator.add(strategy.decimalByTwoFormat(houseObj.price, '房产价格格式错误:小数点最多两位'));

        validator.add(strategy.isNotEmpty(houseObj.publicRightPerson, notEmptyStr + '共有产权人'));
        validator.add(strategy.isNotEmpty(houseObj.addressProvinceCity, notEmptyStr + '省市'));
        validator.add(strategy.isNotEmpty(houseObj.addressDetail, notEmptyStr + '详细地址'));
        let result = validator.start();
        if (result) {
          this.$toast({
            message: result
          });
          return false;
        }

        let reqUrl = '/Apply/InsertHouse';
        let houseId = null;
        if (houseObj.id) {
          reqUrl = '/Apply/EditHouse';
          houseId = houseObj.id;
        }
        let sendData = {
          ID: houseId,
          ADDRESS_CITY: houseObj.addressProvinceCity[1],
          ADDRESS_COUNTY: houseObj.addressProvinceCity[2],
          ADDRESS_DETAIL: houseObj.addressDetail,
          ADDRESS_PROVINCE: houseObj.addressProvinceCity[0],
          AREAGE: houseObj.area,
          BUY_DATE: houseObj.buyDate,
          BUY_PRICE: houseObj.price,
          BUY_STATE: houseObj.buyType + '',
          CREATE_USER_ID: loginInfo.UserGuid,
          CUSTOMER_GUID: this.myParams.userGuid,
          LAST_UPDATE_USER_ID: loginInfo.UserGuid,
          SHARED_WITH: houseObj.publicRightPerson,
          DATE_INFO_SOURCE:this.myParams.dateInfoSource
        };
        this.$axios({
          url: reqUrl,
          method: 'post',
          data: sendData,
          typeName: '85'
        }).then((res) => {
          let resData = res.data;
          if (res && resData && resData.ResultType === 0) {
            this.toSuccessLink()
          }
        })

      },
      carBtnEvent() {
        let loginInfo = this.loginInfo;
        if (!loginInfo) {
          return false;
        }
        let carObj = this.carObj;
        let notEmptyStr = '请填写';
        let validator = new Valitor();
        validator.add(strategy.isNotEmpty(carObj.buyType, notEmptyStr + '购买方式'));
        validator.add(strategy.isNotEmpty(carObj.buyDate, notEmptyStr + '购买日期'));
        validator.add(strategy.isNotEmpty(carObj.price, notEmptyStr + '购买价格'));
        validator.add(strategy.isNotEmpty(carObj.carType, notEmptyStr + '品牌车型'));
        validator.add(strategy.isNotEmpty(carObj.cardNumber, notEmptyStr + '车牌号码'));
        validator.add(strategy.isNotEmpty(carObj.resNum, notEmptyStr + '车辆识别代号'));
        validator.add(strategy.isNotEmpty(carObj.machineNum, notEmptyStr + '发动机号码'));
        let result = validator.start();
        if (result) {
          this.$toast({
            message: result
          });
          return false;
        }

        let reqUrl = '/Apply/InsertCar';
        let carId = null;
        if (carObj.id) {
          reqUrl = '/Apply/EditCar';
          carId = carObj.id;
        }
        let sendData = {
          ID: carId,
          BUY_DATE: carObj.buyDate,
          BUY_PRICE: carObj.price,
          BUY_STATE: carObj.buyType + '',
          CREATE_USER_ID: loginInfo.UserGuid,
          CUSTOMER_GUID: this.myParams.userGuid,
          LAST_UPDATE_USER_ID: loginInfo.UserGuid,
          CAR_NO: carObj.cardNumber,
          CAR_BRAND: carObj.carType,
          IS_NEW: carObj.isSecondHand ? 0 : 1,
          CAR_NUM: carObj.resNum,
          ENGINE_NUM: carObj.machineNum,
          DATE_INFO_SOURCE:this.myParams.dateInfoSource
        };
        this.$axios({
          url: reqUrl,
          method: 'post',
          data: sendData,
          typeName: '85'
        }).then((res) => {
          this.toSuccessLink()
        })


      },
      otherBtnEvent() {
        let loginInfo = this.loginInfo;
        if (!loginInfo) {
          return false
        }
        let otherAssetsObj = this.otherAssetsObj;
        let notEmptyStr = '请填写';
        let validator = new Valitor();
        validator.add(strategy.isNotEmpty(otherAssetsObj.propertyAmount, notEmptyStr + '金额'));

        let result = validator.start();
        if (result) {
          this.$toast({
            message: result
          });
          return false;
        }
        let reqUrl = '/Apply/InsertOthers';
        let otherAssetsObjId = null;
        let propertyType = this.propertyType;
        if (otherAssetsObj.id) {
          reqUrl = '/Apply/EditOthers';
          otherAssetsObjId = otherAssetsObj.id;
          propertyType = otherAssetsObj.propertyType;
        }
        let sendData = {
          ID: otherAssetsObjId,
          ASSET_AMOUNT: otherAssetsObj.propertyAmount,
          ASSET_TYPE: propertyType + '',
          REMARK: otherAssetsObj.remark,
          CREATE_USER_ID: loginInfo.UserGuid,
          CUSTOMER_GUID: this.myParams.userGuid,
          LAST_UPDATE_USER_ID: loginInfo.UserGuid,
          DATE_INFO_SOURCE:this.myParams.dateInfoSource
        };
        this.$axios({
          url: reqUrl,
          method: 'post',
          data: sendData,
          typeName: '85'
        }).then((res) => {
          this.toSuccessLink()
        })
      },
      delBtnEvent(type) {
        this.popupInfo.show = true;
        this.popupInfo.type = type;
      },
      delItemReq(delUrl, itemId) {
        let url = '/Apply/' + delUrl;
        let userGuid = this.myParams.userGuid;
        this.$axios({
          url: url,
          method: 'post',
          data: {
            Ids: itemId
          },
          typeName: '85'
        }).then((res) => {
          let resData = res.data;
          if (resData.ResultType === 0) {
            Native.NUI.refresh({
              refreh_page: 'income-part_propertyEstimate.html'
            });
            Native.NRouter.back({
              data: {
                userGuid: userGuid
              },
              url: 'income-part_propertyEstimate.html'
            });
          }
        });
      },
      popupConfirm() {
        let popupType = this.popupInfo.type;
        switch (popupType) {
          case 1:
            this.delItemReq('EditHouseStatus', this.houseObj.id);
            break;
          case 2:
            this.delItemReq('DeleteCar', this.carObj.id);
            break;
          case 3:
            this.delItemReq('DeleteOthers', this.otherAssetsObj.id);
            break;
        }
      },
      getPropertyTypeLocal() {
        let myAssetsType = localStorage.getItem('myAssetsType')
        if (myAssetsType) {
          myAssetsType = JSON.parse(myAssetsType);
          this.propertyTypeArr = this.exchangePopupFormat(myAssetsType)
        }
      },
      exchangePopupFormat(Arr, nameStr = 'Value', valueStr = 'Key', parentGuid) {
        /*转换popup-pickup*/
        return Arr.map(function (item) {
          return {
            name: item[nameStr],
            value: item[valueStr],
            parent: 0
          }
        });
      },
      totalSaveBtnEvent() {
        let propertyType = this.myParams.propertyType ? decodeURIComponent(this.myParams.propertyType) : this.propertyType + '';
        switch (propertyType) {
          case '房产':
            this.houseBtnEvent();
            break;
          case '车产':
            this.carBtnEvent();
            break;
          default:
            this.otherBtnEvent();
        }
      },
      setHeader() {
        window.platformAdapter.savePropertyEstimateEvent = () => {
          this.totalSaveBtnEvent();
        };
        window.platformAdapter.isSaveThisFormBtnEvent=()=>{
          this.showSave();
        };
        Native.NUI.setHeader({
          isBack: true,
          backUrl: 'income-part_propertyEstimate.html',
          title: '资产评估',
          rightText: '保存',
          rightTitle: '保存',
          rightCallback: 'savePropertyEstimateEvent',
          leftCallback: 'isSaveThisFormBtnEvent'
        })
      },
      getHouseBuyType() {
        this.$axios({
          url: '/Apply/GetPubcodeInfos',
          method: 'get',
          params: {
            code: 'BuyHouseType'
          },
          typeName: '85'
        }).then((res) => {
          let resData = res.data;
          if (res && resData) {
            let Model = resData.Model;
            if (Model) {
              this.houseObj.buyTypeArr = this.exchangePopupFormat(Model, 'Name', 'Guid')
            }
          }
        })
      },
    },

    mounted() {
      this.getPageTypeInit();
      this.setHeader();
      this.getPropertyTypeLocal();
      this.getHouseBuyType();
    }
  }
</script>
<style lang='less'>
  @import '~@/styles/base.less';

  .income-part {

  }

  .income-part-title {
    height: 40px;
    line-height: 40px;
    background: #44a4ef;
  }


</style>
