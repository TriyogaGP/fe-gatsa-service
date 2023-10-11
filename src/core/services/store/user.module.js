import ApiService from "@/core/services/api.service";

const token = localStorage.getItem('user_token')
const timeout = 2000
// action types
export const GET_DASHBOARD = "getDashboard";
export const GET_ADMINISTRATOR = "getAdministrator";
export const GET_ADMINISTRATOR_BY = "getAdministratorbyUID";
export const POST_ADMINISTRATOR = "postAdministrator";
export const GET_STRUKTURAL = "getStruktural";
export const GET_STRUKTURAL_BY = "getStrukturalbyUID";
export const POST_STRUKTURAL = "postStruktural";
export const GET_SISWASISWI = "getSiswaSiswi";
export const GET_SISWASISWI_BY = "getSiswaSiswibyUID";
export const POST_SISWASISWI = "postSiswaSiswi";
export const GET_NILAI = "getNilai";
export const POST_NILAI = "postNilai";
export const GET_WALI_KELAS = "getWaliKelas";
export const UPDATE_PERINGKAT = "updatePeringkat";
export const GET_JADWAL_MENGAJAR = "getJadwalMengajar";
export const POST_JADWAL_MENGAJAR = "postJadwalMengajar";
export const GET_LIST_SISWASISWI = "listSiswaSiswi";
export const GET_QUESTION_EXAM = "getQuestionExam";
export const POST_QUESTION_EXAM = "postQuestionExam";
export const GET_JADWAL_EXAM = "getJadwalExam";
export const GET_JADWAL_EXAM_BY = "getJadwalExambyID";
export const GET_RANDOM_QUESTION = "getRandomQuestion";
export const POST_JADWAL_EXAM = "postJadwalExam";
export const POST_KOREKSI_EXAM = "postKoreksiExam";
export const POST_JAWABAN_EXAM = "postJawabanExam";

// mutation types
export const SET_LOADINGTABLE = "SET_LOADINGTABLE";
export const SET_DASHBOARD = "SET_DASHBOARD";
export const SET_ADMINISTRATOR = "SET_ADMINISTRATOR";
export const SET_ADMINISTRATORBY = "SET_ADMINISTRATORBY";
export const SET_STRUKTURAL = "SET_STRUKTURAL";
export const SET_STRUKTURALBY = "SET_STRUKTURALBY";
export const SET_SISWASISWI = "SET_SISWASISWI";
export const SET_SISWASISWIBY = "SET_SISWASISWIBY";
export const SET_NILAI = "SET_NILAI";
export const SET_WALI_KELAS = "SET_WALI_KELAS";
export const SET_JADWAL_MENGAJAR = "SET_JADWAL_MENGAJAR";
export const SET_LIST_SISWASISWI = "SET_LIST_SISWASISWI";
export const SET_QUESTION_EXAM = "SET_QUESTION_EXAM";
export const SET_JADWAL_EXAM = "SET_JADWAL_EXAM";
export const SET_JADWAL_EXAM_BY = "SET_JADWAL_EXAM_BY";
export const SET_RANDOM_QUESTION = "SET_RANDOM_QUESTION";
export const SET_KOREKSI_EXAM = "SET_KOREKSI_EXAM";

const state = {
  loadingtable: false,
  dataDashboard: [],
  dataAdministrator: [],
  dataAdministratorBy: null,
  dataStruktural: [],
  dataStrukturalBy: null,
  dataSiswaSiswi: [],
  dataSiswaSiswiBy: null,
  dataNilai: [],
  dataWaliKelas: [],
  dataJadwalMengajar: [],
  listSiswaSiswi: [],
  dataQuestionExam: [],
  dataJadwalExam: [],
  dataJadwalExamBy: null,
  dataRandomQuestion: null,
  dataKoreksiExam: null,
}

