import axios from "axios";
import VueAxios from "vue-axios";
import { API_URL } from "@/core/config/app";

const ApiService = {
	install(app) {
    app.use(VueAxios, axios)
    app.axios.defaults.baseURL = API_URL;

    app.axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async function (error) {
        if (typeof error.response == "undefined") {
          // network error
          let errorStatus = {
            status: "failed",
            statusText: "Network Error",
          };
          return Promise.reject(errorStatus);
        } else if (error.response.status === 401) {
          localStorage.clear();
          return Promise.reject(error);
        } else if (error.response.status === 404) {
          return Promise.reject(error);
        } else if (error.response.status === 405) {
          let errorStatus = {
            status: "bad request",
            statusText: "Method Not Allowed!",
          };
          return Promise.reject(errorStatus);
        } else if (
          error.response.status === 502 ||
          error.response.status === 503 ||
          error.response.status === 504 ||
          error.response.status === 501
        ) {
          let errorStatus = {
            status: "failed",
            statusText: "There's Something Wrong With Server",
          };
          return Promise.reject(errorStatus);
        }

        // return Error object with Promise
        return Promise.reject(error);
      }
    );
  },

  /**
   * Set the default HTTP request headers
   */
  setHeader: async() => {
    try {
      // app.axios.defaults.headers.common[
      //   "user_key"
      // ] = await userKey;
      return axios.defaults.headers.common = {
        'Authorization': `Bearer ${localStorage.getItem('user_token')}`
      }
      // const response = await app.axios.defaults.headers.common[
      //   "user_key"
      // ]
    } catch (error) {
      console.log(error);
    }
  },
  
  query(resource, token, body) {
    return axios.get(resource, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, body).catch((error) => {
      throw new Error(`[KT] ApiService ${error}`);
    });
  },

  /**
   * Send the GET HTTP request for Blob type
   * @param resource
   * @param slug
   * @returns {*}
   */
  blob(resource) {
    let headers = { method: "GET", url: resource };
    headers["responseType"] = "blob";
    return axios(headers);
  },

  /**
   * Send the GET HTTP request
   * @param resource
   * @param slug
   * @returns {*}
   */
  get(resource, token) {
    let checktoken = this.checkToken(token)
    let authToken = {
      JWT: {
        'Authorization': `Bearer ${checktoken.token}`
      },
      NONJWT: {
        'x-inter-service-call': `${checktoken.token}`
      },
    }
    return axios.get(`${resource}`, {
      headers: checktoken.jwt ? authToken.JWT : authToken.NONJWT
    })
  },

  /**
   * Set the POST HTTP request
   * @param resource
   * @param body
   * @returns {*}
   */
  post(resource, token, body) {
    let checktoken = this.checkToken(token)
    let authToken = {
      JWT: {
        'Authorization': `Bearer ${checktoken.token}`
      },
      NONJWT: {
        'x-inter-service-call': `${checktoken.token}`
      },
    }
    return axios.post(`${resource}`, body, {
      headers: checktoken.jwt ? authToken.JWT : authToken.NONJWT
    })
    .catch((error) => {
      // throw new Error(`[KT] ApiService ${error}`);
      throw error;
    });
  },

  /**
   * Set the POST HTTP request
   * @param resource
   * @param body
   * @returns {*}
   */
  postLogin(resource, body) {
    return axios.post(`${resource}`, body)
    .catch((error) => {
      // throw new Error(`[KT] ApiService ${error}`);
      throw error;
    });
  },

  /**
   * Set the POST HTTP request
   * @param resource
   * @param body
   * @returns {*}
   */
  postFile(resource, body) {
    return axios.post(`${resource}`, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    })
    .catch((error) => {
      // throw new Error(`[KT] ApiService ${error}`);
      throw error;
    });
  },

  /**
   * Send the UPDATE HTTP request
   * @param resource
   * @param body
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  update(resource, token, body) {
    let checktoken = this.checkToken(token)
    let authToken = {
      JWT: {
        'Authorization': `Bearer ${checktoken.token}`
      },
      NONJWT: {
        'x-inter-service-call': `${checktoken.token}`
      },
    }
    return axios.put(`${resource}`, body, {
      headers: checktoken.jwt ? authToken.JWT : authToken.NONJWT
    })
    .catch((error) => {
      // throw new Error(`[KT] ApiService ${error}`);
      throw error;
    });
  },

  /**
   * Send the PUT HTTP request
   * @param resource
   * @param body
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  put(resource, token, body) {
    let checktoken = this.checkToken(token)
    let authToken = {
      JWT: {
        'Authorization': `Bearer ${checktoken.token}`
      },
      NONJWT: {
        'x-inter-service-call': `${checktoken.token}`
      },
    }
    return axios.put(`${resource}`, body, {
      headers: checktoken.jwt ? authToken.JWT : authToken.NONJWT
    })
    .catch((error) => {
      // throw new Error(`[KT] ApiService ${error}`);
      throw error;
    });
  },

  /**
   * Send the DELETE HTTP request
   * @param resource
   * @returns {*}
   */
  delete(resource, token, body) {
    let checktoken = this.checkToken(token)
    let authToken = {
      JWT: {
        'Authorization': `Bearer ${checktoken.token}`
      },
      NONJWT: {
        'x-inter-service-call': `${checktoken.token}`
      },
    }
    return axios.delete(`${resource}`, body, {
      headers: checktoken.jwt ? authToken.JWT : authToken.NONJWT
    }).catch((error) => {
      // throw new Error(`[RWV] ApiService ${error}`);
      throw error;
    });
  },

  /**
   * Send the CHECK Token
   * @param token
   * @returns {*}
   */
  checkToken(token) {
    let res;
    if(token === '12qwaszx@321123'){
      res = {
        token,
        jwt: false,
      }
    }else{
      res = {
        token,
        jwt: true,
      }
    }
    return res
  },
}

export default ApiService;