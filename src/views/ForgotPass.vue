<template>
  <div id="inspire">
    <v-container class="fill-height" fluid>
      <nav>
        <v-app-bar color="light-black darken-3" dark app>
          <img :src="logoSekolah" width="40" />
          <div class="ml-2 mr-2">{{ namaSekolah }}</div>
          <v-divider vertical :thickness="2" />
          <v-spacer />
        </v-app-bar>
      </nav>
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
import { mapActions, mapGetters } from "vuex";
import { useMeta } from 'vue-meta'
import PopUpNotifikasiVue from "./Layout/PopUpNotifikasi.vue";
import Footer from '../components/Footer.vue';
export default {
  name: 'ForgotPass',
  components: {
    PopUpNotifikasiVue,
    Footer
  },
  data: () => ({
    API_URL: process.env.VUE_APP_BASE_URL_VIEW,
    step: 1,
    email: '',

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
      title: "Lupa Kata Sandi - MTsS. SIROJUL ATHFAL",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
  },
  mounted() {
    this.getCMSSettings()
  },
  methods: {
    ...mapActions({
      fetchData: 'fetchData',
      getCMSSettings: 'setting/getCMSSettings',
    }),
    LupaKataSandi() {
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
        this.notifikasi("error", err.response.data.message, "1")
      });
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