<template>
  <div>
    <h1 class="subheading grey--text text-decoration-underline">Data Akademis</h1>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-row no-gutters>
        <v-col cols="12" md="8" />
        <v-col cols="12" md="4" class="pr-2">
          <TextField
            v-model="searchData"
            icon-prepend-tf="mdi mdi-magnify"
            label-tf="Pencarian..."
            :clearable-tf="true"
            @click:clear="() => {
              searchData = ''
              pencarianData(searchData)
            }"
            @keyup.enter="() => {
              pencarianData(searchData)
            }"
          />
        </v-col>
      </v-row>
      <v-container fluid v-if="mengajarOptions.length">
        <v-row>
          <v-col
            v-for="hasil in mengajarOptions"
            :key="hasil.label"
            cols="12"
            lg="4"
          >
            <v-card color="white" style="border: 2px solid #000;" @click="roleID === '1' || roleID === '2' ? gotoDetail(hasil.link) : openDetail(hasil.kode, hasil.link)">
              <v-sheet color="green" class="sheetData" elevation="2">
                <v-icon icon="mdi mdi-book-education" size="large" />
                <v-card-title class="text-white" style="font-weight: bold; font-size: 15px; margin-left: 5px;">Mata Pelajaran</v-card-title>
              </v-sheet>
              <v-card-actions>
                <v-divider :thickness="2" class="border-opacity-75" />
                <v-card-title class="text-black">{{ hasil.label }}</v-card-title>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <h2 v-else style="font-weight: bold;">Data Akademis Tidak Tersedia</h2>
    </v-card>
    <v-dialog
      v-model="DialogSiswaSiswi"
      scrollable
      persistent
      transition="dialog-bottom-transition"
      width="auto"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Data Detail Nilai</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { dataSiswaSiswi = ''; DialogSiswaSiswi = false; }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4 v-dialog--custom">
          <h2 class="subheading black--text"><u>>>Data Siswa Siswi</u></h2>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Nama Guru
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-2 font-weight-bold"
            >
              : {{ dataSiswaSiswi ? uppercaseLetterFirst2(dataSiswaSiswi.dataPenilaian.namaGuru) : '' }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Mata Pelajaran
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-2 font-weight-bold"
            >
              : {{ mapel }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Semester
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-2 font-weight-bold"
            >
              : {{ dataSiswaSiswi ? uppercaseLetterFirst2(dataSiswaSiswi.semester) : '' }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Tahun Pelajaran
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-2 font-weight-bold"
            >
              : {{ tahunPelajaran }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              KKM
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-2 font-weight-bold"
            >
              : {{ dataSiswaSiswi ? dataSiswaSiswi.dataPenilaian.kkm : '' }}
            </v-col>
          </v-row>
          <table dark class="mb-2">
            <thead>
              <tr>
                <th>#</th>
                <th>NILAI</th>
                <th>KETERANGAN</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight: bold;">Tugas 1</td>
                <td class="text-center">{{ dataSiswaSiswi ? dataSiswaSiswi.dataNilai.tugas1 : '' }}</td>
                <td class="text-center">{{ dataSiswaSiswi ? dataSiswaSiswi.dataNilai.tugas1 === 0 ? 'Nol' : setPembilang.pembilang(dataSiswaSiswi.dataNilai.tugas1) : '' }}</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">Tugas 2</td>
                <td class="text-center">{{ dataSiswaSiswi ? dataSiswaSiswi.dataNilai.tugas2 : '' }}</td>
                <td class="text-center">{{ dataSiswaSiswi ? dataSiswaSiswi.dataNilai.tugas2 === 0 ? 'Nol' : setPembilang.pembilang(dataSiswaSiswi.dataNilai.tugas2) : '' }}</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">Tugas 3</td>
                <td class="text-center">{{ dataSiswaSiswi ? dataSiswaSiswi.dataNilai.tugas3 : '' }}</td>
                <td class="text-center">{{ dataSiswaSiswi ? dataSiswaSiswi.dataNilai.tugas3 === 0 ? 'Nol' : setPembilang.pembilang(dataSiswaSiswi.dataNilai.tugas3) : '' }}</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">Tugas 4</td>
                <td class="text-center">{{ dataSiswaSiswi ? dataSiswaSiswi.dataNilai.tugas4 : '' }}</td>
                <td class="text-center">{{ dataSiswaSiswi ? dataSiswaSiswi.dataNilai.tugas4 === 0 ? 'Nol' : setPembilang.pembilang(dataSiswaSiswi.dataNilai.tugas4) : '' }}</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">Tugas 5</td>
                <td class="text-center">{{ dataSiswaSiswi ? dataSiswaSiswi.dataNilai.tugas5 : '' }}</td>
                <td class="text-center">{{ dataSiswaSiswi ? dataSiswaSiswi.dataNilai.tugas5 === 0 ? 'Nol' : setPembilang.pembilang(dataSiswaSiswi.dataNilai.tugas5) : '' }}</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">Tugas 6</td>
                <td class="text-center">{{ dataSiswaSiswi ? dataSiswaSiswi.dataNilai.tugas6 : '' }}</td>
                <td class="text-center">{{ dataSiswaSiswi ? dataSiswaSiswi.dataNilai.tugas6 === 0 ? 'Nol' : setPembilang.pembilang(dataSiswaSiswi.dataNilai.tugas6) : '' }}</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">Tugas 7</td>
                <td class="text-center">{{ dataSiswaSiswi ? dataSiswaSiswi.dataNilai.tugas7 : '' }}</td>
                <td class="text-center">{{ dataSiswaSiswi ? dataSiswaSiswi.dataNilai.tugas7 === 0 ? 'Nol' : setPembilang.pembilang(dataSiswaSiswi.dataNilai.tugas7) : '' }}</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">Tugas 8</td>
                <td class="text-center">{{ dataSiswaSiswi ? dataSiswaSiswi.dataNilai.tugas8 : '' }}</td>
                <td class="text-center">{{ dataSiswaSiswi ? dataSiswaSiswi.dataNilai.tugas8 === 0 ? 'Nol' : setPembilang.pembilang(dataSiswaSiswi.dataNilai.tugas8) : '' }}</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">Tugas 9</td>
                <td class="text-center">{{ dataSiswaSiswi ? dataSiswaSiswi.dataNilai.tugas9 : '' }}</td>
                <td class="text-center">{{ dataSiswaSiswi ? dataSiswaSiswi.dataNilai.tugas9 === 0 ? 'Nol' : setPembilang.pembilang(dataSiswaSiswi.dataNilai.tugas9) : '' }}</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">Tugas 10</td>
                <td class="text-center">{{ dataSiswaSiswi ? dataSiswaSiswi.dataNilai.tugas10 : '' }}</td>
                <td class="text-center">{{ dataSiswaSiswi ? dataSiswaSiswi.dataNilai.tugas10 === 0 ? 'Nol' : setPembilang.pembilang(dataSiswaSiswi.dataNilai.tugas10) : '' }}</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">Ujian Tengah Semester</td>
                <td class="text-center">{{ dataSiswaSiswi ? dataSiswaSiswi.dataNilai.uts : '' }}</td>
                <td class="text-center">{{ dataSiswaSiswi ? dataSiswaSiswi.dataNilai.uts === 0 ? 'Nol' : setPembilang.pembilang(dataSiswaSiswi.dataNilai.uts) : '' }}</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">Ujian Akhir Semester</td>
                <td class="text-center">{{ dataSiswaSiswi ? dataSiswaSiswi.dataNilai.uas : '' }}</td>
                <td class="text-center">{{ dataSiswaSiswi ? dataSiswaSiswi.dataNilai.uas === 0 ? 'Nol' : setPembilang.pembilang(dataSiswaSiswi.dataNilai.uas) : '' }}</td>
              </tr>
              <tr>
                <td class="text-right" style="font-weight: bold;">Nilai Akhir</td>
                <td class="text-center">{{ dataSiswaSiswi ? dataSiswaSiswi.rataRataNilai : '' }}</td>
                <td class="text-center">{{ dataSiswaSiswi ? dataSiswaSiswi.rataRataNilai === 0 ? 'Nol' : setPembilang.pembilang(dataSiswaSiswi.rataRataNilai) : '' }}</td>
              </tr>
            </tbody>
          </table>
          <table dark class="mb-2">
            <thead>
              <tr>
                <th>KEHADIRAN</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight: bold;">Sakit</td>
                <td class="text-center">{{ dataSiswaSiswi ? dataSiswaSiswi.dataKehadiran.sakit : '' }}</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">Ijin</td>
                <td class="text-center">{{ dataSiswaSiswi ? dataSiswaSiswi.dataKehadiran.ijin : '' }}</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">Tanpa Keterangan</td>
                <td class="text-center">{{ dataSiswaSiswi ? dataSiswaSiswi.dataKehadiran.alfa : '' }}</td>
              </tr>
            </tbody>
          </table>
        </v-card-text>
        <v-divider />
        <v-card-actions />
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
        @cancel="dialogNotifikasi = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import { useMeta } from 'vue-meta'
import PopUpNotifikasi from "../../Layout/PopUpNotifikasi.vue";
export default {
  name: 'DataAkademis',
  components: {
    PopUpNotifikasi
  },
  data: () => ({
    roleID: '',
    idLogin: '',
    kelas: '',
    mapel: '',
    DialogSiswaSiswi: false,
    dataSiswaSiswi: '',
    searchData: '',
    mengajarOptions: [],

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Data Akademis",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
  },
  computed: {
    ...mapState({
      // mengajar: store => store.setting.mengajarOptions,
    }),
    ...mapGetters({
      cmssettings: 'setting/cmssettings',
      siswasiswiBy: 'user/siswasiswiBy',
      nilai: 'user/nilai',
    }),
    tahunPelajaran(){
      return this.cmssettings ? this.cmssettings.tahunpelajaran : null
    },
    DataNilai(){
      return this.nilai ? this.nilai : null
    },
    // mengajarOptions(){
    //   let result = []
    //   this.mengajar.map(str => {
    //     result.push({ label: str.label, link: str.label.replace(' ', '-') })
    //   })
		// 	return result
		// },
  },
  watch: {
    siswasiswiBy: {
      deep: true,
      handler(value) {
        let jumlahTugas = this.DataNilai.jumlahTugas
        let nilai = this.DataNilai.dataSiswaSiswi.filter(val => val.idUser === value.idUser)[0].nilai
        let semester = this.DataNilai.dataSiswaSiswi.filter(val => val.idUser === value.idUser)[0].semester
        let kehadiran = this.DataNilai.dataSiswaSiswi.filter(val => val.idUser === value.idUser)[0].kehadiran
        let nilaiTugasSementara = Object.values(nilai)
        // let totalNilaiTugas = Number(nilai.tugas1) + Number(nilai.tugas2) + Number(nilai.tugas3) + Number(nilai.tugas4) + Number(nilai.tugas5) + Number(nilai.tugas6) + Number(nilai.tugas7) + Number(nilai.tugas8) + Number(nilai.tugas9) + Number(nilai.tugas10)
        let totalNilaiTugas = 0
        for(let i=0; i<Number(jumlahTugas); i++){
          totalNilaiTugas = totalNilaiTugas + nilaiTugasSementara[i]
        }
        let rataRataTugas = totalNilaiTugas === 0 ? 0 : totalNilaiTugas / Number(jumlahTugas)
        let rataRataNilai = (Number(rataRataTugas) + Number(nilai.uts) + Number(nilai.uas)) / 3
        this.dataSiswaSiswi = {
          ...value,
          dataNilai: {
            tugas1: Number(jumlahTugas) > 0 ? nilai.tugas1 : 0,
            tugas2: Number(jumlahTugas) > 1 ? nilai.tugas2 : 0,
            tugas3: Number(jumlahTugas) > 2 ? nilai.tugas3 : 0,
            tugas4: Number(jumlahTugas) > 3 ? nilai.tugas4 : 0,
            tugas5: Number(jumlahTugas) > 4 ? nilai.tugas5 : 0,
            tugas6: Number(jumlahTugas) > 5 ? nilai.tugas6 : 0,
            tugas7: Number(jumlahTugas) > 6 ? nilai.tugas7 : 0,
            tugas8: Number(jumlahTugas) > 7 ? nilai.tugas8 : 0,
            tugas9: Number(jumlahTugas) > 8 ? nilai.tugas9 : 0,
            tugas10: Number(jumlahTugas) > 9 ? nilai.tugas10 : 0,
            uts: nilai.uts,
            uas: nilai.uas,
          },
          semester: semester,
          dataKehadiran: kehadiran,
          totalNilaiTugas: rataRataTugas != 0 ? Math.ceil(rataRataTugas) : 0,
          rataRataNilai: rataRataNilai != 0 ? Math.ceil(rataRataNilai) : 0,
          hurufNilai: rataRataNilai <= 50 ? 'E' : rataRataNilai <= 65 ? 'D' : rataRataNilai <= 75 ? 'C' : rataRataNilai <= 85 ? 'B' : 'A',
       }
      }
    }
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.roleID = localStorage.getItem('roleID')
    this.idLogin = localStorage.getItem('idLogin')
    this.kelas = localStorage.getItem('kelas')
    this.pencarianData(this.searchData)
	},
	methods: {
		...mapActions({
      getSiswaSiswibyUID: 'user/getSiswaSiswibyUID',
      getNilai: 'user/getNilai',
      getCMSSettings: 'setting/getCMSSettings',
      getMengajar: 'setting/getMengajar',
    }),
    openDetail(kode, mapel) {
      this.mapel = mapel.replace('-', ' ')
      this.getCMSSettings()
      this.getNilai({idUser: this.idLogin, kelas: this.kelas, mapel: kode})
      this.getSiswaSiswibyUID({uid: this.idLogin, mapel: kode})
      this.DialogSiswaSiswi = true
    },
    pencarianData(searchData){
      this.mengajarOptions = []
      this.getMengajar().then((res) => {
				let result = res.data.result;
        if(searchData === ''){
          result.map(str => {
            this.mengajarOptions.push({ label: str.label, link: str.label.replace(' ', '-'), kode: str.kode })
          })
        }else{
          result.map(str => {
            let search = new RegExp(searchData , 'i');
            if(search.test(str.label)) return this.mengajarOptions.push({ label: str.label, link: str.label.replace(' ', '-'), kode: str.kode })
          })
        }
			})
    },
    gotoDetail(mapel) {
      this.$router.push({name: "DataDetailAkademis", params: { mapel: mapel, jenis: 'mapel' }});
    },
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
table, td, th {
  border: 2px solid #000;
  padding: 5px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
.judul {
  font-size: 10pt !important;
  font-weight: bold;
  letter-spacing: 0.1666666667em !important;
  line-height: 2rem;
  text-transform: uppercase;
  font-family: "Roboto", sans-serif !important;
}
</style>