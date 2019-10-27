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
    temp_tuibuMsg: {},
    start: 0,
    mode: "time",
    age: "",
    lifeMsg: "",
    s_userDataInfo: '',
    count: 10,
    color: "",
    input_text: '',
    xxflag: false,
    placeholder: '搜索内容',
    input_type: 'text',
    timeoutlikeflag: true,
    scrollHeight: "",
    btntext: '赞最多',
    updateflag: false,
    lifeUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var lifeUrl = app.globalData.g_lifeUrl;
    var color = app.globalData.g_item_color;
    var userDataInfo = wx.getStorageSync("userDataInfo");
    var screenHeight = app.globalData.screenHeight;
    var scrollHeight = (screenHeight * 2 - 156) + 'rpx'
    if (screenHeight >= 800) {
      scrollHeight = (screenHeight * 2 - 278) + 'rpx'
    }
    that.setData({
      scrollHeight: scrollHeight
    })

    if (!userDataInfo) {
      userDataInfo = {}
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
  updateData: function() {

    var that = this;
    var lifeUrl = app.globalData.g_lifeUrl;
    ///getLifeMsg?tablename=lifeMsg_10&start=0&count=2&time
    var timecount = parseInt(that.data.start) + 10;
    var url = lifeUrl + '/getTuibuMsg?mode=time&age=' + that.data.age + '&count=' + timecount + '&lifeID=' + that.data.s_userDataInfo.lifeID;
    if (that.data.btntext == '最新') {
      url = lifeUrl + '/getTuibuMsg?mode=like&age=' + that.data.age + '&start=' + that.data.start + '&count=' + that.data.count + '&lifeID=' + that.data.s_userDataInfo.lifeID;
      that.setData({
        updateflag: true,
        count: 1
      })
    }
    wx.request({
      url: url,
      success(res) {
        console.log(res);
        if (res.data.data[0]) {

          var tuibuMsg = that.processData(res.data.data);
          console.log(that.data.tuibuMsg);
          if (that.data.updateflag) {
            if (that.data.tuibuMsg[0]) {
              console.log('不是空的')
              tuibuMsg = that.data.tuibuMsg.concat(tuibuMsg);
              that.setData({
                updateflag: false
              })
            }
          }
          that.setData({
            tuibuMsg: tuibuMsg
          })

          that.data.start += 10;
          console.log("start:" + that.data.start);
          console.log(that.data.tuibuMsg)
        } else {
          wx.showToast({
            title: '暂时没有更多了 客官~~~',
            icon: "none"
          })
        }
      }

    })
  },
  backpage: function(event) {
    wx.navigateBack();
  },
  clean_input: function(event) {
    this.setData({
      input_text: "",
      xxflag: false,
      tuibuMsg: this.data.temp_tuibuMsg,
      lock_flag: true
    })
    console.log(this.data.tuibuData);
  },
  bindinputTap: function(event) {
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
        url: lifeUrl + '/getTuibuMsg?age=' + that.data.age + '&tuibuMsg=' + text,
        success(res) {
          console.log(res);
          var data = that.processData(res.data.data);
          that.setData({
            tuibuMsg: data
          })
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
  showLongLifeMsg: function(event) {
    console.log(event);
    var bid = event.currentTarget.dataset.bid;
    var lifeID = event.currentTarget.dataset.lifeid;
    wx.navigateTo({
      url: '../longMsgPage/longMsgPage?lifeID=' + lifeID + '&bid=' + bid,
    })
  },
  toUserPageTap: function(event) {
    var that = this;
    var lifeID = event.currentTarget.dataset.lifeid;
    console.log(event);
    if (that.data.s_userDataInfo.lifeID == lifeID) {
      console.log(true)
      wx.switchTab({
        url: '../me/mypage',
      })
    } else {
      wx.navigateTo({
        url: '../me/showUserPage/showUserPage?lifeID=' + lifeID,
      })
    }



  },
  processData: function(data) {
    console.log(data);
    var tuibuMsg = [];
    for (var i = 0; i < data.length; i++) {
      console.log(data[i]);
      var islike = data[i].islike;
      var temp_data = data[i].tuibudata;
      console.log(temp_data);
      var text = temp_data.tuibuMsg;
      if (temp_data.tuibuMsg.length > 120) {
        text = temp_data.tuibuMsg.substring(0, 120) + '...'
      }
     
      var nowtime = utils.splitTime(utils.formatTime(new Date()));
      console.log(nowtime)
      var tuibuMsgDate = utils.splitTime(temp_data.tuibuMsgDate);
      var howlong = utils.gethowlong(nowtime, tuibuMsgDate);

      tuibuMsg.push({
        islike: islike,
        bid: temp_data.bid,
        lifeID: temp_data.lifeID,
        avatarurl: temp_data.avatarUrl,
        nickname: temp_data.nickname,
        tuibulike: temp_data.tuibuLike,
        leavemsg: temp_data.leaveMsg,
        tuibumsg: text,
        likeanimation:'null',
        howlong: howlong
      })



    }
    console.log('ok');
    console.log(tuibuMsg);
    return tuibuMsg;
  },
  changModetap: function(event) {
    var that = this;
    var lifeUrl = app.globalData.g_lifeUrl;
    var btntext = '赞最多'
    if (that.data.btntext == "赞最多") {
      btntext = '最新'
    }
    var tuibuMsg = [];
    that.setData({
      tuibuMsg: tuibuMsg,
      start: 0,
      count: 10,
      btntext: btntext
    })
    var type = btntext == '赞最多' ? '最新' : '赞最多'
    wx.showToast({
      title: '已经切换至' + type,
    })

    that.updateData();

  },
  liketuibuTap: function(event) {
    var that = this;
    console.log(event);
    var lifeUrl = app.globalData.g_lifeUrl;
    var bid = event.currentTarget.dataset.bid;
    var lifeID = that.data.s_userDataInfo.lifeID;
    var blifeID="";
    if (that.data.timeoutlikeflag) {
      that.setData({
        timeoutlikeflag: false
      })
      setTimeout(function () {
        that.setData({
          timeoutlikeflag: true
        })
      }, 1000)
      var animation = wx.createAnimation({});
      animation.scale(0.8, 0.8).step({ duration: 100 })
      animation.scale(1.2, 1.2).step({ duration: 100 })
      animation.scale(1, 1).step({ duration: 100 })
      if (lifeID) {
        var reqflag = true;
        var newtuibumsg=[]
        var tuibuMsg = that.data.tuibuMsg
        for (var i = 0; i < tuibuMsg.length; i++) {
          tuibuMsg[i].likeanimation=null;
          if (bid == tuibuMsg[i].bid) {
            tuibuMsg[i].likeanimation = animation.export();
            if (tuibuMsg[i].islike) {
              reqflag = false
              tuibuMsg[i].islike = false;
              blifeID = tuibuMsg[i].lifeID;
            
              tuibuMsg[i].tuibulike -=1;
            }else{
              tuibuMsg[i].tuibulike += 1;
              tuibuMsg[i].islike = true;
            }
          }
          newtuibumsg.push(tuibuMsg[i]);
        }
        console.log(reqflag)
        wx.request({
          url: lifeUrl + '/updateLike?bid=' + bid + '&lifeID=' + lifeID + '&flag=' + reqflag + '&blifeID=' + blifeID,
          success(res) {
            console.log(res);
            if (res.data.data == 'done') {
              that.setData({
                tuibuMsg: newtuibumsg
              })
            }
          }
        })
      } else {
        wx.showModal({
          title: '点赞',
          content: '立即登陆',
          success(res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '../me/mypage'
              })

            }
          }
        })
      }
    }
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