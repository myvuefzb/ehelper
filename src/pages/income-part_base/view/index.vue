<template>
  <div class="info_b_part">
    <div class="info_b_title"></div>
    <my-line-input title="" item-name="姓名" v-model="formObj.username" placeholder="请填写" :disabled="true" class="text-left"></my-line-input>
    <flexbox :gutter="0">
      <flexbox-item :span="10">
        <my-line-input item-name="手机号1" v-model="formObj.telephone1" type="number" placeholder="请填写" class="text-left"></my-line-input>
      </flexbox-item>
      <flexbox-item :span="2"><span class="add"><img src="~/assets/img/add.png" @click="changeValue" /></span></flexbox-item>
    </flexbox>
    <my-line-input title="" v-show="item2show" item-name="手机号2：" v-model="formObj.telephone2" placeholder="请填写" type="number" class="text-left"></my-line-input>
    <my-line-input title="" item-name="身份证号" v-model="formObj.idCard" placeholder="请填写" class="text-left" :disabled="true"></my-line-input>
    <my-line-input title="" item-name="性别" class="text-left">
      <group>
        <popup-picker v-model="formObj.sex" :data="formObj.sexArr" show-name placeholder="请选择"></popup-picker>
      </group>
    </my-line-input>
    <my-line-input title="" item-name="出生日期" class="text-left">
      <datetime format="YYYY-MM-DD" v-model="formObj.birthday" placeholder="请选择" start-date="1890-01-01" :readonly="lockBirthday">

      </datetime>
    </my-line-input>
    <my-line-input title="" item-name="民族" class="text-left">
      <group>
        <popup-picker v-model="formObj.national" :data="formObj.nationalArr" show-name placeholder="请选择"></popup-picker>
      </group>
    </my-line-input>
    <my-line-input title="" item-name="e-mail" v-model="formObj.email" placeholder="请填写" class="text-left"></my-line-input>
    <my-line-input title="" item-name="学历" class="text-left">
      <group v-if="formObj.educationArr">
        <popup-picker v-model="formObj.education" :data="formObj.educationArr" :columns="1" show-name placeholder="请选择"></popup-picker>
      </group>
      <span v-else></span>
    </my-line-input>
    <my-line-input title="" item-name="户口类型" class="text-left">
      <group>
        <popup-picker v-model="formObj.accountType" :data="formObj.accountTypeArr" show-name placeholder="请选择"></popup-picker>
      </group>
    </my-line-input>
    <my-line-input title="" item-name="婚姻状况" class="text-left">
      <group>
        <popup-picker v-model="formObj.maritalStatus" :data="formObj.maritalStatusArr" show-name placeholder="请选择"></popup-picker>
      </group>
    </my-line-input>
    <my-line-input v-show="childrenShow" title="" item-name="子女人数" v-model="formObj.childrenNumber" type="number" placeholder="" class="text-left"></my-line-input>
    <my-line-input v-show="childrenShow" title="" item-name="子女情况" :is-required="false" class="text-left">
      <group>
        <popup-picker v-model="formObj.childrenSituation" :data="formObj.childrenSituationArr" show-name placeholder="请选择"></popup-picker>
      </group>
    </my-line-input>
    <my-line-input title="" item-name="居住类型" class="text-left">
      <group>
        <popup-picker title="" v-model="formObj.residentialType" :data="formObj.residentialTypeArr" show-name @on-change="changeValue2" placeholder="请选择"></popup-picker>
      </group>
    </my-line-input>
    <my-line-input title="" item-name="每月房租" v-show="showType" v-model="formObj.monthRent" type="number" placeholder="请填写" class="text-left" :isRequired="false"></my-line-input>
    <flexbox class="rentDate" align="center" v-show="showType">
      <flexbox-item :span="4">
        <span class="rent-title">租赁起止日</span>
      </flexbox-item>
      <flexbox-item :span="8">
        <flexbox :gutter="0">
          <flexbox-item :span="6">
            <div class="rent-begin">
              <datetime title="" v-model="formObj.rentStartDate" format="YYYY-MM-DD" placeholder="请选择"></datetime>
              <img src="~@/assets/img/solar_calender.png">
              <span class="rent-link">至</span>
            </div>
          </flexbox-item>
          <flexbox-item :span="6">
            <div class="rent-end">
              <datetime title="" v-model="formObj.rentEndDate" format="YYYY-MM-DD" placeholder="请选择"></datetime>
              <img src="~@/assets/img/solar_calender.png">
            </div>

          </flexbox-item>
        </flexbox>
      </flexbox-item>
    </flexbox>

    <my-line-input title="" item-name="与谁同住" v-show="showType" placeholder="请选择" class="text-left" :isRequired="false">
      <group>
        <popup-picker title="" v-model="formObj.liveWith" :data="formObj.liveWithArr" show-name placeholder="请选择"></popup-picker>
      </group>
    </my-line-input>

    <my-line-input title="" item-name="户籍地址" placeholder="请选择" class="text-left">
      <x-address title="" v-model="formObj.householdAddress" :list="addressData" placeholder="请选择" :show.sync="formObj.showAddress"></x-address>
    </my-line-input>

    <input type="text" class="text-details" v-model="householdAddressDetail" placeholder="请输入详细地址">
    <my-line-input title="" item-name="家庭地址" placeholder="请选择" class="text-left">
      <x-address title="" v-model="formObj.homeAddress" :list="addressData" placeholder="请选择" :show.sync="formObj.showAddress1"></x-address>
    </my-line-input>

    <input type="text" class="text-details" v-model="homeAddressDetail" placeholder="请输入详细地址">
    <div class="my-common-part-title">
      征信三要素
    </div>
    <my-line-input item-name="登录账号" v-model="formObj.account" :is-required="false"></my-line-input>
    <!-- 征信密码改为可见的-->
    <my-line-input item-name="登录密码" v-model="formObj.password"  :is-required="false"></my-line-input>
    <my-line-input item-name="人行身份验证码" v-model="formObj.validCode" :left-text-width="120" :is-required="false"></my-line-input>
    <div class="confirm-layout" v-transfer-dom>
      <confirm v-model="showConfirm" confirm-text="需要" cancel-text="不需要" @on-confirm="onConfirm" @on-cancel="onCancel">
        <p style="text-align:center;">您还未保存，是否需要保存填写内容？</p>
      </confirm>
    </div>
  </div>
