<template>
    <div class="client-follow">
        <div class="search-header">
            <span class="search-icon"></span>
            <input class="search-input" v-model="realName" />
            <span class="search-btn" @click="search">搜索</span>
        </div>
        <div class="bg-header"></div>
        <div class="client-box">
            <div class="flex-box">
                <div class="flex-header">
                    <div class="flex-header-content">
                        <div class="flex-two"><div class="search-item">姓名</div></div>
                        <div class="flex-four"><div class="search-item">手机号</div></div>
                        <div class="flex-four"><div class="search-item">最新跟进</div></div>
                        <div class="flex-two"><div class="search-item">处理</div></div>
                    </div>
                </div>
                <div class="flex-body" v-if="customerList.length>0">
                    <scroller :height="getWinHeight" :lockX=true  :pulldown-config="pullDownConfig" :pullup-config="pullUpConfig" v-model="scrollerStatus" ref="myScroller" :use-pulldown=true :use-pullup=true @on-pullup-loading="loadMore" @on-pulldown-loading="refresh">
                        <div class="scroll-content">
                            <div class="flex-body-content" v-for="customer in customerList" :key="customer.UserGuid" @click="goCustomerDetail(customer)">
                                <div class="flex-two"><div class="search-content-item">{{customer.RealName}}</div></div>
                                <div class="flex-four"><div class="search-content-item">{{customer.Tel}}</div></div>
                                <div class="flex-four"><div class="search-content-item">{{customer.LastFollowTime || '未设置'}}</div></div>
                                <div class="flex-two">
                                    <div class="search-content-item">
                                        <div @click.stop.prevent="dealClientFollow(customer,  $event)">
                                            <img class="deal-icon" src="@/assets/img/deal.png" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p class="none-more" v-if="!getMoreFlag">没有更多数据</p>
                        </div>
                    </scroller>
                </div>
                <nodata :flag="nodataFlag"></nodata>
                <div class="tip-shadow" v-show="showTipShadow" @click="hideDealClientFollow">
                    <div class="tip-content"  :style="{top:tipPosition+'px'}" >
                        <p>
                            <a  v-if="checkIOS" :href="iosCallPhone">拨打电话</a>
                            <span v-else @click="onCall(cacheCustomer.Tel)">拨打电话</span>
                        </p>
                        <p @click.stop.prevent="goApply(cacheCustomer)">进件申请</p>
                        <p @click.stop.prevent="goRecord(cacheCustomer)">跟进记录</p>
                    </div>
                </div>
            </div>
        </div>

        <div v-transfer-dom>
            <popup v-model="filterFlag" position="right" :show-mask="true" width="240px">
                <div class="filter-box">
                    <div class="filter-title">筛选</div>
                    <div class="filter-content">
                        <div ><span class="filter-item all" :class="{'active': fliterActive==='all'}" @click="filterItem('all')">全部</span></div>
                        <div >
                            <span class="filter-item type" :class="{'active': fliterActive===$index}" v-for="(type, $index) in followTypeList" :key="type.Key" @click="filterItem($index, type)">{{type.Value}}</span>
                        </div>
                    </div>
                    <div class="custom-warm-blue"  @click="sureFilter">确定</div>

                </div>
            </popup>
        </div>
    </div>
