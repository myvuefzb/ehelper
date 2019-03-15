<template>
<div class="save-msg">
    <div class="save-box">
        <div class="top-header"></div>
        <my-line-input item-name="姓名：" v-model="formObj.name" placeholder="请输入姓名"></my-line-input>
        <my-line-input item-name="手机号码：" :left-text-width="140" v-model="formObj.phoneNum" placeholder="请输入手机号码"></my-line-input>
        <my-line-input item-name="身份证：" v-model="formObj.cardId" placeholder="请输入身份证号"></my-line-input>
        <my-line-input item-name="工作性质：" :left-text-width="140" :is-required="false">
            <group>
                <popup-picker v-model="formObj.jobNature" :data="formObj.jobNatureArr" show-name title="" placeholder="请选择选择工作性质"></popup-picker>
            </group>
        </my-line-input>
        <my-line-input item-name="借款目的：" :left-text-width="140" :is-required="false">
            <group>
                <popup-picker v-model="formObj.loanPurpose" :data="formObj.loanPurposeArr" show-name placeholder="请选择借款目的"></popup-picker>
            </group>
        </my-line-input>
        <my-line-input item-name="用款日期：" :left-text-width="140" :is-required="false">
            <datetime v-model="formObj.joinTime" format="YYYY-MM-DD" placeholder="请选择用款日期" :start-date="startTime" :end-date="endTime"></datetime>
        </my-line-input>
        <my-line-input item-name="申请金额：" :left-text-width="140" v-model="formObj.applyMoney" placeholder="请输入申请金额" :is-required="false"></my-line-input>
        <my-line-input item-name="家庭地址：" :left-text-width="140" :is-required="false">
            <group>
                <x-address v-model="formObj.addressCity" :list="formObj.emptyAddressArr" title="" placeholder="请选择家庭地址" :show.sync="formObj.showAddress"></x-address>
            </group>
        </my-line-input>
        <my-line-input item-name="详细地址：" :left-text-width="140" v-model="formObj.addressDetail" placeholder="详细地址" :is-required="false"></my-line-input>
    </div>
</div>
</template>

<script>
import MyLineInput from '@/components_custom/my-line-input';
import {
    Valitor,
    strategy
} from '@/common/validForm';
import {
    Group,
    PopupPicker,
    Datetime,
    XAddress,
    CheckIcon,
    ChinaAddressV4Data
} from 'vux';
import Native from '@/common/native';
import request from '@/common/request';
import utils from "@/common/utils";
const {
    getParameter
} = utils;
export default {
    components: {
        MyLineInput,
        Group,
        PopupPicker,
        Datetime,
        XAddress,
        CheckIcon,
        ChinaAddressV4Data
    },
    data() {
        return {
            formObj: {
                name: getParameter('cardName'),
                phoneNum: '',
                cardId: getParameter('cardId'),
                jobNature: [],
                jobNatureArr: [
                    [{
                        value: '0',
                        name: '上班人士'
                    }, {
                        value: '1',
                        name: '做生意'
                    }]
                ],
                loanPurpose: [],
                loanPurposeArr: [],
                joinTime: '',
                applyMoney: '',
                addressCity: [], //地址/省市
                addressDetail: '', //地址/详细地址
                showAddress: false,
                emptyAddressArr: [],
                /*用来转换用的全国省市的数组*/
            },
            nowTime: new Date()

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
            let startYear = nowTime.getFullYear() + 2;
            let timeDate = new Date(startYear + '');
            let timeStr = timeDate.toISOString().slice(0, 10);
            return timeStr;
        }

    },
    methods: {
        getloginInfo() {
            Native.NRouter.getUserLoginInfo({
                'callback': 'getUserLoginInfo'
            });
            // let loginInfo = localStorage.getItem('loginInfo');
            // if (!loginInfo) {
            // Native.NRouter.getUserLoginInfo({'callback': 'getUserLoginInfo'});
            // }
        },
        setHeader(myTitle) {
            Native.NUI.setHeader({
                'title': myTitle,
                isBack: true,
                'rightText': '保存',
                'rightTitle': '保存',
                'rightCallback': 'saveClientQueryBtnEvent',
                showLoading: true
            })
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
                    this.formObj.emptyAddressArr.push(tempestObj);
                    this.exchangeArea(item['Sub'], item.Id)
                }
            } else {
                return ArrObj
            }
        },
        // 查询枚举类型--贷款目的
        getPubcodeInfos() {
            this.$axios({
                url: '/Apply/GetPubcodeInfos?code=LaonTypeNew',
                method: 'get',
                typeName: '85',
                showLoading: true
            }).then((success) => {
                if (success && success.data.Model) {
                    let arr = success.data.Model.map((item) => {
                        let obj = {};
                        obj.name = item.Name;
                        obj.value = item.Guid;
                        return obj;
                    })
                    this.formObj.loanPurposeArr.push(arr);
                }

            }, (error) => {
                console.log(error);
            })
        },
        // 验证
        validAll() {
            let msgNot = '请填写';
            let formatError = '格式有误';
            let validObj = new Valitor();
            validObj.add(strategy.isNotEmpty(this.formObj.name, msgNot + '姓名'));
            validObj.add(strategy.checkChineseName(this.formObj.name, '输入姓名' + formatError));
            validObj.add(strategy.isNotEmpty(this.formObj.phoneNum, msgNot + '手机号码'));
            validObj.add(strategy.checkCellPhone(this.formObj.phoneNum, '输入手机号码' + formatError));
            validObj.add(strategy.isNotEmpty(this.formObj.cardId, msgNot + '身份证号'));
            validObj.add(strategy.checkCardno(this.formObj.cardId, '输入身份证号码' + formatError));
            return validObj.start();
        },
        // 保存
        save() {
            let resultMsg = this.validAll();
            if (resultMsg) {
                this.$toast({
                    message: resultMsg,
                    duration: 2000
                });
                return false;
            }
            const loginInfo = JSON.parse(window.localStorage.getItem("loginInfo"));
            this.$axios({
                url: '/Customer/AddCustomerLoanItem',
                data: {
                    Realname: this.formObj.name,
                    Tel: this.formObj.phoneNum,
                    Cardno: this.formObj.cardId,
                    Loanusage: this.formObj.loanPurpose[0] + '', // 借款目的
                    Createdate: this.formObj.joinTime,
                    Loanaccount: this.formObj.applyMoney,
                    Userprovince: this.formObj.addressCity[0],
                    Usercity: this.formObj.addressCity[1],
                    Userarea: this.formObj.addressCity[2],
                    Personaddress: this.formObj.addressDetail,
                    Belongstoreid: loginInfo.DepartmentGuid,
                    Belongsalerid: loginInfo.UserGuid,
                    UserType: this.formObj.jobNature[0]

                },
                method: 'post',
                showLoading: true
            }).then((data) => {
                if (data && data.data.ResultType === 0) {
                    Native.NRouter.assign({
                        url: 'save-success.html'
                    })
                }
            }, (error) => {
                console.log(error);
            })

        }

    },
    mounted() {
        window.platformAdapter.saveClientQueryBtnEvent = () => {
            this.save();
        };
        this.setHeader('咨询信息填写');
        this.getArea();
        this.getPubcodeInfos();
    },
    created() {
        this.getloginInfo();
    }
}
</script>

<style lang="less">
@import '~@/styles/base.less';

.save-msg {
    height: 100%;
    padding-bottom: 40px;
    background-color: #fff;

    .save-box {
        .top-header {
            height: 20px;
            background-color: #f4f4f4;
        }
    }
}
</style>
