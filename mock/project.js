import Mock from 'mockjs'
const projects = Mock.mock({
  code: 0,
  msg: "success",
  data: {
    total: 27, //总条数
    "projects_list|27": [
      {
        'id|+1': 1, //id
        description: "@paragraph(1, 3)", //项目描述
        time: "@date", //活动时间
        image: {
          compress: "https://eslint.org/assets/img/logo.svg", //缩略图url
          raw: "https://eslint.org/assets/img/logo.svg" //原图url
        }
      }
    ]
  }
})

export default [
  {
    url: "/projectCenter/getProjects",
    type: "post",
    response: data => {
      const { page, pageSize } = data.query
      const msg = {
        'code': 0,
        'msg': 'success',
        'data': {
          total: projects.data.total,
          projects_list: []
        }
      }
      msg.data.projects_list = [...projects.data.projects_list].splice((page - 1) * pageSize, pageSize)
      return msg
    }
  },

  {
    url: "/projectCenter/modifyProject",
    type: "post",
    response: data => {
      return {
        code: 0,
        msg: "success",
        data: null
      };
    }
  },

  {
    url: "/projectCenter/delProject",
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
    url: "/projectCenter/addProject",
    type: "post",
    response: data => {
      return {
        code: 0,
        msg: "success",
        data: null
      };
    }
  },

  {
    url: "/uploadProjectImage",
    type: "post",
    response: () => {
      return {
        code: 0,
        msg: "success",
        data: {
          image_raw: "https://eslint.org/assets/img/logo.svg", //原图相对链接，需要保存到服务器
          image_compress: "https://eslint.org/assets/img/logo.svg" //压缩图相对链接，需要保存到服务器
        }
      };
    }
  }
];
