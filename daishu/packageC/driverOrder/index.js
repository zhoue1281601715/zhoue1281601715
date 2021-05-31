// packageC/driverOrder/index.js
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
    sectionShow: 0, // 当前展示的区间的下标
    appointmentSection:['新订单','订单记录'],
    CustomBar: 0, // 自定义导航栏高度
    driverList:[],//司机订单
    id:'',//
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    const CustomBar = app.store.custom.CustomBar
		that.setData({
      CustomBar,

    })
    wx.showLoading({
      title: '加载中',
    })
    console.log('plate:',wx.getStorageSync('plate'));
    const plate=wx.getStorageSync('plate')
    console.log('plate:',plate);
    app.https({
      config:{
        url:"xcx/yuyue/list_driver",
        data:{
          plate
        }
      }
    }).then((res)=>{
      if(res.data.code==200){
        that.setData({
          driverList:res.data.data
        })
        console.log(that.data.driverList);
        wx.hideLoading()
      }
      
    })
  },
  handleChangeSection(e) {
    const that = this
    
    const index = e.currentTarget.dataset.index
    if (index === that.data.sectionShow) {
      return false
    } else {
      that.setData({
        sectionShow: index
      })
    }
  },
  detailedOrder(e){

    
   const id=  this.data.driverList[e.currentTarget.dataset.index].id
   
    wx.navigateTo({
      url: '/packageC/orderList/index?id='+id,
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