<template>
  <div>
    <h1 class="subheading grey--text text-decoration-underline">Data {{ jenis === 'mapel' ? 'Akademis' : 'Koreksi Exam' }} ({{ mapelText }})</h1>
    <div v-if="roleID === '1' || roleID === '2' || (roleID === '3' && jenis === 'koreksi')">
      <div class="text-right wadah">
        <span @click="gotolist()" class="link">Data {{ jenis === 'mapel' ? 'Akademis' : 'Koreksi Exam' }}</span>
        <v-icon size="small" class="iconstyle" icon="mdi mdi-menu-right" />
        <span>Data {{ jenis === 'mapel' ? 'Akademis' : 'Koreksi Exam' }} ({{ mapelText }})</span>
      </div>
    </div>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <div
        v-for="data in DataKelas"
        :key="data.kategori"
      >
        <h3 v-if="data.dataKelas.length" class="subheading black--text ml-3"><u>Kelas ({{ data.kategori }})</u></h3>
        <v-container fluid v-if="data.dataKelas.length">
          <v-row>
            <v-col
              v-for="hasil in data.dataKelas"
              :key="hasil.label"
              cols="12"
              lg="3"
            >
              <v-card color="white" style="border: 2px solid #000;" @click="hasil.jumlah > 0 ? gotoDetail(hasil.kelas, mapelText) : warningNotif()">
                <v-sheet color="green" class="sheetData" elevation="2">
                  <v-icon icon="mdi mdi-account-multiple" size="large" />
                  <v-card-title class="text-white" style="font-weight: bold; font-size: 15px; margin-left: 5px;">Kelas {{ hasil.kelas }}</v-card-title>
                </v-sheet>
                <v-card-actions>
                  <v-divider :thickness="2" />
                  <v-card-title class="text-black">{{ hasil.jumlah }} Orang</v-card-title>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
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
import { mapActions, mapGetters } from "vuex";
import { useMeta } from 'vue-meta'
import PopUpNotifikasi from "../../Layout/PopUpNotifikasi.vue";
export default {
  name: 'DataDetailAkademis',
  components: {
    PopUpNotifikasi
  },
  data: () => ({
    roleID: '',
    mapel: '',
    DataKelas: [],

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Data Detail Akademis",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
  },
  computed: {
    ...mapGetters({
      kelasSiswa: 'kelas/kelasSiswa',
    }),
    mapelText() {
      let pelajaran = this.$route.params.mapel
      this.mapel = pelajaran.replace('-', ' ')
      return this.mapel
    },
    jenis() {
      let jenis = this.$route.params.jenis
      return jenis
    }
  },
  watch: {
    kelasSiswa: {
      deep: true,
			handler(value) {
        let result = [
          { kategori: '7'},
          { kategori: '8'},
          { kategori: '9'},
        ]

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
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.roleID = localStorage.getItem('roleID')
    this.getKelasSiswa({kelas: null, roleID: this.roleID})
	},
	methods: {
		...mapActions({
      getKelasSiswa: 'kelas/getKelasSiswa',
    }),
    gotoDetail(kelas, mapel) {
      this.$router.push({name: "DataDetailKelasSiswa", params: { kondisi: this.jenis === 'mapel' ? 'penilaian' : 'koreksi', kelas: kelas }, query: { mapel: mapel }});
    },
    gotolist() {
      this.$router.push(this.jenis === 'mapel' ? {name: "DataAkademis"} : {name: "KoreksiExam"});
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
</style>