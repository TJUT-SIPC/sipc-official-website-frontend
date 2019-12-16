import Mock from "mockjs";
const award = Mock.mock({
  code: 0,
  code: "success",
  data: {
    total: 27,
    "awards_list|27": [
      {
        "id|+1": 1,
        name: "圣诞节阿里斯顿客机失联飞机到了比赛",
        time: "1789-09-02"
      }
    ]
  }
});

export default [
  {
    url: "/awardCenter/getAllAwards",
    type: "post",
    response: data => {
      const { page, pageSize } = data.body;
      const msg = {
        code: 0,
        msg: "success",
        data: {
          total: award.data.total,
          awards_list: []
        }
      };
      msg.data.awards_list = [...award.data.awards_list].splice(
        (page - 1) * pageSize,
        pageSize
      );
      return msg;
    }
  },

  {
    url: "/awardCenter/addAward",
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
    url: "/awardCenter/modifyAward",
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
    url: "/awardCenter/delAward",
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
