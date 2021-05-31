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
		warehousingCheckedList: [], // 准备入仓商品列表
		shippingOffice: '', // 送货公司
		deliveryLicensePlate: '', // 送货车牌
		warehousingRemark: '', // 用户填写的入仓备注
		result: [], // 商品列表包装城接口需要的格式
		yuycommIndex:'',
		// 填写标题
		fillIn:'',
		//提价预约
		sumbcomm:'',
		warehousingPopupShow: false, // 入仓弹窗是否显示
		carName:'',//司机姓名
		contactInfo:'',//联系方式姓名
		licensePlate:'',//车牌号码
		WarehouseNo:'',//仓单号
		warehousingProductionDate:'',
		deliveryRemark: '', // 用户填写的入仓备注
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
		}],
	},
/** 
 * 入仓是否加工
*/
switchChecked:function(e){
	console.log(e.detail.value)
	console.log(e)
	this.setData({
		machining:e.detail.value
	})
	console.log('machining:',this.data.machining);
	
},

	/**
	 * 司机名称
	 */
	handleShippingOfficeInput(e) {
		this.setData({
			shippingOffice: e.detail.value
		})
	},
	handleShippingOfficeInput4(e) {
		this.setData({
			carName: e.detail.value
		})
	},
	handleShippingOfficeInput1(e) {
		this.setData({
			contactInfo: e.detail.value
		})
	},
	handleShippingOfficeInput2(e) {
		this.setData({
			licensePlate: e.detail.value
		})
	},
	handleShippingOfficeInput3(e) {
		this.setData({
			WarehouseNo: e.detail.value
		})
	},
	gotoPage1:function(){
		wx.switchTab({
			url:"/pages/index/index"
		})
	},
  bindWarehousingProductionDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      warehousingProductionDate: e.detail.value
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
	 * 用户点击确认下单
	 */
  handleConfirmOrder() {
		const that = this
		console.log('	fujias:that.data.fujias',that.data.fujias);
		
		const { shippingOffice, deliveryLicensePlate, warehousingRemark, currentUserInfo } = that.data
		console.log(123123);
		console.log('that.data.yuycommIndex123',that.data.yuycommIndex);
		console.log(123123);
    if(that.data.yuycommIndex==1){
			if(that.data.carName===''){
				wx.showToast({
					title: '司机姓名',
					icon: 'none',
					duration: 1500
				})
				return false
			}else if (that.data.contactInfo==='') {
				wx.showToast({
					title: '联系方式姓名',
					icon: 'none',
					duration: 1500
				})
				return false
			} else if(that.data.licensePlate===''){
				wx.showToast({
					title: '车牌号码',
					icon: 'none',
					duration: 1500
				})
				return false
			}else if(that.data.WarehouseNo===''){
				wx.showToast({
					title: '仓单号',
					icon: 'none',
					duration: 1500
				})
				return false
			}else if(that.data.warehousingProductionDate===''){
				wx.showToast({
					title: '入仓时间',
					icon: 'none',
					duration: 1500
				})
				return false
			}else {
				wx.showModal({	title: '提示',
					content: '是否确认下单？',
					success (res) {
						if (res.confirm) {
							that.setData({
								warehousingPopupShow:true
							})
						}
					}
				})
			}
		}else{
			if (shippingOffice === '') {
				wx.showToast({
					title: '请输入送货公司',
					icon: 'none',
					duration: 1500
				})
				return false
			} else if (deliveryLicensePlate === '') {
				wx.showToast({
					title: '请输入送货车牌号码',
					icon: 'none',
					duration: 1500
				})
				return false
			} else {
				wx.showModal({
					title: '提示',
					content: '是否确认下单？',
					success (res) {
						if (res.confirm) {
							const parameter = {
								type: 0,
								company_id: currentUserInfo.company_id,
								warehouse_id: currentUserInfo.warehouse_id,
								warehouse_name: currentUserInfo.warehouse_name,
								kefu: currentUserInfo.kefu,
								xcx_openid: currentUserInfo.xcx_openid,
								print_custom: currentUserInfo.print_custom,
								table_num: currentUserInfo.table_num,
								customer_id: currentUserInfo.customer_id,
								customer_name: currentUserInfo.customer_name,
								delivery_company: that.data.shippingOffice,
								delivery_plate: that.data.deliveryLicensePlate,
								remark: that.data.warehousingRemark,
								details:that.data.result,
								fujias:that.data.machining==true?that.data.fujias:that.data.fujias=[{
									yiji_name:'',
									erji_name:'',
									amount:0,
									paytype:'',
									remark:'',
									yiji_name:''
								}],
							}
							app.request.json_post('/xcx/bill/save', parameter, that.navgateToPage).then(res => {
								that.navgateToPage(1)
								that.setData({
									warehousingCheckedList
								})
							})
						}
					}
				})
				
			}
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
	 * 下单结果
	 * @param {*} param 
	 */
  navgateToPage(param) {
		const that = this
		param = param ? param : 0
		if (param == 1) {
			let warehousingCheckedList = that.data.warehousingCheckedList
			let warehousingList = wx.getStorageSync('warehousingList')
			warehousingCheckedList.forEach(item => {
				let warehousingListLen = warehousingList.length
				for (let i = 0; i < warehousingListLen; i++) {
					if (item.item_id === warehousingList[i].id) {
						warehousingList.splice(i, 1)
					}
					break;
				}
			})
			wx.setStorageSync('warehousingList', warehousingList)
		} 
    // 0:下单失败 1:下单成功
    wx.navigateTo({
      url: '/packageB/in_stock_res/in_stock_res?res=' + param,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
		const CustomBar = app.store.custom.CustomBar
		const currentUserInfo = wx.getStorageSync("currentUserInfo")
		let warehousingCheckedList = wx.getStorageSync("warehousingCheckedList")
		warehousingCheckedList.map((item, index) => {
      item.quantity_e = parseInt(item.totalNum)
      item.item_id = item.id
      item.warehouse_id = currentUserInfo.warehouse_id
			item.company_id = currentUserInfo.company_id
			delete item.id
    })
    that.setData({
			CustomBar,
			currentUserInfo,
			warehousingCheckedList,
			yuycommIndex:options.yuycomm2
		})
		if(that.data.yuycommIndex==1){
			that.setData({
				fillIn:'填写预约信息',
				sumbcomm:'提交预约'
			})
		}else {
			that.setData({
				fillIn:'填写送货标题',
				sumbcomm:'确认下单'
			})
		}
		console.log('that.data.yuycommIndex123',that.data.yuycommIndex);
		
		that.packagingData(warehousingCheckedList)
		// const currentUserInfo = wx.getStorageSync("customer_id")
		that.commLevel(currentUserInfo)
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
   * 阻止冒泡
   */
  stopBubbling() {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
			makerComm:this.data.makerComm,
			[`fujias[${e.currentTarget.dataset.indexs}].yiji_name`]:this.data.seleName,
		})	

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
			[`fujias[${e.currentTarget.dataset.indexs}].erji_name`]:this.data.seleNameTow,
			[`fujias[${e.currentTarget.dataset.indexs}].amount`]:this.data.amount,
		})

		
	},
	//付款方式
	processedCommPay:function(e){
		console.log('picker发送选择改变，携带值为方式12313', e.detail.value)
    this.setData({
			payWayed:this.data.payWay[e.detail.value]
		}),
		this.setData({
			[`makerComm[${e.currentTarget.dataset.indexs}].payWayed`]:this.data.payWayed,
			[`fujias[${e.currentTarget.dataset.indexs}].paytype`]:this.data.payWayed
		})
		console.log('周河');
		
		console.log('makerComm:122121221',this.data.makerComm);
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
	   	console.log('that.data.fujias',that.data.fujias);
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
			[`makerComm[${e.currentTarget.dataset.indexs}].numberComm`]:this.data.numberComm,
			[`fujias[${e.currentTarget.dataset.indexs}].except_quantity`]:this.data.numberComm,
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
	handleDeliveryRemarkInput(e) {
    const that = this
    const remark = e.detail.value
    that.setData({
			[`makerComm[${e.currentTarget.dataset.indexs}].deliveryRemark`]:remark,
			[`fujias[${e.currentTarget.dataset.indexs}].remark`]:remark
    })
	},
})