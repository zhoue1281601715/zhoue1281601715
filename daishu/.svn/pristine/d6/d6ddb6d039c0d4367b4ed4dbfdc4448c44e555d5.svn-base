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
		modal : {
			tips : '提示',
			message : '模态框说明',
			ok : 'modalOk',
			cancel : 'modalCancel',
			ishide : true
		},
		activeIdx: -1, // 自定义tabbar下标
		mailing: ['预约寄件', '专属寄件'], // 寄件方式
		mailingIndex: '', // 寄件方式选中选项的下标
		cargoInfoArray: ['家具/50kg', '其他/50kg'], // 货物信息列表
		cargoIndex: '', // 货物信息选中选项的下标
		payWayArray: ['寄付', '到付'], // 支付方式列表
		payWayIndex: '', // 支付方式当前选中选项的下标
		checked: false // 是否勾选 "我同意《代叔配送协议条款》"
	},

	/**
	 * 选择寄件方式
	 * @param {*} e 
	 */
	handleCheckMailingWay(e) {
		const that = this
		const { mailingIndex } = that.data
		const { index } = e.currentTarget.dataset
		if (mailingIndex === index) {
			return false
		} else {
			that.setData({
				mailingIndex: index
			})
		}
	},

	/**
	 * 选择货物信息
	 * @param {*} e 
	 */
	bindCargoPickerChange(e) {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		const that = this
		const { cargoIndex } = that.data
		const pickerVal = e.detail.value
		if (cargoIndex === pickerVal) {
			return false
		} else {
			that.setData({
				cargoIndex: pickerVal
			})
		}
	},
	
	/**
	 * 选择支付方式
	 * @param {*} e 
	 */
	bindPaymentPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const that = this
		const { payWayIndex } = that.data
		const pickerVal = e.detail.value
		if (payWayIndex === pickerVal) {
			return false
		} else {
			that.setData({
				payWayIndex: pickerVal
			})
		}
	},
	
	/**
   * 勾选/取消 "我同意《代叔配送协议条款》"
   */
  handleCheckboxChange () {
    const that = this
    const checked = !that.data.checked
    that.setData({
      checked
    })
  },

	onLoad (query) {
		app.setTitle('填个标题吧');
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
