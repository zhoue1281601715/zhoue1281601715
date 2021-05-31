/**
 * 如果位目录层数大于两级需要修改路径
 */
const { $Toast, $Message } = require('../../utils/iview/base/index');
import Tools from '../../utils/modules/Tools';
import Config from '../../config';
import utils from '../../utils/utils';

const app = getApp();

Page({
	data: {
		modal: {
			tips: '提示',
			message: '模态框说明',
			ok: 'modalOk',
			cancel: 'modalCancel',
			ishide: true
		},
		// --  分页配置数据  -------- 
		page: {
			url: '',
			data: {
				page: 1,
			}
		},
		isEnd: false,
		// ------------------------- 
		activeIdx: -1,
		warehouse: '', // 仓库列表
		warehouse_id: '', // 仓库ID
		warehouse_id_change: false, // 仓库ID是否发生改变
		warehousIndex: '', // 当前选中的仓库的下标
		stockQueryKeyWord: '', // 产品名称/批次号
		warehouseList: [], // 查询结果
		thisPage: 1, // 当前页
		lastPage: 1, // 最后一页
		limit: 30, // 请求一次要求返回的数量
	},

	/**
	 * 用户选择仓库
	 * @param {*} e 
	 */
	handlePickerChange(e) {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		const that = this
		let { warehouse, warehousIndex } = that.data
		if (warehousIndex === e.detail.value) {
			return false
		} else {
			warehousIndex = e.detail.value
		}
    that.setData({
      warehousIndex,
			warehouse_id: warehouse[warehousIndex].id,
			warehouse_id_change: true
    })
	},

	/**
	 * 用户输入产品名称/批次号
	 * @param {*} e 
	 */
	getStockQueryKeyWord(e) {
		console.log(e, 'stockQueryKeyWord')
		this.setData({
			stockQueryKeyWord: e.detail.value
		})
	},

	onLoad(query) {
		app.setTitle('填个标题吧');
		this.getWarehouse()
		this.getStockList()
	},

	onShow() {

	},

	/**
	 * 获取仓库列表
	 */
	getWarehouse() {
		var customer_id = wx.getStorageSync('customer_id')
		app.https({
			config: {
				url: 'xcx/warehouse/list',
				data: {
					customer_id,
				},
				method: 'POST'
			},
			isAuth: false
		}).then((res) => {
			console.log('getWarehouseRes', res)
			this.setData({
				warehouse: res.data.data
			})
		}).catch((err) => {
			console.log('getWarehouseErr', err)
		})
	},

	getStockList() {
		const that = this
		const customer_id = wx.getStorageSync('customer_id')
		console.log('customer_id:',customer_id);
		
		const table_num = wx.getStorageSync('table_num')
    let { warehouse_id, warehouse_id_change, stockQueryKeyWord, thisPage, limit } = that.data
		const lastStockQueryKeyWord = wx.getStorageSync('stockQueryKeyWord')
		if (lastStockQueryKeyWord === stockQueryKeyWord) {
			const page = Number(wx.getStorageSync('stockQueryPage'))
			if (page === thisPage) {
				if (warehouse_id_change) {
					that.setData({
						thisPage: 1,
						warehouseList: []
					})
				} else {
					return false
				}
			} else {
				wx.setStorageSync('stockQueryPage', thisPage)
			}
		} else {
			thisPage = 1
			wx.setStorageSync('stockQueryKeyWord', stockQueryKeyWord)
			wx.setStorageSync('stockQueryPage', thisPage)
			that.setData({
				thisPage,
				warehouseList: []
			})
		}
    wx.showLoading({
      title: '加载中',
    })
		app.https({
			config: {
				url: 'xcx/stock/list_merge',
				data: {
					customer_id,  
					table_num,
					warehouse_id,
					para1: stockQueryKeyWord,
					page: thisPage,
					limit
				},
				method: 'POST'
			},
			isAuth: false
		}).then((res) => {
			console.log('getStockListRes', res)
			const lastPage = Math.ceil(res.data.count / that.data.limit)
      const warehouseList = that.data.warehouseList.length > 0 ? that.data.warehouseList.concat(res.data.data) : res.data.data
      that.setData({
				warehouse_id_change: false,
        warehouseList,
        lastPage
      })
      wx.hideLoading()
		}).catch((err) => {
			wx.hideLoading()
			wx.hideLoading({
				success:res=>{
					$Toast({
						content: err.data.msg,
						type: 'error'
					})
				}
			})
			// console.log('getStockListErr', err)
			
		})
	},

	/*============================================
							 以下是基本操作 				
	==============================================*/

	...utils,  // mixin方法

	trigger(e) {
		app.trigger(e, this);
	},

	modalCancel() {
		this.setData({
			'modal.ishide': true
		})
	},

	modalOk() {
		this.setData({
			'modal.ishide': true
		})
	},

	/**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.setStorageSync('stockQueryPage', '')
	},
	
	/**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
		wx.setStorageSync('stockQueryPage', '')
  },

	/**
	 * 触底分页 (需要分页的请反我牌)
	 */
	onReachBottom() {
		const that = this
    let { thisPage, lastPage } = that.data
		if (thisPage < lastPage) {
			wx.setStorageSync('stockQueryPage', thisPage)
			const newThisPage = thisPage + 1
			that.setData({
				thisPage: newThisPage
			}, () => {
				that.getStockList()
			})
		}
	},
	
	/**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
