<template>
  <v-app>
    <Navbar
      :nama-sekolah="namaSekolah"
      :logo-sekolah="logoSekolah"
      :total-notif="roleID === '1' ? this.dataNotifikasi.allNotif : 0"
      :total-broadcast="this.dataNotifikasi.broadcast"
    />
    <v-main class="ma-4">
      <router-view style="margin-bottom: 20px;" />
      <div v-if="roleID === '3' || roleID === '4'" class="floating" @click="sendMessageAdmin()">
        <span class="tulisan"><v-icon size="small" icon="mdi mdi-chat" />&nbsp;Chat Administrator</span>
      </div>
    </v-main>
    <Footer :nama-sekolah="namaSekolah" />
    <v-dialog
      v-model="DialogPengaduan"
      scrollable
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Send Message Admin</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { DialogPengaduan = false; }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4" style="font-size: 13px;">
          Send Message Admin
        </v-card-text>
        <v-divider />
        <v-card-actions />
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Navbar from '../../components/Navbar.vue';
import Footer from '../../components/Footer.vue';
import notifikasi from "../../core/services/composeables/notifikasi";

export default {
  name: "App",
  components: { Navbar, Footer },
  data: () => ({
    API_URL: process.env.VUE_APP_BASE_URL_VIEW,
    dataNotifikasi: {
      allNotif: 0,
      record: 0,
      report: 0,
      broadcast: 0,
    },
    musik: '',
    DialogPengaduan: false,
	}),
  setup() {
    const roleID = localStorage.getItem('roleID')
    const { data: dataCountNotifikasi } = notifikasi.countingNotif()
    return { dataCountNotifikasi, roleID }
  },
	computed: {
    ...mapGetters({
      cmssettings: 'setting/cmssettings',
    }),
    namaSekolah(){
      return this.cmssettings ? this.cmssettings.namasekolah : null
    },
    logoSekolah(){
      return this.cmssettings ? `${this.API_URL}bahan/${this.cmssettings.logo}` : null
    },
  },
  watch: {
    dataCountNotifikasi: {
      deep: true,
      handler(value){
        this.dataNotifikasi = {
          allNotif: value.length ? value[0].count : 0,
          record: value.length ? value[1].count : 0,
          report: value.length ? value[2].count : 0,
          broadcast: value.length ? value[3].count : 0,
        }
        if((this.roleID === '1') && this.dataNotifikasi.allNotif > 0) {
          this.audio()
        }
        if((this.roleID === '2' || this.roleID === '3' || this.roleID === '4') && this.dataNotifikasi.broadcast > 0) {
          this.audio()
        }
      }
    }
  },
	mounted(){
    this.getCMSSettings()
	},
	methods: {
		...mapActions({
      getCMSSettings: 'setting/getCMSSettings',
    }),
    sendMessageAdmin(){
      this.DialogPengaduan = true
    },
    audio(){
      var sound = new Howl({
        src: `${this.API_URL}bahan/media-notifikasi/notif-2.wav`
      });
      sound.play();
    },
	}
};
</script>
<style scoped>
.floating {
  cursor: pointer;
  position: fixed;
  width: 160px;
  height: 40px;
  bottom: 45px;
  right: 10px;
  background-color: #25d366;
  border-radius: 30px;
  font-size: 11pt;
  box-shadow: 2px 3px 6px #000000;
  border: solid 2px #000000;
  z-index: 1000;
}
.tulisan{
  color: #fff;
  height: 40px;
  align-items: center;
  display: flex;
  justify-content: center;
  line-height: normal;
  position: relative;
  text-align: center;
  vertical-align: middle;
}
</style>

<style>
@import "~/node_modules/@vuepic/vue-datepicker/dist/main.css";
.dp__input {
	height: 50px !important;
}
.v-dialog > .v-overlay__content > .v-card > .v-card-text, .v-dialog > .v-overlay__content > form > .v-card > .v-card-text {
  padding: 15px !important;
}
.bg-white {
  font-size: 14px !important;
}
.v-input--density-comfortable .v-field--variant-solo .v-label.v-field-label--floating {
  top: 2px;
  font-size: 13px !important;
  font-weight: bold !important;
}
.v-stepper.v-sheet {
  background-color: white !important;
}
.tableHeader {
  font-weight: bold;
  color: white;
  font-size: 12px;
  border-bottom: 2px solid white;
}
.v-table .v-table__wrapper > table > tbody > tr:not(:last-child) > td, .v-table .v-table__wrapper > table > tbody > tr:not(:last-child) > th {
  border-bottom: thin solid white;
}
.v-table--density-comfortable > .v-table__wrapper > table > tbody > tr > td, .v-table--density-comfortable > .v-table__wrapper > table > tfoot > tr > td {
  height: 100%;
}
.v-data-table__tr--clickable {
  cursor: pointer;
  font-size: 13px;
}
.v-data-table__tr {
  font-size: 13px;
  height: 50px;
}
.sheetData {
  height: 50px;
  width: auto;
  justify-content: center;
  display: flex;
  align-items: center;
}
.flag {
  border-radius: 50%;
  border: 2px solid #ffffff;
  width: 15px;
  height: 15px;
}
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
.v-dialog--custom {
  width: 800px !important;
  height: 100% !important;
  max-height: 400px !important;
  font-size: 13px !important;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 5px;
  padding: 8px;
	border-radius: 5px;
}
.v-dialog--custom::-webkit-scrollbar {
  width: 16px;
}
.v-dialog--custom::-webkit-scrollbar-thumb {
  background-color: #272727;
  border: 5px solid #e1e1f0;
  border-radius: 10rem;
}
.v-dialog--custom::-webkit-scrollbar-track {
  position: absolute;
  right: -3rem;
  top: -50rem;
  background: transparent;
}

.ScrollFullscreen {
  height: 100%;
  font-size: 13px !important;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 5px;
  padding: 8px;
	border-radius: 5px;
}
.ScrollFullscreen::-webkit-scrollbar {
  width: 16px;
}
.ScrollFullscreen::-webkit-scrollbar-thumb {
  background-color: #272727;
  border: 5px solid #e1e1f0;
  border-radius: 10rem;
}
.ScrollFullscreen::-webkit-scrollbar-track {
  position: absolute;
  right: -3rem;
  top: -50rem;
  background: transparent;
}

.cross {
  position: relative;
  display: inline-block;
}
.cross::before, .cross::after {
  content: '';
  width: 100%;
  position: absolute;
  right: 0;
  top: 35%;
}
.cross::before {
  border-bottom: 3px solid red;
  -webkit-transform: skewY(-45deg);
  transform: skewY(-45deg);
}
.cross::after {
  border-bottom: 3px solid red;
  -webkit-transform: skewY(45deg);
  transform: skewY(45deg);
}

@media screen and (min-width: 1920px) {
  .v-dialog--custom {
    width: 1000px !important;
    height: 100% !important;
    max-height: 700px !important;
  }
}
</style>