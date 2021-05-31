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
    poster: '', // 海报图片路径
    qrcodePath: '', // 海报二维码图片路径
    qrcodeWidth: 100, // 海报二维码宽度
    qrcodeHeight: 100, // 海报二维码高度
    qrcodeInfo: {}, // 海报二维码的基本信息
    posterPath: '', // 海报图片路径
    canvasWidth: '', // canvas宽度
    canvasHeight: '', // canvas高度
    posterToLeft: 0, // 在canvas上放置海报的 x 坐标位置
    posterToTop: 0, // 在canvas上放置海报的 y 坐标位置
    posterInfo: {}, // 海报图片的基本信息
    posterDownload: false, // 海报当前是否处于下载状态
    imgProportion: 1, // 图片占canvas画布宽度百分比
  },

  /**
   * 获取海报
   */
  getPoster() {
    const that = this
    const token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
		app.http({
			config: {
				url: 'api/v1/user_qrcode',
				data: {
          token
        },
				method: 'POST'
			},
			isAuth: false
		}).then(res => {
      console.log(res, 'getPosterRes')
      // const poster = res.data.msg.background[0].value.pic.value
      const poster = res.data.msg.background[0].value.pic.value
      const qrcodePath = Config.Config.baseUrl.replace(/.com\//, '.com') + res.data.msg.qrcode
      console.log('poster', poster)
      console.log('qrcodePath', qrcodePath)
      // 获取图片基本信息
      wx.getImageInfo({
        src: poster,
        success: function(response) {
          console.log('poster', response)
          that.setData({
            posterInfo: response,
            posterPath: response.path,
            // canvasWidth: response.width,
            canvasHeight: (response.height / response.width * that.data.canvasWidth)
          })
        },
        complete: function(res) {
          // 获取图片基本信息
          wx.getImageInfo({
            src: qrcodePath,
            success: function(response) {
              console.log('qrcode', response)
              that.setData({
                qrcodeInfo: response,
                qrcodePath: response.path
              })
            },
            complete: function(res) {
              wx.hideLoading()
            }
          })
        }
      })
		}).catch(err => {
			console.log(err, 'getPosterErr')
		})
  },

  /**
   * 绘制海报
   */
  drawImage() {
    let that = this
    // 海报背景图基本信息
    let posterInfo = that.data.posterInfo
    let posterPath = that.data.posterPath
    // 海报二维码基本信息
    let qrcodeInfo = that.data.qrcodeInfo
    let qrcodePath = that.data.qrcodePath
    // 计算海报宽高（宽度固定，高度等比缩放）
    let posterWidth = that.data.canvasWidth * that.data.imgProportion
    let posterHeight = posterInfo.height / posterInfo.width * posterWidth
    let qrcodeToLeft = 0 // 在canvas上放置海报二维码的 x 坐标位置
    let qrcodeToTop = posterHeight - that.data.qrcodeHeight // 在canvas上放置海报二维码的 y 坐标位置
    // 获取canvas对象
    let ctx = wx.createCanvasContext('myCanvas')
    ctx.setFillStyle('#FFFFFF') // 设置canvas背景色, 否则制作的图片是透明的
    ctx.fillRect(0, 0, that.data.canvasWidth, that.data.canvasHeight) // 背景色填充满整个画布
    ctx.drawImage(posterPath, 0, 0, posterInfo.width, posterInfo.height, that.data.posterToLeft, that.data.posterToTop, posterWidth, posterHeight) // 先绘制海报背景图，撑满整个画布
    console.log('posterPath', posterPath)
    console.log('posterInfo.width', posterInfo.width)
    console.log('posterInfo.height', posterInfo.height)
    console.log('that.data.posterToLeft', that.data.posterToLeft)
    console.log('that.data.posterToTop', that.data.posterToTop)
    console.log('posterWidth', posterWidth)
    console.log('posterHeight', posterHeight)
    ctx.drawImage(qrcodePath, 0, 0, qrcodeInfo.width, qrcodeInfo.height, qrcodeToLeft, qrcodeToTop, that.data.qrcodeWidth, that.data.qrcodeHeight) // 绘制海报二维码
    ctx.draw()
  },

  /**
   * 下载海报
   */
  handleDownloadPoster () {
    let that = this
    wx.showLoading({
      title: '保存中',
      mask: true
    })
    that.setData({
      posterDownload: true
    })
    let timer = setTimeout(() => {
      clearTimeout(timer)
      this.drawImage()
    }, 10)
    let timers = setTimeout(() => {
      clearTimeout(timers)
      let canvasWidth = this.data.canvasWidth
      let canvasHeight = this.data.canvasHeight
      let posterDestWidth = canvasWidth * 3
      let posterDestHeight = canvasHeight * 3
      wx.canvasToTempFilePath({
        x: 0, // 指定的画布区域的左上角横坐标
        y: 0, // 指定的画布区域的左上角纵坐标
        width: canvasWidth, // 指定的画布区域的宽度
        height: canvasHeight, // 指定的画布区域的宽度
        destWidth: posterDestWidth, // 输出的图片的宽度，画布宽度 * dpr
        destHeight: posterDestHeight, // 输出的图片的高度，画布高度 * dpr
        canvasId: 'myCanvas',
        success: function(res) {
          //console.log(res.tempFilePath) // 生成的临时图片路径
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function(res) {
              //console.log(res);
              wx.hideLoading()
              wx.showToast({
                title: '保存成功',
              })
            },
            fail: function(err) {
              if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
                wx.showModal({
                  title: '提示',
                  content: '需要您授权保存相册',
                  showCancel: false,
                  success: modalSuccess => {
                    wx.openSetting({
                      success(settingdata) {
                        //console.log("settingdata", settingdata)
                        if (settingdata.authSetting['scope.writePhotosAlbum']) {
                          wx.showModal({
                            title: '提示',
                            content: '获取权限成功,再次点击图片即可保存',
                            showCancel: false,
                          })
                        } else {
                          wx.showModal({
                            title: '提示',
                            content: '获取权限失败，图片无法保存到相册',
                            showCancel: false,
                          })
                        }
                      },
                      fail(failData) {
                        //console.log("failData", failData)
                      },
                      complete(finishData) {
                        // console.log("finishData", finishData)
                      }
                    })
                  }
                })
              }
            },
            complete(res) {
              wx.hideLoading()
              that.setData({
                posterDownload: false
              })
            }
          })
        }
      })
    }, 500)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options', options)
    const that = this
    that.getPoster()
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          canvasWidth: res.windowWidth,
          canvasHeight: res.windowHeight
        })

        // 根据图片比例, 使图片居中
        let posterToLeft = (res.windowWidth * (1 - that.data.imgProportion)) / 2
        that.setData({
          posterToLeft
        })
      }
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