const mutations = {
  [SET_LOADINGTABLE](state, data) {
    state.loadingtable = data
  },
  [SET_DASHBOARD](state, data) {
    state.dataDashboard = data
  },
  [SET_ADMINISTRATOR](state, data) {
    state.dataAdministrator = data
  },
  [SET_ADMINISTRATORBY](state, data) {
    state.dataAdministratorBy = data
  },
  [SET_STRUKTURAL](state, data) {
    state.dataStruktural = data
  },
  [SET_STRUKTURALBY](state, data) {
    state.dataStrukturalBy = data
  },
  [SET_SISWASISWI](state, data) {
    state.dataSiswaSiswi = data
  },
  [SET_SISWASISWIBY](state, data) {
    state.dataSiswaSiswiBy = data
  },
  [SET_NILAI](state, data) {
    state.dataNilai = data
  },
  [SET_WALI_KELAS](state, data) {
    state.dataWaliKelas = data
  },
  [SET_JADWAL_MENGAJAR](state, data) {
    state.dataJadwalMengajar = data
  },
  [SET_LIST_SISWASISWI](state, data) {
    state.listSiswaSiswi = data
  },
  [SET_QUESTION_EXAM](state, data) {
    state.dataQuestionExam = data
  },
  [SET_JADWAL_EXAM](state, data) {
    state.dataJadwalExam = data
  },
  [SET_JADWAL_EXAM_BY](state, data) {
    state.dataJadwalExamBy = data
  },
  [SET_RANDOM_QUESTION](state, data) {
    state.dataRandomQuestion = data
  },
  [SET_KOREKSI_EXAM](state, data) {
    state.dataKoreksiExam = data
  },
}

const getters = {
  administratorAll(state) {
    return state.dataAdministrator;
  },
  administratorBy(state) {
    return state.dataAdministratorBy;
  },
  strukturalAll(state) {
    return state.dataStruktural;
  },
  strukturalBy(state) {
    return state.dataStrukturalBy;
  },
  siswasiswiAll(state) {
    return state.dataSiswaSiswi;
  },
  siswasiswiBy(state) {
    return state.dataSiswaSiswiBy;
  },
  nilai(state) {
    return state.dataNilai;
  },
  waliKelas(state) {
    return state.dataWaliKelas;
  },
  jadwalMengajarAll(state) {
    return state.dataJadwalMengajar;
  },
  listSiswaSiswiAll(state) {
    return state.listSiswaSiswi;
  },
  questionExam(state) {
    return state.dataQuestionExam;
  },
  jadwalExam(state) {
    return state.dataJadwalExam;
  },
  jadwalExamBy(state) {
    return state.dataJadwalExamBy;
  },
}

