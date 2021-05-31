// packageC/data_statistics_yue/data_statistics_yue.js
import * as echarts from '../ec-canvas/echarts';
const app = getApp();

var option = {
  xAxis: {
    type: 'category',
    data: ['01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07', '01-08', '01-09', '01-10', '01-11', '01-12'],
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
    // data: [820, 60, 596, 1600, 635, 655, 235, 987, 865, 785, 112, 235],
    data: [],
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
    // 业绩列表
    achievementList: []
  },
  mixins: [app.togerther],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      month: options.month,
      eChartName: options.month.substring(0, options.month.indexOf("-"))
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
    this.everyDayAchievement()
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
  // 业绩统计（每天）
  everyDayAchievement() {
    let self = this
    let currentUser = wx.getStorageSync("currentUserInfo")
    let parameter = {
      delivery_phone: currentUser.mobile,
      table_num: currentUser.table_num,
      month: this.data.month
    }
    app.request.post('/xcx/order/stat_day', parameter).then(res => {
      self.setData({
        achievementList: self.objChangeArr(res),
      })
      self.setEchartData(res)
      console.log('option---------', option)
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

  // 配置图表参数
  setEchartData(params) {
    // 当月业绩统计天数
    let month_days = Object.keys(params).reverse()
    for (let i = 0; i < month_days.length; i++) {
      month_days[i] = month_days[i].substring(month_days[i].indexOf("-") + 1)
    }
    option.xAxis.data = month_days

    // 某天的业绩
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