<template>
  <div>
    <h1 class="subheading grey--text text-decoration-underline">Data Jadwal Mengajar</h1>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-data-table
        loading-text="Sedang memuat... Harap tunggu"
        no-data-text="Tidak ada data yang tersedia"
        no-results-text="Tidak ada catatan yang cocok ditemukan"
        :headers="headers"
        :loading="loadingtable"
        :items="DataJadwalMengajar"
        :expand-on-click="DialogMataPelajaran === false ? true : false"
        item-value="idUser"
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
        <template #[`item.number`]="{ item }">
          {{ page > 1 ? ((page - 1)*limit) + item.index + 1 : item.index + 1 }}
        </template>
        <template #[`item.nama`]="{ item }">
          <span v-html="uppercaseLetterFirst2(item.raw.nama)" /> 
        </template>
        <template #[`item.datamapel`]="{ item }">
          <v-chip-group>
            <v-chip v-for="(val, i) in item.raw.dataJadwalMengajar" :key="i" class="box fourcorners" @click="bukadialog(item.raw.dataJadwalMengajar[i], val.mapel.kodeMapel, item.raw)"><strong><span v-html="val.mapel.namaMapel" /></strong></v-chip>
          </v-chip-group>
        </template>
        <template #[`item.datakelas`]="{ item }">
          <v-chip-group>
            <v-chip v-for="(val, i) in item.raw.kelas" :key="i" class="box fourcorners"><strong><span v-html="val" /></strong></v-chip>
          </v-chip-group>
        </template>
        <template #expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length">
              <Button 
                color-button="#0bd369"
                icon-prepend-button="mdi mdi-pencil"
                nama-button="Ubah"
                @proses="ubahData(item.raw)"
              />
            </td>
          </tr>
        </template>
        <template #top>
          <v-row no-gutters class="pa-2">
            <v-col cols="12" md="6">
              <Button 
                color-button="light-blue darken-3"
                icon-prepend-button="mdi mdi-view-list"
                nama-button="Jadwal Pelajaran"
                @proses="lookJadwal()"
              />
            </v-col>
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
    </v-card>
    <v-dialog
      v-model="DialogJadwalMengajar"
      scrollable
      persistent
      transition="dialog-bottom-transition"
      width="auto"
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
                v-model="inputData.mapel"
                :data-a="mengajarOptions"
                label-a="Pilih Mata Pelajaran"
                item-title="label"
                item-value="kode"
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
                @proses="SimpanForm('JadwalMengajar')"
              />
						</v-col>
					</v-row>
				</v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="DialogMataPelajaran"
      scrollable
      persistent
      transition="dialog-bottom-transition"
      width="auto"
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
              @proses="() => { DialogMataPelajaran = false; dataKelasMapel = []; inputData2 = { idJadwalMengajar: [], idUser: '', mapel: '', hari: [], kelas: [], timeRange: [], tautan: [] } }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4 v-dialog--custom">
          <div
            style="background-color: #4CAF50; border-radius: 5px; border: 2px solid #000;"
            class="pa-2 mb-2"
            v-for="(data, index) in dataKelasMapel"
            :key="data.idJadwalMengajar"
          >
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
                  :value="data.kelas"
                  :readonly-tf="true"
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col
                cols="12"
                md="4"
                class="pt-2 d-flex align-center font-weight-bold"
              >
                Hari
              </v-col>
              <v-col
                cols="12"
                md="8"
                class="pt-3"
              >
                <Autocomplete
                  v-model="inputData2.hari[index]"
                  pilihan-a="autocomplete"
                  :data-a="optionsHari"
                  label-a="Hari"
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
                Waktu Jadwal
              </v-col>
              <v-col
                cols="12"
                md="8"
                class="pt-3"
              >
                <vue-date-picker
                  v-model="inputData2.timeRange[index]"
                  placeholder="Range Waktu Jadwal"
                  time-picker
                  range
                  hide-input-icon
                  clearable
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col
                cols="12"
                md="4"
                class="pt-2 d-flex align-center font-weight-bold"
              >
                Modul Digital
              </v-col>
              <v-col
                cols="12"
                md="8"
                class="pt-3"
              >
                <Autocomplete
                  v-model="inputData2.tautan[index]"
                  pilihan-a="autocomplete"
                  :data-a="berkasOptions"
                  item-title="title"
                  item-value="idBerkas"
                  label-a="Modul Digital"
                  :clearable-a="true"
                />
              </v-col>
            </v-row>
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
                nama-button="Ubah Data"
                @proses="SimpanForm('ModulAndTime')"
              />
						</v-col>
					</v-row>
				</v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="DialogJadwalPelajaran"
      fullscreen
      scrollable
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Jadwal Pelajaran</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { DialogJadwalPelajaran = false; }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="ScrollFullscreen">
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pa-1"
            >
            <table dark class="tableClass mb-2">
                <thead>
                  <tr>
                    <th class="thSClass">Nama Guru</th>
                    <th class="thSClass">Jabatan</th>
                    <th class="thSClass">Mengajar</th>
                    <!-- <th class="thSClass">Kelas</th> -->
                  </tr>
                </thead>
                <tbody v-for="data in dataGuru" :key="data.nomorInduk">
                  <template v-if="!data.mengajarBidang.length">
                    <tr>
                      <td class="tdSClass">{{ data.nama }}</td>
                      <td class="tdSClass">{{ data.waliKelas ? `${data.jabatanGuru.map(val => val.label).join(", ")} (${data.waliKelas})` : data.jabatanGuru.map(val => val.label).join(", ") }}</td>
                      <td class="tdSClass">-</td>
                      <!-- <td class="tdSClass">-</td> -->
                    </tr>
                  </template>
                  <template v-else>
                    <tr>
                      <td :rowspan="data.mengajarBidang.length" class="tdSClass">{{ data.nama }}</td>
                      <td :rowspan="data.mengajarBidang.length" class="tdSClass">{{ data.waliKelas ? `${data.jabatanGuru.map(val => val.label).join(", ")} (${data.waliKelas})` : data.jabatanGuru.map(val => val.label).join(", ") }}</td>
                      <td class="tdSClass" :style="`background-color: ${data.mengajarBidang[0].color};`">{{ `${data.mengajarBidang[0].label} (${data.mengajarBidang[0].alias})` }}</td>
                      <!-- <td :rowspan="data.mengajarBidang.length" class="tdSClass">{{ data.mengajarKelas }}</td> -->
                    </tr>
                    <tr v-for="x in data.mengajarBidang.length-1" :key="x">
                      <td class="tdSClass" :style="`background-color: ${data.mengajarBidang[x].color};`">{{ `${data.mengajarBidang[x].label} (${data.mengajarBidang[x].alias})` }}</td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pa-1"
            >
              <table dark class="tableClass mb-10">
                <thead>
                  <tr>
                    <!-- <th width="5%" class="thClass">Hari</th>
                    <th width="10%" class="thClass">Waktu</th> -->
                    <th rowspan="2" class="thClass">Hari</th>
                    <th rowspan="2" class="thClass">Waktu</th>
                    <th :colspan="dataKelas.length" class="thClass">Mata Pelajaran Per Kelas</th>
                  </tr>
                  <tr>
                    <th v-for="(data, index) in dataKelas" :key="index" class="thClass">{{ data.kelas }}</th>
                  </tr>
                </thead>
                <tbody v-for="(data, index) in DataJadwalPelajaran" :key="index">
                  <tr>
                    <td :rowspan="data.dataJadwal.length" class="tdClass textHari">{{ data.hari.toUpperCase() }}</td>
                    <td class="tdClass">{{ data.dataJadwal[0].waktu }}</td>
                    <td :colspan="dataKelas.length" v-for="(datas, z) in data.dataJadwal[0].jadwal" :key="z" class="tdClass" style="background-color: #FFF">{{ datas.alias }}</td>
                  </tr>
                  <template v-for="x in data.dataJadwal.length-1" :key="x">
                    <tr v-if="data.dataJadwal[x].waktu === '09:30:00 - 10:00:00' || data.dataJadwal[x].waktu === '11:30:00 - 12:30:00'">
                      <td class="tdClass">{{ data.dataJadwal[x].waktu }}</td>
                      <td :colspan="dataKelas.length" class="tdClass" style="background-color: #FFF">{{ data.dataJadwal[x].jadwal[0].alias }}</td>
                    </tr>
                    <tr v-else>
                      <td class="tdClass">{{ data.dataJadwal[x].waktu }}</td>
                      <td v-for="(datas, z) in dataKelas" :key="z" class="tdClass" :style="`background-color: ${data.dataJadwal[x].jadwal.filter(val => val.kelas === datas.kelas).length ? data.dataJadwal[x].jadwal.filter(val => val.kelas === datas.kelas)[0].color : '#e1e1f0'};`">
                        {{ data.dataJadwal[x].jadwal.filter(val => val.kelas === datas.kelas).length ? data.dataJadwal[x].jadwal.filter(val => val.kelas === datas.kelas)[0].alias : '' }}
                        <!-- <br>{{ data.dataJadwal[x].jadwal.filter(val => val.kelas === datas.kelas).length ? data.dataJadwal[x].jadwal.filter(val => val.kelas === datas.kelas)[0].namaGuru : '' }} -->
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
              <table border="0" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 20px;">
                <tr>
                  <td style="width: 50%;">
                    <table border="0" width="300px" cellspacing="0" cellpadding="0" style="float: left; margin-left: 80px;">
                      <tr class="ttd">
                        <td style="padding-bottom: 10px;">Mengetahui,</td>
                      </tr>
                      <tr class="ttd">
                        <td>{{ `Kepala Sekolah ${dataTTD.ttd.namasekolah}` }}</td>
                      </tr>
                      <tr class="ttd">
                        <td style="padding: 10px 0px;">
                          <template v-if="dataTTD.kepalasekolah.signature !== null">
                            <v-img
                              :src="`${dataTTD.url}/image/${dataTTD.kepalasekolah.signature}`"
                              width="80px"
                              height="80px"
                            />
                          </template>
                        </td>
                      </tr>
                      <tr class="ttd">
                        <td style="text-decoration: underline;">{{ dataTTD.kepalasekolah.nama }}</td>
                      </tr>
                      <tr class="ttd">
                        <td>{{ `NIP. ${dataTTD.kepalasekolah.nomorInduk}` }}</td>
                      </tr>
                    </table>
                  </td>
                  <td style="width: 50%;">
                    <table border="0" width="300px" cellspacing="0" cellpadding="0" style="float: right;">
                      <tr class="ttd">
                        <td style="padding-bottom: 10px;">{{ `${dataTTD.ttd.tempat}, ${dataTTD.ttd.tanggal}` }}</td>
                      </tr>
                      <tr class="ttd">
                        <td>{{ `WaKaBid. Kurikulum ${dataTTD.ttd.namasekolah}` }}</td>
                      </tr>
                      <tr class="ttd">
                        <td style="padding: 10px 0px;">
                          <template v-if="dataTTD.kurikulum.signature !== null">
                            <v-img
                              :src="`${dataTTD.url}/image/${dataTTD.kurikulum.signature}`"
                              width="80px"
                              height="80px"
                            />
                          </template>
                        </td>
                      </tr>
                      <tr class="ttd">
                        <td style="text-decoration: underline;">{{ dataTTD.kurikulum.nama }}</td>
                      </tr>
                      <tr class="ttd">
                        <td>{{ `NIP. ${dataTTD.kurikulum.nomorInduk}` }}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
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
              <!-- <Button 
                color-button="black"
                nama-button="Lihat Point"
                @proses="UpdatePoint()"
              /> -->
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
  name: 'DataJadwalMengajar',
  components: {
    PopUpNotifikasi
  },
  data: () => ({
		expanded: [],
		DataJadwalMengajar: [],
		DataJadwalPelajaran: [],
		dataKelas: [],
		dataGuru: [],
		dataKelasMapel: [],
		dataTTD: {
      kepalasekolah: {
        idUser: '',
        nama: '',
        nomorInduk: '',
        signature: '',
      },
      kurikulum: {
        idUser: '',
        nama: '',
        nomorInduk: '',
        signature: '',
      },
      ttd: {
        namasekolah: '',
        tempat: '',
        tanggal: '',
      },
      url: '',
    },
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
      { title: "KELAS", key: "datakelas", sortable: false, width: "35%" },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
    DialogJadwalMengajar: false,
    DialogMataPelajaran: false,
    DialogJadwalPelajaran: false,
    inputData: {
      idUser: '',
      mapel: '',
      kelas: '',
    },
    inputData2: {
      idJadwalMengajar: [],
      idUser: '',
      mapel: '',
      kelas: [],
      hari: [],
      timeRange: [],
      tautan: [],
    },
    optionsHari: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],

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
      berkas: store => store.setting.berkasOptions,
      loadingtable: store => store.user.loadingtable, 
    }),
    ...mapGetters({
      jadwalMengajarAll: 'user/jadwalMengajarAll',
      jadwalPelajaranAll: 'user/jadwalPelajaranAll',
    }),
    berkasOptions(){
			return this.berkas
		},
  },
  watch: {
    jadwalPelajaranAll: {
			deep: true,
			handler(value) {
        this.DataJadwalPelajaran = value.result
        this.dataKelas = value.dataKelas
        this.dataGuru = value.dataGuru
        this.dataTTD = {
          kepalasekolah: {
            idUser: value.kepalaSekolah.idUser,
            nama: value.kepalaSekolah.nama,
            nomorInduk: value.kepalaSekolah.nomorInduk,
            signature: value.kepalaSekolah.signature,
          },
          kurikulum: {
            idUser: value.kurikulum.idUser,
            nama: value.kurikulum.nama,
            nomorInduk: value.kurikulum.nomorInduk,
            signature: value.kurikulum.signature,
          },
          ttd: {
            namasekolah: value.ttd.namasekolah,
            tempat: value.ttd.tempat,
            tanggal: value.ttd.tanggal,
          },
          url: value.url,
        }
      }
    },
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
        if(value){
          this.getJadwalMengajar({page: value, limit: this.limit, keyword: this.searchData})
        }
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
      getJadwalPelajaran: 'user/getJadwalPelajaran', 
      getMengajar: 'setting/getMengajar', 
      getKelas: 'setting/getKelas',
			getBerkas: "setting/getBerkas",
    }),
    SimpanForm(jenis) {
      let bodyData = {
        jenis,
        idJadwalMengajar: jenis === 'JadwalMengajar' ? null : this.inputData2.idJadwalMengajar,
        idUser: jenis === 'JadwalMengajar' ? this.inputData.idUser : this.inputData2.idUser,
        kelas: jenis === 'JadwalMengajar' ? this.inputData.kelas : this.inputData2.kelas,
        hari: jenis === 'JadwalMengajar' ? null : this.inputData2.hari,
        mapel: jenis === 'JadwalMengajar' ? this.inputData.mapel : this.inputData2.mapel,
        timeJadwal: jenis === 'JadwalMengajar' ? null : this.inputData2.timeRange,
        tautan: jenis === 'JadwalMengajar' ? null : this.inputData2.tautan,
      }
      // return console.log(bodyData);
      this.$store.dispatch('user/postJadwalMengajar', bodyData)
      .then((res) => {
        jenis === 'JadwalMengajar' ? this.DialogJadwalMengajar = false : this.DialogMataPelajaran = false
        jenis === 'JadwalMengajar' ? this.inputData = { idUser: '', mapel: '', kelas: '' } : this.dataKelasMapel = []; this.inputData2 = { idJadwalMengajar: [], idUser: '', mapel: '', hari: [], kelas: [], timeRange: [], tautan: [] }
        this.getJadwalMengajar({page: 1, limit: this.limit, keyword: this.searchData})
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    bukadialog(item, mapel, data){
      this.getBerkas({kategori: 'tautan'})
      this.dataKelasMapel = item.resdata
      this.inputData2.idUser = data.idUser
      this.inputData2.mapel = mapel
      for (let index = 0; index < (this.dataKelasMapel.length); index++) {
        this.inputData2.tautan.push(this.dataKelasMapel[index].modul)
        this.inputData2.idJadwalMengajar.push(this.dataKelasMapel[index].idJadwalMengajar)
        this.inputData2.kelas.push(this.dataKelasMapel[index].kelas)
        this.inputData2.hari.push(this.dataKelasMapel[index].hari)
        if(this.dataKelasMapel[index].startTime || this.dataKelasMapel[index].endTime){
          this.inputData2.timeRange.push([this.dataKelasMapel[index].startTime, this.dataKelasMapel[index].endTime])
        }else{
          this.inputData2.timeRange.push([])
        }
      }
      this.DialogMataPelajaran = true
    },
    lookJadwal(){
      // this.getJadwalPelajaran({ untuk: 'admin' })
      this.getJadwalPelajaran()
      this.DialogJadwalPelajaran = true
    },
    ubahData(item){
		  this.getMengajar()
      this.getKelas({ kondisi: 'All' })
      this.inputData = {
        idUser: item.idUser,
        mapel: item.dataJadwalMengajar.map(str => str.mapel.kodeMapel),
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
.tableClass, .tdClass, .thClass {
  border: 2px solid #FFF;
  padding: 5px;
  text-align: center;
	font-size: 7.5pt;
  font-weight: bold;
}
.tableClass, .tdSClass, .thSClass {
  border: 2px solid #FFF;
  padding: 5px;
  text-align: center;
	font-size: 7.5pt;
  font-weight: bold;
}
.tdSClass {
  text-align: left;
}
.thClass, .thSClass {
  border: 2px solid #FFF;
  background-color: #000;
  color: #FFF;
}
.tableClass {
  /* width: 50%; */
  width: 100%;
  border-collapse: collapse;
}
.textHari {
  writing-mode: vertical-rl;
  text-orientation: upright;
}
.ttd{ 
  font-size: 10px; 
  font-weight: bold;
}
.box{
  width: auto;
	height: 30px;
  background-image:-moz-linear-gradient(top, #272727, #5a5757);
	background-image: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#272727), to(#5a5757), color-stop(1,#5a5757));
	/* margin: 3px; */
  color: #FFF;
}
.fourcorners{
	-moz-border-radius: 10px;
	-webkit-border-radius: 10px;
	-khtml-border-radius: 10px; 
	border-radius: 10px;
  border: 1px solid white;
	padding: 10px;
  display: flex;
  justify-content: center;
  text-align: center;
  flex-direction: column;
	font-size: 12px;
  cursor: pointer;
}
</style>