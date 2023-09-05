<template>
  <div>
    <h1 class="subheading grey--text">Data Administrator</h1>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-row no-gutters class="pa-2">
        <v-col cols="12" md="6">
          <Button 
            color-button="light-blue darken-3"
            icon-button="mdi mdi-plus-thick"
            nama-button="Tambah"
            @proses="getUID"
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
                  getAdministrator({page: 1, limit: limit, keyword: ''})
                }"
                @keyup.enter="() => {
                  page = 1
                  getAdministrator({page: 1, limit: limit, keyword: searchData})
                }"
              />
            </v-col>
            <v-col cols="12" md="3" class="pl-2 d-flex justify-end align-center">
              <Autocomplete
                v-model="page"
                :data-a="pageOptions"
                label-a="Page"
                :disabled-a="DataAdministrator.length ? false : true"
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
          :items="DataAdministrator"
          expand-on-click
          show-expand
          item-value="idUser"
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
          <template #[`item.statusAktif`]="{ item }">
            <v-icon size="small" v-if="item.raw.statusAktif == true" color="green" icon="mdi mdi-check" />
            <v-icon size="small" v-else-if="item.raw.statusAktif == false" color="red" icon="mdi mdi-close" />
          </template>
          <template #[`item.flag`]="{ item }">
            <div class="flag" :style="item.raw.flag ? 'background-color: red;' : 'background-color: green;'" />
          </template>
          <template #expanded-row="{ columns, item }">
            <tr>
              <td :colspan="columns.length">
                <Button 
                  color-button="#0bd369"
                  icon-button="mdi mdi-pencil"
                  nama-button="Ubah"
                  :disabled-button="item.raw.idUser === idLog || item.raw.statusAktif === false"
                  @proses="ubahData(item.raw.idUser)"
                />
                <Button 
                  color-button="#0bd369"
                  :icon-button="item.raw.statusAktif === false ? 'mdi mdi-eye' : 'mdi mdi-eye-off'"
                  :nama-button="item.raw.statusAktif === false ? 'Active' : 'Non Active'"
                  :disabled-button="item.raw.idUser === idLog"
                  @proses="postRecord(item.raw, 'STATUSRECORD', !item.raw.statusAktif)"
                />
                <Button 
                  color-button="#bd3a07"
                  icon-button="mdi mdi-delete"
                  nama-button="Hapus"
                  :disabled-button="item.raw.idUser === idLog || item.raw.statusAktif === false"
                  @proses="postRecord(item.raw, 'DELETE', null)"
                />
                <Button 
                  color-button="#04f7f7"
                  icon-button="mdi mdi-information"
                  nama-button="Detail"
                  @proses="openDialog(item.raw)"
                />
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
                    :disabled-a="DataAdministrator.length ? false : true"
                  />
                  <Button
                    variant="plain"
                    size-button="large"
                    model-button="comfortable"
                    color-button="#ffffff"
                    icon-button="mdi mdi-arrow-left-circle-outline"
                    :disabled-button="DataAdministrator.length ? pageSummary.page != 1 ? false : true : true"
                    @proses="() => { page = pageSummary.page - 1 }"
                  />
                  <Button
                    variant="plain"
                    size-button="large"
                    model-button="comfortable"
                    color-button="#ffffff"
                    icon-button="mdi mdi-arrow-right-circle-outline"
                    :disabled-button="DataAdministrator.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
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
      v-model="DialogAdministrator"
      scrollable
      persistent
      transition="dialog-bottom-transition"
      width="auto"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Data Detail Admin</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { clearData(); DialogAdministrator = false; }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4 v-dialog--custom">
          <div class="text-center">
            <v-avatar size="150" style="border: solid 2px #000;">
              <v-img :src="previewData.fotoProfil"></v-img>
            </v-avatar>
          </div>
          <h2 class="subheading black--text"><u>>>Data Log In</u></h2>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Consumer Type
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.namaRole }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Nama Lengkap
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.nama }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Username
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.username }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Email
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.email }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Kata Sandi
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.password }}
              <Button
                variant="plain"
                color-button="#000000"
                :icon-button="endecryptType ? 'mdi mdi-eye-lock' : 'mdi mdi-eye-lock-open'"
                model-button="comfortable"
                size-button="large"
                @proses="endecryptData('endecryptType')"
              />
            </v-col>
          </v-row>
          <h2 class="subheading black--text"><u>>>Data Alamat</u></h2>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Tempat, Tanggal Lahir
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.tempat }}, {{ convertDateForMonth(previewData.tanggalLahir) }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Jenis Kelamin
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.jenisKelamin }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Agama
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.agama }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Telepon
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.telp }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Alamat
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.alamat }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Provinsi
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.provinsi }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Kabupaten / Kota
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.kabKota }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
            cols="12"
            md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
            Kecamatan
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.kecamatan }}				
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Kelurahan
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.kelurahan }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Kode Pos
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.kodePos }}
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
      <PopUpNotifikasi
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
import PopUpNotifikasi from "../../Layout/PopUpNotifikasi.vue";
export default {
  name: 'DataAdministrator',
  components: {
    PopUpNotifikasi,
  },
  data: () => ({
		DataAdministrator: [],
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
      { title: "NO", key: "number", sortable: false, width: "5%" },
      { title: "#", key: "data-table-expand", sortable: false, width: "5%" },
      { title: "NAMA", key: "nama", sortable: false },
      { title: "EMAIL", key: "email", sortable: false },
      { title: "ROLE", key: "namaRole", sortable: false },
      { title: "STATUS", key: "statusAktif", sortable: false },
      { title: "FLAG", key: "flag", sortable: false, width: "5%" },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
    roleID: '',
    idLog: '',
    previewData: {
      idUser: '',
      namaRole: '',
      nama: '',
      username: '',
      email: '',
      password: '',
      tempat: '',
      tanggalLahir: '',
      jenisKelamin: '',
      agama: '',
      telp: '',
      alamat: '',
      provinsi: '',
      kabKota: '',
      kecamatan: '',
      kelurahan: '',
      kodePos: '',
      fotoProfil: '',
    },
    DialogAdministrator: false,
    endecryptType: '',

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Data Administrator - MTsS. SIROJUL ATHFAL",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
  },
  computed: {
    ...mapState({
      loadingtable: state => state.user.loadingtable,
    }),
    ...mapGetters({
      administratorAll: 'user/administratorAll',
      UID: 'setting/userUID',
    }),
  },
  watch: {
    UID: {
      deep: true,
			handler(value) {
        this.$router.push({name: "FormulirAdministrator", params: { kondisi: 'ADD', uid: value }});
      }
    },
    administratorAll: {
			deep: true,
			handler(value) {
        this.pageOptions = []
        this.DataAdministrator = value.records
				this.pageSummary = {
					page: this.DataAdministrator.length ? value.pageSummary.page : 0,
					limit: this.DataAdministrator.length ? value.pageSummary.limit : 0,
					total: this.DataAdministrator.length ? value.pageSummary.total : 0,
					totalPages: this.DataAdministrator.length ? value.pageSummary.totalPages : 0
				}
        for (let index = 1; index <= this.pageSummary.totalPages; index++) {
          this.pageOptions.push(index)
        }
      }
		},
    page: {
			deep: true,
			handler(value) {
				this.getAdministrator({page: value, limit: this.limit, keyword: this.searchData})
			}
		},
    limit: {
			deep: true,
			handler(value) {
        this.page = 1
				this.getAdministrator({page: 1, limit: value, keyword: this.searchData})
			}
		},
  },
  mounted() {
    this.roleID = localStorage.getItem('roleID')
    this.idLog = localStorage.getItem('idLogin')
		this.getAdministrator({page: this.page, limit: this.limit, keyword: this.searchData});
	},
	methods: {
    ...mapActions({
      fetchData: 'fetchData',
      getAdministrator: 'user/getAdministrator',
      getUID: 'setting/getUID',
    }),
    postRecord(item, jenis, kondisi) {
      let bodyData = {
        user: {
          jenis: jenis,
          idUser: item.idUser,
          kondisi: kondisi,
        },
        userdetail: {}
      }
      this.$store.dispatch('user/postAdministrator', bodyData)
      .then((res) => {
        this.getAdministrator({page: 1, limit: this.limit, keyword: this.searchData})
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    ubahData(uid){
      this.$router.push({name: "FormulirAdministrator", params: { kondisi: 'EDIT', uid: uid }});
    },
    openDialog(item){
      // this.getAdminbyUID(uid)
      this.previewData = {
        idUser: item.idUser,
        namaRole: item.namaRole,
        nama: item.nama,
        username: item.username,
        email: item.email,
        password: item.kataSandi,
        tempat: item.tempat,
        tanggalLahir: item.tanggalLahir,
        jenisKelamin: item.jenisKelamin,
        agama: item.agama.label,
        telp: item.telp,
        alamat: item.alamat,
        provinsi: this.uppercaseLetterFirst2(item.provinsi.nama),
        kabKota: this.uppercaseLetterFirst2(item.kabKota.nama),
        kecamatan: this.uppercaseLetterFirst2(item.kecamatan.nama),
        kelurahan: this.uppercaseLetterFirst2(item.kelurahan.nama),
        kodePos: item.kodePos,
        fotoProfil: item.fotoProfil,
      }
      this.DialogAdministrator = true
    },
    clearData(){
      this.previewData = {
        idUser: '',
        namaRole: '',
        nama: '',
        username: '',
        email: '',
        password: '',
        tempat: '',
        tanggalLahir: '',
        jenisKelamin: '',
        agama: '',
        telp: '',
        alamat: '',
        provinsi: '',
        kabKota: '',
        kecamatan: '',
        kelurahan: '',
        kodePos: '',
        fotoProfil: '',
      }
    },
    endecryptData(d) {
      this[d] = !this[d]
      let url = this[d] ? 'decryptPass' : 'encryptPass' 
      let payload = {
				method: "get",
				url: `settings/${url}?kata=${this.previewData.password}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.previewData.password = res.data.result.hasil;
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
</style>