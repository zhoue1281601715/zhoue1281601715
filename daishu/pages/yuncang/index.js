/**
 * 如果位目录层数大于两级需要修改路径
 */
const { $Toast, $Message } = require('../../utils/iview/base/index');
var dateTimePicker =require('../../utils/dateTimePicker')
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
    activeIdx: 1, // tabbar当前下标
    CustomBar: 0, // 自定义导航栏高度
    sectionArr:[],
    section: ['入仓', '出仓'], // 导航栏
    appointmentSection:['预约入仓','预约出仓'],
    yuyIndex:'',
    sectionShow: 0, // 当前展示的区间的下标
    pickerIndex: '', // 仓库列表当前选中的仓库的下标
    warehouse_id: '', // 仓库列表当前选中的仓库的ID
    thisPage: 1, // 商品列表当前页
    lastPage: 1, // 商品列表最后一页
    deliveryThisPage: 1, // 出仓查询到的库存列表当前页
    deliveryLastPage: 1, // 出仓查询到的库存列表最后一页
    limit: 30, // 请求一次要求返回的商品数量
    name: '', // 用户在入仓区间搜索商品时输入的商品名称
    goodsList: [], // 商品列表
    warehousingPopupShow: false, // 入仓弹窗是否显示
    warehousingID: '', // 选中的入仓商品ID
    warehousingDetails: '', // 选中的入仓商品详情
    oneKindWarehousingTotal: '', // 用户填写的单种商品的入仓总数
    warehousingPackageNum: '', // 用户填写的入仓箱数
    warehousingStockNum: '', // 用户填写的入仓瓶数
    warehousingBatch1: '', // 用户填写的入仓批次号1
    warehousingBatch2: '', // 用户填写的入仓批次号2
    warehousingProductionDate: '', // 入仓生产日期
    warehousingExpireDate: '', // 入仓到期日期
    warehousingRemark: '', // 用户填写的入仓备注
    warehousingTotal: '', // 用户入仓所有商品的入仓总数
    warehousingList: [], // 已选择的入仓商品列表
    warehouseList: [], // 仓库列表
    para1: '', // 出仓查询用户输入的产品名称
    deliveryQueryList: [], // 出仓查询到的库存列表
    deliveryPopupShow: false, // 出仓弹窗是否显示
    deliveryID: '', // 选中的出仓商品ID
    deliveryDetails: '', // 选中的出仓商品详情
    oneKindDeliveryTotal: '', // 用户填写的单种商品的出仓总数
    deliveryPackageNum: '', // 出仓箱数
    deliveryStockNum: '', // 出仓瓶数
    deliveryTotal: '', // 出仓已选择数量
    deliveryList: [], // 已选择的出仓商品列表
    comGoodsList:{},//预约入当
    Plate:'',//车牌号
    driver:'',//送货司机
    phone:'',//送货司机号码
    time:'',
    // 
    dateTime:'',
    dateTimeArray:'',
    startT:'',
    datetimeend:'',
    dateTimeendArray:'',
    endT:'',
    code:'',//车牌号
  },

  /**
   * 切换区间
   */
  handleChangeSection(e) {
    const that = this
    const index = e.currentTarget.dataset.index
    if (index === that.data.sectionShow) {
      return false
    } else {
      that.setData({
        sectionShow: index
      })
    }
  },

  /**
   * 用户输入商品名称
   */
  handleInputGoodsName(e) {
    const that = this
    const name = e.detail.value
    that.setData({
      name
    })
  },
  handleInputGoodsCode(e){
    const that = this 
    const code = e.detail.value
    console.log(code);
    
    that.setData({
      code
    })
  },
  /**
   * 商品列表
   */
  getGoodsList() {
    const that = this
    const customer_id = wx.getStorageSync('customer_id')
    const table_num = wx.getStorageSync('table_num')
    let { name, thisPage } = that.data
    const lastName = wx.getStorageSync('warehousingGoodsName')
    if (lastName === name) {
      const page = Number(wx.getStorageSync('warehousingPage'))
      if (page === thisPage) {
        return false
      } else {
        wx.setStorageSync('warehousingPage', thisPage)
      }
    } else {
      thisPage = 1
      wx.setStorageSync('warehousingGoodsName', name)
      wx.setStorageSync('warehousingPage', thisPage)
      that.setData({
        thisPage,
        goodsList: []
      })
    }
    wx.showLoading({
      title: '加载中',
    })
    app.https({
      config: {
        url: 'xcx/item/list',
        data: {
          customer_id,
          table_num,
          name,
          page: thisPage,
          limit: that.data.limit
        },
        method: 'POST'
      },
      isAuth: false
    }).then((res) => {
      console.log('getGoodsListRes', res)
      const lastPage = Math.ceil(res.data.count / that.data.limit)
      const goodsList = that.data.goodsList.length > 0 ? that.data.goodsList.concat(res.data.data) : res.data.data
      that.setData({
        goodsList,
        lastPage
      })
      wx.hideLoading()
    }).catch((err) => {
      console.log('getGoodsListErr', err)
      wx.hideLoading({
        success: res => {
          $Toast({
            content: err.data.data,
            type: 'error'
          })
        }
      })
    })
  },

  /**
   * 获取仓库列表
   */
  getWarehouseList() {
    const that = this
    const customer_id = wx.getStorageSync('customer_id')
    app.https({
      config: {
        url: 'xcx/warehouse/list',
        data: {
          customer_id
        },
        method: 'POST'
      },
      isAuth: false
    }).then((res) => {
      console.log('getWarehouseListRes', res)
      that.setData({
        warehouseList: res.data.data,
        warehouse_id: res.data.data[0].id
      })
    }).catch((err) => {
      console.log('getWarehouseListErr', err)
    })
  },

  /**
   * 选择入仓生产日期
   * @param {*} e 
   */
  bindWarehousingProductionDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      warehousingProductionDate: e.detail.value
    })
  },

  /**
   * 选择入仓到期日期
   * @param {*} e 
   */
  bindWarehousingExpireDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      warehousingExpireDate: e.detail.value
    })
  },

  /**
   * 打开入仓弹窗
   */
  handleOpenWarehousingPopup(e) {
    const that = this
    const id = e.currentTarget.dataset.id
    const { warehousingID, warehousingDetails, goodsList, warehousingList } = that.data
    const warehousingListLen = warehousingList.length
    const goodsListLen = goodsList.length
    if (warehousingID === id) {
      this.setData({
        warehousingPopupShow: true,
        warehousingBatch1: warehousingDetails.batch1,
        warehousingBatch2: warehousingDetails.batch2,
        warehousingRemark: warehousingDetails.remark
      })
    } else {
      if (warehousingListLen > 0) {
        let isFound = false
        for (let i = 0; i < warehousingListLen; i++) {
          if (warehousingList[i].id === id) {
            that.setData({
              warehousingID: warehousingList[i].id,
              warehousingDetails: warehousingList[i],
              oneKindWarehousingTotal: warehousingList[i].totalNum,
              warehousingPackageNum: warehousingList[i].packageNum,
              warehousingStockNum: warehousingList[i].stockNum,
              warehousingBatch1: warehousingList[i].batch1,
              warehousingBatch2: warehousingList[i].batch2,
              warehousingProductionDate: warehousingList[i].production_date,
              warehousingExpireDate: warehousingList[i].expiration_date,
              warehousingRemark: warehousingList[i].remark,
              warehousingPopupShow: true
            })
            isFound = true
            break;
          }
        }
        for (let i = 0; i < goodsListLen; i++) {
          if (isFound) {
            break;
          } else {
            if (goodsList[i].id === id) {
              that.setData({
                warehousingID: goodsList[i].id,
                warehousingDetails: goodsList[i],
                oneKindWarehousingTotal: '',
                warehousingPackageNum: '',
                warehousingStockNum: '',
                warehousingBatch1: '',
                warehousingBatch2: '',
                warehousingProductionDate: '',
                warehousingExpireDate: '',
                warehousingRemark: '',
                warehousingPopupShow: true
              })
              break;
            }
          }
        }
      } else {
        for (let i = 0; i < goodsListLen; i++) {
          if (goodsList[i].id === id) {
            that.setData({
              warehousingID: goodsList[i].id,
              warehousingDetails: goodsList[i],
              oneKindWarehousingTotal: '',
              warehousingPackageNum: '',
              warehousingStockNum: '',
              warehousingBatch1: '',
              warehousingBatch2: '',
              warehousingProductionDate: '',
              warehousingExpireDate: '',
              warehousingRemark: '',
              warehousingPopupShow: true
            })
            break;
          }
        }
      }
    }
    
  },
  handleOpenWarehousingPopup1(){
    const that = this 
    if(that.data.yuyIndex==1&&that.data.comGoodsList.details!=null){
      that.setData({
        warehousingPopupShow: true,
      })
    }
  },

  /**
   * 关闭入仓弹窗
   */
  handleCloseWarehousingPopup() {
    this.setData({
      warehousingPopupShow: false
    })
  },

  /**
   * 入仓下单
   */
  handleWarehousingPlaceAnOrder() {
    let mobile='17695465022'
    app.https({
      config: {
        url: 'yuyue/list_customer',
        data: {
          mobile
        },
        
      },
    }).then((res)=>{
      console.log(res);
      
    })
    const that = this
    const { warehousingList } = that.data
    if (warehousingList.length === 0) {
      wx.showToast({
        title: '请先添加入仓商品',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.showLoading({
        title: '请稍候',
      })
      wx.setStorageSync('warehousingList', warehousingList)
      wx.navigateTo({
        url: '/packageB/warehouseReceipt/index?yuyIndex2='+that.data.yuyIndex,
        complete: function(res) {
          wx.hideLoading()
        }
      })
    }
  },

  /**
   * 打开出仓弹窗
   */
  handleOpenDeliveryPopup(e) {
    const that = this
    const id = e.currentTarget.dataset.id
    const { deliveryID, deliveryQueryList, deliveryList } = that.data
    const deliveryListLen = deliveryList.length
    const deliveryQueryListLen = deliveryQueryList.length
    if (deliveryID === id) {
      this.setData({
        deliveryPopupShow: true,
      })
    } else {
      if (deliveryListLen > 0) {
        let isFound = false
        for (let i = 0; i < deliveryListLen; i++) {
          if (deliveryList[i].id === id) {
            that.setData({
              deliveryID: deliveryList[i].id,
              deliveryDetails: deliveryList[i],
              oneKindDeliveryTotal: deliveryList[i].totalNum,
              deliveryPackageNum: deliveryList[i].packageNum,
              deliveryStockNum: deliveryList[i].stockNum,
              deliveryPopupShow: true
            })
            isFound = true
            break;
          }
        }
        for (let i = 0; i < deliveryQueryListLen; i++) {
          if (isFound) {
            break;
          } else {
            if (deliveryQueryList[i].id === id) {
              that.setData({
                deliveryID: deliveryQueryList[i].id,
                deliveryDetails: deliveryQueryList[i],
                oneKindDeliveryTotal: '',
                deliveryPackageNum: '',
                deliveryStockNum: '',
                deliveryPopupShow: true
              })
              break;
            }
          }
        }
      } else {
        for (let i = 0; i < deliveryQueryListLen; i++) {
          if (deliveryQueryList[i].id === id) {
            that.setData({
              deliveryID: deliveryQueryList[i].id,
              deliveryDetails: deliveryQueryList[i],
              oneKindDeliveryTotal: '',
              deliveryPackageNum: '',
              deliveryStockNum: '',
              deliveryPopupShow: true
            })
            break;
          }
        }
      }
    }
  },

  /**
   * 关闭出仓弹窗
   */
  handleCloseDeliveryPopup() {
    this.setData({
      deliveryPopupShow: false
    })
  },

  /**
   * 阻止冒泡
   */
  stopBubbling() {},

  /**
   * 用户填写单种商品的入仓总数
   */
  handleOneKindWarehousingTotal(e) {
    const that = this
    let { oneKindWarehousingTotal, warehousingPackageNum, warehousingStockNum } = that.data
    const { multiple } = that.data.warehousingDetails
    const value = Number(e.detail.value)
    oneKindWarehousingTotal = value
    warehousingPackageNum = Math.floor(value / multiple)
    warehousingStockNum = value >= multiple ? (value % multiple) : value
    that.setData({
      oneKindWarehousingTotal,
      warehousingPackageNum,
      warehousingStockNum
    })
  },

  /**
   * 用户填写入仓箱数
   */
  handleWarehousingPackageNumInput(e) {
    const that = this
    let { oneKindWarehousingTotal, warehousingPackageNum, warehousingStockNum } = that.data
    const { multiple } = that.data.warehousingDetails
    const value = Number(e.detail.value)
    oneKindWarehousingTotal = value * multiple + warehousingStockNum
    warehousingPackageNum = value
    that.setData({
      oneKindWarehousingTotal,
      warehousingPackageNum
    })
  },

  /**
   * 用户填写入仓瓶数
   */
  handleWarehousingStockNumInput(e) {
    const that = this
    let { oneKindWarehousingTotal, warehousingPackageNum, warehousingStockNum } = that.data
    const { multiple } = that.data.warehousingDetails
    const value = Number(e.detail.value)
    oneKindWarehousingTotal = warehousingPackageNum * multiple + value
    warehousingStockNum = value
    that.setData({
      oneKindWarehousingTotal,
      warehousingStockNum
    })
  },

  /**
   * 用户填写入仓备注
   */
  handleWarehousingRemarkInput(e) {
    const that = this
    const remark = e.detail.value
    that.setData({
      warehousingRemark: remark
    })
  },

  /**
   * 用户点击"添加到入仓"按钮
   */
  warehousingFormSubmit(e) {
    const that = this
   if(that.data.yuyIndex==1){
     console.log(e,123123);
     let {
     driver,
     phone,
     plate,
     remark,
     }=e.detail.value
     let time=that.data.startT.slice(0,14)+'00'+'-'+that.data.endT.slice(-8).slice(0,3)+'00'
     console.log(time);
     
     let warehouse_id =that.data.comGoodsList.warehouse_id
     let warehouse_name =that.data.comGoodsList.warehouse_name
     let bill_code =that.data.comGoodsList.code
     console.log('warehouse_id',warehouse_id);
     console.log('warehouse_name',warehouse_name);
     console.log('warehouse_name',bill_code);
     if(driver==''){
      wx.showToast({
        title: '请先输入司机姓名',
        icon: 'none',
        duration: 2000
      })
     }else if (phone=='') {
      wx.showToast({
        title: '请先输入送货司机电话',
        icon: 'none',
        duration: 2000
      })
     } else if(plate==''){
      wx.showToast({
        title: '请先输入车牌号',
        icon: 'none',
        duration: 2000
      })
     }else{
      app.https({
        config: {
          url: 'xcx/yuyue/save',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          dataType: 'json',
          data: {
            warehouse_id,
            warehouse_name,
            bill_code,
            driver,
            phone,
            plate,
            remark,
            time
          },
        },
      }).then((res)=>{   
        if(res.data.code==200){
         that.setData({
           comGoodsList:{}
         })
         console.log('that.data.comGoodsList:',that.data.comGoodsList);
         
        }
      })
      that.setData({
        warehousingPopupShow: false
      })
      wx.showToast({
        title: '添加预约成功',
        icon: 'none',
        duration: 2000
      })
     }
     
   
   }else{
    let { warehousingID, warehousingDetails, warehousingList, warehousingProductionDate, warehousingExpireDate } = that.data
    const { totalNum, packageNum, stockNum, batch1, batch2, remark } = e.detail.value
    warehousingDetails.totalNum = totalNum
    warehousingDetails.packageNum = packageNum
    warehousingDetails.stockNum = stockNum
    warehousingDetails.batch1 = batch1
    warehousingDetails.batch2 = batch2
    warehousingDetails.production_date = warehousingProductionDate
    warehousingDetails.expiration_date = warehousingExpireDate
    warehousingDetails.remark = remark
    const warehousingListLen = warehousingList.length
    console.log('totalNum:',totalNum);
    console.log('warehousingList:',warehousingList);
    
    if (warehousingListLen > 0) {
      for (let i = 0; i < warehousingListLen; i++) {
        if (warehousingList[i].id === warehousingID) {
          console.log('warehousingList[i].id', warehousingList[i].id)
          console.log('warehousingID', warehousingID)
          warehousingList.splice(i, 1, warehousingDetails)
          break;
        } else {
          if (i === (warehousingListLen - 1)) {
            warehousingList.push(warehousingDetails)
          }
        }
      }
    } else {
      warehousingList.push(warehousingDetails)
    }
    that.setData({
      warehousingList,
      warehousingDetails
    }, () => {
      let warehousingTotal = 0
      console.log('warehousingList12313zhouhe:',warehousingList);
      
      warehousingList.forEach(item => {
        warehousingTotal += Number(item.totalNum)
        console.log('warehousingTotal',warehousingTotal);
        
      })
      that.setData({
        warehousingTotal,
        warehousingPopupShow: false
      })
    })
   }
   console.log('warehousingList',this.data.warehousingTotal);
   
  },

  /**
   * 仓库列表选择仓库
   */
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const that = this
    const { warehouseList } = that.data
    const pickerIndex = e.detail.value
    that.setData({
      pickerIndex,
      warehouse_id: warehouseList[pickerIndex].id
    })
  },

  /**
   * 用户输入产品名称
   */
  handleProductNameInput(e) {
    const that = this
    const para1 = e.detail.value
    that.setData({
      para1
    })
  },

  /**
   * 出仓库存查询
   */
  handleDeliveryQuery() {
    const that = this
    const customer_id = wx.getStorageSync('customer_id')
    const table_num = wx.getStorageSync('table_num')
    let { warehouse_id, deliveryThisPage, limit, para1 } = that.data
    const queryWarehouse_id = wx.getStorageSync('queryWarehouse_id')
    const queryPara1 = wx.getStorageSync('queryPara1')
    if (queryWarehouse_id != warehouse_id || queryPara1 != para1) {
      deliveryThisPage = 1
      that.setData({
        deliveryThisPage,
        deliveryQueryList: []
      })
    }
    wx.showLoading({
      title: '加载中',
    })
    app.https({
      config: {
        url: 'xcx/stock/list_merge_pick',
        data: {
          warehouse_id,
          customer_id,
          table_num,
          para1,
          page: deliveryThisPage,
          limit
        },
        method: 'POST'
      },
      isAuth: true
    }).then((res) => {
      console.log('handleDeliveryQueryRes', res)
      wx.setStorageSync('queryWarehouse_id', warehouse_id)
      wx.setStorageSync('queryPara1', para1)
      const deliveryLastPage = Math.ceil(res.data.count / that.data.limit)
      const deliveryQueryList = that.data.deliveryQueryList.length > 0 ? that.data.deliveryQueryList.concat(res.data.data) : res.data.data
      that.setData({
        deliveryQueryList,
        deliveryLastPage
      })
      wx.hideLoading()
    }).catch((err) => {
      console.log('handleDeliveryQueryErr', err)
      wx.hideLoading({
        success: res => {
          $Toast({
            content: err.data.data,
            type: 'error'
          })
        }
      })
    })
  },

  /**
   * 用户填写单种商品的出仓总数
   */
  handleOneKindDeliveryTotal(e) {
    const that = this
    let { oneKindDeliveryTotal, deliveryPackageNum, deliveryStockNum } = that.data
    const { item_multiple } = that.data.deliveryDetails
    const value = Number(e.detail.value)
    oneKindDeliveryTotal = value
    deliveryPackageNum = Math.floor(value / item_multiple)
    deliveryStockNum = value >= item_multiple ? (value % item_multiple) : value
    that.setData({
      oneKindDeliveryTotal,
      deliveryPackageNum,
      deliveryStockNum
    })
  },

  /**
   * 用户填写出仓箱数
   */
  handleDeliveryPackageNumInput(e) {
    const that = this
    let { oneKindDeliveryTotal, deliveryPackageNum, deliveryStockNum } = that.data
    const { item_multiple } = that.data.deliveryDetails
    const value = Number(e.detail.value)
    oneKindDeliveryTotal = value * item_multiple + deliveryStockNum
    deliveryPackageNum = value
    that.setData({
      oneKindDeliveryTotal,
      deliveryPackageNum
    })
  },

  /**
   * 用户填写出仓瓶数
   */
  handleDeliveryStockNumInput(e) {
    const that = this
    let { oneKindDeliveryTotal, deliveryPackageNum, deliveryStockNum } = that.data
    const { item_multiple } = that.data.deliveryDetails
    const value = Number(e.detail.value)
    oneKindDeliveryTotal = deliveryPackageNum * item_multiple + value
    deliveryStockNum = value
    that.setData({
      oneKindDeliveryTotal,
      deliveryStockNum
    })
  },

  /**
   * 用户点击"添加到出仓"按钮
   */
  deliveryFormSubmit(e) {
    console.log('e', e)
    const that = this
    let { deliveryID, deliveryDetails, deliveryPackageNum, deliveryStockNum, deliveryList } = that.data
    const { totalNum } = e.detail.value
    if (totalNum <= deliveryDetails.quantity) {
      deliveryDetails.totalNum = totalNum
      deliveryDetails.packageNum = deliveryPackageNum
      deliveryDetails.stockNum = deliveryStockNum
      const deliveryListLen = deliveryList.length
      if (deliveryListLen > 0) {
        for (let i = 0; i < deliveryListLen; i++) {
          if (deliveryList[i].id === deliveryID) {
            console.log('deliveryList[i].id', deliveryList[i].id)
            console.log('deliveryID', deliveryID)
            deliveryList.splice(i, 1, deliveryDetails)
            break;
          } else {
            if (i === (deliveryListLen - 1)) {
              deliveryList.push(deliveryDetails)
            }
          }
        }
      } else {
        deliveryList.push(deliveryDetails)
      }
      that.setData({
        deliveryList,
        deliveryDetails
      }, () => {
        let deliveryTotal = 0
        deliveryList.forEach(item => {
          deliveryTotal += Number(item.totalNum)
        })
        that.setData({
          deliveryTotal,
          deliveryPopupShow: false
        })
      })
    } else {
      wx.showToast({
        title: '出库数量不能大于库存数量',
        icon: 'none',
        duration: 3000
      })
    }
  },

  /**
   * 出仓下单
   */
  handleDeliveryPlaceAnOrder() {
    const that = this
    const { deliveryList } = that.data
    if (deliveryList.length === 0) {
      wx.showToast({
        title: '请先添加出仓商品',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.showLoading({
        title: '请稍候',
      })
      wx.setStorageSync('deliveryList', deliveryList)
      wx.navigateTo({
        url: '/packageB/warehouseOutReceipt/index?yuyIndex2='+that.data.yuyIndex,
        complete: function(res) {
          wx.hideLoading()
        }
      })
    }
  },
  changeDateTime(e) {
    this.setData({
      dateTime: e.detail.value
    })
    var startT = dateTimePicker.formatPickerDateTime(this.data.dateTimeArray, this.data.dateTime)
    this.setData({
      startT: startT
    })
  },
  changeDateend(e) {
    this.setData({
      datetimeend: e.detail.value
    })
    var endT = dateTimePicker.formatPickerDateTime(this.data.dateTimeendArray, this.data.datetimeend)
    this.setData({
      endT: endT
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'zhouhe');
    
    const that = this
    const CustomBar = app.store.custom.CustomBar
    wx.hideTabBar()
		that.setData({
      CustomBar,
      yuyIndex:options.yuyIndex1
    })
    console.log('options.yuyIndex1:',options.yuyIndex1);
    
    if(options.yuyIndex1==1){
      that.setData({
        sectionArr:that.data.appointmentSection,
      })
      
      console.log('that.data.sectionArr:12',123123);
      console.log('that.data.sectionArr',that.data.sectionArr);
      
    }else{
      that.setData({
        sectionArr:that.data.section,
      })
      
    }
    console.log('that.yuyIndex123123:',options);
    that.getGoodsList()
    that.handleDeliveryQuery()


    var start = '2000-04-26 15:26:56'
    var obj = dateTimePicker.dateTimePicker(2015,2100,start);
    this.setData({
        dateTime: obj.dateTime,
        dateTimeArray: obj.dateTimeArray,
        datetimeend: obj.dateTime,
        dateTimeendArray: obj.dateTimeArray
    });
    var endT = dateTimePicker.formatPickerDateTime(this.data.dateTimeendArray,this.data.dateTime)
    var startT = dateTimePicker.formatPickerDateTime(this.data.dateTimeArray,this.data.datetimeend)
    this.setData({
      endT: endT,
      startT:startT
    })
    
    
  },
  getAppointmentList:function(){
    const that = this
    let code = that.data.code
    if(code==''){
      wx.showToast({
        title: '请先输入入仓单号',
        icon: 'none',
        duration: 2000
      })
    }else{
      wx.showLoading({
        title: '加载中',
      })
      app.https({
        config: {
          url: 'xcx/bill/get_code',
          data: {
            code
          },
        },
      }).then((res)=>{
        if(res.data.code==200){
          wx.hideLoading()
          that.setData({
            comGoodsList:res.data.data
          })
        }   
        
      }).catch(err=>{
        console.log(err,'werw');
        wx.hideLoading({
          success:res=>{
            $Toast({
              content: err.data.msg,
              type: 'error'
            })
          }
        })
      })
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
    const that = this
    const logout = wx.getStorageSync('logout')
    if (logout === 'success') {
      that.setData({
        goodsList: [],
        warehouseList: [],
        warehousingTotal: '',
        deliveryQueryList: [],
        deliveryTotal: '',
      }, () => {
        wx.removeStorageSync('logout')
        wx.showModal({
          title: '提示',
          content: '请授权并登录',
          success (res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '/packageC/login/index?relogin=relogin'
              })
            }
          }
        })
      })
    } else {
      that.getWarehouseList() // 获取仓库列表
      const sectionShow = wx.getStorageSync('sectionShow') === '1' ? 1 : 0
      that.setData({
        sectionShow
      }, () => {
        wx.setStorageSync('sectionShow', '0')
      })
      const warehousingList = wx.getStorageSync('warehousingList')
      console.log('warehousingList', warehousingList)
      if (warehousingList) {
        const warehousingListLen = warehousingList.length
        if (warehousingListLen > 0) {
          console.log('warehousingList:1231',warehousingList);
          
          const lastIndex = warehousingListLen - 1
          let warehousingTotal = 0
          warehousingList.forEach(item => {
            warehousingTotal += Number(item.totalNum)
   
            
          })
          that.setData({
            warehousingID: warehousingList[lastIndex].id,
            warehousingDetails: warehousingList[lastIndex],
            oneKindWarehousingTotal: warehousingList[lastIndex].totalNum,
            warehousingPackageNum: warehousingList[lastIndex].packageNum,
            warehousingStockNum: warehousingList[lastIndex].stockNum,
            warehousingBatch1: warehousingList[lastIndex].batch1,
            warehousingBatch2: warehousingList[lastIndex].batch2,
            warehousingProductionDate: warehousingList[lastIndex].production_date,
            warehousingExpireDate: warehousingList[lastIndex].expiration_date,
            warehousingRemark: warehousingList[lastIndex].remark,
            warehousingTotal,
            warehousingList
          })
        } else {
          that.setData({
            warehousingID: '',
            warehousingDetails: '',
            oneKindWarehousingTotal: '',
            warehousingPackageNum: '',
            warehousingStockNum: '',
            warehousingBatch1: '',
            warehousingBatch2: '',
            warehousingProductionDate: '',
            warehousingExpireDate: '',
            warehousingRemark: '',
            warehousingTotal: '',
            warehousingList: []
          })
        }
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.setStorageSync('warehousingPage', '')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.setStorageSync('warehousingPage', '')
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
    const that = this
    let { thisPage, lastPage, deliveryThisPage, deliveryLastPage, sectionShow } = that.data
    switch (sectionShow) {
      case 0:
        if (thisPage < lastPage) {
          wx.setStorageSync('warehousingPage', thisPage)
          const newThisPage = thisPage + 1
          that.setData({
            thisPage: newThisPage
          }, () => {
            that.getGoodsList()
          })
        }
        break;
      case 1:
        if (deliveryThisPage < deliveryLastPage) {
          deliveryThisPage += 1
          that.setData({
            deliveryThisPage
          }, () => {
            that.handleDeliveryQuery()
          })
        }
        break;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})