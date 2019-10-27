// life/tuibu/tuibu.js
var utils = require("../../utils/util.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    likefont: "",
    agefont: "",
    lifeID: "",
    tuibuData: {},
    avatarUrl: "",
    nickName: '',
    gender: "",
    userDate: "",
    color: '',
    count: 3,
    isSelf: false,
    scrollHeight: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var lifeUrl = app.globalData.g_lifeUrl;
    var likefont = app.globalData.g_likefont;
    var agefont = app.globalData.g_agefont;
    var color = app.globalData.g_item_color;
    var complementaryColor = app.globalData.g_complementary_color;
    var gradientColor = app.globalData.g_gradientColor;
    var that = this;
    var userDataInfo = wx.getStorageSync("userDataInfo");
    var screenHeight = app.globalData.screenHeight;
    var scrollHeight = (screenHeight * 2 - 115) + 'rpx'
    if (screenHeight >= 800) {
      scrollHeight = (screenHeight * 2 - 278) + 'rpx'
    }
    if (!userDataInfo) {
      userDataInfo = {}
    }
    wx.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: color
    })
    that.setData({
      color: color,
      scrollHeight: scrollHeight,
      likefont: likefont,
      agefont: agefont,
      lifeID: options.lifeID,
      avatarUrl: options.avatarUrl,
      nickName: options.nickName,
      userDataInfo: userDataInfo,
      complementaryColor: complementaryColor,
      gradientColor: gradientColor
    })
    if (userDataInfo.lifeID == that.data.lifeID) {
      console.log()
      that.setData({
        isSelf: true
      })
    }
    that.updateTuibu();
    console.log(that.data);
  },
  delbtnTap: function() {

  },
  updateTuibu: function() {
    wx.showNavigationBarLoading();
    var that = this;
    var lifeUrl = app.globalData.g_lifeUrl;
    var start = that.data.start;
    var count = that.data.count;
    wx.request({
      url: lifeUrl + '/getTuibuMsg?lifeID=' + that.data.lifeID + '&count=' + count,
      success(res) {
        console.log(res);
        if (res.data.data != "none") {
          that.processData(res.data.data)
        }

      }
    })
  },
  reqData: function() {


  },
  processData: function(odata) {
    var that = this;
    var data = [];
    for (var i = 0; i < odata.length; i++) {
      var odata_3 = odata[i];
      var time = utils.splitTime(odata_3.tuibuMsgDate);
      data.push({
        bid: odata_3.bid,
        tuibuMsg: odata_3.tuibuMsg,
        tuibuMsgDate: odata_3.tuibuMsgDate,
        tuibuLike: odata_3.tuibuLike,
        time: time,
        lifeID: odata_3.lifeID,
        leaveMsg: odata_3.leaveMsg,
        age: parseInt(odata_3.age)
      })
    }
    that.data.count += 3;
    that.setData({
      tuibuData: data
    })
    console.log(that.data.tuibuData);
    wx.hideNavigationBarLoading();
  },

  delbtnTap: function(event) {
    var lifeUrl = app.globalData.g_lifeUrl;
    var that = this;
    var bid = event.currentTarget.dataset.bid;
    wx.showModal({
      title: '扔掉推布',
      content: '确认扔掉您写下的这篇推布吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '扔掉中···',
          })
          wx.request({
            url: lifeUrl + '/delTuibuMsg?bid=' + bid,
            success(res) {
              if (res.data.data == 'done') {
                wx.hideLoading();
                wx.showToast({
                  title: '已扔掉',
                  icon: 'none'
                })
                var tuibuData = that.data.tuibuData;
                var newData = [];
                for (var i = 0; i < tuibuData.length; i++) {
                  if (tuibuData[i].bid != bid) {
                    newData.push(tuibuData[i])
                  }
                }
                that.setData({
                  tuibuData: newData
                })
              }
            }
          })
        }
      }
    })
  },

  showLongMsg: function(event) {
    var lifeID = event.currentTarget.dataset.lifeid;
    var bid = event.currentTarget.dataset.bid;
    wx.navigateTo({
      url: '../longMsgPage/longMsgPage?lifeID=' + lifeID + '&bid=' + bid,
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  onwhopageTap: function(event) {
    var that = this;
    if (that.data.userDataInfo.lifeID == that.data.lifeID) {
      wx.switchTab({
        url: '../me/mypage'
      })
    } else {
      wx.navigateBack();
    }
  },
  backpage: function(event) {
    wx.navigateBack();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})