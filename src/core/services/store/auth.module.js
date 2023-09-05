import ApiService from "@/core/services/api.service";

// action types
export const AUTH_LOGIN = "AuthLogin";
export const GET_PROFILE = "getProfile";
export const POST_PROFILE = "postProfile";
export const POST_KATASANDI = "postKataSandi";
export const AUTH_LOGOUT = "AuthLogout";

// mutation types
export const SET_PROFILE = "SET_PROFILE";

const state = {
  dataProfile: [],
}

const mutations = {
  [SET_PROFILE](state, data) {
    state.dataProfile = data
  },
}

const getters = {
  dataprofile(state) {
    return state.dataProfile;
  },
}

const actions = {
  [AUTH_LOGIN](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.postLogin(`auth/login`, bodyData)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_PROFILE](context, uid) {
    return new Promise((resolve, reject) => {
      ApiService.put(`auth/profile/${uid}`, localStorage.getItem('user_token'))
      .then((response) => {
          context.commit('SET_PROFILE', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [POST_PROFILE](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`auth/ubah-profile`, localStorage.getItem('user_token'), bodyData)
      .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [POST_KATASANDI](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`auth/ubah-katasandi`, localStorage.getItem('user_token'), bodyData)
      .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [AUTH_LOGOUT](context, uid) {
    return new Promise((resolve, reject) => {
      ApiService.get(`auth/logout/${uid}`, '12qwaszx@321123')
      .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
}

export default {
  namespaced: true,
  actions,
  state,
  mutations,
  getters,
}