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
    modal : {
			tips : '提示',
			message : '模态框说明',
			ok : 'modalOk',
			cancel : 'modalCancel',
			ishide : true
    },
    unique: '',
    order_id: '',
    product_id: '',
    comment: '',
    product_score: 5,
    goods_name: '',
    goods_picture: '',
    pics: [],
    areaShow: false,
    toastParameter: {}
  },

  /**
   * 上传图片
   */
  handleChooseImage () {
    const that = this
    let pics = that.data.pics
    const count = 9 - pics.length
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
          default:
            areaShow = false
        }
        that.setData({
          areaShow
        })
        tempFilePath.forEach(item => {
          wx.uploadFile({
            url: Config.Config.baseUrl + 'api/v1/upload-image',
            filePath: item,
            name: 'image',
            formData: {},
            success (res) {
              const data = JSON.parse(res.data)
              console.log('data', data)
              pics.push(data.msg.preview_path)
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
      default:
        areaShow = false
    }
    that.setData({
      pics,
      areaShow
    })
  },

  /**
   * 评价内容
   */
  handleChangeComment (e) {
    console.log('comment', e)
    const that = this
    const comment = e.detail.value
    that.setData({
      comment
    })
  },

  /**
   * 提交评价
   */
  handleSubmit () {
    const that = this
    const token = wx.getStorageSync('token')
    setTimeout(() => {
      const { order_id, product_id, unique, product_score, comment, pics } = that.data
      if (comment) {
        app.http({
          config: {
            url: 'api/v1/add_comment',
            data: {
              token,
              order_id,
              product_id,
              unique,
              product_score,
              comment,
              pics
            },
            method: 'POST'
          },
          isAuth: true
        }).then(res => {
          console.log(res, 'submitRes')
          const toastParameter = {
            icon: 'success',
            content: res.data.msg,
            duration: 1500
          }
          that.setData({
            toastParameter
          }, function () {
            setTimeout(() => {
              wx.navigateBack({
                delta: 1,
              })
            }, 1500)
          })
        }).catch(err => {
          console.log(err, 'submitErr')
          wx.showModal({
            title: '提示',
            content: err.data.msg,
            showCancel: false
          })
        })
      } else {
        wx.showToast({
          title: '请先输入评论内容',
          icon: 'none',
          duration: 1500
        })
      }
    }, 100)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    const { unique, order_id, product_id, goods_name, goods_picture } = options
    console.log('options', options)
    that.setData({
      unique,
      order_id,
      product_id,
      goods_name,
      goods_picture
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