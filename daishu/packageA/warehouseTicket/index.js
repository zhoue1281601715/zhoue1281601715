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
		date_list: [], // 导航栏列表
		currentTab: 0, // 导航下标
		warehouseTickerList: [], // 代金券列表
		thisPage: 1, // 当前页
		lastPage: 1, // 最后一页
		nowShow: 'all', // 当前显示
		month: '', // 月份
		year: '', // 年份
		loading: true, // 加载中
		activeIdx: -1,
		showView: true,

		modal : {
			tips : '提示',
			message : '模态框说明',
			ok : 'modalOk',
			cancel : 'modalCancel',
			ishide : true
		},
	
		// --  分页配置数据  -------- 
		page: {
			url: '/',
				data: {
				page: 1,
			}
		},
		isEnd: false,
		// ------------------------- 

	},

	onLoad (query){
		app.setTitle('填个标题吧')
		const that = this
		const date = new Date()
    const year = date.getFullYear()
		const month = date.getMonth() + 1
		let date_list = []
		date_list[0] = {year, month, typeof: 'number'}
		for (let i = 1; i < 6; i++) {
			let monthItem = (month + i) <= 12 ? (month + i) : (month + i - 12)
			let yearItem = (month + i) <= 12 ? year : (year + 1)
			date_list[i] = {year: yearItem, month: monthItem, typeof: 'number', url: ''}
		}
		date_list.unshift({year: '', month: '全部', typeof: 'string', url: ''})
		date_list.push({year: '', month: '购买记录', typeof: 'string', url: '/packageA/purchaseRecords/index'})
		console.log('date_list', date_list)
		that.setData({
			date_list
		})
	},

	onShow() {
		this.setData({
			warehouseTickerList: [],
			month: '',
			year: '',
			thisPage: 1,
			lastPage: 1,
			currentTab: 0,
			nowShow: 'all',
		}, function () {
			this.getAllWarehouseTicker()
		})
	},

	clickMes: function(){
		this.setData({
      showView: (!this.data.showView)
    })
	},

	/*============================================
	 			     以下是基本操作 				
	==============================================*/ 

	...utils,  // mixin方法

	trigger (e){
		app.trigger(e, this);
	},

	modalCancel (){
		this.setData({
			'modal.ishide' : true
		})
	},

	modalOk () {
		this.setData({
			'modal.ishide' : true
		})
	},

	switchNav (event) {
		console.log('switchNav')
		const that = this
		const cur = event.currentTarget.dataset.current // 点击的导航栏选项的下标
		const month = event.currentTarget.dataset.month // 导航栏选项的月份（如果该导航栏选项不是月份，则该值为""）
    if (that.data.currentTab == cur) { // 判断，当前点击导航栏选项是已经被选中了的导航栏选项，不执行后面的操作
			return false
		} else { // 判断，点击的是新的导航栏选项
			// 把点击的导航栏选项的下标更新到data
			that.setData({
				currentTab: cur
      }, function () {
				// 完成导航栏选项下标更新，执行以下操作
				if (typeof(month) === 'number') { // 判断，month的数据类型为number，证明点击的是月份导航栏选项
					const year = event.currentTarget.dataset.year // 导航栏选项的年份
					// 把点击的导航栏选项的 月份，年份 更新到data，并把当前页改为1，同时代金券列表清空(nowShow用来作为选项类型的标识，下拉分页要用到)
					that.setData({
						month,
						year,
						warehouseTickerList: [],
						thisPage: 1,
						nowShow: 'month'
					}, function () {
						// 完成数据更新，调用getMonthWarehoustTicker()获取点击的导航栏选项的月份的代金券
						that.getMonthWarehoustTicker()
					})
				} else { // 判断，month的类型不是number，证明点击的不是月份导航栏选项
					if (cur === 0) { // 判断，点击的导航栏选项下标为0，证明用户点击的是全部
						console.log('测试是否通过')
						// 清空代金券列表，并把当前页改为1(nowShow用来作为选项类型的标识，下拉分页要用到)
						that.setData({
							warehouseTickerList: [],
							thisPage: 1,
							nowShow: 'all',
						}, function () {
							// 完成数据更新，调用getAllWarehouseTicker()获取全部代金券
							that.getAllWarehouseTicker()
						})
					}
				}
			})
    }
	},

	/**
	 * 根据月份获取仓票
	 */
	getMonthWarehoustTicker () {
		const that = this
		const token = wx.getStorageSync('token')
		const month = that.data.month
		const year = that.data.year
		const page = that.data.thisPage
		wx.showLoading({
			title: '加载中...',
			complete: () => {
				that.setData({
					loading: true
				})
			}
		})
		app.http({
			config: {
				url: 'api/v1/get_stock',
				data: {
					token,
					month,
					year,
					page,
				},
				method: 'POST'
			},
			isAuth: true
		}).then(res => {
			console.log(res, 'navSearchRes')
			const warehouseTickerList = that.data.warehouseTickerList.length === 0 ? res.data.data.data : that.data.warehouseTickerList.concat(res.data.data.data)
			const lastPage = res.data.lastPage
			that.setData({
				warehouseTickerList,
				lastPage
			}, function () {
				setTimeout(() => {
					wx.hideLoading({
						complete: () => {
							that.setData({
								loading: false
							})
						}
					})
				}, 100)
			})
		}).catch(err => {
			console.log(err, 'navSearchErr')
		})
	},
	
	/**
	 * 获取全部仓票
	 */
	getAllWarehouseTicker () {
		const that = this
		const token = wx.getStorageSync('token')
		wx.showLoading({
			title: '加载中...',
			complete: () => {
				that.setData({
					loading: true
				})
			}
		})
		app.http({
			config: {
				url: 'api/v1/get_stock',
				data: {
					token,
					month: '',
					year: '',
					page: that.data.thisPage,
				},
				method: 'POST'
			},
			isAuth: true
		}).then(res => {
			console.log(res, 'allWarehouseTickerRes')
			// .slice(0,6) 截取前6个月的仓
			const warehouseTickerList = that.data.warehouseTickerList.length === 0 ? res.data.data.data.slice(0,6) : that.data.warehouseTickerList.concat(res.data.data.data)
			const lastPage = res.data.data.last_page
			that.setData({
				warehouseTickerList,
				lastPage
			}, function () {
				setTimeout(() => {
					wx.hideLoading({
						complete: () => {
							that.setData({
								loading: false
							})
						}
					})
				}, 100)
			})
		}).catch(err => {
			console.log(err, 'allWarehouseTickerErr')
			if (err.data.code == 401) {
				wx.navigateTo({
					url: '/packageC/login/index',
				})
			}
		})
	},

	/**
	 * 触底分页 (需要分页的请反我牌)
	 */
	onReachBottom() {
		const that = this
		let thisPage = that.data.thisPage
		let lastPage = that.data.lastPage
		if (thisPage < lastPage) {
			thisPage = thisPage + 1
			that.setData({
				thisPage
			}, function () {
				const nowShow = that.data.nowShow
				switch (nowShow) {
					case 'all':
						that.getAllWarehouseTicker()
						break;
					case 'month':
						that.getMonthWarehoustTicker()
						break;
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
