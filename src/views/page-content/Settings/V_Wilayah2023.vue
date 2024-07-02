<template>
  <div>
		<h1 class="subheading grey--text text-decoration-underline">Panel Wilayah</h1>
    <v-container fluid>
      <v-row>
        <v-col
          v-for="hasil in CountWilayah"
          :key="hasil.name"
          cols="12"
          lg="3"
        >
          <v-card color="white" style="border: 2px solid #000;">
            <v-sheet color="green" class="sheetData" elevation="2">
              <v-icon icon="mdi mdi-map" size="large" />
            </v-sheet>
            <v-card-text class="d-flex flex-column justify-center align-center">
              <v-card-title style="font-weight: bold; font-size: 10pt;">{{ `${hasil.jumlah} ${hasil.name}` }}</v-card-title>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
		<v-data-table
			loading-text="Sedang memuat... Harap tunggu"
			no-data-text="Tidak ada data yang tersedia"
			no-results-text="Tidak ada catatan yang cocok ditemukan"
			:headers="headers"
			:loading="loadingtable"
			:items="DataWilayah"
			expand-on-click
			item-value="idLocation"
			density="comfortable"
			hide-default-footer
			hide-default-header
			class="elavation-3 rounded"
			:items-per-page="itemsPerPage"
			@page-count="pageCount = $event"
			@click:row="clickrow"
			v-model:expanded="expanded"
		>
			<!-- header -->
			<template #headers="{ columns }">
				<tr>
					<td v-for="header in columns" :key="header.title" class="tableHeader">{{ header.title.toUpperCase() }}</td>
				</tr>
			</template>
      <template #loader>
        <LoaderDataTables />
      </template>
			<!-- <template #[`item.number`]="{ item }">
				{{ page > 1 ? ((page - 1)*limit) + item.index + 1 : item.index + 1 }}
			</template> -->
			<template #[`item.namaKelDes`]="{ item }">
				<span v-html="`${item.raw.jenisKelDes} ${item.raw.namaKelDes}`"></span>
			</template>
      <template #[`item.statusAktif`]="{ item }">
        <v-icon size="small" v-if="item.raw.statusAktif == true" color="green" icon="mdi mdi-check" />
        <v-icon size="small" v-else-if="item.raw.statusAktif == false" color="red" icon="mdi mdi-close" />
      </template>
			<template #expanded-row="{ columns, item }">
				<tr>
					<td :colspan="columns.length">
						<Button 
							color-button="#0bd369"
							icon-prepend-button="mdi mdi-pencil"
							nama-button="Ubah"
							@proses="bukaDialog(item.raw, 1)"
						/>
						<Button 
							color-button="#0bd369"
							:icon-prepend-button="item.raw.statusAktif === false ? 'mdi mdi-eye' : 'mdi mdi-eye-off'"
							:nama-button="item.raw.statusAktif === false ? 'Active' : 'Non Active'"
							@proses="postRecord2(item.raw, 'STATUSRECORD', !item.raw.statusAktif)"
						/>
					</td>
				</tr>
			</template>
			<template #top>
				<v-row no-gutters class="pa-2">
					<v-col cols="12" md="6">
						<Button 
							color-button="light-blue darken-3"
							icon-prepend-button="mdi mdi-plus-thick"
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
									label-tf="Pencarian..."
									:clearable-tf="true"
									@click:clear="() => {
										page = 1
										getDaerah({page: 1, limit: limit, keyword: ''})
									}"
									@keyup.enter="() => {
										page = 1
										getDaerah({page: 1, limit: limit, keyword: searchData})
									}"
								/>
							</v-col>
							<v-col cols="12" md="3" class="pl-2 d-flex justify-end align-center">
								<Autocomplete
									v-model="page"
									:data-a="pageOptions"
									label-a="Page"
									:disabled-a="DataWilayah.length ? false : true"
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
								:disabled-a="DataWilayah.length ? false : true"
							/>
							<Button
								variant="plain"
								size-button="large"
								model-button="comfortable"
								color-button="#ffffff"
								icon-button="mdi mdi-arrow-left-circle-outline"
								:disabled-button="DataWilayah.length ? pageSummary.page != 1 ? false : true : true"
								@proses="() => { page = pageSummary.page - 1 }"
							/>
							<Button
								variant="plain"
								size-button="large"
								model-button="comfortable"
								color-button="#ffffff"
								icon-button="mdi mdi-arrow-right-circle-outline"
								:disabled-button="DataWilayah.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
								@proses="() => { page = pageSummary.page + 1 }"
							/>
						</div>
					</v-col>
				</v-row>
			</template>
		</v-data-table>
		<v-dialog
      v-model="DialogWilayah"
			scrollable
			persistent
			transition="dialog-bottom-transition"
			width="auto"
    >
			<v-card color="background-dialog-card">
				<v-toolbar color="surface">
					<v-toolbar-title>{{editedIndex == 0 ? 'Tambah' : editedIndex == 1 ? 'Ubah' : 'View'}} Data Wilayah</v-toolbar-title>
					<v-spacer />
					<v-toolbar-items>
						<Button
							variant="plain"
							color-button="#ffffff"
							icon-button="mdi mdi-close"
							model-button="comfortable"
							size-button="large"
							@proses="tutupDialog()"
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
							Kode Wilayah
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="inputWilayah.kode"
								label-tf="Kode Wilayah"
								:clearable-tf="true"
							/>
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
              <Autocomplete
                v-model="inputWilayah.namaProv"
                :data-a="optionsProvinsi"
                item-title="text"
                item-value="value"
                label-a="Provinsi"
                :clearable-a="true"
                @ubah="wilayah('provinsi', $event)"
              />
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
              <v-row no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="d-flex align-center font-weight-bold"
                >
                  <TextField
                    v-model="inputWilayah.jenisKabKota"
                    label-tf="Jenis Kab / Kota"
                    :clearable-tf="true"
                    :disabled-tf="inputWilayah.namaProv ? false : true"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pl-2"
                >
                  <Autocomplete
                    v-model="inputWilayah.namaKabKota"
                    :data-a="optionsKabKota"
                    item-title="text"
                    item-value="value"
                    label-a="Kabupaten / Kota"
                    :clearable-a="true"
                    :disabled-a="inputWilayah.namaProv ? false : true"
                    @ubah="wilayah('kabkota', $event)"
                  />
                </v-col>
              </v-row>
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
              <Autocomplete
                v-model="inputWilayah.namaKec"
                :data-a="optionsKecamatan"
                item-title="text"
                item-value="value"
                label-a="Kecamatan"
                :clearable-a="true"
                :disabled-a="inputWilayah.namaKabKota ? false : true"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Kelurahan / Desa
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <v-row no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="d-flex align-center font-weight-bold"
                >
                  <TextField
                    v-model="inputWilayah.jenisKelDes"
                    label-tf="Jenis Kel / Desa"
                    :clearable-tf="true"
                    :disabled-tf="inputWilayah.namaKec ? false : true"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pl-2"
                >
                  <TextField
                    v-model="inputWilayah.namaKelDes"
                    label-tf="Kelurahan / Desa"
                    :clearable-tf="true"
                    :disabled-tf="inputWilayah.namaKec ? false : true"
                  />
                </v-col>
              </v-row>
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
              <TextField
                v-model="inputWilayah.kodePos"
                label-tf="Kode Pos"
                :clearable-tf="true"
                :disabled-tf="inputWilayah.namaKec ? false : true"
                @keypress="onlyNumber($event, 5, inputWilayah.kodePos)"
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
								v-if="editedIndex == 0"
								color-button="black"
								nama-button="Simpan Data"
								:disabled-button="kondisiTombol"
								@proses="postRecord('ADD')"
							/>
							<Button 
								v-if="editedIndex == 1"
								color-button="black"
								nama-button="Ubah Data"
								:disabled-button="kondisiTombol"
								@proses="postRecord('EDIT')"
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
		DataWilayah: [],
		CountWilayah: [
      { name: 'Provinsi', jumlah: 0 },
      { name: 'Kota', jumlah: 0 },
      { name: 'Kabupaten', jumlah: 0 },
      { name: 'Kabupaten / Kota', jumlah: 0 },
      { name: 'Kecamatan', jumlah: 0 },
      { name: 'Kelurahan', jumlah: 0 },
      { name: 'Desa', jumlah: 0 },
      { name: 'Kelurahan / Desa', jumlah: 0 },
    ],
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
      // { title: "No", key: "number", sortable: false, width: "7%" },
      { title: "#", key: "data-table-expand", sortable: false, width: "5%" },
      { title: "KODE WILAYAH", key: "kode", sortable: false },
      { title: "PROVINSI", key: "namaProv", sortable: false },
      { title: "KABUPATEN / KOTA", key: "namaKabKota", sortable: false },
      { title: "KECAMATAN", key: "namaKec", sortable: false },
      { title: "DESA / KELURAHAN", key: "namaKelDes", sortable: false },
      { title: "KODE POS", key: "kodePos", sortable: false },
      { title: "STATUS", key: "statusAktif", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		DialogWilayah: false,
		kondisiTombol: true,
		editedIndex: 0,
		inputWilayah: {
			idLocation: '',
			namaProv: null,
			namaKabKota: null,
			namaKec: null,
			namaKelDes: null,
			kodePos: '',
			jenisKabKota: '',
			jenisKelDes: '',
		},

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
          value: `${x.kode} - ${x.nama}`,
          text: `${x.kode} - ${x.nama}`
        }
      })
      return prov
    },
    optionsKabKota(){
      let kabkota = this.KabKotaOptions.map(x => {
        return {
          value: `${x.kode} - ${x.nama}`,
          text: `${x.kode} - ${x.nama}`
        }
      })
      return kabkota
    },
    optionsKecamatan(){
      let kecamatan = this.KecamatanOptions.map(x => {
        return {
          value: `${x.kode} - ${x.nama}`,
          text: `${x.kode} - ${x.nama}`
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
				this.DataWilayah = value.records
        this.CountWilayah = [
          { name: 'Provinsi', jumlah: value.countWilayah.provinsi },
          { name: 'Kota', jumlah: value.countWilayah.kota },
          { name: 'Kabupaten', jumlah: value.countWilayah.kabupaten },
          { name: 'Kabupaten / Kota', jumlah: value.countWilayah.kabkota },
          { name: 'Kecamatan', jumlah: value.countWilayah.kecamatan },
          { name: 'Kelurahan', jumlah: value.countWilayah.kelurahan },
          { name: 'Desa', jumlah: value.countWilayah.desa },
          { name: 'Kelurahan / Desa', jumlah: value.countWilayah.keldes },
        ]
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
    inputWilayah: {
      deep: true,
      handler(value){
        if(value.kode != '' && value.namaProv != null && value.namaKabKota != null && value.namaKec != null && value.namaKelDes != null &&
          value.kodePos != '' && value.jenisKabKota != '' && value.jenisKelDes != ''){
          this.kondisiTombol = false
        }else{
          this.kondisiTombol = true
        }
      }
    },
		page: {
			deep: true,
			handler(value) {
				if(value){
					this.getDaerah({page: value, limit: this.limit, keyword: this.searchData})
				}
			}
		},
		limit: {
			deep: true,
			handler(value) {
				this.page = 1
				this.getDaerah({page: 1, limit: value, keyword: this.searchData})
			}
		},
  },
	mounted() {
		this.getDaerah({page: 1, limit: this.limit, keyword: this.searchData});
	},
	methods: {
		...mapActions({
			getDaerah: 'setting/getDaerah',	
      getWilayah2023: 'setting/getWilayah2023',	
		}),
		postRecord(jenis) {
      let bodyData = {
        jenis: jenis,
        idLocation: jenis === 'ADD' ? '' : this.inputWilayah.idLocation,
        kode: this.inputWilayah.kode,
        namaProv: this.inputWilayah.namaProv.split(' - ')[1],
        namaKabKota: this.inputWilayah.namaKabKota.split(' - ')[1],
        namaKec: this.inputWilayah.namaKec.split(' - ')[1],
        namaKelDes: this.inputWilayah.namaKelDes,
        kodePos: this.inputWilayah.kodePos,
        jenisKabKota: this.inputWilayah.jenisKabKota,
        jenisKelDes: this.inputWilayah.jenisKelDes,
      }
      this.$store.dispatch('setting/postDaerah', bodyData)
      .then((res) => {
        this.DialogWilayah = false
        this.getDaerah({page: 1, limit: this.limit, keyword: this.searchData});
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
		postRecord2(item, jenis, status) {
      let bodyData = {
        jenis: jenis,
        idLocation: item?.idLocation,
        statusAktif: status,
      }
      this.$store.dispatch('setting/postDaerah', bodyData)
      .then((res) => {
        this.DialogWilayah = false
        this.getDaerah({page: 1, limit: this.limit, keyword: this.searchData});
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
		bukaDialog(item, index){
      this.editedIndex = index
      this.getWilayah2023({ bagian: 'provinsi', KodeWilayah: null })
      if(index === 0){
        this.inputWilayah.idLocation = ''
        this.inputWilayah.kode = ''
        this.inputWilayah.namaProv = null
        this.inputWilayah.namaKabKota = null
        this.inputWilayah.namaKec = null
        this.inputWilayah.namaKelDes = null
        this.inputWilayah.kodePos = ''
        this.inputWilayah.jenisKabKota = ''
        this.inputWilayah.jenisKelDes = ''
      }else{
				this.inputWilayah.idLocation = item.idLocation
        this.inputWilayah.kode = item.kode
        this.inputWilayah.namaProv = item.kodeProv
        this.inputWilayah.namaKabKota = item.kodeKabKota
        this.inputWilayah.namaKec = item.kodeKec
        this.inputWilayah.namaKelDes = item.namaKelDes
        this.inputWilayah.kodePos = item.kodePos
        this.inputWilayah.jenisKabKota = item.jenisKabKota
        this.inputWilayah.jenisKelDes = item.jenisKelDes
      }
      this.DialogWilayah = true
    },
    wilayah(kondisi, e){
			if(kondisi === 'provinsi'){
        if(e){
          this.getWilayah2023({ bagian: 'kabkota', KodeWilayah: e.split(' - ')[0] })
          this.inputWilayah.namaKabKota = null
          this.inputWilayah.namaKec = null
        }else{
          this.inputWilayah.namaKabKota = null
          this.inputWilayah.namaKec = null
        }
			}else if(kondisi === 'kabkota'){
        if(e){
          this.getWilayah2023({ bagian: 'kecamatan', KodeWilayah: e.split(' - ')[0] })
          this.inputWilayah.namaKec = null
				}else{
          this.inputWilayah.namaKec = null
				}
			}
		},
		tutupDialog(){
			this.inputWilayah.idLocation = ''
			this.inputWilayah.namaProv = null
			this.inputWilayah.namaKabKota = null
			this.inputWilayah.namaKec = null
			this.inputWilayah.namaKelDes = null
			this.inputWilayah.kodePos = ''
			this.inputWilayah.jenisKabKota = ''
			this.inputWilayah.jenisKelDes = ''
			this.DialogWilayah = false
		},
		clickrow(event, data) {
      const index = this.$data.expanded.find(i => i === data?.item?.raw?.idLocation);
      if(typeof index === 'undefined') return this.$data.expanded = [];
      this.$data.expanded.splice(0, 1)
      this.$data.expanded.push(data?.item?.raw?.idLocation);
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