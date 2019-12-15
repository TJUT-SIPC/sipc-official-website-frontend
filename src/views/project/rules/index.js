// import schema from 'async-validator'
export default {
    description: [
        { required: true, message: '不能为空', trigger: 'blur' },
        { max: 128, message: '不能超过128个字', trigger: 'blur' }
    ],
    time: [
        { required: true, message: '不能为空', trigger: 'blur' }
    ],
    image: [
        { required: true, message: '不能为空', trigger: 'blur' }
    ]
}