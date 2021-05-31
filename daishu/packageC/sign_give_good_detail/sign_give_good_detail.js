/**
 * 如果位目录层数大于两级需要修改路径
 */
const { $Toast, $Message } = require('../../utils/iview/base/index');
import Tools from '../../utils/modules/Tools';
import Config from '../../config';
import utils from '../../utils/utils';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payList: ['线上支付', "线下支付"],
    payIndex: 0,
    // 上传图片
    signImg: [],
    //  确认签收弹窗
    show: false,
    // 拨打电话弹窗
    choosePhonePopup: false,
    pics: [],
    areaShow: false,
  },
  mixins: [app.togerther],

  /**
   * 上传图片
   */
  handleChooseImage () {
    const that = this
    let pics = that.data.pics
    const count = 27 - pics.length
    wx.chooseImage({
      count,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePath = res.tempFilePaths
        const pictureLen = tempFilePath.length + pics.length
        let areaShow = false
        switch (pictureLen) {
          case 1:
            areaShow = true
            break;
          case 4:
            areaShow = true
            break;
          case 7:
            areaShow = true
            break;
          case 10:
            areaShow = true
            break;
          case 13:
            areaShow = true
            break;
          case 16:
            areaShow = true
            break;
          case 19:
            areaShow = true
            break;
          case 22:
            areaShow = true
            break;
          case 25:
            areaShow = true
            break;
          default:
            areaShow = false
        }
        that.setData({
          areaShow
        })
        tempFilePath.forEach(item => {
          wx.uploadFile({
            url: Config.Config.baseUrl2 + 'xcx/order/update_sign_image_xcx',
            filePath: item,
            name: 'image',
            formData: {},
            success (res) {
              const data = JSON.parse(res.data)
              console.log('data', data)
              pics.push(data.msg)
              that.setData({
                pics
              })
            },
            fail (err) {
              console.log('uploadFileErr', err)
            }
          })
        })
      },
      fail (err) {
        console.log('chooseImageErr', err)
      }
    })
  },

  /**
   * 删除图片
   */
  handleDeleteImage (e) {
    const that = this
    const index = e.currentTarget.dataset.index
    let pics = that.data.pics
    pics.splice(index, 1)
    let areaShow = false
    switch (pics.length) {
      case 1:
        areaShow = true
        break;
      case 4:
        areaShow = true
        break;
      case 7:
        areaShow = true
        break;
      case 10:
        areaShow = true
        break;
      case 13:
        areaShow = true
        break;
      case 16:
        areaShow = true
        break;
      case 19:
        areaShow = true
        break;
      case 22:
        areaShow = true
        break;
      case 25:
        areaShow = true
        break;
      default:
        areaShow = false
    }
    that.setData({
      pics,
      areaShow
    })
  },

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
  billDetail(id) {
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
      console.log('billDetailRes', res)
      let bill = res.data.data
      bill.volume = bill.volume.toFixed(2)
      bill.weight = bill.weight.toFixed(2)
      self.setData({
        bill
      })
    }).catch((err) => {
      console.log('billDetailErr', err)
    })
  },

  //图片上传
  // imgUploade() {
  //   let self = this;
  //   wx.chooseImage({
  //     count: 1,
  //     sizeType: ['original', 'compressed'],
  //     sourceType: ['album', 'camera'],
  //     success: (result) => {
  //       let get_image = result.tempFilePaths[0]
  //       app.request.upload(get_image, (res) => {
  //         console.log('res-------', res)
  //         self.setData({
  //           headPortrait: res.data.path
  //         })
  //       })
  //     }
  //   })
  // },

  //显示弹窗
  showVantPopup() {
    this.setData({
      show: true
    })
  },

  //关闭弹窗
  closeVantPopup() {
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
    //   createby: bill.createby,
    //   // sign_imgs: this.data.signImg
    // }
    // app.request.post('/xcx/order/update_sign_xcx', parameter).then(res => {
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
    var pics = this.data.pics
    if (pics.length === 0) {
      wx.showToast({
        title: '请先上传凭证图片',
        icon: 'none',
        duration: 2000
      })
      return false
    } else {
      var sign_imgs = ''
      pics.forEach(item => {
        sign_imgs += `${item},`
      })
      sign_imgs = sign_imgs.substr(0, sign_imgs.length - 1)
      // console.log('sign_imgs', sign_imgs)
      app.https({
        config: {
          url: 'xcx/order/update_sign_xcx',
          data: {
            id,
            table_num,
            sign_imgs,
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
        wx.showModal({
          title: '提示',
          content: '签收成功',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1,
              })
            }
          }
        })
      }).catch((err) => {
        console.log('confirmSignForErr', err)
        wx.showModal({
          title: '提示',
          content: err.data.msg,
          showCancel: false
        })
      })
    }
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