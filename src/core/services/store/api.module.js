import ApiService from "@/core/services/api.service";

export const SET_ERROR = "setError";

const actions = {
  fetchData({ context }, payload) {
    context;
    return new Promise((resolve, reject) => {
      switch (payload.method) {
        case "post":
          // ApiService.post(`${payload.url}`, payload.body)
          ApiService.post(`${payload.url}`, payload.authToken, payload.body)
            .then((res) => {
              resolve(res);
            })
            .catch((err) => {
              reject(err);
            });
          break;
        case "put":
          // ApiService.put(`${payload.url}`, payload.body)
          ApiService.put(`${payload.url}`, payload.authToken, payload.body)
            .then((res) => {
              resolve(res);
            })
            .catch((err) => {
              reject(err);
            });
          break;
        case "get":
          // ApiService.get(`${payload.url}`)
          ApiService.get(`${payload.url}`, payload.authToken)
            .then((res) => {
              resolve(res);
            })
            .catch((err) => {
              reject(err);
            });
          break;
        case "patch":
          ApiService.patch(`${payload.url}`, payload.authToken, payload.body)
            .then((res) => {
              resolve(res);
            })
            .catch((err) => {
              reject(err);
            });
          break;
        case "delete":
          ApiService.delete(`${payload.url}`, payload.authToken, payload.body)
            .then((res) => {
              resolve(res);
            })
            .catch((err) => {
              reject(err);
            });
          break;
        case "blob":
          ApiService.blob(`${payload.url}`)
            .then((res) => {
              resolve(res);
            })
            .catch((err) => {
              reject(err);
            });
          break;
        default:
          break;
      }
    });
  },
};

const mutations = {
  [SET_ERROR](state, error) {
    state.errors = error;
  },
};

export default {
  actions,
  mutations,
};
