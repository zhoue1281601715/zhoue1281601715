const app = getApp();
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的对外属性
   */
  externalClasses: ['j-class'],
  properties: {
    textColor: {
      type: String,

      value: '#FFF'
    },
    textColor2: {
      type: String,
      value: '#FFF'
    },
    isFull: {
      type: Boolean,
      value: true
    },
    textCenter: {
      type: Boolean,
      value: true
    },
    isBack: {
      type: Boolean,
      value: false
    },

    /**
     * 滚动条滚动位置
     */
    scrollTop: {
      type: Number,
      value: 0,

    },
    /**
     * 是否滚动渐变
     */
    opacity: {
      type: Boolean,
      value: false
    },
    /**
     * 100%的滚动高度
     */
    scrollFull: {
      type: Number,
      value: 150
    },

    bg: {
      type: String,
      value: 'background:#fff;'
    },
  },
  ready() {
    let _that = this;

    this.setData({
      tc: this.data.textColor
    })
    this.setBar();
  },
  /**
   * 组件的初始数据
   */
  data: {
    opacityVlue: 0,
    tc: '',     //字体颜色 
    end : false // 是否已初始结束 
  },
  /**
   * 组件的方法列表
   */
  observers: {
    'scrollTop': function (n) {
      var scrollFull = this.data.scrollFull;
      var result = 0;

      if (n > scrollFull) {
        result = 1;
      } else {
        result = (n / scrollFull).toFixed(1);
      }

      if (n > (scrollFull / 2)) {
        this.setData({
          tc: this.data.textColor2
        })
      } else {
        this.setData({
          tc: this.data.textColor
        })
      }

      this.setData({
        opacityVlue: result
      })
    }
  },
  methods: {
    setBar() {
      const { IsCorrecting, StatusBar, Custom, CustomBar, System} = app.store.custom;
      const _that = this;

      if (IsCorrecting){
        _that.setData({
          StatusBar,
          Custom,
          System,
          CustomBar,
          end : true
        });
        _that.triggerEvent('success', {});
      }else{
        _that.getSystemInfo().then(res => {
          _that.setData({
            StatusBar: res.StatusBar,
            Custom: res.Custom,
            CustomBar: res.CustomBar,
            System : res.System,
            end: true
          });
          _that.triggerEvent('success', {});
        })
      }

    },

    getSystemInfo (){
      var StatusBar, Custom, CustomBar;
      var _that = this;

      return new Promise((resolve, reject) => {
        wx.getSystemInfo({
          success: e => {
            StatusBar = e.statusBarHeight;
            let capsule = wx.getMenuButtonBoundingClientRect();

            if (capsule.left == 0) {

              setTimeout(function () {
                _that.setBar();
              }, 200);
            } else {

              Custom = capsule;
              CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;


              app.store.custom.StatusBar = StatusBar
              app.store.custom.IsCorrecting = true
              app.store.custom.Custom = Custom
              app.store.custom.CustomBar = CustomBar
              app.store.custom.System = e

              resolve({
                StatusBar: StatusBar,
                Custom: Custom,
                System: e,
                CustomBar: CustomBar
              });
            }
          }
        });
      })
    },
    BackPage() {
      wx.navigateBack({
        delta: 1
      });
    }
  }
})