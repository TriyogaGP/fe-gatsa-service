<template>
  <div>
    <div class="nav-header">
			<div class="nav-logo">
				<v-img class="gambarLogo" :src="logoSekolah" />
				<span class="textNamaSekolah">{{ namaSekolah }}</span>
			</div>
			<v-divider vertical :thickness="2" color="white" />
			<v-spacer></v-spacer>
    </div>
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
            <v-col cols="12" class="py-0 px-0 mb-3">
              <v-row no-gutters>
                <v-col cols="12" sm="6" class="d-flex flex-row justify-center align-center">
                  <div class="np-captcha-container">
                    <div class="np-captcha" v-if="captchaArray && captchaArray.length">
                      <div
                        v-for="(c, i) in captchaArray"
                        :key="i"
                        :style="{
                          fontSize: getFontSize() + 'px',
                          fontWeight: 800,
                          transform: 'rotate(' + getRotationAngle() + 'deg)',
                        }"
                        class="np-captcha-character"
                      >
                        {{ c }}
                      </div>
                    </div>
                  </div>
                  <Button 
                    color-button="light-black darken-3"
                    nama-button="Generate"
                    @proses="createCaptcha()"
                  />
                </v-col>
                <v-col cols="12" sm="6" class="d-flex justify-space-between align-center">
                  <TextField
                    v-model="captcha"
                    icon-prepend-tf="mdi mdi-unicode"
                    label-tf="Captcha"
                    type="text"
                    :clearable-tf="true"
                    @input="() => { captcha = captcha.toUpperCase() }"
                    @keyup.enter="AutentificationLogin()"
                  />
                </v-col>
              </v-row>
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
    <v-dialog
      v-model="dialogNotifikasi"
      transition="dialog-bottom-transition"
      persistent
      width="500px"
    >
      <PopUpNotifikasi
        :notifikasi-kode="notifikasiKode"
        :notifikasi-text="notifikasiText"
        :notifikasi-button="notifikasiButton"
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
import PopUpNotifikasi from "./Layout/PopUpNotifikasi.vue";
import io from 'socket.io-client'
export default {
  name: 'Login',
  components: { PopUpNotifikasi },
  data: () => ({
    API_URL: process.env.VUE_APP_BASE_URL_VIEW,
    passType: '',
    username: '',
    katasandi: '',
    captchaLength: 5,
    captchaArray: [],
    captcha: '',

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Masuk",
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
    this.createCaptcha();
  },
  methods: {
    ...mapActions({
      fetchData: 'fetchData',
      getCMSSettings: 'setting/getCMSSettings',
    }),
    AutentificationLogin(){
      if(this.captcha === '') {
        this.createCaptcha();
        this.captcha = '';
        return this.notifikasi("warning", "Captcha tidak boleh kosong !", "1");
      }
      if(this.captchaArray.join('') !== this.captcha) {
        this.createCaptcha();
        this.captcha = '';
        return this.notifikasi("warning", "Captcha tidak cocok, coba lagi !", "1");
      }
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
          let jabatan = data.jabatanGuru.split(', ')
          if(jabatan.includes('1') || jabatan.includes('2') || jabatan.includes('3') || jabatan.includes('4')){
            localStorage.setItem('jabatan_guru', data.jabatanGuru);
            localStorage.setItem('mengajar_bidang', data.mengajarBidang);
            localStorage.setItem('mengajar_kelas', data.mengajarKelas);
            localStorage.setItem('wali_kelas', data.waliKelas ? data.waliKelas : '');
            const socket = io(this.API_URL);
            socket.emit("dataonline");
            return this.notifikasi("success", res.data.message, "2")
          }
          if(data.mengajarBidang === null || data.mengajarKelas === null){
            this.createCaptcha();
            this.captcha = '';
            this.username = '';
            this.katasandi = '';
            localStorage.clear();
            return this.notifikasi("warning", "Anda tidak bisa akses panel ini, karena anda bukan Guru Pengajar!", "1")
          }
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
        this.createCaptcha();
        this.captcha = '';
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    createCaptcha() {
      let tempCaptcha = "";
      for (let i = 0; i < this.captchaLength; i++) {
        tempCaptcha += this.getRandomCharacter();
      }
      this.captchaArray = tempCaptcha.split("");
      // this.captcha = tempCaptcha; //hanya untuk development
    },
    getRandomCharacter() {
      const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const randomNumber = Math.floor(Math.random() * symbols.length);
      return symbols[randomNumber];
    },
    getFontSize() {
      const fontVariations = [12, 16, 20, 24, 28];
      return fontVariations[Math.floor(Math.random() * fontVariations.length)];
    },
    getRotationAngle() {
      const rotationVariations = [5, 10, 20, 25, -5, -10, -20, -25];
      return rotationVariations[Math.floor(Math.random() * rotationVariations.length)];
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
      // this.$router.push({name: 'ForgotPass', params: { siteLogin: 'Admin' }});
      this.$router.push({name: 'ForgotPass'});
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
  font-size: 9pt !important;
  font-weight: bold !important;
}
.v-label.v-field-label {
  font-size: 9pt !important;
  font-weight: bold !important;
}
/* .v-toolbar__content > .v-toolbar-title {
	margin-inline-start: 16px;
	max-width: 250px !important;
} */
.gambarLogo {
  margin-right: 5px;
  align-items: center;
  display: flex;
  justify-content: center;
  line-height: normal;
  position: relative;
  text-align: center;
  vertical-align: middle;
  float:left;
  overflow: hidden;
  width: 35px;
  height: 35px;
}
.textNamaSekolah {
	color: #FFF;
	font-weight: bold;
	font-size: 10pt;
  align-items: center;
  display: flex;
  line-height: normal;
  margin-right: 10px;
  height: 35px;
}
.bg-white {
  font-size: 9pt !important;
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
  left: -120px;
  top: 50%;
}
.pembungkus h4:after{
  content: " ";
  position: absolute;
  border-bottom: 2px solid black;
  width: 100px;
  right: -120px;	
  top: 50%;
}
.tampilView {
  margin-top: 110px;
  width: 90%;
  max-width: 700px;
  padding: 20px;
}
@media screen and (min-width: 1920px) {
  .tampilView {
    margin-top: 240px;
    max-width: 800px;
    width: 90%;
  }
}
</style>

<style scoped>
.nav-header {
	position: fixed;
	padding: 0px 10px;
	width: 100%;
	height: 60px;
	background: #272727;
	z-index: 1;
	border-bottom: 3px solid #4CAF50;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.nav-logo{
	width: 450px;
	max-width: fit-content;
}
.np-captcha-container {
  background: #e1e1f0;
  width: 185px;
  height: 35px;
  margin: 0 auto;
  border: 2px dotted;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.np-captcha {
  font-size: 20px;
}
.np-button {
  padding: 6px 10px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 6px;
  font-size: 16px;
}
.np-captcha-character {
  display: inline-block;
  letter-spacing: 14px;
}
</style>