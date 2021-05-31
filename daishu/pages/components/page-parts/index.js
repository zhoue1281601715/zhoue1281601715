import { Config } from '../../../config';
import NetWork from '../../../utils/modules/NetWork';

const net = new NetWork(Config.baseUrl);

Component({
  externalClasses: ['j-class'],
  properties: {

    /**
     * 加载动画颜色
     */
    loadColor: {
      type: String,
      value: '#444'
    },
    
    isAuth : {
      type : Boolean,
      value : true
    },
    /**
     * 没有数据时的颜色
     */
    endColor: {
      type: String,
      value: '#aaa'
    },
    wait : {
      type : Array,
      value : []
    },
    options: {
      type: Object,
      value: {},
      observer: function (n, o) {
        
        var _that = this;
        setTimeout(function (){
          _that.triggerEvent('start', {});
        }, 10);

        this.http(n);
      }
    }
  },

  data: {
    isHidden: true,
    isEnd: false,
    loading: false,
    color : '',
    list: []
  },
  /**
   * 组件的方法列表
   */
  ready() {
    var { loadColor } = this.data;
    
    this.setData({
      color : loadColor
    })
  },
  methods: {
    http: function (options) {
      
      var _that = this;
      /**
       * 判断是否有url，没有就不要浪费时间了
       */
      if (!options.hasOwnProperty('url') || !options['url']) return false;

      /**
       * 如果存在等待值就检验数据
       */
      if(_that.data.wait.length){
        let w = true;
        let _d = options.data;

        _that.data.wait.forEach(cur => {
          if(!_d.hasOwnProperty(cur) || _d[cur] === null || _d[cur] === false) w = false;
        })

        if(!w) return false;
      }

      var { list, isEnd, loadColor, endColor } = _that.data;


      if (options.hasOwnProperty('data') && options.data['page'] == 1) {
        this.setData({
          isHidden: true,
          isEnd : false
        })

        list = [];
        isEnd = false;

      } else if (options.hasOwnProperty('data') && options.data['page'] != 1) {
        _that.setData({
          loading: true,
          color : loadColor,
          isHidden: false
        })
      }

      

      net._request(options, '', _that.data.isAuth).then(res => {

        var result = _that.getResult(res);
        var _data = {}

        if (result.length < Config.pageSize) {

          _data['isEnd'] = true;
          _data['color'] = endColor;

          if (options.data['page'] != 1) _data['isHidden'] = false;
          
          _data['loading'] = false;

          isEnd = true;

        } else {

          _data['isHidden'] = true;
        }

        /**
         * 列表追加
         */
        result = list.concat(result);
        _data['list'] = result;
        
        setTimeout(function (){

          _that.setData(_data);
          
          _that.triggerEvent('success', { list: result, isEnd: isEnd });
        }, 500);
        
        
      }).catch(res => {

        _that.triggerEvent('fail', res);
      })
    },

    getResult(res) {
      
      var data = res;

      Config.server.layer.forEach((cur, index) => {
        data = data[cur];
      })

      return data;
    }
  }
})