<template>
  <div>
    <h1 class="subheading grey--text">Data Notifikasi</h1>
    <v-card class="mt-2 mb-2 pa-1 rounded" variant="outlined" elevation="4">
      <div class="wadah-kategori">
        <Button
          v-for="item in kategori"
          :key="item.kode"
          class="kotak-type"
          :nama-button="`${item.text} (${item.count})`"
          @proses="() => { kodeKategori = item.kode; }"
        />
      </div>
      <v-divider :thickness="2" class="border-opacity-100" />
      <div v-if="dataNotifikasi.length" class="wadah-notif">
        <v-row>
          <v-col cols="12" md="12" class="text-right">
            <Button
              color-button="light-blue darken-3"
              nama-button="Tandai Telah Dibaca"
              @proses="tandai()"
            />
          </v-col>
        </v-row>
        <div v-for="notif in dataNotifikasi" :key="notif.idNotifikasi" class="kotak-notif" @click="openDialog(notif)">
          <v-row no-gutters>
            <v-col
              cols="12"
              md="6"
            >
              <!-- <span class="box fourcorners" style="background-color: rgba(8, 42, 128, 0.822);">{{notif.type}}</span> -->
              <span class="box fourcorners" :style="notif.type === 'Record' ? `background-color: rgba(4, 76, 4, 0.822);` : `background-color: rgba(8, 42, 128, 0.822);`">{{notif.type}}</span>
            </v-col>
            <v-col
              cols="12"
              md="6"
              class="kondisiNotif"
            >
              <p>{{notif.isRead ? 'sudah dibaca' : 'belum dibaca' }} <v-icon :color="notif.isRead == true ? 'green' : 'red'" :icon="notif.isRead == true ? 'mdi mdi-check' : 'mdi mdi-close'" /></p>
            </v-col>
          </v-row>
          <p class="judulNotif">{{notif.judul}}</p>
          <!-- <p class="pesanNotif">{{ (notif.pesan || '').length > 60 ? `${notif.pesan.substring(0, 60)}...` : notif.pesan }}</p> -->
          <!-- <p class="pesanNotif">{{ notif.pesan }}</p> -->
          <span class="pesanNotif" v-html="notif.pesan.message" /><br>
          <span v-if="notif.pesan.payload" class="pesanNotif">payload: </span>
          <span v-if="notif.pesan.payload" class="pesanNotif" v-html="notif.pesan.payload" />
          <p class="tanggalNotif" v-html="notif.dikirim" />
          <p class="tanggalNotif">{{notif.createdAt}}</p>
        </div>
      </div>
      <div v-if="dataNotifikasi.length" class="wadah-kategori">
        <Button
          class="kotak-type"
          nama-button="Tampilkan lebih banyak lagi"
          :disabled-button="!pageSummary.hasNext"
          @proses="() => {
            getNotifikasi({kategori: kodeKategori, page: pageSummary.page + 1, limit: limit})
            page = pageSummary.page + 1
          }"
        />
      </div>
      <div v-else class="wadah-notif2">
        <span>Tidak ada notifikasi</span>
      </div>
    </v-card>
    <v-dialog
      v-model="DialogNotifikasi"
      scrollable
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Detail Notifikasi</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { DialogNotifikasi = false; }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4" style="font-size: 13px;">
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Type
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ `: ${detailData.type}` }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Judul
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ `: ${detailData.judul}` }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Pesan
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <!-- {{ `: ${detailData.pesan}` }} -->
              : <span class="pesanNotif" v-html="detailData.pesan.message" /><br>
              <span v-if="detailData.pesan.payload" class="pesanNotif">payload: </span>
              <span v-if="detailData.pesan.payload" class="pesanNotif" v-html="detailData.pesan.payload" />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Params
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ `: ${detailData.params ? detailData.params : '-'}` }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Dikirim Oleh
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              : <span v-html="detailData.dikirim" />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Waktu
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ `: ${detailData.createdAt}` }}
            </v-col>
          </v-row>
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
import { mapActions, mapGetters } from "vuex";
import { useMeta } from 'vue-meta'
import PopUpNotifikasiVue from "./Layout/PopUpNotifikasi.vue";
import notifikasi from "../core/services/composeables/notifikasi";

