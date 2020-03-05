import Mock from "mockjs";
const award = Mock.mock({
  code: 0,
  code: "success",
  data: {
    total: 27,
    "awards_list|27": [
      {
        "id|+1": 1,
        name: "@string(10,15)",
        time: "@date"
      }
    ]
  }
});

export default [
  {
    url: "/awardCenter/getAllAwards",
    type: "post",
    response: data => {
      const { page, pageSize } = data.query;
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
