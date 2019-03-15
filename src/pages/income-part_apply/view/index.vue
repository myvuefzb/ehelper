<template>
<div class="follow_records_menu_part">
    <div class="follow_records_menu_title"></div>
    <group>
        <cell title="基本信息" @click.native="goPage('infobase')" is-link>
        <img slot="icon" src="~/assets/img/info_base@2x.png">
        </cell>
        <cell title="借款信息" is-link @click.native="goPage('infoloan')">
            <img slot="icon" src="~/assets/img/info@2x.png">
        </cell>
        <cell title="联系人信息" is-link @click.native="goPage('infocontacts')">
            <img slot="icon" src="~/assets/img/info_contacts@2x.png">
        </cell>
            <cell title="工作单位" is-link @click.native="goPage('workUnit')" v-show="initFormItems.workUnit">
        <img slot="icon" src="~/assets/img/address_job@2x.png">
        </cell>
            <cell title="资产评估" is-link @click.native="goPage('assess')">
        <img slot="icon" src="~/assets/img/assess@2x.png">
        </cell>
        <cell title="考察表" @click.native="goPage('inspectionTable')" is-link v-show="initFormItems.inspectionTable">
            <img slot="icon" src="~/assets/img/investigate@2x.png">
        </cell>
        <cell title="企业信息" is-link @click.native="goPage('information')" v-show="initFormItems.information">
            <img slot="icon" src="~/assets/img/files@2x.png">
        </cell>
        <cell title="菁英贷" is-link @click.native="goPage('jyloan')" v-show="initFormItems.jyloan">
            <img slot="icon" src="~/assets/img/files@2x.png">
        </cell>
        <cell title="瑞薪贷" is-link @click.native="goPage('rxloan')" v-show="initFormItems.rxloan">
            <img slot="icon" src="~/assets/img/files@2x.png">
        </cell>
        <cell title="闪电贷" is-link @click.native="goPage('sdloan')" v-show="initFormItems.sdloan">
            <img slot="icon" src="~/assets/img/files@2x.png">
        </cell>
        <cell title="恒速贷" is-link @click.native="goPage('hsloan')" v-show="initFormItems.hsloan">
            <img slot="icon" src="~/assets/img/files@2x.png">
        </cell>
        <cell title="瑞享贷" is-link @click.native="goPage('rhloan')" v-show="initFormItems.rhloan">
            <img slot="icon" src="~/assets/img/files@2x.png">
        </cell>
                                                        <!-- <cell title="上传影像资料" is-link>
                <img slot="icon"   src="~/assets/img/files@2x.png">
            </cell> -->
    </group>
    <x-button @click.native="submit()" :disabled="isDisable">提交</x-button>
    <div class="confirm-layout" v-transfer-dom>
        <confirm v-model="showConfirm" @on-confirm="onConfirm">
            <p style="text-align:center;">数据还未提交，继续返回数据可能会丢失，是否继续返回</p>
        </confirm>
    </div>
</div>
</template>

<script>
import Native from '@/common/native';
import {
    Cell,
    Group,
    XButton,
    Confirm,
    TransferDomDirective as TransferDom
} from 'vux';
import {
    getParameter
} from '@/common/utils/url';

