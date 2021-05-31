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
		warehouse: '',
		warehousIndex: '',
		warehouseList: [],
		startTime: '',
		endTime: '',
		keyword: '',
		typeIndex: '',
		thisPage: 1,
		lastPage: 1,
		limit: 30,
		conditionChange: false, // 查询条件是否改变
		queryFlag: false, // 是否点击过立即查询
		modal: {
			tips: '提示',
			message: '模态框说明',
			ok: 'modalOk',
			cancel: 'modalCancel',
			ishide: true
		},
		typeName: ['入仓', '出仓',],
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
	},

	handlePickerChange(e) {
		console.log(e, 'warehousIndex')
		if (this.data.warehousIndex === e.detail.value) {
			return false
		} else {
			this.setData({
				warehousIndex: e.detail.value,
				conditionChange: true
			})
		}
	},

	handerChangeStartTime(e) {
		console.log(e, 'startTime')
		if (this.data.startTime === e.detail.value) {
			return false
		} else {
			this.setData({
				startTime: e.detail.value,
				conditionChange: true
			})
		}
	},

	handerChangeEndTime(e) {
		console.log(e, 'endTime')
		if (this.data.endTime === e.detail.value) {
			return false
		} else {
			this.setData({
				endTime: e.detail.value,
				conditionChange: true
			})
		}
	},

	handerChangeType(e) {
		console.log(e, 'typeIndex')
		if (this.data.typeIndex === e.detail.value) {
			return false
		} else {
			this.setData({
				typeIndex: e.detail.value,
				conditionChange: true
			})
		}
	},

	getKeyword(e) {
		console.log(e, 'keyword')
		this.setData({
			keyword: e.detail.value,
			conditionChange: true
		})
	},

	onLoad(query) {
		app.setTitle('填个标题吧');
		this.getWarehouse()
		this.getWarehousesList()
	},

	onShow() {

	},

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
			isAuth: true
		}).then((res) => {
			console.log('getWarehouseRes', res)
			this.setData({
				warehouse: res.data.data
			})
		}).catch((err) => {
			console.log('getWarehouseErr', err)
		})
	},

	getWarehousesList () {
		var customer_id = wx.getStorageSync('customer_id')
		var table_num = wx.getStorageSync('table_num')
		app.https({
			config: {
				url: 'xcx/bill/list',
				data: {
					customer_id,
					table_num,
					warehouse_id: '',
					type: '',
					para1: '',
					startDate: '',
					endDate: '',
					page: this.data.thisPage,
					limit: this.data.limit,
				},
				method: 'POST'
			},
			isAuth: true
		}).then((res) => {
			console.log('getWarehousesListRes', res)
			const lastPage = Math.ceil(res.data.count / this.data.limit)
			const warehouseList = this.data.warehouseList.length > 0 ? this.data.warehouseList.concat(res.data.data) : res.data.data
			this.setData({
				warehouseList,
				lastPage
			})
		}).catch((err) => {
			console.log('getWarehousesListErr', err)
		})
	},

	/**
	 * 用户点击立即查询
	 */
	queryBtn() {
		const that = this
		if (!that.data.queryFlag) {
			that.setData({
				queryFlag: true
			})
		}
		if (that.data.conditionChange) {
			if (that.data.warehousIndex === '') {
				wx.showModal({
					content: '请选择仓库',
					showCancel: false
				})
				return false
			} else {
				if (that.data.keyword) {
					that.setData({
						thisPage: 1
					}, () => {
						that.handleQuery('clean')
					})
				} else {
					let start = that.data.startTime
					let end = that.data.endTime
					if (start === '' || end === '' || start >= end) {
						wx.showModal({
							content: '时间范围有误，请重新选择',
							showCancel: false
						})
						return false
					}
					that.setData({
						thisPage: 1
					}, () => {
						that.handleQuery('clean')
					})
				}
			}
		} else {
			if (that.data.warehousIndex === '') {
				wx.showModal({
					content: '请选择仓库',
					showCancel: false
				})
				return false
			} else {
				if (that.data.keyword) {
					that.handleQuery('concat')
				} else {
					let start = that.data.startTime
					let end = that.data.endTime
					if (start === '' || end === '' || start >= end) {
						wx.showModal({
							content: '时间范围有误，请重新选择',
							showCancel: false
						})
						return false
					}
					that.handleQuery('concat')
				}
			}
		}
	},

	/**
	 * 根据查询条件查询仓单列表
	 */
	handleQuery(e) {
		const status = e
		const that = this
		const customer_id = wx.getStorageSync('customer_id')
		const table_num = wx.getStorageSync('table_num')
		app.https({
			config: {
				url: 'xcx/bill/list',
				data: {
					customer_id,
					warehouse_id: that.data.warehouse[that.data.warehousIndex].id,
					table_num,
					type: that.data.typeIndex,
					para1: that.data.keyword,
					startDate: '',
					endDate: '',
					page: that.data.thisPage,
					limit: that.data.limit
				},
				method: 'POST'
			},
			isAuth: false
		}).then((res) => {
			console.log('queryBtnRes', res)
			let warehouseList = []
			if (status === 'clean') {
				warehouseList = res.data.data
			} else if (status === 'concat') {
				warehouseList = that.data.warehouseList.concat(res.data.data)
			}
			const lastPage = Math.ceil(res.data.count / that.data.limit)
			that.setData({
				warehouseList,
				lastPage,
				conditionChange: false
			})
		}).catch((err) => {
			console.log('queryBtnErr', err)
		})
	},

	/**
	 * 查看仓单详情
	 */
	/* handleNavigatorToDetails(e) {
		const that = this
		const id = e.currentTarget.dataset.id
		const warehouseList = that.data.warehouseList
		warehouseList.forEach(item => {
			if (item.id === id) {
				wx.setStorageSync('warehouseDetails', item)
				wx.navigateTo({
					url: '/packageC/orderDetails/index',
				})
			}
		})
	}, */

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
	 * 触底分页 (需要分页的请反我牌)
	 */
	onReachBottom() {
		const that = this
		let { thisPage, lastPage, queryFlag } = that.data
		if (thisPage < lastPage) {
			thisPage += 1
			that.setData({
				thisPage
			}, () => {
				if (queryFlag) {
					that.queryBtn()
				} else {
					that.getWarehousesList()
				}
			})
		}
	},

	/**
	 * 分页返回数据 (需要分页的请反我牌)
	 */
	pageSuccess(e) {
		this.setData({
			list: e.detail.list,
			isEnd: e.detail.isEnd
		})
	},

	pageFail(e) {

	},
	
	pageStart(e) {

	},
	
	/**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
