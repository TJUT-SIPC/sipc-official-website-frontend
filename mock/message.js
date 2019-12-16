import Mock from "mockjs";

const message = Mock.mock({
  code: 0,
  code: "success",
  data: {
    total: 27,
    "messages_list|27": [
      {
        "id|+1": 1, //留言id
        email: "123172633@qq.com", //邮箱
        nickname: "ydy", //留言者姓名
        advice: "自住都没有那么合适，投资就更加不建议； 投资买房要看别人是否需要； 北海投资客太多，70%的购房者都是投资客，到时候拿到市场上流通，这些房子卖给谁？", //留言内容 建议
        upload_time: "2001-01-01" //上传时间
      }
      //总条数
    ]
  }
});

export default [
  {
    url: "/messageCenter/getMessage",
    type: "post",
    response: data => {
      const { page, pageSize } = data.body;
      const msg = {
        code: 0,
        msg: "success",
        data: {
          total: message.data.total,
          messages_list: []
        }
      };
      msg.data.messages_list = [...message.data.messages_list].splice(
        (page - 1) * pageSize,
        pageSize
      );
      return msg;
    }
  },

  {
    url: "/messageCenter/delMessage",
    type: "post",
    response: data => {
      return {
        code: 0,
        msg: "success",
        data: null
      };
    }
  }
];
