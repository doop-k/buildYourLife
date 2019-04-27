// life/moreLifeMsg/moreLifeMsg.js
var utils = require("../../utils/util.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    s_lifeID: "",
    tuibuMsg: {},
    temp_tuibuMsg:{},
    start: 0,
    mode: "time",
    age: "",
    lifeMsg: "",
    s_userDataInfo:'',
    count:10,
    color:"",
    input_text:'',
    xxflag:false,
    placeholder:'搜索内容',
    input_type:'text',
    lock_flag:true,
    scrollHeight:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var lifeUrl = app.globalData.g_lifeUrl ;
    var color = app.globalData.g_item_color;
    var userDataInfo =wx.getStorageSync("userDataInfo");
    var screenHeight = app.globalData.screenHeight;
    var scrollHeight = (screenHeight*2-178)+'rpx'
    if (screenHeight>=800){
      scrollHeight = (screenHeight * 2 - 278) + 'rpx'
    }
      that.setData({
        scrollHeight: scrollHeight
      })
 
    if(!userDataInfo){
      userDataInfo={}
      }
    that.setData({
      s_userDataInfo: userDataInfo,
      color: color,
      age: options.age
    })
    wx.setNavigationBarTitle({
      title: options.age + ' 岁至上',
    })
    that.updateData();
  },
  updateData:function(){
    var that = this;
    var lifeUrl = app.globalData.g_lifeUrl;
    ///getLifeMsg?tablename=lifeMsg_10&start=0&count=2&time
    wx.request({
      url: lifeUrl + '/getTuibuMsg?age=' + that.data.age + '&count=' + that.data.count,
      success(res) {
        console.log(res);
        that.setData({
          lifeMsg: res.data
        })
        var tuibuMsg = that.processData(res.data.data);
        that.setData({
          tuibuMsg: tuibuMsg
        })
        that.data.count += 10;
        console.log(that.data.tuibuMsg)
      }
    })
  },
  clean_input: function (event) {
    this.setData({
      input_text: "",
      xxflag: false,
      tuibuMsg: this.data.temp_tuibuMsg,
      lock_flag:true
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
        lock_flag:false
      })
      var that = this;
      wx.request({
        url: lifeUrl + '/getTuibuMsg?age=' + that.data.age + '&tuibuMsg='+text,
        success(res) {
          console.log(res);
          var data = that.processData(res.data.data);
          that.setData({
            tuibuMsg: data
          })
        }
      })

    }else{
      this.setData({
        input_text: "",
        xxflag: false,
        tuibuMsg: this.data.temp_tuibuMsg,
        lock_flag: true
      })
    }
  },

  showLongLifeMsg: function(event) {
    console.log(event);
    var bid = event.currentTarget.dataset.bid;
    var lifeID = event.currentTarget.dataset.lifeid;
        wx.navigateTo({
          url: '../longMsgPage/longMsgPage?lifeID=' + lifeID + '&bid=' + bid ,
        })
  },
  toUserPageTap: function(event) {
    var that=this;
    var lifeID=event.currentTarget.dataset.lifeid;
    console.log(event);
    if (that.data.s_userDataInfo.lifeID == lifeID) {
      console.log(true)
      wx.switchTab({
        url: '../me/mypage',
      })
    } else {
      wx.navigateTo({
        url: '../me/showUserPage/showUserPage?lifeID=' + lifeID ,
      })
    }



  },
  processData: function (data) {
    console.log(data);
    var tuibuMsg = [];
    for (var i = 0; i < data.length; i++) {
      var temp_data = data[i];
      console.log(temp_data);
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
    console.log('ok')
    return tuibuMsg;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: this.data.color,
    })
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