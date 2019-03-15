<template>
  <div class="income-part">
    <my-line-input item-name="所属行业:">
      <group v-if="formObj.industryArr&&formObj.industryArr.length">
        <popup-picker v-model="formObj.industry" :data="formObj.industryArr" placeholder="请选择" :columns="1"
                      :show-name="true" ></popup-picker>
      </group>
      <span v-else></span>
    </my-line-input>

    <my-line-input item-name="行业分类：">
      <group v-if="formObj.industryTypeArr&&formObj.industryTypeArr.length">
        <popup-picker v-model="formObj.industryType" :data="formObj.industryTypeArr" placeholder="请选择" :columns="1"
                      :show-name="true">
        </popup-picker>
      </group>
      <span v-else></span>
    </my-line-input>

    <my-line-input item-name="公司性质：">
      <group v-if="formObj.companyNatureArr">
        <popup-picker v-model="formObj.companyNature" :data="formObj.companyNatureArr" placeholder="请选择" :columns="1"
                      show-name></popup-picker>
      </group>
      <span v-else></span>
    </my-line-input>

    <my-line-input item-name="单位全称：" v-model="formObj.companyFullName"></my-line-input>
    <my-line-input item-name="单位电话：" v-model="formObj.companyTelephone" placeholder="格式:010-12345678-1234" :is-required="false"></my-line-input>
    <my-line-input item-name="所在部门：" v-model="formObj.department" :is-required="false"></my-line-input>
    <my-line-input item-name="职务：" :is-required="false">
      <group v-if="formObj.positionArr">
        <popup-picker v-model="formObj.position" :data="formObj.positionArr" placeholder="请选择"  ></popup-picker>
      </group>
      <span v-else></span>
    </my-line-input>

    <my-line-input item-name="入职时间：">
      <datetime v-model="formObj.joinTime" format="YYYY-MM-DD" placeholder="请选择" :start-date="startTime"
                :end-date="endTime"></datetime>
    </my-line-input>

    <my-line-input item-name="发薪日：" :is-required="false">
      <datetime v-model="formObj.paymentDay" format="DD" placeholder="请选择"></datetime>
    </my-line-input>

    <my-line-input item-name="发薪方式：" :is-required="false">
      <group v-if="formObj.paymentWayArr">
        <popup-picker v-model="formObj.paymentWay" :data="formObj.paymentWayArr" placeholder="请选择" :columns="1"
                      show-name></popup-picker>
      </group>
      <span v-else></span>
    </my-line-input>

    <my-line-input item-name="单位地址：">
      <group v-if="emptyAddressArr.length">
        <x-address v-model="formObj.addressProvinceCity" :list="emptyAddressArr" placeholder="请选择地址" title=""
                   ></x-address>
      </group>
      <span v-else></span>
    </my-line-input>
    <my-line-input :half-line="false" placeholder="请输入详细地址" v-model="formObj.addressDetail"></my-line-input>
    <my-line-input item-name="单位人数：" v-model="formObj.unitNum" type="number"></my-line-input>

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
  import {CheckIcon, ChinaAddressV4Data, Datetime, Group, PopupPicker, XAddress,Confirm,TransferDomDirective as TransferDom} from 'vux';
  import {Valitor, strategy} from "../../../common/validForm";
  import Native from "../../../common/native";
  import {getParameter} from "../../../common/utils/url";
  let backgroundAddress =[];
  let emptyAddressArr=[];
  let exchangeArea=function (ArrObj, parentId) {
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
        emptyAddressArr.push(tempestObj);
        exchangeArea(item['Sub'], item.Id)
      }
    } else {
      return ''
    }
  };
  export default {
    directives:{
      TransferDom
    },
    components: {
      MyLineInput,
      MyButton,
      Group,
      PopupPicker,
      CheckIcon,
      Datetime,
      XAddress,
      Confirm
    },
    data() {
      return {
        formObj: {
          id: null,
          industry: [],
          industryArr: null,
          industryType: [],
          industryTypeArr: null,
          companyNature: [],
          companyNatureArr: null,
          companyFullName: '',
          companyTelephone: '',
          department: '',
          position: [],
          positionArr:null,
          joinTime: '',
          paymentDay: '', //发薪日
          paymentWay: [], //方式
          paymentWayArr: null,
          addressProvinceCity: [], //地址/省市
          addressDetail: '',//地址/详细地址
          showAddress: false,
          unitNum: ''
        },
        workUnitInfo: null,
        userGuid:getParameter('userGuid'),
        loginInfo: (function () {
          let loginInfo = localStorage.getItem('loginInfo');
          return JSON.parse(loginInfo)
        })(),
        nowTime: new Date(),
        addressData: ChinaAddressV4Data,
        loadTag: true, //产品类型flag标记 表示是否加载过
        /*用来接收后台传来的全国省市的数组*/
        backgroundAddress: [],
        /*用来转换用的全国省市的数组*/
        emptyAddressArr: emptyAddressArr,
        dateInfoSource: getParameter('dateInfoSource'),
        showConfirm:false
      }
    },
    computed: {
      startTime() {
        let nowTime = this.nowTime;
        let startYear = nowTime.getFullYear() - 40;
        let timeDate = new Date(startYear + '');
        return timeDate.toISOString().slice(0, 10)
      },
      endTime() {
        let nowTime = this.nowTime;
        let timeStr = nowTime.toISOString();
        return timeStr.slice(0, 10)
      },

    },
    methods: {
      exchangeCityData(backgroundAddress) {
        exchangeArea(backgroundAddress);
      },
      showSave() {
        this.showConfirm = true;
      },
      onConfirm() {
        this.workUnitBtnEvent();
      },
      onCancel() {
        Native.NRouter.back();
      },

      toSuccessLink(option){

        let assignObj={
          url: 'save-success.html'
        };
        let openObj= option?Object.assign(assignObj,option):assignObj;
        Native.NUI.refresh({
          refreh_page:'income-part_apply.html'
        });
        Native.NRouter.assign(openObj)
      },
      checkLoginInfo(){
        let loginInfo=localStorage.getItem('loginInfo');
        if(!loginInfo){
          Native.NRouter.getUserLoginInfo();
        }
      },
      workUnitBtnEvent() {
        /*工作单位信息提交*/
        let loginInfo = this.loginInfo;
        let formObj = this.formObj;
        if (!loginInfo) {
          return
        }
        /*表单验证*/
        let notEmptyStr = '请填写';
        let validator = new Valitor();
        validator.add(strategy.isNotEmpty(formObj.industry, notEmptyStr + '所属行业'));
        validator.add(strategy.isNotEmpty(formObj.industryType, notEmptyStr + '行业分类'));
        validator.add(strategy.isNotEmpty(formObj.companyNature, notEmptyStr + '公司性质'));
        validator.add(strategy.isNotEmpty(formObj.companyFullName, notEmptyStr + '单位全称'));
       // validator.add(strategy.isNotEmpty(formObj.companyTelephone, notEmptyStr + '单位电话'));
        validator.add(strategy.isNotEmpty(formObj.joinTime, notEmptyStr + '入职时间'));
        validator.add(strategy.isNotEmpty(formObj.addressProvinceCity, notEmptyStr + '省市地址'));
        validator.add(strategy.isNotEmpty(formObj.addressDetail, notEmptyStr + '详细地址'));
        formObj.companyTelephone.length>3 && validator.add(strategy.landLineTelephoneFormat(formObj.companyTelephone, '单位电话格式错误,应为123(4)-1234567(8)-1234'));
        validator.add(strategy.isNotEmpty(formObj.unitNum, notEmptyStr + '单位人数'));
        validator.add(strategy.numberFormat(formObj.unitNum, '单位人数为整数'));
        let result = validator.start();

        if (result) {
          this.$toast({
            message: result
          });
          return false;
        }
        /*表单验证 end*/
         let telephone= formObj.companyTelephone.split('-');
         let telephoneArea = telephone[0]?telephone[0]:''; // 区号
         let telephoneNum = telephone[1]?telephone[1]:''; // 办公号码
         let telephoneExt = telephone[2]?telephone[2]:''; // 分机号码
        /*根据ID是否为空，空则添加工作单位，还是修改工作单位*/
        let unitReqUrl = '/Apply/InsertWorkunitInfo';
        let unitId = null;
        if (formObj.id) {
          unitReqUrl = '/Apply/EditWorkunitInfo';
          unitId = formObj.id;
        }
        let sendData = {
          Id: unitId,
          ADDRESS_CITY: formObj.addressProvinceCity[1],
          ADDRESS_COUNTY: formObj.addressProvinceCity[2],
          ADDRESS_DETAIL: formObj.addressDetail,
          ADDRESS_PROVINCE: formObj.addressProvinceCity[0],
          COMPANY_NAME: formObj.companyFullName,
          CORP_TYPE: formObj.companyNature + '',
          CREATE_USER_ID: loginInfo.UserGuid,
          CUSTOMER_GUID: this.userGuid,
          DEPARTMENT_NAME: formObj.department,
          INDUSTRY_TYPE: formObj.industry + '',
          INDUSTRY_SUB_TYPE: formObj.industryType + '',
          INTO_DATE: formObj.joinTime,
          LAST_UPDATE_USER_ID: loginInfo.UserGuid,
          PHONE_NO: telephoneNum,
          PHONE_AREA: telephoneArea,
          PHONE_EXT: telephoneExt,
          POSITION: formObj.position+'',
          SALARY_DATE: formObj.paymentDay,
          SALARY_TYPE: formObj.paymentWay + '',
          Units_Number: formObj.unitNum,
          DATE_INFO_SOURCE:this.dateInfoSource
        };

        this.$axios({
          url: unitReqUrl,
          method: 'post',
          data: sendData,
          typeName: '85',
          showLoading:true
        }).then((res) => {
          let resData = res.data;
          if (res && resData && resData.ResultType === 0) {
            // 恒e家导入基本信息保存
            if(this.dateInfoSource) {
                window.platformAdapter.setEFromFamily({
                    workUnit: true
                });
            }
            this.toSuccessLink()
          }
        })


      },
      setUserInfo() {
        /*test only */
        let getUser = localStorage.getItem('loginInfo');
        if (!getUser) {
          let userObj = {
            "UserLoginId": "001",
            "RealName": "吕林峰",
            "Token": "R6tJnOCbUrE!",
            "UserGuid": "{508F788B-755F-4526-AF09-AE348AE34323}",
            "DepartmentGuid": "{83BFB725-4194-4B49-9A64-C6D8E3A5F7D4}",
            "DepartmentName": "IT部",
            "APPROVETYPEGUID": "{34BFA3CB-B41C-42DD-9FE4-5EF3F727BA72}"
          };
          localStorage.setItem('loginInfo', JSON.stringify(userObj))
        }
      },
      getWorkUnitReq() {
          this.$axios({
            url: '/Apply/GetAppWorkunit',
            method: 'get',
            params: {
              guid: this.userGuid
            },
            typeName: '85',
            showLoading: true
          }).then((res) => {
            let resData = res.data;
            let Model = resData.Model;

            if (Model) {
              this.overWriteWorkUnit(Model.Workunit);
              let UnitType = Model.UnitType;
              let grantSalary = Model.grantSalary;
              this.formObj.companyNatureArr = this.exchangePopupFormat(UnitType);
              this.formObj.paymentWayArr = this.exchangePopupFormat(grantSalary);
            }
          }).catch(()=>{

          })



      },
      overWriteWorkUnit(workUnitObj) {
        /*先判断workUnit是否为空null
        * 为空返回，有信息填写
        * 回填工作单位信息
        * */
        if (!workUnitObj) {
          return false
        }
        let fixPhone= '';
        this.formObj.id = workUnitObj.ID;
        this.formObj.industry = [workUnitObj.INDUSTRY_TYPE];
        this.formObj.industryType = [workUnitObj.INDUSTRY_SUB_TYPE];
        this.formObj.companyNature = [workUnitObj.CORP_TYPE];
        this.formObj.companyFullName = workUnitObj.COMPANY_NAME;
        if(workUnitObj.PHONE_AREA) {
          fixPhone+=workUnitObj.PHONE_AREA;
        }
        if(workUnitObj.PHONE_NO) {
          fixPhone+='-'+workUnitObj.PHONE_NO;
        }
        if(workUnitObj.PHONE_EXT) {
          fixPhone +='-'+workUnitObj.PHONE_EXT;
        }
        this.formObj.companyTelephone = fixPhone;
        this.formObj.department = workUnitObj.DEPARTMENT_NAME;
        this.formObj.position =workUnitObj.POSITION==null?[]:[workUnitObj.POSITION];
        this.formObj.joinTime = workUnitObj.INTO_DATE && workUnitObj.INTO_DATE.substring(0, 10);
        this.formObj.paymentDay = workUnitObj.SALARY_DATE + '';
        this.formObj.paymentWay = [workUnitObj.SALARY_TYPE];
       /* formObj.addressProvinceCity = [workUnitObj.ADDRESS_PROVINCE + '', workUnitObj.ADDRESS_CITY + '', workUnitObj.ADDRESS_COUNTY + ''];*/
        let tempestOne=  workUnitObj.ADDRESS_PROVINCE + '';
        let tempestTwo=workUnitObj.ADDRESS_CITY + '';
        let tempestThree=workUnitObj.ADDRESS_COUNTY + '';
        this.formObj.addressProvinceCity[0]=tempestOne;
        this.formObj.addressProvinceCity[1]=tempestTwo;
        this.formObj.addressProvinceCity[2]=tempestThree;
        this.formObj.addressDetail = workUnitObj.ADDRESS_DETAIL;
        this.formObj.unitNum=workUnitObj.Units_Number?workUnitObj.Units_Number:''
      },
      getIndustryReq() {
        this.$axios({
          url: '/Apply/GetIndustrys',
          method: 'get',
          params: {
            parentguid: '{DE559C80-178C-4BB0-B418-F56CFEA15307}'
          },
          typeName: '85',
          showLoading:true
        }).then((res) => {
          let resData = res.data;
          let Model = resData.Model;
          if (Model) {
            let array = Model.Result;
            this.formObj.industryArr = this.exchangePopupFormat(array);
            if(this.loadTag===false){
              if(this.formObj.industryArr&&this.formObj.industryArr.length){
                this.formObj.industry=[this.formObj.industryArr[0].value];
              }
            }

          }
        }).catch(()=>{

        })

      },
      getPopupDataInit() {
      /*  this.getIndustryReq();
        this.getWorkUnitReq();*/
        let getIndustryReq=this.getIndustryReq;
        let getWorkUnitReq=this.getWorkUnitReq;

        getIndustryReq();
        getWorkUnitReq();

      },
      changeIndustry(guid) {
        /*行业类型 根据所属行业 得到parentGuid*/
            let parentGuid = guid + '';
            if(!parentGuid&&!guid){
              return;
            }
            this.$axios({
              url: '/Apply/GetSubIndustrys',
              method: 'get',
              params: {
                parentguid: parentGuid
              },
              typeName: '85',
              showLoading:true
            }).then((res) => {
              let resData = res.data;
              let Model = resData.Model;
              if (Model) {
                let array = Model.Result;
                this.formObj.industryTypeArr = this.exchangePopupFormat(array, 'NAME', 'GUID', parentGuid);
                if(this.loadTag===false){
                  if(this.formObj.industryTypeArr&&this.formObj.industryTypeArr.length){
                    this.formObj.industryType=[this.formObj.industryTypeArr[0].value];
                  }
                }
                this.loadTag=false;
              }
            })
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
      setHeader(){
        window.platformAdapter.saveWorkUnitBtnEvent=()=>{
          this.workUnitBtnEvent();
        };
        window.platformAdapter.isSaveThisFormBtnEvent=()=>{
          this.showSave();
        };
        Native.NUI.setHeader({
          isBack:true,
          title:'工作单位信息',
          rightText: '保存',
          rightTitle:'保存',
          rightCallback:'saveWorkUnitBtnEvent',
          leftCallback: 'isSaveThisFormBtnEvent'
        })
      },
      getProvinceCity() {
        /*获得全国省市数据请求*/
        this.$axios({
          url: '/apply/GetAreas',
          method: 'get',
          typeName: '85',
          showLoading:true
        }).then((res)=>{
          backgroundAddress = res && res.data.Model && res.data.Model.Result;
          this.exchangeCityData(backgroundAddress);
        });
      },
      getPosition() {
        this.$axios({
          url: '/apply/GetPubcodeInfos',
          params: {
            code: 'Position'
          },
          method: 'get',
          typeName:'85',
          showLoading:true
        }).then((res) => {
          let resData = res.data;
          if (resData && resData.ResultType === 0) {
            if (resData.Model && resData.Model.length) {
              this.formObj.positionArr = this.exchangeArr(resData.Model)
            }
          }
        })
      },
      exchangeArr(arr) {
        let emptyArr = [];
        for (let i = 0; i < arr.length; i++) {
          let item = arr[i];
          emptyArr.push(item.Name)
        }
        return [emptyArr]
      }

    },
    mounted() {
     // this.setUserInfo();
      this.setHeader();
      this.checkLoginInfo();
      this.getProvinceCity();
      this.getPopupDataInit();
      this.getPosition();
    },
    watch:{
      'formObj.industry': function (newValue,oldValue) {
        if(newValue+''=== oldValue +'' ){
          return false;
        }
        this.changeIndustry(newValue);
      },
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
</style>
