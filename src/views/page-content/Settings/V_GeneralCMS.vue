<template>
  <div>
		<h1 class="subheading grey--text">Panel General CMS</h1>
    <v-row>
      <v-col cols="12" md="12" class="text-right">
				<v-menu
					open-on-hover
					rounded="t-xs b-lg"
					offset-y
					transition="slide-y-transition"
					bottom
				>
					<template v-slot:activator="{ props }">
						<Button
							v-bind="props"
							color-button="#0bd369"
							nama-button="Upload Berkas"
						/>
					</template>

					<v-list
						:lines="false"
						density="comfortable"
						nav
						dense
						class="listData"
					>
						<v-list-item
							@click="() => {
								this.DialogUploadBerkas = true
								this.jenisUpload = 'Gambar'
							}"
							class="SelectedMenu"
							active-class="SelectedMenu-active"
						>
							<template v-slot:append>
								<v-icon size="middle" icon="mdi mdi-upload" color="icon-white" />
							</template>
							<v-list-item-title>
								<span class="menufont">Gambar</span>
							</v-list-item-title>
						</v-list-item>
						<v-list-item
							@click="() => {
								this.DialogUploadBerkas = true
								this.jenisUpload = 'File'
							}"
							class="SelectedMenu"
							active-class="SelectedMenu-active"
						>
							<template v-slot:append>
								<v-icon size="middle" icon="mdi mdi-upload" color="icon-white" />
							</template>
							<v-list-item-title>
								<span class="menufont">File</span>
							</v-list-item-title>
						</v-list-item>
						<v-list-item
							@click="openDialogDataBerkas()"
							class="SelectedMenu"
							active-class="SelectedMenu-active"
						>
							<template v-slot:append>
								<v-icon size="middle" icon="mdi mdi-view-list" color="icon-white" />
							</template>
							<v-list-item-title>
								<span class="menufont">Data Berkas</span>
							</v-list-item-title>
						</v-list-item>
					</v-list>
				</v-menu>
				<Button
					color-button="light-blue darken-3"
					nama-button="Simpan Data"
					@proses="SimpanGeneranCMS()"
				/>
      </v-col>
    </v-row>
		<v-card class="mt-2 mb-2 pa-2 ma-1">
      <h2><u>Logo Sekolah</u></h2>
			<div class="mt-4 d-flex flex-column justify-space-between align-center">
				<div class="avatar" @click="$refs.logoSekolah.click()">
					<span class="tulisan">
						<v-icon color="white" icon="mdi mdi-camera-account" />&nbsp;Ubah Logo Sekolah
					</span>
					<v-img :src="inputData.logo" />
				</div>
				<input 
					ref="logoSekolah"
					:key="componentKey"
					type="file"
					accept=".png"
					style="display: none"
					@change="uploadLogoSekolah($event)"
				>
			</div>
		</v-card>
    <v-card class="mt-2 mb-2 pa-2 ma-1">
      <h2><u>Default Settings</u></h2>
      <v-row no-gutters>
        <v-col cols="12" md="6" class="pa-4">
          <TextField
						v-model="inputData.namasekolah"
						label-tf="Nama Sekolah"
						:clearable-tf="true"
					/>
        </v-col>
        <v-col cols="12" md="6" class="pa-4">
          <Autocomplete
						v-model="inputData.statussekolah"
						:data-a="statusSekolahOptions"
						item-title="label"
						item-value="kode"
						label-a="Status Sekolah"
						:clearable-a="true"
					/>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" md="6" class="pa-4">
          <Autocomplete
						v-model="inputData.tahunpelajaran"
						:data-a="tahunOptions"
						label-a="Tahun Pelajaran"
						:clearable-a="true"
					/>
        </v-col>
        <v-col cols="12" md="6" class="pa-4">
					<Autocomplete
						v-model="inputData.pdfraport"
						:data-a="raportOptions"
						item-title="label"
						item-value="value"
						label-a="Raport PDF"
						:clearable-a="true"
					/>
				</v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" md="6" class="pa-4">
          <Autocomplete
						v-model="inputData.jenisraport"
						:data-a="jenisRaportOptions"
						item-title="label"
						item-value="value"
						label-a="Jenis Raport"
						:clearable-a="true"
					/>
        </v-col>
        <v-col cols="12" md="6" class="pa-4">
					<Autocomplete
						v-model="inputData.semester"
						:data-a="semesterOptions"
						item-title="label"
						item-value="value"
						label-a="Semester"
						:clearable-a="true"
					/>
				</v-col>
      </v-row>
			<v-row no-gutters>
        <v-col cols="12" md="6" class="pa-4">
          <TextField
						v-model="inputData.kkm"
						label-tf="KKM Default"
						:clearable-tf="true"
					/>
        </v-col>
        <v-col cols="12" md="6" class="pa-4">
          <!--  kosong-->
        </v-col>
      </v-row>
    </v-card>
    <v-card class="mt-2 mb-2 pa-2 ma-1">
      <h2><u>Address Settings</u></h2>
      <v-row no-gutters>
        <v-col cols="12" md="6" class="pa-4">
          <TextField
						value="Indonesia"
						:disabled-tf="true"
					/>
        </v-col>
        <v-col cols="12" md="6" class="pa-4">
          <Autocomplete
						v-model="inputData.provinsi"
						:data-a="ProvinsiOptions"
						item-title="nama"
						item-value="kode"
						label-a="Provinsi"
						:clearable-a="true"
						@ubah="wilayah('provinsi', $event)"
					/>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" md="6" class="pa-4">
          <Autocomplete
						v-model="inputData.kabupatenkota"
						:data-a="KabKotaOptions"
						item-title="nama"
						item-value="kode"
						label-a="Kabupaten / Kota"
						:clearable-a="true"
						:disabled-a="inputData.provinsi ? false : true"
						@ubah="wilayah('kabkota', $event)"
					/>
        </v-col>
        <v-col cols="12" md="6" class="pa-4">
          <Autocomplete
						v-model="inputData.kecamatan"
						:data-a="KecamatanOptions"
						item-title="nama"
						item-value="kode"
						label-a="Kecamatan"
						:clearable-a="true"
						:disabled-a="inputData.kabupatenkota ? false : true"
						@ubah="wilayah('kecamatan', $event)"
					/>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" md="6" class="pa-4">
          <Autocomplete
						v-model="inputData.kelurahan"
						:data-a="KelurahanOptions"
						item-title="nama"
						item-value="kode"
						label-a="Kelurahan"
						:clearable-a="true"
						:disabled-a="inputData.kecamatan ? false : true"
						@ubah="wilayah('kelurahan', $event)"
					/>
        </v-col>
        <v-col cols="12" md="6" class="pa-4">
          <TextField
            v-model="inputData.kodepos"
						label-tf="Kode Pos"
						:disabled-tf="true"
					/>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" md="12" class="pa-4">
          <TextArea
						v-model="inputData.alamat"
						label-ta="Alamat"
						rows="4"
						:clearable-ta="true"
					/>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" md="4" class="pa-4">
          <TextField
            v-model="inputData.telepon"
						label-tf="Telepon"
						:clearable-tf="true"
					/>
        </v-col>
        <v-col cols="12" md="4" class="pa-4">
          <TextField
            v-model="inputData.latitude"
						label-tf="Latitude"
						:clearable-tf="true"
					/>
        </v-col>
        <v-col cols="12" md="4" class="pa-4">
          <TextField
            v-model="inputData.longitude"
						label-tf="Longitude"
						:clearable-tf="true"
					/>
        </v-col>
      </v-row>
    </v-card>
		<v-dialog
      v-model="DialogUploadBerkas"
      fullscreen
      scrollable
      hide-overlay
      transition="dialog-bottom-transition"
    >
			<v-card color="background-dialog-card">
				<v-toolbar color="surface">
					<v-toolbar-title>Upload Berkas - {{ jenisUpload }}</v-toolbar-title>
					<v-spacer />
					<v-toolbar-items>
						<Button
							variant="plain"
							color-button="#ffffff"
							icon-button="mdi mdi-close"
							model-button="comfortable"
							size-button="large"
							@proses="() => {
								this.DialogUploadBerkas = false
								this.MultipleBerkas = []
								this.imageMultiple = []
								this.fileMultiple = []
								this.jenisUpload = ''
							}"
						/>
					</v-toolbar-items>
				</v-toolbar>
				<v-card-text class="pt-4 ScrollFullscreen">
          <div>
						<v-row no-gutters>
							<v-col
								cols="12"
								class="pt-2 d-flex align-center"
							>
								<TextField
									v-model="MultipleBerkas"
									style="display: none"
								/>
								<input 
									ref="inputMultipleFile"
									:key="componentKey"
									type="file"
									multiple
									style="display: none"
									:accept="`${jenisUpload === 'Gambar' ? 'image/x-png,image/jpg,image/jpeg' : '.xlsx,.xls,.doc,.docx,.txt,.pdf'}`"
									@change="addFiles($event)"
								>
								<Button
									color-button="light-blue darken-3"
									icon-button="mdi mdi-upload"
									nama-button="Upload Berkas"
									@proses="() => { $refs.inputMultipleFile.click() }"
								/>
							</v-col>  
						</v-row>
						<v-container fluid v-if="jenisUpload === 'Gambar'">
							<v-row>
								<v-col
									class="d-flex flex-column justify-space-between align-center"
									v-for="(file,f) in MultipleBerkas"
									:key="f"
									cols="3"
								>
									<v-card color="grey" class="pa-2 kotakGambar">
										<div class="text-right"><v-icon size="large" color="black" icon="mdi mdi-delete" @click="HapusMultiple(f)" /></div>
										<img :ref="'file'" :src="imageMultiple[f].url" :title="file.name" class="responsiveImage"/>
										<TextField
											v-model="imageMultiple[f].title"
											label-tf="Title"
											class="mt-1"
											:clearable-tf="true"
										/>
									</v-card>
								</v-col>
							</v-row>
						</v-container>
						<div v-if="jenisUpload === 'File'">
							<div v-for="(file,f) in fileMultiple" :key="f" class="wadahFile">
								<div class="kotakFile">
									<v-icon v-if="file.ext === 'docx'" class="iconFile" size="x-large" icon="mdi mdi-file-word-box" />
									<v-icon v-if="file.ext === 'xlsx'" class="iconFile" size="x-large" icon="mdi mdi-file-excel-box" />
									<v-icon v-if="file.ext === 'pdf'" class="iconFile" size="x-large" icon="mdi mdi-file-pdf-box" />
									<v-icon v-if="file.ext === 'txt'" class="iconFile" size="x-large" icon="mdi mdi-file-document" />
									<span class="textFile">{{ file.name }}</span>
									<span class="textFile" style="float: right; margin-right: 2px;">&nbsp;<v-icon size="large" color="black" icon="mdi mdi-delete" @click="HapusMultiple(f)" /></span>
								</div>
								<v-divider :thickness="2" color="black" class="border-opacity-75" />
								<TextField
									v-model="fileMultiple[f].title"
									label-tf="Title"
									class="ma-1"
									:clearable-tf="true"
								/>
							</div>
						</div>
          </div>
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
								nama-button="Batal"
								:disabled-button="MultipleBerkas.length ? false : true"
								@proses="() => { this.imageMultiple = []; this.fileMultiple = []; this.MultipleBerkas = []; }"
							/>
							<Button
								color-button="black"
								nama-button="Upload Berkas"
								:disabled-button="MultipleBerkas.length ? false : true"
								@proses="SimpanMultiple()"
							/>
						</v-col>
					</v-row>
				</v-card-actions>
      </v-card>
    </v-dialog>
		<v-dialog
      v-model="DialogBerkas"
      transition="dialog-bottom-transition"
      persistent
			scrollable
			width="auto"
    >
			<v-card color="background-dialog-card">
				<v-toolbar color="surface">
					<v-toolbar-title>Data - Data Berkas</v-toolbar-title>
					<v-spacer />
					<v-toolbar-items>
						<Button
							variant="plain"
							color-button="#ffffff"
							icon-button="mdi mdi-close"
							model-button="comfortable"
							size-button="large"
							@proses="() => { DialogBerkas = false; }"
						/>
					</v-toolbar-items>
				</v-toolbar>
				<v-card-text class="pt-4 v-dialog--custom">
          <v-row no-gutters class="pa-2">
						<v-col cols="12" md="6" />
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
											getDataBerkas({page: 1, limit: limit, keyword: ''})
										}"
										@keyup.enter="() => {
											page = 1
											getDataBerkas({page: 1, limit: limit, keyword: searchData})
										}"
									/>
								</v-col>
								<v-col cols="12" md="3" class="pl-2 d-flex justify-end align-center">
									<Autocomplete
										v-model="page"
										:data-a="pageOptions"
										label-a="Page"
										:disabled-a="dataBerkas.length ? false : true"
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
							:items="dataBerkas"
							item-value="idBerkas"
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
							<template #[`item.title`]="{ item }">
								<div class="kotakFile">
									<img v-if="item.raw.type === 'Gambar'" :ref="'file'" :src="item.raw.file" :title="item.raw.title" class="iconFile"/>
									<v-icon v-if="item.raw.type === 'File' && item.raw.ext === 'docx'" class="iconFile" size="large" icon="mdi mdi-file-word-box" />
									<v-icon v-if="item.raw.type === 'File' && item.raw.ext === 'xlsx'" class="iconFile" size="large" icon="mdi mdi-file-excel-box" />
									<v-icon v-if="item.raw.type === 'File' && item.raw.ext === 'pdf'" class="iconFile" size="large" icon="mdi mdi-file-pdf-box" />
									<v-icon v-if="item.raw.type === 'File' && item.raw.ext === 'txt'" class="iconFile" size="large" icon="mdi mdi-file-document" />
									<span class="textFile">{{ `${item.raw.title}.${item.raw.ext}` }}</span>
								</div>
							</template>
							<template #[`item.opsi`]="{ item }">
								<v-switch color="white" v-model="item.raw.statusAktif" hide-details @click="postRecord(item.raw.idBerkas, !item.raw.statusAktif)" />
							</template>
							<template #[`item.statusAktif`]="{ item }">
								<v-icon size="small" v-if="item.raw.statusAktif == true" color="green" icon="mdi mdi-check" />
								<v-icon size="small" v-else-if="item.raw.statusAktif == false" color="red" icon="mdi mdi-close" />
							</template>
							<template #bottom>
								<v-divider :thickness="2" class="border-opacity-100" color="white" />
								<v-row no-gutters>
									<v-col cols="9" class="pa-2 d-flex justify-start align-center">
										<span>Halaman <strong>{{ pageSummary.page ? pageSummary.page : 0 }}</strong> dari Total Halaman <strong>{{ pageSummary.totalPages ? pageSummary.totalPages : 0 }}</strong> (Records {{ pageSummary.total ? pageSummary.total : 0 }})</span>
									</v-col>
									<v-col cols="3" class="pa-2 text-right">
										<div class="d-flex justify-start align-center">
											<Autocomplete
												v-model="limit"
												pilihan-a="select"
												:data-a="limitPage"
												label-a="Limit"
												:disabled-a="dataBerkas.length ? false : true"
											/>
											<Button
												variant="plain"
												size-button="large"
												model-button="comfortable"
												color-button="#ffffff"
												icon-button="mdi mdi-arrow-left-circle-outline"
												:disabled-button="dataBerkas.length ? pageSummary.page != 1 ? false : true : true"
												@proses="() => { page = pageSummary.page - 1 }"
											/>
											<Button
												variant="plain"
												size-button="large"
												model-button="comfortable"
												color-button="#ffffff"
												icon-button="mdi mdi-arrow-right-circle-outline"
												:disabled-button="dataBerkas.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
												@proses="() => { page = pageSummary.page + 1 }"
											/>
										</div>
									</v-col>
								</v-row>
							</template>
						</v-data-table>
					</div>
        </v-card-text>
				<v-divider />
        <v-card-actions />
      </v-card>
    </v-dialog>
		<v-dialog
      v-model="dialogCrop"
      width="700px"
      scrollable
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card color="background-dialog-card">
        <v-card-text class="pt-4">
          <Cropper
            ref="cropper"
            class="cropper"
            :src="image.src"
            :stencil-component="RectangleStencil"
          />
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
                color-button="black"
                nama-button="Tutup"
                @proses="tutupDialogCrop()"
              />
              <Button
                color-button="black"
                nama-button="Crop Lampiran"
                @proses="crop()"
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
        :notifikasi-kode="notifikasiKode"
        :notifikasi-text="notifikasiText"
        :notifikasi-button="notifikasiButton"
				@proses="goToProses"
        @cancel="dialogNotifikasi = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import { useMeta } from 'vue-meta'
