var app = getApp();
const io = require("../../utils/weapp.socket.io.js");
// life/me/mypage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginSuccess: false,
    ageSetting: false,
    userDate: "2000-01-01",
    lifeID: null,
    userAge: "",
    avatarUrl: "",
    nickName: "",
    gender: "",
    cloth: [],
    color: "",
    height: "",
    colledCount: "",
    tuibuCount: ""

  },
  bindDateChange: function(event) {
    console.log(event)
    this.setData({
      userDate: event.detail.value
    })

  },
  opentuibu: function(event) {
    var lifeID = event.currentTarget.dataset.lifeid;
    wx.navigateTo({
      url: '../tuibu/tuibu?lifeID=' + lifeID + '&avatarUrl=' + this.data.avatarUrl + '&nickName=' + this.data.nickName,
    })
  },

  openjibu: function(event) {
    console.log(event.currentTarget.dataset.lifeid);
    wx.navigateTo({
      url: '../htuiji/htuiji?lifeID=' + this.data.lifeID,
    })
  },
  opencolled: function(event) {
    var lifeID = event.currentTarget.dataset.lifeid;
    console.log(lifeID)
    wx.navigateTo({
      url: './mycollected/mycollected?lifeID=' + lifeID,
    })
  },
  acceptAgeTap: function() {
    var lifeUrl = app.globalData.g_lifeUrl;
    var that = this;
    wx.showModal({
      title: '一 生',
      content: '小程序一但设置年龄，将无法对其进行更改，确保输入了正确的出生日期。您设置的出生日期为：' + that.data.userDate,
      success(res) {
        if (res.confirm) {
          that.setData({
            ageSetting: false
          })
          wx.request({
            method: 'POST',
            url: lifeUrl + '/postUserAge?lifeID=' + that.data.lifeID + '&userDate=' + that.data.userDate,
            success(res) {
              console.log(res);
              if (res.data.data != 'none') {
                that.setData({
                  userAge: res.data.data
                })
                var ouserDataInfo = wx.getStorageSync("userDataInfo");
                var nuserDataInfo = {
                  nickName: ouserDataInfo.nickName,
                  avatarUrl: ouserDataInfo.avatarUrl,
                  lifeID: that.data.lifeID,
                  gender: ouserDataInfo.gender,
                  age: res.data.data
                }


                wx.setStorage({
                  key: 'userDataInfo',
                  data: nuserDataInfo,
                });
              }


            }
          })

        }
      }
    })
  },

  sayMsgTap: function() {
    console.log("sayMsgTap")
    var that = this;
    if (that.data.userAge) {
      var tempStation = {
        lifeID: that.data.lifeID,
        nickName: that.data.nickName,
        avatarUrl: that.data.avatarUrl,
        age: that.data.userAge,
        gender: that.data.gender
      }
      wx.setStorage({
        key: "tempStation",
        data: tempStation,
      })
      wx.navigateTo({
        url: './published/published?tempStation=' + "tempStation"
      })
    } else {
      that.settingAge();
    }

  },
  saytuiji: function(event) {
    console.log(this.data.userAge)
    if (this.data.userAge) {
      wx.navigateTo({
        url: '../tuiji/tuiji',
      })
    } else {
      this.settingAge();
    }

  },
  settingAge() {
    var that = this;
    wx.showModal({
      title: '提 示',
      content: '您还未设置年龄，是否跳转到年龄填写页',
      success(res) {
        if (res.confirm) {
          that.setData({
            ageSetting: true
          })
        }
      }
    })


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var lifeUrl = app.globalData.g_lifeUrl;
    that.setData({
      color: app.globalData.g_item_color
    })
    var userDataInfo = wx.getStorageSync("userDataInfo");
    var offline_text = app.globalData.g_offline_text;
    var screenHeight = app.globalData.screenHeight;
    var height = screenHeight * 2 + 'rpx'
    that.setData({
      height: height,
      offline_text: offline_text
    })

    if (userDataInfo) {
      console.log(userDataInfo);
      this.setData({
        loginSuccess: true,
        lifeID: userDataInfo.lifeID,
        avatarUrl: userDataInfo.avatarUrl,
        nickName: userDataInfo.nickName,
        gender: userDataInfo.gender,
        userAge: userDataInfo.userAge
      })

    }


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setData({
      conLineHeight: '940rpx'
    })
  },

  getUserInfoTap: function(event) {
    console.log(event);
    if (event.detail.userInfo) {
      this.wxlogin();
    } else {

    }
  },
  wxlogin: function() {
    var lifeUrl = app.globalData.g_lifeUrl;
    console.log("wxlogin")
    var that = this;
    wx.login({
      success(res) {
        if (res.code) {
          wx.request({
            url: lifeUrl + '/wx/onlogin',
            data: {
              code: res.code
            },
            success: function(res) {
              console.log(res)
              var socketUrl = 'wss://www.famyun.com/websocket';
              var socket = io(socketUrl)
              socket.on(res.data.lifeID, function(msg) {
                console.log('有消息')
                console.log(msg);
                wx.showTabBarRedDot({
                  index: 1,
                })
                var test = "有人点赞了你的推布"
                if (msg.data == 'leavemsg')
                  test = '有人评论了你的推布'
                wx.showToast({
                  title: test,
                  icon: 'none'
                })
              })
              that.setData({
                lifeID: res.data.lifeID,
                loginSuccess: true,
              })
              wx.request({
                url: lifeUrl + '/getLifeUserInfo?lifeID=' + res.data.lifeID,
                success(res) {
                  console.log(res);
                  if (res.data.data != "none") {
                    var data = res.data.data;
                    var lifeID = data.lifeID;
                    var age = data.age;
                    var nickName = data.nickName;
                    var avatarUrl = data.avatarUrl;
                    var gender = data.gender;
                    //发起websocket请求
                    wx.getUserInfo({
                      success(res) {
                        var userinfogender;
                        switch (res.userInfo.gender) {
                          case 0:
                            userinfogender = '未设置';
                            break;
                          case 1:
                            userinfogender = '男';
                            break;
                          case 2:
                            userinfogender = '女';
                            break;
                        }
                        console.log(res);

                        if (res.userInfo.avatarUrl != data.avatarUrl | res.userInfo.nickName != data.nickName | userinfogender != data.gender) {
                          wx.request({
                            url: lifeUrl + '/changeUserData?lifeID=' + userDataInfo.lifeID + '&nickName=' + res.userInfo.nickName + '&avatarUrl=' + res.userInfo.avatarUrl + '&gender=' + userinfogender,
                            success(res) {

                              var data = res.data.data;
                              age = data.age;
                              nickName = data.nickName;
                              avatarUrl = data.avatarUrl;
                              gender = data.gender;
                            }
                          })
                        }
                      }

                    })
                    that.setData({
                      userAge: age,
                      nickName: nickName,
                      gender: gender,
                      avatarUrl: avatarUrl,
                      lifeID: lifeID
                    })
                    var userDataInfo = {
                      userAge: age,
                      nickName: nickName,
                      gender: gender,
                      avatarUrl: avatarUrl,
                      lifeID: lifeID
                    }
                    wx.setStorage({
                      key: 'userDataInfo',
                      data: userDataInfo,
                    });
                  } else {
                    console.log(false)
                    that.getUserInfo();
                  }
                }
              })

            },
            fail: function(res) {
              console.log('请求错误');
              console.log(res);
            }
          })
        } else {
          console.log('登陆失败！' + res.errMsg);

        }
      }
    });
  },
  getUserInfo: function() {
    var lifeUrl = app.globalData.g_lifeUrl;
    console.log(lifeUrl)
    console.log("getUserInfo")
    var userDataInfo = {};
    var that = this;
    wx.getUserInfo({
      success(res) {
        var gender;
        console.log(res.userInfo.gender);
        switch (res.userInfo.gender) {
          case 0:
            gender = '未设置';
            break;
          case 1:
            gender = '男';
            break;
          case 2:
            gender = '女';
            break;

        }
        userDataInfo = {
            nickName: res.userInfo.nickName,
            avatarUrl: res.userInfo.avatarUrl,
            lifeID: that.data.lifeID,
            gender: gender,
            country: res.userInfo.country,
            province: res.userInfo.province,
            city: res.userInfo.city
          },
          console.log(userDataInfo);
        that.setData({
          lifeID: userDataInfo.lifeID,
          avatarUrl: userDataInfo.avatarUrl,
          nickName: userDataInfo.nickName,
          gender: userDataInfo.gender
        })
        wx.setStorage({
          key: 'userDataInfo',
          data: userDataInfo,
        });
        console.log("wx.request")
        wx.request({
          method: 'POST',
          url: lifeUrl + '/postUserInfoData?lifeID=' + that.data.lifeID + '&nickName=' + that.data.nickName + '&avatarUrl=' + that.data.avatarUrl + '&gender=' + that.data.gender + '&country=' + that.data.country + '&province=' + that.data.province + '&city=' + that.data.city,
          success(res) {
            console.log(res);
            if (res.data.data == "done") {
              console.log("done");
              that.setData({
                ageSetting: true
              })
            }

          }
        })

      }
    })

  },
  cannelAgeTap: function(event) {
    this.setData({
      ageSetting: false
    })

  },
  openSetting: function() {
    wx.navigateTo({
      url: './setting/setting?lifeID=' + this.data.lifeID,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    var lifeUrl = app.globalData.g_lifeUrl;
    wx.request({
      url: lifeUrl + '/getLifeUserInfo?lifeID=' + that.data.lifeID,
      success(res) {
        if (res.data.data !== 'none') {
          console.log(res)
          that.setData({
            colledCount: res.data.data.colledCount,
            tuibuCount: res.data.data.tuibuCount
          })
        }
      },
      fail(res){
        wx.showToast({
          title: that.data.offline_text,
          icon:'none'
        })
      }
    })
  },
  previewImage: function(event) {
    console.log('s')
    wx.previewImage({
      urls: [this.data.avatarUrl],
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log("onHide")
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