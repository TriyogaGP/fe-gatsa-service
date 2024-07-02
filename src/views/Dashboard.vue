<template>
  <div>
    <h1 class="subheading grey--text text-decoration-underline">Dashboard</h1>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-container fluid>
        <v-row>
          <v-col cols="12" :lg="cols" v-if="roleID === '1'">
            <v-card color="white" style="border: 2px solid #000;">
              <v-sheet color="green" class="sheetData" elevation="2">
                <v-icon icon="mdi mdi-account-group" size="large" />
                <v-card-title class="text-white" style="font-weight: bold; font-size: 15px; margin-left: 5px;">Administrator</v-card-title>
              </v-sheet>
              <v-card-text style="height: 160px;" class="d-flex flex-column justify-center align-center">
                <v-chip-group>
                  <v-chip class="box">{{ dataDashboard?.jmlAdmin }} Orang</v-chip>
                </v-chip-group>
              </v-card-text>
              <v-divider :thickness="2" class="border-opacity-75" />
              <v-card-actions>
                <v-row no-gutters>
                  <v-col cols="12" class="pa-0 pr-2 text-end">
                    <Button
                      router to="/data-administrator"
                      icon-append-button="mdi mdi-arrow-right-thick"
                      nama-button="View"
                    />
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" :lg="cols" v-if="roleID === '1' || roleID === '2' || this.kondisiJabatanTertentu">
            <v-card color="white" style="border: 2px solid #000;">
              <v-sheet color="green" class="sheetData" elevation="2">
                <v-icon icon="mdi mdi-account-group" size="large" />
                <v-card-title class="text-white" style="font-weight: bold; font-size: 15px; margin-left: 5px;">Struktural</v-card-title>
              </v-sheet>
              <v-card-text style="height: 160px;" class="d-flex flex-column justify-center align-center">
                <v-chip-group>
                  <v-chip class="box">{{ dataDashboard?.jmlStruktural }} Orang</v-chip>
                </v-chip-group>
              </v-card-text>
              <v-divider :thickness="2" class="border-opacity-75" />
              <v-card-actions>
                <v-row no-gutters>
                  <v-col cols="12" class="pa-0 pr-2 text-end">
                    <Button
                      router to="/data-struktural"
                      icon-append-button="mdi mdi-arrow-right-thick"
                      nama-button="View"
                    />
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" :lg="cols">
            <v-card color="white" style="border: 2px solid #000;">
              <v-sheet color="green" class="sheetData" elevation="2">
                <v-icon icon="mdi mdi-account-group" size="large" />
                <v-card-title class="text-white" style="font-weight: bold; font-size: 15px; margin-left: 5px;">Siswa Siswa</v-card-title>
              </v-sheet>
              <v-card-text style="height: 160px;" class="d-flex flex-column justify-center align-center">
                <v-chip-group>
                  <v-chip class="box">
                    Laki-Laki<br>
                    {{ dataDashboard?.jmlSiswa?.laki_laki }} Orang
                  </v-chip>
                  <v-chip class="box">
                    Perempuan<br>
                    {{ dataDashboard?.jmlSiswa?.perempuan }} Orang
                  </v-chip>
                </v-chip-group>
              </v-card-text>
              <v-divider :thickness="2" class="border-opacity-75" />
              <v-card-actions>
                <v-row no-gutters>
                  <v-col cols="12" class="pa-0 pr-2 text-end">
                    <Button
                      router to="/data-siswa-siswi"
                      icon-append-button="mdi mdi-arrow-right-thick"
                      nama-button="View"
                    />
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" :lg="cols">
            <v-card color="white" style="border: 2px solid #000;">
              <v-sheet color="green" class="sheetData" elevation="2">
                <v-icon icon="mdi mdi-account-group" size="large" />
                <v-card-title class="text-white" style="font-weight: bold; font-size: 15px; margin-left: 5px;">Siswa Siswa</v-card-title>
              </v-sheet>
              <v-card-text style="height: 160px;" class="d-flex flex-column justify-center align-center">
                <v-chip-group>
                  <v-chip class="box">
                    Validation<br>
                    {{ dataDashboard?.jmlSiswa?.validation }} Orang
                  </v-chip>
                  <v-chip class="box">
                    Not Validation<br>
                    {{ dataDashboard?.jmlSiswa?.not_validation }} Orang
                  </v-chip>
                </v-chip-group>
              </v-card-text>
              <v-divider :thickness="2" class="border-opacity-75" />
              <v-card-actions>
                <v-row no-gutters>
                  <v-col cols="12" class="pa-0 pr-2 text-end">
                    <Button
                      router to="/data-siswa-siswi"
                      icon-append-button="mdi mdi-arrow-right-thick"
                      nama-button="View"
                    />
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" :lg="cols">
            <v-card color="white" style="border: 2px solid #000;">
              <v-sheet color="green" class="sheetData" elevation="2">
                <v-icon icon="mdi mdi-account-group" size="large" />
                <v-card-title class="text-white" style="font-weight: bold; font-size: 15px; margin-left: 5px;">Siswa Siswa</v-card-title>
              </v-sheet>
              <v-card-text style="height: 160px;" class="d-flex flex-column justify-center align-center">
                <v-chip-group>
                  <v-chip class="box">
                    Mutation<br>
                    {{ dataDashboard?.jmlSiswa?.mutation }} Orang
                  </v-chip>
                  <v-chip class="box">
                    Not Mutation<br>
                    {{ dataDashboard?.jmlSiswa?.not_mutation }} Orang
                  </v-chip>
                </v-chip-group>
              </v-card-text>
              <v-divider :thickness="2" class="border-opacity-75" />
              <v-card-actions>
                <v-row no-gutters>
                  <v-col cols="12" class="pa-0 pr-2 text-end">
                    <Button
                      router to="/data-siswa-siswi"
                      icon-append-button="mdi mdi-arrow-right-thick"
                      nama-button="View"
                    />
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" :lg="cols" v-if="roleID === '1' || roleID === '2'">
            <v-card color="white" style="border: 2px solid #000;">
              <v-sheet color="green" class="sheetData" elevation="2">
                <v-icon icon="mdi mdi-view-list" size="large" />
                <v-card-title class="text-white" style="font-weight: bold; font-size: 15px; margin-left: 5px;">Kelas</v-card-title>
              </v-sheet>
              <v-card-text style="height: 160px;" class="d-flex flex-column justify-center align-center">
                <v-chip-group>
                  <v-chip class="box">
                    Kelas 7<br>
                    {{ dataDashboard?.jmlKelas?.kelas_7 }} Kelas
                  </v-chip>
                  <v-chip class="box">
                    Kelas 8<br>
                    {{ dataDashboard?.jmlKelas?.kelas_8 }} Kelas
                  </v-chip>
                  <v-chip class="box">
                    Kelas 9<br>
                    {{ dataDashboard?.jmlKelas?.kelas_9 }} Kelas
                  </v-chip>
                </v-chip-group>
              </v-card-text>
              <v-divider :thickness="2" class="border-opacity-75" />
              <v-card-actions>
                <v-row no-gutters>
                  <v-col cols="12" class="pa-0 pr-2 text-end">
                    <Button
                      router to="/settings"
                      icon-append-button="mdi mdi-arrow-right-thick"
                      nama-button="View"
                    />
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" :lg="cols">
            <v-card color="white" style="border: 2px solid #000;">
              <v-sheet color="green" class="sheetData" elevation="2">
                <v-icon icon="mdi mdi-table-question" size="large" />
                <v-card-title class="text-white" style="font-weight: bold; font-size: 15px; margin-left: 5px;">Question Exam</v-card-title>
              </v-sheet>
              <v-card-text style="height: 160px;" class="d-flex flex-column justify-center align-center">
                <v-chip-group>
                  <v-chip class="box">
                    Pilihan Ganda<br>
                    {{ dataDashboard?.jmlQuestionExam?.jenisPG }} Soal
                  </v-chip>
                  <v-chip class="box">
                    Menjodohkan<br>
                    {{ dataDashboard?.jmlQuestionExam?.jenisMenjodohkan }} Soal
                  </v-chip>
                  <v-chip class="box">
                    Benar Salah<br>
                    {{ dataDashboard?.jmlQuestionExam?.jenisBS }} Soal
                  </v-chip>
                  <v-chip class="box">
                    Essay<br>
                    {{ dataDashboard?.jmlQuestionExam?.jenisEssay }} Soal
                  </v-chip>
                </v-chip-group>
              </v-card-text>
              <v-divider :thickness="2" class="border-opacity-75" />
              <v-card-actions>
                <v-row no-gutters>
                  <v-col cols="12" class="pa-0 pr-2 text-end">
                    <Button
                      router to="/question-exam"
                      icon-append-button="mdi mdi-arrow-right-thick"
                      nama-button="View"
                    />
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <!-- <div 
      @mouseover="hoverNih($event)"
      @mouseleave="hoverNih($event)"
    >
      haha
    </div> -->
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