</template>

<script>
  import MyLineInput from '@/components_custom/my-line-input';
  import Native from '@/common/native';
  import {
    Valitor,
    strategy
  } from "../../../common/validForm";
  import {
    getParameter
  } from '@/common/utils/url';
  import {
    XButton,
    Datetime,
    PopupPicker,
    Group,
    Flexbox,
    FlexboxItem,
    XAddress,
    ChinaAddressV4Data,
    Confirm,
    TransferDomDirective as TransferDom,
    XInput
  } from 'vux';

  export default {
    directives: {
      TransferDom
    },
    components: {
      MyLineInput,
      XButton,
      Datetime,
      PopupPicker,
      Group,
      Flexbox,
      FlexboxItem,
      XAddress,
      ChinaAddressV4Data,
      Confirm,
      XInput
    },
    data() {
      return {
        showConfirm: false,
        formObj: {
          username: getParameter("realName"),
          telephone1: getParameter("tel"),
          telephone2: '',
          idCard: getParameter("customerIdCard"),
          sex: [],
          sexArr: [],
          birthday: '',
          national: [],
          nationalArr: [],
          email: '',
          education: [],
          educationArr: null,
          accountType: [],
          accountTypeArr: [],
          maritalStatus: [],
          maritalStatusArr: [],
          childrenNumber: '',

          childrenSituation: [], // 子女情况所选择值
          // childrenSituationArr: ['幼儿','本地上学','异地上学','已就业'], // 子女情况选择
          childrenSituationArr: [
            [ // 子女情况选择
              {
                name: '幼儿',
                value: '幼儿'
              },
              {
                name: '本地上学',
                value: '本地上学'
              },
              {
                name: '异地上学',
                value: '异地上学'
              },
              {
                name: '已就业',
                value: '已就业'
              }
            ]
          ],

          residentialType: [],
          residentialTypeArr: [],
          monthRent: '',
          rentStartDate: '',
          rentEndDate: '',
          liveWith: [],
          liveWithArr: [
            [{
              name: "父母",
              value: "父母"
            },
              {
                name: "配偶",
                value: "配偶"
              },
              {
                name: "独居",
                value: "独居"
              },
              {
                name: "其他",
                value: "其他"
              }
            ]
          ],
          householdAddress: [],
          showAddress: false,
          homeAddress: [],
          showAddress1: false,
          customerGuid: getParameter("customerGuid"), //传入用户Guid
          userGuid: getParameter("userGuid"),
          account: '',
          password: '',
          validCode: ''

        },
        householdAddressDetail: '',
        homeAddressDetail: '',
        nowTime: new Date(),
        item2show: false,
        showType: false,
        addressData: [],
        IsNoData: false,
        dateInfoSource: getParameter('dateInfoSource'), // 是否是恒e家的数据1为是，否则否
        lockBirthday:false
      }
    },
    computed: {
      /* 子女信息是否显示，未婚时不显示 */
      childrenShow() {
        if (this.formObj.maritalStatus[0] === '{17E6E22F-939B-499F-95F7-A1A39363A960}') { // 判断是否未婚
          return false
        } else {
          return true
        }
      }
    },
    methods: {
      // 设置头部
      setHeader(myTitle) {
        Native.NUI.setHeader({
          'title': myTitle,
          isBack: true,
          rightText: '保存',
          rightTitle: '保存',
          rightCallback: 'SaveBaseSetEvent',
          leftCallback: 'isSaveThisFormBtnEvent'
        })
      },
      // 通过身份证号获取性别和出生日期;
      certificateMessage(certificateNo) {
        let res = {};
        if (typeof certificateNo === 'string') {
          if(!(certificateNo.length===15 ||certificateNo.length===18)){
            console.warn('certificateNo length error');
            return {}
          }
        }else{
          console.warn('certificateNo type error');
          return {}
        }
        let idLength = certificateNo.length;
        let idxSexStart = idLength === 15 ? 14 : 17;
        let birthYearSpan = idLength === 15 ? 2 : 4;
        let idxSex = certificateNo.substr(idxSexStart, 1) % 2;
        res.sex = (idxSex === 1) ? ('女') : (idxSex === 0 ? '男' : '未知');
        let year = (birthYearSpan === 2 ? '19' : '') + certificateNo.substr(6, birthYearSpan);
        let month = certificateNo.substr(6 + birthYearSpan, 2);
        let day = certificateNo.substr(8 + birthYearSpan, 2);
        res.birthday = year + '-' + month + '-' + day;
        return res;
      },

      //
      showSave() {
        this.showConfirm = true;
      },
      onConfirm() {
        this.query();
      },
      //
      onCancel() {
        Native.NRouter.back();
      },
      changeValue() {
        this.item2show = !this.item2show;
      },
      changeValue2() {
        // 住房类型 租房：{12D4F90C-63AE-452E-98A4-49EDDF01EEB2}
        this.showType = this.formObj.residentialType[0] === '{12D4F90C-63AE-452E-98A4-49EDDF01EEB2}';

      },
      // 查询省市区地址
      getArea() {
        this.$axios({
          url: '/Apply/GetAreas',
          data: {},
          method: 'get',
          typeName: '85'
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
            this.addressData.push(tempestObj);
            this.exchangeArea(item['Sub'], item.Id)
          }
        } else {
          return ArrObj
        }
      },
      query() {
        /*表单验证 start*/
        let formObj = this.formObj;
        let emptyPrefix1 = '请填写',
          emptyPrefix2 = '请选择';
        let validator = new Valitor();
        validator.add(strategy.isNotEmpty(formObj.username, emptyPrefix1 + '姓名'));
        validator.add(strategy.isNotEmpty(formObj.telephone1, emptyPrefix1 + '手机号1'));
        validator.add(strategy.isNotEmpty(formObj.idCard, emptyPrefix1 + '身份证号'));
        validator.add(strategy.isNotEmpty(formObj.sex[0], emptyPrefix2 + '性别'));
        validator.add(strategy.isNotEmpty(formObj.birthday, emptyPrefix2 + '出身日期'));
        validator.add(strategy.isNotEmpty(formObj.education[0], emptyPrefix2 + '学历'));
        validator.add(strategy.isNotEmpty(formObj.email.trim(), emptyPrefix1 + '邮箱'));
        validator.add(strategy.isNotEmpty(formObj.national[0], emptyPrefix2 + '民族'));
        validator.add(strategy.isNotEmpty(formObj.accountType[0], emptyPrefix2 + '户口类型'));
        validator.add(strategy.isNotEmpty(formObj.maritalStatus[0], emptyPrefix2 + '婚姻状态'));
        if (this.childrenShow) {
          validator.add(strategy.isNotEmpty(formObj.childrenNumber, emptyPrefix2 + '子女人数'));
        }
        validator.add(strategy.isNotEmpty(formObj.residentialType, emptyPrefix2 + '居住类型'));
        validator.add(strategy.isNotEmpty(formObj.householdAddress[0], emptyPrefix2 + '户籍地址'));
        validator.add(strategy.isNotEmpty(formObj.homeAddress[0], emptyPrefix2 + '家庭地址'));
        validator.add(strategy.checkCardno(formObj.idCard, '身份证号格式错误'));
        validator.add(strategy.checkChineseName(formObj.username, '姓名格式错误'));
        validator.add(strategy.checkEmail(formObj.email, '邮箱格式错误'));
        validator.add(strategy.checkCellPhone(formObj.telephone1, '手机号码1格式错误'));
        if (this.item2show) { // 当有手机号码2是，验证手机号码2是否为空和手机号码格式
          validator.add(strategy.isNotEmpty(formObj.telephone2, emptyPrefix1 + '手机号2'));
          validator.add(strategy.checkCellPhone(formObj.telephone2, '手机号码2格式错误'));
        }
        let result = validator.start();
        if (result) {
          this.$toast({
            message: result
          });
          return false;
        }
        let loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
        let data = {
          GUID: this.formObj.customerGuid,
          BIRTHDAY: this.formObj.birthday,
          CUSTOMERNAME: this.formObj.username,
          NATION: '' + this.formObj.national[0],
          CHILDREN_DESC: this.childrenShow ? this.formObj.childrenSituation[0] : '', // 如果未婚，子女情况为空
          DEGREE: '' + this.formObj.education,
          EMAIL: this.formObj.email,
          FRAMEWORKCODE: loginInfo.DepartmentGuid, //分行Guid
          FUKOUTYPE: '' + this.formObj.accountType,
          GENDER: '' + this.formObj.sex,
          HOME_ADDR_PRO: '' + this.formObj.homeAddress[0],
          HOME_ADDR_CITY: '' + this.formObj.homeAddress[1],
          HOME_ADDR_COUNTY: '' + this.formObj.homeAddress[2],
          HOME_ADDR_DETAIL: this.homeAddressDetail,
          IDCARD: this.formObj.idCard,
          IDCARD_ADDR_PRO: '' + this.formObj.householdAddress[0],
          IDCARD_ADDR_CITY: '' + this.formObj.householdAddress[1],
          IDCARD_ADDR_COUNTY: '' + this.formObj.householdAddress[2],
          IDCARD_DETAIL: this.householdAddressDetail,
          INHABIT: '' + this.formObj.residentialType,
          ISSUENUMBER: this.childrenShow ? this.formObj.childrenNumber : 0, // 如果未婚，子女人数为0
          LIVE_WITH: this.formObj.liveWith[0],
          MARRYORNOT: '' + this.formObj.maritalStatus,
          MOBILE: this.formObj.telephone1,
          MOBILE2: this.formObj.telephone2,
          MONTHRENT: this.formObj.monthRent,
          OWNER: loginInfo.UserGuid,
          RENT_BEG_DATE: this.formObj.rentStartDate + " " + this.formObj.rentEndDate,
          LOGINNAME: this.formObj.account,
          LOGINPWD: this.formObj.password,
          VERIFICATION_CODE: this.formObj.validCode
        }
        let Url = '/Apply/InsertCustomer';
        if (this.IsNoData) {
          Url = '/Apply/EditCustomer';
          data.LAST_UPDATE_USER_ID = loginInfo.UserGuid; //修改用户GUID
        } else {
          data.CREATE_USER_ID = loginInfo.UserGuid; //添加用户GUid
        }
        this.$axios({
          url: Url,
          data: data,
          method: 'post',
          typeName: '85'
        }).then((success) => {
          if (success.data.ResultType === 0) {
            // 恒e家导入基本信息保存
            if (this.dateInfoSource) {
              window.platformAdapter.setEFromFamily({
                infobase: true
              });
            }

            Native.NUI.refresh({
              refreh_page: 'income-part_apply.html'
            })
            Native.NRouter.assign({
              url: 'save-success.html',
            })
          } else {
            this.$toast(success.data.Message);
          }

        }, function (error) {
          console.log(error);
        })
      },
      getloginInfo() {
        let loginInfo = localStorage.getItem('loginInfo');
        if (!loginInfo) {
          Native.NRouter.getUserLoginInfo({
            'callback': 'getUserLoginInfo'
          });
        }
      },
      //民族
      getNational() {
        this.$axios({
          url: '/Apply/GetPubcodeInfos',
          params: {
            code: 'MinZu'
          },
          method: 'Get',
          typeName: '85'
        }).then((success) => {
          this.formObj.nationalArr.push(success.data.Model.map(function (item) {
            let tt = {
              name: item.Name,
              value: item.Guid
            };
            return tt;
            //console.log(tt);
          }));
        }, function (error) {
          console.log(error);
        })
      },
      getCustomerInfo() {
        this.$axios({
          url: "/Apply/GetAppCustomerInfo",
          params: {
            Guid: this.formObj.customerGuid
          },
          method: "Get",
          typeName: "85",
          showLoading: true
        }).then((success) => {
          //性别绑定
          if (success && success.data && success.data.Model) {
            this.formObj.sexArr.push(success.data.Model.Gender.map(function (item) {
              let tt = {
                name: item.Value,
                value: item.Key
              };
              return tt;
            }));
            //学历绑定
            this.formObj.educationArr = success.data.Model.EducationType.map(function (item) {
              let tt = {
                name: item.Value,
                value: item.Key
              };
              return tt;
            });
            //户口类型
            let result = success.data.Model.FukouType.map(function (item) {
              let tt = {
                name: item.Value,
                value: item.Key
              };
              return tt;
            });
            this.formObj.accountTypeArr.push(result);
            //婚姻状况
            this.formObj.maritalStatusArr.push(success.data.Model.MarriageType.map(function (item) {
              let tt = {
                name: item.Value,
                value: item.Key
              };
              return tt;
              //console.log(tt);
            }));
            //居住类型
            this.formObj.residentialTypeArr.push(success.data.Model.LiveType.map(function (item) {
              let tt = {
                name: item.Value,
                value: item.Key
              };
              return tt;
            }));
          }
          //民族
          console.log(success);
          let reasult = success.data.Model.CustomerInfo;
          if (!reasult)
            return false
          this.IsNoData = true;
          //this.formObj.username = reasult.CUSTOMERNAME;
          /* 判断手机号码2是否存在 */
          if (reasult.MOBILE2) {
            this.item2show = true // 存在，则显示手机号码2内容
          }
          this.formObj.telephone1 = reasult.MOBILE;
          this.formObj.telephone2 = reasult.MOBILE2;
          this.formObj.idCard = reasult.IDCARD;

          /*填写身份证里面的出生日期和性别*/
          let userBirthSexObj={};
          if(reasult.IDCARD){
               userBirthSexObj=this.certificateMessage(reasult.IDCARD);
            let findSexGuidObj=this.formObj.sexArr.length && this.formObj.sexArr[0].find(function (item) {
              return item.name===userBirthSexObj.sex
            });
            findSexGuidObj && this.formObj.sex.push(findSexGuidObj.value);
            userBirthSexObj.birthday && (this.formObj.birthday=userBirthSexObj.birthday);
          //  this.lockBirthday=true;
          }else{
            reasult.GENDER && this.formObj.sex.push(reasult.GENDER);
            reasult.BIRTHDAY (this.formObj.birthday = reasult.BIRTHDAY.substr(0, 10))
          }

          if (reasult.NATION) {
            this.formObj.national.push(reasult.NATION);
          }
          this.formObj.email = reasult.EMAIL;
          if (reasult.DEGREE) {
            this.formObj.education.push(reasult.DEGREE);
          }
          if (reasult.FUKOUTYPE)
            this.formObj.accountType.push(reasult.FUKOUTYPE);
          if (reasult.MARRYORNOT)
            this.formObj.maritalStatus.push(reasult.MARRYORNOT);
          this.formObj.childrenNumber = reasult.ISSUENUMBER;
          // this.formObj.childrenSituation = reasult.CHILDREN_DESC;
          if (reasult.CHILDREN_DESC) {
            this.formObj.childrenSituation.push(reasult.CHILDREN_DESC);
          }

          if (reasult.INHABIT)
            this.formObj.residentialType.push(reasult.INHABIT);
          this.formObj.monthRent = reasult.MONTHRENT;
          if (reasult.RENT_BEG_DATE) {
            this.formObj.rentStartDate = reasult.RENT_BEG_DATE.substr(0, 10);
            this.formObj.rentEndDate = reasult.RENT_BEG_DATE.substr(11, 21);
          }
          if (reasult.LIVE_WITH) {
            this.formObj.liveWith.push(reasult.LIVE_WITH);
          }
          this.formObj.householdAddress.push(reasult.IDCARD_ADDR_PRO);
          this.formObj.householdAddress.push(reasult.IDCARD_ADDR_CITY);
          this.formObj.householdAddress.push(reasult.IDCARD_ADDR_COUNTY);
          this.householdAddressDetail = reasult.IDCARD_DETAIL;
          this.formObj.homeAddress.push(reasult.HOME_ADDR_PRO);
          this.formObj.homeAddress.push(reasult.HOME_ADDR_CITY);
          this.formObj.homeAddress.push(reasult.HOME_ADDR_COUNTY);
          this.homeAddressDetail = reasult.HOME_ADDR_DETAIL;
          this.formObj.account = reasult.LOGINNAME;
          this.formObj.password = reasult.LOGINPWD;
          this.formObj.validCode = reasult.VERIFICATION_CODE
        }, (error) => {

        })
      }
    },
    mounted() {
      window.platformAdapter.SaveBaseSetEvent = () => {
        this.query();
      };
      // 调用app 返回的方法
      window.platformAdapter.isSaveThisFormBtnEvent = () => {
        this.showSave()
      }

      this.setHeader("基本资料填写");
      this.getNational();
      this.getCustomerInfo();
      this.getArea();
    },
    created() {
      this.getloginInfo();
    }
  }
