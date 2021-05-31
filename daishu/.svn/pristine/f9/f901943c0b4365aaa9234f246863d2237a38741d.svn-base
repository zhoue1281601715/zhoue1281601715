// pages/blueconn/blueconn.js
var app = getApp()
Page({

  data: {
    // 搜索的设备列表
    list: [],
    //连接的设备服务
    services: [],

    serviceId: 0,
    writeCharacter: false,
    readCharacter: false,
    notifyCharacter: false,
    isScanning: false
  },
  mixins: [app.togerther],
  startSearch: function () {
    var _this = this
    wx.openBluetoothAdapter({
      success: function (res) {
        wx.getBluetoothAdapterState({
          success: function (res) {
            if (res.available) {
              if (res.discovering) {
                wx.stopBluetoothDevicesDiscovery({
                  success: function (res) {
                    console.log(res)
                  }
                })
              }
              _this.checkPemission()
            } else {
              wx.showModal({
                title: '提示',
                content: '本机蓝牙不可用',
              })
            }
          },
        })
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '蓝牙初始化失败，请打开蓝牙',
        })
      }
    })
  },
  checkPemission: function () { //android 6.0以上需授权地理位置权限
    var _this = this
    let system = app.getSystem()
    var platform = app.BLEInformation.platform

    if (platform == "ios") {
      app.globalData.platform = "ios"
      _this.getBluetoothDevices()
    } else if (platform == "android") {
      app.globalData.platform = "android"
      console.log('安卓版本------', parseInt(system.substring(8)))
      if (parseInt(system.substring(8)) > 5) {
        wx.getSetting({
          success: function (res) {
            console.log(res)
            if (!res.authSetting['scope.userLocation']) {
              wx.authorize({
                scope: 'scope.userLocation',
                complete: function (res) {
                  _this.getBluetoothDevices()
                }
              })
            } else {
              _this.getBluetoothDevices()
            }
          }
        })
      } else {
        _this.getBluetoothDevices()
      }

    }
  },
  getBluetoothDevices: function () { //获取蓝牙设备信息
    var _this = this
    console.log("start search")
    // wx.showLoading({
    //   title: '正在加载',
    // })
    _this.setData({
      isScanning: true
    })
    wx.startBluetoothDevicesDiscovery({
      success: function (res) {
        console.log(res)
        setTimeout(function () {
          wx.getBluetoothDevices({
            success: function (res) {
              console.log('搜索的设备-------', res)
              var devices = []
              var num = 0
              for (var i = 0; i < res.devices.length; ++i) {
                if (res.devices[i].name != "未知设备") {
                  devices[num] = res.devices[i]
                  num++
                }
              }
              _this.setData({
                list: devices,
                isScanning: false
              })
              wx.hideLoading()
              wx.stopPullDownRefresh()
            },
          })
        }, 3000)
      },
      fail: function (res) {
        console.log('搜索失败-----', res)
      }
    })
  },

  //开始连接
  bindViewTap: function (e) {
    var _this = this
    var device_Ble_Id = e.currentTarget.dataset.title
    wx.stopBluetoothDevicesDiscovery({ // 耗费资源停止搜索
      success: function (res) {
        console.log(res)
      }
    })

    _this.setData({
      serviceId: 0,
      writeCharacter: false,
      readCharacter: false,
      notifyCharacter: false
    })
    // wx.setStorageSync('shebei', shebei)
    wx.showLoading({
      title: '正在连接',
    })
    wx.createBLEConnection({
      deviceId: device_Ble_Id,
      success: function (res) {
        console.log('连接成功', res)
        app.BLEInformation.deviceId = device_Ble_Id
        _this.getSeviceId()
      },
      fail: function (e) {
        wx.showModal({
          title: '提示',
          content: '连接失败',
        })
        wx.hideLoading()
      },
      complete: function (e) {
        console.log(e)
      }
    })
  },

  // 获取设备服务
  getSeviceId: function () {
    var _this = this
    var BLEInformation = app.BLEInformation
    // console.log(app.BLEInformation.deviceId)
    wx.getBLEDeviceServices({
      deviceId: BLEInformation.deviceId,
      success: function (res) {
        _this.setData({
          services: res.services
        })
        _this.getCharacteristics()
      },
      fail: function (e) {
        console.log(e)
      },
      complete: function (e) {
        console.log(e)
      }
    })
  },

  // 获取服务特征值
  getCharacteristics: function () {
    var _this = this
    var list = _this.data.services
    var num = _this.data.serviceId
    var write = _this.data.writeCharacter
    var read = _this.data.readCharacter
    var notify = _this.data.notifyCharacter
    wx.getBLEDeviceCharacteristics({
      deviceId: app.BLEInformation.deviceId,
      serviceId: list[num].uuid,
      success: function (res) {
        console.log(res)
        for (var i = 0; i < res.characteristics.length; ++i) {
          var properties = res.characteristics[i].properties
          var item = res.characteristics[i].uuid
          if (!notify) {
            if (properties.notify) {
              app.BLEInformation.notifyCharaterId = item
              app.BLEInformation.notifyServiceId = list[num].uuid
              notify = true
            }
          }
          if (!write) {
            if (properties.write) {
              app.BLEInformation.writeCharaterId = item
              app.BLEInformation.writeServiceId = list[num].uuid
              write = true
            }
          }
          if (!read) {
            if (properties.read) {
              app.BLEInformation.readCharaterId = item
              app.BLEInformation.readServiceId = list[num].uuid
              read = true
            }
          }
        }
        if (!write || !notify || !read) {
          num++
          _this.setData({
            writeCharacter: write,
            readCharacter: read,
            notifyCharacter: notify,
            serviceId: num
          })
          if (num == list.length) {
            wx.showModal({
              title: '提示',
              content: '找不到该读写的特征值',
            })
          } else {
            _this.getCharacteristics()
          }
        } else {
          _this.openControl()
        }
      },
      fail: function (e) {
        console.log(e)
      },
      complete: function (e) {
        console.log("write:" + app.BLEInformation.writeCharaterId)
        console.log("read:" + app.BLEInformation.readCharaterId)
        console.log("notify:" + app.BLEInformation.notifyCharaterId)
      }
    })
  },

  openControl: function () {
    // wx.setStorageSync("auto_printing",true)
    // wx.navigateBack({
    //   data: 1
    // })
    let bill_id = this.data.bill_id
    app.utils.wx_toast("蓝牙连接成功")
    setTimeout(()=>{
      wx.navigateTo({
        url: '/packageC/waybill_printing_detail/waybill_printing_detail?id=' + bill_id,
      })
    },2000)
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    app.BLEInformation.platform = app.getPlatform()
    this.setData({
      bill_id: options.id
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
  onShow: function (options) {


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
    var _this = this
    wx.startPullDownRefresh({})
    _this.startSearch()
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