import ApiService from "@/core/services/api.service";

const token = '12qwaszx@321123'

// action types
export const GET_AGAMA = "getAgama";
export const GET_HOBI = "getHobi";
export const GET_CITACITA = "getCitaCita";
export const GET_PENDIDIKAN = "getPendidikan";
export const GET_PEKERJAAN = "getPekerjaan";
export const GET_PENGHASILAN = "getPenghasilan";
export const GET_STATUSORANGTUA = "getStatusOrangTua";
export const GET_STATUSTEMPATTINGGAL = "getStatusTempatTinggal";
export const GET_JARAKRUMAH = "getJarakRumah";
export const GET_TRANSPORTASI = "getTransportasi";
export const GET_JABATAN = "getJabatan";
export const GET_MENGAJAR = "getMengajar";
export const GET_JENJANGSEKOLAH = "getJenjangSekolah";
export const GET_KELAS = "getKelas";
export const GET_WILAYAH = "getWilayah";
export const GET_BERKAS = "getBerkas";
export const GET_MENU = "getMenu";
export const GET_UID = "getUID";
export const GET_CMS_SETTINGS = "getCMSSettings";
export const POST_CMS_SETTINGS = "postCMSSettings";
export const GET_ROLE = "getRole";
export const POST_ROLE = "postRole";
export const GET_MENUDATA = "getMenuData";
export const POST_MENUDATA = "postMenuData";
export const GET_SEQUENCEMENU = "getSequenceMenu";
export const POST_SEQUENCEMENU = "postSequenceMenu";
export const GET_ROLEMENU = "getRoleMenu";
export const POST_ROLEMENU = "postRoleMenu";
export const GET_KATEGORI_NOTIFIKASI = "getKategoriNotifikasi";
export const GET_NOTIFIKASI = "getNotifikasi";
export const POST_NOTIFIKASI = "postNotifikasi";
export const GET_USER_BROADCAST = "getUserBroadcast";
export const GET_COUNT_NOTIFIKASI = "getCountNotifikasi";
export const GET_DATA_BERKAS = "getDataBerkas";
export const POST_DATA_BERKAS = "postDataBerkas";
export const GET_LIST_EXAM = "getListExam";
export const GET_DATA_RFID = "getDataRFID";
export const POST_DATA_RFID = "postDataRFID";

// mutation types
export const SET_LOADINGTABLE = "SET_LOADINGTABLE";
export const SET_AGAMA = "SET_AGAMA";
export const SET_HOBI = "SET_HOBI";
export const SET_CITACITA = "SET_CITACITA";
export const SET_PENDIDIKAN = "SET_PENDIDIKAN";
export const SET_PEKERJAAN = "SET_PEKERJAAN";
export const SET_PENGHASILAN = "SET_PENGHASILAN";
export const SET_STATUSORANGTUA = "SET_STATUSORANGTUA";
export const SET_STATUSTEMPATTINGGAL = "SET_STATUSTEMPATTINGGAL";
export const SET_JARAKRUMAH = "SET_JARAKRUMAH";
export const SET_TRANSPORTASI = "SET_TRANSPORTASI";
export const SET_JABATAN = "SET_JABATAN";
export const SET_MENGAJAR = "SET_MENGAJAR";
export const SET_JENJANGSEKOLAH = "SET_JENJANGSEKOLAH";
export const SET_KELAS = "SET_KELAS";
export const SET_WILAYAH = "SET_WILAYAH";
export const SET_BERKAS = "SET_BERKAS";
export const SET_MENU = "SET_MENU";
export const SET_UID = "SET_UID";
export const SET_CMSSETTINGS = "SET_CMSSETTINGS";
export const SET_ROLE = "SET_ROLE";
export const SET_MENUDATA = "SET_MENUDATA";
export const SET_SEQUENCEMENU = "SET_SEQUENCEMENU";
export const SET_ROLEMENU = "SET_ROLEMENU";
export const SET_KATEGORI_NOTIFIKASI = "SET_KATEGORI_NOTIFIKASI";
export const SET_NOTIFIKASI = "SET_NOTIFIKASI";
export const SET_USER_BROADCAST = "SET_USER_BROADCAST";
export const SET_DATA_BERKAS = "SET_DATA_BERKAS";
export const SET_DATA_RFID = "SET_DATA_RFID";
export const SET_LIST_EXAM = "SET_LIST_EXAM";

