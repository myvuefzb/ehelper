<template>
<div class="follow_set_part">
    <div class="follow_set_title" @click="query()">

    </div>
    <my-line-input title="" item-name="姓名" v-model="formObj.followName" placeholder="请填写" class="text-left" :isRequired="false" :disabled="disabled"></my-line-input>
    <my-line-input title="" item-name="跟进人" v-model="formObj.followUser" placeholder="请填写" class="text-left" :isRequired="false" :disabled="disabled"></my-line-input>
    <my-line-input title="" item-name="跟进方式" class="text-left">
        <group>
            <popup-picker v-model="formObj.followType" :data="formObj.followTypeArr" show-name placeholder="请选择" :disabled="disabled"></popup-picker>
        </group>
    </my-line-input>
    <my-line-input title="" item-name="跟进时间" class="text-left">
        <datetime format="YYYY-MM-DD HH:mm" v-model="formObj.followDate" placeholder="请选择" :readonly="disabled">

        </datetime>
    </my-line-input>
    <my-line-input title="" item-name="跟进结果" class="text-left">
        <group>
            <popup-picker v-model="formObj.followResult" :data="formObj.followResultArr" show-name placeholder="请选择" :disabled="disabled"></popup-picker>
        </group>
    </my-line-input>
    <my-line-input title="" item-name="下次跟进时间" class="text-left">
        <datetime format="YYYY-MM-DD" v-model="formObj.nextFollowDate" placeholder="请选择" :readonly="disabled">

        </datetime>
    </my-line-input>
    <flexbox :gutter="0" class="flexbox" style="align-items: baseline;">
        <flexbox-item :span="2">
            <span class="remark" >备注</span>
        </flexbox-item>
        <flexbox-item :span="8">
            <x-textarea class="textarea" :readonly="disabled" title="" v-model="formObj.remark" :max="100" placeholder="不得超过100个字符" :show-counter="false" :height="100" :rows="8" :cols="30"></x-textarea>
        </flexbox-item>
    </flexbox>
</div>
</template>

