const app = getApp()
module.exports = {
    data: {
        page_obj: {
            page: {
                pageNum: 1,
                pageSize: 5
            },
            //查找条件
            find_condition: {},

            //接口方法
            page_method: '',
            //刷新接口
            refresh_url: ''
        },

        on_show_stop: false
    },
    onLoad() {
        this.setData({
            "page_obj.page.total": 20,
            //刷新是否已经结束
            "page_obj.refresh_stop": false
        })
    },
    onShow() {
        // this.setData({
        //     "page_obj.refresh_stop": false,
        //     "page_obj.page.pageNum": 1,
        // })
        // this['refresh']()
        if(!this.data.on_show_stop){
            this.clear_refresh("list")
        }
    },
    onReachBottom() {
        this.setData({
            "pageNum.page.pageNum": ++this.data.page_obj.page.pageNum
        })
        this['refresh']()
    },

    clear_refresh(list){
        this.setData({
            "page_obj.page.pageNum": 1,
            "page_obj.refresh_stop": false,
            [list]: [],
            list:[]
        })

        this['refresh']()
    },

    refresh() {
        // if (this.data.page.pageNum * this.data.page.pageSize >= this.data.page.total) {
        //     this.setData({
        //         refresh_stop:true
        //     })
        //     return
        // }
        if (this.data.page_obj.refresh_stop) {
            return
        }
        let self = this,
            parmeter = {
                page: this.data.page_obj.page.pageNum,
                // pageIndex: this.data.page_obj.page.pageNum,
                limit: this.data.page_obj.page.pageSize
            },
            get_condition = this.data.page_obj.find_condition

        if (JSON.stringify(get_condition) != "{}") {
            Object.assign(parmeter, get_condition)
        }

        console.log('this.data.page_obj.page_method---------' ,parmeter)
        app.request[this.data.page_obj.page_method](this.data.page_obj.refresh_url, parmeter).then((res) => {
            let get_data = res

            if (get_data.length === 0 || JSON.stringify(get_data.records) == '{}') {
                self.setData({
                    "page_obj.refresh_stop": true
                })
            }
            self.setData({
                "page_obj.page.total": get_data.total
            })
            self.draw_list(get_data)
        })
    }
}