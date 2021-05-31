var app = getApp()
var tsc = require("../../utils/tsc.js");
var esc = require("../../utils/esc.js");
// components/BLE_printing/BLE_printing.js
Component({
  /**
   * 组件的属性列表
   */
  externalClasses: ['my-class'],
  properties: {
    name: {
      type: String,
      value: "This is defalut value!",
      // observer: function () {
      //   this.setData({

      //   })
      // }
    },
    print: { //打印的运单id
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 运单ID
    bill_id: 0,

    // signData: [],
    codes: '',
    isLabelSend: false,
    star: true,
    listss: [],
    services: [],
    serviceId: 0,
    writeCharacter: false,
    readCharacter: false,
    notifyCharacter: false,
    isScanning: false,
    src: null,
    id: '',
    pstype: '',
    sendContent: "",
    looptime: 0,
    currentTime: 1,
    lastData: 0,
    oneTimeData: 0,
    returnResult: "",
    canvasWidth: 80,
    canvasHeight: 80,
    buffSize: [],
    buffIndex: 0,
    printNum: [],
    printNumIndex: 0,
    printerNum: 1,
    currentPrint: 1,
    isReceiptSend: false,
    isLabelSend: false,
  },

  // 组件的生命周期函数，用于声明组件的生命周期
  lifetimes: {
    created: () => {

    },
    attached: () => {

    },
    ready() {
      var list = []
      var numlist = []
      var j = 0
      for (var i = 20; i < 200; i += 10) {
        list[j] = i;
        j++
      }
      for (var i = 1; i < 10; i++) {
        numlist[i - 1] = i
      }
      this.setData({
        buffSize: list,
        oneTimeData: list[0],
        printNum: numlist,
        printerNum: numlist[0]
      })

    },
    moved: () => {},
    detached: () => {},

  },

  /**
   * 组件的方法列表
   */
  methods: {

    //app.js中是否有设备ID，如果有
    inspectBleState(event) {

      this.setData({
        bill_id: event.currentTarget.dataset.id
      })

      // app.js中设备ID不存在->跳转至蓝牙搜索界面
      if (app.BLEInformation.deviceId == "") {
        wx.navigateTo({
          url: '../../pages/bleConnect/bleConnect',
        });
        return
      }

      this.ajaxBillDetail()


    },

    //请求打印的数据
    // 物流单详情
    ajaxBillDetail() {
      let self = this

      let currentUser = wx.getStorageSync("currentUserInfo")

      let parameter = {
        id: this.data.bill_id,
        table_num: currentUser.table_num
      }

      app.request.post('/xcx/order/view', parameter).then(res => {
        console.log('运单信息-------', res)
        res.volume = res.volume.toFixed(2)
        res.weight = res.weight.toFixed(2)
        self._startPrinting(res)
      })

    },

    // 开始打印
    _startPrinting(data) {
      var that = this;
      // 获取打印的数据
      let signData = data;

      that._openNotify()
      that._monitorBleState()
      wx.showModal({
        title: '提示',
        content: '是否确认打印',
        success: function (res) {
          if (res.confirm) {
            var canvasWidth = that.data.canvasWidth
            var canvasHeight = that.data.canvasHeight
            var command = tsc.jpPrinter.createNew()
            // var signData = that.data.signData
            //打印时间
            var time = app.utils.formatTime(new Date(), "")
            var dateA = time.substring(0, 11)
            var dateB = time.substring(11, 22)

            command.setSize(76, 180)
            command.setGap(2)
            command.setCls()
            // command.setText(0, 30, "TSS24.BF2", 1, 1, "图片")
            // command.setQR(50, 590, "L", 5, "A", "www.smarnet.cc代叔物流")
            // command.setText(70, 570, "TSS24.BF2", 1, 1, "代叔物流") 
            command.setText(170, 30, "TSS24.BF2", 2, 2, "代叔物流")
            command.setText(400, 50, "TSS24.BF2", 1, 1, "客户存根")
            command.setText(5, 90, "TSS24.BF2", 1, 1, "__________________________________________________________________")
            command.setText(30, 130, "TSS24.BF2", 2, 2, +signData.code)
            command.setText(5, 170, "TSS24.BF2", 1, 1, "__________________________________________________________________")
            command.setText(30, 200, "TSS24.BF2", 2, 2, "到：")
            command.setText(100, 200, "TSS24.BF2", 2, 2, signData.consignee_city + signData.consignee_area + signData.consignee_street)
            command.setText(5, 240, "TSS24.BF2", 1, 1, "__________________________________________________________________")
            command.setText(30, 290, "TSS24.BF2", 2, 2, "收：")
            command.setText(100, 290, "TSS24.BF2", 1, 1, signData.consignee_name + signData.consignee_phone)
            command.setText(100, 315, "TSS24.BF2", 1, 1, signData.consignee_address)
            command.setText(5, 330, "TSS24.BF2", 1, 1, "__________________________________________________________________")
            command.setText(30, 380, "TSS24.BF2", 2, 2, "寄：")
            command.setText(100, 380, "TSS24.BF2", 1, 1, signData.shipper_contact + signData.shipper_mobile)
            command.setText(100, 405, "TSS24.BF2", 1, 1, signData.shipper_address)
            command.setText(5, 420, "TSS24.BF2", 1, 1, "__________________________________________________________________")

            command.setText(30, 460, "TSS24.BF2", 1, 1, "货物名称：" + signData.goodsname)
            command.setText(300, 460, "TSS24.BF2", 1, 1, "运费金额：" + signData.charge_freight)
            command.setText(30, 490, "TSS24.BF2", 1, 1, "包装方式：" + signData.packaging)
            command.setText(300, 490, "TSS24.BF2", 1, 1, "装卸费：" + signData.charge_handle)

            command.setText(30, 520, "TSS24.BF2", 1, 1, "货物数量：" + signData.quantity + '件')

            command.setBar(250, 460, "BAR", 10, 150)
            command.setText(30, 550, "TSS24.BF2", 1, 1, "货物重量：" + signData.weight + '公斤')
            command.setText(30, 580, "TSS24.BF2", 1, 1, "货物体积：" + signData.volume + '方')

            command.setText(300, 520, "TSS24.BF2", 1, 2, "代收货款:" + '￥' + signData.cod)
            command.setText(5, 600, "TSS24.BF2", 1, 1, "__________________________________________________________________")
            command.setText(30, 640, "TSS24.BF2", 1, 1, "备注：" + signData.remark)


            command.setText(30, 780, "TSS24.BF2", 1.5, 1.5, dateA)
            command.setText(30, 810, "TSS24.BF2", 1.5, 1.5, dateB)
            command.setText(30, 840, "TSS24.BF2", 1.5, 1.5, "签字：" + signData.delivery_driver)
            command.setText(30, 870, "TSS24.BF2", 1.5, 1.5, signData.delivery_phone)
            command.setText(30, 900, "TSS24.BF2", 1.5, 1.5, signData.delivery_plate)

            command.setQR(300, 780, "L", 5, "A", "https://w.kagaro.com/index")
            // command.setText(300, 780, "TSS24.BF2", 1, 1, "代叔物流")

            command.setText(170, 1030, "TSS24.BF2", 2, 2, "代叔城配")
            command.setText(30, 1100, "TSS24.BF2", 1, 1, time + '/' + signData.tidriver)

            command.setText(30, 1135, "TSS24.BF2", 2, 2, "收：")
            command.setText(100, 1135, "TSS24.BF2", 1, 1, signData.consigneename + signData.consigneephone)
            command.setText(100, 1160, "TSS24.BF2", 1, 1, signData.consigneeaddress)
            command.setText(5, 1165, "TSS24.BF2", 1, 1, "__________________________________________________________________")
            command.setText(30, 1200, "TSS24.BF2", 2, 2, "寄：")
            command.setText(100, 1215, "TSS24.BF2", 1, 1, signData.shippername + signData.shipperphone)
            command.setText(5, 1220, "TSS24.BF2", 1, 1, "__________________________________________________________________")
            // command.setText(30, 1260, "TSS24.BF2", 1, 1, signData.quantity + '件/' + signData.weight + '公斤/' + signData.volume + '方/' + "运费:" + signData.receivabletotal + "/卸货:" + signData.receivablehandle + "/代收:" + signData.cod)
            command.setText(5, 1280, "TSS24.BF2", 1, 1, "__________________________________________________________________")
            command.setBar(30, 1320, "128", 64, 1, 3, 3, signData.code)
            command.setBar(30, 1260, "TSS24.BF2", 64, 1, 3, 3, "sadsaasd")
            command.setBar(30, 1310, "TSS24.BF2", 64, 1, 3, 3, "84as8d4asd")

            wx.canvasGetImageData({
              canvasId: 'edit_area_canvas',
              x: 0,
              y: 0,
              width: canvasWidth,
              height: canvasHeight,
              success: function (res) {
                console.log(res)

                command.setBitmap(30, 30, 0, res)
              },
              complete: function () {
                command.setPagePrint()
                that.setData({
                  isLabelSend: true
                })
                that._prepareSend(command.getData())
              }
            })
            // } else {
            //   wx.showToast({
            //     title: '打印并签收失败',
            //     icon: 'none'
            //   })
            // }
          } else {
            console.log('取消')
          }
        }
      })
    },

    // 重新连接蓝牙
    _reconnectionBle() {
      let bill_id = this.data.bill_id

      app.BLEInformation.deviceId = ""
      wx.redirectTo({
        url: '/pages/bleConnect/bleConnect?id' + bill_id
      })

    },
    
    _openNotify() {
      var that = this
      wx.notifyBLECharacteristicValueChange({
        deviceId: app.BLEInformation.deviceId,
        serviceId: app.BLEInformation.notifyServiceId,
        characteristicId: app.BLEInformation.notifyCharaterId,
        state: true,
        success: function (res) {
          wx.onBLECharacteristicValueChange(function (r) {
            console.log(`characteristic ${r.characteristicId} has changed, now is ${r}`)
          })
        },
        fail: function (e) {
          app.utils.wx_toast("蓝牙连接已断开,请重新连接")
          setTimeout(() => {
            that._reconnectionBle()
          }, 3000)
        },
        complete: function (e) {
          console.log(e)
          that.setData({
            states: e.errCode
          })
        }
      })
    },

    //准备发送，根据每次发送字节数来处理分包数量
    _prepareSend: function (buff) {
      console.log(buff)
      var that = this
      var time = that.data.oneTimeData
      var looptime = parseInt(buff.length / time);
      var lastData = parseInt(buff.length % time);
      console.log(looptime + "---" + lastData)
      that.setData({
        looptime: looptime + 1,
        lastData: lastData,
        currentTime: 1,
      })
      that._send(buff)
    },

    //分包发送
    _send: function (buff) {
      var that = this
      var currentTime = that.data.currentTime
      var loopTime = that.data.looptime
      var lastData = that.data.lastData
      var onTimeData = that.data.oneTimeData
      var printNum = that.data.printerNum
      var currentPrint = that.data.currentPrint
      var buf
      var dataView
      if (currentTime < loopTime) {
        buf = new ArrayBuffer(onTimeData)
        dataView = new DataView(buf)
        for (var i = 0; i < onTimeData; ++i) {
          dataView.setUint8(i, buff[(currentTime - 1) * onTimeData + i])
        }
      } else {
        buf = new ArrayBuffer(lastData)
        dataView = new DataView(buf)
        for (var i = 0; i < lastData; ++i) {
          dataView.setUint8(i, buff[(currentTime - 1) * onTimeData + i])
        }
      }
      console.log("第" + currentTime + "次发送数据大小为：" + buf.byteLength)
      wx.writeBLECharacteristicValue({
        deviceId: app.BLEInformation.deviceId,
        serviceId: app.BLEInformation.writeServiceId,
        characteristicId: app.BLEInformation.writeCharaterId,
        value: buf,
        success: function (res) {
          console.log(res)
        },
        fail: function (e) {
          console.log(e)
        },
        complete: function () {
          currentTime++
          if (currentTime <= loopTime) {
            that.setData({
              currentTime: currentTime
            })
            that._send(buff)
          } else {
            wx.showToast({
              title: '打印成功',
              icon: 'success',
              duration: 1500,
              success: function () {
                that.setData({
                  page: '1'
                })
              }
            })
            if (currentPrint == printNum) {
              that.setData({
                looptime: 0,
                lastData: 0,
                currentTime: 1,
                isReceiptSend: false,
                isLabelSend: false,
                currentPrint: 1
              })
            } else {
              currentPrint++
              that.setData({
                currentPrint: currentPrint,
                currentTime: 1,
              })
              that._send(buff)
            }
          }
        }
      })

    },

  }
})