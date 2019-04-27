// life/me/showUserPage/showUserPage.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      avatarUrl:'',
      nickName:'',
      gender:'',
      lifeID:'',
      who:'',
      color:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var color = app.globalData.g_item_color;
    var lifeUrl = app.globalData.g_lifeUrl;
    console.log(options);
      var that=this;
      that.setData({
        lifeID: options.lifeID,
        color: color
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: color,
      })
      wx.request({
        url: lifeUrl + '/getLifeUserInfo?lifeID='+options.lifeID,
        success(res){
          console.log(res);
          if(res.data.data!="none"){
            var data=res.data.data;
            var who= data.gender =='女' ? '她':'他';
            console.log(who);
            that.setData({
              who:who,
              nickName:data.nickName,
              avatarUrl:data.avatarUrl,
              gender: data.gender
            })
            
          }


        }
      })
  },
  previewImage:function(event){
    var img=event.currentTarget.dataset.img;
    wx.previewImage({
      urls: [img],
    }) 
  },
  opentuibu:function(event){
    wx.navigateTo({
      url: '../../tuibu/tuibu?lifeID=' + this.data.lifeID + '&avatarUrl=' + this.data.avatarUrl + '&nickName=' + this.data.nickName,
    })
  },
  openjibu:function(event){
    wx.navigateTo({
      url: '../../htuiji/htuiji?lifeID=' + this.data.lifeID,
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