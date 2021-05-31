const app = getApp();
import Tools from '../../../utils/modules/Tools';

Component({
	properties : {
    name: {
      type: String,
      require: true
    },
    ids: {
      type: [Number, String],
      require: true
    },
    size: {
      type: Number,
      value: 34
    },
    color: {
      type: String,
      value: '#aaa'
    },
    activeColor: {
      type: String,
      value: '#E5E5E5'
    },
    isFull: {
      type: Boolean,
      value: false
    },
    toal: {
      type: Boolean,
      value: false
    },
    options : {
      type : Object,
      value : {},
    }
	},
	data : {
    isToal: true,
    isSelect : false
	},
  observers : {
    'options' : function (n){
      const { name, toal, ids } = this.data;
      const _data = n;
      const _that = this;

      if (_data.hasOwnProperty(name)){
        if (toal) {
          let result = true;
          for (let i in _data[name]) {
            if (!_data[name][i]) result = false;
          }

          _that.setData({
            isSelect: result,
            isToal: result
          })
        }

        if (_data.hasOwnProperty(name)) {
          _that.setData({
            isSelect: _data[name][ids]
          })
        } else {
          //return false;
          _that.setData({
            isSelect: false
          })
        }
      }
      
    }
  },
  methods: {
    click() {
      let { ids, name, toal, isToal } = this.data;
      let _store = Tools.deepClone(app.store.cartStore);
      let _result = [];

      if (!toal) {
        let isS = !_store[name][ids];

        _store[name][ids] = isS;

        app.store.cartStore = _store
        
      } else {

        let result = Tools.deepClone(app.store.cartStore);
        result[name] = {};
        /**
         * 点击前判断
         */
        for (let i in _store[name]) {
          if (!_store[name][i]) isToal = false;
        }


        for (let i in _store[name]) {
          result[name][i] = !isToal;
        }

        //console.log(result)
        app.store.cartStore = result
        _store = result;

      }

      for (let i in _store[name]) {
        if (_store[name][i]) _result.push(i);
      }

      this.triggerEvent('result', { data: _result });

    }
  },
  lifetimes: {
    attached: function () {
      let { ids, name, toal } = this.data;
      let result = Tools.deepClone(app.store.cartStore);
      name = name + ''

      if (!toal) {
        if (result[name]) {
          result[name][ids] = false
        } else {
          
          result[name] = {
            [ids]: false
          }
        }
        app.store.cartStore = result

      }
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
	
})