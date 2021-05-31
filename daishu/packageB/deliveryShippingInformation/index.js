/**
 * 如果位目录层数大于两级需要修改路径
 */
const { $Toast, $Message } = require('../../utils/iview/base/index');
import Tools from '../../utils/modules/Tools';
import Config from '../../config';
import utils from '../../utils/utils';
const _UTIL=require('../../utils/arrRemoveObjj')
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
		currentUserInfo: '', // 用户基本信息
		activeIdx: -1, // tabbar当前下标
		CustomBar: 0, // 自定义导航栏高度
		columns: ['客户自提', '代发快递', '代叔物流'], // 出仓方式列表
		delivery_type: '', // 出仓方式
		pickerIndex: '', // 出仓方式下标
		deliveryMethod: ['送货', '自提'], // 送货方式列表
		deliveryMethodPickerIndex: '', // 送货方式下标
		logistics_consignee_delivery: '', // 送货方式
		paymentMethod: ['现付', '提付', '月结', '多笔付'], // 付款方式列表
		paymentMethodPickerIndex: '', // 付款方式下标
		logistics_consignee_paytype: '', // 付款方式
		vantPopup: false, // 选择城市、片区、街道的弹窗
		city: [], // 城市列表
		region: ['请选择城市', '选择片区', '选择街道'], // 选择的城市
		tabIndex: 0, // 0 选择城市 1选择片区 2选择街道
		address: '', // 详细的收货地址
		otherList: [], // 选择的区域或这是街道列表
		deliveryCheckedList: [], // 准备入仓商品列表
		shippingOffice: '', // 送货公司
		deliveryLicensePlate: '', // 送货车牌
		consignee: {}, // 收货人地址
		consigneeShow: true,
		deliveryRemark: '', // 用户填写的入仓备注
		result: [], // 商品列表包装城接口需要的格式
		machining:true, //是否加工
		machData:[],
		machData2:[],
		price:10.333,
		currentUserInfo_id:'',
		processed:[],//加工商品
		levelIndexone:'',//加工商品一类下标
		levelIndextow:'',
		addIndex:1,
		payWay:['到付', '寄付'],
		seleName:'请选择类目',
		seleNameTow:'请选择类目',
		seleCommId:[],
		amount:0,
		payWayed:'付款方式',
		numberComm:0,
		// 是否显示加工数量
		isNotNumber:false,
		// totalMany:'',
		// 加工对象
		
		// 添加加工产品
		makerComm:[{
			seleName:'',//一级类目
			seleNameTow:'',//二级类目
			numberComm:0,//加工数量
			deliveryRemark:'',//商品信息备注
			payWayed:'',//付款方式
			// totalMany:'',//金额
			amount:0
		}],
    // 附加明细
    fujias:[{
			yiji_name:'',//一级科目名称
			erji_name:'',//二级科目名称
			amount:0,//单价
			paytype:'',//付款方式，寄付，提付
			except_quantity:0,//加工数量
			remark:'',//备注
		}]
	},

	/**
   * 用户选择出仓方式
   */
	switchChecked:function(e){
		console.log(e.detail.value)
		console.log(e)
		this.setData({
			machining:e.detail.value
		})
		console.log('machining:',this.data.machining);
		
	},

  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const that = this
		const { columns } = that.data
		
		const pickerIndex = e.detail.value
		const delivery_type = columns[e.detail.value]
    that.setData({
			pickerIndex,
      delivery_type
		})
		console.log('delivery_type', delivery_type)
	},
	/**
   * 用户选择送货方式
   */
  bindDeliveryMethodPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const that = this
    const { deliveryMethod } = that.data
		const deliveryMethodPickerIndex = e.detail.value
		const logistics_consignee_delivery = deliveryMethod[e.detail.value]
    that.setData({
			deliveryMethodPickerIndex,
      logistics_consignee_delivery
		})
		console.log('logistics_consignee_delivery', logistics_consignee_delivery)
	},

	/**
   * 用户选择付款方式
   */
  bindPaymentMethodPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const that = this
    const { paymentMethod } = that.data
		const paymentMethodPickerIndex = e.detail.value
		const logistics_consignee_paytype = paymentMethod[e.detail.value]
    that.setData({
			paymentMethodPickerIndex,
      logistics_consignee_paytype
		})
		console.log('logistics_consignee_paytype', logistics_consignee_paytype)
	},
	
	/**
	 * 点击"送货地址"，弹出地址选择弹出
	 */
	selectCity() {
    this.setData({
      vantPopup: true
    })
	},

	/**
	 * 关闭地址选择弹出
	 */
	onClose() {
    this.setData({
      vantPopup: false
    })
	},
	
	/**
	 * 城市列表
	 */
	city_list() {
		app.https({
			config: {
				url: 'xcx/city/list',
				data: {},
				method: 'POST'
			},
			isAuth: false
		}).then((res) => {
			console.log('city_listRes', res)
			this.setData({
				city: res.data.data
			})
		}).catch((err) => {
			console.log('city_listErr', err)
		})
	},

	/**
	 * 获取片区
	 */
	choose_area() {
		const that = this
		const region = this.data.region
		app.https({
			config: {
				url: 'xcx/area/list',
				data: {
					city_name: region[0]
				},
				method: 'POST'
			},
			isAuth: false
		}).then((res) => {
			console.log('choose_areaRes', res)
			that.setData({
				otherList: res.data.data
			})
		}).catch((err) => {
			console.log('choose_areaErr', err)
		})
	},

	/**
	 * 获取街镇
	 */
	town_area() {
		const that = this
		let region = this.data.region
		app.https({
			config: {
				url: 'xcx/town/list',
				data: {
					city_name: region[0],
					area_name: region[1]
				},
				method: 'POST'
			},
			isAuth: false
		}).then((res) => {
			if (res.data.data.length == 0) {
				region.pop()
				that.setData({
					street: false,
					region: region,
					vantPopup: false
				})
			} else {
				that.setData({
					otherList: res.data.data,
					street: true,
					tabIndex: 2
				})
			}
		}).catch((err) => {
			console.log('town_area', err)
		})
	},

	/**
	 * tab切换
	 */
	switchTab(event) {
		const currentTab = event.currentTarget.dataset.tab
		const region = this.data.region
		const tabIndex = this.data.tabIndex

		// 第一种情况 正向
		if (tabIndex == 0 && currentTab == 1 && region[tabIndex] == "请选择城市") {
			app.utils.wx_toast("请先选择城市")
			return false
		}
		// 第二种情况 正向
		if (tabIndex == 0 && currentTab == 2 && region[tabIndex] == "请选择城市") {
			app.utils.wx_toast("请先选择城市")
			return false
		}
		// 第三种情况 正向
		if (tabIndex == 1 && currentTab == 2 && region[tabIndex] == "选择片区") {
			app.utils.wx_toast("请先选择片区")
			return false
		}
		// 第四种情况 反向
		if (tabIndex == 2 && currentTab == 1) {
			this.setData({
				"region[2]": "请选择街道",
				"region[1]": "选择片区"
			})
			this.choose_area()
		}
		// 第五种情况 反向
		if (tabIndex == 2 && currentTab == 0) {
			let region = ["请选择城市", "选择片区", "选择片区"]
			this.setData({
				region: region
			})
			this.city_list()
		}
		// 第六种情况 反向
		if (tabIndex == 1 && currentTab == 0) {
			let region = ["请选择城市", "选择片区", "选择片区"]
			this.setData({
				region: region
			})
			this.city_list()
		}
		this.setData({
			tabIndex: currentTab
		})
	},

	/**
	 * 组件选择城市
	 */
	choose_city(event) {
		const selectCity = event.detail
		this.setData({
			"region[0]": selectCity.name,
			tabIndex: 1
		})
		this.choose_area()
	},

	/** 
	 * 选择地区或者街道
	 */
	chooseOther(event) {
		const tabIndex = this.data.tabIndex
		const regionName = event.currentTarget.dataset.name
		if (tabIndex == 1) {
			this.setData({
				"region[1]": regionName,
			})
			this.town_area()
		}
		if (tabIndex == 2) {
			this.setData({
				"region[2]": regionName
			})
			// 选择完街道之后关闭弹窗
			this.onClose()
		}
	},

	/**
	 * 用户输入送货公司
	 */
	handleShippingOfficeInput(e) {
		this.setData({
			shippingOffice: e.detail.value
		})
	},

	/**
	 * 用户输入送货车牌
	 */
	handleDeliveryLicensePlateInput(e) {
		this.setData({
			deliveryLicensePlate: e.detail.value
		})
	},

	/**
	 * 用户选择收货地址
	 */ 
  handleChooseAddress() {
    const isAdd = 1
    wx.navigateTo({
      url: '/packageC/addressManagement/index?isAdd=' + isAdd,
    })
  },

  /**
   * 用户填写入仓备注
   */
  handleDeliveryRemarkInput(e) {
    const that = this
    const remark = e.detail.value
    that.setData({
			[`makerComm[${e.currentTarget.dataset.indexs}].deliveryRemark`]:remark
    })
	},

	/**
	 * 将商品列表包装城接口需要的格式
	*/ 
  packagingData(arr) {
		const that = this
    let result = []
    // 后端接口需要的参数列表
    const props = [
      "company_id",
      "warehouse_id",
      "customer_id",
      "item_id",
      "quantity_e",
      "batch1",
      "batch2",
      "production_date",
      "expiration_date",
      "remark"
		]
		const propsLen = props.length
    arr.map((item, index) => {
			result[index] = {}
      for (let i = 0; i < propsLen; i++) {
        result[index][props[i]] = item[props[i]]
      }
    })
    that.setData({
      result
    }, () => {
			console.log('result', that.data.result)
		})
	},
	
	/**
	 * 将收获人地址替换为借口需要的参数
	 */ 
  replaceProp(obj) {
		const that = this
    let delivery_type = that.data.delivery_type
    let consignee = that.data.consignee // 初始对象
    let targetObj = {} // 目标对象
    // 初始属性
    let initialProps = [
      "name",
      "phone",
      "city",
      "area",
      "street",
      "address"
    ]
    // 目标属性
    let targetProps = [
      "logistics_consignee_name",
      "logistics_consignee_phone",
      "logistics_consignee_city",
      "logistics_consignee_area",
      "logistics_consignee_street",
      "logistics_consignee_address"
    ]
    let arr = Object.getOwnPropertyNames(consignee)
    if (!arr.length && delivery_type === '代叔物流') {
			wx.showToast({
				title: '请选择收货人',
				icon: 'none',
				duration: 2000
			})
      return false
    } else {
			let targetPropsLen = targetProps.length
      for (let i = 0; i < targetPropsLen; i++) {
        targetObj[targetProps[i]] = consignee[initialProps[i]]
      }
    }
    return targetObj
  },

  /**
	 * 用户点击确认下单
	 */
  handleConfirmOrder() {
		const that = this
		console.log('that.data.fujias',that.data.fujias);
		let obj1={
			yiji_name:'',//一级科目名称
			erji_name:'',//二级科目名称
			amount:0,//单价
			paytype:'',//付款方式，寄付，提付
			except_quantity:0,//加工数量
			remark:'',//备注
		}
		if(that.data.makerComm.length>=0){
			fujias:that.data.fujias.concat(obj1)
		}
		that.data.makerComm.forEach(function(item,index){
			that.data.fujias[index].yiji_name=item.seleName //一级类目
			that.data.fujias[index].erji_name=item.seleNameTow //二级类目
			that.data.fujias[index].except_quantity=parseInt(item.numberComm) //加工数量
			that.data.fujias[index].paytype=item.payWayed //付款方式
			that.data.fujias[index].amount=item.amount //单价
			that.data.fujias[index].remark=item.deliveryRemark //备注信息
		})
		console.log('that.data.fujias',that.data.fujias);
		const { pickerIndex, delivery_type, logistics_consignee_delivery, logistics_consignee_paytype, consigneeShow, currentUserInfo } = that.data
		if (delivery_type === '') {
			wx.showToast({
				title: '请选择出仓方式',
				icon: 'none',
				duration: 1500
			})
			return false
	 	} else if (pickerIndex > 0 && logistics_consignee_delivery === '') {
			wx.showToast({
				title: '请选择送货方式',
				icon: 'none',
				duration: 1500
			})
			return false
	 	} else if (pickerIndex > 0 && logistics_consignee_paytype === '') {
			wx.showToast({
				title: '请选择付款方式',
				icon: 'none',
				duration: 1500
			})
			return false
	 	} else if (pickerIndex > 0 && consigneeShow) {
			wx.showToast({
				title: '请选择送货地址',
				icon: 'none',
				duration: 1500
			})
			return false
	 	} else if (!that.replaceProp()) {
			return false
		} else {
			wx.showModal({
				title: '提示',
				content: '是否确认下单？',
				success (res) {
					if (res.confirm) {
						const parameter = {
							type: 1,
							company_id: currentUserInfo.company_id,
							warehouse_id: currentUserInfo.warehouse_id,
							warehouse_name: currentUserInfo.warehouse_name,
							kefu: currentUserInfo.kefu,
							xcx_openid: currentUserInfo.xcx_openid,
							print_custom: currentUserInfo.print_custom,
							createby: currentUserInfo.realname,
							table_num: currentUserInfo.table_num,
							customer_id: currentUserInfo.customer_id,
							customer_name: currentUserInfo.customer_name,
							delivery_type: that.data.delivery_type,
							logistics_delivery: that.data.logistics_consignee_delivery,
							logistics_paytype: that.data.logistics_consignee_paytype,
							delivery_company: that.data.shippingOffice,
							delivery_plate: that.data.deliveryLicensePlate,
							remark: that.data.deliveryRemark,
							details: that.data.result,
							fujias:that.data.machining==true?that.data.fujias:that.data.fujias=[{
								yiji_name:'',
								erji_name:'',
								amount:0,
								paytype:'',
								remark:'',
								yiji_name:''
							}],
						}
						const destination = that.replaceProp()
						Object.assign(parameter, destination)
						app.request.json_post('/xcx/bill/save', parameter, that.navgateToPage).then(res => {
							that.navgateToPage(1)
						})
					}
				}
			})
		}
	},
	
	/**
	 * 下单结果
	 * @param {*} param 
	 */
  navgateToPage(param) {
		const that = this
		param = param ? param : 0
		if (param == 1) {
			let deliveryCheckedList = that.data.deliveryCheckedList
			let deliveryList = wx.getStorageSync('deliveryList')
			deliveryCheckedList.forEach(item => {
				let deliveryListLen = deliveryList.length
				for (let i = 0; i < deliveryListLen; i++) {
					if (item.item_id === deliveryList[i].id) {
						deliveryList.splice(i, 1)
					}
					break;
				}
			})
			wx.setStorageSync('deliveryList', deliveryList)
		} 
    // 0:下单失败 1:下单成功
    wx.navigateTo({
      url: '/packageB/in_stock_res/in_stock_res?isOut=1&res=' + param,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		console.log('deliveryCheckedList',this.data.deliveryCheckedList);
		
		const that = this
     that.setData({
			machining:true
		 })
		console.log('that.data.machining123',that.data.machining);
		
		const CustomBar = app.store.custom.CustomBar
		const currentUserInfo = wx.getStorageSync("currentUserInfo")
		that.commLevel(currentUserInfo)
		let deliveryCheckedList = wx.getStorageSync("deliveryCheckedList")
		console.log('deliveryCheckedList', deliveryCheckedList)
		deliveryCheckedList.map((item, index) => {
      item.quantity_e = parseInt(item.totalNum)
			item.warehouse_id = currentUserInfo.warehouse_id
			item.customer_id = currentUserInfo.customer_id
			item.company_id = currentUserInfo.company_id
			delete item.id
    })
    that.setData({
			CustomBar,
			currentUserInfo,
      deliveryCheckedList
		})
		that.packagingData(deliveryCheckedList)

		// -----------动态添加属性----------
	
  },
  commLevel:function(currentUserInfo){
		this.currentUserInfo_id=currentUserInfo
		app.https({
			config:{
				url:'xcx/fjfyiji/list',
				data:{
					customer_id:currentUserInfo.customer_id
				},
				method: 'POST'
			}
		}).then((res)=>{
			if(res.data.code==200){
				const mach=res.data.data
				console.log(res.data.data,'123123123');
				
			this.setData({
				machData:mach
			})
			console.log(this.data.machData,'this.machData');
			
			}
			}).catch((err) => {
			console.log(err)
		})
	},
	

	commLevel2:function(customer_id,name) {
		console.log('customer_id:',customer_id);
		console.log('name123:',name);
		
		app.https({
			config:{
				url:'xcx/fjferji/list',
				data:{
					customer_id:customer_id,
					yiji_name:name
				},
				method: 'POST'
			}
		}).then((res)=>{
			console.log('res.data.data:',res.data.data);
			this.setData({
				machData2:res.data.data
			})
			console.log('res.data.data123',res.data.data);
			
		}).catch((err)=>{
			console.log('err',err);	
		})
	},
	clickIndex:function(e){
		let that = this
		let index = e.currentTarget.dataset.index
		let	machData1= that.data.machData
		console.log('that.data.currentUserInfo.customer_id',that.data.currentUserInfo.customer_id)
		console.log('machData1[index].name',machData1[index].name);
	},
	// 商品价加工一级目录
	processedCommChange(e){
		console.log('picker发送选择改变，携带值为', e.detail.value)

		this.setData({
			seleName:this.data.machData[e.detail.value].name,
		})
		// console.log('this.data.makerComm:12123',this.data.makerComm);
		console.log('12312',e.currentTarget.dataset.indexs);
		this.setData({ 
			[`makerComm[${e.currentTarget.dataset.indexs}].seleName`]:this.data.seleName,
			makerComm:this.data.makerComm
		})
		console.log('makerComm45455:',this.data.makerComm[e.currentTarget.dataset.indexs].seleName);
		console.log(this.data.makerComm);
		
		console.log('makerComm123123:',this.data.machData);
		
		this.commLevel2(this.data.machData[e.detail.value].customer_id,this.data.seleName)
	},
	// 商品价格二级目录
	processedTow(e){
		console.log('picker发送选择改变，携带值为2', e.detail.value)
		this.setData({
			seleNameTow:this.data.machData2[e.detail.value].name,
			amount:this.data.machData2[e.detail.value].amount,
		})
		this.setData({
			[`makerComm[${e.currentTarget.dataset.indexs}].seleNameTow`]:this.data.seleNameTow,
			[`makerComm[${e.currentTarget.dataset.indexs}].amount`]:this.data.amount,
		})

		
	},
	//付款方式
	processedCommPay:function(e){
		console.log('picker发送选择改变，携带值为方式12313', e.detail.value)
    this.setData({
			payWayed:this.data.payWay[e.detail.value]
		}),
		this.setData({
			[`makerComm[${e.currentTarget.dataset.indexs}].payWayed`]:this.data.payWayed
		})
	
		
	},
	addObject:function(){
		const that=this
		let obj={
			seleName:'请选择类目',//一级类目
			seleNameTow:'',//二级类目
			numberComm:0,//加工数量
			deliveryRemark:'',//商品信息备注
			payWayed:'',//付款方式
			// totalMany:'',//金额
			amount:0
		}
		let obj1={
			yiji_name:'',//一级科目名称
			erji_name:'',//二级科目名称
			amount:0,//单价
			paytype:'',//付款方式，寄付，提付
			except_quantity:0,//加工数量
			remark:'',//备注
		}
		console.log('that.data.makerComm',that.data.makerComm);

		if(that.data.makerComm.length>=0){
			that.setData({
				makerComm:that.data.makerComm.concat(obj),
				fujias:that.data.fujias.concat(obj1)
			})
		}		
		that.data.makerComm.forEach(function(item,index){
			that.data.fujias[index].yiji_name=item.seleName //一级类目
			that.data.fujias[index].erji_name=item.seleNameTow //二级类目
			that.data.fujias[index].except_quantity=item.numberComm //加工数量
			that.data.fujias[index].paytype=item.payWayed //付款方式
			that.data.fujias[index].amount=item.amount //单价
			that.data.fujias[index].remark=item.deliveryRemark //备注信息
		})
			that.data.seleName=''
			that.data.seleNameTow=''
			that.data.numberComm=''
			that.data.deliveryRemark=''
			that.data.payWayed=''
			that.data.amount=''
	   	console.log('this.data.makerComm123',that.data.makerComm);
	},
	// 判读重新输入是否makeComm相同
	inputedit:function(e){
		const that = this
		let name=e.currentTarget.dataset.name
		let value = e.detail.value
		that.setData({
			numberComm:value
		})
		this.setData({
			[`makerComm[${e.currentTarget.dataset.indexs}].numberComm`]:this.data.numberComm
		})
		console.log('numberComm',this.data.numberComm);
		
	},
	// 删除加工项
	deleItem:function(e){
	

		_UTIL.arrRemoveObj(this.data.makerComm, this.data.makerComm[e.currentTarget.dataset.indexs]);
		_UTIL.arrRemoveObj(this.data.fujias, this.data.fujias[e.currentTarget.dataset.indexs]);
	 this.setData({
		 makerComm:this.data.makerComm,
		 fujias:this.data.fujias
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
		this.city_list()
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

  }
})