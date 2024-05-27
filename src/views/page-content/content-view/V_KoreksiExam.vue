<template>
  <div>
    <h1 class="subheading grey--text text-decoration-underline">Data Koreksi Exam</h1>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-container fluid v-if="mengajarOptions.length">
        <v-row>
          <v-col
            v-for="hasil in mengajarOptions"
            :key="hasil.label"
            cols="12"
            lg="4"
          >
            <v-card color="white" style="border: 2px solid #000;" @click="gotoDetail(hasil.link)">
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
      mengajar: store => store.setting.mengajarOptions,
    }),
    ...mapGetters({
      cmssettings: 'setting/cmssettings',
    }),
    mengajarOptions(){
      if(this.roleID === '3'){
				let mengajar_bidang = localStorage.getItem('mengajar_bidang').split(', ')
				let result = []
				mengajar_bidang.map(str => {
					let hasil = this.mengajar.filter(val => { return val.kode == str })
					result.push({ label: hasil.length ? hasil[0].label : '', link: hasil.length ? hasil[0].label.replace(' ', '-') : '' })
				})
				return result
			}else{
        let result = []
        this.mengajar.map(str => {
          result.push({ label: str.label, link: str.label.replace(' ', '-') })
        })
        return result
      }
		},
  },
  watch: {},
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.roleID = localStorage.getItem('roleID')
		this.getMengajar()
	},
	methods: {
		...mapActions({
      getMengajar: 'setting/getMengajar',
    }),
    gotoDetail(mapel) {
      this.$router.push({name: "DataDetailAkademis", params: { mapel: mapel, jenis: 'koreksi' }});
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