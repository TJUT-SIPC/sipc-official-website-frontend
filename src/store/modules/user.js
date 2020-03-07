import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { getId, setId, removeId } from "@/utils/auth";
import { resetRouter } from "@/router";
import { Message } from "element-ui";
const state = {
  token: getToken(),
  username: "",
  avatar: "",
  status: undefined
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, username) => {
    state.username = username;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_STATUS: (state, status) => {
    state.status = status;
  },
  SET_ID: (state, id) => {
    state.id = id;
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: password
      })
        .then(response => {
          if (response.code === 1000) {
            const { token, id } = response.data;
            commit("SET_TOKEN", token);
            commit("SET_ID", id);
            setToken(token);
            setId(id);
            getInfo(id).then(req => {
              const data = req.data;
              if (!data) {
                reject("Verification failed, please Login again.");
              }
              const { status, head_image, username } = req.data;
              console.log(head_image)
              commit("SET_NAME", username);
              commit("SET_AVATAR", head_image.replace(/\w+:\/\/\d+\.\d+\.\d+\.\d+:\d+\//, ''));
              commit("SET_STATUS", status);
              resolve();
            });
          } else {
            Message({
              type: "error",
              message: response.msg
            });
            throw new Error("登陆失败");
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(getId())
        .then(response => {
          const data = response.data;
          if (!data) {
            reject("Verification failed, please Login again.");
          }
          const { status, head_image, username } = response.data;
          commit("SET_NAME", username);
          commit("SET_AVATAR", head_image.replace(/(http:\/\/||https:\/\/)/,'').split('/').splice(1).toString().replace(/,/g,'/'));
          commit("SET_STATUS", status);
          commit("SET_ID", getId());
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout()
        .then(() => {
          Object.keys(mutations).forEach(key => {
            commit(key, undefined);
          });
          removeToken();
          removeId();
          // resetRouter()
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken();
      removeId();
      resolve();
    });
  },

  resetRouter() {
    resetRouter();
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
