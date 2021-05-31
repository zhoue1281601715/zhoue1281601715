// packageC/waybill_printing_detail/waybill_printing_detail.js
const app = getApp()
let blueApi = {
  cfg: {
    device_info: "AAA",
    server_info: "BBB",
    onOpenNotify: null
  },
  blue_data: {
    device_id: "",
    service_id: "",
    write_id: ""
  },
  setCfg(obj) {
    this.cfg = Object.assign({}, this.cfg, obj);
  },
  connect() {
    if (!wx.openBluetoothAdapter) {
      this.showError("当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。");
      return;
    }
    var _this = this;
    wx.openBluetoothAdapter({
      success: function (res) {},
      complete(res) {
        wx.onBluetoothAdapterStateChange(function (res) {
          if (res.available) {
            setTimeout(function () {
              // _this.connect();
            }, 2000);
          }
        })
        _this.getBlueState();
      }
    })
  },
  //发送消息
  sendMsg(msg, toArrayBuf = true) {
    let _this = this;
    let buf = toArrayBuf ? this.hexStringToArrayBuffer(msg) : msg;
    wx.writeBLECharacteristicValue({
      deviceId: _this.blue_data.device_id,
      serviceId: _this.blue_data.service_id,
      characteristicId: _this.blue_data.write_id,
      value: buf,
      success: function (res) {
        console.log(res);
      }
    })
  },
  //监听消息
  onNotifyChange(callback) {
    var _this = this;
    wx.onBLECharacteristicValueChange(function (res) {
      let msg = _this.arrayBufferToHexString(res.value);
      callback && callback(msg);
      console.log(msg);
    })
  },
  disconnect() {
    var _this = this;
    wx.closeBLEConnection({
      deviceId: _this.blue_data.device_id,
      success(res) {}
    })
  },
  /*事件通信模块*/

  /*连接设备模块*/
  getBlueState() {
    var _this = this;
    if (_this.blue_data.device_id != "") {
      _this.connectDevice();
      return;
    }

    wx.getBluetoothAdapterState({
      success: function (res) {
        if (!!res && res.available) { //蓝牙可用    
          console.log('蓝牙可用？---------', res)
          _this.startSearch();
        }
      }
    })
  },
  startSearch() {
    var _this = this;
    wx.startBluetoothDevicesDiscovery({
      services: [],
      success(res) {
        console.log('res-------', res)
        wx.onBluetoothDeviceFound(function (res) {
          console.log('搜索--------', res)
          // var device = _this.filterDevice(res.devices)
          console.log('device----------', res.devices[0].deviceId)
          _this.stopSearch();
          // _this.blue_data.device_id = device.deviceId;
          _this.blue_data.device_id = res.devices[0].deviceId;
          _this.connectDevice();

          // if (device) {
          //   console.log('11111111')
          //  
          //   _this.stopSearch();
          //   _this.connectDevice();
          // }
        });
      },
      fail(res) {
        console.log('搜索失败--------', res)
      }
    })
  },
  //连接到设备
  connectDevice() {
    var _this = this;
    wx.createBLEConnection({
      deviceId: _this.blue_data.device_id,
      success(res) {
        console.log('连接成功！！！！！！！', res)
        _this.getDeviceService();
      }
    })
  },
  //搜索设备服务
  getDeviceService() {
    var _this = this;
    wx.getBLEDeviceServices({
      deviceId: _this.blue_data.device_id,
      success: function (res) {
        console.log('设备服务----------', res)
        var service_id = _this.filterService(res.services);
        if (service_id != "") {
          _this.blue_data.service_id = service_id;
          _this.getDeviceCharacter();
        }
      },
      fail: function (res) {
        console.log('获取设备服务失败', res)
      }
    })
  },
  //获取连接设备的所有特征值  
  getDeviceCharacter() {
    let _this = this;
    wx.getBLEDeviceCharacteristics({
      deviceId: _this.blue_data.device_id,
      serviceId: _this.blue_data.service_id,
      success: function (res) {
        console.log('特征值*------', res)
        let notify_id, write_id, read_id;
        for (let i = 0; i < res.characteristics.length; i++) {
          let charc = res.characteristics[i];
          if (charc.properties.notify) {
            notify_id = charc.uuid;
          }
          if (charc.properties.write) {
            write_id = charc.uuid;
          }
          if (charc.properties.write) {
            read_id = charc.uuid;
          }
        }
        if (notify_id != null && write_id != null) {
          _this.blue_data.notify_id = notify_id;
          _this.blue_data.write_id = write_id;
          _this.blue_data.read_id = read_id;

          _this.openNotify();
        }
      }
    })
  },
  openNotify() {
    var _this = this;
    wx.notifyBLECharacteristicValueChange({
      state: true,
      deviceId: _this.blue_data.device_id,
      serviceId: _this.blue_data.service_id,
      characteristicId: _this.blue_data.notify_id,
      complete(res) {
        setTimeout(function () {
          _this.onOpenNotify && _this.onOpenNotify();
        }, 1000);
        _this.onNotifyChange(); //接受消息
      }
    })
  },
  /*连接设备模块*/


  /*其他辅助模块*/
  //停止搜索周边设备  
  stopSearch() {
    var _this = this;
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        console.log('停止搜索了')
      }
    })
  },
  notifyBLECharacteristicValueChange(buffer) {
    let bufferType = Object.prototype.toString.call(buffer)
    if (buffer != '[object ArrayBuffer]') {
      return
    }
    let dataView = new DataView(buffer)

    var hexStr = '';
    for (var i = 0; i < dataView.byteLength; i++) {
      var str = dataView.getUint8(i);
      var hex = (str & 0xff).toString(16);
      hex = (hex.length === 1) ? '0' + hex : hex;
      hexStr += hex;
    }

    return hexStr.toUpperCase();
  },
  hexStringToArrayBuffer(str) {
    if (!str) {
      return new ArrayBuffer(0);
    }

    var buffer = new ArrayBuffer(str.length);
    let dataView = new DataView(buffer)

    let ind = 0;
    for (var i = 0, len = str.length; i < len; i += 2) {
      let code = parseInt(str.substr(i, 2), 16)
      dataView.setUint8(ind, code)
      ind++
    }

    return buffer;
  },
  //过滤目标设备
  filterDevice(device) {
    var data = blueApi.arrayBufferToHexString(device[0].advertisData);
    if (data && data.indexOf(this.device_info.substr(4).toUpperCase()) > -1) {
      var obj = {
        name: device.name,
        deviceId: device.deviceId
      }
      return obj
    } else {
      return null;
    }
  },
  //过滤主服务
  filterService(services) {
    let service_id = "";
    for (let i = 0; i < services.length; i++) {
      if (services[i].uuid.toUpperCase().indexOf(this.server_info) != -1) {
        service_id = services[i].uuid;
        break;
      }
    }

    return service_id;
  }
  /*其他辅助模块*/
}

// blueApi.setCfg({
//   device_info: "AAA",
//   server_info: "BBB",
//   onOpenNotify: function () {
//     blueApi.sendMsg("test");
//   }
// })
// blueApi.connect();
// blueApi.onNotifyChange(function (msg) {
//   console.log(msg);
// })

Page({

  /**
   * 页面的初始数据
   */
  data: {
    payList: ['线上支付', "线下支付"],
    payIndex: 0,

    table_num: 0,
    // 物流单ID
    id: 0,
    // 详情
    bill: {}
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
  ajaxBillDetail() {
    let self = this
    let parameter = {
      id: this.data.id,
      table_num: this.data.table_num
    }
    app.request.post('/xcx/order/view', parameter).then(res => {
      res.volume = res.volume.toFixed(2)
      res.weight = res.weight.toFixed(2)
      self.setData({
        bill: res
      })
    })
  },
  
  // 搜索蓝牙
  searchBLE() {
    wx.setStorageSync("ceshiId", this.data.id)
    wx.navigateTo({
      url: '../bleConnect/bleConnect',
    })
  }

})