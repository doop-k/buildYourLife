// life/tuiji/tuiji.js
var utils=require("../../utils/util.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    tuiji_title:'推记标题',
    switch_pre:'公开',
    tuiji_content:'推记内容',
    tuiji_signature:'推记署名 |',
    tuiji_past_due:'推记过期时间',
    tuiji_isVisible:1,
    time:'',
    starTime:'',
    endTime:'',
    nickName:'',
    avatarUrl:'',
    lifeID:'',
    gender:'',
    tuijiUrl:'',
    color:"",
    switch_checked:true,
    title_value:"",
    content_value:"",
    signature:"",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var  color=app.globalData.g_item_color
    var tuijiUrl = app.globalData.g_lifeUrl ;
    var gradientColor = app.globalData.g_gradientColor;
    var complementaryColor = app.globalData.g_complementary_color;
    var userDataInfo = wx.getStorageSync
("userDataInfo");
    var day = parseInt((utils.formatTime(new Date())).split(' ')[0].split('/')[2]) + 3;
    var year = parseInt((utils.formatTime(new Date())).split(' ')[0].split('/')[0]) + 10;
    var startYear = (utils.formatTime(new Date())).split('/')[0] + '-' + (utils.formatTime(new Date())).split('/')[1] + '-' + day;
    var endYear = year + '-' + (utils.formatTime(new Date())).split('/')[1] + '-' + (utils.formatTime(new Date())).split(' ')[0].split('/')[2];
    this.setData({
      starTime: startYear,
      endTime: endYear,
      lifeID: userDataInfo.lifeID,
      nickName: userDataInfo.nickName,
      gender: userDataInfo.gender,
      avatarUrl: userDataInfo.avatarUrl,
      tuijiUrl: tuijiUrl,
      color: color,
      gradientColor: gradientColor,
      complementaryColor: complementaryColor
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: color,
    })


  },
  showtime:function(){
    var time = utils.splitTime(utils.formatTime(new Date()));
    console.log(time)
    this.setData({
      time: time
    })
  },
  switch_pre:function(event){
    console.log();
    this.setData({
      tuiji_isVisible: event.detail.value ? 1 : 0
    })
  },
  dateChange:function(event){

    this.setData({
      tuiji_past_due:event.detail.value
    })
    console.log(event)

  },
  dateTap:function(evnet){

  },
  tuijiSubmit:function(event){
    var that =this;
    var data = event.detail.value;
    if (data.tuiji_title != "" & data.tuiji_content != "" & data.tuiji_signature != "" & that.data.tuiji_past_due != "推记过期时间"){
      wx.showLoading({
        title: '记布正在工作中',
      })

      console.log(event.detail.value)
      var isVisible = 1;
      if (!that.data.tuiji_isVisible) {
        console.log('false')
        isVisible = 0;
      }
      console.log(isVisible);
      // var postdata={
      //   lifeID:this.data.lifeID,
      //   title: data.tuiji_title,
      //   content:data.content,
      //   signature:data.tuiji_signature,
      //   time: this.data.time,
      //   past_tu_time: this.data.tuiji_past_du,
      //   isVisible: isVisible
      // }
      wx.request({
        method: 'POST',
        url: that.data.tuijiUrl + '/postTuijiMsg?lifeID=' + that.data.lifeID + '&title=' + data.tuiji_title + '&content=' + data.tuiji_content + '&signature=' + data.tuiji_signature + '&time=' + that.data.time + '&past_due_time=' + that.data.tuiji_past_due + '&isVisible=' + isVisible,
        header: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' },
        success(res) {
          console.log(res);
          if (res.data.data == 'done') {
            wx.hideLoading();
            wx.showToast({
              title: '已经记下了！',
            })
            console.log(true)
            that.setData({
              tuiji_title: '推记标题',
              switch_pre: '公开',
              tuiji_content: '推记内容',
              tuiji_signature: '推记署名 |',
              tuiji_past_due: '推记过期时间',
              time: '',
              switch_checked: true,
              title_value: "",
              content_value: "",
              signature_value: "",
            })
              wx.reLaunch({
                url: '../me/mypage',
              })
          }
        }

      })
    }else{
      wx.showToast({
        title: '您还没填完呢！^_^',
        icon:'none'
      })
    }
    
  },
  backpage: function () {
    wx.navigateBack();
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