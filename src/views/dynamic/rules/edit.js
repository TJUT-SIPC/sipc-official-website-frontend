// import schema from 'async-validator'
export default {
  header: [{
    required: true,
    message: '不能为空'
  }],
  text: [{
    required: true,
    message: '不能为空'
  }],
  image: [{
    required: true,
    message: '不能为空'
  }],
  time: [{
    required: true,
    message: '不能为空'
  }],
  editor: [{
    required: true,
    message: '不能为空'
  }]

}