const state = {
  loadingtable: false,
  agamaOptions: [],
  hobiOptions: [],
  citacitaOptions: [],
  pendidikanOptions: [],
  pekerjaanOptions: [],
  penghasilanOptions: [],
  statusorangtuaOptions: [],
  statustempattinggalOptions: [],
  jarakrumahOptions: [],
  transportasiOptions: [],
  jabatanOptions: [],
  mengajarOptions: [],
  jenjangOptions: [],
  kelasOptions: [],
  kelasUseOptions: [],
  ProvinsiOptions: [],
  KabKotaOptions: [],
  KecamatanOptions: [],
  KelurahanOptions: [],
  KabKotaOnlyOptions: [],
  menuOptions: [],
  berkasOptions: [],
  listOptions: [],

  dataRole: [],
  dataMenu: [],
  dataSequenceMenu: [],
  dataRoleMenu: [],
  dataKategoriNotifikasi: [],
  dataNotifikasi: [],
  dataUserBroadcast: [],
  dataBerkas: [],
  dataRFID: [],

  dataCountNotifikasi: null,
  dataUID: null,
  dataCMSSetting: null,
}

const mutations = {
  [SET_LOADINGTABLE](state, data) {
    state.loadingtable = data
  },
  [SET_AGAMA](state, data) {
    state.agamaOptions = data
  },
  [SET_HOBI](state, data) {
    state.hobiOptions = data
  },
  [SET_CITACITA](state, data) {
    state.citacitaOptions = data
  },
  [SET_PENDIDIKAN](state, data) {
    state.pendidikanOptions = data
  },
  [SET_PEKERJAAN](state, data) {
    state.pekerjaanOptions = data
  },
  [SET_PENGHASILAN](state, data) {
    state.penghasilanOptions = data
  },
  [SET_STATUSORANGTUA](state, data) {
    state.statusorangtuaOptions = data
  },
  [SET_STATUSTEMPATTINGGAL](state, data) {
    state.statustempattinggalOptions = data
  },
  [SET_JARAKRUMAH](state, data) {
    state.jarakrumahOptions = data
  },
  [SET_TRANSPORTASI](state, data) {
    state.transportasiOptions = data
  },
  [SET_JABATAN](state, data) {
    state.jabatanOptions = data
  },
  [SET_MENGAJAR](state, data) {
    state.mengajarOptions = data
  },
  [SET_JENJANGSEKOLAH](state, data) {
    state.jenjangOptions = data
  },
  [SET_KELAS](state, data) {
    if(data.kategori === 'All'){
      state.kelasOptions = data.kelas
    }else if(data.kategori === 'Use'){
      state.kelasUseOptions = data.kelas
    }
  },
  [SET_WILAYAH](state, data) {
    if(data.kategori === 'provinsi'){
      state.ProvinsiOptions = data.wilayah
    }else if(data.kategori === 'kabkota'){
      state.KabKotaOptions = data.wilayah
    }else if(data.kategori === 'kecamatan'){
      state.KecamatanOptions = data.wilayah
    }else if(data.kategori === 'kelurahan'){
      state.KelurahanOptions = data.wilayah
    }else if(data.kategori === 'kabkotaOnly'){
      state.KabKotaOnlyOptions = data.wilayah
    }
  },
  [SET_BERKAS](state, data) {
    state.berkasOptions = data
  },
  [SET_LIST_EXAM](state, data) {
    state.listOptions = data
  },
  
  [SET_UID](state, data) {
    state.dataUID = data
  },
  [SET_CMSSETTINGS](state, data) {
    state.dataCMSSetting = data
  },
  [SET_MENU](state, data) {
    state.menuOptions = data
  },
  [SET_ROLE](state, data) {
    state.dataRole = data
  },
  [SET_MENUDATA](state, data) {
    state.dataMenu = data
  },
  [SET_SEQUENCEMENU](state, data) {
    state.dataSequenceMenu = data
  },
  [SET_ROLEMENU](state, data) {
    state.dataRoleMenu = data
  },
  [SET_KATEGORI_NOTIFIKASI](state, data) {
    state.dataKategoriNotifikasi = data
  },
  [SET_NOTIFIKASI](state, data) {
    state.dataNotifikasi = data
  },
  [SET_USER_BROADCAST](state, data) {
    state.dataUserBroadcast = data
  },
  [SET_DATA_BERKAS](state, data) {
    state.dataBerkas = data
  },
  [SET_DATA_RFID](state, data) {
    state.dataRFID = data
  },
}

