<template>
  <div>
    <h1 class="subheading grey--text">Data Jadwal Exam</h1>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-row no-gutters class="pa-2">
        <v-col cols="12" md="6">
          <Button 
            v-if="kondisiJabatan"
            color-button="light-blue darken-3"
            icon-button="mdi mdi-plus-thick"
            nama-button="Tambah"
            @proses="openDialog(null, 0)"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-row no-gutters>
            <v-col cols="12" md="5" class="pr-2">
              <Autocomplete
                v-model="pencarian.mapel"
                :data-a="mengajarOptions"
                label-a="Pilih Mata Pelajaran"
                item-title="label"
                item-value="kode"
                :clearable-a="true"
                @click:clear="() => { page = 1; getJadwalExam({page: 1, limit: limit}); }"
                @ubah="(e) => { page = 1; getJadwalExam({page: 1, limit: limit, kelas: pencarian.kelas, mapel: e}); }"
              />
            </v-col>
            <v-col cols="12" md="5" class="pr-2">
              <Autocomplete
                v-model="pencarian.kelas"
                :data-a="kelasOptions"
                label-a="Pilih Kelas"
                item-title="kelas"
                item-value="kelas"
                :clearable-a="true"
                @click:clear="() => { page = 1; getJadwalExam({page: 1, limit: limit}); }"
                @ubah="(e) => { page = 1; getJadwalExam({page: 1, limit: limit, kelas: e, mapel: pencarian.mapel}); }"
              />
            </v-col>
            <v-col cols="12" md="2" class="d-flex justify-end align-center">
              <Autocomplete
                v-model="page"
                :data-a="pageOptions"
                label-a="Page"
                :disabled-a="DataJadwalExam.length ? false : true"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <div class="px-1">
        <v-data-table
          v-model="selectRecord"
          loading-text="Sedang memuat... Harap tunggu"
          no-data-text="Tidak ada data yang tersedia"
          no-results-text="Tidak ada catatan yang cocok ditemukan"
          :headers="headers"
          :loading="loadingtable"
          :items="DataJadwalExam"
          expand-on-click
          v-model:expanded="expanded"
          item-value="idJadwalExam"
          density="comfortable"
          hide-default-footer
          hide-default-header
          class="elavation-3 rounded"
          :items-per-page="itemsPerPage"
          @page-count="pageCount = $event"
          @click:row="clickrow"
          @update:modelValue="pilih($event)"
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
          <template #[`item.waktu`]="{ item }">
            <span v-html="`${item.raw.waktu} menit`" /> 
          </template>
          <template #[`item.startDate`]="{ item }">
            <span v-html="convertDateTime(item.raw.startDate)" /> 
          </template>
          <template #[`item.endDate`]="{ item }">
            <span v-html="convertDateTime(item.raw.endDate)" /> 
          </template>
          <template #[`item.status`]="{ item }">
            <v-icon size="small" v-if="item.raw.status == true" color="green" icon="mdi mdi-check" />
            <v-icon size="small" v-else-if="item.raw.status == false" color="red" icon="mdi mdi-close" />
          </template>
          <template #expanded-row="{ columns, item }">
            <tr>
              <td :colspan="columns.length">
                <Button 
                  v-if="kondisiJabatan"
                  color-button="#0bd369"
                  icon-button="mdi mdi-pencil"
                  nama-button="Ubah"
                  :disabled-button="item.raw.status === false"
                  @proses="openDialog(item.raw, 1)"
                />
                <Button 
                  v-if="kondisiJabatan"
                  color-button="#0bd369"
                  :icon-button="item.raw.status === false ? 'mdi mdi-eye' : 'mdi mdi-eye-off'"
                  :nama-button="item.raw.status === false ? 'Active' : 'Non Active'"
                  @proses="postRecord('STATUSRECORD', item.raw, !item.raw.status)"
                />
                <Button 
                  v-if="kondisiJabatan"
                  color-button="#bd3a07"
                  icon-button="mdi mdi-delete"
                  nama-button="Hapus"
                  :disabled-button="item.raw.status === false"
                  @proses="postRecord('DELETE', item.raw, null)"
                />
                <Button 
                  color-button="#04f7f7"
                  icon-button="mdi mdi-information"
                  nama-button="Detail"
                  @proses="openDialog(item.raw, 2)"
                />
              </td>
            </tr>
          </template>
          <template #bottom>
            <v-divider v-if="kondisiJabatan" :thickness="2" class="border-opacity-100" color="white" />
            <v-row no-gutters v-if="kondisiJabatan">
              <v-col cols="12" class="pa-2 d-flex justify-start align-center">
                <Button
                  v-if="DataJadwalExam.length && selectRecord.length < DataJadwalExam.length"
                  color-button="#0bd369"
                  icon-button="mdi mdi-select-all"
                  :nama-button="`Choose All (${selectRecord.length})`"
                  @proses="allData(DataJadwalExam)"
                />
                <Button
                  v-if="selectRecord.length"
                  color-button="#0bd369"
                  icon-button="mdi mdi-select-remove"
                  :nama-button="`Remove Select`"
                  @proses="() => { selectRecord = [] }"
                />
                <Button 
                  color-button="#bd3a07"
                  icon-button="mdi mdi-delete"
                  nama-button="Hapus Record Selected"
                  :disabled-button="!DataJadwalExam.length"
                  @proses="hapusAllRecord()"
                />
              </v-col>
            </v-row>
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
                    :disabled-a="DataJadwalExam.length ? false : true"
                  />
                  <Button
                    variant="plain"
                    size-button="large"
                    model-button="comfortable"
                    color-button="#ffffff"
                    icon-button="mdi mdi-arrow-left-circle-outline"
                    :disabled-button="DataJadwalExam.length ? pageSummary.page != 1 ? false : true : true"
                    @proses="() => { page = pageSummary.page - 1 }"
                  />
                  <Button
                    variant="plain"
                    size-button="large"
                    model-button="comfortable"
                    color-button="#ffffff"
                    icon-button="mdi mdi-arrow-right-circle-outline"
                    :disabled-button="DataJadwalExam.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
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
      v-model="DialogJadwalExam"
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
              @proses="() => { clearData(); DialogJadwalExam = false; }"
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
              Kelas
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <Autocomplete
                v-model="inputDataJadwalExam.kelas"
                :data-a="kelasOptions"
                item-title="kelas"
                item-value="kelas"
                label-a="Pilih Kelas"
                :clearable-a="editedIndex != 2"
                :readonly-a="editedIndex == 2"
              />
            </v-col>
          </v-row>
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
                v-model="inputDataJadwalExam.mapel"
                :data-a="mengajarOptions"
                item-title="label"
                item-value="kode"
                label-a="Pilih Mata Pelajaran"
                :clearable-a="editedIndex != 2"
                :readonly-a="editedIndex == 2"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Date Exam
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <vue-date-picker
                v-model="inputDataJadwalExam.dateRange"
                placeholder="Range Waktu Exam"
                format="dd-MM-yyyy HH:mm"
                time-picker-inline
                range
                :clearable="editedIndex != 2"
                :readonly="editedIndex == 2"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Limit Soal
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <v-row no-gutters>
                <v-col
                  cols="12"
                  md="6"
                  class="pr-1"
                >
                  <v-checkbox
                    v-model="checkTempPilihan"
                    label="Pilihan Ganda"
                    hide-details
                    :readonly="editedIndex === 2"
                  />
                  <TextField
                    v-if="checkTempPilihan"
                    v-model="limitSoal.pilihanganda"
                    label-tf="Limit Soal Pilihan Ganda"
                    :clearable-tf="editedIndex !== 2"
                    :readonly-tf="editedIndex === 2"
                    @keypress="onlyNumber($event, 2, limitSoal.pilihanganda)"                          
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  class="pl-1"
                >
                  <v-checkbox
                    v-model="checkTempEssay"
                    label="Essay"
                    hide-details
                    :readonly="editedIndex === 2"
                  />
                  <TextField
                    v-if="checkTempEssay"
                    v-model="limitSoal.essay"
                    label-tf="Limit Soal Essay"
                    :clearable-tf="editedIndex !== 2"
                    :readonly-tf="editedIndex === 2"
                    @keypress="onlyNumber($event, 2, limitSoal.essay)"                          
                  />
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col
                  cols="12"
                  md="6"
                  class="pr-1"
                >
                  <v-checkbox
                    v-model="checkTempMenjodohkan"
                    label="Menjodohkan"
                    hide-details
                    :readonly="editedIndex === 2"
                  />
                  <TextField
                    v-if="checkTempMenjodohkan"
                    v-model="limitSoal.menjodohkan"
                    label-tf="Limit Soal Menjodohkan"
                    :clearable-tf="editedIndex !== 2"
                    :readonly-tf="editedIndex === 2"
                    @keypress="onlyNumber($event, 2, limitSoal.menjodohkan)"                          
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  class="pl-1"
                >
                  <v-checkbox
                    v-model="checkTempBS"
                    label="Benar Salah"
                    hide-details
                    :readonly="editedIndex === 2"
                  />
                  <TextField
                    v-if="checkTempBS"
                    v-model="limitSoal.benarsalah"
                    label-tf="Limit Soal Benar Salah"
                    :clearable-tf="editedIndex !== 2"
                    :readonly-tf="editedIndex === 2"
                    @keypress="onlyNumber($event, 2, limitSoal.benarsalah)"                          
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row v-if="editedIndex !== 2" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Kumpulan Kode Soal
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <Button
                color-button="black"
                nama-button="Random Soal"
                :disabled-button="inputDataJadwalExam.mapel === null && inputDataJadwalExam.kelas === null"
                @proses="getRandom()"
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
  name: 'JadwalExam',
  components: {
    PopUpNotifikasiVue,
  },
  data: () => ({
		expanded: [],
		DataJadwalExam: [],
    selectRecord: [],
    pencarian: {
      mapel: null,
      kelas: null,
    },
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
      { title: "#", key: "data-table-select", sortable: false, width: "3%" },
      { title: "NO", key: "number", sortable: false, width: "3%" },
      { title: "#", key: "data-table-expand", sortable: false, width: "3%" },
      { title: "MATA PELAJARAN", key: "namamapel", sortable: false, width: "15%" },
      { title: "KELAS", key: "kelas", sortable: false, width: "5%" },
      { title: "WAKTU LAMANYA", key: "waktu", sortable: false, width: "10%" },
      { title: "WAKTU MULAI", key: "startDate", sortable: false, width: "15%" },
      { title: "WAKTU SELESAI", key: "endDate", sortable: false, width: "15%" },
      { title: "STATUS", key: "status", sortable: false, width: "5%" },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
    roleID: '',
    idLog: '',
    inputDataJadwalExam: {
      idJadwalExam: '',
      mapel: null,
      kelas: null,
      dateRange: [],
    },
    limitSoal: {
      pilihanganda: '',
      essay: '',
      menjodohkan: '',
      benarsalah: '',
    },
    kumpulanKodeSoal: {
      pilihanganda: [],
      essay: [],
      menjodohkan: '',
      benarsalah: '',
    },
    checkTempPilihan: false,
    checkTempEssay: false,
    checkTempMenjodohkan: false,
    checkTempBS: false,
    showTimeRangePanel: false,
    editedIndex: 0,
    kondisiTombol: true,
    DialogJadwalExam: false,

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Jadwal Exam",
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
      jabatan: store => store.setting.jabatanOptions,
      loadingtable: store => store.user.loadingtable,
      dataRandomQuestion: store => store.user.dataRandomQuestion,
    }),
    ...mapGetters({
      jadwalExam: 'user/jadwalExam',
    }),
    kondisiJabatan(){
			if(this.roleID === '3'){
				let jabatan_guru = localStorage.getItem('jabatan_guru').split(', ')
				let result = []
				jabatan_guru.map(str => {
					let hasil = this.jabatan.filter(val => { return val.kode == str })
					result.push(hasil.length ? hasil[0].label : '')
				})
        let kondisi = false
        if(result.includes('WaKaBid. Kurikulum')){
          kondisi = true
        }else if(result.includes('WaKaBid. Kesiswaan')){
          kondisi = false
          this.headers = this.headers.filter(el => { return el.key != "data-table-select"; })
        }else if(result.includes('Kepala Sekolah')){
          kondisi = true
        }else{
          this.headers = this.headers.filter(el => { return el.key != "data-table-select"; })
        }
				return kondisi
			}else if(this.roleID === '1' || this.roleID === '2'){
				return true
      }
		},
  },
  watch: {
    jadwalExam: {
      deep: true,
      handler(value){
        this.pageOptions = []
        this.DataJadwalExam = value?.records
				this.pageSummary = {
					page: this.DataJadwalExam.length ? value?.pageSummary?.page : 0,
					limit: this.DataJadwalExam.length ? value?.pageSummary?.limit : 0,
					total: this.DataJadwalExam.length ? value?.pageSummary?.total : 0,
					totalPages: this.DataJadwalExam.length ? value?.pageSummary?.totalPages : 0
				}
        for (let index = 1; index <= this.pageSummary.totalPages; index++) {
          this.pageOptions.push(index)
        }
      }
    },
    inputDataJadwalExam: {
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
				this.getJadwalExam({page: value, limit: this.limit, mapel: this.pencarian.mapel, kelas: this.pencarian.kelas})
			}
		},
    limit: {
			deep: true,
			handler(value) {
        this.page = 1
				this.getJadwalExam({page: 1, limit: value, mapel: this.pencarian.mapel, kelas: this.pencarian.kelas})
			}
		},
    dataRandomQuestion: {
			deep: true,
			handler(value) {
        this.kumpulanKodeSoal = {
          pilihanganda: value?.pilihanganda,
          essay: value?.essay,
          menjodohkan: value?.menjodohkan,
          benarsalah: value?.benarsalah,
        }
			}
		},
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.roleID = localStorage.getItem('roleID')
    this.idLog = localStorage.getItem('idLogin')
		this.getJadwalExam({page: this.page, limit: this.limit, mapel: this.pencarian.mapel, kelas: this.pencarian.kelas});
    this.getMengajar()
    this.getJabatan()
    this.getKelas({ kondisi: 'All' })
	},
	methods: {
		...mapActions({
      getJadwalExam: 'user/getJadwalExam',
      getRandomQuestion: 'user/getRandomQuestion',
      getMengajar: 'setting/getMengajar', 
      getKelas: 'setting/getKelas',
			getJabatan: "setting/getJabatan",
    }),
    postRecord(jenis, item = null, status) {
      let bodyData = {
        ADDEDIT: {
          jenis: jenis,
          idJadwalExam: jenis === 'ADD' ? '' : this.inputDataJadwalExam.idJadwalExam,
          mapel: this.inputDataJadwalExam.mapel,
          kelas: this.inputDataJadwalExam.kelas,
          dateRange: this.inputDataJadwalExam.dateRange,
          limitSoal: JSON.stringify({
            pilihanganda: this.checkTempPilihan ? this.limitSoal.pilihanganda ? Number(this.limitSoal.pilihanganda) : 0 : 0,
            essay: this.checkTempEssay ? Number(this.limitSoal.essay) ? this.limitSoal.essay : 0 : 0,
            menjodohkan: this.checkTempMenjodohkan ? Number(this.limitSoal.menjodohkan) ? this.limitSoal.menjodohkan : 0 : 0,
            benarsalah: this.checkTempBS ? Number(this.limitSoal.benarsalah) ? this.limitSoal.benarsalah : 0 : 0,
          }),
          kumpulanKodeSoal: JSON.stringify({
            pilihanganda: this.kumpulanKodeSoal.pilihanganda ? this.kumpulanKodeSoal.pilihanganda : [],
            essay: this.kumpulanKodeSoal.essay ? this.kumpulanKodeSoal.essay : [],
            menjodohkan: this.kumpulanKodeSoal.menjodohkan ? this.kumpulanKodeSoal.menjodohkan : [],
            benarsalah: this.kumpulanKodeSoal.benarsalah ? this.kumpulanKodeSoal.benarsalah : [],
          }),
        },
        DELETESTATUS: {
          jenis: jenis,
          idJadwalExam: item?.idJadwalExam,
          status: status,
        },
      }
      this.$store.dispatch('user/postJadwalExam', jenis === 'ADD' || jenis === 'EDIT' ? bodyData.ADDEDIT : bodyData.DELETESTATUS)
      .then((res) => {
        this.DialogJadwalExam = false
        this.getJadwalExam({page: 1, limit: this.limit, mapel: this.pencarian.mapel, kelas: this.pencarian.kelas})
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
        this.checkTempPilihan = true
        this.checkTempEssay = true
        this.checkTempMenjodohkan = true
        this.checkTempBS = true
      }else{
        this.inputDataJadwalExam = {
          idJadwalExam: item?.idJadwalExam,
          kelas: item?.kelas,
          mapel: item?.kodemapel,
          dateRange: [item?.startDate, item?.endDate],
        }
        item?.limitSoal?.pilihanganda > 0 ? this.checkTempPilihan = true : this.checkTempPilihan = false
        item?.limitSoal?.essay > 0 ? this.checkTempEssay = true : this.checkTempEssay = false
        item?.limitSoal?.menjodohkan > 0 ? this.checkTempMenjodohkan = true : this.checkTempMenjodohkan = false
        item?.limitSoal?.benarsalah > 0 ? this.checkTempBS = true : this.checkTempBS = false
        this.limitSoal = {
          pilihanganda: item?.limitSoal?.pilihanganda,
          essay: item?.limitSoal?.essay,
          menjodohkan: item?.limitSoal?.menjodohkan,
          benarsalah: item?.limitSoal?.benarsalah,
        }
        this.kumpulanKodeSoal = {
          pilihanganda: item?.kumpulanKodeSoal?.pilihanganda,
          essay: item?.kumpulanKodeSoal?.essay,
          menjodohkan: item?.kumpulanKodeSoal?.menjodohkan,
          benarsalah: item?.kumpulanKodeSoal?.benarsalah,
        }
      }
      this.DialogJadwalExam = true
    },
    getRandom() {
      const bodyData = {
        mapel: this.inputDataJadwalExam.mapel,
        kelas: this.inputDataJadwalExam.kelas,
        limitSoal: JSON.stringify({
          pilihanganda: this.checkTempPilihan ? this.limitSoal.pilihanganda ? Number(this.limitSoal.pilihanganda) : 0 : 0,
          essay: this.checkTempEssay ? this.limitSoal.essay ? Number(this.limitSoal.essay) : 0 : 0,
          menjodohkan: this.checkTempMenjodohkan ? this.limitSoal.menjodohkan ? Number(this.limitSoal.menjodohkan) : 0 : 0,
          benarsalah: this.checkTempBS ? this.limitSoal.benarsalah ? Number(this.limitSoal.benarsalah) : 0 : 0,
        })
      }
      this.getRandomQuestion(bodyData)
      .then((res) => {
        this.notifikasi("success", "Berhasil Mengacak Question Exam", "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    clearData(){
      this.inputDataJadwalExam = {
        idJadwalExam: '',
        mapel: null,
        kelas: null,
        dateRange: [],
      }
      this.limitSoal = {
        pilihanganda: '',
        essay: '',
        menjodohkan: '',
        benarsalah: '',
      }
      this.kumpulanKodeSoal = {
        pilihanganda: [],
        essay: [],
        menjodohkan: [],
        benarsalah: [],
      }
      this.checkTempPilihan = false
      this.checkTempEssay = false
      this.checkTempMenjodohkan = false
      this.checkTempBS = false
    },
    clickrow(event, data) {
      const index = this.$data.expanded.find(i => i === data?.item?.raw?.idJadwalExam);
      if(typeof index === 'undefined') return this.$data.expanded = [];
      this.$data.expanded.splice(0, 1)
      this.$data.expanded.push(data?.item?.raw?.idJadwalExam);
    },
    pilih(event) {
      this.selectRecord = event;
    },
    allData(item) {
      if(item.length === this.selectRecord.length) return this.notifikasi("warning", "Data sudah di pilih semua pada page ini!", "1")
      item.map(val => {
        if(!this.selectRecord.includes(val.idJadwalExam)){
          this.selectRecord.push(val.idJadwalExam)
        }
      })
    },
    hapusAllRecord() {
      if(!this.selectRecord.length) return this.notifikasi("warning", "Belum ada record yang di pilih!", "1")
      let bodyData = {
        jenis: 'DELETE',
        idJadwalExam: this.selectRecord,
      }
      this.$store.dispatch('user/postJadwalExam', bodyData)
      .then((res) => {
        this.selectRecord = []
        this.DialogJadwalExam = false
        this.getJadwalExam({page: 1, limit: this.limit, mapel: this.pencarian.mapel, kelas: this.pencarian.kelas})
        this.notifikasi("success", res.data.message, "1")
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