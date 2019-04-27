//app.js
App({
  onLaunch: function () {
    console.log("onLunch")
    var lifeUrl = 'wss://47.107.33.86:327';
    var res =wx.getSystemInfoSync();
    this.globalData.screenHeight = res.screenHeight
    wx.connectSocket({
      url: 'wss://47.107.33.86:3981',
    })
    wx.onSocketOpen(function(res){
      console.log(res)
      console.log('连接成功')
    })
    wx.onSocketMessage(function(res){
      console.log('来消息了')
      console.log(res)
      wx.showTabBarRedDot({
        index: 1,
      })
    })


  },
  globalData: {
    userInfo: null,
    g_lifeUrl:'http://47.107.33.86',
    g_likefont:'人赞',
    g_agefont:'岁',
    g_item_color: '#4ca8f2',
    screenHeight: ''
  }
})