export default {
    components: {
        Cell,
        Group,
        XButton,
        Confirm
    },
    directives: {
        TransferDom
    },
    data() {
        return {
            isDisable: true,
            showConfirm: false, // 是否弹出确认框
            dealFromEFamily: false, // 是否是从恒E家导过来数据
            CustomerGuid: '',
            UserGuid: getParameter("userGuid"),
            Business: '',
            CustomerInfo: '', //基本信息
            Apply: '', //借款信息
            applyGUid: null,
            loanTypeGuid: '', //产品类别
            loanGroupGuid: '', //产品分组 薪贷，生意贷
            initFormItems: {
                infobase: true,
                infoloan: true,
                infocontacts: true,
                workUnit: false,
                assess: true,
                inspectionTable: false,
                information: false,
                jyloan: false,
                rxloan: false,
                sdloan: false,
                hsloan: false,
                rhloan: false,
            },
            CustomerIdCard: getParameter("cardNo"),
            CustomerName: getParameter("realName"),
            tel: getParameter('tel'),
            loginInfo: JSON.parse(localStorage.getItem('loginInfo'))
        }
    },
    methods: {
        setMenu() {
            //薪贷
            if (this.loanGroupGuid === '{C4511E7D-96A7-44B5-BD37-9D7CDF231AC3}') {
                // 考察表
                this.initFormItems.inspectionTable = true;
                // 工作单位
                this.initFormItems.workUnit = true;
            }
            //生意贷
            if (this.loanGroupGuid === '{4418B027-864A-4450-97D5-50906C91C2C8}') {
                // 企业信息
                this.initFormItems.information = true;
            }
            
            //闪电贷
            if (this.loanTypeGuid == '{BBBFAC4C-1770-4976-BEBD-7628697D57C5}') {
                this.initFormItems.sdloan = true;
            }
            //菁英贷
            if (this.loanTypeGuid == '{43189A15-9C72-4136-BB90-DC970B466241}') {
                this.initFormItems.jyloan = true;
            }
            //恒速贷
            if (this.loanTypeGuid == '{779E6601-CBBE-4205-8774-1D41CE4BAE43}') {
                this.initFormItems.hsloan = true;
            }
            //瑞薪贷
            if (this.loanTypeGuid == '{F95985AC-A892-47F1-B043-2D9FA5095E1C}') {
                this.initFormItems.rxloan = true;
            }
            //瑞享贷
            if (this.loanTypeGuid == '{D52510FD-94C5-467D-A137-3E7373C91CBF}') {
                this.initFormItems.rhloan = true;
            }

        },
        // 设置头部
        setHeader() {
            Native.NUI.setHeader({
                'title': '进件申请-资料填写',
                'isBack': true,
                'leftCallback': 'ifStayThisPageBtnEvent'
            })

        },
        // 确认框弹出-确认
        onConfirm() {
            Native.NRouter.back();
        },
        getApplys() {
            // 查询进件约束获取CustomerGuid，预防客户在系统不存在情况
            let loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
            this.$axios({
                url: '/Apply/GetAppSelects',
                data: {
                    CustomerName: this.CustomerName,
                    IDCARD: this.CustomerIdCard,
                    UserGuid: loginInfo.UserGuid,
                    DepetGuid: loginInfo.DepartmentGuid,
                },
                method: 'post',
                typeName: "85",
                showLoading: true
            }).then((success) => {
                if (success.data.ResultType === 0 && success.data.Model.Result.Customers) {
                    this.isDisable= false;
                    let customers = success.data.Model.Result.Customers;
                    if (customers.length > 0) {
                        this.CustomerGuid = customers[0].Guid;
                        if (this.CustomerGuid) {
                            this.$axios({
                                url: '/Apply/getappapplys',
                                params: {
                                    guid: this.CustomerGuid
                                },
                                method: 'get',
                                typeName: "85",
                                showLoading: true
                            }).then((success) => {
                                if (success.data.Model) {
                                    let model = success.data.Model.Model;
                                    this.applyGUid = model.APPLY_GUID; // 借款id
                                    this.loanGroupGuid = model.APPLY_PROD_TYPE_GUID; // 产品id
                                    this.loanTypeGuid = model.LOAN_TYPE_GUID; // 产品类型
                                    if (model.DATE_INFO_SOURCE === 1) {
                                        this.dealFromEFamily = true;
                                    } else {
                                        this.dealFromEFamily = false;
                                    }

                                    //菜单加载
                                    this.setMenu();
                                }
                            }, (error) => {
                                console.log(error);
                            })
                        }
                    }
                }
            }, () => {
                this.isDisable= false;
                console.log(error);
            })
        },
        submit() {
            let loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
            let dealEFromEFamilyData = window.platformAdapter.getEFromFamily();
            if (!this.CustomerGuid) {
                this.$toast("请填写基本信息");
                return false;
            }
            if (!this.applyGUid) {
                this.$toast("请填写借款信息");
                return false;
            }
            if (this.dealFromEFamily && dealEFromEFamilyData) {
                for(let family in this.initFormItems) {
                    if (family==='infobase' &&  this.initFormItems[family] && !dealEFromEFamilyData[family]) {
                        this.$toast("请先保存基本信息");
                        return false;
                    } else if (family==='infoloan' &&  this.initFormItems[family]  && !dealEFromEFamilyData[family]) {
                        this.$toast("请先保存借款信息");
                        return false;
                    } 
                    else if (family==='workUnit' &&  this.initFormItems[family]  && !dealEFromEFamilyData[family]) {
                        this.$toast("请先保存工作单位信息");
                        return false;
                    } else if (family==='information' &&  this.initFormItems[family]  && !dealEFromEFamilyData[family]) {
                        this.$toast("请先保存企业信息");
                        return false;
                    } else if (family==='jyloan' &&  this.initFormItems[family]  && !dealEFromEFamilyData[family]) {
                        this.$toast("请先保存菁英贷信息");
                        return false;
                    } else if (family==='rxloan' &&  this.initFormItems[family]  && !dealEFromEFamilyData[family]) {
                        this.$toast("请先保存瑞薪贷信息");
                        return false;
                    } else if (family==='sdloan' &&  this.initFormItems[family]  && !dealEFromEFamilyData[family]) {
                        this.$toast("请先保存闪电贷信息");
                        return false;
                    } else if (family==='hsloan' &&  this.initFormItems[family]  && !dealEFromEFamilyData[family]) {
                        this.$toast("请先保存恒速贷信息");
                        return false;
                    } else if (family==='rhloan' &&  this.initFormItems[family]  && !dealEFromEFamilyData[family]) {
                        this.$toast("请先保存瑞享贷信息");
                        return false;
                    } 
                }
                
            }
            this.isDisable= true;
            this.$axios({
                url: '/apply/UpdateAPPApplyStatus',
                data: {
                    APPLY_STATUS_CODE: 'REGISTER',
                    USER_GUID: this.CustomerGuid,
                    DEP_GUID: loginInfo.DepartmentGuid,
                    APPLY_ID: this.applyGUid
                },
                method: 'post',
                typeName: '85',
                showLoading: true
            }).then((success) => {
                this.isDisable= false;
                if (success.data.ResultType === 0) {
                    Native.NRouter.assign({
                        url: 'save-success.html'
                    })
                } else {
                    this.$toast(success.data.Message);
                }
            }, (error) => {
                 this.isDisable= false;
            })
        },
        goPage(type) {
            switch (type) {
                // 跳转至基本信息
                case 'infobase':
                    Native.NRouter.open({
                        data: {
                            customerIdCard: this.CustomerIdCard,
                            customerGuid: this.CustomerGuid,
                            userGuid: this.UserGuid,
                            realName: this.CustomerName,
                            tel: this.tel,
                            dateInfoSource: this.dealFromEFamily?1:''
                        },
                        url: 'income-part_base.html'
                    });
                    break;
                    // 跳转至借款信息
                case 'infoloan':
                    if (!this.CustomerGuid) {
                        this.$toast("请填写基本信息");
                        return false;
                    }
                    Native.NRouter.open({
                        data: {
                            userGuid: this.CustomerGuid,
                            realName: this.CustomerName,
                            cardNo: this.CustomerIdCard,
                            dateInfoSource: this.dealFromEFamily?1:''
                        },
                        url: 'income-part_loanInfo.html'
                    });
                    break;
                    // 跳转至联系人信息 
                case 'infocontacts':
                    if (!this.CustomerGuid) {
                        this.$toast("请填写基本信息");
                        return false;
                    }
                    if (!this.applyGUid) {
                        this.$toast("请填写借款信息");
                        return false;
                    }
                    Native.NRouter.open({
                        data: {
                            customerGuid: this.CustomerGuid,
                            dateInfoSource: this.dealFromEFamily?1:''
                        },
                        url: 'income-part_contact-list.html'
                    });
                    break;
                    // 跳转至工作单位
                case 'workUnit':
                    if (!this.CustomerGuid) {
                        this.$toast("请填写基本信息");
                        return false;
                    }
                    if (!this.applyGUid) {
                        this.$toast("请填写借款信息");
                        return false;
                    }
                    Native.NRouter.open({
                        data: {
                            userGuid: this.CustomerGuid,
                            dateInfoSource: this.dealFromEFamily?1:''
                        },
                        url: 'income-part_workUnitInfo.html'
                    });
                    break;
                    // 跳转至资产评估
                case 'assess':
                    if (!this.CustomerGuid) {
                        this.$toast("请填写基本信息");
                        return false;
                    }
                    if (!this.applyGUid) {
                        this.$toast("请填写借款信息");
                        return false;
                    }
                    Native.NRouter.open({
                        data: {
                            userGuid: this.CustomerGuid,
                            dateInfoSource: this.dealFromEFamily?1:''
                        },
                        url: 'income-part_propertyEstimate.html'
                    });
                    break;
                    // 跳转至企业信息
                case 'information':
                    if (!this.CustomerGuid) {
                        this.$toast("请填写基本信息");
                        return false;
                    }
                    if (!this.applyGUid) {
                        this.$toast("请填写借款信息");
                        return false;
                    }
                    Native.NRouter.open({
                        data: {
                            realName: this.CustomerName,
                            cardNo: this.CustomerIdCard,
                            customerGuid: this.CustomerGuid,
                            applyGuid: this.applyGUid,
                            dateInfoSource: this.dealFromEFamily?1:''
                        },
                        url: 'income-part_entrepreneur.html'
                    });
                    break;
                    // 跳转至菁英贷
                case 'jyloan':
                    if (!this.CustomerGuid) {
                        this.$toast("请填写基本信息");
                        return false;
                    }
                    if (!this.applyGUid) {
                        this.$toast("请填写借款信息");
                        return false;
                    }
                    Native.NRouter.open({
                        data: {
                            realName: this.CustomerName,
                            cardNo: this.CustomerIdCard,
                            customerGuid: this.CustomerGuid,
                            loanTypeGuid: this.loanTypeGuid,
                            applyGuid: this.applyGUid,
                            dateInfoSource: this.dealFromEFamily?1:''
                        },
                        url: 'income-part_eliteloan.html'
                    });
                    break;
                    // 跳转至瑞薪贷
                case 'rxloan':
                    if (!this.CustomerGuid) {
                        this.$toast("请填写基本信息");
                        return false;
                    }
                    if (!this.applyGUid) {
                        this.$toast("请填写借款信息");
                        return false;
                    }
                    Native.NRouter.open({
                        data: {
                            realName: this.CustomerName,
                            cardNo: this.CustomerIdCard,
                            customerGuid: this.CustomerGuid,
                            loanTypeGuid: this.loanTypeGuid,
                            applyGuid: this.applyGUid,
                            dateInfoSource: this.dealFromEFamily?1:''
                        },
                        url: 'income-part_salaryloan.html'
                    });
                    break;
                    // 跳转至闪电贷
                case 'sdloan':
                    if (!this.CustomerGuid) {
                        this.$toast("请填写基本信息");
                        return false;
                    }
                    if (!this.applyGUid) {
                        this.$toast("请填写借款信息");
                        return false;
                    }
                    Native.NRouter.open({
                        data: {
                            realName: this.CustomerName,
                            cardNo: this.CustomerIdCard,
                            customerGuid: this.CustomerGuid,
                            loanTypeGuid: this.loanTypeGuid,
                            applyGuid: this.applyGUid,
                            dateInfoSource: this.dealFromEFamily?1:''
                        },
                        url: 'income-part_flashloan.html'
                    });
                    break;
                    // 跳转至恒速贷
                case 'hsloan':
                    if (!this.CustomerGuid) {
                        this.$toast("请填写基本信息");
                        return false;
                    }
                    if (!this.applyGUid) {
                        this.$toast("请填写借款信息");
                        return false;
                    }
                    Native.NRouter.open({
                        data: {
                            realName: this.CustomerName,
                            cardNo: this.CustomerIdCard,
                            customerGuid: this.CustomerGuid,
                            loanTypeGuid: this.loanTypeGuid,
                            applyGuid: this.applyGUid,
                            dateInfoSource: this.dealFromEFamily?1:''
                        },
                        url: 'income-part_quickloan.html'
                    });
                    break;
                    // 跳转至瑞享贷
                case 'rhloan':
                    if (!this.CustomerGuid) {
                        this.$toast("请填写基本信息");
                        return false;
                    }
                    if (!this.applyGUid) {
                        this.$toast("请填写借款信息");
                        return false;
                    }
                    Native.NRouter.open({
                        data: {
                            realName: this.CustomerName,
                            cardNo: this.CustomerIdCard,
                            customerGuid: this.CustomerGuid,
                            loanTypeGuid: this.loanTypeGuid,
                            applyGuid: this.applyGUid,
                            dateInfoSource: this.dealFromEFamily?1:''
                        },
                        url: 'income-part_enjoyloan.html'
                    });
                    break;
                    // 跳转至考察表
                case 'inspectionTable':
                    if (!this.CustomerGuid) {
                        this.$toast("请填写基本信息");
                        return false;
                    }
                    if (!this.applyGUid) {
                        this.$toast("请填写借款信息");
                        return false;
                    }
                    Native.NRouter.openNative({
                        skip_page: "inverstigateTablePage",
                        callback: "refreshApplyPageEvent",
                        data: {
                            applyGuid: this.applyGUid, //借款Guid
                            CustomerGuid: this.CustomerGuid, //客户Guid
                            dateInfoSource: this.dealFromEFamily?1:''
                        }
                    });
                    break;
            }
        },
    },
    mounted() {
        this.setHeader();
        this.getApplys()
        // 调用app 返回的方法
        window.platformAdapter.refreshApplyPageEvent = () => {
            Native.NUI.refresh({
                refreh_page: 'income-part_apply.html'
            });
        };
        // 调用app 返回的方法--是否继续停留当前页面
        window.platformAdapter.ifStayThisPageBtnEvent = () => {
            this.showConfirm = true;
        }
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

.follow_records_menu_title {
    height: 0px;
    background: #F4F4F4;
}

.follow_records_menu_part {
    background: rgba(244, 244, 244, 1);

    .vux-label {
        font-size: 32px;
        font-family: PingFang-SC-Medium;
        color: rgba(26, 26, 26, 1);
    }

    .weui-cell {
        height: 120px;
    }

    img {
        width: 55px;
        height: 55px;
        background: rgba(255, 255, 255, 1);
        display: block;
        margin-right: 20px;
        margin-left: 20px;
    }

    button.weui-btn {
        color: rgba(255, 255, 255, 1);
        font-size: 32px;
        bottom: 0px;
        position: fixed;
        width: 100%;
        height: 88px;
        background: rgba(68, 164, 239, 1);
        border-radius: 0px;
        border: 0px;

    }
}
</style>
