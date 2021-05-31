const { $Toast, $Message } = require('../../utils/iview/base/index');
import Tools from '../../utils/modules/Tools';
import Config from '../../config';
import utils from '../../utils/utils';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile:'',
    kehuData:[],
    edit:true,
    indexs:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    const that = this
    let mobile=wx.getStorageSync('mobile')
    console.log(that.data.mobile,":5646");
    app.https({
      config:({
        url: 'xcx/yuyue/list_customer',
				data: {
				  mobile
				},
      })
    }).then((res)=>{
      console.log(res);
      if(res.data.code==200){
        that.setData({
          kehuData:res.data.data
        })
        console.log(res.data.data,'123123123');
        
        wx.hideLoading()
      }
    })
    
  },
  // 编辑保存
  deitSave(e){  
   console.log(this.data.kehuData);
   
    this.setData({
      edit:!this.data.edit,
      indexs:e.currentTarget.dataset.index
    })
    console.log(this.data.edit);
     let plate=this.data.kehuData[e.currentTarget.dataset.index].plate
     let driver=this.data.kehuData[e.currentTarget.dataset.index].driver
     let phone=this.data.kehuData[e.currentTarget.dataset.index].phone
     let time=this.data.kehuData[e.currentTarget.dataset.index].time
     let rmark=this.data.kehuData[e.currentTarget.dataset.index].remark
     let id = this.data.kehuData[e.currentTarget.dataset.index].id

    if (this.data.edit) {
      app.https({
        config:{
          url:'xcx/yuyue/update',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data:{
            id,
            plate,
            driver,
            phone,
            time,
            rmark
          }
        }
      }).then(res=>{
        if(res.data.code==200){
          wx.showToast({
            title: '保存成功',
            icon: 'none',
            duration: 2000
          })
        }
        
      })
    }
  },
  driverInput(e){
    console.log(e.detail.value);
    const index= e.currentTarget.dataset.index;
    this.setData({
      ['kehuData['+index+'].driver']:e.detail.value
    })
    console.log(this.data.kehuData);
    
  },
  phoneInput(e){
    console.log(e.detail.value);
    const index= e.currentTarget.dataset.index;
    this.setData({
      ['kehuData['+index+'].phone']:e.detail.value
    })
    console.log(this.data.kehuData);
    
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