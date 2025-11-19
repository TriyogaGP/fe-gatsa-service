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
export const GET_JADWAL_PELAJARAN = "getJadwalPelajaran";
export const GET_MODUL_PELAJARAN = "getModulPelajaran";
export const POST_JADWAL_MENGAJAR = "postJadwalMengajar";
export const GET_KELAS_SISWA = "getKelasSiswa";
export const GET_LIST_SISWASISWI = "listSiswaSiswi";
export const GET_QUESTION_EXAM = "getQuestionExam";
export const POST_QUESTION_EXAM = "postQuestionExam";
export const GET_JADWAL_EXAM = "getJadwalExam";
export const GET_JADWAL_EXAM_BY = "getJadwalExambyID";
export const GET_RANDOM_QUESTION = "getRandomQuestion";
export const POST_JADWAL_EXAM = "postJadwalExam";
export const POST_KOREKSI_EXAM = "postKoreksiExam";
export const POST_JAWABAN_EXAM = "postJawabanExam";
export const GET_LIST_PICK = "getListPick";
export const POST_LIST_PICK = "postListPick";

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
export const SET_JADWAL_PELAJARAN = "SET_JADWAL_PELAJARAN";
export const SET_MODUL_PELAJARAN = "SET_MODUL_PELAJARAN";
export const SET_KELAS_SISWA = "SET_KELAS_SISWA";
export const SET_LIST_SISWASISWI = "SET_LIST_SISWASISWI";
export const SET_QUESTION_EXAM = "SET_QUESTION_EXAM";
export const SET_JADWAL_EXAM = "SET_JADWAL_EXAM";
export const SET_JADWAL_EXAM_BY = "SET_JADWAL_EXAM_BY";
export const SET_RANDOM_QUESTION = "SET_RANDOM_QUESTION";
export const SET_KOREKSI_EXAM = "SET_KOREKSI_EXAM";
export const SET_LIST_PICK = "SET_LIST_PICK";

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
  dataJadwalPelajaran: [],
  dataModulPelajaran: [],
  dataKelasSiswa: [],
  listSiswaSiswi: [],
  dataQuestionExam: [],
  dataListPick: [],
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
  [SET_JADWAL_PELAJARAN](state, data) {
    state.dataJadwalPelajaran = data
  },
  [SET_MODUL_PELAJARAN](state, data) {
    state.dataModulPelajaran = data
  },
  [SET_KELAS_SISWA](state, data) {
    state.dataKelasSiswa = data
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
  [SET_LIST_PICK](state, data) {
    state.dataListPick = data
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
  jadwalPelajaranAll(state) {
    return state.dataJadwalPelajaran;
  },
  modulPelajaranAll(state) {
    return state.dataModulPelajaran;
  },
  kelasSiswa(state) {
    return state.dataKelasSiswa;
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
  listPick(state) {
    return state.dataListPick;
  },
}

const actions = {
  [GET_DASHBOARD](context, data) {
    return new Promise((resolve, reject) => {
      ApiService.get(`user/dashboard${data.kelas !== null ? `?kelas=${data.kelas}` : ''}`, token)
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
      ApiService.get(`user/admin?page=${data.page}&limit=${data.limit}${data.keyword ? `&keyword=${data.keyword}` : ''}${data.sorting !== '' ? `&sort=${data.sorting}` : ''}`, token)
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
      ApiService.get(`user/struktural?page=${data.page}&limit=${data.limit}${data.keyword ? `&keyword=${data.keyword}` : ''}${data.sorting !== '' ? `&sort=${data.sorting}` : ''}`, token)
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
      ApiService.get(`user/siswa-siswi?page=${data.page}&limit=${data.limit}${data.keyword ? `&keyword=${data.keyword}` : ''}${typeof data.kelas !== 'undefined' || data.kelas ? `&kelas=${data.kelas}` : ''}${data.filter !== '' ? `&filter=${data.filter}` : ''}${data.sorting !== '' ? `&sort=${data.sorting}` : ''}`, token)
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
      ApiService.get(`user/siswa-siswi/${data.uid}${data.mapel ? `?mapel=${data.mapel}` : ''}`, token)
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
      ApiService.post(`user/siswa-siswi`, token, bodyData)
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
      ApiService.get(`user/wali-kelas?page=${data.page}&kelas=${data.kelas}`, token)
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
  [GET_JADWAL_PELAJARAN](context, data) {
    return new Promise((resolve, reject) => {
      ApiService.get(`user/jadwal-pelajaran`, token)
      .then((response) => {
        context.commit('SET_JADWAL_PELAJARAN', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        context.commit('SET_LOADINGTABLE', false)
        reject(error);
      })
    });
  },
  [GET_MODUL_PELAJARAN](context, data) {
    return new Promise((resolve, reject) => {
      ApiService.get(`user/modul?kelas=${data.kelas}`, token)
      .then((response) => {
        context.commit('SET_MODUL_PELAJARAN', response.data.result)
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
  [GET_KELAS_SISWA](context, data) {
    return new Promise((resolve, reject) => {
      let url
      if(data.kelas){
        url = `?kelas=${data.kelas}${data.roleID === '3' ? `&mengajar=${localStorage.getItem('mengajar_kelas')}` : ''}`
      }else{
        url = `${data.roleID === '3' ? `?mengajar=${localStorage.getItem('mengajar_kelas')}` : ''}`
      }
      ApiService.get(`user/kelas-siswa${url}`, token)
      .then((response) => {
          context.commit('SET_KELAS_SISWA', response.data.result)
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
      ApiService.get(`user/jadwal-exam?page=${data.page}&limit=${data.limit}${typeof data.sorting !== 'undefined' ? `&sort=${data.sorting}` : ''}${data.mapel ? `&mapel=${data.mapel}` : ''}${data.kelas ? `&kelas=${data.kelas}` : ''}`, token)
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
  [GET_RANDOM_QUESTION](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`user/kode-soal-random`, token, bodyData)
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
      ApiService.post(`user/simpan-jawaban-exam`, token, bodyData)
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
  [GET_LIST_PICK](context, data) {
    return new Promise((resolve, reject) => {
      ApiService.get(`user/list-pick?page=${data.page}&limit=${data.limit}&kelas=${data.kelas}&mapel=${data.mapel}&jenis=${data.jenis}${data.keyword ? `&keyword=${data.keyword}` : ''}`, token)
      .then((response) => {
        context.commit('SET_LIST_PICK', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [POST_LIST_PICK](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`user/list-pick`, token, bodyData)
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