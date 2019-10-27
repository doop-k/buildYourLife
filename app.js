//app.js
const io = require("./utils/weapp.socket.io.js");
App({
  onLaunch: function() {
    console.log("onLunch")
    var socketUrl = 'wss://www.famyun.com/websocket';
    var lifeUrl = this.globalData.g_lifeUrl
    var res = wx.getSystemInfoSync();
    this.globalData.screenHeight = res.screenHeight
    var userDataInfo = wx.getStorageSync("userDataInfo");
    console.log('获取的缓存数据')
    console.log(userDataInfo);
    if (userDataInfo != "") {
      var socket = io(socketUrl)
      socket.on(userDataInfo.lifeID, function(msg) {
        console.log('有消息')
        console.log(msg);
        wx.showTabBarRedDot({
          index: 1,
        })
        var test = "有人点赞了你的推布"
        if (msg.data == 'leaveMsg')
          test = '有人评论了你的推布'
        wx.showToast({
          title: test,
          icon: 'none'
        })
      })
    }
    console.log('开始匹配数据')
    wx.getSetting({
      success(res) {
        console.log(res);
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success(res) {
              console.log('获取的数据')
              console.log(res)
              var gender;
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

              if (res.userInfo.avatarUrl != userDataInfo.avatarUrl | res.userInfo.nickName != userDataInfo.nickName | gender != userDataInfo.gender | userDataInfo.country!= res.userInfo.country | userDataInfo.province != res.userInfo.province| userDataInfo.city != res.userInfo.city) {
                console.log('数据不一样，即将更新数据')
                wx.request({
                  url: lifeUrl + '/changeUserData?lifeID=' + userDataInfo.lifeID + '&nickName=' + res.userInfo.nickName + '&avatarUrl=' + res.userInfo.avatarUrl + '&gender=' + gender + '&country=' + res.userInfo.country + '&province=' + res.userInfo.province + '&city=' + res.userInfo.city,
                  success(res) {
                    console.log('更新完毕')
                    console.log(res)
                    var data = res.data.data;
                    var userDataInfo = {
                      userAge: data.age,
                      nickName: data.nickName,
                      gender: data.gender,
                      avatarUrl: data.avatarUrl,
                      lifeID: data.lifeID
                    }
                    wx.setStorage({
                      key: 'userDataInfo',
                      data: userDataInfo,
                    });
                  }
                })
              }
            }
          })
        }


      }
    })



    // var socktask=wx.connectSocket({
    //   url: lifeUrl,

    // })
    // console.log(socktask)
    // socktask.onMessage(function(res){
    //   console.log('来消息了')
    //   console.log(res);
    // })

    // wx.onSocketMessage(function(res){
    //   console.log(res);
    //   wx.showTabBarRedDot({
    //     index: 1,
    //   })
    //   var test="有人点赞了你的推布"
    //   if(res.data=='leaveMsg')
    //   test='有人评论了你的推布'
    //   wx.showToast({
    //     title: test,
    //     icon:'none'
    //   })
    // })




  },
  globalData: {
    userInfo: null,
    g_lifeUrl: 'https://www.famyun.com/inwx',
    g_likefont: '人赞',
    g_agefont: '岁',
    g_offline_text: '网络超时~请检查网络重试~',
    g_item_color: '#00a8ff',
    g_complementary_color: '#ebdc2f',
    g_gradientColor: "#00d9ff",
    screenHeight: ''
  }
})