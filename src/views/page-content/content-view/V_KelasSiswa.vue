<template>
  <div>
    <h1 class="subheading grey--text">Data Kelas Siswa {{ kelasText }}</h1>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-container fluid v-if="DataKelas.length">
        <v-row>
          <v-col
            v-for="hasil in DataKelas"
            :key="hasil.kelas"
            cols="12"
            lg="3"
          >
            <v-card color="white" style="border: 2px solid #000;" @click="hasil.jumlah > 0 ? gotoDetail(hasil.kelas) : warningNotif()">
              <v-sheet color="green" class="sheetData" elevation="2">
                <v-icon icon="mdi mdi-account-multiple" size="large" />
                <v-card-subtitle class="text-black" style="font-weight: bold; font-size: 15px; margin-left: 5px;">Kelas {{ hasil.kelas }}</v-card-subtitle>
              </v-sheet>
              <v-card-actions>
                <v-divider :thickness="2" class="border-opacity-75" />
                <v-card-title class="text-black">{{ hasil.jumlah }} Orang</v-card-title>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <h2 v-else style="font-weight: bold;">Data Kelas Siswa Tidak Tersedia</h2>
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
  name: 'DataKelasSiswa',
  components: {
    PopUpNotifikasi
  },
  data: () => ({
    kelas: '',

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Data Kelas Siswa",
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
    kelasText() {
      this.kelas = this.$route.params.kelas
      let roleID = localStorage.getItem('roleID')
      this.getKelasSiswa({kelas: this.kelas, roleID: roleID})
      return this.kelas
    },
    DataKelas(){
      return this.kelasSiswa
    }
  },
  watch: {
  },
  mounted() {
	},
	methods: {
		...mapActions({
      getKelasSiswa: 'kelas/getKelasSiswa',
    }),
    gotoDetail(kelas) {
      this.$router.push({name: "DataDetailKelasSiswa", params: { kondisi: 'view', kelas: kelas }});
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