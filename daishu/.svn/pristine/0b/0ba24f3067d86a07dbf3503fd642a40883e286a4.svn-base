// packageC/delivery_goods/delivery_goods.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 送货收款
    collectionList: [],
    show: false,
    // 拨打电话的列表
    phoneList: []
  },
  mixins: [app.togerther],
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
  onShow: function () {
    this.ajaxCollectionList()
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

  // 送货收款列表
  ajaxCollectionList() {
    let self = this
    let currentUser = wx.getStorageSync("currentUserInfo")
    // let parameter = {
    //   delivery_phone: currentUser.mobile,
    //   table_num: currentUser.table_num
    // }
    // app.request.post('/xcx/order/list_song_cod', parameter).then(res => {
    //   self.setData({
    //     collectionList: res
    //   })
    //   self.keepTwoDecimal()
    // })
    app.https({
      config: {
        url: 'xcx/order/list_song_cod',
        data: {
          delivery_phone: currentUser.mobile,
          table_num: currentUser.table_num
        },
        method: 'POST'
      },
      isAuth: true
    }).then((res) => {
      console.log('ajaxCollectionListRes', res)
      self.setData({
        collectionList: res.data.data
      })
      self.keepTwoDecimal()
    }).catch((err) => {
      console.log('ajaxCollectionListErr', err)
    })
  },

  //页面展示数据（保留两位小数）
  keepTwoDecimal() {
    let collectionList = this.data.collectionList
    collectionList.map((item, index) => {
      item.volume = item.volume.toFixed(2)
      item.weight = item.weight.toFixed(2)
    })
    this.setData({
      collectionList: collectionList
    })
  },

  // 显示电话号码展示弹窗
  vantPopup() {
    this.setData({
      show: true
    })
  },

  // 关闭电话号码展示弹窗
  closePopup() {
    this.setData({
      show: false
    })
  },

  // 获取手机号码
  getPhoneNum(event) {

    let phone = event.currentTarget.dataset.phone
    let phoneList = phone.split("/")

    //有多个号码时，让用户选择拨打的电话号码
    if (phoneList.length > 1) {
      this.vantPopup();
      this.setData({
        phoneList: phoneList
      })
      return;
    }
    app.utils.callPhone(phoneList[0]);
  },

  // 选择了电话号码
  choosePhoneNum(event) {
    let phone = event.currentTarget.dataset.phone;

    this.closePopup()
    app.utils.callPhone(phone);
  }
})