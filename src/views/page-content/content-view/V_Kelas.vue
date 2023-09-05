<template>
  <div>
    <h1 class="subheading grey--text">Data Kelas</h1>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-row no-gutters class="pa-2">
        <v-col cols="12" md="6">
          <Button 
            color-button="light-blue darken-3"
            icon-button="mdi mdi-plus-thick"
            nama-button="Tambah"
            @proses="openDialog(null, 0)"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-row no-gutters>
            <v-col cols="12" md="9">
              <TextField
                v-model="searchData"
                icon-prepend-tf="mdi mdi-magnify"
                label-tf="Pencarian..."
                :clearable-tf="true"
                @click:clear="() => {
                  page = 1
                  getKelas({page: 1, limit: limit, keyword: ''})
                }"
                @keyup.enter="() => {
                  page = 1
                  getKelas({page: 1, limit: limit, keyword: searchData})
                }"
              />
            </v-col>
            <v-col cols="12" md="3" class="pl-2 d-flex justify-end align-center">
              <Autocomplete
                v-model="page"
                :data-a="pageOptions"
                label-a="Page"
                :disabled-a="DataKelas.length ? false : true"
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
          :items="DataKelas"
          expand-on-click
          show-expand
          item-value="idKelas"
          density="comfortable"
          hide-default-footer
          hide-default-header
          class="elavation-3 rounded"
          :items-per-page="itemsPerPage"
          @page-count="pageCount = $event"
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
          <template #[`item.status`]="{ item }">
            <v-icon size="small" v-if="item.raw.status == true" color="green" icon="mdi mdi-check" />
            <v-icon size="small" v-else-if="item.raw.status == false" color="red" icon="mdi mdi-close" />
          </template>
          <template #expanded-row="{ columns, item }">
            <tr>
              <td :colspan="columns.length">
                <Button 
                  color-button="#0bd369"
                  icon-button="mdi mdi-pencil"
                  nama-button="Ubah"
                  :disabled-button="item.raw.status === false"
                  @proses="openDialog(item.raw, 1)"
                />
                <Button 
                  color-button="#0bd369"
                  :icon-button="item.raw.status === false ? 'mdi mdi-eye' : 'mdi mdi-eye-off'"
                  :nama-button="item.raw.status === false ? 'Active' : 'Non Active'"
                  @proses="postRecord('STATUSRECORD', item.raw, !item.raw.status)"
                />
                <!-- <Button 
                  color-button="#bd3a07"
                  icon-button="mdi mdi-delete"
                  nama-button="Hapus"
                  :disabled-button="item.raw.idUser === idLog || item.raw.status === false"
                  @proses="postRecord('DELETE', item.raw, null)"
                />
                <Button 
                  color-button="#04f7f7"
                  icon-button="mdi mdi-information"
                  nama-button="Detail"
                  @proses="openDialog(item.raw, 2)"
                /> -->
              </td>
            </tr>
          </template>
          <template #bottom>
            <v-divider :thickness="2" class="border-opacity-100" color="white" />
            <v-row no-gutters>
              <v-col cols="10" class="pa-2 d-flex justify-start align-center">
                <span>Halaman <strong>{{ pageSummary.page ? pageSummary.page : 0 }}</strong> dari Total Halaman <strong>{{ pageSummary.totalPages ? pageSummary.totalPages : 0 }}</strong> (Records {{ pageSummary.total ? pageSummary.total : 0 }})</span>
              </v-col>
              <v-col cols="2" class="pa-2 text-right">
                <div class="d-flex justify-start align-center">
                  <Autocomplete
                    v-model="limit"
                    pilihan-a="select"
                    :data-a="limitPage"
                    label-a="Limit"
                    :disabled-a="DataKelas.length ? false : true"
                  />
                  <Button
                    variant="plain"
                    size-button="large"
                    model-button="comfortable"
                    color-button="#ffffff"
                    icon-button="mdi mdi-arrow-left-circle-outline"
                    :disabled-button="DataKelas.length ? pageSummary.page != 1 ? false : true : true"
                    @proses="() => { page = pageSummary.page - 1 }"
                  />
                  <Button
                    variant="plain"
                    size-button="large"
                    model-button="comfortable"
                    color-button="#ffffff"
                    icon-button="mdi mdi-arrow-right-circle-outline"
                    :disabled-button="DataKelas.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
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
      v-model="DialogKelas"
      scrollable
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>{{editedIndex == 0 ? 'Tambah' : editedIndex == 1 ? 'Ubah' : 'View'}} Data Kelas</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { clearData(); DialogKelas = false; }"
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
              Kelas
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <TextField
                v-model="inputDataKelas.kelas"
                label-tf="Kelas"
                :clearable-tf="editedIndex != 2"
                :readonly-tf="editedIndex == 2"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-row 
            no-gutters
            class="mr-3"
          >
            <v-col
              class="text-end"
              cols="12"
            >
              <Button 
                v-if="editedIndex == 0"
                color-button="black"
                nama-button="Simpan Data"
                :disabled-button="kondisiTombol"
                @proses="postRecord('ADD', null, null)"
              />
              <Button 
                v-if="editedIndex == 1"
                color-button="black"
                nama-button="Ubah Data"
                :disabled-button="kondisiTombol"
                @proses="postRecord('EDIT', null, null)"
              />
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogNotifikasi"
      transition="dialog-bottom-transition"
      persistent
      width="500px"
    >
      <PopUpNotifikasiVue
        :notifikasi-kode.sync="notifikasiKode"
        :notifikasi-text.sync="notifikasiText"
        :notifikasi-button.sync="notifikasiButton"
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
  name: 'DataKelas',
  components: {
    PopUpNotifikasiVue
  },
  data: () => ({
		DataKelas: [],
		searchData: '',
    page: 1,
    pageCount: 0,
    itemsPerPage: 100,
    limit: 10,
		limitPage: [5,10,20,50,100],
    pageOptions: [],
		pageSummary: {
			page: '',
			limit: '',
			total: '',
			totalPages: ''
		},
		headers: [
      { title: "NO", key: "number", sortable: false, width: "3%" },
      { title: "#", key: "data-table-expand", sortable: false, width: "3%" },
      { title: "KELAS", key: "kelas", sortable: false, width: "25%" },
      { title: "STATUS", key: "status", sortable: false, width: "25%" },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
    roleID: '',
    idLog: '',
    inputDataKelas: {
      id_kelas: '',
      kelas: '',
    },
    editedIndex: 0,
    kondisiTombol: true,
    DialogKelas: false,

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Data Kelas - MTsS. SIROJUL ATHFAL",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
  },
  computed: {
    ...mapState({
      loadingtable: store => store.kelas.loadingtable
    }),
    ...mapGetters({
      kelasAll: 'kelas/kelasAll',
    }),
  },
  watch: {
    kelasAll: {
      deep: true,
      handler(value){
        this.pageOptions = []
        this.DataKelas = value.records
				this.pageSummary = {
					page: this.DataKelas.length ? value.pageSummary.page : 0,
					limit: this.DataKelas.length ? value.pageSummary.limit : 0,
					total: this.DataKelas.length ? value.pageSummary.total : 0,
					totalPages: this.DataKelas.length ? value.pageSummary.totalPages : 0
				}
        for (let index = 1; index <= this.pageSummary.totalPages; index++) {
          this.pageOptions.push(index)
        }
      }
    },
    inputDataKelas: {
      deep: true,
      handler(value){
        if(value.kelas != ''){
          this.kondisiTombol = false
        }else{
          this.kondisiTombol = true
        }
      }
    },
    page: {
			deep: true,
			handler(value) {
				this.getKelas({page: value, limit: this.limit, keyword: this.searchData})
			}
		},
    limit: {
			deep: true,
			handler(value) {
        this.page = 1
				this.getKelas({page: 1, limit: value, keyword: this.searchData})
			}
		},
  },
  mounted() {
    this.roleID = localStorage.getItem('roleID')
    this.idLog = localStorage.getItem('idLogin')
		this.getKelas({page: this.page, limit: this.limit, keyword: this.searchData});
	},
	methods: {
		...mapActions({
      getKelas: 'kelas/getKelas',
    }),
    postRecord(jenis, item = null, status) {
      let bodyData = {
        ADDEDIT: {
          jenis: jenis,
          id_kelas: jenis === 'ADD' ? '' : this.inputDataKelas.id_kelas,
          kelas: this.inputDataKelas.kelas,
        },
        DELETESTATUS: {
          jenis: jenis,
          id_kelas: item.idKelas ? item.idKelas : null,
          status: status,
        },
      }
      this.$store.dispatch('kelas/postKelas', jenis === 'ADD' || jenis === 'EDIT' ? bodyData.ADDEDIT : bodyData.DELETESTATUS)
      .then((res) => {
        this.DialogKelas = false
        this.getKelas({page: 1, limit: this.limit, keyword: this.searchData})
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    openDialog(item, index){
      this.editedIndex = index
      if(index == 0){
        this.clearData()
      }else{
        this.inputDataKelas = {
          id_kelas: item.idKelas,
          kelas: item.kelas,
        }
      }
      this.DialogKelas = true
    },
    clearData(){
      this.inputDataKelas = {
        id_kelas: '',
        kelas: '',
      }
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