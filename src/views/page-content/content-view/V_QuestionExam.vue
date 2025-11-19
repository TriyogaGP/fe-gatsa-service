<template>
  <div>
    <h2 class="subheading grey--text text-decoration-underline">Data Question Exam</h2>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
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
          <ul style="font-size: 9pt;">
            <li>- Tombol Delete ada 2 (Delete Soft & Delete Hard).</li>
            <li>- Tombol Delete Soft tidak menghapus data dari database hanya di jadikan nonaktif dan ditandai dengan flag merah.</li>
            <li>- Tombol Delete Hard menghapus data dari database secara permanen.</li>
          </ul>
        </template>
      </v-alert>
      <v-data-table
        loading-text="Sedang memuat... Harap tunggu"
        no-data-text="Tidak ada data yang tersedia"
        no-results-text="Tidak ada catatan yang cocok ditemukan"
        :headers="headers"
        :loading="loadingtable"
        :items="DataQuestionExam"
        :expand-on-click="DetailPilihan === false ? true : false"
        item-value="kode"
        density="comfortable"
        hide-default-footer
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
        <template #[`item.number`]="{ index }">
          {{ page > 1 ? ((page - 1)*limit) + index + 1 : index + 1 }}
        </template>
        <template #[`item.jeniskode`]="{ item }">
          <span v-html="`${item.jenis} / ${item.kode}`" /> 
        </template>
        <template #[`item.mapelkelas`]="{ item }">
          <span v-html="`${item.namamapel} / ${item.kelas}`" /> 
        </template>
        <template #[`item.pertanyaan`]="{ item }">
          <span v-if="item.pertanyaan.file === null" v-html="item.pertanyaan.text" /> 
          <div v-else>
            <v-img :src="item.pertanyaan.file" width="40" />
              <v-tooltip
                activator="parent"
                location="top"
              ><v-img :src="item.pertanyaan.file" width="150" /></v-tooltip>
            <span v-html="item.pertanyaan.text" />
          </div>
        </template>
        <template #[`item.pilihan`]="{ item }">
          <Button
            v-if="item.jenis === 'pilihan ganda' || item.jenis === 'benar salah'"
            color-button="info"
            icon-prepend-button="mdi mdi-information"
            size-button="x-small"
            nama-button="Detail"
            @proses="openDetail(item.pilihan)"
          />
          <span v-else-if="item.jenis === 'menjodohkan'">
            <span v-if="item.pilihan.jenis === 'text'" v-html="item.pilihan.text" /> 
            <div v-else>
              <v-img :src="item.pilihan.file" width="40" />
                <v-tooltip
                  activator="parent"
                  location="top"
                ><v-img :src="item.pilihan.file" width="150" /></v-tooltip>
            </div>
          </span>
          <span v-else>-</span>
        </template>
        <template #[`item.kunci`]="{ item }">
          <span v-html="item.jenis === 'pilihan ganda' || item.jenis === 'menjodohkan' || item.jenis === 'benar salah' ? item.kunci : '-'" /> 
        </template>
        <template #[`item.statusAktif`]="{ item }">
          <v-icon size="small" :color="item.statusAktif ? 'green' : 'red'" :icon="item.statusAktif ? 'mdi mdi-check' : 'mdi mdi-close'" />
        </template>
        <template #[`item.flag`]="{ item }">
          <div class="flag" :style="item.flag ? 'background-color: red;' : 'background-color: green;'" />
        </template>
        <template #expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length">
              <Button 
                color-button="success"
                icon-prepend-button="mdi mdi-pencil"
                nama-button="Ubah"
                size-button="x-small"
                :disabled-button="item.statusAktif === false"
                @proses="openDialog(item, 'ubah')"
              />
              <Button 
                color-button="success"
                size-button="x-small"
                :icon-prepend-button="item.statusAktif === false ? 'mdi mdi-eye' : 'mdi mdi-eye-off'"
                :nama-button="item.statusAktif === false ? 'Active' : 'Non Active'"
                @proses="postRecordTwo(item, 'STATUSRECORD', !item.statusAktif)"
              />
              <v-menu
                open-on-click
                rounded="t-xs b-lg"
                offset-y
                transition="slide-y-transition"
                bottom
              >
                <template v-slot:activator="{ props }">
                  <Button 
                    v-bind="props"
                    color-button="error"
                    icon-prepend-button="mdi mdi-delete"
                    icon-append-button="mdi mdi-menu-down"
                    nama-button="Hapus"
                    size-button="x-small"
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
                    @click="postRecordTwo(item, 'DELETESOFT', null)"
                    class="SelectedMenu"
                    active-class="SelectedMenu-active"
                    title="Delete Soft"
                    :disabled="item.statusAktif === false"
                  >
                    <template v-slot:prepend>
                      <v-icon size="middle" icon="mdi mdi-delete" color="icon-white" />
                    </template>
                    <template v-slot:title>
                      <span class="menufont">Delete Soft</span>
                    </template>
                  </v-list-item>
                  <v-list-item
                    @click="postRecordTwo(item, 'DELETEHARD', null)"
                    class="SelectedMenu"
                    active-class="SelectedMenu-active"
                    title="Delete Hard"
                  >
                    <template v-slot:prepend>
                      <v-icon size="middle" icon="mdi mdi-delete" color="icon-white" />
                    </template>
                    <template v-slot:title>
                      <span class="menufont">Delete Hard</span>
                    </template>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </template>
        <template #top>
          <v-row no-gutters class="pa-2">
            <v-col cols="12" md="6" class="d-flex align-center">
              <Button 
                color-button="light-blue darken-3"
                icon-prepend-button="mdi mdi-plus-thick"
                nama-button="Tambah"
                size-button="x-small"
                @proses="openDialog(null, 'tambah')"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-row no-gutters>
                <v-col cols="12" md="6" class="pr-2">
                  <Autocomplete
                    v-model="pencarian"
                    :data-a="pencarianOptions"
                    label-a="Pilih Jenis"
                    :clearable-a="true"
                    @ubah="() => { page = 1; searchData = null; }"
                    @click:clear="() => { page = 1; pencarian = null; searchData = null; getQuestionExam({page: 1, limit: limit, keyword: ''}); }"
                  />
                </v-col>
                <v-col cols="12" md="6" class="pr-2">
                  <Autocomplete
                    v-model="searchData"
                    :data-a="pencarian === 'Mata Pelajaran' ? optionsMengajar : pencarian === 'Kelas' ? optionsKelas : questionOptions"
                    :label-a="pencarian ? pencarian === 'Mata Pelajaran' ? 'Pilih Mata Pelajaran' : pencarian === 'Kelas' ? 'Pilih Kelas' : 'Pilih Tipe Soal' : 'Pilih Pencarian'"
                    item-title="label"
                    :item-value="pencarian === 'Mata Pelajaran' ? 'value' : (pencarian === 'Tipe Soal' || pencarian === 'Kelas') ? 'link' : null"
                    :disabled-a="!pencarian"
                    :autofocus="false"
                    @ubah="(e) => { page = 1; getQuestionExam({page: 1, limit: limit, keyword: e}); }"
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
              <!-- <span>Halaman <strong>{{ pageSummary.page ? pageSummary.page : 0 }}</strong> dari Total Halaman <strong>{{ pageSummary.totalPages ? pageSummary.totalPages : 0 }}</strong> (Records {{ pageSummary.total ? pageSummary.total : 0 }})</span> -->
              <span style="font-size: 10pt;">Halaman</span>
              <div style="width: 100px; margin-left: 3px; margin-right: 3px;">
                <Autocomplete
                  v-model="page"
                  :data-a="pageOptions"
                  label-a="Page"
                  :disabled-a="DataQuestionExam.length ? false : true"
                />
              </div>
              <span style="font-size: 10pt;">dari Total Halaman <strong>{{ pageSummary.totalPages ? pageSummary.totalPages : 0 }}</strong> (Records {{ pageSummary.total ? pageSummary.total : 0 }})</span>
            </v-col>
            <v-col cols="12" lg="2" class="pa-2 text-right">
              <div class="d-flex justify-start align-center">
                <Autocomplete
                  v-model="limit"
                  pilihan-a="select"
                  :data-a="limitPage"
                  label-a="Limit"
                  :disabled-a="DataQuestionExam.length ? false : true"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="success"
                  icon-button="mdi mdi-arrow-left-circle-outline"
                  :disabled-button="DataQuestionExam.length ? pageSummary.page != 1 ? false : true : true"
                  @proses="() => { page = pageSummary.page - 1 }"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="success"
                  icon-button="mdi mdi-arrow-right-circle-outline"
                  :disabled-button="DataQuestionExam.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
                  @proses="() => { page = pageSummary.page + 1 }"
                />
              </div>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
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
          <v-toolbar-title>{{editedIndex == 'tambah' ? 'Tambah' : 'Ubah'}} Data Question Exam</v-toolbar-title>
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
                item-value="value"
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
                :disabled-a="editedIndex === 'ubah'"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Pertanyaan / Pernyataan
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <TextArea
                v-model="inputDataQuestionExam.pertanyaan"
                label-ta="Pertanyaan / Pernyataan"
                rows="4"
                :clearable-ta="true"
              />
              <Button
                v-if="inputDataQuestionExam.jenis !== null"
                color-button="success"
                icon-prepend-button="mdi mdi-upload"
                nama-button="Upload Gambar Pertanyaan"
                @proses="pilihFile('pertanyaan', null)"
              />
              <input 
                ref="inputPertanyaan"
                :key="componentKey"
                type="file"
                accept=".png,.jpg"
                style="display: none"
                @change="uploadDataFile($event, 'pertanyaan', null)"
              >
              <!-- <div v-if="filePertanyaan !== ''" class="avatar">
                <v-icon v-if="filePertanyaan !== ''" color="red" icon="mdi mdi-delete" style="cursor: pointer;" @click="() => { filePertanyaan = ''; filename = ''; }" />
                <v-img :src="`${BASE_URL}berkas/${filePertanyaan}`" width="100" />
              </div> -->
              <v-checkbox-btn
                v-if="inputDataQuestionExam.jenis !== null"
                v-model="enabledPertanyaan"
                class="pe-2 font-weight-bold"
                :label="`${filePertanyaan ? `File: ${filePertanyaan}` : 'gambar pertanyaan / pernyataan tidak ada'}`"
              />
            </v-col>
          </v-row>
          <v-row no-gutters v-if="inputDataQuestionExam.jenis === 'pilihan ganda' || inputDataQuestionExam.jenis === 'benar salah'">
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
                :data-a="inputDataQuestionExam.jenis === 'pilihan ganda' ? ValuePilihan : ValuePilihan2"
                label-a="Pilih Kunci Jawaban"
                item-title="value"
                item-value="value"
                :clearable-a="true"
              />
            </v-col>
          </v-row>
          <v-row no-gutters v-if="inputDataQuestionExam.jenis === 'pilihan ganda' || inputDataQuestionExam.jenis === 'menjodohkan' || inputDataQuestionExam.jenis === 'benar salah'">
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
                :disabled-tf="inputDataQuestionExam.jenis === 'pilihan ganda' ? false : true"
                @keypress="onlyNumber($event, 1, jumlahPilihan)"
                @input="dataChange(jumlahPilihan, 5)"
              />
            </v-col>
          </v-row>
          <v-row no-gutters v-if="inputDataQuestionExam.jenis === 'pilihan ganda' || inputDataQuestionExam.jenis === 'menjodohkan'">
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
                <!-- @ubah="dataChange2($event)" -->
            </v-col>
          </v-row>
          <v-row v-for="(k, x) in Number(jumlahPilihan)" :key="x" no-gutters>
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
                v-model="TextPilihan[x]"
                :label-ta="`Pilihan ${k}`"
                rows="4"
                class="mt-2"
                :disabled-ta="inputDataQuestionExam.jenis === 'benar salah' ? true : false"
                :clearable-ta="true"
              />
              <Button 
               v-if="JenisPilihan === 'gambar'"
                color-button="success"
                icon-prepend-button="mdi mdi-upload"
                :nama-button="`Upload Gambar Pilihan ${k}`"
                @proses="pilihFile('pilihan', x)"
              />
              <input 
                ref="inputPilihan"
                :key="componentKey"
                type="file"
                accept=".png,.jpg"
                style="display: none"
                @change="uploadDataFile($event, 'pilihan', x)"
              >
              <!-- <div v-if="JenisPilihan === 'gambar'">
                {{ FilePilihan[index].kode }}
                {{ FilePilihan[index].file }}
                <div v-if="FilePilihan[index].kode === `pilihan ${k}` && FilePilihan[index].file !== ''" class="avatar">
                  <v-icon color="red" icon="mdi mdi-delete" style="cursor: pointer;" @click="() => { FilePilihan[index].file = ''; filename = ''; }" />
                  <v-img :src="`${FilePilihan[index].url}${FilePilihan[index].file}`" width="100" />
                </div>
              </div> -->
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
                v-if="editedIndex == 'tambah'" 
                color-button="info"
                nama-button="Simpan Data"
                :disabled-button="kondisiTombol"
                @proses="postRecord('ADD')"
              />
              <Button
                v-if="editedIndex == 'ubah'" 
                color-button="info"
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
      v-model="dialogCrop"
      scrollable
      persistent
      transition="dialog-bottom-transition"
      width="auto"
    >
      <v-card color="background-dialog-card">
        <v-card-text class="pt-4 v-dialog--custom">
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
import { RectangleStencil } from "vue-advanced-cropper";
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
  name: 'QuestionExam',
  components: { PopUpNotifikasi, RectangleStencil },
  data: () => ({
		expanded: [],
		DataQuestionExam: [],
    pencarianOptions: ["Tipe Soal", "Mata Pelajaran", "Kelas"],
    pencarian: null,
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
      { title: "DIBUAT OLEH", key: "createBy", sortable: false, width: "10%" },
      { title: "DIUBAH OLEH", key: "updateBy", sortable: false, width: "10%" },
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
    ValuePilihan2: ["B", "S"],
    TextPilihan: [],
    FilePilihan: [],
    questionOptions: [
      { label: "pilihan ganda", link: "pilihan ganda" }, 
      { label: "essay", link: "essay" }, 
      { label: "menjodohkan", link: "menjodohkan" }, 
      { label: "benar salah", link: "benar salah" }, 
    ],
    jenisPilihanOptions: ["text", "gambar"],
    editedIndex: 'tambah',
    kondisiTombol: true,
    DialogQuestionExam: false,
    dialogCrop: false,
    DetailPilihan: false,
    enabledPertanyaan: false,
    pilihan: [],
    urlSk: window.location.href,
    BASE_URL: process.env.VUE_APP_BASE_URL_VIEW,
    componentKey: 0,
    filePertanyaan: '',
    filename: '',
    jumlahPilihan: 0,
    image: {
      src: null,
      type: null,
      jenis: '',
      index: 0,
    },

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Question Exam",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
		return { RectangleStencil }
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
        if(localStorage.getItem('mengajar_bidang') === '') return []
				let mengajar_bidang = localStorage.getItem('mengajar_bidang').split(', ')
				let result = this.mengajar.filter(val => mengajar_bidang.includes(val.value)).map(x => {
					return x
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
					page: this.DataQuestionExam.length ? value?.pageSummary?.page : 0,
					limit: this.DataQuestionExam.length ? value?.pageSummary?.limit : 0,
					total: this.DataQuestionExam.length ? value?.pageSummary?.total : 0,
					totalPages: this.DataQuestionExam.length ? value?.pageSummary?.totalPages : 0
				}
        for (let index = 1; index <= this.pageSummary.totalPages; index++) {
          this.pageOptions.push(index)
        }
      }
    },
    inputDataQuestionExam: {
      deep: true,
      handler(value){
        if(value.kelas != null && value.mapel != null && value.jenis != null && value.pertanyaan != null){
          this.kondisiTombol = false
        }else{
          this.kondisiTombol = true
        }

        if(value.jenis === 'menjodohkan' && this.editedIndex === 'tambah'){
          this.jumlahPilihan = 1
          this.TextPilihan = []
        }else if(value.jenis === 'benar salah'){
          this.jumlahPilihan = 2
          this.TextPilihan = ["Benar", "Salah"]
        }else if(value.jenis === 'menjodohkan' && this.editedIndex === 'ubah'){
          this.jumlahPilihan = 1
        }
      }
    },
    page: {
			deep: true,
			handler(value) {
        if(value){
          this.getQuestionExam({page: value, limit: this.limit, keyword: this.searchData})
        }
			}
		},
    limit: {
			deep: true,
			handler(value) {
        this.page = 1
				this.getQuestionExam({page: 1, limit: value, keyword: this.searchData})
			}
		},
    searchData: {
			deep: true,
			handler(value) {
        // console.log(value);
			}
		},
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.roleID = localStorage.getItem('roleID')
    this.idLog = localStorage.getItem('idLogin')
		this.getQuestionExam({page: this.page, limit: this.limit, keyword: this.searchData});
		this.getDataMaster({ kode: 'mengajar' })
    this.getKelas({ kondisi: 'All' })
	},
	methods: {
		...mapActions({
			uploadBerkas: 'upload/uploadBerkas',
      getQuestionExam: 'user/getQuestionExam',
			getDataMaster: 'setting/getDataMaster',
      getKelas: 'setting/getKelas',
    }),
    postRecord(jenis) {
      let dataInputPilihan = []
      let valueKunci = this.makeRandom(5)
      for (let index = 0; index < this.jumlahPilihan; index++) {
        dataInputPilihan.push({
          jenis: this.JenisPilihan,
          value: this.inputDataQuestionExam.jenis === 'pilihan ganda' ? this.ValuePilihan[index] : this.inputDataQuestionExam.jenis === 'benar salah' ? this.ValuePilihan2[index] : valueKunci,
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
        pilihan: this.inputDataQuestionExam.jenis === 'essay' ? null : dataInputPilihan,
        kunci: this.inputDataQuestionExam.jenis === 'essay' ? null : this.inputDataQuestionExam.jenis === 'menjodohkan' ? valueKunci : this.inputDataQuestionExam.kunci,
        enabledPertanyaan: this.enabledPertanyaan,
      }
      // return console.log(bodyData);
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
    postRecordTwo(item = null, jenis, statusAktif) {
      let bodyData = {
        proses: jenis,
        kode: item?.kode ? item?.kode : null,
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
      if(index == 'tambah'){
        this.clearData()
      }else{
        this.inputDataQuestionExam = {
          kode: item?.kode,
          mapel: item?.kodemapel,
          kelas: item?.kelas,
          jenis: item?.jenis,
          pertanyaan: item?.pertanyaan?.text,
          kunci: item?.kunci,
        }
        this.filePertanyaan = item?.pertanyaan?.file ? item?.pertanyaan?.file.split('/')[4] : ''
        this.enabledPertanyaan = this.filePertanyaan ? true : false
        this.filename = item?.pertanyaan?.file ? item?.pertanyaan?.file.split('/')[4].split('.')[0] : ''
        if(item?.jenis === 'pilihan ganda' || item?.jenis === 'benar salah'){
          this.jumlahPilihan = item?.pilihan?.length
          this.JenisPilihan = item?.pilihan?.length ? item?.pilihan[0].jenis : ''
          item?.pilihan.map((val, z) => {
            if(val.jenis === 'text'){
              this.FilePilihan = []
              this.TextPilihan.push(val.text)
            }else{
              let fileAkhir = val.file.split('/')
              // this.FilePilihan.push({
              //   kode: `pilihan ${z+1}`,
              //   url: `${this.BASE_URL}berkas/`,
              //   file: fileAkhir[fileAkhir.length - 1],
              // })
              this.FilePilihan.push(fileAkhir[fileAkhir.length - 1])
              this.TextPilihan = []
            }
          })
        }else if(item?.jenis === 'menjodohkan'){
          this.JenisPilihan = item?.pilihan?.jenis
          if(item?.pilihan?.jenis === 'text'){
            this.FilePilihan = []
            this.TextPilihan.push(item?.pilihan?.text)
          }else{
            let fileAkhir = item?.pilihan?.file.split('/')
            // this.FilePilihan.push({
            //   kode: `pilihan 1`,
            //   url: `${this.BASE_URL}berkas/`,
            //   file: fileAkhir[fileAkhir.length - 1],
            // })
            this.FilePilihan.push(fileAkhir[fileAkhir.length - 1])
            this.TextPilihan = []
          }
        }
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
      this.JenisPilihan = 'text'
      this.TextPilihan = []
      this.FilePilihan = []
      this.filePertanyaan = ''
      this.filename = ''
      this.enabledPertanyaan = false
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
      // else if(jenis === 'pilihan') { this.FilePilihan[index].file = `${nama_file}.${ext}`; this.filename = nama_file; }
      this.loadImage(files, jenis, index)
    },
    loadImage(files, jenis, index) {
      this.dialogCrop = true
      const blob = URL.createObjectURL(files);
      const reader = new FileReader();
      reader.onload = (e) => {
        this.image = {
          src: blob,
          type: getMimeType(e.target.result, files.type),
          jenis,
          index,
        }
      }
      reader.readAsArrayBuffer(files);
    },
    crop() {
			const { canvas } = this.$refs.cropper.getResult();
			canvas.toBlob(async (blob) => {
        let uploadberkas = await this.uploadLampiran(blob)
        if(uploadberkas === 'success'){
          if(this.image.jenis === 'pertanyaan') { this.$refs.inputPertanyaan = null; this.enabledPertanyaan = true; }
          if(this.image.jenis === 'pilihan') { this.$refs.inputPilihan[this.image.index].value = null; }
          this.tutupDialogCrop()
          this.notifikasi("success", 'Sukses Unggah File', "1")
        }else{
          if(this.image.jenis === 'pertanyaan') { this.filePertanyaan = ''; this.$refs.inputPertanyaan = null; this.enabledPertanyaan = false; }
          if(this.image.jenis === 'pilihan') { this.FilePilihan.splice(this.image.index, 1); this.$refs.inputPilihan[this.image.index].value = null; }
          // if(jenis === 'pilihan') { this.FilePilihan[index].file = ''; this.$refs.inputPilihan[index].value = null; }
          this.tutupDialogCrop()
          this.notifikasi("warning", 'Gagal Unggah File', "1")
        }
			}, this.image.type);
		},
    async uploadLampiran(dataUpload) {
			if(dataUpload){
				const bodyData = {
					nama_file: this.filename,
					folder: "berkas",
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
    tutupDialogCrop(){
      if(this.image.jenis === 'pertanyaan') { this.$refs.inputPertanyaan = null; }
      if(this.image.jenis === 'pilihan') { this.$refs.inputPilihan[this.image.index].value = null; }
      this.filename = ''
      this.$refs.cropper.value = null
      this.image = {
        src: null,
        type: null,
        jenis: '',
        index: 0,
      }
      this.dialogCrop = false
    },
    dataChange(e, max){
      if(Number(e) > max) this.jumlahPilihan = max
    },
    dataChange2(e){
      this.FilePilihan = []
      if(e === 'gambar'){
        for (let index = 0; index < this.jumlahPilihan; index++) {
          this.FilePilihan.push({
            kode: `pilihan ${index+1}`,
            url: `${this.BASE_URL}berkas/`,
            file: "",
          })
        }
      }
    },
    clickrow(event, data) {
      const index = this.$data.expanded.find(i => i === data?.item?.kode);
      if(typeof index === 'undefined') return this.$data.expanded = [];
      this.$data.expanded.splice(0, 1)
      this.$data.expanded.push(data?.item?.kode);
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
.listData {
	width: 200px !important;
}
.cropper {
  border: solid 3px #ff0000;
  min-height: 450px;
  width: auto;
}
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
  background-color: #272727;
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
  height: auto;
}
</style>