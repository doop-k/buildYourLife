// life/me/setting/advices/advices.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    advices:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad")
    var that = this;
    var color = app.globalData.g_item_color;
    var complementaryColor = app.globalData.g_complementary_color;
    var lifeUrl = app.globalData.g_lifeUrl;
    that.setData({
      color: color,
      complementaryColor: complementaryColor,
      lifeID: options.lifeID,
      lifeUrl: lifeUrl
    })
    wx.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: color

    })
  },
  submitAdvices:function(event){
    console.log(event)
    var advices = event.detail.value.advices;
    var that=this;
    if (advices!=""){
      wx.request({
        method:"POST",
        url: that.data.lifeUrl+'/postAdvices?lifeID='+that.data.lifeID+'&advices='+advices,
        success(res){
          if(res.data.data!='none'){
            wx.showToast({
              title: '谢谢你的建议',
            })
            that.setData({
              advices:""
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '您什么都还没写呢！！！',
        icon: "none"
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