const getters = {
  userUID(state) {
    return state.dataUID;
  },
  cmssettings(state) {
    return state.dataCMSSetting;
  },
  roleAll(state) {
    return state.dataRole;
  },
  menuAll(state) {
    return state.dataMenu;
  },
  sequencemenuAll(state) {
    return state.dataSequenceMenu;
  },
  rolemenuAll(state) {
    return state.dataRoleMenu;
  },
  kategoriAll(state) {
    return state.dataKategoriNotifikasi;
  },
  notifikasiAll(state) {
    return state.dataNotifikasi;
  },
  userBroadcastAll(state) {
    return state.dataUserBroadcast;
  },
  berkasAll(state) {
    return state.dataBerkas;
  },
  rfidAll(state) {
    return state.dataRFID;
  },
}

const actions = {
  [GET_AGAMA](context) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/optionsAgama`, token)
      .then((response) => {
          context.commit('SET_AGAMA', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_HOBI](context) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/optionsHobi`, token)
      .then((response) => {
          context.commit('SET_HOBI', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_CITACITA](context) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/optionsCitaCita`, token)
      .then((response) => {
          context.commit('SET_CITACITA', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_PENDIDIKAN](context) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/optionsPendidikan`, token)
      .then((response) => {
          context.commit('SET_PENDIDIKAN', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_PEKERJAAN](context) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/optionsPekerjaan`, token)
      .then((response) => {
          context.commit('SET_PEKERJAAN', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_PENGHASILAN](context) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/optionsPenghasilan`, token)
      .then((response) => {
          context.commit('SET_PENGHASILAN', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_STATUSORANGTUA](context) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/optionsStatusOrangtua`, token)
      .then((response) => {
          context.commit('SET_STATUSORANGTUA', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_STATUSTEMPATTINGGAL](context) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/optionsStatusTempatTinggal`, token)
      .then((response) => {
          context.commit('SET_STATUSTEMPATTINGGAL', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_JARAKRUMAH](context) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/optionsJarakRumah`, token)
      .then((response) => {
          context.commit('SET_JARAKRUMAH', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_TRANSPORTASI](context) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/optionsTransportasi`, token)
      .then((response) => {
          context.commit('SET_TRANSPORTASI', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_JABATAN](context) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/optionsJabatan`, token)
      .then((response) => {
          context.commit('SET_JABATAN', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_MENGAJAR](context) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/optionsMengajar`, token)
      .then((response) => {
          context.commit('SET_MENGAJAR', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_JENJANGSEKOLAH](context) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/optionsJenjangSekolah`, token)
      .then((response) => {
          context.commit('SET_JENJANGSEKOLAH', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_KELAS](context, data) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/optionsKelas?kondisi=${data.kondisi}${data.walikelas ? `&walikelas=${data.walikelas}` : ''}`, token)
      .then((response) => {
          context.commit('SET_KELAS', { kelas: response.data.result, kategori: data.kondisi })
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_WILAYAH](context, data) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/optionsWilayah?bagian=${data.bagian}&KodeWilayah=${data.KodeWilayah}`, token)
      .then((response) => {
          context.commit('SET_WILAYAH', { wilayah: response.data.result, kategori: data.bagian })
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_BERKAS](context, data) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/optionsBerkas${data.kategori ? `?kategori=${data.kategori}` : ''}`, token)
      .then((response) => {
          context.commit('SET_BERKAS', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_LIST_EXAM](context, data) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/listExam${data.kelas ? `?kelas=${data.kelas}` : ''}`, token)
      .then((response) => {
          context.commit('SET_LIST_EXAM', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_MENU](context, roleID) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/optionsMenu?id_role=${roleID}`, localStorage.getItem('user_token'))
      .then((response) => {
          context.commit('SET_MENU', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },

  [GET_UID](context) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/getUID`, token)
      .then((response) => {
          context.commit('SET_UID', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_CMS_SETTINGS](context) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/cmssetting`, token)
      .then((response) => {
          context.commit('SET_CMSSETTINGS', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [POST_CMS_SETTINGS](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.put(`settings/cmssetting`, token, bodyData)
      .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_ROLE](context, data) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`settings/Role?page=${data.page}&limit=${data.limit}${data.keyword ? `&keyword=${data.keyword}` : ''}`, token)
      .then((response) => {
          context.commit('SET_LOADINGTABLE', false)
          context.commit('SET_ROLE', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          context.commit('SET_LOADINGTABLE', false)
          reject(error);
        })
    });
  },
  [POST_ROLE](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`settings/Role`, token, bodyData)
      .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_MENUDATA](context, data) {
    return new Promise((resolve, reject) => {
      let url
      if(typeof data.pilihan !== 'undefined' || data.pilihan){
        url = `?pilihan=${data.pilihan}`
      }else{
        url = `?page=${data.page}&limit=${data.limit}${data.keyword ? `&keyword=${data.keyword}` : ''}`
      }
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`settings/Menu${url}`, token)
      .then((response) => {
          context.commit('SET_LOADINGTABLE', false)
          context.commit('SET_MENUDATA', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          context.commit('SET_LOADINGTABLE', false)
          reject(error);
        })
    });
  },
  [POST_MENUDATA](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`settings/Menu`, token, bodyData)
      .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_SEQUENCEMENU](context) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/SequenceMenu`, token)
      .then((response) => {
          context.commit('SET_SEQUENCEMENU', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [POST_SEQUENCEMENU](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`settings/SequenceMenu`, token, bodyData)
      .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_ROLEMENU](context, data) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`settings/RoleMenu?page=${data.page}&limit=${data.limit}${data.keyword ? `&keyword=${data.keyword}` : ''}`, token)
      .then((response) => {
          context.commit('SET_LOADINGTABLE', false)
          context.commit('SET_ROLEMENU', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          context.commit('SET_LOADINGTABLE', false)
          reject(error);
        })
    });
  },
  [POST_ROLEMENU](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`settings/RoleMenu`, token, bodyData)
      .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_NOTIFIKASI](context, data) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`settings/Notifikasi?kategori=${data.kategori}&untuk=${data.untuk ? `${data.untuk}` : 'penerima'}&page=${data.page}&limit=${data.limit}`, localStorage.getItem('user_token'))
      .then((response) => {
          context.commit('SET_LOADINGTABLE', false)
          context.commit('SET_NOTIFIKASI', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_KATEGORI_NOTIFIKASI](context) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/kategoriNotifikasi`, localStorage.getItem('user_token'))
      .then((response) => {
          context.commit('SET_KATEGORI_NOTIFIKASI', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_COUNT_NOTIFIKASI](context) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/countNotifikasi`, localStorage.getItem('user_token'))
      .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [POST_NOTIFIKASI](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`settings/Notifikasi`, localStorage.getItem('user_token'), bodyData)
      .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_USER_BROADCAST](context, data) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/dataUserBroadcast?kategori=${data.kategori}${data.kode === 1 ? `&kode=${data.kode}` : ''}`, localStorage.getItem('user_token'))
      .then((response) => {
          context.commit('SET_USER_BROADCAST', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_DATA_BERKAS](context, data) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`settings/Berkas?page=${data.page}&limit=${data.limit}${data.keyword ? `&keyword=${data.keyword}` : ''}`, token)
      .then((response) => {
          context.commit('SET_LOADINGTABLE', false)
          context.commit('SET_DATA_BERKAS', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          context.commit('SET_LOADINGTABLE', false)
          reject(error);
        })
    });
  },
  [POST_DATA_BERKAS](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`settings/Berkas`, token, bodyData)
      .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_DATA_RFID](context, data) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`settings/data-rfid?page=${data.page}&limit=${data.limit}${data.keyword ? `&keyword=${data.keyword}` : ''}`, token)
      .then((response) => {
          context.commit('SET_LOADINGTABLE', false)
          context.commit('SET_DATA_RFID', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          context.commit('SET_LOADINGTABLE', false)
          reject(error);
        })
    });
  },
  [POST_DATA_RFID](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`settings/data-rfid`, token, bodyData)
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