</script>

<style lang="less">
  @import '~@/styles/base.less';

  .confirm-layout {
    .weui-dialog__btn_primary {
      color: #44A4EF;
    }
  }

  .text-left {
    text-align: left;
  }

  .info_b_title {
    height: 20px;
    background: #F4F4F4;
  }

  .add {
    color: blue;
    height: 108px;
    line-height: 108px;
    text-align: center;
    display: block;
    border-bottom: solid 1px #ddd;

    img {
      padding-top: 38px;
      display: inline-block;
    }

    .text-left-ad {
      float: left;
      color: #D8D7D8;
      font-size: 32px;
    }
  }

  button.weui-btn {
    color: rgba(255, 255, 255, 1);
    font-size: 32px;
    bottom: 0;
    position: fixed;
    width: 100%;
    height: 88px;
    background: rgba(68, 164, 239, 1);
    border-radius: 0;
    border: 0;

  }

  .common-input {
    width: 100%
  }

  .text-details {
    margin-top: 0;
    position: relative;
    padding-left: 20px;
    padding-right: 20px;
    height: 100px;
    border-bottom: 1px solid #ddd;
    border-style: none;
    overflow: hidden;
    font-size: 29px;
    width: 100%
  }

  .rentDate {
    border-bottom: solid 1px #ddd;
    height: 120px;

    .weui-cell_access .weui-cell__ft::after {
      display: none !important;
    }

    .rent-title {
      font-size: 32px;
      padding-left: 52px;
    }

    .rent-begin {
      position: relative;
      padding-right: 40px;

      .rent-link {
        position: absolute;
        top: 9px;
        right: -20px;
        font-size: 32px;
      }
    }

    .rent-end {
      position: relative;
      padding-right: 40px;
    }

    img {
      position: absolute;
      width: 40px;
      height: 40px;
      right: 20px;
      top: 4px;
      z-index: 10
    }

  }

  .my-common-part-title {
    line-height: 80px;
    height: 80px;
    padding-left: 25px;
    font-size: 28px;
    font-weight: bold;
  }
</style>
