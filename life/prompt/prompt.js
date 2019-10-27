// life/prompt/prompt.js
var app = getApp();
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: "",
    promptData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var lifeUrl = app.globalData.g_lifeUrl;
    var color = app.globalData.g_item_color;
    var complementary_color = app.globalData.g_complementary_color;
    var gradientColor = app.globalData.g_gradientColor;
    var offline_text = app.globalData.g_offline_text;
    var userDataInfo = wx.getStorageSync("userDataInfo");
    if (!userDataInfo) {
      userDataInfo = {}

    }
    that.setData({
      color: color,
      complementary_color:complementary_color,
      lifeUrl: lifeUrl,
      userDataInfo: userDataInfo,
      gradientColor: gradientColor,
      offline_text: offline_text
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: color,
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log("show");
    var that = this;
    var promptDatastor = wx.getStorageSync("promptData")
    var old_data = [];
    if (promptDatastor.promptData) {
      old_data = promptDatastor.promptData;
    }
    console.log(that.data.userDataInfo);
    if (that.data.userDataInfo.lifeID) {
      console.log('有缓存数据');
      wx.request({
        url: that.data.lifeUrl + '/getprompt?lifeID=' + that.data.userDataInfo.lifeID,
        success(res) {
          console.log(res);
          var new_data = res.data.data;
          if (new_data == "none") {
            new_data = [];
          }
          that.processdata(new_data, old_data);
        },
      
        fail(res){
          wx.showToast({
            title: that.data.offline_text,
            icon:'none'
          })
        }
        
      })

    }

  },
  processdata: function(new_data, old_data) {
    var that = this;
    var promptData = [];
    console.log("new_data");
    console.log(new_data);
    console.log("old_data");
    console.log(old_data);
    for (var i = 0; i < new_data.length; i++) {
      var data = new_data[i];
      promptData.push({
        msgId: data.msgId,
        bid: data.bid,
        msgcontent: data.msgcontent,
        msgtime: utils.splitTime(data.time),
        lifeID: data.lifeID,
        avatarUrl: data.avatarUrl,
        isread: true
        // color: that.data.complementary_color
      })
    }
    for (var i = 0; i < old_data.length; i++) {
      var data = old_data[i];
      promptData.push(data)
    }
    console.log(promptData);
    that.setData({
      promptData: promptData
    })
  },
  showUserpage: function(event) {
    var lifeID = event.currentTarget.dataset.lifeid;
    wx.navigateTo({
      url: '../me/showUserPage/showUserPage?lifeID=' + lifeID,
    })


  },

  openmsg: function(event) {
    var that = this;
    var msgId = event.currentTarget.dataset.msgid;
    var bid = event.currentTarget.dataset.bid;
    var promptDatastor = wx.getStorageSync("promptData");
    var promptmsg_signle={};
    for (var i = 0; i < that.data.promptData.length;i++){
      if (that.data.promptData[i].msgId==msgId){
        promptmsg_signle = that.data.promptData[i];
      }
    }
    wx.navigateTo({
      url: '../longMsgPage/longMsgPage?bid=' + bid + '&lifeID=' + this.data.userDataInfo.lifeID,
    })
    if (promptmsg_signle.isread){
      wx.request({
        url: that.data.lifeUrl + '/readprompt?msgId=' + msgId,
        success(res) {
          if (res.data.data != 'none') {
            var promptData = [];
            if (promptDatastor.promptData) {
              console.log("true")
              promptData = promptDatastor.promptData;
            }
            var data = {};
            var temp_promptData = []
            for (var i = 0; i < that.data.promptData.length; i++) {

              var odata = that.data.promptData[i];
              if (odata.msgId == msgId) {
                odata.isread = false;
                data = odata;
                break;
              }
            }
            promptData.unshift(data);
            promptDatastor = {
              promptData: promptData
            }
            wx.setStorageSync("promptData", promptDatastor);

          }
        }
      })
    }
    
  },
  delprompt: function(event) {
    var that=this;
    var msgId = event.currentTarget.dataset.msgid;
    var isread = event.currentTarget.dataset.isread;
    var promptDatastor = wx.getStorageSync("promptData");
    var promptData = that.data.promptData;
    var newprompt=[];
    for (var i = 0; i < promptData.length;i++){
      if(promptData[i].msgId!=msgId){
        newprompt.push(promptData[i]);
      }
    }
    that.setData({
      promptData: newprompt
    })
    if (isread){
      wx.request({
        url: that.data.lifeUrl + '/readprompt?msgId=' + msgId,
      })
    }else{
      var newprompt=[];
      for (var i = 0; i < promptDatastor.promptData.length;i++){
        var data = promptDatastor.promptData[i]

        if (data.msgId != msgId) {
          newprompt.push(promptData[i]);
        }
      }
      promptDatastor.promptData = newprompt;
     wx.setStorage({
       key: 'promptData',
       data: promptData,
     })
    }
    
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