const actions = {
  [GET_DASHBOARD](context, data) {
    return new Promise((resolve, reject) => {
      ApiService.get(`user/dashboard${typeof data.kelas !== 'object' ? `?kelas=${data.kelas}` : ''}`, token)
      .then((response) => {
        context.commit('SET_DASHBOARD', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [GET_ADMINISTRATOR](context, data) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`user/admin?page=${data.page}&limit=${data.limit}${data.keyword ? `&keyword=${data.keyword}` : ''}`, token)
      .then((response) => {
        context.commit('SET_LOADINGTABLE', false)
        context.commit('SET_ADMINISTRATOR', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        context.commit('SET_LOADINGTABLE', false)
        reject(error);
      })
    });
  },
  [GET_ADMINISTRATOR_BY](context, uid) {
    return new Promise((resolve, reject) => {
      ApiService.get(`user/admin/${uid}`, token)
      .then((response) => {
        context.commit('SET_ADMINISTRATORBY', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [POST_ADMINISTRATOR](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`user/admin`, token, bodyData)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [GET_STRUKTURAL](context, data) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`user/struktural?page=${data.page}&limit=${data.limit}${data.keyword ? `&keyword=${data.keyword}` : ''}`, token)
      .then((response) => {
        context.commit('SET_LOADINGTABLE', false)
        context.commit('SET_STRUKTURAL', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        context.commit('SET_LOADINGTABLE', false)
        reject(error);
      })
    });
  },
  [GET_STRUKTURAL_BY](context, uid) {
    return new Promise((resolve, reject) => {
      ApiService.get(`user/struktural/${uid}`, token)
      .then((response) => {
        context.commit('SET_STRUKTURALBY', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [POST_STRUKTURAL](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`user/struktural`, token, bodyData)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [GET_SISWASISWI](context, data) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`user/siswasiswi?page=${data.page}&limit=${data.limit}${data.keyword ? `&keyword=${data.keyword}` : ''}${typeof data.kelas !== 'undefined' || data.kelas ? `&kelas=${data.kelas}` : ''}&filter=${data.filter}`, token)
      .then((response) => {
        context.commit('SET_LOADINGTABLE', false)
        context.commit('SET_SISWASISWI', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        context.commit('SET_LOADINGTABLE', false)
        reject(error);
      })
    });
  },
  [GET_SISWASISWI_BY](context, data) {
    return new Promise((resolve, reject) => {
      ApiService.get(`user/siswasiswi/${data.uid}${data.mapel ? `?mapel=${data.mapel}` : ''}`, token)
      .then((response) => {
        context.commit('SET_SISWASISWIBY', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [POST_SISWASISWI](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`user/siswasiswi`, token, bodyData)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [GET_NILAI](context, data) {
    return new Promise((resolve, reject) => {
      let url
      if(typeof data.idUser !== 'undefined'){
        url = `?idUser=${data.idUser}&kelas=${data.kelas}&mapel=${data.mapel}`
      }else{
        url = `?kelas=${data.kelas}&mapel=${data.mapel}`
      }
      ApiService.get(`user/nilai${url}`, token)
      .then((response) => {
        context.commit('SET_NILAI', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [POST_NILAI](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`user/nilai`, token, bodyData)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [GET_WALI_KELAS](context, data) {
    return new Promise((resolve, reject) => {
      ApiService.get(`user/walikelas?page=${data.page}&kelas=${data.kelas}`, token)
      .then((response) => {
        context.commit('SET_WALI_KELAS', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [UPDATE_PERINGKAT](context, kelas) {
    return new Promise((resolve, reject) => {
      ApiService.get(`user/update-peringkat?kelas=${kelas}`, token)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [GET_JADWAL_MENGAJAR](context, data) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`user/jadwal?page=${data.page}&limit=${data.limit}${data.keyword ? `&keyword=${data.keyword}` : ''}`, token)
      .then((response) => {
        context.commit('SET_LOADINGTABLE', false)
        context.commit('SET_JADWAL_MENGAJAR', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        context.commit('SET_LOADINGTABLE', false)
        reject(error);
      })
    });
  },
  [POST_JADWAL_MENGAJAR](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`user/jadwal`, token, bodyData)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [GET_LIST_SISWASISWI](context, data) {
    return new Promise((resolve, reject) => {
      ApiService.get(`user/list-siswasiswi?kelas=${data.kelas}${data.keyword ? `&keyword=${data.keyword}` : ''}`, token)
      .then((response) => {
        context.commit('SET_LIST_SISWASISWI', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [GET_QUESTION_EXAM](context, data) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`user/question-exam?page=${data.page}&limit=${data.limit}${data.keyword ? `&keyword=${data.keyword}` : ''}`, token)
      .then((response) => {
        context.commit('SET_LOADINGTABLE', false)
        context.commit('SET_QUESTION_EXAM', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        context.commit('SET_LOADINGTABLE', false)
        reject(error);
      })
    });
  },
  [POST_QUESTION_EXAM](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`user/question-exam`, token, bodyData)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [GET_JADWAL_EXAM](context, data) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`user/jadwal-exam?page=${data.page}&limit=${data.limit}${data.mapel ? `&mapel=${data.mapel}` : ''}${data.kelas ? `&kelas=${data.kelas}` : ''}`, token)
      .then((response) => {
        context.commit('SET_LOADINGTABLE', false)
        context.commit('SET_JADWAL_EXAM', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        context.commit('SET_LOADINGTABLE', false)
        reject(error);
      })
    });
  },
  [GET_JADWAL_EXAM_BY](context, id_jadwal_exam) {
    return new Promise((resolve, reject) => {
      ApiService.get(`user/jadwal-exam-id/${id_jadwal_exam}`, token)
      .then((response) => {
        context.commit('SET_JADWAL_EXAM_BY', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [GET_RANDOM_QUESTION](context, data) {
    return new Promise((resolve, reject) => {
      ApiService.get(`user/kode-soal-random?mapel=${data.mapel}&kelas=${data.kelas}&limitSoal=${data.limitSoal}`, token)
      .then((response) => {
        context.commit('SET_RANDOM_QUESTION', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [POST_JADWAL_EXAM](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`user/jadwal-exam`, token, bodyData)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [POST_JAWABAN_EXAM](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`user/simpan-jwaban-exam`, token, bodyData)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [POST_KOREKSI_EXAM](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`user/koreksi-exam`, token, bodyData)
      .then((response) => {
        context.commit('SET_KOREKSI_EXAM', response.data.result)
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