</template>
<script>
import nodata from '@/components_custom/nodata';
import {  Popup, Scroller, LoadMore, Spinner ,TransferDomDirective as TransferDom } from 'vux';
import Native from '@/common/native';
export default {
    components: {
        nodata,
        Popup,
        Scroller,
        LoadMore,
        Spinner
    },
    directives:{
        TransferDom
    },
    data () {
        return {
            winHeight: window.innerHeight || window.screen.height,
            tipPosition: 30,
            showTipShadow: false,
            cacheCustomer: {},
            filterFlag: false,
            isShowShadow: false,
            fliterActive: false,
            getMoreFlag: true,
            realName:'',
            followresult:'',
            customerList: '',
            followTypeList: [],
            scrollerStatus: {
                pullupStatus: 'default',
                pulldownStatus: 'default'
            },
            pullDownConfig: {
                content: '下拉刷新',
                height: 40,
                autoRefresh: false,
                downContent: '下拉刷新',
                upContent: '释放后刷新',
                loadingContent: '正在刷新...',
                clsPrefix: 'xs-plugin-pulldown-'
            },
            pullUpConfig: {
                content: '上拉可加载更多',
                pullUpHeight: 60,
                height: 40,
                autoRefresh: false,
                downContent: '释放后加载',
                upContent: '上拉加载更多',
                loadingContent: '加载中...',
                clsPrefix: 'xs-plugin-pullup-'
            },
            pageNumber: 1

        }
    },
    computed:{
        checkIOS() {
            let ua = navigator.userAgent.toUpperCase();
            return ua.indexOf('IPHONE OS') != -1;
        },
        iosCallPhone() {
            if(this.cacheCustomer && this.cacheCustomer.Tel) {
               return 'tel:'+ this.cacheCustomer.Tel;
            }
        },
        getWinHeight() {
            return (this.winHeight-110)+'px';
        },
        nodataFlag() {
            if(this.customerList && this.customerList.length===0) {
                return true;
            } else {
                return false;
            }
        }
    },
    methods:{
        getloginInfo() {
            Native.NRouter.getUserLoginInfo({'callback': 'getUserLoginInfo'});
            // let loginInfo = localStorage.getItem('loginInfo');
            // if (!loginInfo) {
            // Native.NRouter.getUserLoginInfo({'callback': 'getUserLoginInfo'});
            // }
        },
        // 设置头部
        setHeader(myTitle){
            Native.NUI.setHeader({
                'title':myTitle,
                'isBack': true,
                'rightText': '筛选',
                'rightTitle': '筛选',
                'rightCallback':'filterClientFollowBtnEvent'
            })
        },
        // 安卓拨打电话
        onCall(num){
            Native.NRouter.callPhone({"phone":num});
        },
        // 客户跟进列表
        getCustomerList (getType) {
            let loginInfo = JSON.parse(window.localStorage.getItem("loginInfo"));
            this.$axios({
                url: '/FollowUp/GetCustomerList ',
                data: {
                    Belongsalerid: loginInfo.UserGuid,
                    FindByPage: {
                        PageNumber: this.pageNumber,
                        PageSize: 10,
                        SortColumn: null,
                        SortOrder: null
                    },
                    followresult: this.followresult,
                    realname: this.realName

                },
                method: 'post',
                showLoading: true
            }).then((data)=>{
                 if(data && data.data.Model&& data.data.Model.rows) {
                    let list= data.data.Model.rows;
                    if(list && list.length) {
                        // 下拉刷新时
                        if(getType==='refresh') {
                            this.customerList= list;
                            this.getMoreFlag= true;
                            this.scrollerStatus= {
                                pullupStatus: 'default',
                                pulldownStatus: 'default'
                            };
                            this.$refs.myScroller.disablePullup();
                            this.$nextTick(() => {
                                this.$refs.myScroller.donePulldown();
                                this.$refs.myScroller.reset({top: 0});
                                this.$refs.myScroller.enablePullup();

                            })
                        } else {
                            this.customerList=this.customerList.concat(list);
                            // 是否还可以分页
                            if(data.data.Model.Total===this.customerList.length) {
                                // 没有数据就禁用上拉加载更多
                                this.getMoreFlag= false;
                                this.$nextTick(() => {
                                    this.$refs.myScroller.disablePullup();
                                    this.$refs.myScroller.donePullup();
                                    this.$refs.myScroller.reset();
                                })
                            } else {
                                // 还有数据就开启上拉，并重置
                                this.getMoreFlag= true;
                                this.$refs.myScroller.enablePullup();
                                this.$nextTick(() => {
                                    this.$refs.myScroller.donePullup();
                                    this.$refs.myScroller.reset();
                                })
                            }
                        }
                    } else {
                        this.customerList=[];
                    }
                    
                 }

            },(error)=>{
                console.log(error);
            })
        },
        // 筛选列表
        getFilterList () {
            const loginInfo = JSON.parse(window.localStorage.getItem("loginInfo"));
            this.$axios({
                url: '/FollowUp/GetFollowType ',
                method: 'get',
                showLoading: true
            }).then((data)=>{
                if(data && data.data.Model) {
                    this.followTypeList = data.data.Model.followresult;
                }
            },(error)=>{
                console.log(error);
            })
        },
        // 跳转至客户详情
        goCustomerDetail (customer) {
            Native.NRouter.open({
                data:{
                    realName: customer.RealName,
                    cardNo: customer.CardNo, // 身份证号
                    loanGuid: customer.LoanGuid, //借款GUID
                    userGuid: customer.UserGuid, // 客户GUID
                    tel: customer.Tel // 手机号码
                },
                url:'client-follow_detail.html'
            })
        },
        // 跳转至进件申请
        goApply (customer) {
            this.hideDealClientFollow();
            let loginInfo = JSON.parse(window.localStorage.getItem("loginInfo"));
            //实名认证
            this.$axios({
                url: "/Apply/GetCardCertification",
                data: {CustomerName:customer.RealName,IDCARD:customer.CardNo, UserGuid: loginInfo.UserGuid},
                method: "post",
                typeName: "85"
            }).then((success) => {
                if (success.data.Model && success.data.ResultType === 0) {
                    // 查询进件约束获取CustomerGuid
                    this.$axios({
                        url: '/Apply/GetAppSelects',
                        data: {
                            CustomerName: customer.RealName,
                            IDCARD: customer.CardNo,
                            UserGuid: loginInfo.UserGuid,
                            DepetGuid: loginInfo.DepartmentGuid,
                        },
                        method: 'post',
                        typeName: "85",
                        showLoading: true
                    }).then((success) => {
                        if(success.data.ResultType === 0 && success.data.Model.Result.Customers) {
                            let customers = success.data.Model.Result.Customers;
                            // 进件约束有Guid，验证limit
                            if (customers.length > 0) {
                                let CustomerGuid = customers[0].Guid;
                                this.$axios({
                                    url: '/ApplyLimit/ApplyLimit',
                                    data: {
                                        CustomerGuid: CustomerGuid,
                                        DeptGuid: loginInfo.DepartmentGuid,
                                        roleFunc: '0',
                                        CustomerName: customer.RealName,
                                        IDCARD: customer.CardNo
                                    },
                                    method: 'post',
                                    typeName: "85",
                                    showLoading: true
                                }).then((success) => {
                                    if (success.data.ResultType === 0) {
                                        // 判断是否是恒e家导入的数据,
                                        if (CustomerGuid) {
                                            this.$axios({
                                                url: '/Apply/getappapplys',
                                                params: {
                                                    guid: CustomerGuid
                                                },
                                                method: 'get',
                                                typeName: "85"
                                            }).then((success) => {
                                                if (success.data.ResultType === 0) { 
                                                    if (success.data.Model && success.data.Model.Model && parseInt(success.data.Model.Model.DATE_INFO_SOURCE) === 1) {
                                                          window.platformAdapter.initFromEFamily();
                                                    } else {
                                                        window.platformAdapter.cleanEFromEFamily();
                                                    }
                                                    // 跳转至进件申请
                                                    Native.NRouter.open({
                                                        data:{
                                                            realName: customer.RealName,
                                                            cardNo: customer.CardNo, // 身份证号
                                                            loanGuid: customer.LoanGuid, //借款GUID
                                                            userGuid: customer.UserGuid, // 客户GUID
                                                            tel: customer.Tel// 手机号码
                                                        },
                                                        url:'income-part_apply.html'
                                                    })
                                                }
                                                
                                            }, (error) => {
                                                console.log(error);
                                            })
                                        }
                                    } else {
                                        this.$toast(success.data.Message);
                                    }
                                        
                                }, (error) => {
                                    console.log(error);
                                })
                            } else {
                                Native.NRouter.open({
                                    data:{
                                        realName: customer.RealName,
                                        cardNo: customer.CardNo, // 身份证号
                                        loanGuid: customer.LoanGuid, //借款GUID
                                        userGuid: customer.UserGuid, // 客户GUID
                                        tel: customer.Tel // 手机号码
                                    },
                                    url:'income-part_apply.html'
                                })
                            }
                        } else {
                            this.$toast(success.data.Message); 
                        }
                    }, (error) => {
                         console.log(error);
                    })
                } else {
                    $toast(success.data.Message);
                }

            }, (error) => {

            })
            // 1进件   0未进件
            // if(!parseInt(customer.IsApply)) {
            //     Native.NRouter.open({
            //         data:{
            //             realName: customer.RealName,
            //             cardNo: customer.CardNo, // 身份证号
            //             loanGuid: customer.LoanGuid, //借款GUID
            //             userGuid: customer.UserGuid, // 客户GUID
            //             tel: customer.Tel // 手机号码
            //         },
            //         url:'income-part_apply.html'
            //     })
            // } else {
            //     this.$toast({
            //         message: '当前用户已存在申请记录',
            //         duration: 2000
            //     });
            // }

        },
        // 跳转至进件记录
        goRecord (customer) {
            this.hideDealClientFollow();
            Native.NRouter.open({
                data:{
                    realName: customer.RealName,
                    cardNo: customer.CardNo, // 身份证号
                    loanGuid: customer.LoanGuid, //借款GUID
                    userGuid: customer.UserGuid, // 客户GUID
                    tel: customer.Tel // 手机号码
                },
                url:'client-follow_records.html'
            })
        },
        // 筛选
        filterItem (index,item) {
            if(index==='all') {
                this.followresult='';
            } else {
                this.followresult= item.Key;
            }
            this.fliterActive= index;
        },
        dealClientFollow(customer, event) {
            if(event) {
                if(this.winHeight-event.pageY>120) {
                    this.tipPosition= event.pageY;
                } else {
                    this.tipPosition= event.pageY-120;
                }
            }
            this.showTipShadow= !this.showTipShadow;
            this.cacheCustomer= customer;
        },
        hideDealClientFollow () {
            this.showTipShadow= false;
        },
        filterCondition () {
            this.filterFlag = true;
        },
        sureFilter () {
            this.filterFlag = false;
            this.refresh();
        },
        // 下拉刷新
        refresh() {
            this.pageNumber=1;
            this.getCustomerList('refresh');
        },
        // 加载更多
        loadMore() {
            if(this.getMoreFlag) {
                this.pageNumber= this.pageNumber+1;
                this.getCustomerList();
            }
        },
        // 搜索
        search () {
            this.hideDealClientFollow();
            this.refresh();
        }

    },
    mounted(){
        window.platformAdapter.filterClientFollowBtnEvent= ()=>{
            this.filterCondition();
        };
      this.test = JSON.parse(window.localStorage.getItem("loginInfo"))+'test';
        this.setHeader('客户跟进');
        this.$nextTick(() => {
            this.$refs.myScroller.reset({top: 0})
        })
        this.getFilterList();
        this.search();
    },
    created() {
        this.getloginInfo();
    }
}
</script>
<style lang='less'>
@import '~@/styles/base.less';
.client-follow {
    display: flex;
    height: 100%;
    flex-direction: column;
}
.search-header {
    position: relative;
    height: 100px;
    padding-top: 22px;
    padding-bottom: 22px;
    padding-left: 30px;
    padding-right: 120px;
    background-color: #44A4EF;
    .search-icon {
        position: absolute;
        height: 43px;
        width: 43px;
        display: block;
        background: url(~@/assets/img/search.png) no-repeat center center;
        background-size: 100% 100%;
        top: 32px;
        left: 48px;
    }
    .search-input {
        height: 60px;
        width: 100%;
        padding-left: 70px;
        border: none;
        background-color: #60B2F2;
        color: #D7EEFF;
        display: block;
        border-radius: 30px;
        font-size: 28px;
    }
    .search-btn {
        display: block;
        position: absolute;
        color: #D7EEFF;
        font-size: 32px;
        top: 36px;
        right: 30px;
    }
}
.bg-header {
    height: 20px;
    background-color: #f4f4f4;
}
.client-box {
    flex: 1;
    .flex-box {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    .flex-header {
        height: 90px;
        border-bottom: solid 1px #ddd;
    }
    .flex-body {
        flex: 1;
    }
    .flex-header-content {
        display: flex;
        flex-direction: row;
    }
    .flex-body-content {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border-bottom: solid 1px #ddd;
        padding-top: 24px;
        padding-bottom: 24px;
    }
    .flex-two {
        flex: 2;
    }
    .flex-three {
        flex: 3;
    }
    .flex-four {
        flex: 4;
    }
    .search-item {
        font-size: 32px;
        color: #1A1A1A;
        height: 90px;
        line-height: 90px;
        font-weight: 700;
        text-align: center;
    }
    .search-content-item {
        font-size: 30px;
        font-weight: 500;
        color: #595757;
        text-align: center;
        word-wrap: break-word;
        vertical-align: middle;
    }
    .deal-icon {
        display: block;
        height: 48px;
        margin: 0 auto;
    }
    .tip-shadow {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 10;
    }
    .tip-content {
        position: absolute;
        height: 240px;
        width: 200px;
        padding-top: 16px;
        right: 60px;
        top: 30px;
        border-radius: 10px;
        background-color: #fff;
        box-shadow: 0 0 10px #CFCFCF;
        z-index: 100;
        p {
            font-size: 30px;
            font-weight: 500;
            color:#44A4EF;
            line-height: 66px;
            text-align: center;
        }
    }

}
.none-more {
    color:gray;
    width:100%;
    text-align:center;
}
.filter-box {
    position: relative;
    height: 100%;
    padding-left: 20px;
    padding-right: 20px;
    background-color: #fff;
    .filter-title {
        font-size: 32px;
        text-align: center;
        line-height: 60px;
    }
    .filter-content {
        border-top: solid 1px #eee;
        border-bottom: solid 1px #eee;
    }
    .filter-item {
        display: inline-block;
        width: 160px;
        height: 48px;
        border: solid 1px #ddd;
        border-radius: 8px;
        text-align: center;
        background-color: #ddd;
        color: #535353;
        line-height: 48px;
    }
    .filter-item.active {
        border: solid 1px #44A4EF;
        background-color: #fff;
    }
    .filter-item.all {
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .filter-item.type {
        margin-bottom: 20px;
        margin-right: 40px;
    }
    .custom-warm-blue {
        position: absolute;
        bottom: 0;
        left: -20px;
        right: -20px;
        text-align: center;
        line-height: 80px;
        height: 80px;
        border-radius: 0px!important;
        border-color: #44A4EF!important;
        background-color: #44A4EF;
        color:#efefef!important;
        font-size: 32px;

    }
    .custom-warm-blue:active {
        border-color: #44A4EF!important;
        color:#efefef!important;
        background-color: #44A4EF;
    }
}
</style>
