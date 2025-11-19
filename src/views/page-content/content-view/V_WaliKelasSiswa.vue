<template>
  <div>
    <h2 class="subheading grey--text text-decoration-underline">{{ roleID === '1' || roleID === '2' ? 'Data Kelas Siswa' : `Kelas ${kelas}` }}</h2>
    <v-card v-if="roleID === '1' || roleID === '2'" class="pa-1 rounded" variant="outlined" elevation="4">
      <Button 
        v-if="DataKelas.length"
        color-button="light-blue darken-3"
        icon-prepend-button="mdi mdi-pencil"
        nama-button="Update Peringkat"
        @proses="updatePeringkat(kelasJoin)"
      />
      <div
        v-for="data in DataKelas"
        :key="data.kategori"
      >
        <h3 class="subheading black--text ml-3"><u>Kelas ({{ data.kategori }})</u></h3>
        <v-container fluid v-if="DataKelas.length">
          <v-row>
            <v-col
              v-for="hasil in data.dataKelas"
              :key="hasil.kelas"
              cols="12"
              lg="4"
            >
              <v-card color="white" style="border: 2px solid #000;" @click="hasil.jumlah > 0 ? openDialog(hasil.kelas) : warningNotif()">
                <v-sheet color="green" class="sheetData" elevation="2">
                  <v-icon icon="mdi mdi-account-multiple" size="large" />
                  <v-card-title class="text-white" style="font-weight: bold; font-size: 15px; margin-left: 5px;">{{ hasil.jumlah }} Orang</v-card-title>
                </v-sheet>
                <v-card-actions>
                  <v-divider :thickness="2" />
                  <v-card-title class="text-black">Kelas {{ hasil.kelas }}</v-card-title>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-card>
    <Button 
      v-if="roleID === '3'"
      color-button="light-blue darken-3"
      icon-prepend-button="mdi mdi-pencil"
      nama-button="Update Peringkat"
      @proses="updatePeringkat(kelas)"
    />
    <v-card v-if="roleID === '3'" class="pa-1 rounded" variant="outlined" elevation="4">
      <h2 class="subheading black--text text-center"><div class="pembungkus"><span class="title">Rapot Siswa Siswi</span></div></h2>
      <v-row no-gutters>
        <v-col
          cols="12"
          md="4"
          class="pt-2 d-flex align-center font-weight-bold"
        >
          Nomor Induk
        </v-col>
        <v-col
          cols="12"
          md="8"
          class="pt-2 font-weight-bold"
        >
          : {{ dataSiswaSiswi.length ? dataSiswaSiswi[0].nomorInduk : '-' }}
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col
          cols="12"
          md="4"
          class="pt-2 d-flex align-center font-weight-bold"
        >
          Nama Siswa/i
        </v-col>
        <v-col
          cols="12"
          md="8"
          class="pt-2 font-weight-bold"
        >
          : {{ dataSiswaSiswi.length ? uppercaseLetterFirst2(dataSiswaSiswi[0].nama) : '-' }}
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col
          cols="12"
          md="4"
          class="pt-2 d-flex align-center font-weight-bold"
        >
          Wali Kelas
        </v-col>
        <v-col
          cols="12"
          md="8"
          class="pt-2 font-weight-bold"
        >
          : {{ dataSiswaSiswi.length ? uppercaseLetterFirst2(dataSiswaSiswi[0].waliKelas) : '-' }}
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col
          cols="12"
          md="6"
          class="pt-2 text-left font-weight-bold"
        >
          <!-- :disabled="pdfRaport === 0 ? true : false" -->
          <Button 
            :loading="isLoadingbtnPDF"
            color-button="light-blue darken-3"
            icon-prepend-button="mdi mdi-export"
            nama-button="Konversi -> PDF File"
            @proses="PDFOpen(dataSiswaSiswi.length ? dataSiswaSiswi[0].idUser : '-')"
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
          class="pt-2 text-right font-weight-bold"
        >
          <v-row>
            <v-col cols="12" lg="2" class="text-right font-weight-bold">
              <Button
                variant="plain"
                size-button="large"
                model-button="comfortable"
                color-button="#000000"
                icon-button="mdi mdi-arrow-left-circle-outline"
                :disabled-button="dataSiswaSiswi.length ? pageSummary.page != 1 ? false : true : true"
                @proses="() => { page = pageSummary.page - 1 }"
              />
            </v-col>  
            <v-col cols="12" lg="8" class="d-flex align-center justify-center font-weight-bold">  
              <span>{{ dataSiswaSiswi.length ? uppercaseLetterFirst2(dataSiswaSiswi[0].nama) : '-' }}</span>
            </v-col>
            <v-col cols="12" lg="2" class="text-left font-weight-bold">
              <Button
                variant="plain"
                size-button="large"
                model-button="comfortable"
                color-button="#000000"
                icon-button="mdi mdi-arrow-right-circle-outline"
                :disabled-button="dataSiswaSiswi.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
                @proses="() => { page = pageSummary.page + 1 }"
              />
            </v-col> 
          </v-row>
        </v-col>
      </v-row>
      <table dark class="mb-2">
        <thead>
          <tr>
            <th>MATA PELAJARAN</th>
            <th>KKM</th>
            <th>NILAI</th>
            <th>HURUF</th>
            <th>KETERANGAN</th>
            <th>KOMPETEN / TIDAK KOMPETEN</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v, i in dataNilai" :key="i">
            <td style="font-weight: bold;">{{ v.mapel }}</td>
            <td style="text-align: center">{{ v.kkm }}</td>
            <td style="text-align: center">{{ v.nilai }}</td>
            <td style="text-align: center">{{ v.hurufNilai }}</td>
            <td>{{ v.nilai === 0 ? 'Nol' : setPembilang.pembilang(v.nilai) }}</td>
            <td :style="v.nilai > v.kkm ? 'color: green' : 'color: red'">{{ v.nilai > v.kkm ? 'KOMPETEN' : 'TIDAK KOMPETEN' }}</td>
          </tr>
          <tr style="font-weight: bold;">
            <td colspan="2" class="text-right">RATA - RATA NILAI</td>
            <td style="text-align: center">{{ NilaiAkhir }}</td>
            <td style="text-align: center">{{ penilaian.nilaiHuruf }}</td>
            <td colspan="2">{{ NilaiAkhir === 0 ? 'Nol' : setPembilang.pembilang(NilaiAkhir) }}</td>
          </tr>
          <tr style="font-weight: bold;">
            <td colspan="2" class="text-right">PERINGKAT</td>
            <td colspan="4">{{ `${dataSiswaSiswi.length ? dataSiswaSiswi[0].peringkat : '-'} dari total ${dataSiswaSiswi.length ? dataSiswaSiswi[0].jumlahSiswa : '-'} Siswa/i` }} </td>
          </tr>
        </tbody>
      </table>
      <table dark class="mt-2">
        <thead>
          <tr>
            <th>KEHADIRAN</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="font-weight: bold;">Sakit</td>
            <td style="text-align: center">{{ dataSiswaSiswi.length ? dataSiswaSiswi[0].kehadiran.sakit : 0 }}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Ijin</td>
            <td style="text-align: center">{{ dataSiswaSiswi.length ? dataSiswaSiswi[0].kehadiran.ijin : 0 }}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Tanpa Keterangan</td>
            <td style="text-align: center">{{ dataSiswaSiswi.length ? dataSiswaSiswi[0].kehadiran.alfa : 0 }}</td>
          </tr>
        </tbody>
      </table>
    </v-card>
    <v-dialog
      v-model="dialogPDF"
      scrollable
			width="1000px"
			persistent
      transition="dialog-bottom-transition"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Data Raport PDF Siswa Siswi</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { dialogPDF = false; }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4" style="font-size: 13px;">
          <PdfCetakan
            :dialog-pdf="dialogPDF"
            :url-sk="urlSk"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="DialogDetail"
      scrollable
      persistent
      transition="dialog-bottom-transition"
      width="auto"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Detail Nilai (Kelas {{ kelas }})</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { DialogDetail = false; }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4 v-dialog--custom">
          <h2 class="subheading black--text text-center"><div class="pembungkus"><span class="title">Rapot Siswa Siswi</span></div></h2>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Nomor Induk
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-2 font-weight-bold"
            >
              : {{ dataSiswaSiswi.length ? dataSiswaSiswi[0].nomorInduk : '-' }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Nama Siswa/i
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-2 font-weight-bold"
            >
              : {{ dataSiswaSiswi.length ? uppercaseLetterFirst2(dataSiswaSiswi[0].nama) : '-' }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Wali Kelas
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-2 font-weight-bold"
            >
              : {{ dataSiswaSiswi.length ? uppercaseLetterFirst2(dataSiswaSiswi[0].waliKelas) : '-' }}
            </v-col>
          </v-row>
          <table dark class="mt-2 mb-2">
            <thead>
              <tr>
                <th>MATA PELAJARAN</th>
                <th>KKM</th>
                <th>NILAI</th>
                <th>HURUF</th>
                <th>KETERANGAN</th>
                <th>KOMPETEN / TIDAK KOMPETEN</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="v, i in dataNilai" :key="i">
                <td style="font-weight: bold;">{{ v.mapel }}</td>
                <td style="text-align: center">{{ v.kkm }}</td>
                <td style="text-align: center">{{ v.nilai }}</td>
                <td style="text-align: center">{{ v.hurufNilai }}</td>
                <td style="text-align: center">{{ v.nilai === 0 ? 'Nol' : setPembilang.pembilang(v.nilai) }}</td>
                <td :style="`text-align: center;${v.nilai > v.kkm ? 'color: green;' : 'color: red;'}`">{{ v.nilai > v.kkm ? 'KOMPETEN' : 'TIDAK KOMPETEN' }}</td>
              </tr>
              <tr style="font-weight: bold;">
                <td colspan="2" class="text-right">RATA - RATA NILAI</td>
                <td style="text-align: center">{{ NilaiAkhir }}</td>
                <td style="text-align: center">{{ penilaian.nilaiHuruf }}</td>
                <td colspan="2">{{ NilaiAkhir === 0 ? 'Nol' : setPembilang.pembilang(NilaiAkhir) }}</td>
              </tr>
              <tr style="font-weight: bold;">
                <td colspan="2" class="text-right">PERINGKAT</td>
                <td colspan="4">{{ `${dataSiswaSiswi.length ? dataSiswaSiswi[0].peringkat : '-'} dari total ${dataSiswaSiswi.length ? dataSiswaSiswi[0].jumlahSiswa : '-'} Siswa/i` }} </td>
              </tr>
            </tbody>
          </table>
          <table dark class="mt-2">
            <thead>
              <tr>
                <th>KEHADIRAN</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight: bold;">Sakit</td>
                <td style="text-align: center">{{ dataSiswaSiswi.length ? dataSiswaSiswi[0].kehadiran.sakit : 0 }}</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">Ijin</td>
                <td style="text-align: center">{{ dataSiswaSiswi.length ? dataSiswaSiswi[0].kehadiran.ijin : 0 }}</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">Tanpa Keterangan</td>
                <td style="text-align: center">{{ dataSiswaSiswi.length ? dataSiswaSiswi[0].kehadiran.alfa : 0 }}</td>
              </tr>
            </tbody>
          </table>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="7"
            >
              <Button 
                :loading="isLoadingbtnPDF"
                color-button="light-blue darken-3"
                icon-prepend-button="mdi mdi-export"
                nama-button="Konversi -> PDF File"
                @proses="PDFOpen(dataSiswaSiswi.length ? dataSiswaSiswi[0].idUser : '-')"
              />
            </v-col>
            <v-col
              cols="12"
              md="5"
              class="d-flex align-center text-right font-weight-bold"
            >
              <v-row>
                <v-col cols="12" md="2" class="text-right font-weight-bold">
                  <Button
                    variant="plain"
                    size-button="medium"
                    model-button="comfortable"
                    color-button="#000000"
                    icon-button="mdi mdi-arrow-left-circle-outline"
                    :disabled-button="dataSiswaSiswi.length ? pageSummary.page != 1 ? false : true : true"
                    @proses="() => { page = pageSummary.page - 1 }"
                  />
                </v-col>  
                <v-col cols="12" md="8" class="d-flex align-center justify-center font-weight-bold">  
                  <span style="font-size: 9pt;">{{ dataSiswaSiswi.length ? uppercaseLetterFirst2(dataSiswaSiswi[0].nama) : '-' }}</span>
                </v-col>
                <v-col cols="12" md="2" class="text-left font-weight-bold">
                  <Button
                    variant="plain"
                    size-button="medium"
                    model-button="comfortable"
                    color-button="#000000"
                    icon-button="mdi mdi-arrow-right-circle-outline"
                    :disabled-button="dataSiswaSiswi.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
                    @proses="() => { page = pageSummary.page + 1 }"
                  />
                </v-col> 
              </v-row>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay v-model="isLoadingProses" persistent class="align-center justify-center">
      <div style="width: 550px;">
        <v-progress-linear
          class="pa-3"
          indeterminate
          color="black darken-3"
        />
        <h4 style="color: #FFF; text-align: center; background-color: #272727;">Sedang proses update data, harap menunggu ...</h4>
      </div>
    </v-overlay>
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
import { mapActions, mapGetters } from "vuex";
import { useMeta } from 'vue-meta'
import PopUpNotifikasi from "../../Layout/PopUpNotifikasi.vue";
import PdfCetakan from '../../Layout/PdfCetakan.vue';

export default {
  name: 'DataKelasSiswa',
  components: {
    PopUpNotifikasi,
    PdfCetakan,
  },
  data: () => ({
    roleID: '',
    kelas: '',
    mapel: '',
    kelasJoin: '',
    DataKelas: [],
    DialogDetail: false,
    isLoadingProses: false,
    dataSiswaSiswi: [],
    dataNilai: [],
    NilaiAkhir: '',
    page: 1,
    pageSummary: {
			page: '',
			limit: '',
			total: '',
			totalPages: ''
		},
    penilaian: {
      rataRataNilai: 0,
      nilaiHuruf: '',
    },
    dialogPDF: false,
    isLoadingbtnPDF: false,
    urlSk: window.location.href,
    BASE_URL: '',

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Data Wali Kelas Siswa Siswi",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
  },
  computed: {
    ...mapGetters({
      kelasSiswa: 'kelas/kelasSiswa', 
      waliKelas: 'user/waliKelas',
      // cmssettings: 'setting/cmssettings',
    }),
    // pdfRaport(){
    //   return this.cmssettings ? this.cmssettings.pdfraport.value : null
    // },
  },
  watch: {
    waliKelas: {
      deep: true,
			handler(value) {
        this.dataSiswaSiswi = value.records
        this.dataNilai = this.dataSiswaSiswi.length ? this.dataSiswaSiswi[0].dataNilai : []
        this.NilaiAkhir = this.dataSiswaSiswi.length ? this.dataSiswaSiswi[0].hasilAkhir : 0
        let ratarata = 0
        this.dataNilai.map(str => {
          ratarata += str.nilai
        })
        this.penilaian.rataRataNilai = Math.ceil(ratarata / 16)
        this.penilaian.nilaiHuruf = this.penilaian.rataRataNilai <= 50 ? 'E' : this.penilaian.rataRataNilai <= 65 ? 'D' : this.penilaian.rataRataNilai <= 75 ? 'C' : this.penilaian.rataRataNilai <= 85 ? 'B' : 'A'
        this.pageSummary = {
					page: this.dataSiswaSiswi.length ? value.pageSummary.page : 0,
					limit: this.dataSiswaSiswi.length ? value.pageSummary.limit : 0,
					total: this.dataSiswaSiswi.length ? value.pageSummary.total : 0,
					totalPages: this.dataSiswaSiswi.length ? value.pageSummary.totalPages : 0
				}
      }
    },
    kelasSiswa: {
      deep: true,
			handler(value) {
        let result = [
          { kategori: '7'},
          { kategori: '8'},
          { kategori: '9'},
        ]

        this.kelasJoin = value.filter(str => str.jumlah > 0).map(str => str.kelas).join(', ')

        result.map(async val => {
          let hasil = []
          await value.map(str => {
            let split = str.kelas.split('-')
            if(split[0] === val.kategori){
              hasil.push({
                kelas: str.kelas,
                jumlah: str.jumlah,
              })
            }
            return hasil
          })
          this.DataKelas.push({
            kategori: val.kategori,
            dataKelas: hasil,
          })
        })
      }
    },
    page: {
			deep: true,
			handler(value) {
        if(value){
          this.getWaliKelas({page: value, kelas: this.kelas, roleID: this.roleID})
        }
			}
		},
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.BASEURL = process.env.VUE_APP_BASE_URL
    this.roleID = localStorage.getItem('roleID')
    if(this.roleID === '1' || this.roleID === '2') {
      this.getKelasSiswa({kelas: null, roleID: this.roleID})
    }else if(this.roleID === '3'){
      this.kelas = localStorage.getItem('wali_kelas')
      this.getWaliKelas({page: 1, kelas: this.kelas})
    }
  },
	methods: {
		...mapActions({
      getKelasSiswa: 'kelas/getKelasSiswa', 
      getWaliKelas: 'user/getWaliKelas',
      // getCMSSettings: 'setting/getCMSSettings',
    }),
    updatePeringkat(kelas) {
      this.isLoadingProses = true
      this.$store.dispatch('user/updatePeringkat', kelas)
      .then((res) => {
        this.isLoadingProses = false
        this.DataKelas = []
        if(this.roleID === '1' || this.roleID === '2') {
          this.getKelasSiswa({kelas: null, roleID: this.roleID})
        }else if(this.roleID === '3'){
          this.getWaliKelas({page: 1, kelas: this.kelas, roleID: this.roleID})
        }
        this.notifikasi("success", "Sukses update peringkat", "1")
			})
			.catch((err) => {
        this.isLoadingProses = false
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    PDFOpen(idUser) {
      this.dialogPDF = false
      this.isLoadingbtnPDF = true
      this.urlSk = ''
      fetch(`${this.BASEURL}user/pdfcreate-raport/${idUser}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`
        }
      })
      .then(response => response.arrayBuffer())
      .then(async response => {
        let blob = new Blob([response], { type: 'application/pdf' })
        this.urlSk = window.URL.createObjectURL(blob)
      })
      setTimeout(() => {
        this.isLoadingbtnPDF = false
        this.dialogPDF = true;
      }, 3000);
    },
    openDialog(kelas){
      // this.getCMSSettings()
      this.kelas = kelas
      this.getWaliKelas({page: 1, kelas: this.kelas, roleID: this.roleID})
      this.DialogDetail = true
    },
    warningNotif(){
      this.notifikasi("warning", "Tidak ada siswa/i dikelas ini", "1")
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
.judul {
  font-size: 10pt !important;
  font-weight: bold;
  letter-spacing: 0.1666666667em !important;
  line-height: 2rem;
  text-transform: uppercase;
  font-family: "Roboto", sans-serif !important;
}
table, td, th {
  border: 2px solid #000;
  padding: 5px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
</style>

<style>
.pembungkus{text-align: center; color: #272727;}
.pembungkus .title{position: relative;  display: inline-block;}
.pembungkus .title:before{
  content: " ";
  position: absolute;
  border-bottom: 3px solid black;
  width: 100px;
  left: -110px;
  top: 50%;
}
.pembungkus .title:after{
  content: " ";
  position: absolute;
  border-bottom: 3px solid black;
  width: 100px;
  right: -110px;	
  top: 50%;
}
</style>