/* 
    <view class="error_wrap">
        <view class="error_word">{{input_check_list[0].error}}</view>
    </view> 
*/
const utils = require("../../../utils/util")
const regular = require("../../../utils/regular")


module.exports = {
    data: {
        input_check_list: [{
            error: '',
            rules_fun: 'phone_strict',
            checkResult: false
        }]
    },
    //检验input
    check_input(value, index) {
        let self = this
        utils.debounce(() => {
            let get_check_list = self.data.input_check_list

            let get_check = regular[get_check_list[index].rules_fun](value, false)
            // console.log('check----------', get_check)
            // get_check_list[index].checkResult = get_check ? false : true
            get_check_list[index].error = get_check
            self.setData({
                input_check_list: get_check_list
            })
        }, 1000)

    }
}