module.exports = {
    data: {
        system: true,
        statusHeight: 0,

        cant_click: false
    },
    onLoad() {
        this.setData({
            system: wx.getStorageSync("get_system"),
            statusHeight: wx.getStorageSync("status_bar") + 44 //44是自定义标题高度
        })
    },

    //点击返回
    onClickLeft() {
        wx.navigateBack({
            delta: 1
        })
    },

    //下拉刷新 针对ios
    onPullDownRefresh: function () {
        //上拉设置颜色
        // wx.setBackgroundColor({
        //     backgroundColorTop:'red'
        // })
        wx.stopPullDownRefresh()
    },

    //去除点击
    cant_click_fn() {
        let self = this
        if (this.data.cant_click) {
            return true
        }
        this.setData({
            cant_click: true
        })
        setTimeout(() => {
            self.setData({
                cant_click: false
            })
        }, 1500)
        return false
    },
    //阻止页面外滚动 catchtouchmove="cant_move"
    cant_move() {
        return true
    },

}