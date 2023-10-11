<template>
  <div>
    <v-card class="ma-1" style="border: 1px solid #000; border-radius: 5px;">
      <v-row class="ma-1 tampilChat">
        <v-col cols="8" class="kotakleft">
          <div v-if="tampilPercakapan" class="wadahPercakapan">
            <div class="wadahUser">
              <v-img class="gambarProfile" :src="dataProfileChat.fotoProfil" />
              <span class="textProfile">{{ `${dataProfileChat.nama} ${dataProfileChat.kelas ? `(${dataProfileChat.kelas})` : ''}` }}</span>
            </div>
            <div class="customScrollLeft" ref="scroll">
              <div v-for="(item, i) in dataMessage" :key="i">
                <div class="message" :id="item.nama != uppercaseLetter(nama) ? `kotakchatleft` : `kotakchatright`">
                  <v-img class="gambarChat" :src="item.fotoProfil" />
                  <span class="textName">{{ item.nama }}</span>
                  <div class="mt-2">
                    <span style="white-space: pre-line" v-html="item.pesan" />
                    <div style="float: right; margin-top: 15px; font-size: 8pt; font-weight: bold;">{{ item.jam }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="customFree">
    				<v-img :src="logoSekolah" max-width="200" />
            <h2>{{ namaSekolah }}</h2>
          </div>
          <div class="panelChat">
            <TextArea
              v-model="pesan"
              label-ta="Ketik sesuatu ..."
              rows="1"
              id="scrollTextArea"
              :disabled-ta="!tampilPercakapan"
              @keyup.enter="pesan !== '\n' ? sendMessage() : pesan = ''"
            />
          </div>
        </v-col>
        <v-col cols="4" class="kotakright">
          <div class="mt-4 d-flex flex-column justify-space-between align-center">
            <div class="avatar">
              <v-img :src="fotoProfil" />
            </div>
          </div>
          <p class="white--text mt-1 text-center"><strong>{{ `${nama} (${namaRole})` }}</strong></p>
          <v-divider :thickness="2" class="border-opacity-100" />
          <v-tabs
            v-if="roleID === '4'"
            v-model="tab"
            grow
            bg-color="background-dialog-card"
            density="comfortable"
            class="mt-1"
          >
            <v-tab v-for="item in itemsTab" :key="item.code" :value="item.code">
              <v-icon left medium>{{ item.icon }}</v-icon>&nbsp;{{ `${item.text} (${item.code === '1' ? totalSiswa : totalGuru})` }}
            </v-tab>
          </v-tabs>
          <v-window v-if="roleID === '4'" v-model="tab">
            <v-window-item value="1">
              <div v-if="dataSiswa.length" class="customScrollRight">
                <div v-for="(item, i) in dataSiswa" :key="i">
                  <div v-if="item.nama !== uppercaseLetter(nama)" class="panelUser" @click="openPercakapan(item, '4')">
                    <v-img class="gambarChat2" :src="item.fotoProfil" />
                    <span class="textName2">{{ `${item.nama} (${item.kelas})` }}</span>
                    <!-- <div class="badgeChat">
                      <span class="backgroundBadge">{{ item.jmlBadge }}</span>
                    </div> -->
                  </div>
                </div>
              </div>
              <div v-else style="background-color: #272727 !important;">
                <span class="white--text text-center">Tidak ada data user</span>
              </div>
            </v-window-item>
            <v-window-item value="2">
              <div v-if="dataGuru.length" class="customScrollRight">
                <div v-for="(item, i) in dataGuru" :key="i">
                  <div v-if="item.nama !== uppercaseLetter(nama)" class="panelUser" @click="openPercakapan(item, '3')">
                    <v-img class="gambarChat2" :src="item.fotoProfil" />
                    <span class="textName2">{{ `${item.nama}` }}</span>
                    <!-- <div class="badgeChat">
                      <span class="backgroundBadge">{{ item.jmlBadge }}</span>
                    </div> -->
                  </div>
                </div>
              </div>
              <div v-else style="background-color: #272727 !important;">
                <span class="white--text text-center">Tidak ada data user</span>
              </div>
            </v-window-item>
          </v-window>

          <h4 v-if="roleID === '3'" class="white--text text-center ma-2">Data User (Online) {{ totalSiswa }} Orang</h4>
          <div v-if="dataSiswa.length && roleID === '3'" class="customScrollRight">
            <div v-for="(item, i) in dataSiswa" :key="i">
              <div class="panelUser" @click="openPercakapan(item, '3')">
                <v-img class="gambarChat2" :src="item.fotoProfil" />
                <span class="textName2">{{ `${item.nama} (${item.kelas})` }}</span>
                <!-- <div class="badgeChat">
                  <span class="backgroundBadge">{{ item.jmlBadge }}</span>
                </div> -->
              </div>
            </div>
          </div>
          <span v-else-if="!dataSiswa.length && roleID === '3'" class="white--text text-center">Tidak ada data user</span>
        </v-col>
      </v-row>
    </v-card>
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
        @cancel="dialogNotifikasi = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { useMeta } from 'vue-meta'
import PopUpNotifikasi from "./Layout/PopUpNotifikasi.vue";
import io from 'socket.io-client'

export default {
  name: 'Profile',
  components: { PopUpNotifikasi },
  data: () => ({
    API_URL: process.env.VUE_APP_BASE_URL_VIEW,
    idLogin: '',
    roleID: '',
    nama: '',
    namaRole: '',
    kelas: '',
    fotoProfil: '',
    tampilPercakapan: false,
    dataSiswa: [],
    totalSiswa: 0,
    dataGuru: [],
    totalGuru: 0,
    dataMessage: [],
    dataProfileChat: {
      idUser: '',
      nama: '',
      kelas: '',
      fotoProfil: '',
    },
    room: '',
    pesan: '',
    itemsTab: [
			{code: '1', text: 'Siswa', icon: 'person'},
			{code: '2', text: 'Guru', icon: 'person'},
		],
		tab: '',

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Percakapan",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
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
  watch:{
  },
  updated() {
		this.scrollToEnd()
	},
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.roleID = localStorage.getItem("roleID")
    this.idLogin = localStorage.getItem("idLogin")
    this.nama = localStorage.getItem("nama")
    this.namaRole = localStorage.getItem("nama_role")
    this.fotoProfil = localStorage.getItem("fotoProfil")
    this.kelas = localStorage.getItem("mengajar_kelas")
    this.UserOnline()
    this.getCMSSettings()
  },
  methods: {
    ...mapActions({
      getCMSSettings: 'setting/getCMSSettings',
    }),
    UserOnline(){
      const socket = io(this.API_URL);
      socket.emit("dataonline");
      socket.on("dataonline", (data) => {
        let datasiswa = [], dataguru = [];
        this.totalGuru = 0, this.totalSiswa = 0
        this.dataGuru = [], this.dataSiswa = []
        let dataOnline = data
        dataOnline.map(val => {
          if(val.consumerType === 3){
            dataguru.push(val)
            this.dataGuru.push(val)
          }else if(val.consumerType === 4){
            datasiswa.push(val)
            if(val.idUser !== this.idLogin){
              this.dataSiswa.push(val)
            }
          }
        })
        this.totalSiswa = this.dataSiswa.length
        this.totalGuru = this.dataGuru.length
      });
    },
    openPercakapan(item, role){
      this.tampilPercakapan = true
      this.dataProfileChat = {
        idUser: item.idUser,
        nama: item.nama,
        kelas: item.kelas,
        fotoProfil: item.fotoProfil,
      }
      const socket = io(this.API_URL);
      socket.emit("percakapan", localStorage.getItem('idLogin'), item.idUser, role);
      socket.on("percakapan", (data) => {
        this.dataMessage = data.dataPercakapan
        this.room = data.room
        this.scrollToEnd()
        this.UserOnline()
      });
    },
    sendMessage(){
      const socket = io(this.API_URL);
      socket.emit("send-message", {
        room: this.room,
        pengirim: localStorage.getItem('idLogin'),
        penerima: this.dataProfileChat.idUser,
        pesan: this.pesan
      });
      this.pesan = ''
      socket.on("percakapan", (data) => {
        this.dataMessage = data.dataPercakapan
        this.room = data.room
        this.scrollToEnd()
        this.UserOnline()
      });
    },
    scrollToEnd() {
      var content = this.$refs.scroll;
      if(!content) return
      content.scrollTop = content.scrollHeight;
    },
		notifikasi(kode, text, proses){
      this.dialogNotifikasi = true
      this.notifikasiKode = kode
      this.notifikasiText = text
      this.notifikasiButton = proses
    },
  },
}
</script>
<style>
#scrollTextArea{
  margin-bottom: 6px !important;
  margin-right: 5px !important;
	overflow: auto;
	overflow-x: hidden;
  height: 85px;
}
#scrollTextArea::-webkit-scrollbar-track{
	background-color: #FFF;
}
#scrollTextArea::-webkit-scrollbar{
	width: 6px;
	background-color: #FFF;
}
#scrollTextArea::-webkit-scrollbar-thumb{
	border-radius: 100px;
	background-color: #4CAF50;
}
</style>
<style scoped>
.tampilChat{
  background-color: #272727;
  height: 470px;
  margin-bottom: 100px;
}
.kotakleft {
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
  border-right: 1px solid #4CAF50;
  padding: 5px;
  height: 100%;
}
.kotakright {
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
  border-left: 1px solid #4CAF50;
  padding: 5px;
  height: 100%;
}
.kotak {
	border: 2px dashed #000;
	border-radius: 5px;
	text-align: justify;
	background: #FFF;
	color: #000;
	margin: 5px;
  padding: 5px;
  font-size: 9pt;
}
.v-tab {
	font-size: 8pt !important;
	font-weight: bold !important;
}
.avatar {
  border: solid 2px #FFF;
  border-radius: 50%;
  align-items: center;
  display: flex;
  justify-content: center;
  line-height: normal;
  position: relative;
  text-align: center;
  vertical-align: middle;
  overflow: hidden;
  width: 100px;
  height: 100px;
}
.panelChat {
  width: 100%;
  height: 110px;
  background: #fff;
  padding: 8px;
  margin-top: 10px;
  border: 2px solid #000;
	border-radius: 5px;
}
.customFree {
  width: 100%;
  height: 74%;
  background: #fff;
  color: #000;
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 8px;
  border: 2px solid #000;
	border-radius: 5px;
}
.wadahPercakapan {
  width: 100%;
  height: 74%;
  padding: 2px;
  background: #fff;
  border: 2px solid #000;
  border-radius: 5px;
}
.wadahUser {
  width: 100%;
  height: 50px;
  background: #272727;
  padding: 5px;
  border-bottom: 3px solid #4CAF50;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.customScrollLeft {
  width: 100%;
  height: 85%;
  padding: 8px;
  overflow-y: auto;
  overflow-x: hidden;
}
.customScrollLeft::-webkit-scrollbar {
  width: 16px;
}
.customScrollLeft::-webkit-scrollbar-thumb {
  background-color: #4CAF50;
  border: 5px solid #fff;
  border-radius: 10rem;
}
.customScrollLeft::-webkit-scrollbar-track {
  position: absolute;
  right: -3rem;
  top: -50rem;
  background: transparent;
}
.customScrollRight {
  width: 100%;
  height: 270px;
  background: #272727;
  overflow-y: auto;
  overflow-x: hidden;
}
.customScrollRight::-webkit-scrollbar {
  width: 16px;
}
.customScrollRight::-webkit-scrollbar-thumb {
  background-color: #4CAF50;
  border: 5px solid #272727;
  border-radius: 10rem;
}
.customScrollRight::-webkit-scrollbar-track {
  position: absolute;
  right: -3rem;
  top: -50rem;
}
.message {
	border-radius: 5px;
	border: 2px solid #000;
	color: rgb(0, 0, 0);
	margin-bottom: 4px;
	padding: 5px;
	text-align: left;
	font-size: 9pt;
	width: 55%;
	text-align: justify;
}
#kotakchatright {
	background: #f5a613;
	float: right;
}
#kotakchatleft {
	background: #13f553;
	float: left;
}
.textName {
	color: #000;
	font-weight: bold;
	font-size: 10pt;
  align-items: center;
  display: flex;
  line-height: normal;
  height: 30px;
}
.textName2 {
	color: #000;
	font-weight: bold;
	font-size: 8pt;
  align-items: center;
  display: flex;
  line-height: normal;
  height: 30px;
  float: left;
}
.badgeChat {
  align-items: center;
  display: flex;
  line-height: normal;
  float: right;
  width: 30px;
  height: 30px;
}
.backgroundBadge{
  color: #FFF;
  font-weight: bold;
  font-size: 8pt;
  align-items: center;
  display: flex;
  line-height: normal;
  justify-content: center;
  border: solid 2px #000000;
  margin-right: 3px;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  background-color: #4CAF50;
}
.textProfile {
	color: #FFF;
	font-weight: bold;
	font-size: 10pt;
  align-items: center;
  display: flex;
  line-height: normal;
  height: 35px;
}
.gambarChat {
  border: solid 2px #000000;
  margin-right: 3px;
  border-radius: 50%;
  align-items: center;
  display: flex;
  justify-content: center;
  line-height: normal;
  position: relative;
  text-align: center;
  vertical-align: middle;
  float:left;
  overflow: hidden;
  width: 30px;
  height: 30px;
}
.gambarChat2 {
  border: solid 2px #000000;
  margin-right: 3px;
  border-radius: 50%;
  align-items: center;
  display: flex;
  justify-content: center;
  line-height: normal;
  position: relative;
  text-align: center;
  vertical-align: middle;
  float:left;
  overflow: hidden;
  width: 30px;
  height: 30px;
}
.gambarProfile {
  border: solid 2px #ffffff;
  margin-right: 3px;
  border-radius: 50%;
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
.panelUser {
  width: 100%;
  height: 45px;
  background: #fff;
  padding: 5px;
  margin-top: 5px;
  border: 2px solid #000;
	border-radius: 5px;
  cursor: pointer;
}
@media screen and (min-width: 1920px) {
  .tampilChat{
    height: 770px;
  }
  .customScrollLeft {
    height: 92%;
  }
  .customScrollRight {
    height: 595px;
  }
  .customFree {
    height: 84%;
  }
  .wadahPercakapan {
    height: 84%;
  }
}
</style>