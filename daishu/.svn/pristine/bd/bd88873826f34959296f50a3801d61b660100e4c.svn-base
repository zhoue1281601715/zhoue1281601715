const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modal : {
			tips : '提示',
			message : '模态框说明',
			ok : 'modalOk',
			cancel : 'modalCancel',
			ishide : true
    },
    addressList: '', // 地址列表
  },

  /**
   * 获取地址列表
   */
  getAddressList () {
    const that = this
    const token = wx.getStorageSync('token')
    app.http({
      config: {
        url: 'api/v1/list_address',
        data: {
          token
        },
        method: 'POST'
      },
      isAuth: true
    }).then(res => {
      console.log(res, 'addressListRes')
      const addressList = res.data.data.data
      that.setData({
        addressList
      })
    }).catch(err => {
      console.log(err, 'addressListErr')
    })
  },

  handleGetBack (e) {
    const address_id = e.currentTarget.dataset.address_id
    let pages = getCurrentPages() //当前页面
    let prevPage = pages[pages.length-2] //上一页面
    prevPage.setData({ //直接给上移页面赋值
      address_id
    })
    wx.navigateBack({ //返回
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    const _options = options
    console.log('options', _options)
    const that = this
    that.getAddressList()
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