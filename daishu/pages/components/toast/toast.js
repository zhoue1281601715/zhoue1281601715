Component({
  /**
   * 组件的属性列表
   */
  properties: {
    parameter: {
      type: Object
    }
  },
  data: {
    parameterObj: {},
    toastShowFlag: false,
  },
  ready: function() {

  },
  observers: {
    'parameter': function (parameter) {
      // console.log('toastParameter', parameter)
      if (JSON.stringify(parameter) != '{}') {
        this.setData({
          parameterObj: parameter,
          toastShowFlag: true
        }, function () {
          let duration = parameter.duration ? parameter.duration : 1500
          setTimeout(() => {
            this.setData({
              toastShowFlag: false
            })
          }, duration)
        })
      }
    }
  },
})