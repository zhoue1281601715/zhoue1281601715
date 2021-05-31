// packageC/delivery_goods_detail/delivery_goods_detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 物流单ID
    id: "",
    // 收款详情
    bill: {},
    // 是否显示支付功能
    isNeedPay: false,
    // 支付弹窗
    payPopup: false,
    // 支付方式
    payList: ["微信支付", "支付宝支付"],
    // 当前选中的支付方式
    payIndex: 0,

    paytype: "011",
    // 支付二维码路径
    payQRCodePath: "",
    // 拨打电话弹窗
    choosePhonePopup:false
  },
  mixins: [app.togerther],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let currentUser = wx.getStorageSync("currentUserInfo")
    this.setData({
      id: options.id,
      table_num: currentUser.table_num
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
    this.ajaxBillDetail()
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

  // 物流单详情
  ajaxBillDetail(id) {
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
    //   self.judgePay()
    // })
    app.https({
      config: {
        url: 'xcx/order/view',
        data: {
          id: this.data.id,
          table_num: this.data.table_num
        },
        method: 'POST'
      },
      isAuth: true
    }).then((res) => {
      console.log('ajaxBillDetailRes', res)
      let bill = res.data.data
      bill.volume = bill.volume.toFixed(2)
      bill.weight = bill.weight.toFixed(2)
      self.setData({
        bill
      })
      self.judgePay()
    }).catch((err) => {
      console.log('ajaxBillDetailErr', err)
    })
  },
  // 判断是否需要支付
  judgePay() {
    let bill = this.data.bill
    let toBePaidAmount = bill.charge_ti + bill.cod
    if (toBePaidAmount > 0) {
      this.setData({
        isNeedPay: true
      })
      this.generateQRCode()
    } else {
      this.setData({
        isNeedPay: false
      })
    }
  },

  //保留两位小数
  // keepTwoDecimal(num) {
  //   num = num.toFixed(2)
  //   return num
  // }

  //显示弹窗
  showVantPopup() {
    this.setData({
      payPopup: true
    })
  },

  //关闭弹窗
  closeVantPopup() {
    this.setData({
      payPopup: false
    })
  },

  // 选择支付方式
  choosePay(event) {
    let chooseNum = event.currentTarget.dataset.num
    
    if (chooseNum == "011") {
      this.setData({
        payIndex: 0,
        paytype: chooseNum
      })
    }
    if (chooseNum == "009") {
      this.setData({
        payIndex: 1,
        paytype: chooseNum
      })
    }
    this.generateQRCode()
  },

  // 生成二维码
  ajaxGenerateQRCode() {
    let self = this
    let bill = this.data.bill
    let currentUser = wx.getStorageSync("currentUserInfo")
    let parameter = {

      // company_id: "",
      // 订单id
      order_ids: this.data.id,
      // 金额(代收款与提付款的和)
      amount: bill.charge_ti + bill.cod,
      // 支付方式
      paytype: this.data.paytype,

      createby: currentUser.realname
    }
    // app.request.post('/xcx/payment/save', parameter).then(res => {

    // })
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