<template>
<div class="follow-record">
    <div class="bg-header" @click="link()"></div>
    <x-table :cell-bordered="false" style="background-color:#fff;" v-if="listArr && listArr.length">
        <thead>
            <tr>
                <th>跟进方式</th>
                <th>最新结果</th>
                <th>跟进时间</th>
                <th>跟进人</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item,index) in listArr" :key="index" @click="link(item)">
                <td>{{item.FollowTypeText}}</td>
                <td>{{item.FollowResultText}}</td>
                <td class="date">{{item.FollowTime}}</td>
                <td>
                    <div class="man">
                        {{item.Follower}}
                        <i></i>
                    </div>
                </td>
            </tr>
        </tbody>
    </x-table>
    <nodata :flag="!listArr.length"></nodata>
</div>
</template>

<script>
import {
    XTable
} from 'vux';
import Native from '@/common/native';
import {
    getParameter
} from '@/common/utils/url';
import nodata from '@/components_custom/nodata';
export default {
    name: 'my-contact-layout',
    components: {
        nodata,
        XTable
    },
    data() {
        return {
            listArr: [],
            customer: getParameter('realName'),
            userGuid: getParameter('userGuid')
        }
    },
    computed: {

    },
    methods: {
        getCustomerFollowList() {
            let params = {
                UserGuid: this.userGuid
            };
            this.$axios({
                url: "/FollowUp/GetCustomerFollowList",
                data: params,
                responseType: 'json', // 默认的
                method: "post",
                typeName: "93"
            }).then((success) => {
                this.listArr = success.data.Model.rows;
            });
        },
        // 设置头部
        setHeader(myTitle) {
            Native.NUI.setHeader({
                'title': myTitle,
                isBack: true,
                rightText: '添加跟进记录',
                rightTitle: '添加跟进记录',
                rightCallback: 'AddAecordEvent',
            })
        },
        link(value) {
            let data = {
                UserGuid: this.userGuid, //客户guid
                followName: this.customer, //客户姓名
                followData: ""
            };
            if (value) {
                data.followData = value;
            }
            Native.NRouter.open({
                data: {
                    followDetail: JSON.stringify(data) //转换成字符串
                },
                url: 'client-follow_records_set.html'
            });
        },
    },
    mounted() {
        window.platformAdapter.AddAecordEvent = () => {
            this.link();
        };
        this.setHeader("跟进记录");
        this.getCustomerFollowList();
    },
    created() {

    }
}
</script>

<style lang="less">
.follow-record {
    .bg-header {
        height: 20px;
        background: #F4F4F4;
    }

    thead tr {
        line-height: 90px;
        font-size: 32px;
        color: #1A1A1A;

        th {
            font-weight: 700;
        }
    }

    tbody tr {
        line-height: 100px;
        font-size: 30px;

        td {
            color: #595757;
        }

        .date {
            width: 179px;
            height: 59px;
            line-height: 30px;
            font-family: PingFang-SC-Medium;
            font-weight: 500;
            color: rgba(89, 87, 87, 1);
        }

        .man {
            position: relative;
            height: 100px;
            padding-right: 40px;

            i {
                position: absolute;
                right: 40px;
                top: 40px;
                display: inline-block;
                width: 16px;
                height: 26px;
                background: url(../../../assets/img/next@2x.png) no-repeat;
                background-size: 100%;
            }
        }
    }
}
</style>
