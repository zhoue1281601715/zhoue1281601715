// packageC/orderList/index.js
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
    deliList:{},
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('123:',options);
    wx.showLoading({
      title: '加载中',
    })
    const that = this
    let id = options.id
    that.setData({
      id:options.id
    })
    app.https({
      config:{
        url:'xcx/yuyue/view',
        data:{
          id
        }
      }
    }).then(res=>{
      if(res.data.code==200){
        that.setData({
          deliList:res.data.data
        })
        wx.hideLoading()
      }      
    })
  },
  starttask:function(){
  wx.navigateTo({
    url: '/packageC/confirmTask/index?plate='+this.data.deliList.plate+'&id='+this.data.id,
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