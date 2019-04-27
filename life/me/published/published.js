// life/me/published/published.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lifeID:"",
    nickName:"",
    avatarUrl:"",
    availableAge:[],
    selected:null,
    lifeMsg:"",
    value:'',
    lifeMsgText:"",
    color:"",
    isCanwrite:''

  },
  selectedAge:function(event){
    console.log(event);
    this.setData({
      selected:this.data.availableAge[event.detail.value],
      value: event.detail.value
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var color = app.globalData.g_item_color;
    console.log(options.tempStation);
    var tempStation=wx.getStorageSync(options.tempStation)
    console.log(tempStation)
    var availableAge=[];
    if (tempStation.age>11){
      for (var i = 10; i < tempStation.age; i++) {
        availableAge.push(i);
      }
      this.setData({
        avatarUrl: tempStation.avatarUrl,
        nickName: tempStation.nickName,
        lifeID: tempStation.lifeID,
        availableAge: availableAge,
        selected: availableAge[0],
        lifeAge: tempStation.age,
        gender: tempStation.gender,
        color: color,
        isCanwrite: true,
      })
    }else{
      this.setData({
        avatarUrl: tempStation.avatarUrl,
        nickName: tempStation.nickName,
        lifeID: tempStation.lifeID,
        isCanwrite:false,
        color: color
      })
    }
    
    wx.removeStorageSync(options.tempStation);
  },

  sayLifeMsgTap:function(event){
    console.log(event)

    var isCanwrite = event.currentTarget.dataset.iscanwrite;
    console.log("------------------");
    console.log(this.data.nickName);
    console.log("------------------");
    if (isCanwrite){
    if(this.data.lifeMsg!=""){
    wx.showLoading({
      title: '发布中……',
    })
    wx.request({
      method:'POST',
      url: 'http://47.107.33.86/postTuibuMsg?lifeID=' + this.data.lifeID + '&tuibuMsg=' + this.data.lifeMsg + '&tuibuAge=' + this.data.selected,
      header: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8'},
      success(res){
        console.log(res);
        if(res.data.data=="done"){
          wx.hideLoading();
          wx.navigateBack({
            success(res){
              wx.up
              wx.showToast({
                title: '完成！',
              })
            }
          })
        }
      }
    })}else{
      wx.showToast({
        title: ' 您什么都还写呢！！！',
        icon: "none"
      })
    }}else{
      wx.navigateTo({
        url: '../../tuiji/tuiji',
      })
    }
  },
  lifeMsgInput:function(event){
    var text = event.detail.value;
  
      this.setData({
        lifeMsg: text
    })
    
  
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