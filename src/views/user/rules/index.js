// import schema from 'async-validator'
export default {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 13, message: '长度在 5 到 13 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '不能位空', trigger: 'blur' },
    { min: 6, max: 25, message: '长度为6-25', trigger: 'blur' },
    { pattern: /^(\w+)$/, message: '只能使用字母，数字，下划线', trigger: 'blur' }
  ],
  email: [
    { type: 'string', required: true, message: '邮箱不合法', pattern: /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/ }
  ],
  phone: [
    { required: true, message: '手机号不合法', pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/ }
  ],
  status: [
    { required: true, message: '不能为空' }
  ],
  student_id: [
    { pattern: /[0-9]+/, message: '学号为数字' },
    { min: 8, max: 8, message: '学号为8位数字' }
  ]

}
