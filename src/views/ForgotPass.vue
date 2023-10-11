<template>
  <div>
    <v-app-bar
      color="light-black darken-3"
      style="position: fixed;"
      density="comfortable"
    >
      <template v-slot:prepend>
        <v-img class="gambarLogo" :src="logoSekolah" />
        <span class="textNamaSekolah">{{ namaSekolah }}</span>
      </template>
      <v-divider vertical :thickness="2" />
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-row no-gutters>
      <v-col cols="12" class="d-flex flex-column justify-space-between align-center">
        <v-card class="elevation-12 tampilView" color="white">
          <h1 class="text-center display-1 light-black--text" style="color: #272727;"><strong>{{ namaSekolah }}</strong></h1>
          <h2 class="text-center display-1 light-black--text ma-3"><div class="pembungkus"><h4>Lupa Kata Sandi</h4></div></h2>
          <v-form>
            <v-col cols="12" class="py-0 px-0 mb-3">
              <TextField
                v-model="email"
                icon-prepend-tf="mdi mdi-email"
                label-tf="user@mail.com"
                type="text"
                :clearable-tf="true"
                @keyup.enter="LupaKataSandi()"
              />
            </v-col>
            <v-col cols="12" class="py-0 px-0 mb-3">
              <v-row no-gutters>
                <v-col cols="6" class="d-flex flex-row justify-center align-center">
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
                <v-col cols="6" class="d-flex justify-space-between align-center">
                  <TextField
                    v-model="captcha"
                    icon-prepend-tf="mdi mdi-unicode"
                    label-tf="Captcha"
                    type="text"
                    :clearable-tf="true"
                    @input="() => { captcha = captcha.toUpperCase() }"
                    @keyup.enter="LupaKataSandi()"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-form>
          <h3 class="tulisan">sudah punya akun ?<div class="tombolMasuk" @click="login()"> >>Masuk</div></h3>
          <div class="text-center mt-3 mb-10">
            <Button 
              color-button="light-black darken-3"
              nama-button="Kirim"
              @proses="LupaKataSandi()"
            />
          </div>
        </v-card>
      </v-col>
    </v-row>
    <Footer :nama-sekolah="namaSekolah"/>
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
import { mapActions, mapGetters } from "vuex";
import { useMeta } from 'vue-meta'
import PopUpNotifikasi from "./Layout/PopUpNotifikasi.vue";
import Footer from '../components/Footer.vue';
export default {
  name: 'ForgotPass',
  components: {
    PopUpNotifikasi,
    Footer
  },
  data: () => ({
    API_URL: process.env.VUE_APP_BASE_URL_VIEW,
    email: '',
    captchaLength: 5,
    captchaArray: [],
    captcha: '',

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  computed: {
    ...mapGetters({
      cmssettings: 'setting/cmssettings',
    }),
    namaSekolah(){
      return this.cmssettings ? this.cmssettings.namasekolah : null
    },
    logoSekolah(){
      return this.cmssettings ? `${this.API_URL}bahan/${this.cmssettings.logo}` : null
    }
  },
  setup() {
    useMeta({
      title: "Lupa Kata Sandi",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
  },
  mounted() {
    this.getCMSSettings()
    this.createCaptcha();
  },
  methods: {
    ...mapActions({
      fetchData: 'fetchData',
      getCMSSettings: 'setting/getCMSSettings',
    }),
    LupaKataSandi() {
      if(this.captcha === '') return this.notifikasi("warning", "Captcha tidak boleh kosong !", "1");
      if(this.captchaArray.join('') !== this.captcha) {
        this.createCaptcha();
        this.captcha = '';
        return this.notifikasi("warning", "Captcha tidak cocok, coba lagi !", "1");
      }
      let bodyData = {
        email: this.email,
      }
      let payload = {
        method: "post",
        url: `auth/forgotpass`,
        body: bodyData,
        authToken: localStorage.getItem('user_token')
      };
      this.fetchData(payload)
      .then((res) => {
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
      this.dialogNotifikasi = false
      this.$router.push({name: 'LogIn'});
    },
    login() {
      this.$router.push({name: 'LogIn'});
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
.tulisan {
  color: #272727;
  text-align: center;
  cursor: pointer;
}
.tombolMasuk {
  color: #272727;
  text-align: center;
  cursor: pointer;
}
.tombolMasuk:hover {
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
  padding: 20px !important;
}
@media screen and (min-width: 1920px) {
  .tampilView {
    margin-top: 240px;
    width: 800px;
  }
}
</style>

<style scoped>
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