import { mapActions, mapState, mapGetters } from "vuex";
import PopUpNotifikasiVue from "../../Layout/PopUpNotifikasi.vue";
import { Cropper, RectangleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';

function getMimeType(file, fallback = null) {
	const byteArray = (new Uint8Array(file)).subarray(0, 4);
  let header = '';
  for (let i = 0; i < byteArray.length; i++) {
      header += byteArray[i].toString(16);
  }
	switch (header) {
    case "89504e47":
      return "image/png";
      case "47494638":
        return "image/gif";
        case "ffd8ffe0":
          case "ffd8ffe1":
    case "ffd8ffe2":
      case "ffd8ffe3":
        case "ffd8ffe8":
          return "image/jpeg";
    default:
      return fallback;
    }
  }

export default {
  name: 'GeneralCMS',
	components: { PopUpNotifikasiVue, Cropper, RectangleStencil },
  data: () => ({
    statusSekolahOptions: [
			{ label: 'Negeri', kode: 1 },
			{ label: 'Swasta', kode: 2 },
		],
    raportOptions: [
			{ label: 'False', value: 0 },
			{ label: 'True', value: 1 },
		],
    semesterOptions: [
			{ label: 'Genap', value: 0 },
			{ label: 'Ganjil', value: 1 },
		],
    jenisRaportOptions: [
			{ label: 'PENILAIAN AKHIR TAHUN (PAT)', value: 'PAT' },
			{ label: 'PENILAIAN AKHIR SEMESTER (PAS)', value: 'PAS' },
			{ label: 'PENILAIAN TENGAH SEMESTER (PTS)', value: 'PTS' },
		],
    inputData: {
      namasekolah: '',
      statussekolah: null,
      telepon: '',
      alamat: '',
      provinsi: null,
      kabupatenkota: null,
      kecamatan: null,
      kelurahan: null,
      kodepos: '',
      latitude: '',
      longitude: '',
      tahunpelajaran: null,
      pdfraport: null,
      jenisraport: null,
      semester: null,
      kkm: '',
      logo: '',
    },
    tahunOptions: [],
    DialogUploadBerkas: false,
    DialogBerkas: false,
    dialogCrop: false,
		dataBerkas: [],
		imageMultiple: [],
		fileMultiple: [],
		MultipleBerkas: [],
		componentKey: 0,
		jenisUpload: '',
		dataNotifikasi: [],
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
      { title: "No", key: "number", sortable: false, width: "7%" },
      { title: "FILE NAME", key: "title", sortable: false },
      { title: "STATUS", key: "statusAktif", sortable: false },
      { title: "OPSI", key: "opsi", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
    API_URL: process.env.VUE_APP_BASE_URL_VIEW,
		image: {
      src: null,
      type: null,
    },
    FileLogoSekolah: '',
    logoSekolah: '',

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
	setup() {
    useMeta({
      title: "Settings (General CMS) - MTsS. SIROJUL ATHFAL",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
		return { RectangleStencil }
  },
  computed: {
		...mapGetters({
      cmssettings: 'setting/cmssettings',
			berkasAll: 'setting/berkasAll',
    }),
		...mapState({
			loadingtable: store => store.setting.loadingtable,
			ProvinsiOptions: store => store.setting.ProvinsiOptions,
			KabKotaOptions: store => store.setting.KabKotaOptions,
			KecamatanOptions: store => store.setting.KecamatanOptions,
			KelurahanOptions: store => store.setting.KelurahanOptions,
		}),
  },
	watch: {
		berkasAll: {
      deep: true,
      handler(value){
        this.pageOptions = []
        this.dataBerkas = value.records
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
    cmssettings:{
			deep: true,
			handler(value) {
				const d = new Date();
        for (let tahun = 2020; tahun <= d.getFullYear(); tahun++) {
          let tulisan = `${tahun}/${tahun+1}`
          this.tahunOptions.push(tulisan.toString())
        }
				this.inputData = {
					namasekolah: value.namasekolah ? value.namasekolah : null,
					statussekolah: value.statussekolah ? value.statussekolah.value : null,
					telepon: value.telepon ? value.telepon : null,
					alamat: value.alamat ? value.alamat : null,
					provinsi: value.provinsi ? value.provinsi.value : null,
					kabupatenkota: value.kabupatenkota ? value.kabupatenkota.value : null,
					kecamatan: value.kecamatan ? value.kecamatan.value : null,
					kelurahan: value.kelurahan ? value.kelurahan.value : null,
					kodepos: value.kodepos ? value.kodepos : null,
					latitude: value.latitude ? value.latitude : null,
					longitude: value.longitude ? value.longitude : null,
					tahunpelajaran: value.tahunpelajaran ? value.tahunpelajaran : null,
					pdfraport: value.pdfraport ? value.pdfraport.value : null,
					jenisraport: value.jenisraport ? value.jenisraport.value : null,
					semester: value.semester ? value.semester.value : null,
					kkm: value.kkm ? value.kkm : null,
					logo: value.logo ? `${this.API_URL}bahan/${value.logo}` : null,
				}
				this.getWilayah({ bagian: 'kabkota', KodeWilayah: this.inputData.provinsi })
				this.getWilayah({ bagian: 'kecamatan', KodeWilayah: this.inputData.kabupatenkota })
				this.getWilayah({ bagian: 'kelurahan', KodeWilayah: this.inputData.kecamatan })
			}
		},
    inputData:{
			deep: true,
			handler(value) {
				if(!value.provinsi){
					this.inputData.kabupatenkota = null
					this.inputData.kecamatan = null
					this.inputData.kelurahan = null
					this.inputData.kodepos = ''
				}
      }
    },
		page: {
			deep: true,
			handler(value) {
				this.getDataBerkas({page: value, limit: this.limit, keyword: this.searchData})
			}
		},
		limit: {
			deep: true,
			handler(value) {
				this.page = 1
				this.getDataBerkas({page: 1, limit: value, keyword: this.searchData})
			}
		},
  },
	mounted() {
    this.getCMSSettings()
		this.getWilayah({ bagian: 'provinsi', KodeWilayah: null })
	},
	methods: {
		...mapActions({
      uploadFiles: 'upload/uploadFiles',
			uploadBerkas: 'upload/uploadBerkas',
      getCMSSettings: 'setting/getCMSSettings',
      getWilayah: 'setting/getWilayah',
			getDataBerkas: 'setting/getDataBerkas',
		}),
    wilayah(kondisi, e){
			if(kondisi === 'provinsi'){
				if(e){
					this.getWilayah({ bagian: 'kabkota', KodeWilayah: e })
					this.inputData.kabupatenkota = null
					this.inputData.kecamatan = null
					this.inputData.kelurahan = null
					this.inputData.kodepos = ''
				}
			}else if(kondisi === 'kabkota'){
				if(e){
					this.getWilayah({ bagian: 'kecamatan', KodeWilayah: e })
					if(e !== this.inputData.kecamatan) {
						this.inputData.kelurahan = null
						this.inputData.kodepos = ''	
					}
				}else{
					this.inputData.kecamatan = null
					this.inputData.kelurahan = null
					this.inputData.kodepos = ''
				}
			}else if(kondisi === 'kecamatan'){
				if(e){
					this.getWilayah({ bagian: 'kelurahan', KodeWilayah: e })
					if(e !== this.inputData.kelurahan) {
						this.inputData.kodepos = ''	
					}
				}else{
					this.inputData.kelurahan = null
					this.inputData.kodepos = ''
				}
			}else if(kondisi === 'kelurahan'){
				if(e){
					let data = this.KelurahanOptions.filter(str => str.kode === e)
          this.inputData.kodepos = data[0].kodePos
				}else{
					this.inputData.kodepos = ''
				}
			}
		},
    SimpanGeneranCMS(){
      const d = new Date();
      for (let tahun = 2020; tahun <= d.getFullYear(); tahun++) {
        let tulisan = `${tahun}/${tahun+1}`
        this.tahunOptions.push(tulisan.toString())
      }
			this.getWilayah({ bagian: 'provinsi', KodeWilayah: null })
			this.getWilayah({ bagian: 'kabkota', KodeWilayah: this.inputData.provinsi })
			this.getWilayah({ bagian: 'kecamatan', KodeWilayah: this.inputData.kabupatenkota })
			this.getWilayah({ bagian: 'kelurahan', KodeWilayah: this.inputData.kecamatan })
      let semester = this.semesterOptions.filter(str => str.value === this.inputData.semester)[0]
      let jenisraport = this.jenisRaportOptions.filter(str => str.value === this.inputData.jenisraport)[0]
      let raport = this.raportOptions.filter(str => str.value === this.inputData.pdfraport)[0]
      let status = this.statusSekolahOptions.filter(str => str.kode === this.inputData.statussekolah)[0]
      let provinsi = this.ProvinsiOptions.filter(str => str.kode === this.inputData.provinsi)[0]
      let kabkota = this.KabKotaOptions.filter(str => str.kode === this.inputData.kabupatenkota)[0]
      let kec = this.KecamatanOptions.filter(str => str.kode === this.inputData.kecamatan)[0]
      let kel = this.KelurahanOptions.filter(str => str.kode === this.inputData.kelurahan)[0]
      let bodyData = {
        alamat: this.inputData.alamat,
				provinsi: {
          label: this.uppercaseLetterFirst2(provinsi.nama),
          value: provinsi.kode,
        },
        kabupatenkota: {
          label: this.uppercaseLetterFirst2(kabkota.nama),
          value: kabkota.kode,
        },
        kecamatan: {
          label: kec.nama,
          value: kec.kode,
        },
        kelurahan: {
          label: kel.nama,
          value: kel.kode,
        },
        kodepos: this.inputData.kodepos,
        latitude: this.inputData.latitude,
        longitude: this.inputData.longitude,
        namasekolah: this.inputData.namasekolah,
        statussekolah: {
            label: status.label,
            value: status.kode
        },
        tahunpelajaran: this.inputData.tahunpelajaran,
        pdfraport: {
          label: raport.label,
          value: raport.value,
        },
        jenisraport: {
          label: jenisraport.label,
          value: jenisraport.value,
        },
        semester: {
          label: semester.label,
          value: semester.value,
        },
        telepon: this.inputData.telepon,
        kkm: this.inputData.kkm,
      }
			this.$store.dispatch('setting/postCMSSettings', bodyData)
      .then((res) => {
        this.getCMSSettings()
        this.getWilayah({ bagian: 'provinsi', KodeWilayah: null })
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
		addFiles(e) {
      let jml_files = e.target.files.length
			if(this.jenisUpload === 'Gambar'){
				for(let i=0;i<jml_files;i++) {
					this.MultipleBerkas.push(e.target.files[i])
				} 
				this.imageMultiple = []     
				this.MultipleBerkas.forEach((file, f) => {
					this.imageMultiple.push({ 
						title: '',
						ext: file.type === 'image/jpeg' || file.type === 'image/jpg' ? 'jpg' : 'png',
						kategori: this.jenisUpload,
						url: URL.createObjectURL(file),
						files: file
					})
				})
			}
			if(this.jenisUpload === 'File'){
				for(let i=0;i<jml_files;i++) {
					this.MultipleBerkas.push(e.target.files[i])
				} 
				this.fileMultiple = []     
				this.MultipleBerkas.forEach((file, f) => {
					this.fileMultiple.push({ 
						title: '',
						ext: file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/msword'
							? 'docx' : file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel'
							? 'xlsx' : file.type === 'application/pdf'
							? 'pdf' : 'txt',
						name: file.name,
						kategori: this.jenisUpload,
						url: URL.createObjectURL(file),
						files: file
					})
				})
			}
    },
    HapusMultiple(index) {
			if(this.jenisUpload === 'Gambar'){
				this.MultipleBerkas.splice(index, 1)
				this.imageMultiple.splice(index, 1)
			}
			if(this.jenisUpload === 'File'){
				this.MultipleBerkas.splice(index, 1)
				this.fileMultiple.splice(index, 1)
			}
    },
		async SimpanMultiple(){
			let dataFile = this.jenisUpload === 'Gambar' ? this.imageMultiple : this.fileMultiple
			let kirim = await Promise.all(dataFile.map(async (value) => {
        let status = []
        const bodyData = {
					title: value.title,
					type: value.kategori,
					ext: value.ext,
					nama_file: `${this.convertDate(new Date().toISOString().slice(0,10))}${this.makeRandom(8)}`,
					table: "Berkas",
					files: value.files,
				};
				try {
					let response = await this.uploadBerkas(bodyData);
          status.push(response.data.status)
				} catch (err) {
          status.push(err.response.data.status)
				}
        return status[0]
      }))
			if(kirim.filter(el => el == 200).length){
        this.notifikasi("success", 'Berhasil Upload Berkas', "1")
      }else{
        this.notifikasi("error", 'Gagal proses data', "1")
      }
			this.jenisUpload = ''
			this.MultipleBerkas = []
			this.imageMultiple = []
			this.fileMultiple = []
			this.DialogUploadBerkas = false
		},
		openDialogDataBerkas(){
			// this.getNotifikasi({kategori: '1', untuk: 'pengirim', page: this.page, limit: this.limit})
			this.getDataBerkas({page: this.page, limit: this.limit, keyword: this.searchData})
			this.DialogBerkas = true
		},
		postRecord(idBerkas, statusAktif){
			let bodyData = {
				jenis: 'STATUSRECORD',
				idBerkas: idBerkas,
				statusAktif: statusAktif,
      }
      this.$store.dispatch('setting/postDataBerkas', bodyData)
      .then((res) => {
        this.getDataBerkas({page: 1, limit: this.limit, keyword: this.searchData})
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
		},
		async uploadLogoSekolah(e) {
      let files = e.target.files[0];
      if(!files) return this.notifikasi("warning", 'Ulangi unggah Logo Sekolah', "1")
      let ukuran = (files.size / (1024*1024)).toFixed(2);
      if(ukuran > 5.00) { 
        this.componentKey++; 
        return this.notifikasi("warning", 'Unggah Logo Sekolah anda terlalu besar !', "1")
      }
      this.logoSekolah = files.name
      this.loadImage(files)
    },
		loadImage(files) {
      this.dialogCrop = true
      const blob = URL.createObjectURL(files);
      const reader = new FileReader();
      reader.onload = (e) => {
        this.image = {
          src: blob,
          type: getMimeType(e.target.result, files.type),
        }
      }
      reader.readAsArrayBuffer(files);
    },
		crop() {
			const { canvas } = this.$refs.cropper.getResult();
			canvas.toBlob(async (blob) => {
        this.FileLogoSekolah = blob
        let uploadLogoSekolah = await this.uploadLampiran(this.FileLogoSekolah)
        if(uploadLogoSekolah != undefined){ 
          this.tutupDialogCrop()
          this.notifikasi("success", "Berhasil ubah Logo Sekolah", "2")
        }else{ 
          this.componentKey++;
          this.tutupDialogCrop()
          this.notifikasi("error", 'Gagal ubah Logo Sekolah', "1")
        }
			}, this.image.type);

		},
		async uploadLampiran(dataUpload) {
			if(dataUpload){
				const bodyData = {
					kode: 'logo',
					nama_file: `${this.makeRandom(10)}-logosekolah`,
					jenis: "logo",
					bagian: "berkas",
					table: "CMSSetting",
					files: dataUpload,
				};
				try {
					let response = await this.uploadFiles(bodyData);
					return response
				} catch (err) {
					this.notifikasi("error", err.response.data.message, "1")
				}
			}else{
        return undefined
      }
		},
		tutupDialogCrop(){
      this.FileLogoSekolah = ''
      this.logoSekolah = '';
			this.image = {
        src: null,
        type: null,
      }
      this.$refs.logoSekolah.value = null
			this.$refs.cropper.value = null
      this.dialogCrop = false
    },
		goToProses() {
      window.location.reload();
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
.avatar {
  border: solid 2px #FFF;
  border-radius: 5%;
  align-items: center;
  display: flex;
  justify-content: center;
  line-height: normal;
  position: relative;
  text-align: center;
  vertical-align: middle;
  overflow: hidden;
  width: 185px;
  height: 185px;
  cursor: pointer;
}
.avatar:hover {
  border: solid 2px #FFF;
  opacity: 0.5;
}

.avatar:hover img {
  position: absolute;
  z-index: 1;
}
.tulisan {
  position: absolute;
  visibility: hidden;
}
.avatar:hover .tulisan {
  border-radius: 5px;
  align-items: center;
  display: flex;
  justify-content: center;
  position: absolute;
  background: #000000;
  color: #FFF;
  font-size: 12px;
  visibility: visible;
  font-weight: bold;
  z-index: 100;
  width: 185px;
  height: 30px;
}
.cropper {
  border: solid 3px #ff0000;
  min-height: 450px;
  width: auto;
}
.listData {
	width: 200px !important;
}
.menufont {
	font-size: 13px !important;
	color: #FFFFFF;
}
.SelectedMenu{
  min-height: 35px !important;
}
.SelectedMenu:hover {
	border-radius: 2px;
	background: #939494;
	cursor: pointer;
}
.SelectedMenu-active {
	border-radius: 2px;
	background: rgba(132, 131, 195, 0.19);
	cursor: pointer;
}
.v-list-item__title {
  align-self: center;
  font-size: 10pt !important;
  font-weight: bold;
}
.wadahFile {
	width: 100%;
	height: auto;
	margin: 10px;
	border-radius: 5px !important;
	border: 2px solid #000;
}
.kotakFile {
	width: 100%;
	height: 60px;
}
.iconFile{
	align-items: center;
  display: flex;
  justify-content: center;
  line-height: normal;
  position: relative;
  text-align: center;
  vertical-align: middle;
  float:left;
	padding: 0px 10px;
	height: 60px;
	width: auto;
}
.textFile{
	align-items: center;
	display: flex;
	justify-content: center;
	line-height: normal;
	position: relative;
	text-align: center;
	vertical-align: middle;
	float:left;
	height: 60px;
	width: auto;
	font-size: 10pt !important;
  font-weight: bold;
}
.kotakGambar {
	border: 2px solid #000;
	display: grid;
}
.responsiveImage{
	width: 300px;
	height: 180px;
	object-fit: contain;
}
@media screen and (min-width: 1920px) {
  .responsiveImage{
		width: 440px;
	}
}
</style>