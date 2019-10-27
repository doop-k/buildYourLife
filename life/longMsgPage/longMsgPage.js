// life/longMsgPage/longMsgPage.js
var app = getApp();
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lifeID: "",
    bid: "",
    tuibuData: {},
    nickName: "",
    s_userDataInfo: {},
    color: "",
    leaveMsgValue: "",
    start: 0,
    count: 5,
    leaveCount: '',
    isupdateleaveMsg: false,
    leaveMsgData: {},
    boxleft: "",
    lockflag: true,
    scrollHeight: '',
    likelock: false,
    likeanimation: null,
    timeoutlikeflag: true

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var color = app.globalData.g_item_color;
    var gradientColor = app.globalData.g_gradientColor;
    var lifeUrl = app.globalData.g_lifeUrl;
    var that = this;
    var userDataInfo = wx.getStorageSync("userDataInfo");
    var screenHeight = app.globalData.screenHeight;
    var scrollHeight = (screenHeight * 2 - 354) + 'rpx';
    if (screenHeight >= 800) {
      scrollHeight = (screenHeight * 2 - 454) + 'rpx';
    }
    console.log(screenHeight)
    console.log(scrollHeight);
    that.setData({
      scrollHeight: scrollHeight
    })
    if (!userDataInfo) {
      userDataInfo = {}
    }
    that.setData({
      lifeID: options.lifeID,
      bid: options.bid,
      s_userDataInfo: userDataInfo,
      color: color,
      gradientColor
    })
    wx.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: color
    })
    that.updateTable();
    wx.request({
      url: lifeUrl + '/getLeaveMsg?bid=' + that.data.bid + '&start=' + that.data.start + '&count=' + that.data.count,
      success(res) {
        console.log(res)
        if (res.data.data != "none") {
          var data = res.data.data;
          that.processLeaveMsg(data)

        }
      }
    })
    wx.setNavigationBarTitle({
      title: '推布详情',
    })
  },
  updateTable: function() {
    var lifeUrl = app.globalData.g_lifeUrl;
    var that = this;
    wx.request({
      url: lifeUrl + '/getTuibuMsg?bid=' + that.data.bid + '&lifeID=' + that.data.s_userDataInfo.lifeID,
      success(res) {
        console.log(res)
        if (res.data.data != "none") {
          var tuibuData = that.processData(res.data.data);
          that.setData({
            tuibuData: tuibuData
          })
        }
        console.log(that.data.tuibuData);
      }
    })
  },
  processData: function(data) {
    var lifeID = data.lifeID;
    var isSelf = false;
    if (this.data.s_userDataInfo.lifeID == lifeID) {
      isSelf = true;
    }
    var newData = {
      isLike: data.isLike,
      isSelf: isSelf,
      bid: data.bid,
      nickName: data.nickName,
      tuibuLike: data.tuibuLike,
      avatarUrl: data.avatarUrl,
      lifeID: lifeID,
      tuibuMsg: data.tuibuMsg,
      time: utils.splitTime(data.tuibuMsgDate),
      leaveMsg: data.leaveMsg,
      isCollected: data.isCollected,
      leaveMsg: data.leaveMsg
    }
    this.setData({
      leaveCount: newData.leaveMsg
    })
    return newData;
  },
  processLeaveMsg: function(data) {
    console.log("processLeaveMsg")
    console.log(data);
    var that = this;
    console.log(that.data.isupdateleaveMsg);
    var leaveMsgData = [];
    for (var i = 0; i < data.length; i++) {
      var canDel = false;
      var temp_data = data[i];
      if ((temp_data.lifeID == that.data.s_userDataInfo.lifeID) | (that.data.tuibuData.lifeID == that.data.s_userDataInfo.lifeID)) {
        canDel = true
      }
      leaveMsgData.push({
        leaveId: temp_data.leaveId,
        bid: temp_data.bid,
        lifeID: temp_data.lifeID,
        avatarUrl: temp_data.avatarUrl,
        leaveMsg: temp_data.leaveMsg,
        time: utils.splitTime(temp_data.time),
        canDel: canDel
      })
    }
    if (that.data.isupdateleaveMsg) {
      leaveMsgData = that.data.leaveMsgData.concat(leaveMsgData);
      that.setData({
        isupdateleaveMsg: false
      })

    }
    console.log("leaveMsgData");
    console.log(leaveMsgData);
    that.setData({
      leaveMsgData: leaveMsgData
    })
    console.log(that.data.isupdateleaveMsg);
    that.data.start += 5;
    console.log(that.data.start)
  },

  updateLeaveMsg: function() {
    var lifeUrl = app.globalData.g_lifeUrl;
    var that = this;
    that.updateTable();
    that.setData({
      isupdateleaveMsg: true
    })
    wx.request({
      url: lifeUrl + '/getLeaveMsg?bid=' + that.data.bid + '&start=' + that.data.start + '&count=' + that.data.count,
      success(res) {
        console.log(res)
        if (res.data.data != "none") {
          var data = res.data.data;
          that.processLeaveMsg(data);

        }
      }
    })
  },
  rightdel: function(event) {
    var that = this;
    var lifeUrl = app.globalData.g_lifeUrl;
    var leaveId = event.currentTarget.dataset.leaveid;
    var bid = that.data.bid;
    var candelflag = false;
    that.likeSayDel();
    for (var i = 0; i < that.data.leaveMsgData.length; i++) {
      if (that.data.leaveMsgData[i].leaveId == leaveId) {
        candelflag = true;
        break;
      }
    }
    if (candelflag) {
      wx.showModal({
        title: '删除评论',
        content: '确认删除此评论吗？',
        success(res) {
          wx.showLoading({
            title: '删除中···',
          })
          if (res.confirm) {
            wx.request({
              url: lifeUrl + '/delleaveMsg?leaveId=' + leaveId + '&bid=' + bid,
              success(res) {
                if (res.data.data == "done") {
                  wx.hideLoading();
                  wx.showToast({
                    title: '删除成功',
                    icon: "none"
                  })
                  that.updateTable();
                  that.likeSayDel();
                } else {

                }

              }
            })
          } else {
            wx.hideLoading();
          }
        }
      })

    } else {
      wx.showToast({
        title: '已被删除',
        icon: 'none'
      })
    }

  },
  //中继废弃事件处理
  none: function() {
    console.log("none");
  },
  openleaveuser: function(event) {
    var that = this;
    var s_life = that.data.s_userDataInfo.lifeID;
    var lifeID = event.currentTarget.dataset.lifeid;
    if (s_life == lifeID) {
      wx.switchTab({
        url: '../me/mypage',
      })
    } else {

      wx.navigateTo({
        url: '../me/showUserPage/showUserPage?lifeID=' + lifeID,
      })


    }

  },
  delTuibu: function(event) {
    var lifeUrl = app.globalData.g_lifeUrl;
    var that = this;
    var bid = event.currentTarget.dataset.bid;
    wx.showModal({
      title: '扔掉推布',
      content: '确认扔掉您写下的这篇推布吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '扔掉中···',
          })
          wx.request({
            url: lifeUrl + '/delTuibuMsg?bid=' + bid,
            success(res) {
              if (res.data.data == 'done') {
                wx.hideLoading();
                wx.showToast({
                  title: '已扔掉',
                  icon: 'none'
                })
                wx.navigateBack();

              }
            }
          })
        }
      }
    })
  },
  liketuibuTap: function() {
    var lifeUrl = app.globalData.g_lifeUrl;
    var that = this;
    var odata = that.data.tuibuData;
    var bid = odata.bid;
    var lifeID = that.data.s_userDataInfo.lifeID;
    if (that.data.timeoutlikeflag) {
      that.setData({
        timeoutlikeflag: false
      })
      setTimeout(function() {
        that.setData({
          timeoutlikeflag: true
        })
      }, 1000)
      var animation = wx.createAnimation({});
      animation.scale(0.8, 0.8).step({
        duration: 100
      })
      animation.scale(1.2, 1.2).step({
        duration: 100
      })
      animation.scale(1, 1).step({
        duration: 100
      })
      this.setData({
        likeanimation: animation.export()
      })
      var reqflag = true;
      if (that.data.s_userDataInfo.lifeID) {
        if (odata.isLike) {
          reqflag = false
        }
        console.log(reqflag)
        wx.request({
          url: lifeUrl + '/updateLike?bid=' + bid + '&lifeID=' + lifeID + '&flag=' + reqflag + '&blifeID=' + that.data.tuibuData.lifeID,
          success(res) {
            console.log(res);
            if (res.data.data == 'done') {
              // that.updateTable();
              // that.likeSayDel();
              if (reqflag) {
                odata.tuibuLike = odata.tuibuLike += 1;
              } else {
                odata.tuibuLike = odata.tuibuLike -= 1;
              }
              odata.isLike = reqflag
              that.setData({
                tuibuData: odata
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
  //点赞、评论、删除评论 对评论的处理函数
  likeSayDel: function(event) {
    console.log(this.data.isupdateleaveMsg);
    var lifeUrl = app.globalData.g_lifeUrl;
    var that = this;
    var start = that.data.start;
    console.log(start);
    if (start == 0) {
      start = 5;
    } else {
      that.data.start -= 5;
    }
    console.log(start);
    wx.request({
      url: lifeUrl + '/getLeaveMsg?bid=' + that.data.bid + '&start=0&count=' + start,
      success(res) {
        console.log(res);
        that.setData({
          leaveMsgData: {},
          isupdateleaveMsg: false
        })
        if (res.data.data != 'none') {
          that.processLeaveMsg(res.data.data);
        }
      }
    })
  },
  collectedTuibu: function(evnet) {
    var lifeUrl = app.globalData.g_lifeUrl;
    var that = this;
    var odata = that.data.tuibuData;
    var bid = odata.bid;
    var lifeID = that.data.s_userDataInfo.lifeID;
    var reqflag = true;
    if (that.data.s_userDataInfo.lifeID) {
      if (odata.isCollected) {
        reqflag = false
      }


      console.log(reqflag)
      wx.request({
        url: lifeUrl + '/collected?bid=' + bid + '&lifeID=' + lifeID + '&flag=' + reqflag,
        success(res) {
          console.log(res);
          if (res.data.data == 'done') {
            odata.isCollected = reqflag;
            that.setData({
              tuibuData: odata
            })
            if (reqflag == true) {
              wx.showToast({
                title: '收藏成功',
              })
            }
          }

        }
      })
    } else {
      wx.showModal({
        title: '收藏推布',
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
  },
  leaveMsgTap: function() {

    var that = this;
    var lifeUrl = app.globalData.g_lifeUrl;
    var text = that.data.leaveMsgValue;
    var lifeID = that.data.s_userDataInfo.lifeID;
    var time = utils.formatTime(new Date());
    var bid = that.data.bid;
    if (text != "") {
      if (that.data.s_userDataInfo.lifeID) {
        wx.showLoading({
          title: '留言中······',
        })
        wx.request({
          method: 'post',
          url: lifeUrl + '/postLeaveMsg?bid=' + bid + '&lifeID=' + lifeID + '&leaveMsg=' + text + '&time=' + time + '&blifeID=' + that.data.tuibuData.lifeID,
          success(res) {
            console.log(res);
            if (res.data.data == "done") {
              that.setData({
                leaveMsgValue: ""
              })
              that.updateTable();
              that.likeSayDel();
              wx.hideLoading();
            }
          }
        })
      } else {
        wx.showModal({
          title: '留言',
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
    } else {
      wx.showToast({
        title: '您什么都还没写呢。',
        icon: "none"
      })
    }
    console.log()
  },
  leaveMsginput: function(event) {
    var text = event.detail.value;
    this.setData({
      leaveMsgValue: text
    })

  },
  showUserPage: function(event) {
    var that = this;
    var data = that.data.tuibuData;
    var lifeID = data.lifeID;
    if (that.data.s_userDataInfo.lifeID == lifeID) {
      wx.switchTab({
        url: '../me/mypage',
      })
    } else {
      console.log("去用户页面")

      wx.navigateTo({
        url: '../me/showUserPage/showUserPage?lifeID=' + that.data.lifeID,
      })


    }

  },
  backpage: function() {
    wx.navigateBack();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
    this.updateTable();
    this.likeSayDel();
    wx.stopPullDownRefresh();
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