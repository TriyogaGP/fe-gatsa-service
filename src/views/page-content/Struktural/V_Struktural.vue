<template>
  <div>
    <h1 class="subheading grey--text">Data {{ roleID === '4' || roleID === '3' ? 'Guru' : 'Struktural' }}</h1>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-row no-gutters class="pa-2">
        <v-col cols="12" md="6">
          <Button 
            v-if="roleID === '1' || roleID === '2' || (roleID === '3' && kondisiKepalaSekolah)"
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
                  getStruktural({page: 1, limit: limit, keyword: ''})
                }"
                @keyup.enter="() => {
                  page = 1
                  getStruktural({page: 1, limit: limit, keyword: searchData})
                }"
              />
            </v-col>
            <v-col cols="12" md="3" class="pl-2 d-flex justify-end align-center">
              <Autocomplete
                v-model="page"
                :data-a="pageOptions"
                label-a="Page"
                :disabled-a="DataStruktural.length ? false : true"
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
          :items="DataStruktural"
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
          <template #[`item.nama`]="{ item }">
            <span v-html="uppercaseLetterFirst2(item.raw.nama)" /><br>
            <span v-html="item.raw.email" /> 
          </template>
          <template #[`item.jabatan`]="{ item }">
            <ul><li v-for="v in item.raw.jabatanGuru" :key="v.kode">{{ v.label === 'Wali Kelas' ? `${v.label} (${item.raw.waliKelas})` : v.label }}</li></ul>
          </template>
          <template #[`item.mapel`]="{ item }">
            <ul><li v-for="v in item.raw.mengajarBidang" :key="v.kode">{{ v.label }}</li></ul>
          </template>
          <template #[`item.kelas`]="{ item }">
            <!-- <ul><li v-for="kelas in item.raw.mengajarKelas.split(', ')" :key="kelas">{{ kelas }}</li></ul> -->
            <span v-html="item.raw.mengajarKelas"></span>
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
                  v-if="roleID === '1' || roleID === '2' || (roleID === '3' && kondisiKepalaSekolah)"
                  color-button="#0bd369"
                  icon-button="mdi mdi-pencil"
                  nama-button="Ubah"
                  :disabled-button="item.raw.statusAktif === false"
                  @proses="ubahData(item.raw.idUser)"
                />
                <Button
                  v-if="roleID === '1' || roleID === '2' || (roleID === '3' && kondisiKepalaSekolah)"
                  color-button="#0bd369"
                  :icon-button="item.raw.statusAktif === false ? 'mdi mdi-eye' : 'mdi mdi-eye-off'"
                  :nama-button="item.raw.statusAktif === false ? 'Active' : 'Non Active'"
                  @proses="postRecord(item.raw, 'STATUSRECORD', !item.raw.statusAktif)"
                />
                <Button 
                  v-if="roleID === '1' || roleID === '2' || (roleID === '3' && kondisiKepalaSekolah)"
                  color-button="#bd3a07"
                  icon-button="mdi mdi-delete"
                  nama-button="Hapus"
                  :disabled-button="item.raw.statusAktif === false"
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
                    :disabled-a="DataStruktural.length ? false : true"
                  />
                  <Button
                    variant="plain"
                    size-button="large"
                    model-button="comfortable"
                    color-button="#ffffff"
                    icon-button="mdi mdi-arrow-left-circle-outline"
                    :disabled-button="DataStruktural.length ? pageSummary.page != 1 ? false : true : true"
                    @proses="() => { page = pageSummary.page - 1 }"
                  />
                  <Button
                    variant="plain"
                    size-button="large"
                    model-button="comfortable"
                    color-button="#ffffff"
                    icon-button="mdi mdi-arrow-right-circle-outline"
                    :disabled-button="DataStruktural.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
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
      v-model="DialogStruktural"
      scrollable
      persistent
      transition="dialog-bottom-transition"
      width="auto"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Data Detail Struktural</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { clearData(); DialogStruktural = false; }"
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
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
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
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
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
          <h2 class="subheading black--text"><u>>>Data Kelengkapan</u></h2>
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
              class="pt-3"
            >
              {{ previewData.nomorInduk }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Pendidikan Struktural
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.pendidikanGuru }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Jabatan Struktural
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.jabatanGuru }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Mangajar Bidang
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.mengajarBidang }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Mangajar Kelas
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.mengajarKelas }}
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
              class="pt-3"
            >
              {{ previewData.waliKelas ? previewData.waliKelas : '-' }}
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
        :notifikasi-kode.sync="notifikasiKode"
        :notifikasi-text.sync="notifikasiText"
        :notifikasi-button.sync="notifikasiButton"
        @cancel="dialogNotifikasi = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import { useMeta } from 'vue-meta'
