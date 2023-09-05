<template>
  <v-card color="white">
    <v-card-text
      class="pa-5"
    >
      <v-row class="rowIcon mb-3">
        <v-col v-if="kode == 'success'" cols="12" class="d-flex flex-column justify-space-between align-center">
          <v-img class="ukuran" :src="`${API_URL}/bahan/media-notifikasi/Success.png`" />
        </v-col>
        <v-col v-else-if="kode == 'error'" cols="12" class="d-flex flex-column justify-space-between align-center">
          <v-img class="ukuran" :src="`${API_URL}/bahan/media-notifikasi/Failed.png`" />
        </v-col>
        <v-col v-else-if="kode == 'warning'" cols="12" class="d-flex flex-column justify-space-between align-center">
          <v-img class="ukuran" :src="`${API_URL}/bahan/media-notifikasi/Warning.png`" />
        </v-col>
        <v-col v-else-if="kode == 'question' || kode == 'questionProses'" cols="12" class="d-flex flex-column justify-space-between align-center">
          <v-img class="ukuran" :src="`${API_URL}/bahan/media-notifikasi/tanda-tanya.png`" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="textnotif">
          <h3><strong>{{ text }}</strong></h3>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="textnotif">
          <Button 
            v-if="kode == 'success' || kode == 'error' || kode == 'warning'"
            class="elevation-0 tombol-tutup"
            nama-button="Tutup"
            @proses="tombolProses(notifikasiButton)"
          />
          <Button 
            v-if="kode == 'question'"
            class="elevation-0 tombol-question mr-4 white--text"
            color-button="#9b1f15"
            nama-button="Batal"
            @proses="tombolProses(1)"
          />
          <Button 
            v-if="kode == 'question'"
            class="elevation-0 tombol-question white--text"
            color-button="#3c00ff"
            nama-button="Keluar"
            @proses="tombolProses(notifikasiButton)"
          />
          <Button 
            v-if="kode == 'questionProses'"
            class="elevation-0 tombol-tutup"
            nama-button="Tutup"
            @proses="tombolTutup()"
          />
          <Button 
            v-if="kode == 'questionProses'"
            class="elevation-0 tombol-question mr-4 ml-4 white--text"
            color-button="#9b1f15"
            nama-button="Tidak"
            @proses="tombolProses(1)"
          />
          <Button 
            v-if="kode == 'questionProses'"
            class="elevation-0 tombol-question white--text"
            color-button="#3c00ff"
            nama-button="Lanjut"
            @proses="tombolProses(notifikasiButton)"
          />
        </v-col>
      </v-row>
    </v-card-text>
    <!-- <div class="backgroundmerah" /> -->
    <div v-if="kode == 'success'" class="backgroundhijau" />
    <div v-else-if="kode == 'error'" class="backgroundmerah" />
    <div v-else-if="kode == 'warning'" class="backgroundkuning" />
    <div v-else-if="kode == 'question'" class="backgroundabu" />
  </v-card>
</template>

<script>
export default {
  props: {
    notifikasiKode: {
      type: String,
      default: ""
    },
    notifikasiText: {
      type: String,
      default: ""
    },
    notifikasiButton: {
      type: String,
      default: ""
    },
  },
  data() {
    return{
      API_URL: process.env.VUE_APP_BASE_URL_VIEW,
    }
  },
  computed: {
    kode() {
      return this.notifikasiKode;
    },
    text() {
      return this.notifikasiText;
    },
    tombol() {
      return this.notifikasiButton;
    },
  },
  methods:{
    tombolProses(pilih){
      if(pilih == '2'){
        this.$emit("proses");
      }else{
        this.$emit("cancel");
      }
    },
    tombolTutup(){
      this.$emit("tutup");
    }
  },
}
</script>

<style>
.textnotif {
  font-size: 15px !important;
  font-weight: 400 !important;
  color: #525252 !important;
  letter-spacing: normal!important;
  text-align: center !important;
}
.backgroundhijau{
  background-color: #4ba75e;
  height: 12px;
}
.backgroundmerah{
  background-color: #9b1f15;
  height: 12px;
}
.backgroundkuning{
  background-color: #f0ad4e;
  height: 12px;
}
.backgroundabu{
  background-color: #ff6200;
  height: 12px;
}
.tombol-tutup{
  height: 30px !important;
  min-width: 90px !important;
  border-bottom-style: revert !important;
}
.tombol-question{
  height: 30px !important;
  min-width: 90px !important;
  border-bottom-style: revert !important;
  color: #fff;
}
.ukuran{
  width: 150px;
}
.rowIcon{
  height: 150px !important;
  text-align: center !important;
}
</style>