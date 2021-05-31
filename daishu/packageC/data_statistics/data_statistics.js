// packageC/data_statistics/data_statistics.js
import * as echarts from '../ec-canvas/echarts';
const app = getApp();

var option = {
  xAxis: {
    type: 'category',
    data: ['2020-01', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      fontSize: 9
    }
  },
  grid: {
    show: false,
    height: 150,
    left: 44,
    right: 5,
    top: 20,
    bottom: 20
  },
  yAxis: {
    type: 'value',
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    }
  },
  series: [{
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    type: 'line',
    itemStyle: {
      color: "#0E9CFF"
    },
    areaStyle: {
      color: "rgba(14, 156, 255,0.5)"
    }
  }]
};

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  chart.setOption(option);
  return chart;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 图表名称
    eChartName: "",
    ec: {
      onInit: initChart
    },
    // 月份业绩
    monthStatistics: ""
  },
  mixins: [app.togerther],

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
    this.monthAchievement()
    // this.setEchartName()
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

  },


  // 年统计
  monthAchievement() {
    let self = this
    let currentUser = wx.getStorageSync("currentUserInfo");
    let parameter = {
      delivery_phone: currentUser.mobile,
      table_num: currentUser.table_num,
    }
    app.request.post('/xcx/order/stat_month', parameter).then(res => {
      self.setData({
        monthStatistics: self.objChangeArr(res)
      })
      self.setEchartData(res)
      self.setEchartName(res)
    })
  },

  // 设置表格名称
  setEchartName(params) {
    let arr = []
    let name = ""
    arr = Object.keys(params)
    for (let i = 0; i < arr.length; i++) {
      // 获取年份
      arr[i] = arr[i].substring(0, arr[i].indexOf("-"))
    }
    // 去除相同的年份
    let new_arr = Array.from(new Set(arr))


    if (new_arr.length == 1) {

      name = new_arr[0]

    } else {

      name = new_arr[0] + "-" + new_arr[new_arr.length - 1]

    }

    this.setData({
      eChartName: name
    })
  },

  // 页面列表展示数据
  objChangeArr(obj) {
    let arr = []
    for (const key in obj) {

      arr.push({
        date: key,
        money: obj[key]
      })
    }
    return arr.reverse()
  },

  //配置图表参数
  setEchartData(params) {
    option.series[0].data = []
    option.xAxis.data = Object.keys(params).reverse()

    for (const key in params) {
      option.series[0].data.push(params[key])
    }
    option.series[0].data.reverse()
    var ec = {
      onInit: initChart
    }
    this.setData({
      ec: ec
    })
  }

})