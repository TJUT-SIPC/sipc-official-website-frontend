import Mock from 'mockjs'
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const data = Mock.mock({
  'code': 0,
  'msg': 'success',
  'data': {
    'users_list|27': [
      {
        'id|+1': 10000, // 用户id
        'name': 'admin', // 用户名
        'password': '123456', // 用户密码
        'age': 18, // 年龄
        'gender': '女', // 性别
        'phone': '13800138000', // 手机号
        'email': '@email', // 邮箱
        'create_time': '2019-07-26', // 用户创建时间
        'last_login': '2019-12-05', // 用户最后登录时间
        'status': 0, // 权限，0为普通用户，1管理员，2超级管理员
        'remark': '用户备注',
        'head_image': 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
        'current_page': 25, // 当前页数
        'total_page': 50 // 总页数
      }
    ]
  }
})

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default [
  // user login
  {
    url: '/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 0,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 0,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 0,
        data: 'success'
      }
    }
  },

  {
    url: '/userCenter/getUsers',
    type: 'get',
    response: config => {
      return data
    }
  }
]
