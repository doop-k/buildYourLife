var ageData = require("../../localdata/local-data.js")
var app = getApp();
var utils = require("../../utils/util.js");
// life/worldpage/worldpage.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    lifeMsgBox: [],
    animationAgeBox: {},
    msgBoxIsVisable: true,
    widthflag: true,
    extendBoxid: "",
    userDataInfo: {},
    tuibuData: {},
    showcount: 5,
    input_text: "",
    xxflag: false,
    lock_flag: true,
    color: "",
    updateFlag: true,
    temp_tuibuData: {},
    placeholder: "输入你想了解的年龄",
    input_type: "number",
    scrollHeight: ""
  },
  showUserPage: function(event) {
    var lifeID = event.currentTarget.dataset.lifeid;
    var nickName = event.currentTarget.dataset.nickname;
    var avatarUrl = event.currentTarget.dataset.avatarurl;
    var gender = event.currentTarget.dataset.gender;
    var that = this;
    console.log(gender);
    if (that.data.userDataInfo.lifeID == lifeID) {
      console.log(true)

      wx.switchTab({
        url: '../me/mypage',
      })
    } else {
      wx.navigateTo({
        url: '../me/showUserPage/showUserPage?lifeID=' + lifeID
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var color = app.globalData.g_item_color;
    console.log("onLoad")
    var lifeUrl = app.globalData.g_lifeUrl;
    var that = this;
    var userDataInfo = wx.getStorageSync("userDataInfo");
    var screenHeight = app.globalData.screenHeight;
    var scrollHeight = (screenHeight * 2 - 410) + 'rpx';
    console.log(screenHeight)
    wx.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: color
    })

    if (screenHeight>=800){
      scrollHeight = (screenHeight * 2 - 560) + 'rpx';
    }
    that.setData({
      scrollHeight: scrollHeight
    })

    console.log(that.data.scrollHeight);
    if (!userDataInfo) {
      userDataInfo = {}
    }
    that.setData({
      userDataInfo: userDataInfo,
      color: color
    })
  },
  processData: function(data) {
    console.log(data);
    var tempdata = [];
    for (var i = 0; i < data.length; i++) {
      var age = data[i].age;
      var tuibuMsg = [];
      for (var j = 0; j < data[i].tuibuMsg.length; j++) {
        var temp = data[i].tuibuMsg[j];
        var text = temp.tuibuMsg;
        if (temp.tuibuMsg.length > 15) {
          text = temp.tuibuMsg.substring(0, 15) + '...'
        }
        tuibuMsg.push({
          bid: temp.bid,
          lifeID: temp.lifeID,
          avatarUrl: temp.avatarUrl,
          text: text
        })
      }
      tempdata.push({
        age: age,
        tuibuMsg: tuibuMsg,
        boxHeight: "0rpx"
      })
    }
    console.log('ok')
    console.log(tempdata);
    return tempdata;
  },
  boxFristTap: function(event) {
    console.log(event);
    var age = event.currentTarget.dataset.age;
    this.boxChangeWidth(age, "310rpx");
  },
  updateTabdata: function() {


    var lifeUrl = app.globalData.g_lifeUrl;
    var that = this;
    var showcount = that.data.showcount;
    if (that.data.updateFlag) {
      wx.request({
        url: lifeUrl + '/getTuibuMsg?show=' + showcount,
        success(res) {
  
          console.log(res)
          if (res.data.data != 'none') {
           
            var newData = utils.processData(res.data.data);
            if (that.data.tuibuData.length == newData.length) {
              that.setData({
                updateFlag: false
              })
            }
            that.setData({
              tuibuData: newData
            })
            console.log(that.data.showcount)
            that.data.showcount += 5;
            console.log(that.data.showcount)

            console.log(that.data.tuibuData);
            if (!that.data.extendBoxid) {
              console.log("----------ture")
              console.log(newData)

              that.setData({
                extendBoxid: newData[0].age
              })
            }
            var number = that.data.extendBoxid;
            console.log(number)
            that.boxChangeWidth(number, "310rpx");

          }

        }
      })
    }
    setTimeout(function() {
      that.setData({
        updateFlag: true
      })

    }, 5000)
  },
  clean_input: function(event) {
    this.setData({
      input_text: "",
      xxflag: false,
      tuibuData: this.data.temp_tuibuData,
      lock_flag: true
    })
    console.log(this.data.tuibuData);
  },
  bindinputTap: function(event) {
    var lifeUrl = app.globalData.g_lifeUrl;
    var text = event.detail.value;


    if (text != "") {
      console.log(this.data.tuibuData)
      if (this.data.lock_flag) {
        this.setData({
          temp_tuibuData: this.data.tuibuData
        })

      }
      console.log(this.data.temp_tuibuData)
      this.setData({
        xxflag: true,
        input_text: text,
        lock_flag: false
      })


      var that = this;
      wx.request({
        url: lifeUrl + '/getTuibuMsg?age=' + text + '&count=2',
        success(res) {
          console.log(res);
          var data = [];
          for (var i = 0; i < res.data.data.length; i++) {
            var temp = res.data.data[i];
            var mtext = temp.tuibuMsg;
            if (temp.tuibuMsg.length > 15) {
              mtext = temp.tuibuMsg.substring(0, 15) + '...'
            }
            data.push({
              bid: temp.bid,
              lifeID: temp.lifeID,
              avatarUrl: temp.avatarUrl,
              text: mtext
            })
          }
          var tuibuData = [{
            age: text,
            tuibuMsg: data,
            boxHeight: "0rpx"
          }]
          that.setData({
            tuibuData: tuibuData
          })
          setTimeout(function() {
            that.boxChangeWidth(that.data.tuibuData[0].age, "310rpx");
          }, 1000)

        }
      })

    }
  },







  boxChangeWidth: function(number, height) {
    console.log(number)
    console.log(height)
    var tuibuData = this.data.tuibuData;
    for (var r in tuibuData) {
      if (number == tuibuData[r].age) {
        console.log(true)
        tuibuData[r].boxHeight = height;
        this.setData({
          extendBoxid: number
        })
      } else {
        tuibuData[r].boxHeight = "0rpx";
        console.log(false)
      }
    }

    this.setData({
      tuibuData: tuibuData
    })






  },
  showLongMsg: function(event) {
    var that = this;
    console.log(event);
    var bid = event.currentTarget.dataset.bid;
    var lifeID = event.currentTarget.dataset.lifeid;
    console.log(lifeID)
    console.log(bid)
    wx.navigateTo({
      url: '../longMsgPage/longMsgPage?lifeID=' + lifeID + '&bid=' + bid
    })



  },
  showMoreMsg: function(event) {
    var age = event.currentTarget.dataset.age;
    console.log(event.currentTarget.dataset);
    wx.navigateTo({
      url: '../moreLifeMsg/moreLifeMsg?age=' + age,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log('onReady')
    var that = this;


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log("onShow")
    var lifeUrl = app.globalData.g_lifeUrl;
    var that = this;
    that.setData({
      showcount: 5
    })
    that.updateTabdata();



  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    var that = this;
    var age = "";
    console.log(that.data.tuibuData);
    var data = that.data.tuibuData;
    console.log(that.data.tuibuData.length);
    for (var i = 0; i < data.length; i++) {

      if (data[i].boxHeight == "310rpx") {
        that.setData({
          extendBoxid: data[i].age
        })
      }
    }
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