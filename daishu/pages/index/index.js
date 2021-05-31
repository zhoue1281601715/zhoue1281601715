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
		loading: true,
		activeIdx: 0,
		modal: {
			tips: '提示',
			message: '模态框说明',
			ok: 'modalOk',
			cancel: 'modalCancel',
			ishide: true
		},
		options: app.store.cartStore,
		// --  分页配置数据  -------- 
		page: {
			url: '/',
			data: {
				page: 1,
			}
		},
		isEnd: false,
		// ------------------------- 
		loadPromise: [],
		indexData: {},
		orderNum: '',
		timer: null,
		CustomBar: 0, // 自定义导航栏高度
		agent_id: '', // 上级ID
		// 拖拽参数
		x: 15,
    y: 15,
	},

	/**
	 * 跳转到出仓
	 */
	handleNavigatorToDelivery() {
		wx.setStorageSync('sectionShow', '1')
		wx.showToast({
			title: '开发中！',
			icon: 'none',
			duration: 1500
		})
		// wx.reLaunch({
		// 	url: '/pages/yuncang/index?yuyIndex1=1',
		// })
	},

	/**
	 * 首页数据
	 */
	getIndexData () {
		const that = this
		app.http({
			config: {
				url: 'api/v1/index',
				data: {},
				method: 'POST'
			},
			isAuth: false
		}).then(res => {
			console.log(res, 'indexDataRes')
			const indexData = res.data.data
			that.setData({
				indexData
			})
		}).catch(err => {
			console.log(err, 'indexDataErr')
			if (err.data.code == 401) {
				wx.showModal({
					title: '提示',
					content: '请登录并授权',
					success(res) {
						if (res.confirm) {
							wx.navigateTo({
								url: '/packageC/login/index',
							})
						}
					}
				})
			}
		})
	},

	/**
	 * 用户输入运单号
	 */
	handleInput(e) {
		const that = this
		const orderNum = e.detail.value
		let timer = that.data.timer
		if (timer) {
			clearTimeout(timer)
		}
		that.data.timer = setTimeout(() => {
			that.setData({
				orderNum
			})
		}, 500)
	},

	/**
	 * 用户点击查询输入框右边"x"号删除运单号
	 */
	handleDeleteOrderNum() {
		const that = this
		that.setData({
			orderNum: ''
		})
	},

	/**
	 * 用户点击查询按钮
	 */
	handleSearch() {
		const that = this
		const orderNum = that.data.orderNum
		that.setData({
			orderNum: ''
		}, () => {
			wx.navigateTo({
				url: `/packageA/waybill_search/waybill_search?orderNum=${orderNum}`,
			})
		})
	},

	/**
   * 计算默认定位值 
   */ 
  getSysdata () {
    let that = this
    wx.getSystemInfo({
      success (e) {
				const windowWidth = e.windowWidth
				const windowHeight = e.windowHeight
				console.log('测试',e)
				return false
        // 获取元素宽高
				wx.createSelectorQuery().select('.movable-name').boundingClientRect(function (res) {
					const x = windowWidth - res.width - 15
					const y = windowHeight - res.height - 180
					that.setData({
						x,
						y
					})
				}).exec()
      },
      fail (e) {
        console.log(e)
      }
    })
	},

	/**
	 * 获取用户基本信息
	 */
	getUserInfomation () {
		const that = this
		const token = wx.getStorageSync('token')
		app.http({
			config: {
				url: 'api/v1/user_info',
				data: {
					token
				},
				method: 'POST'
			},
			isAuth: false
		}).then(res => {
			console.log(res, 'getUserInfomationRes')
			const currentUserInfo = res.data.data
			that.setData({
				currentUserInfo
			})
		}).catch(err => {
			console.log(err, 'getUserInfomationErr')
			if (err.data.code == 401) {
				wx.navigateTo({
					url: '/packageC/login/index',
				})
			}
		})
	},
	
	/**
	 * 绑定下线
	 */
	bindAgent() {
		const token = wx.getStorageSync('token')
		app.http({
			config: {
				url: 'api/v1/bind_agent',
				data: {
					agent_id: this.data.agent_id,
					token
				},
				method: 'POST'
			},
			isAuth: false
		}).then(res => {
			console.log(res, 'bindAgentRes')
			wx.setStorageSync('agent_id', '')
		}).catch(err => {
			console.log(err, 'bindAgentErr')
			wx.setStorageSync('agent_id', '')
		})
	},

	onLoad(query) {
		app.setTitle('代数仓配');
		const that = this
		console.log('token', wx.getStorageSync('token'))
		let agent_id = query.scene ? query.scene.replace(/uid%3D/, '') : ''
		if (agent_id.length > 0) {
			wx.setStorageSync('agent_id', agent_id)
			that.setData({
				agent_id
			})
		}
		const token = wx.getStorageSync('token')
		if (token.length > 0) {
			if (agent_id.length > 0) {
				that.bindAgent()
			} else {
				agent_id = wx.getStorageSync('agent_id')
				if (agent_id.length > 0) {
					that.setData({
						agent_id
					}, () => {
						that.bindAgent()
					})
				}
			}
		}
		// 隐藏原生的tabbar
		const CustomBar = app.store.custom.CustomBar
		this.setData({
			CustomBar
		})
		wx.hideTabBar()
		this.setData({
			loadPromise: [{
				promise: this.demo,
				data: {
					name: '我是个传参',
				}
			}]
		})
		this.getIndexData()
		this.getSysdata()
	},
	onShow() {

	},

	demo(data) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				console.log('数据加载成功');
				console.log(data.name)
				resolve()
			}, 2000)
		})

	},

	a(e) {
		this.setData({
			options: app.store.cartStore
		})
		//console.log(e)
	},

	ddd() {
		console.log('ddd')
	},

	/* 以下是基本操作 */

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
		let { page, isEnd } = this.data;

		if (!isEnd) {
			this.setData({
				'page.data.page': page.data.page + 1
			});
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

	},
	


})