import PopUpNotifikasiVue from "../../Layout/PopUpNotifikasi.vue";
export default {
  name: 'DataStruktural',
  components: {
    PopUpNotifikasiVue
  },
  data: () => ({
		DataStruktural: [],
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
      { title: "No", key: "number", sortable: false, width: "5%" },
      { title: "#", key: "data-table-expand", sortable: false, width: "5%" },
      { title: "NOMOR INDUK", key: "nomorInduk", sortable: false },
      { title: "NAMA / EMAIl", key: "nama", sortable: false },
      { title: "JABATAN", key: "jabatan", sortable: false },
      { title: "MATA PELAJARAN", key: "mapel", sortable: false },
      { title: "KELAS", key: "kelas", sortable: false, width: "15%" },
      { title: "STATUS", key: "statusAktif", sortable: false },
      { title: "FLAG", key: "flag", sortable: false, width: "5%" },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
    roleID: '',
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
      nomorInduk: '',
      pendidikanGuru: '',
      jabatanGuru: '',
      mengajarBidang: '',
      mengajarKelas: '',
      waliKelas: '',
      fotoProfil: '',
    },
    DialogStruktural: false,
    endecryptType: '',
    kondisiKepalaSekolah: false,

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Data Struktural - MTsS. SIROJUL ATHFAL",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
  },
  computed: {
		...mapState({
			jabatan: store => store.setting.jabatanOptions,
			loadingtable: store => store.user.loadingtable,
		}),
    ...mapGetters({
      strukturalAll: 'user/strukturalAll',
      UID: 'setting/userUID',
    }),
		jabatanOptions(){
			if(this.roleID === '3'){
				let jabatan_guru = localStorage.getItem('jabatan_guru').split(', ')
				let result = []
				jabatan_guru.map(str => {
					let hasil = this.jabatan.filter(val => { return val.kode == str })
					result.push(hasil.length ? hasil[0].label : '')
				})
				return result
			}
		}
  },
  watch: {
    UID: {
      deep: true,
			handler(value) {
        this.$router.push({name: "FormulirStruktural", params: { kondisi: 'ADD', uid: value }});
      }
    },
    strukturalAll: {
			deep: true,
			handler(value) {
        this.pageOptions = []
        this.DataStruktural = value.records
				this.pageSummary = {
					page: this.DataStruktural.length ? value.pageSummary.page : 0,
					limit: this.DataStruktural.length ? value.pageSummary.limit : 0,
					total: this.DataStruktural.length ? value.pageSummary.total : 0,
					totalPages: this.DataStruktural.length ? value.pageSummary.totalPages : 0
				}
        for (let index = 1; index <= this.pageSummary.totalPages; index++) {
          this.pageOptions.push(index)
        }
      }
		},
    page: {
			deep: true,
			handler(value) {
				this.getStruktural({page: value, limit: this.limit, keyword: this.searchData})
			}
		},
    limit: {
			deep: true,
			handler(value) {
        this.page = 1
				this.getStruktural({page: 1, limit: value, keyword: this.searchData})
			}
		},
    jabatanOptions: {
			deep: true,
			handler(value) {
				if(this.roleID === '3'){
					if(value.includes('Kepala Sekolah')){
						this.kondisiKepalaSekolah = true
					}
				}
			}
		}
  },
  mounted() {
    this.roleID = localStorage.getItem('roleID')
		this.getStruktural({page: this.page, limit: this.limit, keyword: this.searchData});
    if(this.roleID === '4') return this.headers.splice(7,2)
	},
	methods: {
		...mapActions({
      fetchData: 'fetchData',
      getStruktural: 'user/getStruktural',
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
      this.$store.dispatch('user/postStruktural', bodyData)
      .then((res) => {
        if(localStorage.getItem('roleID') !== '1'){
					let payload = {
						jenis: 'CREATE',
						idUser: '2MMOu7xFdkbe4YFRjpp71fRkV26',
						type: 'Record',
						judul: 'Status Record data struktural',
						pesan: {
							message: `data struktural telah diubah status <strong>${localStorage.getItem('nama')}</strong>`,
							payload: bodyData,
						},
						params: null,
            dikirim: `dikirim oleh <strong>${localStorage.getItem('nama')}</strong>`,
            createBy: localStorage.getItem('idLogin'),
					}
					this.$store.dispatch('setting/postNotifikasi', payload)
				}
        this.getStruktural({page: 1, limit: this.limit, keyword: this.searchData})
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    ubahData(uid){
      this.$router.push({name: "FormulirStruktural", params: { kondisi: 'EDIT', uid: uid }});
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
        nomorInduk: item.nomorInduk,
        pendidikanGuru: item.pendidikanGuru.label,
        jabatanGuru: item.jabatanGuru.map(str => { return str.label; }).sort().join(', '),
        mengajarBidang: item.mengajarBidang.map(str => { return str.label; }).sort().join(', '),
        mengajarKelas: item.mengajarKelas,
        waliKelas: item.waliKelas,
        fotoProfil: item.fotoProfil,
      }
      this.DialogStruktural = true
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
        nomorInduk: '',
        pendidikanGuru: '',
        jabatanGuru: '',
        mengajarBidang: '',
        mengajarKelas: '',
        waliKelas: '',
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