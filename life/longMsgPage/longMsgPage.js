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
    isupdateleaveMsg: false,
    leaveMsgData: {},
    boxleft:"",
    lockflag:true,
    scrollHeight:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var color = app.globalData.g_item_color;
    var lifeUrl = app.globalData.g_lifeUrl;
    var that = this;
    var userDataInfo = wx.getStorageSync("userDataInfo");
    var screenHeight = app.globalData.screenHeight;
    var scrollHeight = (screenHeight*2-354)+'rpx';
    if (screenHeight>=800){
      scrollHeight = (screenHeight * 2 - 454) + 'rpx';
    }
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
      color: color
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
        if(res.data.data!="none"){
        var tuibuData = that.processData(res.data.data);
        that.setData({
          tuibuData: tuibuData
        })
        }else{
          setTimeout({

          },5000)

          
        }
        console.log(that.data.tuibuData);
      }
    })
  },
  processData: function (data) {
    var lifeID = data.lifeID;
     var isSelf=false;
    if (this.data.s_userDataInfo.lifeID == lifeID){
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

    return newData;

  },
  processLeaveMsg: function(data) {
    var that = this;
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
    that.setData({
      leaveMsgData: leaveMsgData
    })
    that.data.start += 5;
  },
  updateLeaveMsg:function(){
    this.setData({
      isupdateleaveMsg: true
    })
    this.updateLeaveMsgData();
  },
  updateLeaveMsgData: function() {

    console.log('updateLeaveMsgData');
    var lifeUrl = app.globalData.g_lifeUrl;
    var that = this;
 
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
  },
  rightdel:function(event){
    var that=this;
    var lifeUrl = app.globalData.g_lifeUrl;
    var leaveId=event.currentTarget.dataset.leaveid;
    var bid=that.data.bid;
    wx.showModal({
      title: '删除评论',
      content: '确认删除此评论吗？',
      success(res){
        wx.showLoading({
          title: '删除中···',
        })
        if(res.confirm){
          wx.request({
            url: lifeUrl + '/delleaveMsg?leaveId=' + leaveId+'&bid='+bid,
            success(res){
              if(res.data.data=="done"){
                wx.hideLoading();
                wx.showToast({
                  title: '已删除',
                  icon:"none"
                })
                var leaveMsgData=that.data.leaveMsgData;
                  var newdata=[];
                for(var i=0;i<leaveMsgData.length;i++){
                  var temp_data=leaveMsgData[i]
                  if(temp_data.leaveId!=leaveId){
                    newData.push(temp_data)
                  }
                }
                that.updateTable();
                that.setData({
                  leaveMsgData: newdata
                })
              }

            }
          })
        }
      }
    })
  },
  //中继废弃事件处理
  none: function() {
    console.log("none");
  },
  openleaveuser:function(event){
    var that=this;
    var s_life = that.data.s_userDataInfo.lifeID;
    var lifeID=event.currentTarget.dataset.lifeid;
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
  delTuibu:function(event){
    var lifeUrl = app.globalData.g_lifeUrl;
    var that = this;
    var bid=event.currentTarget.dataset.bid;
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
    var reqflag = true;

    if (that.data.s_userDataInfo.lifeID){
    if (odata.isLike) {
      reqflag = false
    }
    console.log(reqflag)
    wx.request({
      url: lifeUrl + '/updateLike?bid=' + bid + '&lifeID=' + lifeID + '&flag=' + reqflag,
      success(res) {
        console.log(res);
        if (res.data.data == 'done') {
          odata.isLike = reqflag;
          that.setData({
            isupdateleaveMsg: true
          })
          that.updateTable();
          that.updateLeaveMsgData();
        }
      }
    })}else{
      wx.showModal({
        title: '点赞',
        content: '立即登陆', success(res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '../me/mypage'
            })
      
          }
        }
      })
    }
  },
  collectedTuibu:function(evnet){
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
            odata.isLike = reqflag;
            that.setData({
              isupdateleaveMsg: true
            })
            that.updateTable();
            that.updateLeaveMsgData();
          }
          
        }
      })
    } else {
      wx.showModal({
        title: '收藏推布',
        content: '立即登陆', success(res) {
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
        url: lifeUrl + '/postLeaveMsg?bid=' + bid + '&lifeID=' + lifeID + '&leaveMsg=' + text + '&time=' + time,
        success(res) {
          console.log(res);
          if (res.data.data == "done") {
            that.setData({
              leaveMsgValue: ""
            })
            var count = 0;
            for (var r in that.data.leaveMsgData){
                count++;
            }
            console.log(count);
            console.log(count)
            that.setData({
              start:count
            })
            console.log(that.data.start)
            that.updateTable();
            var flag=true
            if(count==0){
              flag=false
             
            }
            that.setData({
              isupdateleaveMsg: flag
            })
            that.updateLeaveMsgData();
            wx.hideLoading();
          }
        }
      })
      } else {
        wx.showModal({
          title: '留言',
          content: '立即登陆',
          success(res){
            if(res.confirm){
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
    that.setData({
      isupdateleaveMsg: true
    })
    this.updateLeaveMsgData();
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