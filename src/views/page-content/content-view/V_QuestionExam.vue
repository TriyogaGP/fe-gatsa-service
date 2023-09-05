<template>
  <div>
    <h1 class="subheading grey--text">Data Question Exam</h1>
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
            <v-col cols="12" md="4">
              <Autocomplete
                v-model="pencarian"
                :data-a="pencarianOptions"
                label-a="Pilih Pencarian"
                item-title="label"
                item-value="kode"
                :clearable-a="true"
                @click:clear="() => { page = 1; pencarian = null; searchData = null; getQuestionExam({page: 1, limit: limit, keyword: ''}); }"
                @ubah="() => { page = 1; searchData = null; }"
              />
            </v-col>
            <v-col cols="12" md="6" class="pl-2">
              <Autocomplete
                v-model="searchData"
                :data-a="pencarian === 'Mata Pelajaran' ? optionsMengajar : pencarian === 'Kelas' ? optionsKelas : questionOptions"
                :label-a="pencarian ? pencarian === 'Mata Pelajaran' ? 'Pilih Mata Pelajaran' : pencarian === 'Kelas' ? 'Pilih Kelas' : 'Pilih Jenis Soal' : '---'"
                item-title="label"
                :item-value="pencarian === 'Mata Pelajaran' ? 'kode' : 'link'"
                :disabled-a="!pencarian"
                @ubah="(e) => { page = 1; getQuestionExam({page: 1, limit: limit, keyword: e}); }"
              />
            </v-col>
            <v-col cols="12" md="2" class="pl-2 d-flex justify-end align-center">
              <Autocomplete
                v-model="page"
                :data-a="pageOptions"
                label-a="Page"
                :disabled-a="DataQuestionExam.length ? false : true"
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
          :items="DataQuestionExam"
          :expand-on-click="DetailPilihan === false ? true : false"
          show-expand
          item-value="kode"
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
          <template #[`item.jeniskode`]="{ item }">
            <span v-html="`${item.raw.jenis} / ${item.raw.kode}`" /> 
          </template>
          <template #[`item.mapelkelas`]="{ item }">
            <span v-html="`${item.raw.namamapel} / ${item.raw.kelas}`" /> 
          </template>
          <template #[`item.pertanyaan`]="{ item }">
            <span v-if="item.raw.pertanyaan.file === null" v-html="item.raw.pertanyaan.text" /> 
            <div v-else>
              <img :src="item.raw.pertanyaan.file" width="40"><br>
              <span v-html="item.raw.pertanyaan.text" />
            </div>
          </template>
          <template #[`item.pilihan`]="{ item }">
            <Button
              v-if="item.raw.jenis === 'pilihan ganda'"
              color-button="#04f7f7"
              icon-button="mdi mdi-information"
              nama-button="Detail"
              @proses="openDetail(item.raw.pilihan)"
            />
            <span v-else>-</span>
          </template>
          <template #[`item.kunci`]="{ item }">
            <span v-html="item.raw.jenis === 'pilihan ganda' ? item.raw.kunci : '-'" /> 
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
                  :disabled-button="item.raw.statusAktif === false"
                  @proses="openDialog(item.raw, 1)"
                />
                <Button 
                  color-button="#0bd369"
                  :icon-button="item.raw.statusAktif === false ? 'mdi mdi-eye' : 'mdi mdi-eye-off'"
                  :nama-button="item.raw.statusAktif === false ? 'Active' : 'Non Active'"
                  @proses="postRecordTwo('STATUSRECORD', item.raw, !item.raw.statusAktif)"
                />
                <Button 
                  color-button="#bd3a07"
                  icon-button="mdi mdi-delete"
                  nama-button="Hapus"
                  :disabled-button="item.raw.statusAktif === false"
                  @proses="postRecordTwo('DELETE', item.raw, null)"
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
                    :data-a="limitPage"
                    label-a="Limit"
                    :disabled-a="DataQuestionExam.length ? false : true"
                  />
                  <Button
                    variant="plain"
                    size-button="large"
                    model-button="comfortable"
                    color-button="#ffffff"
                    icon-button="mdi mdi-arrow-left-circle-outline"
                    :disabled-button="DataQuestionExam.length ? pageSummary.page != 1 ? false : true : true"
                    @proses="() => { page = pageSummary.page - 1 }"
                  />
                  <Button
                    variant="plain"
                    size-button="large"
                    model-button="comfortable"
                    color-button="#ffffff"
                    icon-button="mdi mdi-arrow-right-circle-outline"
                    :disabled-button="DataQuestionExam.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
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
      v-model="DialogQuestionExam"
      scrollable
      persistent
      transition="dialog-bottom-transition"
      width="auto"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>{{editedIndex == 0 ? 'Tambah' : 'Ubah'}} Data Question Exam</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { clearData(); DialogQuestionExam = false; }"
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
              Mata Pelajaran
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <Autocomplete
                v-model="inputDataQuestionExam.mapel"
                :data-a="mengajarOptions"
                label-a="Pilih Mata Pelajaran"
                item-title="label"
                item-value="kode"
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
                v-model="inputDataQuestionExam.kelas"
                :data-a="kelasOptions"
                label-a="Pilih Kelas"
                item-title="label"
                item-value="link"
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
              Jenis Question
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <Autocomplete
                v-model="inputDataQuestionExam.jenis"
                :data-a="questionOptions"
                label-a="Pilih Jenis Question"
                item-title="label"
                item-value="link"
                :clearable-a="true"
                @ubah="() => { jumlahPilihan = 0; }"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Pertanyaan
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <TextArea
                v-model="inputDataQuestionExam.pertanyaan"
                label-ta="Pertanyaan"
                rows="4"
                :clearable-ta="true"
              />
              <Button
                v-if="inputDataQuestionExam.jenis !== null"
                color-button="#0bd369"
                icon-button="mdi mdi-upload"
                nama-button="Upload Gambar Pertanyaan"
                @proses="pilihFile('pertanyaan', null)"
              />
              <input 
                ref="inputPertanyaan"
                :key="componentKey"
                type="file"
                accept="image/*"
                style="display: none"
                @change="uploadDataFile($event, 'pertanyaan', null)"
              >
              <div v-if="filePertanyaan !== ''" class="avatar">
                <v-icon v-if="filePertanyaan !== ''" color="red" icon="mdi mdi-delete" style="cursor: pointer;" @click="() => { filePertanyaan = ''; filename = ''; }" />
                <v-img :src="`${BASE_URL}berkas/${filePertanyaan}`" />
              </div>
              <div v-else>gambar pertanyaan tidak ada</div>
            </v-col>
          </v-row>
          <v-row no-gutters v-if="inputDataQuestionExam.jenis === 'pilihan ganda'">
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Kunci Jawaban
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <Autocomplete
                v-model="inputDataQuestionExam.kunci"
                :data-a="ValuePilihan"
                label-a="Pilih Kunci Jawaban"
                item-title="value"
                item-value="value"
                :clearable-a="true"
              />
            </v-col>
          </v-row>
          <v-row no-gutters v-if="inputDataQuestionExam.jenis === 'pilihan ganda'">
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Jumlah Pilihan
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <TextField
                v-model="jumlahPilihan"
                label-tf="Jumlah Pilihan"
                @keypress="onlyNumber($event, 1, jumlahPilihan)"
                @input="dataChange(jumlahPilihan, 5)"
              />
            </v-col>
          </v-row>
          <v-row no-gutters v-if="inputDataQuestionExam.jenis === 'pilihan ganda'">
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Pilihan
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <Autocomplete
                v-model="JenisPilihan"
                :data-a="jenisPilihanOptions"
                label-a="Pilih Jenis Pilihan"
                item-title="label"
                item-value="value"
                :clearable-a="true"
              />
            </v-col>
          </v-row>
          <v-row v-for="(k, index) in Number(jumlahPilihan)" :key="index" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Pilihan {{ k }}
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-1"
            >
              <TextArea
                v-if="JenisPilihan === 'text'"
                v-model="TextPilihan[index]"
                :label-ta="`Pilihan ${k}`"
                rows="4"
                class="mt-2"
                :clearable-ta="true"
              />
              <Button 
               v-if="JenisPilihan === 'gambar'"
                color-button="#0bd369"
                icon-button="mdi mdi-upload"
                :nama-button="`Upload Gambar Pertanyaan ${k}`"
                @proses="pilihFile('pilihan', index)"
              />
              <input 
                ref="inputPilihan"
                :key="componentKey"
                type="file"
                accept="image/*"
                style="display: none"
                @change="uploadDataFile($event, 'pilihan', index)"
              >
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
    <v-bottom-sheet
      v-model="DetailPilihan"
			scrollable
      persistent
    >
      <v-sheet color="surface" style="font-size: 14px;">
        <div class="text-right">
          <Button
						variant="plain"
						color-button="#ffffff"
						icon-button="mdi mdi-close"
						model-button="comfortable"
						size-button="large"
						@proses="() => { DetailPilihan = false; pilihan = []; }"
					/>
        </div>
        <v-card color="background-dialog-card" class="ma-4 pa-2">
          <h3>Pilihan Detail</h3>
					<div class="customScroll">
						<div v-for="v in pilihan" :key="v.value">
              <span v-if="v.jenis === 'text'" v-html="`${v.value}. ${v.text}`" />
              <div v-if="v.jenis === 'gambar'">
                <span v-html="v.value" />.&nbsp;
                <img :src="v.file" width="150">
              </div>
            </div>
					</div>
				</v-card>
      </v-sheet>
    </v-bottom-sheet>
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
  name: 'QuestionExam',
  components: {
    PopUpNotifikasiVue
  },
  data: () => ({
		DataQuestionExam: [],
		searchData: null,
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
      { title: "NO", key: "number", sortable: false, width: "3%" },
      { title: "#", key: "data-table-expand", sortable: false, width: "3%" },
      { title: "JENIS SOAL / KODE SOAL", key: "jeniskode", sortable: false, width: "10%" },
      { title: "MATA PELAJARAN / KELAS", key: "mapelkelas", sortable: false, width: "10%" },
      { title: "PERTANYAAN", key: "pertanyaan", sortable: false, width: "20%" },
      { title: "PILIHAN", key: "pilihan", sortable: false, width: "3%" },
      { title: "KUNCI", key: "kunci", sortable: false, width: "3%" },
      { title: "CREATE BY", key: "createBy", sortable: false, width: "10%" },
      { title: "UPDATE BY", key: "updateBy", sortable: false, width: "10%" },
      { title: "STATUS", key: "statusAktif", sortable: false, width: "5%" },
      { title: "FLAG", key: "flag", sortable: false, width: "5%" },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
    roleID: '',
    idLog: '',
    inputDataQuestionExam: {
      kode: '',
      mapel: null,
      kelas: null,
      jenis: null,
      pertanyaan: '',
      kunci: null,
    },
    JenisPilihan: 'text',
    ValuePilihan: ["A", "B", "C", "D", "E"],
    TextPilihan: [],
    FilePilihan: [],
    questionOptions: ["pilihan ganda", "essay"],
    jenisPilihanOptions: ["text", "gambar"],
    editedIndex: 0,
    kondisiTombol: true,
    DialogQuestionExam: false,
    DetailPilihan: false,
    pilihan: [],
    urlSk: window.location.href,
    BASE_URL: process.env.VUE_APP_BASE_URL_VIEW,
    componentKey: 0,
    filePertanyaan: '',
    filename: '',
    jumlahPilihan: 0,
    pencarianOptions: ["Jenis Soal", "Mata Pelajaran", "Kelas"],
    pencarian: null,

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Question Exam - MTsS. SIROJUL ATHFAL",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
  },
  computed: {
    ...mapState({
      loadingtable: store => store.user.loadingtable,
			mengajar: store => store.setting.mengajarOptions,
      optionkelas: store => store.setting.kelasOptions,
    }),
    ...mapGetters({
      questionExam: 'user/questionExam',
    }),
    mengajarOptions(){
			if(this.roleID === '3'){
				let mengajar_bidang = localStorage.getItem('mengajar_bidang').split(', ')
				let result = []
				mengajar_bidang.map(str => {
					let hasil = this.mengajar.filter(val => { return val.kode == str })
					result.push({ label: hasil.length ? hasil[0].label : '', kode: str })
				})
				return result
			}else if(this.roleID === '1' || this.roleID === '2'){
				return this.mengajar
      }
		},
    kelasOptions(){
			if(this.roleID === '3'){
				let mengajar_kelas = localStorage.getItem('mengajar_kelas').split(', ')
				let result = [], tampung = []
        mengajar_kelas.map(val => {
					let key = val.split('-')[0]
					if(!tampung.includes(key)){
						tampung.push(key)
						result.push({ label: key, link: key })
					}
				})
				return result
			}else if(this.roleID === '1' || this.roleID === '2'){
        let result = [], tampung = []
        this.optionkelas.map(val => {
					let key = val.kelas.split('-')[0]
					if(!tampung.includes(key)){
						tampung.push(key)
						result.push({ label: key, link: key })
					}
				})
				return result
      }
		},
    optionsMengajar(){
      return this.mengajar
		},
    optionsKelas(){
      let result = [], tampung = []
      this.optionkelas.map(val => {
        let key = val.kelas.split('-')[0]
        if(!tampung.includes(key)){
          tampung.push(key)
          result.push({ label: key, link: key })
        }
      })
      return result
		},
  },
  watch: {
    questionExam: {
      deep: true,
      handler(value){
        this.pageOptions = []
        this.DataQuestionExam = value.records
				this.pageSummary = {
					page: this.DataQuestionExam.length ? value.pageSummary.page : 0,
					limit: this.DataQuestionExam.length ? value.pageSummary.limit : 0,
					total: this.DataQuestionExam.length ? value.pageSummary.total : 0,
					totalPages: this.DataQuestionExam.length ? value.pageSummary.totalPages : 0
				}
        for (let index = 1; index <= this.pageSummary.totalPages; index++) {
          this.pageOptions.push(index)
        }
      }
    },
    inputDataQuestionExam: {
      deep: true,
      handler(value){
        if(value.kelas != null || value.mapel != null){
          this.kondisiTombol = false
        }else{
          this.kondisiTombol = true
        }
      }
    },
    page: {
			deep: true,
			handler(value) {
				this.getQuestionExam({page: value, limit: this.limit, keyword: this.searchData})
			}
		},
    limit: {
			deep: true,
			handler(value) {
        this.page = 1
				this.getQuestionExam({page: 1, limit: value, keyword: this.searchData})
			}
		},
  },
  mounted() {
    this.roleID = localStorage.getItem('roleID')
    this.idLog = localStorage.getItem('idLogin')
		this.getQuestionExam({page: this.page, limit: this.limit, keyword: this.searchData});
    this.getMengajar()
    this.getKelas({ kondisi: 'All' })
	},
	methods: {
		...mapActions({
			uploadBerkas: 'upload/uploadBerkas',
      getQuestionExam: 'user/getQuestionExam',
      getMengajar: "setting/getMengajar",
      getKelas: 'setting/getKelas',
    }),
    postRecord(jenis) {
      let inputPilihan = []
      for (let index = 0; index < this.jumlahPilihan; index++) {
        inputPilihan.push({
          jenis: this.JenisPilihan,
          value: this.ValuePilihan[index],
          text: this.JenisPilihan === 'text' ? this.TextPilihan[index] ? this.TextPilihan[index] : null : null,
          file: this.JenisPilihan === 'gambar' ? this.FilePilihan[index] ? this.FilePilihan[index] : null : null,
        })
      }
      let bodyData = {
        proses: jenis,
        kode: jenis === 'ADD' ? null : this.inputDataQuestionExam.kode,
        jenis: this.inputDataQuestionExam.jenis,
        mapel: this.inputDataQuestionExam.mapel,
        kelas: this.inputDataQuestionExam.kelas,
        pertanyaan: {
          text: this.inputDataQuestionExam.pertanyaan ? this.inputDataQuestionExam.pertanyaan : null,
          file: this.filePertanyaan ? this.filePertanyaan : null,
        },
        pilihan: this.inputDataQuestionExam.jenis === 'essay' ? null : inputPilihan,
        kunci: this.inputDataQuestionExam.jenis === 'essay' ? null : this.inputDataQuestionExam.kunci,
      }
      return console.log(bodyData);
      this.$store.dispatch('user/postQuestionExam', bodyData)
      .then((res) => {
        this.DialogQuestionExam = false
        this.getQuestionExam({page: 1, limit: this.limit, keyword: this.searchData})
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    postRecordTwo(jenis, item = null, statusAktif) {
      let bodyData = {
        proses: jenis,
        kode: item.kode ? item.kode : null,
        kondisi: statusAktif,
      }
      this.$store.dispatch('user/postQuestionExam', bodyData)
      .then((res) => {
        this.DialogQuestionExam = false
        this.getQuestionExam({page: 1, limit: this.limit, keyword: this.searchData})
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
        this.inputDataQuestionExam = {
          kode: item.kode,
          mapel: item.kodemapel,
          kelas: item.kelas,
          jenis: item.jenis,
          pertanyaan: item.pertanyaan.text,
          kunci: item.kunci,
        }
        this.filePertanyaan = item.pertanyaan.file ? item.pertanyaan.file.split('/')[4] : ''
        this.filename = item.pertanyaan.file ? item.pertanyaan.file.split('/')[4].split('.')[0] : ''
        this.jumlahPilihan = item.pilihan.length
        this.JenisPilihan = item.pilihan.length ? item.pilihan[0].jenis : ''
        item.pilihan.map(val => {
          if(val.jenis === 'text'){
            this.FilePilihan = []
            this.TextPilihan.push(val.text)
          }else{
            let fileAkhir = val.file.split('/')
            this.FilePilihan.push(fileAkhir[fileAkhir.length - 1])
            this.TextPilihan = []
          }
        })
      }
      this.DialogQuestionExam = true
    },
    openDetail(item){
			this.pilihan = item
			this.DetailPilihan = true
		},
    clearData(){
      this.inputDataQuestionExam = {
        kode: '',
        mapel: null,
        kelas: null,
        jenis: null,
        pertanyaan: '',
        kunci: null,
      }
      this.jumlahPilihan = 0
      this.TextPilihan = []
      this.FilePilihan = []
      this.filePertanyaan = ''
      this.filename = ''
    },
    pilihFile(jenis, index) {
      if(jenis === 'pertanyaan' && index === null) return this.$refs.inputPertanyaan.click();
      else if(jenis === 'pilihan') return this.$refs.inputPilihan[index].click();
    },
    async uploadDataFile(e, jenis, index) {
      let files = e.target.files[0];
      if(!files) return this.notifikasi("warning", 'Ulangi Unggah File', "1")
      let ukuran = (files.size / (1024*1024)).toFixed(2);
      if(ukuran > 5.00) { 
        this.componentKey++; 
        return this.notifikasi("warning", 'Unggah File anda terlalu besar !', "1")
      }
      let ext = files.type.split('/')[1]
      let nama_file = `Exam-${this.convertDate(new Date().toISOString().slice(0,10))}${this.makeRandom(8)}`
      if(jenis === 'pertanyaan') { this.filePertanyaan = `${nama_file}.${ext}`; this.filename = nama_file; }
      else if(jenis === 'pilihan') { this.FilePilihan.push(`${nama_file}.${ext}`); this.filename = nama_file; }
      let uploadberkas = await this.uploadLampiran(files)
      if(uploadberkas === 'success'){
        this.$refs.inputPertanyaan = null;
        // this.$refs.inputPilihan[index].value = null;
        this.notifikasi("success", 'Sukses Unggah File', "1")
      }else{
        this.filename = ''
        if(jenis === 'pertanyaan') { this.filePertanyaan = ''; }
        if(jenis === 'pilihan') { this.FilePilihan.splice(index, 1); }
        this.$refs.inputPertanyaan = null;
        // this.$refs.inputPilihan[index].value = null;
        this.notifikasi("warning", 'Gagal Unggah File', "1")
      }
    },
    async uploadLampiran(dataUpload) {
			if(dataUpload){
				const bodyData = {
					nama_file: this.filename,
					table: "QuestionExam",
					files: dataUpload,
				};
				try {
					await this.uploadBerkas(bodyData);
					return 'success'
				} catch (err) {
					return 'failed'
				}
			}else{
        return 'failed'
      }
		},
    dataChange(e, max){
      if(Number(e) > max) this.jumlahPilihan = max
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
.customScroll {
  width: 100%;
  height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
}
.customScroll::-webkit-scrollbar {
  width: 16px;
}
.customScroll::-webkit-scrollbar-thumb {
  background-color: #4CAF50;
  border: 5px solid #e1e1f0;
  border-radius: 10rem;
}
.customScroll::-webkit-scrollbar-track {
  position: absolute;
  right: -3rem;
  top: -50rem;
  background: transparent;
}
.avatar {
  border: solid 2px #FFF;
  align-items: center;
  border-radius: 5%;
  text-align: right;
  padding: 2px;
  width: 100px;
}
</style>