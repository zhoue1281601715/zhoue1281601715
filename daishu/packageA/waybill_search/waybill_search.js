//Page Object
const app = getApp()

Page({
  data: {
    // 订单进展
    waybillStep: [],
    table_num: 0
  },
  mixins: [app.togerther],
  //options(Object)
  onLoad: function (options) {
    let code = options.orderNum
    let table_num = wx.getStorageSync('table_num')
    this.setData({
      code,
      table_num
    }, () => {
      console.log('code', this.data.code)
      console.log('table_num', this.data.table_num)
    })
  },

  onReady: function () {

  },
  onShow: function () {
    this.waybillProgress()
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  onPageScroll: function () {

  },
  //item(index,pagePath,text)
  onTabItemTap: function (item) {

  },
  // 输入的运单号
  onChange(event) {
    if (event.detail) {
      this.setData({
        code: event.detail
      })
      app.utils.debounce(this.waybillProgress, 3000)
    } else {
      app.utils.debounce(this.waybillProgress, 3000)
    }
  },
  // 运单进展
  waybillProgress() {
    let self = this

    let parameter = {
      code: this.data.code,
      table_num: 0
    }
    app.request.post('/q', parameter).then(res => {
      console.log('res-------------', res)
      self.setData({
        waybillStep: res
      })
    })
  }
});