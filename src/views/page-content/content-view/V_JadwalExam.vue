<template>
  <div>
    <h2 class="subheading grey--text text-decoration-underline">Data Jadwal Exam</h2>
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
            <li>- Untuk import nilai pastikan sudah mendapatkan template data jadwal exam</li>
            <li>- Mengurutkan data berdasarkan MATA PELAJARAN, KELAS, STATUS.</li>
          </ul>
        </template>
      </v-alert>
      <v-data-table
        v-model="selectRecord"
        loading-text="Sedang memuat... Harap tunggu"
        no-data-text="Tidak ada data yang tersedia"
        no-results-text="Tidak ada catatan yang cocok ditemukan"
        :headers="headers"
        :loading="loadingtable"
        :items="DataJadwalExam"
        expand-on-click
        item-value="idJadwalExam"
        :sort-by="sortBy"
        density="comfortable"
        hide-default-footer
        multi-sort
        class="elavation-3 rounded"
        sort-asc-icon="mdi mdi-sort-alphabetical-ascending"
        sort-desc-icon="mdi mdi-sort-alphabetical-descending"
        :items-per-page="itemsPerPage"
        @page-count="pageCount = $event"
        @click:row="clickrow"
        @update:modelValue="(event) => { selectRecord = event; }"
        v-model:expanded="expanded"
        @update:sort-by="updateSort($event)"
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
        <template #[`item.number`]="{ index }">
          {{ page > 1 ? ((page - 1)*limit) + index + 1 : index + 1 }}
        </template>
        <template #[`item.waktu`]="{ item }">
          <span v-html="`${item.waktu} menit`" /> 
        </template>
        <template #[`item.startDate`]="{ item }">
          <span v-html="convertDateTime(item.startDate)" /> 
        </template>
        <template #[`item.endDate`]="{ item }">
          <span v-html="convertDateTime(item.endDate)" /> 
        </template>
        <template #[`item.status`]="{ item }">
          <v-icon size="small" :color="item.status ? 'green' : 'red'" :icon="item.status ? 'mdi mdi-check' : 'mdi mdi-close'" />
        </template>
        <template #expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length">
              <Button 
                v-if="kondisiJabatan"
                color-button="success"
                icon-prepend-button="mdi mdi-pencil"
                nama-button="Ubah"
                size-button="x-small"
                :disabled-button="!item.status"
                @proses="openDialog(item, 1)"
              />
              <Button 
                v-if="kondisiJabatan"
                color-button="success"
                size-button="x-small"
                :icon-prepend-button="!item.status ? 'mdi mdi-eye' : 'mdi mdi-eye-off'"
                :nama-button="!item.status ? 'Active' : 'Non Active'"
                @proses="postRecord('STATUSRECORD', item, !item.status)"
              />
              <Button 
                v-if="kondisiJabatan"
                color-button="error"
                icon-prepend-button="mdi mdi-delete"
                nama-button="Hapus"
                size-button="x-small"
                :disabled-button="!item.status"
                @proses="postRecord('DELETE', item, null)"
                />
                <Button 
                color-button="success"
                icon-prepend-button="mdi mdi-pencil"
                nama-button="Pilih Soal"
                size-button="x-small"
                @proses="SelectExam(item)"
                :disabled-button="roleID === '3' ? !kondisiMengajar.includes(String(item.kodemapel)) || !kondisiKelas.includes(item.kelas) : false"
              />
              <Button 
                color-button="info"
                icon-prepend-button="mdi mdi-information"
                nama-button="Detail"
                size-button="x-small"
                @proses="openDialog(item, 2)"
              />
            </td>
          </tr>
        </template>
        <template #top>
          <v-row no-gutters class="pa-2">
            <v-col cols="12" md="6" class="d-flex align-center">
              <Button 
                v-if="kondisiJabatan"
                color-button="light-blue darken-3"
                icon-prepend-button="mdi mdi-plus-thick"
                nama-button="Tambah"
                size-button="x-small"
                @proses="openDialog(null, 0)"
              />
              <Button 
                v-if="kondisiJabatan"
                color-button="success"
                icon-prepend-button="mdi mdi-import"
                nama-button="Import Data"
                size-button="x-small"
                @proses="() => { dialogImport = true }"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-row no-gutters>
                <v-col cols="12" md="6" class="pr-2">
                  <Autocomplete
                    v-model="pencarian.mapel"
                    :data-a="mengajarOptions"
                    label-a="Pilih Mata Pelajaran"
                    item-title="label"
                    item-value="value"
                    :clearable-a="true"
                    @click:clear="() => { page = 1; getJadwalExam({page: 1, limit, kelas: pencarian.kelas, mapel: null, sorting: kumpulSort}); }"
                    @ubah="(e) => { page = 1; getJadwalExam({page: 1, limit, kelas: pencarian.kelas, mapel: e, sorting: kumpulSort}); }"
                  />
                </v-col>
                <v-col cols="12" md="6" class="pr-2">
                  <Autocomplete
                    v-model="pencarian.kelas"
                    :data-a="kelasOptions"
                    label-a="Pilih Kelas"
                    item-title="kelas"
                    item-value="kelas"
                    :clearable-a="true"
                    @click:clear="() => { page = 1; getJadwalExam({page: 1, limit, kelas: null, mapel: pencarian.mapel, sorting: kumpulSort}); }"
                    @ubah="(e) => { page = 1; getJadwalExam({page: 1, limit, kelas: e, mapel: pencarian.mapel, sorting: kumpulSort}); }"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-divider :thickness="2" class="border-opacity-100" color="white" />
        </template>
        <template #bottom>
          <v-divider v-if="kondisiJabatan" :thickness="2" class="border-opacity-100" color="white" />
          <v-row no-gutters v-if="kondisiJabatan">
            <v-col cols="12" class="pa-2 d-flex justify-start align-center">
              <Button
                v-if="DataJadwalExam.length && selectRecord.length < DataJadwalExam.length"
                color-button="success"
                icon-prepend-button="mdi mdi-select-all"
                size-button="x-small"
                :nama-button="`Choose All (${selectRecord.length})`"
                @proses="allData(DataJadwalExam)"
              />
              <Button
                v-if="selectRecord.length"
                color-button="success"
                icon-prepend-button="mdi mdi-select-remove"
                size-button="x-small"
                :nama-button="`Remove Select`"
                @proses="() => { selectRecord = [] }"
              />
              <Button 
                color-button="error"
                icon-prepend-button="mdi mdi-delete"
                nama-button="Hapus Record Selected"
                size-button="x-small"
                :disabled-button="!DataJadwalExam.length"
                @proses="hapusAllRecord()"
              />
            </v-col>
          </v-row>
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
                  :disabled-a="!DataJadwalExam.length"
                />
              </div>
              <span style="font-size: 10pt;">dari Total Halaman <strong>{{ pageSummary?.totalPages }}</strong> (Records {{ pageSummary?.total }})</span>
            </v-col>
            <v-col cols="12" lg="2" class="pa-2 text-right">
              <div class="d-flex justify-start align-center">
                <Autocomplete
                  v-model="limit"
                  pilihan-a="select"
                  :data-a="limitPage"
                  label-a="Limit"
                  :disabled-a="!DataJadwalExam.length"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="success"
                  icon-button="mdi mdi-arrow-left-circle-outline"
                  :disabled-button="!DataJadwalExam.length || !(pageSummary.page != 1)"
                  @proses="() => { page = pageSummary.page - 1 }"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="success"
                  icon-button="mdi mdi-arrow-right-circle-outline"
                  :disabled-button="!DataJadwalExam.length || !(pageSummary.page != pageSummary.totalPages)"
                  @proses="() => { page = pageSummary.page + 1 }"
                />
              </div>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="DialogJadwalExam"
      scrollable
      persistent
      transition="dialog-bottom-transition"
      width="auto"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>{{editedIndex == 0 ? 'Tambah' : editedIndex == 1 ? 'Ubah' : 'View'}} Data Exam</v-toolbar-title>
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
                item-value="value"
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
                :teleport="true"
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
                  <v-checkbox-btn
                    v-model="checkTempPilihan"
                    label="Pilihan Ganda"
                    class="pe-2 font-weight-bold"
                    :readonly="editedIndex === 2"
                  />
                  <TextField
                    v-model="limitSoal.pilihanganda"
                    label-tf="Limit Soal Pilihan Ganda"
                    :clearable-tf="editedIndex !== 2"
                    :readonly-tf="editedIndex === 2"
                    :disabled-tf="!checkTempPilihan"
                    @keypress="onlyNumber($event, 2, limitSoal.pilihanganda)"                          
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  class="pl-1"
                >
                  <v-checkbox-btn
                    v-model="checkTempEssay"
                    label="Essay"
                    class="pe-2 font-weight-bold"
                    :readonly="editedIndex === 2"
                  />
                  <TextField
                    v-model="limitSoal.essay"
                    label-tf="Limit Soal Essay"
                    :clearable-tf="editedIndex !== 2"
                    :readonly-tf="editedIndex === 2"
                    :disabled-tf="!checkTempEssay"
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
                  <v-checkbox-btn
                    v-model="checkTempMenjodohkan"
                    label="Menjodohkan"
                    class="pe-2 font-weight-bold"
                    :readonly="editedIndex === 2"
                  />
                  <TextField
                    v-model="limitSoal.menjodohkan"
                    label-tf="Limit Soal Menjodohkan"
                    :clearable-tf="editedIndex !== 2"
                    :readonly-tf="editedIndex === 2"
                    :disabled-tf="!checkTempMenjodohkan"
                    @keypress="onlyNumber($event, 2, limitSoal.menjodohkan)"                          
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  class="pl-1"
                >
                  <v-checkbox-btn
                    v-model="checkTempBS"
                    label="Benar Salah"
                    class="pe-2 font-weight-bold"
                    :readonly="editedIndex === 2"
                  />
                  <TextField
                    v-model="limitSoal.benarsalah"
                    label-tf="Limit Soal Benar Salah"
                    :clearable-tf="editedIndex !== 2"
                    :readonly-tf="editedIndex === 2"
                    :disabled-tf="!checkTempBS"
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
                color-button="info"
                nama-button="Random Soal"
                :disabled-button="!inputDataJadwalExam?.mapel || !inputDataJadwalExam?.kelas || (!checkTempPilihan && !checkTempEssay && !checkTempBS && !checkTempMenjodohkan)"
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
                color-button="info"
                nama-button="Simpan Data"
                :disabled-button="kondisiTombol"
                @proses="postRecord('ADD')"
              />
              <Button
                v-if="editedIndex == 1" 
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
      v-model="DialogPilihExam"
      fullscreen
      scrollable
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Pilih Soal Exam</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => {
                inputDataJadwalExam.idJadwalExam = '';
                DialogPilihExam = false;
                dataAvailable = [];
                dataSelected = [];
                available = [];
                selected = [];
                itemJenis = '';
              }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4 ScrollFullscreen">
          <v-row no-gutters>
            <v-col cols="12" class="pb-4 d-flex justify-center align-center">
              <Button
                v-for="item in itemsButton" :key="item.code"
                color-button="#4CAF50"
                :icon-prepend-button="item.icon"
                :nama-button="item.text"
                @click="() => { 
                  dataAvailable = [];
                  dataSelected = [];
                  available = [];
                  selected = [];
                  itemJenis = item.text.toLowerCase();
                  listPickExam(1);
                }"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" lg="5">
              <v-card>
                <v-toolbar color="surface">
                  <v-toolbar-title>Soal Tersedia</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <span>
                    <Button
                      size-button="large"
                      model-button="comfortable"
                      color-button="#FFFFFF"
                      class="ma-2"
                      icon-button="mdi mdi-close"
                      :disabled-button="!available.length"
                      @proses="clearAvailable()"
                    />
                    <v-tooltip activator="parent" location="left">hapus pilihan</v-tooltip>
                  </span>
                    <!-- :tooltip-condition-button="true"
                    tooltip-position-button="left"
                    tooltip-button="hapus pilihan" -->
                </v-toolbar>
                <v-divider :thickness="2" class="border-opacity-100" color="white" />
                <v-list v-if="dataAvailable.length" lines="three" nav density="comfortable" class="list-pick">
                  <v-infinite-scroll @load="load" side="end">
                    <v-list-item
                      v-for="(item) in dataAvailable" 
                      :key="item.kode"
                      :active="item.status === 'aktif'"
                      :title="item.kode"
                      @click="pilihDataAvailable(item.kode)"
                    >
                    <template v-slot:title>
                      <span v-html="`${item.kode} (${item.namamapel} - ${item.kelas})`" />
                    </template>
                    <template v-slot:subtitle>
                      <span v-if="item.pertanyaan.file === null" v-html="item.pertanyaan.text" /> 
                      <div v-else>
                        <span>
                          <v-img :src="item.pertanyaan.file" width="40" />
                          <v-tooltip activator="parent" location="right"><v-img :src="item.pertanyaan.file" width="200" /></v-tooltip>
                        </span>
                        <span v-html="item.pertanyaan.text" />
                      </div>
                    </template>
                    </v-list-item>
                    <template v-slot:empty>
                      <v-alert type="warning" style="margin-top: 10px">Tidak ada data lagi ...</v-alert>
                    </template>
                  </v-infinite-scroll>
                </v-list>
                <div v-else class="wadah-kategori">List Soal tidak tersedia</div>
                <v-divider :thickness="2" class="border-opacity-100" color="white" />
                <div class="wadah-kategori">
                  <!-- <Button
                    class="kotak-type"
                    nama-button="Tampilkan lebih banyak lagi"
                    :disabled-button="!pageSummary2.hasNext"
                    @proses="listPickExam(pageSummary2.page + 1)"
                  /> -->
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" lg="2" class="tombol">
              <!-- <Button
                size-button="large"
                model-button="comfortable"
                color-button="#272727"
                class="ma-2"
                icon-button="mdi mdi-arrow-left-thick"
              /> -->
              <div class="kotak-panel">{{ `Panel ${uppercaseLetterFirst2(itemJenis)}` }}</div>
              <span>
                <Button
                  size-button="large"
                  model-button="comfortable"
                  color-button="#272727"
                  class="ma-2"
                  icon-button="mdi mdi-arrow-left"
                  :disabled-button="selected.length ? false : true"
                  @proses="moveLeft()"
                />
                <v-tooltip activator="parent" location="right">move left</v-tooltip>
              </span>
                <!-- :tooltip-condition-button="true"
                tooltip-position-button="right"
                tooltip-button="move left" -->
              <span>
                <Button
                  size-button="large"
                  model-button="comfortable"
                  color-button="#272727"
                  class="ma-2"
                  icon-button="mdi mdi-arrow-right"
                  :disabled-button="available.length ? false : true"
                  @proses="moveRight()"
                />
                <v-tooltip activator="parent" location="left">move right</v-tooltip>
              </span>
                <!-- :tooltip-condition-button="true"
                tooltip-position-button="left"
                tooltip-button="move right" -->
              <!-- <Button
                size-button="large"
                model-button="comfortable"
                color-button="#272727"
                class="ma-2"
                icon-button="mdi mdi-arrow-right-thick"
              /> -->
            </v-col>
            <v-col cols="12" lg="5">
              <v-card>
                <v-toolbar color="surface">
                  <v-toolbar-title>Soal Terpilih</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <span>
                    <Button
                      size-button="large"
                      model-button="comfortable"
                      color-button="#FFFFFF"
                      class="ma-2"
                      icon-button="mdi mdi-close"
                      :disabled-button="!selected.length"
                      @proses="clearSelected()"
                    />
                    <v-tooltip activator="parent" location="left">hapus pilihan</v-tooltip>
                  </span>
                    <!-- :tooltip-condition-button="true"
                    tooltip-position-button="left"
                    tooltip-button="hapus pilihan" -->
                </v-toolbar>
                <v-divider :thickness="2" class="border-opacity-100" color="white" />
                <v-list v-if="dataSelected.length" lines="three" nav density="comfortable" class="list-pick">
                  <v-list-item
                    v-for="item in dataSelected" 
                    :key="item.kode"
                    :active="item.status === 'aktif'"
                    :title="item.kode"
                    @click="pilihDataSelected(item.kode)"
                  >
                  <template v-slot:title>
                    <span v-html="`${item.kode} (${item.namamapel} - ${item.kelas})`" />
                  </template>
                  <template v-slot:subtitle>
                    <span v-if="item.pertanyaan.file === null" v-html="item.pertanyaan.text" /> 
                    <div v-else>
                      <span>
                        <v-img :src="item.pertanyaan.file" width="40" />
                        <v-tooltip activator="parent" location="right"><v-img :src="item.pertanyaan.file" width="200" /></v-tooltip>
                      </span>
                      <span v-html="item.pertanyaan.text" />
                    </div>
                  </template>
                  </v-list-item>
                </v-list>
                <div v-else class="wadah-kategori">Belum ada yg dipilih</div>
                <v-divider :thickness="2" class="border-opacity-100" color="white" />
                <div class="wadah-kategori">
                  <Button
                    class="kotak-type"
                    nama-button="Update Soal"
                    :disabled-button="!dataSelected.length"
                    @proses="ChooseQuestionProses()"
                  />
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogImport"
      scrollable
			persistent
      transition="dialog-bottom-transition"
      width="800px"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Import Data Jadwal Exam</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { dialogImport = false; }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4">
          <v-card class="pa-2 d-flex justify-center align-center" elevation="1" outlined>
            <div class="kotak" @click="$refs.inputExcel.click()">
              <v-icon size="large" icon="mdi mdi-file-excel" color="black" />
              <div style="font-weight: bold;">Upload File</div>
            </div>
            <input 
              ref="inputExcel"
              :key="componentKey"
              type="file"
              accept=".xlsx,.xls"
              style="display: none"
              @change="importExcel($event)"
            >
          </v-card>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-row 
            no-gutters
            class="mr-3"
          >
            <v-col
              class="text-start"
              cols="12"
            >
              <Button
                color-button="light-blue darken-3"
                icon-prepend-button="mdi mdi-download"
                nama-button="Download Template"
                @proses="downloadTemplate()"
              />
            </v-col>
          </v-row>         
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay v-model="isLoadingImport" persistent class="align-center justify-center">
      <div style="width: 550px;">
        <v-progress-linear
          class="pa-3"
          indeterminate
          color="black darken-3"
        />
        <h4 style="color: #FFF; text-align: center; background-color: #272727;">Sedang proses import data, harap menunggu ...</h4>
      </div>
    </v-overlay>
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
  name: 'JadwalExam',
  components: {
    PopUpNotifikasi,
  },
  data: () => ({
		expanded: [],
		DataJadwalExam: [],
    selectRecord: [],
    sortBy: [],
		kumpulSort: '',
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
      { title: "NO", key: "number", sortable: false, width: "3%" },
      { title: "#", key: "data-table-expand", sortable: false, width: "3%" },
      { title: "MATA PELAJARAN", key: "namamapel", sortable: true, width: "15%" },
      { title: "KELAS", key: "kelas", sortable: true, width: "7%" },
      { title: "WAKTU LAMANYA", key: "waktu", sortable: false, width: "10%" },
      { title: "WAKTU MULAI", key: "startDate", sortable: false, width: "15%" },
      { title: "WAKTU SELESAI", key: "endDate", sortable: false, width: "15%" },
      { title: "STATUS", key: "status", sortable: true, width: "5%" },
      { title: "#", key: "data-table-select", sortable: false, width: "3%" },
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
      pilihanganda: 0,
      essay: 0,
      menjodohkan: 0,
      benarsalah: 0,
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
    kondisiJabatan: false,
    kondisiTombol: true,
    DialogJadwalExam: false,
    DialogPilihExam: false,
    dialogImport: false,
    isLoadingImport: false,
    componentKey: 0,
    itemsButton: [
			{code: '1', text: 'Pilihan Ganda', icon: 'mdi mdi-table-question'},
			{code: '2', text: 'Menjodohkan', icon: 'mdi mdi-table-question'},
			{code: '3', text: 'Benar Salah', icon: 'mdi mdi-table-question'},
			{code: '4', text: 'Essay', icon: 'mdi mdi-table-question'},
		],
    available: [],
    selected: [],
    dataAvailable: [],
    dataSelected: [],
    itemJenis: '',
    pageSummary2: {
      limit: '',
      page: '',
      hasNext: false,
      lastID: '',
      totalPage: ''
    },
    BASEURL: '',

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
      // listPick: 'user/listPick',
    }),
    jabatanOptions(){
			if(this.roleID === '3'){
				if(localStorage.getItem('jabatan_guru') === '') return []
				let jabatan_guru = localStorage.getItem('jabatan_guru').split(', ')
				let result = this.jabatan.filter(val => jabatan_guru.includes(val.value)).map(x => {
					return x?.label
				})
				return result
			}else{
				return []
      }
		},
    kondisiMengajar(){
			if(this.roleID === '3'){
        if(localStorage.getItem('mengajar_bidang') === '') return []
				let mengajar_bidang = localStorage.getItem('mengajar_bidang').split(', ')
				let result = this.mengajarOptions.filter(val => mengajar_bidang.includes(val.value)).map(x => {
					return x?.value
				})
				return result
			}
		},
    kondisiKelas(){
			if(this.roleID === '3'){
        if(localStorage.getItem('mengajar_kelas') === '') return []
				let kelas = localStorage.getItem('mengajar_kelas').split(', ')
				let result = this.kelasOptions.filter(val => kelas.includes(val.kelas)).map(x => {
					return x?.kelas
				})
				return result
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
        if(value.dateRange == null) value.dateRange = []
        if(value.kelas != null && value.mapel != null && value.dateRange.length && !value.dateRange.includes(null)){
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
          this.getJadwalExam({page: value, limit: this.limit, mapel: this.pencarian.mapel, kelas: this.pencarian.kelas, sorting: this.kumpulSort})
        }
			}
		},
    limit: {
			deep: true,
			handler(value) {
        this.page = 1
				this.getJadwalExam({page: 1, limit: value, mapel: this.pencarian.mapel, kelas: this.pencarian.kelas, sorting: this.kumpulSort})
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
    jabatanOptions: {
			deep: true,
			handler(value) {
        if(this.roleID === '3'){
          if(value.includes('WaKaBid. Kurikulum')){
            this.kondisiJabatan = true
          }else if(value.includes('WaKaBid. Kesiswaan')){
            this.kondisiJabatan = false
            this.headers = this.headers.filter(el => { return el.key != "data-table-select"; })
          }else if(value.includes('Kepala Sekolah')){
            this.kondisiJabatan = true
          }else{
            this.kondisiJabatan = false
            this.headers = this.headers.filter(el => { return el.key != "data-table-select"; })
          }
        }else if(this.roleID === '2' || this.roleID === '1'){
          this.kondisiJabatan = true
        }
			}
		},
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.roleID = localStorage.getItem('roleID')
    this.idLog = localStorage.getItem('idLogin')
    this.BASEURL = process.env.VUE_APP_BASE_URL
		this.getJadwalExam({page: this.page, limit: this.limit, mapel: this.pencarian.mapel, kelas: this.pencarian.kelas, sorting: this.kumpulSort});
		this.getDataMaster({ kode: 'mengajar' })
		this.getDataMaster({ kode: 'jabatan' })
    this.getKelas({ kondisi: 'All' })
	},
	methods: {
		...mapActions({
      uploadFiles: 'upload/uploadFiles',
      getJadwalExam: 'user/getJadwalExam',
      getRandomQuestion: 'user/getRandomQuestion',
      postListPick: 'user/postListPick',
      getListPick: 'user/getListPick',
			getDataMaster: 'setting/getDataMaster',
      getKelas: 'setting/getKelas',
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
      // return console.log(bodyData);
      this.$store.dispatch('user/postJadwalExam', jenis === 'ADD' || jenis === 'EDIT' ? bodyData.ADDEDIT : bodyData.DELETESTATUS)
      .then((res) => {
        this.DialogJadwalExam = false
        this.getJadwalExam({page: 1, limit: this.limit, mapel: this.pencarian.mapel, kelas: this.pencarian.kelas, sorting: this.kumpulSort})
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
        // this.checkTempPilihan = true
        // this.checkTempEssay = true
        // this.checkTempMenjodohkan = true
        // this.checkTempBS = true
      }else{
        this.inputDataJadwalExam = {
          idJadwalExam: item?.idJadwalExam,
          kelas: item?.kelas,
          mapel: String(item?.kodemapel),
          dateRange: [item?.startDate, item?.endDate],
        }
        this.checkTempPilihan = item?.limitSoal?.pilihanganda > 0
        this.checkTempEssay = item?.limitSoal?.essay > 0
        this.checkTempMenjodohkan = item?.limitSoal?.menjodohkan > 0
        this.checkTempBS = item?.limitSoal?.benarsalah > 0
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
        limitSoal: {
          pilihanganda: this.checkTempPilihan ? Number(this.limitSoal.pilihanganda) : 0,
          essay: this.checkTempEssay ? Number(this.limitSoal.essay) : 0,
          menjodohkan: this.checkTempMenjodohkan ? Number(this.limitSoal.menjodohkan) : 0,
          benarsalah: this.checkTempBS ? Number(this.limitSoal.benarsalah) : 0,
        }
      }
      // return console.log(bodyData);
      this.getRandomQuestion(bodyData)
      .then((res) => {
        this.notifikasi("success", "Berhasil Mengacak Question Exam", "1")
			})
			.catch((err) => {
        if(err.response.data.status == 404) return this.notifikasi("error", err.response.data.message, "1")
        if(err.response.data.status == 422) return this.notifikasi("warning", err.response.data.message, "1")
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
        pilihanganda: 0,
        essay: 0,
        menjodohkan: 0,
        benarsalah: 0,
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
    downloadTemplate() {
			fetch(`${this.BASEURL}user/templateJadwalExam`, {
				method: 'GET',
				dataType: "xml",
			})
			.then(response => response.arrayBuffer())
			.then(async response => {
				// console.log(response)
				let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
				this.downloadBlob(blob,`Template Data Jadwal Exam.xlsx`)
				this.notifikasi("success", 'Sukses Download Template', "1")
			})
		},
    async importExcel(e) {
      let files = e.target.files[0];
      if(files){
				const bodyData = {
					jenis: "excel",
					kategori: "datajadwalexam",
				  createupdateBy: localStorage.getItem('idLogin'),
					files: files,
				};
				try {
          this.isLoadingImport = true
					await this.uploadFiles(bodyData)
          .then(async response => {
            setTimeout(() => {
              files = ''
              this.$refs.inputExcel.value = null
              this.isLoadingImport = false
              this.dialogImport = false
              if(localStorage.getItem('roleID') !== '1'){
                let payload = {
                  jenis: 'CREATE',
                  idUser: '2MMOu7xFdkbe4YFRjpp71fRkV26',
                  type: 'Record',
                  judul: `Import data jadwal exam`,
                  pesan: {
                    message: `data jadwal exam telah diimport oleh <strong>${localStorage.getItem('nama')}</strong>`,
                    payload: null,
                  },
                  params: null,
                  dikirim: `dikirim oleh <strong>${localStorage.getItem('nama')}</strong>`,
                  createBy: localStorage.getItem('idLogin'),
                }
                this.$store.dispatch('setting/postNotifikasi', payload)
              }
              this.getJadwalExam({page: this.page, limit: this.limit, mapel: this.pencarian.mapel, kelas: this.pencarian.kelas, sorting: this.kumpulSort});
              this.notifikasi("success", "Berhasil import Data Jadwal Siswa", "1")
            }, 5000)
          })
        } catch (err) {
          this.isLoadingImport = false
          this.componentKey++;
          files = ''
          this.$refs.inputExcel.value = null
          this.notifikasi("error", "Gagal Import Data Siswa Siswi", "1")
				}
			}else{
        this.isLoadingImport = false
        this.componentKey++;
        files = ''
        this.$refs.inputExcel.value = null
        this.notifikasi("warning", "Ulangi lagi Import Data Siswa Siswi", "1")
      }  
    },
    downloadBlob(blob, name = '') {
			const blobUrl = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = blobUrl;
			link.download = name;
			document.body.appendChild(link);
			link.dispatchEvent(
				new MouseEvent('click', { 
					bubbles: true, 
					cancelable: true, 
					view: window 
				})
			);
			document.body.removeChild(link);
		},
    clickrow(event, data) {
      const index = this.$data.expanded.find(i => i === data?.item?.idJadwalExam);
      if(typeof index === 'undefined') return this.$data.expanded = [];
      this.$data.expanded.splice(0, 1)
      this.$data.expanded.push(data?.item?.idJadwalExam);
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
        this.getJadwalExam({page: 1, limit: this.limit, mapel: this.pencarian.mapel, kelas: this.pencarian.kelas, sorting: this.kumpulSort})
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    async listPickExam(page){
      let { data: response } = await this.getListPick({page, limit: 20, keyword: '', jenis: this.itemJenis, kelas: this.inputDataJadwalExam.kelas, mapel: this.inputDataJadwalExam.mapel})
      let data = response.result.records
      data.map(val => {
        this.dataAvailable.push(val)
      })
      this.pageSummary2 = {
        limit: response.result.pageSummary.limit,
        page: response.result.pageSummary.page,
        hasNext: response.result.pageSummary.hasNext,
        lastID: response.result.pageSummary.lastID,
        totalPage: response.result.pageSummary.totalPage
      }
    },
    SelectExam(item){
      this.inputDataJadwalExam = {
        idJadwalExam: item?.idJadwalExam,
        kelas: item?.kelas.split('-')[0],
        mapel: item?.kodemapel,
      }
      this.itemJenis = 'pilihan ganda'
      this.listPickExam(1)
      this.DialogPilihExam = true
    },
    pilihDataAvailable(kode) {
      let objIndex = this.dataAvailable.findIndex((obj => obj.kode === kode));
      if(this.dataAvailable[objIndex].status === 'nonaktif'){
        this.available.push(kode)
        this.dataAvailable[objIndex].status = 'aktif'
      }else{
        let index = this.available.findIndex((obj => obj === kode));
        this.available.splice(index, 1)
        this.dataAvailable[objIndex].status = 'nonaktif'
      }
    },
    clearAvailable(){
      this.dataAvailable.filter(x => x.status === 'aktif').map(x => {
        let objIndex = this.dataAvailable.findIndex((obj => obj.kode === x.kode));
        this.dataAvailable[objIndex].status = 'nonaktif'
      })
      this.available = []
    },
    moveRight(){
      this.dataAvailable.filter(x => x.status === 'aktif').map(x => {
        this.dataSelected.push({ ...x, status: 'nonaktif' })
        let index = this.dataAvailable.findIndex((obj => obj.kode === x.kode));
        this.dataAvailable.splice(index, 1)
      })
      this.dataSelected.sort((a, b) => {
        let da = new Date(a.createdAt), db = new Date(b.createdAt);
        return db - da;
      });
      this.available = []
    },
    pilihDataSelected(kode) {
      let objIndex = this.dataSelected.findIndex((obj => obj.kode === kode));
      if(this.dataSelected[objIndex].status === 'nonaktif'){
        this.selected.push(kode)
        this.dataSelected[objIndex].status = 'aktif'
      }else{
        let index = this.selected.findIndex((obj => obj === kode));
        this.selected.splice(index, 1)
        this.dataSelected[objIndex].status = 'nonaktif'
      }
    },
    clearSelected(){
      this.dataSelected.filter(x => x.status === 'aktif').map(x => {
        let objIndex = this.dataSelected.findIndex((obj => obj.kode === x.kode));
        this.dataSelected[objIndex].status = 'nonaktif'
      })
      this.selected = []
    },
    moveLeft(){
      this.dataSelected.filter(x => x.status === 'aktif').map(x => {
        this.dataAvailable.push({ ...x, status: 'nonaktif' })
        let index = this.dataSelected.findIndex((obj => obj.kode === x.kode));
        this.dataSelected.splice(index, 1)
      })
      this.dataAvailable.sort((a, b) => {
        let da = new Date(a.createdAt), db = new Date(b.createdAt);
        return db - da;
      });
      this.selected = []
    },
    ChooseQuestionProses() {
      let kode = []
      this.dataSelected.map(x => { kode.push(x.kode) })
      const bodyData = {
        idJadwalExam: this.inputDataJadwalExam.idJadwalExam,
        jenis: this.itemJenis,
        kode: JSON.stringify(kode)
      }
      this.postListPick(bodyData)
      .then((res) => {
        this.dataAvailable = [];
        this.dataSelected = [];
        this.available = [];
        this.selected = [];
        this.listPickExam(1);
        this.getJadwalExam({page: 1, limit: this.limit, mapel: this.pencarian.mapel, kelas: this.pencarian.kelas, sorting: this.kumpulSort})
        this.notifikasi("success", "Berhasil memilih soal", "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    load ({ side, done }) {
      setTimeout(() => {
        if (side === 'end') {
          if(this.pageSummary2.hasNext){
            this.listPickExam(this.pageSummary2.page + 1)
            done('ok')
          }else{
            done('empty')
          }
        }
      }, 1000)
    },
    updateSort(data) {
      this.sortBy = data
			this.kumpulSort = this.sortBy.map((val) => {
        return `${val.key}-${val.order === 'asc' ? 'ASC' : 'DESC'}`
      }).join(',')
		  this.getJadwalExam({page: this.page, limit: this.limit, mapel: this.pencarian.mapel, kelas: this.pencarian.kelas, sorting: this.kumpulSort});
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

<style>
.v-infinite-scroll__side {
  padding: 0px 8px !important;
  overflow-y: hidden !important;
  align-items: center;
  display: flex;
  justify-content: center;
}
</style>

<style scoped>
.v-list-item.v-list-item--three-line {
  margin: 2px 0px;
}
.v-list-item--active.v-list-item--three-line {
  background-color: #4CAF50;
  border-radius: 5px;
  margin: 2px 0px;
  /* opacity: 0.4; */
}
.wadah-kategori {
  height: 45px;
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
}
.kotak-type {
  margin: 0px 5px;
  border: 2px solid #000;
  border-radius: 50px !important;
  color: black;
  background-color: white;
  font-size: 8pt;
  align-items: center;
  display: flex;
  justify-content: center;
  line-height: normal;
  position: relative;
  text-align: center;
}
.tombol {
  display: flex;
  align-items: center;
  /* justify-content: center; */
  flex-direction: column;
}
.kotak-panel {
  margin: 0px 5px;
  padding: 10px;
  border: 2px solid #000;
  border-radius: 50px !important;
  color: black;
  background-color: white;
  font-weight: 500;
  font-size: 10pt;
  align-items: center;
  display: flex;
  justify-content: center;
  line-height: normal;
  position: relative;
  text-align: center;
}
.kotak {
	border: 2px solid #000;
  display: inline-flex;
  justify-content: center;
  border-radius: 10px !important;
  background: #FFF;
  color: #000;
  padding: 2px;
  font-size: 10pt;
  width: 90px;
  height: 100px;
  text-align: -webkit-center;
  align-content: center;
  flex-wrap: wrap;
  flex-direction: row;
  cursor: pointer;
}
</style>