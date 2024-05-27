<template>
  <v-app>
    <Loading
      v-if="overlay"
      :overlay="overlay"
      :logo-sekolah="logoSekolah"  
      :nama-sekolah="namaSekolah"
    />
    <div v-else class="blurBack">
      <Navbar
        :nama-sekolah="namaSekolah"
        :logo-sekolah="logoSekolah"
        :total-notif="roleID === '1' ? this.dataNotifikasi.allNotif : 0"
        :total-broadcast="this.dataNotifikasi.broadcast"
      />
      <v-main class="ma-4">
        <routerView style="margin-bottom: 20px;"  />
        <div v-if="roleID === '3' || roleID === '4'" class="floating" @click="sendMessageAdmin()">
          <span class="tulisan"><v-icon size="small" icon="mdi mdi-chat" />&nbsp;Chat Administrator</span>
        </div>
      </v-main>
      <Footer :nama-sekolah="namaSekolah" />
    </div>
    <v-overlay v-model="isLoading" persistent class="align-center justify-center">
      <div style="width: 550px;">
        <v-progress-linear
          class="pa-3"
          indeterminate
          color="black darken-3"
        />
        <h4 style="color: #FFF; text-align: center; background-color: #272727;">Sedang proses, harap menunggu ...</h4>
      </div>
    </v-overlay>
    <v-dialog
      v-model="DialogPengaduan"
      scrollable
      persistent
      transition="dialog-bottom-transition"
      width="auto"
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
        <v-card-text class="pt-4 v-dialog--custom">
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Judul
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <TextArea
                v-model="inputData.judul"
                label-ta="Judul"
                rows="4"
                :clearable-ta="true"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Pesan
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <TextArea
                v-model="inputData.pesan"
                label-ta="Pesan"
                rows="4"
                :clearable-ta="true"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-row no-gutters>
            <v-col
              class="text-end"
              cols="12"
            >
              <Button
                color-button="black"
                nama-button="Share Broadcast"
                :disabled-button="kondisiTombol"
                @proses="postRecord()"
              />
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
// import Navbar from '../../components/Navbar.vue';
import Navbar from '../../components/NavbarSatu.vue';
import notifikasi from "../../core/services/composeables/notifikasi";
import Loading from "./Loading.vue";
import PopUpNotifikasi from "./PopUpNotifikasi.vue";

export default {
  name: "App",
  components: { Navbar, Loading, PopUpNotifikasi },
  data: () => ({
    API_URL: process.env.VUE_APP_BASE_URL_VIEW,
    dataNotifikasi: {
      allNotif: 0,
      record: 0,
      report: 0,
      broadcast: 0,
    },
    musik: '',
    inputData: {
      // idUser: ['2MMOu7xFdkbe4YFRjpp71fRkV26', '2MMP5z4O4HRLY67I2KkEBxfLR1K', '2Mcz9AarOl15kALKGIgvTThTRMJ'],
      idUser: '2MMOu7xFdkbe4YFRjpp71fRkV26',
      judul: '',
      pesan: '',
    },
    kondisiTombol: true,
    DialogPengaduan: false,
    overlay: false,
    isLoading: false,
    
    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
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
    },
    inputData: {
			deep: true,
			handler(value) {
				if(value.judul != '' && value.pesan != ''){
					this.kondisiTombol = false
				}else{
					this.kondisiTombol = true
				}
			}
		},
    overlay(val) {
      val && setTimeout(() => {
        this.overlay = false
      }, 1000)
    },
  },
  updated(){
    this.overlay = true
  },
	mounted(){
    this.getCMSSettings()
	},
	methods: {
		...mapActions({
      getCMSSettings: 'setting/getCMSSettings',
    }),
    async postRecord(){
      // this.isLoading = true
      let bodyData = {
        jenis: 'CREATE',
        idUser: this.inputData.idUser,
        type: 'Report',
        judul: this.inputData.judul,
        pesan: {
          message: this.inputData.pesan,
          payload: null,
        },
        tautan: null,
        dikirim: `dikirim oleh <strong>${localStorage.getItem('nama')} - sebagai ${localStorage.getItem('nama_role')} </strong>`,
        createBy: localStorage.getItem('idLogin'),
        params: null,
      }
      this.$store.dispatch('setting/postNotifikasi', bodyData)
      .then((res) => {
        this.DialogPengaduan = false
        // this.isLoading = false
        this.clearData()
        this.notifikasi("success", "Chat Administrator telah berhasil", "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
      // let kirim = await Promise.all(this.inputData.idUser.map(async idUser => {
      //   let status = []
      //   let bodyData = {
      //     jenis: 'CREATE',
      //     idUser: idUser,
      //     type: 'Report',
      //     judul: this.inputData.judul,
      //     pesan: {
      //       message: this.inputData.pesan,
      //       payload: null,
      //     },
      //     tautan: null,
      //     dikirim: `dikirim oleh <strong>${localStorage.getItem('nama')} - sebagai ${localStorage.getItem('nama_role')} </strong>`,
      //     createBy: localStorage.getItem('idLogin'),
      //     params: null,
      //   }
      //   try {
			// 		let response = await this.$store.dispatch('setting/postNotifikasi', bodyData)
      //     status.push(response.data.status)
			// 	} catch (err) {
      //     status.push(err.response.data.status)
			// 	}
      //   return status[0]
      // }))
			// if(kirim.filter(el => el == 200).length){
      //   this.notifikasi("success", "Chat Administrator telah berhasil", "1")
      // }else{
      //   this.notifikasi("error", 'Gagal proses data', "1")
      // }
      // this.DialogPengaduan = false
      // this.isLoading = false
      // this.clearData()
    },
    clearData(){
      this.inputData = {
        // idUser: ['2MMOu7xFdkbe4YFRjpp71fRkV26', '2MMP5z4O4HRLY67I2KkEBxfLR1K', '2Mcz9AarOl15kALKGIgvTThTRMJ'],
        idUser: ['2MMOu7xFdkbe4YFRjpp71fRkV26'],
        judul: '',
        pesan: '',
      }
    },
    sendMessageAdmin(){
      this.DialogPengaduan = true
    },
    audio(){
      var sound = new Howl({
        src: `${this.API_URL}bahan/media-notifikasi/notif-2.wav`
      });
      sound.play();
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
<style scoped>
.floating {
  cursor: pointer;
  position: fixed;
  width: 200px;
  height: 50px;
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
  height: 50px;
  padding: 20px;
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
@import "../../assets/style-loading.css";
@import "../../assets/prime-css.css";
@import "../../assets/mystyle.css";
/* @import "../../assets/style-menu.css"; */
@import "../../assets/style-menu-2.css";
</style>