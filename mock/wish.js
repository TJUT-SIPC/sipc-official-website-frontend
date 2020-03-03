import Mock from "mockjs";

function getStatusWishes() {
  return Mock.mock({
    code: 0,
    msg: "success",
    data: {
      total: 27, //总条数
      "wishes_list|27": [
        {
          id: 1, //寄语id
          name: "@cname", //姓名
          word: "生活是单行道，你就会走在我前面，让我可以时时看见你；生活是双行道，你就会默默牵我的手，穿行在茫茫人海，不让我走丢。亲爱的妈妈，母亲节快乐！", //寄语内容
          status: '1' //寄语状态，0审核不通过，1待审核，2审核通过待发布，3已发布
        }
      ]
    }
  });
}

export default [
  {
    url: "/wishCenter/getAllWishes",
    type: "get",
    response: config => {
      const { page, pageSize} = config.query;
      const data = getStatusWishes();
      const msg = {
        code: 0,
        msg: "success",
        data: {
          total: data.data.total,
          users_list: []
        }
      };
      msg.data.wishes_list = [...data.data.wishes_list].splice(
        (page - 1) * pageSize,
        pageSize
      );
      return msg;
    }
  },

  {
    url: "/wishCenter/modifyWish",
    type: "post",
    response: config => {
      return {
        code: 0,
        msg: "success",
        data: null
      };
    }
  },

  {
    url: "/wishCenter/delWish",
    type: "post",
    response: config => {
      return {
        code: 0,
        msg: "success",
        data: null
      };
    }
  }
];
