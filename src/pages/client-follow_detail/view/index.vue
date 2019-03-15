<template>
<div class="follow_user_detail_part">
    <div class="follow_user_detail_title">

    </div>
    <my-line-input title="" item-name="姓名" v-model="formObj.followName" placeholder="请填写" class="text-left" :read-only='true'></my-line-input>
    <my-line-input title="" item-name="手机号" v-model="formObj.phone" placeholder="请填写" type="number" class="text-left" :read-only='true'></my-line-input>
    <my-line-input title="" item-name="身份证" v-model="formObj.idCard" placeholder="请填写" class="text-left" :read-only='true'></my-line-input>
    <my-line-input title="" item-name="工作性质" placeholder="请填写" class="text-left" :isRequired="false">
        <group>
            <popup-picker v-model="formObj.workType" :data="formObj.workTypeArr" show-name placeholder="请选择" disabled></popup-picker>
        </group>
    </my-line-input>
    <my-line-input title="" item-name="借款用途" class="text-left" :isRequired="false">
        <group>
            <popup-picker v-model="formObj.borrowingPurposes" :data="formObj.borrowingPurposesArr" show-name placeholder="请选择"  disabled></popup-picker>
        </group>
    </my-line-input>
    <my-line-input title="" item-name="用款日期" class="text-left" :isRequired="false"  >
        <datetime format="YYYY-MM-DD" v-model="formObj.withMoneyDate" placeholder="请选择" readonly>

        </datetime>
    </my-line-input>
    <my-line-input title="" item-name="申请金额" v-model="formObj.applyAmount" placeholder="请填写" type="number" class="text-left" :isRequired="false" :read-only='true'></my-line-input>
    <my-line-input title="" item-name="家庭地址" class="text-left" placeholder="请选择" :isRequired="false">
        <x-address title="" v-model="formObj.homeAddress" :list="addressData" placeholder="请选择地址" :show.sync="formObj.showAddress" :disabled="true"></x-address>
    </my-line-input>
    <my-line-input title="" item-name="" v-model="formObj.homeAddressDetails" placeholder="请填写地址详情" class="text-left" :isRequired="false"  :read-only='true'></my-line-input>
    <!-- <my-line-input title="" item-name="确认表状态" v-model="formObj.checkStatus" placeholder="请填写" class="text-left" :isRequired="false"  :read-only='true'></my-line-input>
    <my-line-input title="" item-name="是否进件" v-model="formObj.isWhether" placeholder="请填写" class="text-left" :isRequired="false"  :read-only='true'></my-line-input> -->

</div>
</template>

<script>
import MyLineInput from '@/components_custom/my-line-input';
import Native from '@/common/native';
import {
    getParameter
} from '@/common/utils/url';
import {
    Valitor,
    strategy
} from '@/common/validForm';
import {
    XButton,
    Datetime,
    PopupPicker,
    Group,
    Flexbox,
    FlexboxItem,
    XTextarea,
    ChinaAddressV4Data,
    XAddress
} from 'vux';
import {
    defaultCoreCipherList
} from 'constants';
export default {
    components: {
        MyLineInput,
        XButton,
        Datetime,
        PopupPicker,
        Group,
        Flexbox,
        FlexboxItem,
        XTextarea,
        ChinaAddressV4Data,
        XAddress
    },
    data() {
        return {
            formObj: {
                followName: '',
                phone: '',
                idCard: '',
                workType: [],
                workTypeArr: [
                    [{
                        value: '0',
                        name: '上班人士'
                    }, {
                        value: '1',
                        name: '做生意'
                    }]
                ],
                borrowingPurposes: [],
                borrowingPurposesArr: [],
                withMoneyDate: '',
                applyAmount: '',
                homeAddress: [],
                homeAddressDetails: '',
                checkStatus: '',
                isWhether: '',
                showAddress: false
            },
            addressData: ChinaAddressV4Data
        }
    },
    methods: {
        // 设置头部
        setHeader(myTitle) {
            Native.NUI.setHeader({
                'title': myTitle,
                isBack: true,
            })
        },
        //借款目的
        getNational() {
            this.$axios({
                url: '/Apply/GetPubcodeInfos',
                params: {
                    code: 'LaonTypeNew'
                },
                method: 'Get',
                typeName: '85',
                showLoading: true
            }).then((success) => {
                this.formObj.borrowingPurposesArr.push(success.data.Model.map(function (item) {
                    let tt = {
                        name: item.Name,
                        value: item.Guid
                    };
                    return tt;
                }));
            }, function (error) {
                console.log(error);
            })
        },
        validAll() {
            let msgNot = '请填写';
            let formatError = '格式有误';
            let validObj = new Valitor();
            validObj.add(strategy.isNotEmpty(this.formObj.followName, msgNot + '姓名'));
            validObj.add(strategy.checkChineseName(this.formObj.followName, '输入姓名' + formatError));
            validObj.add(strategy.isNotEmpty(this.formObj.phone, msgNot + '手机号'));
            validObj.add(strategy.checkCellPhone(this.formObj.phone, '输入手机号' + formatError));
            validObj.add(strategy.isNotEmpty(this.formObj.idCard, msgNot + '身份证'));
            validObj.add(strategy.checkCardno(this.formObj.idCard, '输入身份证' + formatError));
            return validObj.start();
        },


        DataBind() {
            let loanGuid = getParameter('loanGuid');
            this.$axios({
                url: '/FollowUp/GetCustomerDetailed',
                data: {
                    LoanGuid: loanGuid
                }, //传入的客户Giud
                method: "post",
                typename: '93'
            }).then((success) => {
                if (success.data.Model) {
                    var Result = success.data.Model;
                    this.formObj.followName = Result.RealName;
                    this.formObj.phone = Result.Tel;
                    this.formObj.idCard = Result.CardNo;
                    this.formObj.workType.push(Result.UserType);
                    this.formObj.borrowingPurposes.push(Result.Loanusage);
                    this.formObj.withMoneyDate = Result.CreateDate.substr(0, 10).replace('年', '-').replace('月', '-').replace('日', '-');
                    this.formObj.applyAmount = Result.Loanaccount;
                    this.formObj.homeAddress.push(Result.UserProvince);
                    this.formObj.homeAddress.push(Result.UserCity);
                    this.formObj.homeAddress.push(Result.UserArea);
                    this.formObj.homeAddressDetails = Result.PersonAddress;
                    this.formObj.checkStatus = Result.ConfirmText;
                    this.formObj.isWhether = Result.IsApplyText;
                }
            }, (error) => {

            })
        }

    },
    mounted() {
        this.setHeader('客户跟进详情');
        this.getNational();
        this.DataBind();

    }
}
</script>

<style lang="less">
@import '~@/styles/base.less';

.follow_user_detail_title {
    height: 20px;
    background: #F4F4F4;
}
</style>
