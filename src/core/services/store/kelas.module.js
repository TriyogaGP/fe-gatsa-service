import ApiService from "@/core/services/api.service";

const token = localStorage.getItem('user_token')
// action types
export const GET_KELAS = "getKelas";
export const POST_KELAS = "postKelas";
export const GET_KELAS_SISWA = "getKelasSiswa";

// mutation types
export const SET_LOADINGTABLE = "SET_LOADINGTABLE";
export const SET_KELAS = "SET_KELAS";
export const SET_KELAS_SISWA = "SET_KELAS_SISWA";

const state = {
  loadingtable: false,
  dataKelas: [],
  dataKelasSiswa: [],
}

const mutations = {
  [SET_LOADINGTABLE](state, data) {
    state.loadingtable = data
  },
  [SET_KELAS](state, data) {
    state.dataKelas = data
  },
  [SET_KELAS_SISWA](state, data) {
    state.dataKelasSiswa = data
  },
}

const getters = {
  kelasAll(state) {
    return state.dataKelas;
  },
  kelasSiswa(state) {
    return state.dataKelasSiswa;
  },
}

const actions = {
  [GET_KELAS](context, data) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`kelas/kelas?page=${data.page}&limit=${data.limit}${data.keyword ? `&keyword=${data.keyword}` : ''}`, token)
      .then((response) => {
          context.commit('SET_LOADINGTABLE', false)
          context.commit('SET_KELAS', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          context.commit('SET_LOADINGTABLE', false)
          reject(error);
        })
    });
  },
  [POST_KELAS](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`kelas/kelas`, token, bodyData)
      .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_KELAS_SISWA](context, data) {
    return new Promise((resolve, reject) => {
      let url
      if(data.kelas){
        url = `?kelas=${data.kelas}${data.roleID === '3' ? `&mengajar=${localStorage.getItem('mengajar_kelas')}` : ''}`
      }else{
        url = `${data.roleID === '3' ? `?mengajar=${localStorage.getItem('mengajar_kelas')}` : ''}`
      }
      ApiService.get(`kelas/kelassiswa${url}`, token)
      .then((response) => {
          context.commit('SET_KELAS_SISWA', response.data.result)
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