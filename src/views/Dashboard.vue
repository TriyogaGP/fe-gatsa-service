<template>
  <div>
    <h1 class="subheading grey--text">Dashboard</h1>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-row>
        <v-col cols="12" :lg="cols" v-if="roleID === '1'">
          <v-card color="white">
            <v-sheet color="green" class="sheetData" elevation="2">
              <v-icon icon="mdi mdi-account-group" size="large" />
              <v-card-subtitle class="text-black" style="font-weight: bold; font-size: 15px; margin-left: 5px;">Administrator</v-card-subtitle>
            </v-sheet>
            <v-card-text style="height: auto;" class="d-flex flex-column justify-center align-center">
              <v-row no-gutters>
                <v-col cols="12" lg="12" class="d-flex flex-column justify-center align-center">
                  <div class="box">{{ dataDashboard?.jmlAdmin }} Orang</div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider :thickness="2" class="border-opacity-75" />
            <v-card-actions>
              <v-row no-gutters>
                <v-col cols="12" class="pa-0 pr-2 text-end">
                  <Button
                    router to="/data-administrator"
                    icon-button="mdi mdi-arrow-right-thick"
                    nama-button="View"
                    letak-icon-button="end"
                  />
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" :lg="cols" v-if="roleID === '1' || roleID === '2'">
          <v-card color="white">
            <v-sheet color="green" class="sheetData" elevation="2">
              <v-icon icon="mdi mdi-account-group" size="large" />
              <v-card-subtitle class="text-black" style="font-weight: bold; font-size: 15px; margin-left: 5px;">Struktural</v-card-subtitle>
            </v-sheet>
            <v-card-text style="height: auto;" class="d-flex flex-column justify-center align-center">
              <v-row no-gutters>
                <v-col cols="12" lg="12" class="d-flex flex-column justify-center align-center">
                  <div class="box">{{ dataDashboard?.jmlStruktural }} Orang</div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider :thickness="2" class="border-opacity-75" />
            <v-card-actions>
              <v-row no-gutters>
                <v-col cols="12" class="pa-0 pr-2 text-end">
                  <Button
                    router to="/data-struktural"
                    icon-button="mdi mdi-arrow-right-thick"
                    nama-button="View"
                    letak-icon-button="end"
                  />
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" :lg="cols">
          <v-card color="white">
            <v-sheet color="green" class="sheetData" elevation="2">
              <v-icon icon="mdi mdi-account-group" size="large" />
              <v-card-subtitle class="text-black" style="font-weight: bold; font-size: 15px; margin-left: 5px;">Siswa Siswa</v-card-subtitle>
            </v-sheet>
            <v-card-text style="height: auto;" class="d-flex flex-column justify-center align-center">
              <v-row no-gutters>
                <v-col cols="12" lg="6" class="d-flex flex-column justify-center align-center">
                  <div class="box">
                    <p style="text-decoration: underline;">Laki-Laki</p>
                    {{ dataDashboard?.jmlSiswa?.laki_laki }} Orang
                  </div>
                </v-col>
                <v-col cols="12" lg="6" class="d-flex flex-column justify-center align-center">
                  <div class="box">
                    <p style="text-decoration: underline;">Perempuan</p>
                    {{ dataDashboard?.jmlSiswa?.perempuan }} Orang
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider :thickness="2" class="border-opacity-75" />
            <v-card-actions>
              <v-row no-gutters>
                <v-col cols="12" class="pa-0 pr-2 text-end">
                  <Button
                    router to="/data-siswa-siswi"
                    icon-button="mdi mdi-arrow-right-thick"
                    nama-button="View"
                    letak-icon-button="end"
                  />
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" :lg="cols">
          <v-card color="white">
            <v-sheet color="green" class="sheetData" elevation="2">
              <v-icon icon="mdi mdi-account-group" size="large" />
              <v-card-subtitle class="text-black" style="font-weight: bold; font-size: 15px; margin-left: 5px;">Siswa Siswa</v-card-subtitle>
            </v-sheet>
            <v-card-text style="height: auto;" class="d-flex flex-column justify-center align-center">
              <v-row no-gutters>
                <v-col cols="12" lg="6" class="d-flex flex-column justify-center align-center">
                  <div class="box">
                    <p style="text-decoration: underline;">Validation</p>
                    {{ dataDashboard?.jmlSiswa?.validation }} Orang
                  </div>
                </v-col>
                <v-col cols="12" lg="6" class="d-flex flex-column justify-center align-center">
                  <div class="box">
                    <p style="text-decoration: underline;">Not Validation</p>
                    {{ dataDashboard?.jmlSiswa?.not_validation }} Orang
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider :thickness="2" class="border-opacity-75" />
            <v-card-actions>
              <v-row no-gutters>
                <v-col cols="12" class="pa-0 pr-2 text-end">
                  <Button
                    router to="/data-siswa-siswi"
                    icon-button="mdi mdi-arrow-right-thick"
                    nama-button="View"
                    letak-icon-button="end"
                  />
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" :lg="cols">
          <v-card color="white">
            <v-sheet color="green" class="sheetData" elevation="2">
              <v-icon icon="mdi mdi-account-group" size="large" />
              <v-card-subtitle class="text-black" style="font-weight: bold; font-size: 15px; margin-left: 5px;">Siswa Siswa</v-card-subtitle>
            </v-sheet>
            <v-card-text style="height: auto;" class="d-flex flex-column justify-center align-center">
              <v-row no-gutters>
                <v-col cols="12" lg="6" class="d-flex flex-column justify-center align-center">
                  <div class="box">
                    <p style="text-decoration: underline;">Mutation</p>
                    {{ dataDashboard?.jmlSiswa?.mutation }} Orang
                  </div>
                </v-col>
                <v-col cols="12" lg="6" class="d-flex flex-column justify-center align-center">
                  <div class="box">
                    <p style="text-decoration: underline;">Not Mutation</p>
                    {{ dataDashboard?.jmlSiswa?.not_mutation }} Orang
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider :thickness="2" class="border-opacity-75" />
            <v-card-actions>
              <v-row no-gutters>
                <v-col cols="12" class="pa-0 pr-2 text-end">
                  <Button
                    router to="/data-siswa-siswi"
                    icon-button="mdi mdi-arrow-right-thick"
                    nama-button="View"
                    letak-icon-button="end"
                  />
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" :lg="cols" v-if="roleID === '1' || roleID === '2'">
          <v-card color="white">
            <v-sheet color="green" class="sheetData" elevation="2">
              <v-icon icon="mdi mdi-account-group" size="large" />
              <v-card-subtitle class="text-black" style="font-weight: bold; font-size: 15px; margin-left: 5px;">Kelas</v-card-subtitle>
            </v-sheet>
            <v-card-text style="height: auto;" class="d-flex flex-column justify-center align-center">
              <v-row no-gutters>
                <v-col cols="12" lg="4" class="d-flex flex-column justify-center align-center">
                  <div class="box">
                    <p style="text-decoration: underline;">Kelas 7</p>
                    {{ dataDashboard?.jmlKelas?.kelas_7 }} Orang
                  </div>
                </v-col>
                <v-col cols="12" lg="4" class="d-flex flex-column justify-center align-center">
                  <div class="box">
                    <p style="text-decoration: underline;">Kelas 8</p>
                    {{ dataDashboard?.jmlKelas?.kelas_8 }} Orang
                  </div>
                </v-col>
                <v-col cols="12" lg="4" class="d-flex flex-column justify-center align-center">
                  <div class="box">
                    <p style="text-decoration: underline;">Kelas 9</p>
                    {{ dataDashboard?.jmlKelas?.kelas_9 }} Orang
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider :thickness="2" class="border-opacity-75" />
            <v-card-actions>
              <v-row no-gutters>
                <v-col cols="12" class="pa-0 pr-2 text-end">
                  <Button
                    router to="/data-kelas"
                    icon-button="mdi mdi-arrow-right-thick"
                    nama-button="View"
                    letak-icon-button="end"
                  />
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" :lg="cols">
          <v-card color="white">
            <v-sheet color="green" class="sheetData" elevation="2">
              <v-icon icon="mdi mdi-account-group" size="large" />
              <v-card-subtitle class="text-black" style="font-weight: bold; font-size: 15px; margin-left: 5px;">Question Exam</v-card-subtitle>
            </v-sheet>
            <v-card-text style="height: auto;" class="d-flex flex-column justify-center align-center">
              <v-row no-gutters>
                <v-col cols="12" lg="3" class="d-flex flex-column justify-center align-center">
                  <div class="box">
                    <p style="text-decoration: underline;">Pilihan Ganda</p>
                    {{ dataDashboard?.jmlQuestionExam?.jenisPG }} Soal
                  </div>
                </v-col>
                <v-col cols="12" lg="3" class="d-flex flex-column justify-center align-center">
                  <div class="box">
                    <p style="text-decoration: underline;">Essay</p>
                    {{ dataDashboard?.jmlQuestionExam?.jenisEssay }} Soal
                  </div>
                </v-col>
                <v-col cols="12" lg="3" class="d-flex flex-column justify-center align-center">
                  <div class="box">
                    <p style="text-decoration: underline;">Menjodohkan</p>
                    {{ dataDashboard?.jmlQuestionExam?.jenisMenjodohkan }} Soal
                  </div>
                </v-col>
                <v-col cols="12" lg="3" class="d-flex flex-column justify-center align-center">
                  <div class="box">
                    <p style="text-decoration: underline;">Benar Salah</p>
                    {{ dataDashboard?.jmlQuestionExam?.jenisBS }} Soal
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider :thickness="2" class="border-opacity-75" />
            <v-card-actions>
              <v-row no-gutters>
                <v-col cols="12" class="pa-0 pr-2 text-end">
                  <Button
                    router to="/question-exam"
                    icon-button="mdi mdi-arrow-right-thick"
                    nama-button="View"
                    letak-icon-button="end"
                  />
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <v-dialog
      v-model="dialogNotifikasi"
      transition="dialog-bottom-transition"
      persistent
      width="500px"
    >
      <PopUpNotifikasiVue
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
import PopUpNotifikasiVue from "./Layout/PopUpNotifikasi.vue";
export default {
  name: 'Dashboard',
  components: { PopUpNotifikasiVue },
  data: () => ({
    totalNotif: 0,
    cols: 4,
    roleID: '',
    mengajarKelas: '',

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
      dataDashboard: state => state.user.dataDashboard,
    }),
  },
  watch: {
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.roleID = localStorage.getItem('roleID')
    this.mengajarKelas = localStorage.getItem('mengajar_kelas')
    this.getDashboard({kelas: this.mengajarKelas})
  },  
	methods: {
    ...mapActions({
      getDashboard: 'user/getDashboard'
    }),
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
.box{
	width: 90px;
	height: 50px;
  background-image:-moz-linear-gradient(top, #272727, #4CAF50);
	background-image: -webkit-gradient(linear, 100% 25%, 50% 100%, from(#272727), to(#4CAF50), color-stop(1,#4CAF50));
	border-radius: 10px;
	padding: 0px 2px;
  display: flex;
  flex-direction: column;
  justify-content: center;
	text-align: center;
	font-size: 9pt;
	font-weight: bold;
	color: white;
}
</style>