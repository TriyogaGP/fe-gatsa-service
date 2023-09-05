<template>
  <div>
    <v-container class="fill-height" fluid>
      <v-app-bar color="light-black darken-3" dark app>
        <img :src="logoSekolah" width="40" />
        <div class="ml-2 mr-2">{{ namaSekolah }}</div>
        <v-divider vertical :thickness="2" />
        <v-spacer />
      </v-app-bar>
      <v-row no-gutters>
        <v-col cols="12" class="d-flex flex-column justify-space-between align-center">
          <v-card class="elevation-12 tampilView" color="white">
            <h1 class="text-center display-1 light-black--text" style="color: #272727;"><strong>{{ namaSekolah }}</strong></h1>
            <h2 class="text-center display-1 light-black--text ma-3"><div class="pembungkus"><h4>Masuk Panel</h4></div></h2>
            <v-form>
              <v-col cols="12" class="py-0 px-0 mb-3">
                <TextField
                  v-model="username"
                  icon-prepend-tf="mdi mdi-email"
                  label-tf="user@mail.com atau username55"
                  type="text"
                  :clearable-tf="true"
                  @keyup.enter="AutentificationLogin()"
                />
              </v-col>
              <v-col cols="12" class="py-0 px-0 mb-3">
                <TextField
                  v-model="katasandi"
                  :slot-tf="true"
                  :action-prepend-tf="true"
                  label-tf="Kata Sandi"
                  :type-tf="passType ? 'text' : 'password'"
                  :icon-append-tf="passType ? 'mdi mdi-eye-lock' : 'mdi mdi-eye-lock-open'"
                  icon-prepend-tf="mdi mdi-lock"
                  :clearable-tf="true"
                  @keyup.enter="AutentificationLogin()"
                  @prosesicon="onClickVisible('passType')"
                />
              </v-col>
            </v-form>
            <h3 class="tombolLupaPass" @click="lupaSandi()">Lupa Kata Sandi ?</h3>
            <div class="text-center mt-3 mb-10">
              <Button 
                color-button="light-black darken-3"
                nama-button="Masuk"
                @proses="AutentificationLogin()"
              />
            </div>
          </v-card>
        </v-col>
      </v-row>
      <Footer :nama-sekolah="namaSekolah" />
    </v-container>
    <v-dialog
      v-model="dialogNotifikasi"
      transition="dialog-bottom-transition"
      persistent
      width="500px"
    >
      <PopUpNotifikasiVue
        :notifikasi-kode.sync="notifikasiKode"
        :notifikasi-text.sync="notifikasiText"
        :notifikasi-button.sync="notifikasiButton"
        @proses="goToProses"
        @cancel="dialogNotifikasi = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import { computed } from "vue";
import { mapActions, mapGetters, useStore } from "vuex";
import { useMeta } from 'vue-meta'
import PopUpNotifikasiVue from "./Layout/PopUpNotifikasi.vue";
import Footer from '../components/Footer.vue';
import io from 'socket.io-client'
export default {
  name: 'Login',
  components: {
    PopUpNotifikasiVue,
    Footer
  },
  data: () => ({
    API_URL: process.env.VUE_APP_BASE_URL_VIEW,
    passType: '',
    username: '',
    katasandi: '',

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Masuk - MTsS. SIROJUL ATHFAL",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
    // const store = useStore()
    // const cmssettings = computed(() => store.getters["setting/cmssettings"]);
    // return { cmssettings }
  },
  computed: {
    ...mapGetters({
      cmssettings: 'setting/cmssettings'
    }),
    namaSekolah(){
      return this.cmssettings ? this.cmssettings.namasekolah : null
    },
    logoSekolah(){
      return this.cmssettings ? `${this.API_URL}bahan/${this.cmssettings.logo}` : null
    }
  },
  mounted() {
    if(localStorage.getItem('user_token')) return this.$router.push(localStorage.getItem('roleID') === '4' ? {name: "Profile"} : {name: "Dashboard"});
    this.getCMSSettings()
  },
  methods: {
    ...mapActions({
      fetchData: 'fetchData',
      getCMSSettings: 'setting/getCMSSettings',
    }),
    AutentificationLogin(){
      const payload = {
        username: this.username,
        password: this.katasandi,
      }
      this.$store.dispatch('auth/AuthLogin', payload)
      .then((res) => {
        let data = res.data.result;
        localStorage.setItem('user_token', data.accessToken);
        localStorage.setItem('nama', data.nama);
        localStorage.setItem('nama_role', data.namaRole);
        localStorage.setItem('idLogin', data.idUser);
        localStorage.setItem('roleID', data.consumerType);
        localStorage.setItem('fotoProfil', data.fotoProfil);
        if(data.consumerType === 3){
          localStorage.setItem('jabatan_guru', data.jabatanGuru);
          localStorage.setItem('mengajar_bidang', data.mengajarBidang);
          localStorage.setItem('mengajar_kelas', data.mengajarKelas);
          localStorage.setItem('wali_kelas', data.waliKelas ? data.waliKelas : '');
        }else if(data.consumerType === 4){
          localStorage.setItem('kelas', data.kelas);
        }
        const socket = io(this.API_URL);
        socket.emit("dataonline");
        this.notifikasi("success", res.data.message, "2")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    goToProses() {
      const socket = io(this.API_URL);
      socket.emit("dataonline");
      this.dialogNotifikasi = false
      let roleID = localStorage.getItem('roleID')
      this.$router.push(roleID === '4' ? {name: "Profile"} : {name: "Dashboard"});
      window.location.reload();
    },
    lupaSandi() {
      this.$router.push({name: 'ForgotPass', params: { siteLogin: 'Admin' }});
    },
    onClickVisible(d) {
      this[d] = !this[d]
    },
    notifikasi(kode, text, proses){
      this.dialogNotifikasi = true
      this.notifikasiKode = kode
      this.notifikasiText = text
      this.notifikasiButton = proses
    },
  }
};
</script>

<style>
.v-input--density-comfortable .v-field--variant-solo .v-label.v-field-label--floating {
  top: 2px;
  font-size: 13px !important;
  font-weight: bold !important;
}
.bg-white {
  font-size: 14px !important;
}
</style>

<style scoped>
.v-btn {
  border-radius: 8px !important;
}
.tombolLupaPass {
  color: #272727;
  text-align: center;
  cursor: pointer;
}
.tombolLupaPass:hover {
  color: #272727;
  text-decoration: underline;
}
.pembungkus{text-align: center; color: #272727;}
.pembungkus h4{position: relative;  display: inline-block;}
.pembungkus h4:before{
  content: " ";
  position: absolute;
  border-bottom: 2px solid black;
  width: 100px;
  left: -130px;
  top: 50%;
}
.pembungkus h4:after{
  content: " ";
  position: absolute;
  border-bottom: 2px solid black;
  width: 100px;
  right: -130px;	
  top: 50%;
}
.tampilView {
  margin-top: 110px;
  width: 700px;
  padding: 20px;
}
@media screen and (min-width: 1920px) {
  .tampilView {
    margin-top: 240px;
    width: 800px;
  }
}
</style>