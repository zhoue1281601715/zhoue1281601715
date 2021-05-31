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
    
    order_id: '', // 订单ID
    pay_imgs: '', // 凭证图片路径（后端处理过的）
    tempFilePath: '', // 凭证图片路径数组（前端从本地上传的）
    removeIconFlag: true, // 图片删除按钮显示标识
    toastParameter: {}, // 自定义toast参数
  },

  /**
   * 上传图片
   */
  handleChooseImage () {
    const that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePath = res.tempFilePaths[0]
        that.setData({
          tempFilePath
        }, () => {
          wx.showLoading({
            title: '上传中',
          })
          wx.uploadFile({
            url: Config.Config.baseUrl + 'api/v1/upload-image',
            filePath: tempFilePath,
            name: 'image',
            formData: {},
            success (res){
              const data = JSON.parse(res.data)
              console.log('data', data)
              that.setData({
                pay_imgs: data.msg.preview_path
              })
              wx.hideLoading()
            },
            fail (err) {
              console.log('uploadFileErr', err)
              wx.hideLoading({
                success: (res) => {
                  wx.showToast({
                    title: '上传失败',
                    icon: 'error',
                    duration: 2000
                  })
                },
              })
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
  handleDeleteImage () {
    const that = this
    that.setData({
      tempFilePath: '',
      pay_imgs: '',
    })
  },

  /**
   * 提交图片凭证
   */
  handleSubmit () {
    const that = this
    const { pay_imgs, order_id } = that.data
    if (pay_imgs) {
      app.http({
        config: {
          url: 'api/v1/offline_stock',
          data: {
            pay_imgs,
            order_id
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
          toastParameter,
          removeIconFlag: false
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
        title: '请先上传图片',
        icon: 'none',
        duration: 1500
      })
    }
  },

  /**
	 * 客服
	 * @param {*} e 
	 */
	handleContact (e) {
		console.log(e.detail.path)
		console.log(e.detail.query)
	},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(Config.Config.baseUrl + 'api/v1/upload-image')
    const that = this
    const order_id = options.order_id
    // console.log('order_id', order_id)
    that.setData({
      order_id
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