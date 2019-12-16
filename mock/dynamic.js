import Mock from "mockjs";

const dynamics = Mock.mock({
  code: 0,
  msg: "success",
  data: {
    total: 27, //总条数
    "dynamics_list|27": [
      {
        id: 1, //动态编号
        image: "https://i04piccdn.sogoucdn.com/026e8c5d40b2ac06", //图片URL
        header: "标题",
        text:
          "在远古时代，前端并没有预览图片的方法。当时的做法时，用户选择图片之后，立刻把图片上传到服务器，然后服务器返回远程图片的 url 给前端显示。这种方法略显麻烦，而且会浪费用户的流量，因为用户可能还没有确定要上传，你却已经上传了。幸好，远古时代已经离我们远去了，现代浏览器已经实现了前端预览图片的功能。常用的方法有两个，分别是 URL.createObjectURL() 和 FileReader 。虽然他们目前均处在 w3c 规范中的 Working Draft 阶段, 但是大多数的现代浏览器都已经良好的支持了。下面就介绍一下如何使用这两个方法。",
        time: "2018-10-03",
        editor: "发布者",
        catagory: 1 //分类编号待定
      }
    ]
  }
});

export default [
  {
    url: "/dynamicCenter/getDynamics",
    type: "get",
    response: config => {
      const { page, pageSize } = config.query;
      let msg = {
        code: 0,
        msg: "success",
        data: {
          total: 27,
          dynamics_list: []
        }
      };
      msg.data.dynamics_list = [...dynamics.data.dynamics_list].splice(
        (page - 1) * pageSize,
        pageSize
      );
      return msg;
    }
  },

  {
    url: "/dynamicCenter/modifyDynamic",
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
    url: "/dynamicCenter/delDynamic",
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
    url: "/dynamicCenter/addDynamic",
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
    url: "/uploadDynamicImage",
    type: "post",
    response: data => {
      console.log(data.body);
      return {
        code: 0,
        msg: "success",
        data: {
          image_raw: "https://i04piccdn.sogoucdn.com/026e8c5d40b2ac06", //原图相对链接，需要保存到服务器
          image_compress: null //不反回动态压缩图
        }
      }
    }
  }
];
