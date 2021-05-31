// packageC/confirmTask/index.js
const { $Toast, $Message } = require('../../utils/iview/base/index');
import Tools from '../../utils/modules/Tools';
import Config from '../../config';
import utils from '../../utils/utils';
// const { $Toast, $Message } = require('../../utils/iview/base/')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    plate:'',
    goodObj:{},
    lat2:'',
    lng2:'',
    distb:false,
    distance:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
     console.log(options);
     const that =this
     let plate=options.plate
     let id = options.id
     that.setData({
       plate:options.plate
     })
     console.log('plate',plate);
     
     app.https({
         config:{
           url:'xcx/bill/update_baodao',
           data:{
              plate
           },
         }
     }).then(res=>{
       console.log(res);
       wx.hideLoading()
       
     })
     this.getGoodComm(id)
     this.warehouseComm(plate)
     this.driverjw()

  },


  //  获取货源信息
  getGoodComm(id){
   app.https({
     config:{
       url:'xcx/yuyue/view',
       data:{
         id
       }
     }
   }).then(res=>{
      if(res.data.code==200){
        this.setData({
          goodObj:res.data.data
        })
      }
     console.log(this.data.goodObj);
     this.getObjective(this.data.goodObj)
   })
  },
  // 是否显示仓库信息
  warehouseComm:function(plate){
    app.https({
      config:{
        url:'xcx/bill/list_baodao',
        data:{
          plate
        }
      }
    }).then(res=>{
      console.log(res.data.data);
      
      if(res.data.code==200){
        this.setData({
          goodComm:res.data.data
        })
      }
      console.log(res.data.code);
      console.log(res,'123');
      
    })
  },
  // 获取司机经纬度
  driverjw(){
    var that = this;
    // 以北京故宫为例计算当前位置到其的距离，北京故宫坐标（116.403802, 39.915405）
    wx.getLocation({
      type: 'gcj02',
      altitude:true,
      isHighAccuracy:true,
      success: function (res) {
        console.log("当前坐标信息：", res)
        console.log('res.latitude维度',res.latitude);
        console.log('res.longitude经度',res.longitude);
        
        var distance1 = that.getDistance(res.latitude, res.longitude,that.data.lat2,that.data.lng2);
        that.setData({
          distance:distance1
        })
        if(distance1<50){
          that.setData({
            distb:true
          })
        }
        console.log(that.data.distance,'---123');
        
      }
    })
  },
   // 计算距离函数
   Rad(d) { 
    //根据经纬度判断距离
    return d * Math.PI / 180.0;
  },
  getDistance: function(lat1, lng1, lat2, lng2) {
    var radLat1 = this.Rad(lat1);
    var radLat2 = this.Rad(lat2);
    var a = radLat1 - radLat2;
    var b = this.Rad(lng1) - this.Rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10;

    console.log('经纬度计算的距离:' + s)
    return s
  },
  getObjective(goodObj){
    console.log(goodObj);
    
    let name = goodObj.warehouse_name
    console.log('this.data.goodObj.warehouse_name;',goodObj.warehouse_name);
    
    app.http({
      config:{
        url:'api/v1/location',
        data:{
          name
        },
        method:'POST',
      },
      isAuth: true
    }).then(res=>{
      if (res.data.statusCode==200) {
        this.setData({
           lat2:res.data.data.lat,
           lng2:res.data.data.lng
        })
       
      }
      console.log(res,'res123');
      console.log(res.data.data.lat);//latitude维度
      console.log(res.data.data.lng);//longitude经度
     
      
    })
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