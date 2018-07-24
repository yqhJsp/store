// pages/mall/index/index.js
const app = getApp();
Page({
        /**
         * 页面的初始数据
         */
        data: {
                fileDomain: app.static_data.file_domain_url,
                list: [],
                hidden: false,//隐藏
                dots: true,//swiper指示点
                verticalL: false,//滑动方向是否为纵向
                autoplay: false,
                dot: false,
                maninfo: {},
                infos: [],
                couponlist: [],
                currentab: 2,//附近、热门门店
                latitude: '',
                longitude: '',
                member: {},
                appid: '',
                dw: '',
                percent: 0,
                status: 'normal',
                current: 2,
                verticalCurrent: 2,
                starIndex1: 0,
                starIndex2: 0,
                starIndex3: 0,
                starIndex4: 4,
                starIndex5: 5

        },
        onChange1(e) {
          const index = e.detail.index;
          this.setData({
            'starIndex1': index
          })
        },
        onChange2(e) {
          const index = e.detail.index;
          this.setData({
            'starIndex2': index
          })
        },
        onChange3(e) {
          const index = e.detail.index;
          this.setData({
            'starIndex3': index
          })
        },
        onChange5(e) {
          const index = e.detail.index;
          this.setData({
            'onChange5': index
          })
        },
        handleAdd() {
          if (this.data.percent === 100) return;
          this.setData({
            percent: this.data.percent + 10
          });
          if (this.data.percent === 100) {
            this.setData({
              status: 'success'
            });
          }
        },
        handleClick() {
          const addCurrent = this.data.current + 1;
          const current = addCurrent > 2 ? 0 : addCurrent;
          this.setData({
            'current': current
          })
        },
        handleReduce() {
          if (this.data.percent === 0) return;
          this.setData({
            percent: this.data.percent - 10,
            status: 'normal'
          });
        },
        handleChange({ detail }) {
          const type = detail.type;
          if (type === 'next') {
            this.setData({
              current: this.data.current + 1
            });
          } else if (type === 'prev') {
            this.setData({
              current: this.data.current - 1
            });
          }
        },
        //跳转到详情页
        goStoreIndex: function (e) {
                var id = e.currentTarget.dataset.id;
                console.log(id)
                wx.navigateTo({
                        url: '../storeIndex/storeIndex?id=' + id,
                })
        },
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                var that = this;

                wx.getLocation({
                        type: 'gcj02',
                        success: function (res) {
                                var latitude = res.latitude
                                var longitude = res.longitude
                                console.log("latitude:" + latitude)
                                console.log("longitude:" + longitude)
                                that.setData({
                                        latitude: latitude,
                                        longitude: longitude
                                })
                        }
                })
                app.userInfoReadyCallback = res => {
                        var member = app.globalData.member;
                        that.setData({
                                member: member,
                                appid: member.appid
                        })
                        that.getmaininfo();
                        that.couponlist();
                }
        },
        //优惠券列表
        couponlist: function () {
                var that = this;
                var memberId = that.data.member.id;
                app.api_util.couponlist({ memberId: memberId }, '加载中..', function success(res) {
                        if (res.errcode == 0) {
                                that.setData({
                                        couponlist: res.result,
                                })
                                var list = that.data.couponlist;
                                if (list.length > 0) {
                                        for (var i = 0; i < list.length; i++) {
                                                var l = list[i];
                                                var endTime = (l.endTime).split(' ');
                                                console.log(endTime + "lll")
                                                var startTime = (l.startTime).split(' ');
                                                l.end = endTime[0];
                                                l.start = startTime[0];
                                        }
                                }
                                that.setData({
                                        couponlist: list
                                })
                        }

                }, function fail(res) {

                })
        },
        //领取优惠卷
        addcoupon: function (e) {
                var that = this;
                var couponId = e.currentTarget.dataset.idx;
                console.log(couponId)
                var memberId = that.data.member.id;
                var appid = that.data.appid;
                var createUserId = app.globalData.createUserId;
                var data = {
                        couponId: couponId,
                        memberId: memberId,
                        appid: appid,
                        createUserId: createUserId
                }
                app.api_util.addcoupon(data, '', function success(res) {
                        if (res.errcode == 0) {
                                that.couponlist();
                                app.toast.success("领取成功", 1500)
                        }

                }, function fail(res) {

                })
        },
        /*联系*/
        goCall: function (e) {
                var that = this;
                var phone = e.currentTarget.dataset.phone;
                wx.makePhoneCall({
                        phoneNumber: phone
                }, function sussess(res) {

                }, function fail(res) {

                })
        },
        //跳转到单个门店
        goStore: function (e) {
                var id = e.currentTarget.dataset.id;
                wx.navigateTo({
                        url: '../storeIndex/storeIndex?id=' + id,
                })
        },
        //切换门店数据
        switchTab: function (o) {
                var that = this;
                var idx = o.currentTarget.dataset.type;
                var currentab = that.data.currentab;
                if (idx != currentab) {
                        that.setData({
                                currentab: idx,
                                infos: [], //数据源清空
                        })
                        console.log(that.data.currentab)
                        //刷新数据
                        that.childreninfolist();
                }
        },
        //获取门店列表
        childreninfolist: function () {
                var that = this;
                var mainInfoId = that.data.maninfo.id;
                var type = that.data.currentab;
                var longitude = that.data.longitude;
                var latitude = that.data.latitude;
                var data = {
                        mainInfoId: mainInfoId,
                        type: type
                }
                if (type == 1) {
                        data.longitude = longitude;
                        data.latitude = latitude
                }
                app.api_util.childreninfolist(data, '加载中..', function success(res) {
                        if (res.errcode == 0) {
                                var tag = res.result.tag;
                                that.setData({
                                        infos: res.result,

                                })
                                var list = that.data.infos;
                                var dw = '';
                                if (list.length != 0) {
                                        for (var i = 0; i < list.length; i++) {
                                                var l = list[i];
                                                var tag = l.tag.split(",");
                                                l.tags = tag;
                                                var s = l.range;
                                                if (s < 1000) {
                                                        l.distance = s;
                                                        dw = '米'
                                                }
                                                else if (s > 1000) {
                                                        l.distance = (Math.round(s / 100) / 10).toFixed(1);
                                                        dw = '公里'
                                                }

                                        }
                                        that.setData({
                                                infos: list,
                                                dw: dw

                                        })
                                }
                        }
                }, function fail(res) {

                })
        },
        //获取主体信息
        getmaininfo: function () {
                var that = this;
                app.api_util.getmaininfo({}, '加载中..', function success(res) {
                        if (res.errcode == 0) {
                                that.setData({
                                        maninfo: res.result,
                                        hidden: false
                                })
                                app.globalData.maninfo = res.result;
                                app.common_util.setBarColor(app.globalData.maninfo.tone);
                                wx.setNavigationBarTitle({
                                        title: app.globalData.maninfo.navigation
                                })
                                wx.setStorage({
                                        key: 'maninfo',
                                        data: res.result,
                                })
                                that.childreninfolist();
                        }
                }, function fail(res) {

                })
        },
    
        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function () {
                var that = this;
                that.getmaininfo();
                that.couponlist();
        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function () {

        },

        /**
         * 生命周期函数--监听页面隐藏
         */
        onHide: function () {

        },

        /**
         * 生命周期函数--监听页面卸载
         */
        onUnload: function () {

        },

        /**
         * 页面相关事件处理函数--监听用户下拉动作
         */
        onPullDownRefresh: function () {
                this.getmaininfo();
                app.refresh();
                setTimeout(() => {
                        wx.stopPullDownRefresh()
                }, 2000)
        },

        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom: function () {

        },

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function () {

        }
})