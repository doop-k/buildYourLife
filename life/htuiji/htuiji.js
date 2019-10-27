// life/htuiji/htuiji.js
var app = getApp();
var utils=require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    h_lifeID: '',
    start: 0,
    count: 10,
    s_lifeID: '',
    nickName: '',
    topright_flag: '',
    htuiji_title: '',
    search_flag:'',
    isSelf:'',
    pri:'',
    pri_arr:'',
    tuijiData:{},
    dataChangeFlag:false,
    xxflag:false,
    input_text:"",
    temp_tuijiData:{},
    isFlushFlag:true,
    color:'',
    scrollHeight:""



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var userDataInfo = wx.getStorageSync("userDataInfo");

   var  h_lifeID=options.lifeID;
    var s_lifeID=userDataInfo.lifeID;
    var color =app.globalData.g_item_color;
    var complementaryColor = app.globalData.g_complementary_color;
    var isSelf=1;
    var topright_flag=true;
    var search_flag=true;
    var htuiji_title='你写下的是美好'
    var screenHeight = app.globalData.screenHeight;
    var scrollHeight = (screenHeight * 2 - 178) + 'rpx'
    if (screenHeight >= 800) {
      scrollHeight = (screenHeight * 2 - 278) + 'rpx'
    }
    if (h_lifeID != s_lifeID){
      isSelf=0;
      topright_flag=false;
      search_flag=false;
      htuiji_title=options.nickName;

    }
    this.setData({
      complementaryColor: complementaryColor,
      h_lifeID: h_lifeID,
      s_lifeID: s_lifeID,
      scrollHeight: scrollHeight,
      isSelf: isSelf,
      search_flag: search_flag,
      topright_flag: topright_flag,
      htuiji_title: htuiji_title,
      color: color
    })
    console.log(options.lifeID)
 
    this.requestData();
  },
  backto: function() {
    wx.navigateBack();
  },
  onScrolltolower: function() {
    console.log("滚动")
    if (this.data.isFlushFlag){
    this.setData({dataChangeFlag: true});

    this.requestData();
    }

  },
  requestData: function() {
    wx.showNavigationBarLoading();
    console.log("processData")
    var that = this;
    var tuijiUrl = app.globalData.g_lifeUrl;
    wx.request({
      url: tuijiUrl + '/getTuijiMsg?lifeID=' + that.data.h_lifeID + '&start=' + that.data.start + '&count=' + that.data.count + '&isVisible=' + that.data.isSelf,
      success(res) {
        console.log(res);
        var odata=res.data.data;
        
        var data = that.processData(odata);
        console.log(data);
        var temp_data = that.data.tuijiData;
        if (that.data.dataChangeFlag){
          that.setData({ dataChangeFlag: false });
          that.setData({
            tuijiData: data,
            temp_tuijiData: data
          })
        }else{
          that.setData({
            tuijiData: data,
            temp_tuijiData: data
          })
        }
      
        that.data.count+=5;
        console.log(that.data.tuijiData)
      }
    })




  },
  processData:function(odata){
    var data = [];
    for (var i = 0; i < odata.length; i++) {
      var temp_data = odata[i];
  
      data.push({
        title: temp_data.title,
        content: temp_data.content,
        signature: temp_data.signature,
        time: utils.splitTime(temp_data.time)  ,
        whosee: parseInt(temp_data.isVisible),
        jid: temp_data.jid
      })
    }
    return data;
  },
  bindPickerChange:function(event){

  },
  changeVisible:function(event){
    var tuijiUrl = app.globalData.g_lifeUrl ;
    var jid = event.currentTarget.dataset.jid;
    var isVisible=event.detail.value ? 1:0;
    var that=this;
    wx.request({
      url: tuijiUrl + '/changeVisible?lifeID=' + that.data.h_lifeID + '&jid=' + jid + '&isVisible=' + isVisible,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  
  bindinputTap:function(event){
    var tuijiUrl = app.globalData.g_lifeUrl ;
    var that =this;
    var text = event.detail.value
    var flag=false;
    if(text!=""){
      flag=true;
    }
    console.log(that.data.tuijiData);
    that.setData({
      xxflag: flag,
      input_text: text,
      isFlushFlag:false
    })
    console.log(that.data.temp_tuijiData);
    wx.request({
      url: tuijiUrl+'/searchData?lifeID='+that.data.s_lifeID+'&liketitle='+text,
      success(res){
        console.log(res.data.data);
        var odata = res.data.data;
        
       var data= that.processData(odata);
        that.setData({
          tuijiData: data
        })
       
      }
    })

  },
  backpage: function (event) {
    wx.navigateBack();
  },
  clean_input:function(event){
    console.log(this.data.temp_tuijiData);
    this.setData({
      xxflag: false,
      input_text: "",
      tuijiData:this.data.temp_tuijiData,
      isFlushFlag: true
    })
    console.log(this.data.tuijiData)
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
  onPullDownRefresh: function() {},

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