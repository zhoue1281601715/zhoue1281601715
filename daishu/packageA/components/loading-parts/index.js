// pages/components/loading-parts.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  externalClasses: ['j-class'],
  properties: {
    background: {
      type : String,
      value : '#fff'
    },
    promise : {
      type : Array,
      value : [],
      observer: function (n) {
          //console.log(n)
          if (n.length && !this.data.once) {
            
            this.setData({
              once: true
            })
            this.getData(this.setPromise())
          }
      },
    },
    sleep : {
      type : Number,
      value : 300
    },
    load : {
      type : Boolean,
      value : true
    },
    type : {
      type : String,
      value : 'all'
    },
  },

  /**
   * 组件的初始数据
   */
  
  data: {
    loadEnd : false,
    once : false,
    fade : false
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      
      if(this.data.promise.length){
        this.setData({
          once : true
        })
        this.getData(this.setPromise())
      }
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setPromise (){
      const {promise : _promise} = this.data;
      const _that = this;
      var result = [];
      _promise.forEach((cur, index) => {
        result.push(cur.promise(cur.data))
      })
      return result;
    },
    getData (list){
      
      const { sleep, type} = this.data;
      const _that = this;

      Promise[type](list).then(res => {
       
        _that.triggerEvent('success', res);

        setTimeout(() => {
          _that.setData({
            fade : true
          })
        }, sleep);

        setTimeout(() => {
          _that.setData({
            loadEnd: true
          })
        }, sleep + 250)
      }).catch(res => {
       
        _that.triggerEvent('fail', res)
      });

      
    }
  }
})
