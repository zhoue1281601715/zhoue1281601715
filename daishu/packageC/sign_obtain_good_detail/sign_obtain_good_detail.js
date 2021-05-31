// packageC/sign_obtain_good_detail/sign_obtain_good_detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 物流单详情
    bill: {},
    //  确认签收弹窗
    show: false,
    // 拨打电话弹窗
    choosePhonePopup: false
  },
  mixins: [app.togerther],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let currentUser = wx.getStorageSync("currentUserInfo")

    if (options.id) {
      this.setData({
        id: options.id,
        table_num: currentUser.table_num,
        createby: currentUser.createby
      })
      this.billDetail()
    }

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

  },

  // 详情
  billDetail() {
    let self = this

    // let parameter = {
    //   id: this.data.id,
    //   table_num: this.data.table_num
    // }
    // app.request.post('/xcx/order/view', parameter).then(res => {

    //   res.volume = res.volume.toFixed(2)
    //   res.weight = res.weight.toFixed(2)
    //   self.setData({
    //     bill: res
    //   })
      
    // })

    var id = this.data.id
    var table_num = this.data.table_num
    app.https({
      config: {
        url: 'xcx/order/view',
        data: {
          id,
          table_num,
        },
        method: 'POST'
      },
      isAuth: true
    }).then((res) => {
      console.log('billDetailRes', res)
      self.setData({
        bill: res.data.data
      })
      self.keepTwoDecimal()
    }).catch((err) => {
      console.log('billDetailErr', err)
    })
  },

  //显示弹窗
  showVantPopup() {
    this.setData({
      show: true
    })
  },

  //关闭弹窗
  vantPopuph() {
    this.setData({
      show: false
    })
  },

  // 确认签收
  confirmSignFor() {
    let self = this

    // let parameter = {
    //   id: this.data.id,
    //   table_num: this.data.table_num,
    //   createby: bill.createby
    // }
    // app.request.post('/xcx/order/update_ti_sign', parameter).then(res => {
    //   self.setdata({
    //     show: false
    //   })
    //   setTimeout(() => {
    //     app.utils.wx_toast("签收成功")
    //   }, 300)
    // })

    var id = this.data.id
    var table_num = this.data.table_num
    var createby = this.data.createby
    app.https({
      config: {
        url: 'xcx/order/update_ti_sign',
        data: {
          id,
          table_num,
          createby
        },
        method: 'POST'
      },
      isAuth: true
    }).then((res) => {
      console.log('confirmSignForRes', res)
      self.setData({
        show: false
      })
      setTimeout(() => {
        app.utils.wx_toast("签收成功")
      }, 300)
    }).catch((err) => {
      console.log('confirmSignForErr', err)
    })
  },


  // 显示电话号码展示弹窗
  vantPopup_2() {
    this.setData({
      choosePhonePopup: true
    })
  },

  // 关闭电话号码展示弹窗
  closePopup_2() {
    this.setData({
      choosePhonePopup: false
    })
  },

  // 获取手机号码
  getPhoneNum(event) {

    let phone = event.currentTarget.dataset.phone
    let phoneList = phone.split("/")

    //有多个号码时，让用户选择拨打的电话号码
    if (phoneList.length > 1) {
      this.vantPopup_2();
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