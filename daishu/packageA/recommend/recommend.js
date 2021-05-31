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
    toastParameter: {}, // 自定义toast参数
    array: [{checked: false, title: '必须1楼'}, {checked: false, title: '有装卸平台'}, {checked: false, title: '可以使用楼层仓'}],
    arrayA: [{checked: false, title: '需要托管'}, {checked: false, title: '装卸'}, {checked: false, title: '包装'}, {checked: false, title: '加工'}],
    arrayB: [{checked: false, title: '代发物流'}, {checked: false, title: '快递'}, {checked: false, title: '城市配送'}],
    arrayC: [{checked: false, title: '长期'}, {checked: false, title: '1年以上'}, {checked: false, title: '临时'}],
    date: '请选择租仓时间',
    region: ['广东省', '广州市', '海珠区'],
    demand_type: '', // 使用需求
    lay_service: '', // 仓储服务
    logistics_service: '', // 物流服务
    use_time: '', // 用仓时长
    user_area: '', // 使用城市
    regionFlag: false,
    use_time: '', // 租仓时间
    checked: false
  },

  /**
   * 选择使用需求
   * @param {'*'} e 
   */
  handleRadioChange: function(e) {
    const that = this
    let { array } = that.data
    const { title, index } = e.currentTarget.dataset
    const arrayLen = array.length
    for (let i = 0; i < arrayLen; i++) {
      if (i === index) {
        array[index].checked = !array[index].checked
        let demand_type = ''
        array.forEach(item => {
          if (item.checked) {
            demand_type += `${item.title},` 
          }
        })
        demand_type = demand_type.substr(0, (demand_type.length - 1))
        that.setData({
          demand_type,
          array
        })
        break;
      }
    }
  },

  /**
   * 选择使仓储服务
   * @param {'*'} e 
   */
  handleRadioAChange: function(e) {
    const that = this
    let { arrayA } = that.data
    const { title, index } = e.currentTarget.dataset
    const arrayALen = arrayA.length
    for (let i = 0; i < arrayALen; i++) {
      if (i === index) {
        arrayA[index].checked = !arrayA[index].checked
        let lay_service = ''
        arrayA.forEach(item => {
          if (item.checked) {
            lay_service += `${item.title},` 
          }
        })
        lay_service = lay_service.substr(0, (lay_service.length - 1))
        that.setData({
          lay_service,
          arrayA
        })
        break;
      }
    }
  },

  /**
   * 选择物流服务
   * @param {'*'} e 
   */
  handleRadioBChange: function(e) {
    const that = this
    let { arrayB } = that.data
    const { title, index } = e.currentTarget.dataset
    const arrayBLen = arrayB.length
    for (let i = 0; i < arrayBLen; i++) {
      if (i === index) {
        arrayB[index].checked = !arrayB[index].checked
        let logistics_service = ''
        arrayB.forEach(item => {
          if (item.checked) {
            logistics_service += `${item.title},` 
          }
        })
        logistics_service = logistics_service.substr(0, (logistics_service.length - 1))
        that.setData({
          logistics_service,
          arrayB
        })
        break;
      }
    }
  },

  /**
   * 选择用仓时长
   * @param {'*'} e 
   */
  handleRadioCChange: function(e) {
    const that = this
    let { arrayC } = that.data
    const { title, index } = e.currentTarget.dataset
    const arrayCLen = arrayC.length
    for (let i = 0; i < arrayCLen; i++) {
      if (i === index) {
        arrayC[index].checked = !arrayC[index].checked
        let use_time = ''
        arrayC.forEach(item => {
          if (item.checked) {
            use_time += `${item.title},` 
          }
        })
        use_time = use_time.substr(0, (use_time.length - 1))
        that.setData({
          use_time,
          arrayC
        })
        break;
      }
    }
  },

  /**
   * 选择地区
   * @param {*} e 
   */
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const region = e.detail.value
    console.log(region);
    
    const user_area = region[1] + region[2]
    console.log('user_area', user_area)
    this.setData({
      region,
      user_area,
      regionFlag: true
    })
  },

  /**
   * 勾选/取消 "已阅读并同意《推荐租仓客户、仓库协议》"
   */
  handleCheckboxChange () {
    const that = this
    const checked = !that.data.checked
    that.setData({
      checked
    })
  },

  /**
   * 马上租仓
   */
  formSubmit (e) {
    const that = this
    const {
      demand_type,
      lay_service,
      logistics_service,
      use_time,
      user_area,
      checked
    } = that.data
    const { name, phone, use_space, lay_product } = e.detail.value
    console.log(e)
    if (name === '') {
      wx.showToast({
        title: '客户名称不能为空',
        icon: 'none',
        duration: 1500
      })
    } else if (phone === '') {
      wx.showToast({
        title: '客户联系电话不能为空',
        icon: 'none',
        duration: 1500
      })
    } else if (use_space === '') {
      wx.showToast({
        title: '用仓面积不能为空',
        icon: 'none',
        duration: 1500
      })
    } else if (!checked) {
      wx.showToast({
        title: '请先同意用户协议',
        icon: 'none',
        duration: 1500
      })
    } else {
      app.http({
        config: {
          url: 'api/v1/user_appiont',
          data: {
            name,
            phone,
            use_space,
            lay_product,
            demand_type,
            lay_service,
            logistics_service,
            use_time,
            user_area
          },
          method: 'POST'
        },
        isAuth: true
      }).then(res => {
        console.log(res, 'formSubmitRes')
        const toastParameter = {
          icon: 'success',
          content: res.data.msg,
          duration: 1500
        }
        that.setData({
          toastParameter,
        }, () => {
          setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            })
          }, 1500)
        })
      }).catch(err => {
        console.log(err, 'formSubmitErr')
        wx.showModal({
          title: '提示',
          content: err.data.msg,
          showCancel: false
        })
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})