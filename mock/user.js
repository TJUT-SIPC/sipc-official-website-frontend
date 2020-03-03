import Mock from "mockjs";

const data = Mock.mock({
  code: 0,
  msg: "success",
  data: {
    total: 27,
    "users_list|27": [
      {
        "id|+1": 10000, // 用户id
        "username": '@string(5, 11)', // 用户名
        password: "123456", // 用户密码
        age: 18, // 年龄
        gender: "男", // 性别
        phone: "13800138000", // 手机号
        email: "@email", // 邮箱
        "student_id|+1": 20185330,
        create_time: "@date", // 用户创建时间
        last_login: "@date", // 用户最后登录时间
        status: "@pick([0, 1, 2])", // 权限，0为普通用户，1管理员，2超级管理员
        remark: "@sentence(3, 5)",
        head_image:
          "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
      }
    ]
  }
});

let validate = {
  admin: true
}

export default [
  // user login
  {
    url: "/login",
    type: "post",
    response: config => {
      console.log(config)
      if (config.query.username === 'admin') {
        return {
          code: 1000,
          msg: "success",
          data: {
            id: 30, //登陆成功的用户id
            username: "admin", //用户名
            token:
              "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJhZG1pbiIsImlhdCI6MTU3NjMwMjAwOCwic3ViIjoiIiwiaXNzIjoic2lwYzExNS5jb20iLCJleHAiOjE1NzY5MDY4MDh9.UhYMDQWRXQVp7nbjqg-CqYx2uwn2Za4h7GJGNJRiJSA" //token请前端以"sipc-token"为变量名保存到Header中
          }
        };
      } else {
        return {
          code: 1001,
          msg: '账号不存在'
        }
      }
    }
  },

  // get user info
  {
    url: "/userCenter/getUserById",
    type: "post",
    response: data => {
      const { id } = data;
      return {
        code: 0,
        msg: "success",
        data: {
          id: id,
          username: "admin",
          password: "admin",
          student_id: "20185338",
          age: 89,
          gender: "女",
          phone: 12322312233,
          email: "57345@tjut.com",
          create_time: "2019-12-14 07:28:20",
          last_login: null,
          status: 2,
          remark: "excause？测试测试",
          head_image: "https://eslint.org/assets/img/logo.svg"
        }
      };
    }
  },

  // user logout
  {
    url: "/logout",
    type: "post",
    response: _ => {
      return {
        code: 0,
        msg: "success",
        data: null
      };
    }
  },

  {
    url: "/userCenter/getUsers",
    type: "get",
    response: config => {
      const { page, pageSize } = config.query;
      const msg = {
        code: 0,
        msg: "success",
        data: {
          total: data.data.total,
          users_list: []
        }
      };
      msg.data.users_list = [...data.data.users_list].splice(
        (page - 1) * pageSize,
        pageSize
      );
      return msg;
    }
  },

  {
    url: "/userCenter/modifyUser",
    type: "post",
    response: () => {
      return {
        code: 0,
        msg: "success",
        data: null
      };
    }
  },

  {
    url: "/userCenter/delUser",
    type: "post",
    response: () => {
      return {
        code: 0,
        msg: "success",
        data: null
      };
    }
  },

  {
    url: "/uploadHeadImage",
    type: "post",
    response: () => {
      return {
        code: 0,
        msg: "success",
        data: {
          image_raw: "https://eslint.org/assets/img/logo.svg", //原图相对链接，需要保存到服务器
          image_compress:
            "https://cn.bing.com/images/search?view=detailV2&ccid=i4gA6AP8&id=5E488F4DA0DB30C7E63971684DAE4098A0ED5E91&thid=OIP.i4gA6AP8gT3IDQsg--LLBwHaGa&mediaurl=https%3a%2f%2fupload.wikimedia.org%2fwikipedia%2fcommons%2fthumb%2f9%2f95%2fVue.js_Logo_2.svg%2f1200px-Vue.js_Logo_2.svg.png&exph=1040&expw=1200&q=vue&simid=608015983750941591&selectedIndex=12" //压缩图相对链接，需要保存到服务器
        }
      };
    }
  },

  {
    url: "/userCenter/modifyUser",
    type: "post",
    response: () => {
      return {
        code: 2,
        msg: "su",
        data: null
      };
    }
  }
];