<script>
import MyLineInput from '@/components_custom/my-line-input';
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
    XTextarea
} from 'vux';
import {
    getParameter
} from '@/common/utils/url';
import Native from '@/common/native';
import {
    error
} from 'util';
import {
    defaultCoreCipherList
} from 'constants';
import {
    create
} from 'domain';
export default {
    components: {
        MyLineInput,
        XButton,
        Datetime,
        PopupPicker,
        Group,
        Flexbox,
        FlexboxItem,
        XTextarea
    },
    data() {
        return {
            formObj: {
                followName: '',
                followUser: '',
                followType: [],
                followTypeArr: [
                    [{
                            name: '电话',
                            value: '0'
                        },
                        {
                            name: '微信',
                            value: '1'
                        },
                        {
                            name: '邮件',
                            value: '2'
                        },
                        {
                            name: '外访',
                            value: '3'
                        }
                    ]
                ],
                followDate: null,
                nextFollowDate: null,
                followResult: [],
                followResultArr: [
                    [{
                            name: '空号',
                            value: '0'
                        },
                        {
                            name: '无人接听',
                            value: '1'
                        },
                        {
                            name: '无意向',
                            value: '2'
                        },
                        {
                            name: '待跟进',
                            value: '3'
                        },
                        {
                            name: '成交',
                            value: '4'
                        }
                    ]
                ],
                remark: '',
                userGuid: '',
                disabled: false
            },
            disabled: false,
            loginInfo: null
        }
    },
    methods: {
        getUserLoginInfo() {
            Native.NRouter.getUserLoginInfo({
                'callback': 'getUserLoginInfo'
            });
        },
        // 设置头部
        setHeader(myTitle, type) {
            if (!type || type === 'save') {
                Native.NUI.setHeader({
                    'title': myTitle,
                    isBack: true,
                    rightText: '保存',
                    rightTitle: '保存',
                    rightCallback: 'SaveAecordSetEvent'
                })
            } else if (type === 'scan') {
                Native.NUI.setHeader({
                    'title': myTitle,
                    isBack: true
                })
            }

        },
        getFollowData() {
            let followDetail = getParameter('followDetail');
            let followDetailJSON = JSON.parse(followDetail);
            if (!followDetailJSON)
                return false;
            this.formObj.followName = followDetailJSON.followName;
            this.userGuid = followDetailJSON.UserGuid;
            this.loginInfo = JSON.parse(window.localStorage.getItem("loginInfo"));
            if (this.loginInfo) {
                this.formObj.followUser = this.loginInfo.RealName; //获取登录人姓名
            } else {
                getUserLoginInfo();
            }
            // 查看
            if (followDetailJSON.followData) {
                this.disabled = true;
                this.formObj.followType.push(followDetailJSON.followData.FollowType);
                let followDateStr = followDetailJSON.followData.FollowTime;
                let tt = followDateStr.substr(0, 4) + '-' + followDateStr.substr(5, 2) + '-' + followDateStr.substr(8, 2) + ' ' + followDateStr.substr(11, 2) + ':' + followDateStr.substr(14, 2);
                this.formObj.followDate = tt;
                let nextFollowDateStr = followDetailJSON.followData.NextFollowingDate;
                let tt1 = nextFollowDateStr.substr(0, 4) + '-' + nextFollowDateStr.substr(5, 2) + '-' + nextFollowDateStr.substr(8, 2) //+ ' ' + nextFollowDateStr.substr(11, 2) + ':' + nextFollowDateStr.substr(14, 2);
                this.formObj.nextFollowDate = tt1;
                this.formObj.followResult.push(followDetailJSON.followData.FollowResult);
                this.formObj.remark = followDetailJSON.followData.FollowDesc;
                this.setHeader("设置跟进", "scan");
            } else {
                // 保存
                this.setHeader("设置跟进", "save");
            }

        },
        // 验证
        validAll() {
            let msgNot = '请填写';
            let validObj = new Valitor();
            validObj.add(strategy.isNotEmpty(this.formObj.followDate, '请选择跟进时间'));
            validObj.add(strategy.isNotEmpty(this.formObj.followDate, '下次跟进时间'));
            if (this.formObj.followType.length === 0)
                validObj.add(msgNot + '跟进方式');
            if (this.formObj.followResult.length === 0)
                validObj.add('请选择跟进结果');
            return validObj.start();
        },
        query() {
            let resultMsg = this.validAll();
            if (resultMsg) {
                this.$toast({
                    message: resultMsg,
                    duration: 2000
                });
                return false;
            };
            let param = {
                nextfollowingdate: this.formObj.nextFollowDate,
                Followtype: this.formObj.followType + '',
                followtime: this.formObj.followDate,
                Followresult: this.formObj.followResult + '',
                Follower: this.loginInfo.UserGuid,
                followdesc: this.formObj.remark,
                Fk_Userguid: this.userGuid 
            };
            this.$axios({
                url: '/FollowUp/AddFollowRecord',
                data: param,
                method: 'post',
                typename: '93'
            }).then((success) => {
                if (success.data.Message == "操作成功！") {
                    Native.NRouter.assign({
                        data: {
                            userGuid: this.userGuid,
                            realName: this.formObj.followName
                        },
                        url: 'client-follow_records.html'
                    });
                }
            }, (error) => {

            })
        }

    },
    mounted() {
        window.platformAdapter.SaveAecordSetEvent = () => {
            this.query();
        };
        this.getFollowData();
    },
    created() {
        getUserLoginInfo();
    }
}
</script>

<style lang="less">
@import '~@/styles/base.less';

.follow_set_title {
    height: 20px;
    background: #F4F4F4;
}

.remark {
    font-size: 32px;
    font-family: PingFang-SC-Medium;
    color: rgba(26, 26, 26, 1);
    padding-left: 45px;
    padding-top: 0px;
    position: absolute;

}

.textarea {
    margin-top: 37px;
    width: 562px;
    height: 260px;
    border: 1px solid rgba(228, 228, 228, 1);
    border-radius: 4px;
    font-size: 32px;
}
</style>
