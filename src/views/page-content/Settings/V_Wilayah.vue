<template>
  <div>
		<h1 class="subheading grey--text">Panel Wilayah</h1>
    <v-alert
      color="surface"
      border="start"
      border-color="light-blue accent-4"
      elevation="2"
      density="compact"
      icon="mdi mdi-information"
      title="Informasi"
      class="mb-2"
    >
      <template v-slot:text>
        <ul style="font-size: 12px;">
          <li>- "∑" artinya Jumlah.</li>
        </ul>
      </template>
    </v-alert>
    <v-tabs
      v-model="tab"
      grow
      bg-color="background-dialog-card"
      density="comfortable"
    >
      <v-tab v-for="item in itemsTab" :key="item.code" :value="item.code">
        <v-icon :icon="item.icon" />
        {{ item.text }}
      </v-tab>
    </v-tabs>
    <v-data-table
      loading-text="Sedang memuat... Harap tunggu"
      no-data-text="Tidak ada data yang tersedia"
      no-results-text="Tidak ada catatan yang cocok ditemukan"
      :headers="headers"
      :loading="loadingtable"
      :items="DataDaerah"
      expand-on-click
      item-value="kode"
      density="comfortable"
      hide-default-footer
      hide-default-header
      class="elavation-3 rounded mt-2"
      sort-asc-icon="mdi mdi-sort-alphabetical-ascending"
      sort-desc-icon="mdi mdi-sort-alphabetical-descending"
      :items-per-page="itemsPerPage"
      @page-count="pageCount = $event"
      @click:row="clickrow"
      v-model:expanded="expanded"
      @update:sort-by="sortBy"
    >
      <!-- header -->
      <template #headers="{ columns, isSorted, getSortIcon, toggleSort }">
        <tr>
          <td v-for="header in columns" :key="header.title" class="tableHeader">
            <span v-if="header.sortable" class="mr-2" style="cursor: pointer; width: 100%;" @click="() => toggleSort(header)">{{ header.title.toUpperCase() }}</span>
            <span v-else>{{ header.title.toUpperCase() }}</span>
            <v-icon v-if="isSorted(header)" :icon="getSortIcon(header)"></v-icon>
          </td>
        </tr>
      </template>
      <template #loader>
        <LoaderDataTables />
      </template>
      <!-- <template #[`item.number`]="{ item }">
        {{ page > 1 ? ((page - 1)*limit) + item.index + 1 : item.index + 1 }}
      </template> -->
      <template #[`item.provinsi`]="{ item }">
        <span v-html="`${uppercaseLetterFirst2(item.raw.provinsi)}`" />
      </template>
      <template #[`item.kabkota`]="{ item }">
        <span v-html="`${uppercaseLetterFirst2(item.raw.kabkota)}`" />
      </template>
      <template #[`item.kecamatan`]="{ item }">
        <span v-html="`${uppercaseLetterFirst2(item.raw.kecamatan)}`" />
      </template>
      <template #[`item.kelurahan`]="{ item }">
        <span v-html="`${uppercaseLetterFirst2(item.raw.kelurahan)}`" />
      </template>
      <template #[`item.jumlahKabKota`]="{ item }">
        <span>{{ item.raw.countWilayah.kabupaten + item.raw.countWilayah.kota }}</span>
      </template>
      <template #[`item.jumlahKelDes`]="{ item }">
        <span>{{ item.raw.countWilayah.kelurahan + item.raw.countWilayah.desa }}</span>
      </template>
      <template #expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length">
            <Button 
              color-button="success"
              icon-button="mdi mdi-pencil"
              nama-button="Ubah"
              @proses="bukaDialog(item.raw, 1)"
            />
            <!-- <Button 
              color-button="#bd3a07"
              icon-button="mdi mdi-delete"
              nama-button="Hapus"
              @proses="postRecord(item.raw, 'DELETE', null)"
            /> -->
          </td>
        </tr>
      </template>
      <template #top>
        <v-row no-gutters class="pa-2">
          <v-col cols="12" md="6">
            <Button 
              color-button="light-blue darken-3"
              icon-button="mdi mdi-plus-thick"
              nama-button="Tambah"
              @proses="bukaDialog(null, 0)"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-row no-gutters>
              <v-col cols="12" md="9">
                <TextField
                  v-model="searchData"
                  icon-prepend-tf="mdi mdi-magnify"
                  :label-tf="`Pencarian ${itemsTab[Number(tab)-1]?.text}...`"
                  :clearable-tf="true"
                  @click:clear="() => {
                    page = 1
                    getDaerah({page: 1, limit: limit, bagian: bagian, keyword: ''})
                  }"
                  @keyup.enter="() => {
                    page = 1
                    getDaerah({page: 1, limit: limit, bagian: bagian, keyword: searchData})
                  }"
                />
              </v-col>
              <v-col cols="12" md="3" class="pl-2 d-flex justify-end align-center">
                <Autocomplete
                  v-model="page"
                  :data-a="pageOptions"
                  label-a="Page"
                  :disabled-a="DataDaerah.length ? false : true"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider :thickness="2" class="border-opacity-100" color="white" />
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
                :disabled-a="DataDaerah.length ? false : true"
              />
              <Button
                variant="plain"
                size-button="large"
                model-button="comfortable"
                color-button="#ffffff"
                icon-button="mdi mdi-arrow-left-circle-outline"
                :disabled-button="DataDaerah.length ? pageSummary.page != 1 ? false : true : true"
                @proses="() => { page = pageSummary.page - 1 }"
              />
              <Button
                variant="plain"
                size-button="large"
                model-button="comfortable"
                color-button="#ffffff"
                icon-button="mdi mdi-arrow-right-circle-outline"
                :disabled-button="DataDaerah.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
                @proses="() => { page = pageSummary.page + 1 }"
              />
            </div>
          </v-col>
        </v-row>
      </template>
    </v-data-table>
    <v-dialog
      v-model="DialogDaerah"
      scrollable
      persistent
      transition="dialog-bottom-transition"
      width="auto"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>{{editedIndex == 0 ? 'Tambah' : editedIndex == 1 ? 'Ubah' : 'View'}} Data {{itemsTab[Number(tab)-1]?.text}}</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { clearData(); DialogDaerah = false; }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4 v-dialog--custom">
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Kode
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3 d-flex flex-row align-end"
            >
              <TextField
                v-if="bagian === 'provinsiOnly'"
                v-model="kode_provinsi"
                :disabled-tf="enabled"
                @keypress="onlyNumber($event, 2, kode_provinsi)"
              />
              <TextField
                v-if="bagian !== 'provinsiOnly'"
                v-model="kode_provinsi"
                @keypress="onlyNumber($event, 2, kode_provinsi)"
                :readonly-tf="bagian !== 'provinsiOnly'"
                :disabled-tf="enabled"
              />
              <span v-if="bagian !== 'provinsiOnly'" class="titik" />
              <TextField
                v-if="bagian !== 'provinsiOnly'"
                v-model="kode_kabkota"
                :disabled-tf="enabled"
                @keypress="onlyNumber($event, 2, kode_kabkota)"
              />
              <span v-if="bagian !== 'provinsiOnly' && bagian !== 'kabkotaOnly'" class="titik" />
              <TextField
                v-if="bagian !== 'provinsiOnly' && bagian !== 'kabkotaOnly'"
                v-model="kode_kecamatan"
                :disabled-tf="enabled"
                @keypress="onlyNumber($event, 2, kode_kecamatan)"
              />
              <span v-if="bagian === 'kelurahanOnly'" class="titik" />
              <TextField
                v-if="bagian === 'kelurahanOnly'"
                v-model="kode_kelurahan"
                :disabled-tf="enabled"
                @keypress="onlyNumber($event, 4, kode_kelurahan)"
              />
              <v-checkbox-btn v-model="enabled" class="pe-2"/>
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
              <TextField
                v-if="bagian === 'provinsiOnly'"
                v-model="inputDataDaerah.provinsi"
                label-tf="Provinsi"
                :clearable-tf="editedIndex != 2"
                :readonly-tf="editedIndex == 2"
              />
              <Autocomplete
                v-else
                v-model="inputDataDaerah.provinsi"
                :data-a="optionsProvinsi"
                item-title="nama"
                item-value="kode"
                label-a="Provinsi"
                :clearable-a="true"
                @ubah="wilayah('provinsi', $event)"
              />
            </v-col>
          </v-row>
          <v-row no-gutters v-if="bagian !== 'provinsiOnly'">
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
              <TextField
                v-if="bagian === 'kabkotaOnly'"
                v-model="inputDataDaerah.kabkota"
                label-tf="Kabupaten / Kota"
                :clearable-tf="editedIndex != 2"
                :readonly-tf="editedIndex == 2"
              />
              <Autocomplete
                v-if="bagian !== 'provinsiOnly' && bagian !== 'kabkotaOnly'"
                v-model="inputDataDaerah.kabkota"
                :data-a="optionsKabKota"
                item-title="nama"
                item-value="kode"
                label-a="Kabupaten / Kota"
                :clearable-a="true"
                :disabled-a="inputDataDaerah.provinsi ? false : true"
                @ubah="wilayah('kabkota', $event)"
              />
            </v-col>
          </v-row>
          <v-row no-gutters v-if="bagian !== 'provinsiOnly' && bagian !== 'kabkotaOnly'">
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
              <TextField
                v-if="bagian === 'kecamatanOnly'"
                v-model="inputDataDaerah.kecamatan"
                label-tf="Kecamatan"
                :clearable-tf="editedIndex != 2"
                :readonly-tf="editedIndex == 2"
              />
              <Autocomplete
                v-if="bagian !== 'kecamatanOnly'"
                v-model="inputDataDaerah.kecamatan"
                :data-a="optionsKecamatan"
                item-title="nama"
                item-value="kode"
                label-a="Kecamatan"
                :clearable-a="true"
                :disabled-a="inputDataDaerah.kabkota ? false : true"
              />
            </v-col>
          </v-row>
          <v-row no-gutters v-if="bagian === 'kelurahanOnly'">
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
              <TextField
                v-model="inputDataDaerah.kelurahan"
                label-tf="Kelurahan"
                :clearable-tf="editedIndex != 2"
                :readonly-tf="editedIndex == 2"
              />
            </v-col>
          </v-row>
          <v-row no-gutters v-if="bagian === 'kelurahanOnly'">
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
              <TextField
                v-model="inputDataDaerah.kodePos"
                label-tf="Kode Pos"
                :clearable-tf="true"
                @keypress="onlyNumber($event, 5, inputDataDaerah.kodePos)"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Kategori Wilayah
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <Autocomplete
                v-model="inputDataDaerah.kategori"
                :data-a="kategoriWilayah.filter(x => x.bagian === bagian)"
                item-title="text"
                item-value="value"
                label-a="Kategori Wilayah"
                :clearable-a="true"
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
                @proses="postRecord('ADD', null, bagian)"
              />
              <Button 
                v-if="editedIndex == 1"
                color-button="black"
                nama-button="Ubah Data"
                @proses="postRecord('EDIT', null, bagian)"
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
import { mapActions, mapGetters, mapState } from "vuex";
import { useMeta } from 'vue-meta'
import PopUpNotifikasi from "../../Layout/PopUpNotifikasi.vue";
export default {
  name: 'Wilayah',
	components: { PopUpNotifikasi },
  data: () => ({
    expanded: [],
		DataDaerah: [],
		bagian: '',
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
    sortBy: [],
		headers: [],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
    itemsTab: [
			{code: '1', text: 'Provinsi', icon: 'mdi mdi-map'},
			{code: '2', text: 'Kabupaten/Kota', icon: 'mdi mdi-map'},
			{code: '3', text: 'Kecamatan', icon: 'mdi mdi-map'},
			{code: '4', text: 'Kelurahan', icon: 'mdi mdi-map'},
		],
		tab: '',
    kategoriWilayah: [
			{value: 'Provinsi', text: 'Provinsi', bagian: 'provinsiOnly'},
			{value: 'Kabupaten', text: 'Kabupaten', bagian: 'kabkotaOnly'},
			{value: 'Kota', text: 'Kota', bagian: 'kabkotaOnly'},
			{value: 'Kecamatan', text: 'Kecamatan', bagian: 'kecamatanOnly'},
			{value: 'Kelurahan', text: 'Kelurahan', bagian: 'kelurahanOnly'},
			{value: 'Desa', text: 'Desa', bagian: 'kelurahanOnly'},
		],
		kode_provinsi: '',
		kode_kabkota: '',
		kode_kecamatan: '',
		kode_kelurahan: '',
    inputDataDaerah: {
      idLocation: '',
      kode: '',
      kode_temp: '',
      kategori: '',
      provinsi: null,
      kabkota: null,
      kecamatan: null,
      kelurahan: null,
      kodePos: '',
    },
    editedIndex: 0,
    DialogDaerah: false,
    enabled: true,

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Settings (Wilayah)",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
  },
	computed: {
		...mapState({
			loadingtable: store => store.setting.loadingtable,
			ProvinsiOptions: store => store.setting.ProvinsiOptions,
      KabKotaOptions: state => state.setting.KabKotaOptions,
      KecamatanOptions: state => state.setting.KecamatanOptions,
		}),
		...mapGetters({
      daerahAll: 'setting/daerahAll',
		}),
    optionsProvinsi(){
      let prov = this.ProvinsiOptions.map(x => {
        return {
          kode: x.kode,
          nama: `${x.kode} - ${x.nama}`
        }
      })
      return prov
    },
    optionsKabKota(){
      let kabkota = this.KabKotaOptions.map(x => {
        return {
          kode: x.kode.split('.')[1],
          nama: `${x.kode} - ${x.nama}`
        }
      })
      return kabkota
    },
    optionsKecamatan(){
      let kecamatan = this.KecamatanOptions.map(x => {
        return {
          kode: x.kode.split('.')[2],
          nama: `${x.kode} - ${x.nama}`
        }
      })
      return kecamatan
    },
	},
	watch: {
		daerahAll: {
			deep: true,
			handler(value) {
        this.pageOptions = []
				this.DataDaerah = value.records
				this.pageSummary = {
					page: value.pageSummary.page,
					limit: value.pageSummary.limit,
					total: value.pageSummary.total,
					totalPages: value.pageSummary.totalPages
				}
				for (let index = 1; index <= this.pageSummary.totalPages; index++) {
          this.pageOptions.push(index)
        }
			}
		},
    inputDataDaerah: {
      deep: true,
      handler(value){
        if(this.bagian === 'kabkotaOnly'){
          this.kode_provinsi = value.provinsi
        }else if(this.bagian === 'kecamatanOnly'){
          this.kode_provinsi = value.provinsi
          this.kode_kabkota = value.kabkota
        }else if(this.bagian === 'kelurahanOnly'){
          this.kode_provinsi = value.provinsi
          this.kode_kabkota = value.kabkota
          this.kode_kecamatan = value.kecamatan
        }
      }
    },
    bagian: {
      deep: true,
      handler(value){
        this.enabled = true
        this.clearData()
        this.getWilayah({ bagian: 'provinsi', KodeWilayah: null })
      }
    },
    tab: {
      deep: true,
      handler(value){
        this.enabled = true
        this.DataDaerah = []
        this.searchData = ''
        this.page = 1
        this.bagian = value === '1' ? 'provinsiOnly' : value === '2' ? 'kabkotaOnly' : value === '3' ? 'kecamatanOnly' : 'kelurahanOnly'
        this.headerOptions(this.bagian)
        this.getDaerah({page: this.page, limit: this.limit, bagian: this.bagian, keyword: this.searchData})
      }
    },
		page: {
			deep: true,
			handler(value) {
				if(value){
					this.headerOptions(this.bagian)
          this.getDaerah({page: value, limit: this.limit, bagian: this.bagian, keyword: this.searchData})
				}
			}
		},
		limit: {
			deep: true,
			handler(value) {
				this.page = 1
				this.headerOptions(this.bagian)
        this.getDaerah({page: this.page, limit: value, bagian: this.bagian, keyword: this.searchData})
			}
		},
  },
	mounted() {
	},
	methods: {
		...mapActions({
			getDaerah: 'setting/getDaerah',
      getWilayah: 'setting/getWilayah',	
		}),
    postRecord(jenis, item = null, bagian) {
      let bodyData = {
        ADDEDIT: {
          jenis: jenis,
          bagian: bagian,
          enabled: this.enabled,
          idLocation: jenis === 'ADD' ? '' : this.inputDataDaerah.idLocation,
          kode: bagian === 'provinsiOnly' ? `${this.kode_provinsi}`
          : bagian === 'kabkotaOnly' ? `${this.kode_provinsi}.${this.kode_kabkota}`
          : bagian === 'kecamatanOnly' ? `${this.kode_provinsi}.${this.kode_kabkota}.${this.kode_kecamatan}`
          : `${this.kode_provinsi}.${this.kode_kabkota}.${this.kode_kecamatan}.${this.kode_kelurahan}`,
          kodeTemp: this.inputDataDaerah.kode_temp,
          kategori: this.inputDataDaerah.kategori,
          nama: bagian === 'provinsiOnly' ? `${this.uppercaseLetterFirst2(this.inputDataDaerah.provinsi)}`
          : bagian === 'kabkotaOnly' ? `${this.uppercaseLetterFirst2(this.inputDataDaerah.kabkota)}`
          : bagian === 'kecamatanOnly' ? `${this.uppercaseLetterFirst2(this.inputDataDaerah.kecamatan)}`
          : `${this.uppercaseLetterFirst2(this.inputDataDaerah.kelurahan)}`,
          kodePos: bagian === 'kelurahanOnly' ? this.inputDataDaerah.kodePos === '' ? null : this.inputDataDaerah.kodePos : null,
        },
        DELETESTATUS: {
          // jenis: jenis,
          // kode: item.kode ? item.kode : null,
        },
      }
      // console.log(bodyData);
      this.$store.dispatch('setting/postDaerah', jenis === 'ADD' || jenis === 'EDIT' ? bodyData.ADDEDIT : bodyData.DELETESTATUS)
      .then((res) => {
        this.DialogDaerah = false
        this.headerOptions(bagian)
        this.page = 1
        this.getDaerah({page: this.page, limit: this.limit, bagian: bagian, keyword: this.searchData})
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    headerOptions(bagian){
      if(bagian === 'provinsiOnly'){
        this.headers = [
          // { title: "No", key: "number", sortable: false, width: "7%" },
          { title: "#", key: "data-table-expand", sortable: false, width: "5%" },
          { title: "KODE", key: "kode", sortable: true },
          { title: "PROVINSI", key: "provinsi", sortable: true },
          { title: "∑ KAB", key: "countWilayah.kabupaten", sortable: false },
          { title: "∑ KOTA", key: "countWilayah.kota", sortable: false },
          { title: "∑ KOTA + KAB", key: "jumlahKabKota", sortable: true },
          { title: "∑ KEC", key: "countWilayah.kecamatan", sortable: true },
          { title: "∑ KELURAHAN", key: "countWilayah.kelurahan", sortable: false },
          { title: "∑ DESA", key: "countWilayah.desa", sortable: false },
          { title: "∑ KEL + DESA", key: "jumlahKelDes", sortable: true },
        ]
      }else if(bagian === 'kabkotaOnly'){
        this.headers = [
          // { title: "No", key: "number", sortable: false, width: "7%" },
          { title: "#", key: "data-table-expand", sortable: false, width: "5%" },
          { title: "KODE", key: "kode", sortable: true },
          { title: "KATEGORI", key: "kategori", sortable: false },
          { title: "PROVINSI", key: "provinsi", sortable: true },
          { title: "KABUPATEN / KOTA", key: "kabkota", sortable: true },
          { title: "∑ KEC", key: "countWilayah.kecamatan", sortable: true },
          { title: "∑ KELURAHAN", key: "countWilayah.kelurahan", sortable: false },
          { title: "∑ DESA", key: "countWilayah.desa", sortable: false },
          { title: "∑ KEL + DESA", key: "jumlahKelDes", sortable: true },
        ]
      }else if(bagian === 'kecamatanOnly'){
        this.headers = [
          // { title: "No", key: "number", sortable: false, width: "7%" },
          { title: "#", key: "data-table-expand", sortable: false, width: "5%" },
          { title: "KODE", key: "kode", sortable: true },
          { title: "PROVINSI", key: "provinsi", sortable: true },
          { title: "KABUPATEN / KOTA", key: "kabkota", sortable: true },
          { title: "KECAMATAN", key: "kecamatan", sortable: true },
          { title: "∑ KELURAHAN", key: "countWilayah.kelurahan", sortable: false },
          { title: "∑ DESA", key: "countWilayah.desa", sortable: false },
          { title: "∑ KEL + DESA", key: "jumlahKelDes", sortable: true },
        ]
      }else if(bagian === 'kelurahanOnly'){
        this.headers = [
          // { title: "No", key: "number", sortable: false, width: "7%" },
          { title: "#", key: "data-table-expand", sortable: false, width: "5%" },
          { title: "KODE", key: "kode", sortable: true },
          { title: "KATEGORI", key: "kategori", sortable: false },
          { title: "PROVINSI", key: "provinsi", sortable: true },
          { title: "KABUPATEN / KOTA", key: "kabkota", sortable: true },
          { title: "KECAMATAN", key: "kecamatan", sortable: true },
          { title: "KELURAHAN", key: "kelurahan", sortable: true },
          { title: "KODE POS", key: "kodePos", sortable: false },
        ]
      }
    },
    bukaDialog(item, index){
      this.editedIndex = index
      this.enabled = true
      if(index == 0){
        this.clearData()
      }else{
        let split = item?.kode.split('.')
        if(this.bagian === 'provinsiOnly'){ this.kode_provinsi = item?.kode }
        else if(this.bagian === 'kabkotaOnly'){
          this.kode_provinsi = split[0]
          this.kode_kabkota = split[1]
        }else if(this.bagian === 'kecamatanOnly'){
          this.kode_provinsi = split[0]
          this.kode_kabkota = split[1]  
          this.kode_kecamatan = split[2]  
          this.getWilayah({ bagian: 'kabkota', KodeWilayah: `${this.kode_provinsi}` })
        }else if(this.bagian === 'kelurahanOnly'){
          this.kode_provinsi = split[0]
          this.kode_kabkota = split[1]  
          this.kode_kecamatan = split[2]  
          this.kode_kelurahan = split[3]  
          this.getWilayah({ bagian: 'kabkota', KodeWilayah: `${this.kode_provinsi}` })
          this.getWilayah({ bagian: 'kecamatan', KodeWilayah: `${this.kode_provinsi}.${this.kode_kabkota}` })
        }
        console.log(item);
        this.inputDataDaerah = {
          idLocation: item?.idLocation,
          kode: item?.kode,
          kode_temp: item?.kode,
          kategori: item?.kategori,
          provinsi: this.bagian === 'provinsiOnly' ? item?.provinsi : this.kode_provinsi,
          kabkota: this.bagian === 'kabkotaOnly' ? item?.kabkota : this.bagian === 'kecamatanOnly' || this.bagian === 'kelurahanOnly' ? this.kode_kabkota : null,
          kecamatan: this.bagian === 'kecamatanOnly' ? item?.kecamatan : this.bagian === 'kelurahanOnly' ? this.kode_kecamatan : null,
          kelurahan: this.bagian === 'kelurahanOnly' ? item?.kelurahan : null,
          kodePos: item.kodePos === null ? '' : item?.kodePos,
        }
      }
      this.DialogDaerah = true
    },
    clearData(){
      this.inputDataDaerah = {
        kode: '',
        provinsi: null,
        kabkota: null,
        kecamatan: null,
        kelurahan: null,
        kodePos: '',
      }
      this.kode_provinsi = ''
      this.kode_kabkota = ''
      this.kode_kecamatan = ''
      this.kode_kelurahan = ''
    },
    wilayah(kondisi, e){
			if(kondisi === 'provinsi'){
				if(e){
					this.getWilayah({ bagian: 'kabkota', KodeWilayah: e })
          if(this.bagian === 'kecamatanOnly'){
            this.inputDataDaerah.kabkota = null
          }else if(this.bagian === 'kelurahanOnly'){
            this.inputDataDaerah.kabkota = null
            this.inputDataDaerah.kecamatan = null
          }
				}else{
          if(this.bagian === 'kecamatanOnly'){
            this.inputDataDaerah.kabkota = null
          }else if(this.bagian === 'kelurahanOnly'){
            this.inputDataDaerah.kabkota = null
            this.inputDataDaerah.kecamatan = null
          }
        }
			}else if(kondisi === 'kabkota'){
				if(e){
					this.getWilayah({ bagian: 'kecamatan', KodeWilayah: `${this.kode_provinsi}.${e}` })
					if(this.bagian === 'kelurahanOnly'){
            this.inputDataDaerah.kecamatan = null
          }
				}else{
					if(this.bagian === 'kelurahanOnly'){
            this.inputDataDaerah.kecamatan = null
          }
				}
			}
		},
		clickrow(event, data) {
      const index = this.$data.expanded.find(i => i === data?.item?.raw?.kode);
      if(typeof index === 'undefined') return this.$data.expanded = [];
      this.$data.expanded.splice(0, 1)
      this.$data.expanded.push(data?.item?.raw?.kode);
			this.inputForm = false
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
.titik {
  border-radius: 50%;
  background-color: black;
  width: 10px;
  height: 10px;
  margin: 0px 5px 2px 5px;
}
</style>