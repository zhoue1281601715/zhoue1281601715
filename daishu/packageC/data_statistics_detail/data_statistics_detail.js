// packageC/data_statistics_detail/data_statistics_detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 日期
    day: "",
    // 物流单详情列表
    order:[]
  },
  mixins: [app.togerther],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      day: options.day
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
    this.dayAchievementDetail()
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

  },
  // 每天详情
  // https://w2.kagaro.com/xcx/order/stat_day_detail
  dayAchievementDetail() {
    let self = this
    let currentUser = wx.getStorageSync("currentUserInfo")
    let parameter = {
      delivery_phone: currentUser.mobile,
      table_num: currentUser.table_num,
      day: this.data.day
    }
    app.request.post('/xcx/order/stat_day_detail', parameter).then(res => {
      self.setData({
        order:res
      })
    })
  }
})