export default {
  name: 'Dashboard',
  components: { PopUpNotifikasi },
  data: () => ({
    totalNotif: 0,
    cols: 4,
    roleID: '',
    mengajarKelas: '',
    kondisiJabatanTertentu: false,
    
    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Dashboard",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })

  },
  computed: {
    ...mapState({
      jabatan: store => store.setting.jabatanOptions,
      dataDashboard: state => state.user.dataDashboard,
    }),
    jabatanOptions(){
      if(this.roleID === '3'){
        let jabatan_guru = localStorage.getItem('jabatan_guru').split(', ')
        let result = []
        jabatan_guru.map(str => {
          let hasil = this.jabatan.filter(val => { return val.kode == str })
          result.push(hasil.length ? hasil[0].label : '')
        })
        return result
      }
    },
  },
  watch: {
    jabatanOptions: {
			deep: true,
			handler(value) {
				if(this.roleID === '3'){
          if(value.includes('Kepala Sekolah') || value.includes('WaKaBid. Kesiswaan')){
            this.kondisiJabatanTertentu = true
            this.getDashboard({kelas: null})
          }
        }
			}
		},
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.roleID = localStorage.getItem('roleID')
    this.mengajarKelas = localStorage.getItem('mengajar_kelas')
    if(this.kondisiJabatanTertentu === false && this.mengajarKelas !== 'null') {
      this.getDashboard({kelas: this.mengajarKelas})
    }
    this.overlay = true
  },  
	methods: {
    ...mapActions({
      getDashboard: 'user/getDashboard',
      uploadFiles: 'upload/uploadFiles',
    }),
    // hoverNih(e){
    //   if(e.type === 'mouseover'){
    //     this.hover = true
    //   }else if(e.type === 'mouseleave'){
    //     this.hover = false
    //   }
    //   console.log(e.type, this.hover);
    // },
    notifikasi(kode, text, proses){
      this.dialogNotifikasi = true
      this.notifikasiKode = kode
      this.notifikasiText = text
      this.notifikasiButton = proses
    },
  }
}
</script>
<style scoped>
.v-chip-group {
  display: flex;
  justify-content: center;
}
.v-chip {
  cursor: default;
}
.box{
	width: 120px;
	height: 50px;
  background-image:-moz-linear-gradient(top, #272727, #4CAF50);
	background-image: -webkit-gradient(linear, 100% 25%, 50% 100%, from(#272727), to(#4CAF50), color-stop(1,#4CAF50));
	border-radius: 10px;
	padding: 0px 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
	text-align: center;
	font-size: 8pt;
	font-weight: bold;
	color: white;
}
</style>