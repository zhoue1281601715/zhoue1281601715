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
		longitude: 113.324520,
    latitude: 23.099994,
    markers:[{
      id: 0,
      iconPath: '',
      latitude: '',
      longitude: '',
      width: 50,
      height: 50
    }],
		modal : {
			tips : '提示',
			message : '模态框说明',
			ok : 'modalOk',
			cancel : 'modalCancel',
			ishide : true
		},
		mapHeight: 0,
		CustomBar: 0, // 自定义导航栏高度
		// --  分页配置数据  -------- 
		page: {
			url: '/',
				data: {
				page: 1,
			}
		},
		isEnd: false,
		// ------------------------- 
		activeIdx: -1,
	},

	/**
	 * 代叔仓配公司地址
	 */
	getCompanyAddress() {
		const that = this
		const token = wx.getStorageSync('token')
		app.http({
			config: {
				url: 'api/v1/link_us',
				data: {
					token
				},
				method: 'POST'
			},
			isAuth: false
		}).then(res => {
			console.log(res, 'getCompanyAddressRes')
			const addressInfo = res.data.data
			that.setData({
				addressInfo
			}, () => {
				that.getCompanyAddressLat()
			})
		}).catch(err => {
			console.log(err, 'getCompanyAddressErr')
		})
	},

	/**
	 * 代叔仓配公司地址经纬度
	 */
	getCompanyAddressLat() {
		const that = this
		const token = wx.getStorageSync('token')
		const address = that.data.addressInfo.compony_address
		app.http({
			config: {
				url: 'api/v1/get_lat',
				data: {
					token,
					address
				},
				method: 'POST'
			},
			isAuth: false
		}).then(res => {
			console.log(res, 'getCompanyAddressLatRes')
			const { lng, lat } = res.data.data.result.location
			const level = res.data.data.result.level
			const markers = [{
				id: 0,
				iconPath: '/images/logo_icon.png',
				latitude: lat,
				longitude: lng,
				width: 30,
				height: 30,
			}]
			that.setData({
				longitude: lng,
				latitude: lat,
				level,
				markers
			}, () => {
				console.log('longitude', that.data.longitude)
				console.log('latitude', that.data.latitude)
				console.log('level', that.data.level)
				console.log('markers', that.data.markers)
			})
		}).catch(err => {
			console.log(err, 'getCompanyAddressLatErr')
		})
	},

	/**
	 * 拨打电话
	 */
	handlePhoneCall() {
		const that = this
		console.log(that.data.addressInfo,'123zhouhe');
		
		wx.makePhoneCall({
			phoneNumber: that.data.addressInfo.site_phone
		})
	},

	getSysdata () {
    const that = this
    wx.getSystemInfo({
      success (e) {
				const windowHeight = e.windowHeight
				// 获取元素宽高
				wx.createSelectorQuery().select('.contact').boundingClientRect(function (res) {
					const mapHeight = (windowHeight - res.height - that.data.CustomBar) * 2 - 94
					that.setData({
						mapHeight
					})
				}).exec()
      },
      fail (e) {
        console.log(e)
      }
    })
  },

	onLoad (query) {
		app.setTitle('填个标题吧');
		const that = this
		const CustomBar = app.store.custom.CustomBar
		that.setData({
			CustomBar
		})
		that.getCompanyAddress()
		that.getSysdata()
	},

	onShow () {
		
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

	modalOk (){
		this.setData({
			'modal.ishide' : true
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

  }
})
