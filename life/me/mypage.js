var app = getApp();
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
    color: ""

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
  opencolled:function(event){
    var lifeID=event.currentTarget.dataset.lifeid;
    console.log(lifeID)
    wx.navigateTo({
      url: './mycollected/mycollected?lifeID='+lifeID,
    })
  },
  acceptAgeTap: function() {
    var lifeUrl = app.globalData.g_lifeUrl;
    var that = this;
    wx.showModal({
      title: '提 示',
      content: '小程序一但设置年龄，将无法对其进行更改，确保输入了正确的出生日期。您设置的出生日期：' + that.data.userDate,
      success(res) {
        if (res.confirm) {
          that.setData({
            ageSetting: false
          })
          var data = that.data;
          console.log(that.data.lifeID);
          wx.request({
            method: 'POST',
            url: lifeUrl + '/postUserInfoData?lifeID=' + that.data.lifeID + '&nickName=' + that.data.nickName + '&userDate=' + that.data.userDate + '&avatarUrl=' + that.data.avatarUrl + '&gender=' + that.data.gender,
            success(res) {
              console.log(res);
              if(res.data.data!='none'){
                that.setData({
                  userAge:res.data.data
                  })
                var ouserDataInfo=wx.getStorageSync("userDataInfo");
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
      })}
        else {
          that.settingAge();
        }

  },
  saytuiji: function(event) {
    console.log(this.data.userAge)
    if (this.data.userAge) {
    wx.navigateTo({
      url: '../tuiji/tuiji',
    })}else{
      this.settingAge();
    }

  },
  settingAge() {
    var that = this;
    wx.showModal({
      title: '提 示',
      content: '您还为设置年龄，是否跳转到年龄填写页',
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
    if (options.ageSetting){
      that.setData({
        ageSetting: options.ageSetting
      })
    }
    // if (!this.data.loginSuccess){
    //   wx.getSetting({
    //     success(res){
    //       res.authSetting={
    //         "scope.userInfo": false
    //       }
    //     }
    //   })
    // }
    
    var userDataInfo = wx.getStorageSync("userDataInfo");
    if (userDataInfo) {
      console.log(userDataInfo);
      this.setData({
        loginSuccess: true,
        lifeID: userDataInfo.lifeID,
        avatarUrl: userDataInfo.avatarUrl,
        nickName: userDataInfo.nickName,
        gender: userDataInfo.gender,
        userAge: userDataInfo.age
      })
    }
  

  },
  clothAgeTap: function(event) {
    console.log(event.currentTarget.dataset.age);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setData({
      conLineHeight: '940rpx'
    })
  },
  loginLife: function() {
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
              that.setData({
                lifeID: res.data.lifeID,
                loginSuccess: true,
              })
              wx.request({
                url: lifeUrl + '/getLifeUserInfo?lifeID=' + res.data.lifeID,
                success(res){
                  if(res.data.data!="none"){
                    var data=res.data.data;
                    that.setData({
                      userAge: data.userAge,
                      nickName:data.nickName,
                      gender:data.gender,
                      avatarUrl:data.avatarUrl,
                      lifeID:data.lifeID
                    })
                  }else{
                    if (!that.data.userAge) {
                      that.setData({
                        ageSetting: true
                      })
                    }
                  }
                }
              })
              that.getUserInfo();
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
            gender: gender
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

      }
    })

  },
  cannelAgeTap: function(event) {
    this.setData({

      ageSetting: false
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // var that = this;
    // var lifeUrl = app.globalData.g_lifeUrl;
    // console.log("onShow")
    // wx.request({
    //   url: lifeUrl + '/getLifeUserInfo?lifeID=' + that.data.lifeID,
    //   success(res) {
    //     console.log(res);
    //     if (res.data.data != "none") {
    //       console.log("res.data!=none")
    //       var cloth = res.data.data.cloth;
    //       console.log("cloth---------:")
    //       console.log(cloth);
    //       if (cloth[0]) {
    //         console.log("cloth[0] != null")
    //         that.setData({
    //           cloth: cloth
    //         })
    //       }
    //     }


    //   }
    // })
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