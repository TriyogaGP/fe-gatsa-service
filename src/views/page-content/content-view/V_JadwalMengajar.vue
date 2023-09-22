<template>
  <div>
    <h1 class="subheading grey--text">Data Jadwal Mengajar</h1>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-row no-gutters class="pa-2">
        <v-col cols="12" md="6" />
        <v-col cols="12" md="6">
          <v-row no-gutters>
            <v-col cols="12" md="9" class="pr-2">
              <TextField
                v-model="searchData"
                icon-prepend-tf="mdi mdi-magnify"
                label-tf="Pencarian..."
                :clearable-tf="true"
                @click:clear="() => {
                  page = 1
                  getJadwalMengajar({page: 1, limit: limit, keyword: ''})
                }"
                @keyup.enter="() => {
                  page = 1
                  getJadwalMengajar({page: 1, limit: limit, keyword: searchData})
                }"
              />
            </v-col>
            <v-col cols="12" md="3" class="d-flex justify-end align-center">
              <Autocomplete
                v-model="page"
                :data-a="pageOptions"
                label-a="Page"
                :disabled-a="DataJadwalMengajar.length ? false : true"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <div class="px-1">
        <v-data-table
          loading-text="Sedang memuat... Harap tunggu"
          no-data-text="Tidak ada data yang tersedia"
          no-results-text="Tidak ada catatan yang cocok ditemukan"
          :headers="headers"
          :loading="loadingtable"
          :items="DataJadwalMengajar"
          :expand-on-click="DialogMataPelajaran === false ? true : false"
          v-model:expanded="expanded"
          item-value="idUser"
          density="comfortable"
          hide-default-footer
          hide-default-header
          class="elavation-3 rounded"
          :items-per-page="itemsPerPage"
          @page-count="pageCount = $event"
          @click:row="clickrow"
        >
          <!-- header -->
          <template #headers="{ columns }">
            <tr>
              <td v-for="header in columns" :key="header.title" class="tableHeader">{{ header.title.toUpperCase() }}</td>
            </tr>
          </template>
          <template #[`item.number`]="{ item }">
            {{ page > 1 ? ((page - 1)*limit) + item.index + 1 : item.index + 1 }}
          </template>
          <template #[`item.nama`]="{ item }">
            <span v-html="uppercaseLetterFirst2(item.raw.nama)" /> 
          </template>
          <template #[`item.datamapel`]="{ item }"> 
						<span v-for="(val, i) in item.raw.dataJadwalMengajar" :key="i" class="box fourcorners" @click="bukadialog(item.raw.dataJadwalMengajar[i])">
							<strong><span v-html="val.mapel" /></strong>
						</span>
					</template>
          <template #expanded-row="{ columns, item }">
            <tr>
              <td :colspan="columns.length">
                <Button 
                  color-button="#0bd369"
                  icon-button="mdi mdi-pencil"
                  nama-button="Ubah"
                  @proses="ubahData(item.raw)"
                />
              </td>
            </tr>
          </template>
          <template #bottom>
            <v-divider :thickness="2" class="border-opacity-100" color="white" />
            <v-row no-gutters>
              <v-col cols="12" lg="10" class="pa-2 d-flex justify-start align-center">
                <span>Halaman <strong>{{ pageSummary.page ? pageSummary.page : 0 }}</strong> dari Total Halaman <strong>{{ pageSummary.totalPages ? pageSummary.totalPages : 0 }}</strong> (Records {{ pageSummary.total ? pageSummary.total : 0 }})</span>
              </v-col>
              <v-col cols="12" lg="2" class="pa-2 text-right">
                <div class="d-flex justify-start align-center">
                  <Autocomplete
                    v-model="limit"
                    pilihan-a="select"
                    :data-a="limitPage"
                    label-a="Limit"
                    :disabled-a="DataJadwalMengajar.length ? false : true"
                  />
                  <Button
                    variant="plain"
                    size-button="large"
                    model-button="comfortable"
                    color-button="#ffffff"
                    icon-button="mdi mdi-arrow-left-circle-outline"
                    :disabled-button="DataJadwalMengajar.length ? pageSummary.page != 1 ? false : true : true"
                    @proses="() => { page = pageSummary.page - 1 }"
                  />
                  <Button
                    variant="plain"
                    size-button="large"
                    model-button="comfortable"
                    color-button="#ffffff"
                    icon-button="mdi mdi-arrow-right-circle-outline"
                    :disabled-button="DataJadwalMengajar.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
                    @proses="() => { page = pageSummary.page + 1 }"
                  />
                </div>
              </v-col>
            </v-row>
          </template>
        </v-data-table>
      </div>
    </v-card>
    <v-dialog
      v-model="DialogJadwalMengajar"
      scrollable
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Ubah Data Jadwal Mengajar</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { DialogJadwalMengajar = false; }"
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
              Mata Pelajaran
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <Autocomplete
                v-model="inputData.mapel"
                :data-a="mengajarOptions"
                label-a="Pilih Mata Pelajaran"
                item-title="label"
                item-value="label"
                multiple
                chips
                closable-chips
                :clearable-a="true"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Kelas
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <Autocomplete
                v-model="inputData.kelas"
                :data-a="kelasOptions"
                label-a="Pilih Kelas"
                item-title="kelas"
                item-value="kelas"
                multiple
                chips
                closable-chips
                :clearable-a="true"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions>
					<v-row 
						no-gutters
						class="mt-1 mr-3"
					>
						<v-col
							class="text-end"
							cols="12"
						>
              <Button 
                color-button="black"
                nama-button="Ubah Data"
                @proses="SimpanForm()"
              />
						</v-col>
					</v-row>
				</v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="DialogMataPelajaran"
      scrollable
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Data Mata Pelajaran</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { DialogMataPelajaran = false; }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4" style="font-size: 13px;">
          hahaha
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
import { mapActions, mapGetters, mapState } from "vuex";
import { useMeta } from 'vue-meta'
import PopUpNotifikasiVue from "../../Layout/PopUpNotifikasi.vue";
export default {
  name: 'DataJadwalMengajar',
  components: {
    PopUpNotifikasiVue
  },
  data: () => ({
		expanded: [],
		DataJadwalMengajar: [],
		dataKelasMapel: [],
		searchData: '',
    page: 1,
    pageCount: 0,
    itemsPerPage: 100,
    limit: 20,
		limitPage: [5,10,20,50,100],
    pageOptions: [],
		pageSummary: {
			page: '',
			limit: '',
			total: '',
			totalPages: ''
		},
		headers: [
      { title: "No", key: "number", sortable: false, width: "3%" },
      { title: "#", key: "data-table-expand", sortable: false, width: "3%" },
      { title: "NOMOR INDUK", key: "nomorInduk", sortable: false, width: "20%" },
      { title: "NAMA", key: "nama", sortable: false, width: "20%" },
      { title: "MATA PELAJARAN", key: "datamapel", sortable: false, width: "35%" },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
    DialogJadwalMengajar: false,
    DialogMataPelajaran: false,
    inputData: {
      idUser: '',
      mapel: '',
      kelas: '',
    },

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Data Jadwal Mengajar",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
  },
  computed: {
    ...mapState({
      mengajarOptions: store => store.setting.mengajarOptions, 
      kelasOptions: store => store.setting.kelasOptions,
      loadingtable: store => store.user.loadingtable, 
    }),
    ...mapGetters({
      jadwalMengajarAll: 'user/jadwalMengajarAll',
    }),
  },
  watch: {
    jadwalMengajarAll: {
			deep: true,
			handler(value) {
        this.pageOptions = []
        this.DataJadwalMengajar = value.records
				this.pageSummary = {
					page: this.DataJadwalMengajar.length ? value.pageSummary.page : 0,
					limit: this.DataJadwalMengajar.length ? value.pageSummary.limit : 0,
					total: this.DataJadwalMengajar.length ? value.pageSummary.total : 0,
					totalPages: this.DataJadwalMengajar.length ? value.pageSummary.totalPages : 0
				}
        for (let index = 1; index <= this.pageSummary.totalPages; index++) {
          this.pageOptions.push(index)
        }
      }
		},
    page: {
			deep: true,
			handler(value) {
				this.getJadwalMengajar({page: value, limit: this.limit, keyword: this.searchData})
			}
		},
    limit: {
			deep: true,
			handler(value) {
        this.page = 1
				this.getJadwalMengajar({page: 1, limit: value, keyword: this.searchData})
			}
		},
  },
  mounted() {
		this.getJadwalMengajar({page: this.page, limit: this.limit, keyword: this.searchData})
	},
	methods: {
		...mapActions({
      getJadwalMengajar: 'user/getJadwalMengajar', 
      getMengajar: 'setting/getMengajar', 
      getKelas: 'setting/getKelas',
    }),
    SimpanForm() {
      let bodyData = {
        idUser: this.inputData.idUser,
        kelas: this.inputData.kelas,
        mapel: this.inputData.mapel,
      }
      this.$store.dispatch('user/postJadwalMengajar', bodyData)
      .then((res) => {
        this.DialogJadwalMengajar = false
        this.getJadwalMengajar({page: 1, limit: this.limit, keyword: this.searchData})
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    remove(item, kondisi) {
      if(kondisi === 'mapel'){
        this.inputData.mapel.splice(this.inputData.mapel.indexOf(item.label), 1);
      }else if(kondisi === 'kelas'){
        this.inputData.kelas.splice(this.inputData.kelas.indexOf(item.kelas), 1);
      }
      console.log(this.inputData.mapel);
    },
    bukadialog(item){
      this.dataKelasMapel = item.resdata
      this.DialogMataPelajaran = true
      console.log(this.dataKelasMapel);
    },
    ubahData(item){
		  this.getMengajar()
      this.getKelas({ kondisi: 'All' })
      this.inputData = {
        idUser: item.idUser,
        mapel: item.dataJadwalMengajar.map(str => str.mapel),
        kelas: item.dataJadwalMengajar.map(str => {
          return str.resdata.map(val => val.kelas)
        })[0],
      }
      this.DialogJadwalMengajar = true
    },
    clickrow(event, data) {
      const index = this.$data.expanded.find(i => i === data?.item?.raw?.idUser);
      if(typeof index === 'undefined') return this.$data.expanded = [];
      this.$data.expanded.splice(0, 1)
      this.$data.expanded.push(data?.item?.raw?.idUser);
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
.box{
	width: 75px;
	height: 40px;
  background-image:-moz-linear-gradient(top, #272727, #5a5757);
	background-image: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#272727), to(#5a5757), color-stop(1,#5a5757));
	margin: 2px;
  color: #FFF;
  z-index: 100;
}
.fourcorners{
	-moz-border-radius: 10px;
	-webkit-border-radius: 10px;
	-khtml-border-radius: 10px; 
	border-radius: 10px;
	padding: 10px;
	text-align: center;
	font-size: 12px;
  cursor: pointer;
}
</style>