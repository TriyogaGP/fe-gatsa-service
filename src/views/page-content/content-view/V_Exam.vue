<template>
  <div>
    <h2 class="subheading grey--text text-decoration-underline">Data Ujian </h2>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-container fluid v-if="jadwal?.length">
        <v-row>
          <v-col
            v-for="hasil in jadwal"
            :key="hasil.mapel"
            cols="12"
            lg="4"
          >
            <v-card color="white" style="border: 2px solid #000;">
              <v-sheet color="green" class="sheetData" elevation="2">
                <v-icon icon="mdi mdi-book-education" size="large" />
                <v-card-title class="text-white" style="font-weight: bold; font-size: 15px; margin-left: 5px;">Mata Pelajaran</v-card-title>
              </v-sheet>
              <div class="d-flex flex-column justify-center" style="height: 100px; padding: 5px;">
                <p style="font-size: 18px; font-weight: bold; text-align: center;">{{ hasil.mapel }}</p>
                <span><strong>Waktu Mulai :</strong> {{ convertDateTime(hasil.startDate) }}</span>
                <span><strong>Waktu Selesai :</strong> {{ convertDateTime(hasil.endDate) }}</span>
              </div>
              <v-divider :thickness="2" class="border-opacity-75" />
              <v-card-actions>
                <v-row no-gutters>
                  <v-col cols="12" class="pa-0 pr-2 text-end">
                    <Button
                      icon-append-button="mdi mdi-arrow-right-thick"
                      nama-button="Mulai Ujian"
                      :disabled-button="convertDateTime2(hasil.endDate) < convertDateTime2(now)"
                      @proses="gotoExam(hasil.idJadwalExam, hasil.kondisi)"
                    />
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <h2 v-else style="font-weight: bold;">Mata Pelajaran tidak ada</h2>
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
import { computed } from 'vue';
import { mapActions, mapState, mapGetters } from "vuex";
import { useMeta } from 'vue-meta'
import PopUpNotifikasi from "../../Layout/PopUpNotifikasi.vue";
import setting from "../../../core/services/composeables/setting";
export default {
  name: 'DataExam',
  components: {
    PopUpNotifikasi
  },
  data: () => ({

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Data Exam",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
    const { data: listexam } = setting.listexamGet(localStorage.getItem('kelas'))
    const jadwal = computed(() => listexam.value)
    const now = new Date()
    return { jadwal, now }
  },
  computed: {},
  watch: {},
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    // this.getListExam({ kelas: localStorage.getItem('kelas') })
  },
	methods: {
    gotoExam(kode, kondisi) {
      if(kondisi) return this.notifikasi("warning", "Anda sudah mengisi jawaban pada ujian di mata pelajaran ini!", "1")
      let routeData = this.$router.resolve({name: "Ujian", params: { kode: kode }});
      window.open(routeData.href, '_blank');
      // this.$router.push({name: "Ujian", params: { kode: kode }});
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