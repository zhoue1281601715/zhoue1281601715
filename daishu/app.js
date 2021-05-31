
import NetWork from '/utils/modules/NetWork';
import { Config } from '/config';
const togerther = require("./pages/components/common/togerther.js")
const utils = require("./utils/utils.js")

// 代叔
const request = require("utils/request.js")
require('./pages/components/mixins/mixins.js')
// 代叔
App({
  togerther,
  utils,
  request, // 代叔
  onLoad(){
    // 隐藏原生的tabbar
    wx.hideTabBar()
  },
	onLaunch () {
    // 代叔

    this.globalData.sysinfo = wx.getSystemInfoSync()
    //设置初始化缓存
    if (!wx.getStorageSync("currentUserInfo")) {
      var storageInfo = {
        mobile: '',
        customer_id: ""
      };
      wx.setStorageSync("currentUserInfo", storageInfo);
    }
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      // console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
    this.get_system_info()
    // 代叔
  },

  onShow () {
   
  },

  onHide () {},

  /**
   * trigger 一个值
   */
  trigger (_event, _that){
    var _value = _event.currentTarget.dataset;
    var result = {};

    for(var i in _value){

      if(i.indexOf('jia_') == 0){
        var _key = i.replace('jia_', '');
        if(_value[i] == '^'){
          result[_key] = !_that.data[_key];
        }else{
          result[_key] = _value[i];
        }
      }
    }
    _that.setData(result);
  },

  /**
   * 返回网络请求类
   * @param {配置参数} options 
   * @param {类型} type 
   */
  http (options, type = 'request'){
    let net = new NetWork(Config.baseUrl, '/packageC/login/index');    
    return net._http(options, type);
  },
  
  https (options, type = 'request'){
    let net = new NetWork(Config.baseUrl2, '/packageC/login/index');
    return net._http(options, type);
  },

  /**
   * 设置标题
   * @param {页面标题} str 
   * @param {回调函数} fn 
   */
  setTitle (str, fn = () => {}) {
   	wx.setNavigationBarTitle({
   		title: str,
   		success: function () {
        fn();
      }
   	})
   },

   /* 隐藏分享功能 */
  hideShare() {
   	wx.hideShareMenu();
  },

   /* 分享功能 */
  showShare() {
   	wx.showShareMenu()
  },

   /* 拨打电话 */
  telPhone(tel, callback = () => {}) {
   	var that = this;
   	wx.makePhoneCall({
   		phoneNumber: tel
   	}, res => {
      callback()
    });
  },

  store : {
    // custom组件获取数据
    custom : {
      StatusBar: 0,
      CustomBar: {},
      Custom: 0,
      System : {},
      IsCorrecting : false   // 数据是否已经校正
    },
    cartStore : {
      
    }
  },
  
  get_system_info() {
    wx.getSystemInfo({
      success: (res) => {
        let get_system = (/Android/.test(res.system) ? true : false)
        let status_bar = res.statusBarHeight || 20
        wx.setStorageSync("get_system", get_system);
        wx.setStorageSync("status_bar", status_bar);
      },
      fail(err) {
        console.log('system_err----------', err)
        wx.setStorageSync("status_bar", 20);
      }
    })
  },
  getModel: function () {
    return this.globalData.sysinfo["model"]
  },
  getVersion: function () { 
    return this.globalData.sysinfo["version"]
  },
  getSystem: function () {
    return this.globalData.sysinfo["system"]
  },
  getPlatform: function () {
    return this.globalData.sysinfo["platform"]
  },
  getSDKVersion: function () {
    return this.globalData.sysinfo["SDKVersion"]
  },
  globalData: {
    tabIndex: 0,
    platform: ""
  },
  BLEInformation: {
    platform: "",
    deviceId: "",
    writeCharaterId: "",
    writeServiceId: "",
    notifyCharaterId: "",
    notifyServiceId: "",
    readCharaterId: "",
    readServiceId: "",
  }
});