export default {
  name: 'Notifikasi',
  components: {
    PopUpNotifikasiVue
  },
  data: () => ({
    API_URL: '',
    page: 1,
    limit: 10,
    DialogNotifikasi: false,
    dataNotifikasi: [],
    kategori: [],
    kodeKategori: '1',
    pageSummary: {
      limit: '',
      page: '',
      hasNext: false,
      lastID: '',
      totalPage: ''
    },
    detailData: {
      idNotifikasi: '',
      idUser: '',
      type: '',
      judul: '',
      pesan: '',
      params: null,
      dikirim: '',
      isRead: false,
      createdAt: ''
    },

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Notifikasi",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
    const { refetch: dataCountNotifikasi } = notifikasi.countingNotif({
      enabled: false,
    })
    return { dataCountNotifikasi }
  },
  computed: {
    ...mapGetters({
      kategoriAll: 'setting/kategoriAll',
      notifikasiAll: 'setting/notifikasiAll',
    }),
  },
  watch: {
    notifikasiAll: {
      deep: true,
      handler(value){
        let data = value.records
        data.map(val => {
          this.dataNotifikasi.push(val)
        })
        this.pageSummary = {
          limit: value.pageSummary.limit,
          page: value.pageSummary.page,
          hasNext: value.pageSummary.hasNext,
          lastID: value.pageSummary.lastID,
          totalPage: value.pageSummary.totalPage
        }
      }
    },
    kategoriAll: {
      deep: true,
      handler(value){
        this.kategori = value
      }
    },
    kodeKategori: {
      deep: true,
      handler(value, oldValue){
        if(value !== oldValue) {
          this.dataNotifikasi = []
          this.getNotifikasi({kategori: this.kodeKategori, page: 1, limit: this.limit})
        }
      }
    },
  },
  mounted() {
    this.getKategoriNotifikasi()
    this.getNotifikasi({kategori: this.kodeKategori, page: this.page, limit: this.limit})
  },
	methods: {
		...mapActions({
      getKategoriNotifikasi: 'setting/getKategoriNotifikasi',
      getNotifikasi: 'setting/getNotifikasi',
      getCountNotifikasi: 'setting/getCountNotifikasi',
    }),
    openDialog(item){
      this.detailData = {
        idNotifikasi: item.idNotifikasi,
        idUser: item.idUser,
        type: item.type,
        judul: item.judul,
        pesan: item.pesan,
        params: item.params,
        dikirim: item.dikirim,
        isRead: item.isRead,
        createdAt: item.createdAt
      }
      if(this.detailData.isRead) this.DialogNotifikasi = true
      let bodyData = {
        jenis: 'ISREAD',
        idNotifikasi: item.idNotifikasi,
      }
      this.$store.dispatch('setting/postNotifikasi', bodyData)
      .then((res) => {
        this.DialogNotifikasi = true
        this.dataNotifikasi = []
        this.getKategoriNotifikasi()
        this.dataCountNotifikasi()
        this.getNotifikasi({kategori: this.kodeKategori, page: this.page, limit: this.limit})
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    tandai(){
      let bodyData = {
        jenis: 'ISREADALL',
        kategori: this.kodeKategori,
      }
      this.$store.dispatch('setting/postNotifikasi', bodyData)
      .then((res) => {
        this.dataNotifikasi = []
        this.getKategoriNotifikasi()
        this.dataCountNotifikasi()
        this.getNotifikasi({kategori: this.kodeKategori, page: this.page, limit: this.limit})
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
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
.kondisiNotif {
	margin-bottom: 1px !important;
	font-size: 10px;
	text-align: right;
	font-style: italic;
}
.judulNotif {
	margin: 5px 1px 0px !important;
	font-size: 14px;
	font-weight: bold;
}
.pesanNotif {
	margin-bottom: 1px !important;
	font-size: 12px;
	font-weight: 500;
	text-align: justify;
}
.tanggalNotif {
	margin-bottom: 1px !important;
	font-size: 10px;
	font-weight: 500;
	text-align: right;
	font-style: italic;
}
.wadah-kategori {
  height: 100%;
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
}
.v-btn:not(.v-btn--round).v-size--default {
  height: 28px;
  min-width: 64px;
  padding: 0 12px;
}
.wadah-notif {
  width: 100%;
  padding: 0px 100px;
  margin-top: 5px;
}
.wadah-notif2 {
  width: 100%;
  padding: 0px 100px;
  margin-top: 5px;
  text-align: center;
  font-weight: bold;
}
.kotak-notif {
  height: 100%;
  width: 100%;
  border: 2px solid #0285ff;
  border-radius: 10px;
  background-color: #000000;
  color: #ffffff;
  padding: 10px;
  margin: 5px 0px;
  cursor: pointer;
}
.kotak-type {
  margin: 0px 5px;
  border: 2px solid #000;
  border-radius: 50px !important;
  color: black;
  background-color: white;
  font-size: 8pt;
  align-items: center;
  display: flex;
  justify-content: center;
  line-height: normal;
  position: relative;
  text-align: center;
}
.v-text-field.v-input--dense {
  font-size: 13px !important;
}
.fourcorners{
	-moz-border-radius: 5px;
	-webkit-border-radius: 5px;
	-khtml-border-radius: 5px; 
	border-radius: 5px;
	padding: 5px;
	text-align: center;
	font-size: 10px;
  border: 1px solid #FFF;
}
</style>