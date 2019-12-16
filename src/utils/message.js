import { Message } from 'element-ui'
export default function(data) {
    if (data.code === 0) {
        Message({
            type: 'success',
            message: data.msg
        })
    } else {
        Message({
            type: 'err',
            message: data.msg
        })
    }
}