// life/me/mycollected/mycollected.js
var app=getApp();
var utils=require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: "",
    input_text: '',
    xxflag: false,
    placeholder: '搜索收藏的内容',
    input_type: 'text',
    start:0,
    count:10,
    tuibuMsg:{},
    temp_tuibuMsg:{},
    scrollHeight:"",
    lifeID:"",
    color:"",
    lifeUrl:"",
    lock_flag:true,
    updateFlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var userDataInfo = wx.getStorageSync("userDataInfo");
    var lifeID=options.lifeID;
    var start=that.data.start;
    var count=that.data.count;
    var lifeUrl = app.globalData.g_lifeUrl;
    var color=app.globalData.g_item_color;
    var screenHeight = app.globalData.screenHeight;
    var scrollHeight = (screenHeight * 2 - 178) + 'rpx'
    if (screenHeight >= 800) {
      scrollHeight = (screenHeight * 2 - 278) + 'rpx'
    }
    if (!userDataInfo) {
      userDataInfo = {}
    }
    that.setData({
      s_userDataInfo: userDataInfo,
      scrollHeight: scrollHeight,
      color: color,
      lifeID: lifeID,
      lifeUrl: lifeUrl
    })
    wx.showNavigationBarLoading();
    wx.request({
    
      url: that.data.lifeUrl+'/getColledTuibu?lifeID='+lifeID+'&start='+start+'&count='+count,
      success(res){
        wx.hideNavigationBarLoading()
        if(res.data.data!='none'){
        that.processdata(res.data.data)
          wx.hideNavigationBarLoading();
        }
      }
    })
  },
  updateData:function(event){
    var that=this;
    wx.showNavigationBarLoading();
    wx.request({

      url: that.data.lifeUrl+'/getColledTuibu?lifeID=' + lifeID + '&start=' + start + '&count=' + count,
      success(res) {
        wx.hideNavigationBarLoading()
        if (res.data.data != 'none') {
          that.processdata(res.data.data)
          wx.hideNavigationBarLoading();
        }
      }
    })
  },
  processdata:function(data) {
    var that=this;
    console.log(data);
    var tuibuMsg = [];
    for (var i = 0; i < data.length; i++) {
      var temp_data = data[i];
      console.log(temp_data);
      console.log(temp_data.tuibuMsg);
      var text = temp_data.tuibuMsg;
      if (temp_data.tuibuMsg.length > 64) {
        text = temp_data.tuibuMsg.substring(0, 64) + '...'
      }
      tuibuMsg.push({
        bid: temp_data.bid,
        lifeID: temp_data.lifeID,
        avatarUrl: temp_data.avatarUrl,
        tuibuMsg: text
      })
    }
      if(that.data.updateFlag){
        tuibuMsg = that.data.tuibuMsg.concat(tuibuMsg)
      }
      that.setData({
        tuibuMsg: tuibuMsg
      })
      that.data.start+=10;
    },
  clean_input: function (event) {
    this.setData({
      input_text: "",
      xxflag: false,
      tuibuMsg: this.data.temp_tuibuMsg,
      lock_flag: true
    })
    console.log(this.data.tuibuData);
  },
  bindinputTap: function (event) {
    console.log(event);
    var lifeUrl = app.globalData.g_lifeUrl;
    var text = event.detail.value;
    if (text != "") {
      console.log(this.data.tuibuMsg)
      if (this.data.lock_flag) {
        this.setData({
          temp_tuibuMsg: this.data.tuibuMsg
        })
      }
      console.log(this.data.temp_tuibuMsg)
      this.setData({
        xxflag: true,
        input_text: text,
        lock_flag: false
      })
      var that = this;
      wx.request({
        url: that.data.lifeUrl + '/getColledTuibu?lifeID=' + that.data.lifeID + '&tuibuMsg=' + text,
        success(res) {
          console.log(res);
          if(res.data.data!='none'){
            that.processdata(res.data.data);
            that.data.start -= 10;
          }
          
        }
      })

    } else {
      this.setData({
        input_text: "",
        xxflag: false,
        tuibuMsg: this.data.temp_tuibuMsg,
        lock_flag: true
      })
    }
  },
  showLongLifeMsg: function (event) {
    console.log(event);
    var bid = event.currentTarget.dataset.bid;
    var lifeID = event.currentTarget.dataset.lifeid;
    wx.navigateTo({
      url: '../../longMsgPage/longMsgPage?lifeID=' + lifeID + '&bid=' + bid,
    })
  },
  toUserPageTap: function (event) {
    var that = this;
    var lifeID = event.currentTarget.dataset.lifeid;
    console.log(event);
    if (that.data.s_userDataInfo.lifeID == lifeID) {
      console.log(true)
      wx.switchTab({
        url: '../mypage',
      })
    } else {
      wx.navigateTo({
        url: '../showUserPage/showUserPage?lifeID=' + lifeID,
      })
    }



  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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