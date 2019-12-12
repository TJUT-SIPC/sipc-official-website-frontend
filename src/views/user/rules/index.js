// import schema from 'async-validator'
export default {
    name: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 5, max: 13, message: '长度在 5 到 13 个字符', trigger: 'blur'}
    ],
    email: [
        { type: 'string', required: true, message: '邮箱不合法', pattern: /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/ },
    ],
    phone: [
        { required: true, message: '手机号不合法', pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/ }
    ],
    status: [
        { required: true, message: '不能为空' }
    ]
}