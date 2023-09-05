<template>
  <div>
    <h1 class="subheading grey--text">Data Siswa Siswi Kelas {{ kelas }}</h1>
    <div v-if="kondisi === 'view'" class="text-right wadah">
      <span @click="gotolist('view', kelas.split('-')[0])" class="link">Data Kelas Siswa {{ kelas.split('-')[0] }}</span>
      <v-icon size="small" class="iconstyle" icon="mdi mdi-menu-right" />
      <span>Data Siswa Siswi Kelas {{ kelas }}</span>
    </div>
    <div v-if="kondisi === 'penilaian'" class="text-right wadah">
      <span v-if="roleID === '1' || roleID === '2'" @click="gotolist('penilaian')" class="link">Data Akademis</span>
      <v-icon v-if="roleID === '1' || roleID === '2'" size="small" class="iconstyle" icon="mdi mdi-menu-right" />
      <span @click="gotolist2(mapel)" class="link">Data Akademis ({{ mapel }})</span>
      <v-icon size="small" class="iconstyle" icon="mdi mdi-menu-right" />
      <span>Data Siswa Siswi Kelas {{ kelas }}</span>
    </div>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <h4 v-if="kondisi === 'penilaian'">Mata Pelajaran: {{ mapel }}</h4>
      <v-alert
        v-if="kondisi === 'penilaian'"
        color="surface"
        border="start"
        border-color="light-blue accent-4"
        elevation="2"
        density="compact"
        icon="mdi mdi-information"
        title="Informasi"
        text="Untuk mengubah nilai harus mengubah jumlah tugas dan kkm terlebih dahulu."
      />
      <v-row no-gutters class="pa-2">
        <v-col cols="12" md="6">
          <Button 
            v-if="kondisi === 'penilaian'"
            color-button="light-blue darken-3"
            icon-button="mdi mdi-pencil"
            nama-button="Ubah Tugas & KKM"
            @proses="() => { DialogJumlahTugas = true; }"
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
                  getSiswaSiswi({page: 1, limit: limit, keyword: '', kelas: kelas})
                }"
                @keyup.enter="() => {
                  page = 1
                  getSiswaSiswi({page: 1, limit: limit, keyword: searchData, kelas: kelas})
                }"
              />
            </v-col>
            <v-col cols="12" md="3" class="pl-2 d-flex justify-end align-center">
              <Autocomplete
                v-model="page"
                :data-a="pageOptions"
                label-a="Page"
                :disabled-a="DataSiswaSiswi.length ? false : true"
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
          :items="DataSiswaSiswi"
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
          <template #headers="{  }">
            <tr v-if="kondisi === 'penilaian'">
              <td class="tableHeader">No</td>
              <td class="tableHeader">#</td>
              <td class="tableHeader">NOMOR INDUK</td>
              <td class="tableHeader">NAMA</td>
              <td class="tableHeader">NILAI AKHIR TUGAS</td>
              <td class="tableHeader">NILAI UTS</td>
              <td class="tableHeader">NILAI UAS</td>
              <td class="tableHeader">KEHADIRAN</td>
              <td class="tableHeader">
                NILAI AKHIR
                <Button v-if="DataSiswaSiswi.length" variant="plain" size-button="small" model-button="comfortable" color-button="#ffffff" icon-button="mdi mdi-pencil" :disabled-button="Number(jumlahTugasTemp) <= 0" @proses="taskDialog()"/>
              </td>
              <td class="tableHeader">NILAI HURUF</td>
            </tr>
            <tr v-if="kondisi === 'view'">
              <td class="tableHeader">No</td>
              <td class="tableHeader">#</td>
              <td class="tableHeader">NOMOR INDUK</td>
              <td class="tableHeader">NAMA</td>
              <td class="tableHeader">EMAIL</td>
              <td class="tableHeader">STATUS</td>
            </tr>
          </template>
          <template #[`item.number`]="{ item }">
            {{ page > 1 ? ((page - 1)*limit) + item.index + 1 : item.index + 1 }}
          </template>
          <template #[`item.nama`]="{ item }">
            <span v-html="uppercaseLetterFirst2(item.raw.nama)" /> 
          </template>
          <template #[`item.tugas`]="{ item }">
            <span>{{ item.raw.totalNilaiTugas }}</span>
          </template>
          <template #[`item.hurufNilai`]="{ item }">
            <span :class="item.raw.hurufNilai === 'C' || item.raw.hurufNilai === 'D' || item.raw.hurufNilai === 'E' ? 'red--text' : 'green--text'">{{ item.raw.hurufNilai }}</span>
          </template>
          <template #[`item.uts`]="{ item }">
            <span class="tulisan-td" v-html="item.raw.dataNilai.uts" />
          </template>
          <template #[`item.uas`]="{ item }">
            <span class="tulisan-td" v-html="item.raw.dataNilai.uas" />
          </template>
          <template #[`item.kehadiran`]="{ item }">
            <strong>S</strong>:&nbsp;{{ item.raw.dataKehadiran.sakit }}, <strong>A</strong>:&nbsp;{{ item.raw.dataKehadiran.alfa }}, <strong>I</strong>:&nbsp;{{ item.raw.dataKehadiran.ijin }}
          </template>
          <template #[`item.statusAktif`]="{ item }">
            <v-icon size="small" v-if="item.raw.statusAktif == true" color="green" icon="mdi mdi-check" />
            <v-icon size="small" v-else-if="item.raw.statusAktif == false" color="red" icon="mdi mdi-close" />
          </template>
          <template #expanded-row="{ columns, item }">
            <tr>
              <td :colspan="columns.length">
                <Button
                  color-button="#04f7f7"
                  icon-button="mdi mdi-pencil"
                  nama-button="Detail"
                  @proses="openDialog(item.raw)"
                />
                <Button
                  v-if="kondisi === 'penilaian'"
                  color-button="#0bd369"
                  icon-button="mdi mdi-account-check-outline"
                  nama-button="Kehadiran"
                  @proses="bukaDialog(item.raw)"
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
                  <v-select
                    v-model="limit"
                    :items="limitPage"
                    label="Limit"
                    variant="solo"
                    density="comfortable"
                    color="light-black darken-3"
                    bg-color="white"
                    hide-details
                    :disabled="DataSiswaSiswi.length ? false : true"
                  />
                  <Button
                    variant="plain"
                    size-button="large"
                    model-button="comfortable"
                    color-button="#ffffff"
                    icon-button="mdi mdi-arrow-left-circle-outline"
                    :disabled-button="DataSiswaSiswi.length ? pageSummary.page != 1 ? false : true : true"
                    @proses="() => { page = pageSummary.page - 1 }"
                  />
                  <Button
                    variant="plain"
                    size-button="large"
                    model-button="comfortable"
                    color-button="#ffffff"
                    icon-button="mdi mdi-arrow-right-circle-outline"
                    :disabled-button="DataSiswaSiswi.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
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
      v-model="DialogKehadiran"
      scrollable
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Data Ubah Kehadiran</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { DialogKehadiran = false; }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4" style="font-size: 13px;">
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Sakit
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <TextField
                v-model="inputKehadiran.sakit"
                label-tf="Sakit"
                :clearable-tf="true"
                @keypress="onlyNumber($event, 3, inputKehadiran.sakit)"                     
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Tanpa Keterangan (Alfa)
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <TextField
                v-model="inputKehadiran.alfa"
                label-tf="Tanpa Keterangan (Alfa)"
                :clearable-tf="true"
                @keypress="onlyNumber($event, 3, inputKehadiran.alfa)"                          
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Ijin
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <TextField
                v-model="inputKehadiran.ijin"
                label-tf="Ijin"
                :clearable-tf="true"
                @keypress="onlyNumber($event, 3, inputKehadiran.ijin)"                          
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
                color-button="black"
                nama-button="Ubah Kehadiran"
                @proses="simpanKehadiran()"
              />
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="DialogSiswaSiswi"
      scrollable
      persistent
      transition="dialog-bottom-transition"
      width="auto"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Data Detail Siswa Siswi</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { clearData(); DialogSiswaSiswi = false; }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4 v-dialog--custom">
          <h2 v-if="roleID === '1' || roleID === '2'" class="subheading black--text"><u>>>Data Log In</u></h2>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
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
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
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
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
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
          <h2 class="subheading black--text"><u>>>Data Siswa Siswi</u></h2>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              NIK Siswa/i
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.nikSiswa }}
            </v-col>
          </v-row>
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
          <v-row v-if="roleID === '3'" no-gutters>
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
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Anak Ke
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.anakKe }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Jumlah Saudara
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.jumlahSaudara }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Hobi
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.hobi }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Cita - Cita
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.citaCita }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '3'" no-gutters>
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
              {{ `${previewData.telp} (Nomor Orangtua)` }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '3'" no-gutters>
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
              {{ `${previewData.alamat}, Kel. ${previewData.kelurahan} Kec. ${previewData.kecamatan} ${previewData.kabKota} ${previewData.provinsi} ${previewData.kodePos}` }}
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
              {{ previewData.kelas }}
            </v-col>
          </v-row>
          <h2 v-if="roleID === '1' || roleID === '2'" class="subheading black--text"><u>>>Data Sekolah Sebelumnya</u></h2>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Jenjang Sekolah
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.jenjang }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Status Sekolah
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.statusSekolah }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Nama Sekolah
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.namaSekolah }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              NPSN
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.npsn }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Alamat Sekolah
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.alamatSekolah }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Kabupaten / Kota Sekolah
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.kabkotSekolah }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              No Peserta UN
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.noPesertaUN }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              No SKHUN
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.noSKHUN }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              No Ijazah
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.noIjazah }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Nilai UN
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.nilaiUN }}
            </v-col>
          </v-row>
          <h2 v-if="roleID === '1' || roleID === '2'" class="subheading black--text"><u>>>Data Detail Orangtua</u></h2>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              No Kartu Keluarga
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.noKK }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Nama Kepala Keluarga
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.namaKK }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
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
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
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
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
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
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
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
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
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
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
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
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
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
          <h2 v-if="roleID === '1' || roleID === '2'" class="subheading black--text"><u>>>Data Ayah</u></h2>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              NIK Ayah
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.nikAyah }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Nama Ayah
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.namaAyah }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Tahun Ayah
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.tahunAyah }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Status Ayah
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.statusAyah }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Pendidikan Ayah
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.pendidikanAyah }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Pekerjaan Ayah
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.pekerjaanAyah }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Telepon Ayah
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.telpAyah }}
            </v-col>
          </v-row>
          <h2 v-if="roleID === '1' || roleID === '2'" class="subheading black--text"><u>>>Data Ibu</u></h2>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              NIK Ibu
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.nikIbu }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Nama Ibu
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.namaIbu }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Tahun Ibu
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.tahunIbu }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Status Ibu
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.statusIbu }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Pendidikan Ibu
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.pendidikanIbu }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Pekerjaan Ibu
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.pekerjaanIbu }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Telepon Ibu
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.telpIbu }}
            </v-col>
          </v-row>
          <h2 v-if="roleID === '1' || roleID === '2'" class="subheading black--text"><u>>>Data Wali</u></h2>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              NIK Wali
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.nikWali }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Nama Wali
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.namaWali }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Tahun Wali
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.tahunWali }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Pendidikan Wali
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.pendidikanWali }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Pekerjaan Wali
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.pekerjaanWali }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Telepon Wali
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.telpWali }}
            </v-col>
          </v-row>
          <h2 v-if="roleID === '1' || roleID === '2'" class="subheading black--text"><u>>>Data Lainnya</u></h2>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Penghasilan
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.penghasilan }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Status Tempat Tinggal
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.statusTempatTinggal }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Jarak Rumah
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.jarakRumah }}
            </v-col>
          </v-row>
          <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Transportasi
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.transportasi }}
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions />
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="DialogTask"
      fullscreen
      scrollable
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Panel Ubah Nilai</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { DialogTask = false; inputTempAll = []; }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4 ScrollFullscreen">
          <div class="mt-4">
            <v-data-table
              loading-text="Sedang memuat... Harap tunggu"
              no-data-text="Tidak ada data yang tersedia"
              no-results-text="Tidak ada catatan yang cocok ditemukan"
              :loading="loadingtable"
              :items="DataSiswaSiswi"
              item-key="idUser"
              hide-default-header
              hide-default-footer
              class="elavation-3 rounded"
            >
              <!-- header -->
              <template #headers="{  }">
                <tr>
                  <td rowspan="2" class="tableHeader">NOMOR INDUK</td>
                  <td rowspan="2" class="tableHeader">NAMA</td>
                  <td :colspan="(2 + Number(jumlahTugasTemp))" class="tableHeader" style="text-align: center;">PENILAIAN</td>
                </tr>
                <tr>
                  <td v-for="index in (2 + Number(jumlahTugasTemp))" :key="index" class="tableHeader">
                    {{ conditionNilai[index-1].name }}<br>
                    <Button v-if="conditionNilai[index-1].statusCondition" variant="plain" size-button="small" model-button="comfortable" color-button="#ffffff" icon-button="mdi mdi-close" @proses="formNilai(DataSiswaSiswi, false, conditionNilai[index-1].trigger);"/>
                    <Button v-if="conditionNilai[index-1].statusCondition" variant="plain" size-button="small" model-button="comfortable" color-button="#ffffff" icon-button="mdi mdi-check" @proses="() => {
                      simpanPerubahan(inputTempAll, DataSiswaSiswi, mapel, conditionNilai[index-1].trigger, 'all')
                      formNilai(this.DataSiswaSiswi, false, conditionNilai[index-1].trigger);
                    }"/>
                    <Button v-if="!conditionNilai[index-1].statusCondition" variant="plain" size-button="small" model-button="comfortable" color-button="#ffffff" icon-button="mdi mdi-pencil" @proses="formNilai(DataSiswaSiswi, true, conditionNilai[index-1].trigger)"/>
                  </td>
                </tr>
              </template>
              <template #item="{ item }">
                <tr>
                  <td>{{ item.raw.nomorInduk }}</td>
                  <td>{{ uppercaseLetterFirst2(item.raw.nama) }}</td>
                  <td v-for="index in (2 + Number(jumlahTugasTemp))" :key="index">
                    <TextField
                      v-if="conditionNilai[index-1].statusCondition"
                      v-model="inputTemp[item.raw.idUser]"
                      variant="outlined"
                      class="textfieldnilai"
                      @keypress="onlyNumber($event, 3, inputTemp[item.raw.idUser])"
                      @input="() => {
                        if(Number(inputTemp[item.raw.idUser]) > 100) inputTemp[item.raw.idUser] = 100;
                      }"
                      @update:modelValue="updateNilai($event, item.raw.idUser)"
                      @keyup.enter="simpanPerubahan(inputTemp[item.raw.idUser], item.raw, mapel, conditionNilai[index-1].trigger, 'single')"
                    />
                    <span v-else v-html="item.raw.dataNilai[conditionNilai[index-1].trigger]" />
                  </td>
                </tr>
              </template>
              <template #bottom />
            </v-data-table>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="DialogJumlahTugas"
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Ubah Jumlah Tugas & KKM</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { DialogJumlahTugas = false; jumlahTugas = jumlahTugasTemp; }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4" style="font-size: 13px;">
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Jumlah Tugas
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <TextField
                v-model="jumlahTugas"
                label-tf="Jumlah Tugas"
                :clearable-tf="true"
                @keypress="onlyNumber($event, 2, jumlahTugas)"
                @input="dataChange('jmltugas', jumlahTugas, 10)"               
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              KKM
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <TextField
                v-model="kkm"
                label-tf="KKM"
                :clearable-tf="true"
                @keypress="onlyNumber($event, 3, kkm)"                          
                @input="dataChange('kkm', kkm, 100)"               
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
                color-button="black"
                nama-button="Ubah Tugas & KKM"
                :disabled-button="jumlahTugas === '0' || kkm === '0' ? true : false"
                @proses="ubahJumlahTask(kelasText, mapel)"
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
// import { useRoute } from "vue-router";
import PopUpNotifikasiVue from "../../Layout/PopUpNotifikasi.vue";
// import user from "../../../core/services/composeables/user"
export default {
  name: 'DataKelasSiswa',
  components: {
    PopUpNotifikasiVue
  },
  data: () => ({
    kondisi: '',
    mapel: '',
    kelas: '',
		DataSiswaSiswi: [],
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
		headers: [],
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
      nikSiswa: '',
      nomorInduk: '',
      tempat: '',
      tanggalLahir: '',
      jenisKelamin: '',
      agama: '',
      anakKe: '',
      jumlahSaudara: '',
      hobi: '',
      citaCita: '',
      kelas: '',
      jenjang: '',
      statusSekolah: '',
      namaSekolah: '',
      npsn: '',
      alamatSekolah: '',
      kabkotSekolah: '',
      noPesertaUN: '',
      noSKHUN: '',
      noIjazah: '',
      nilaiUN: '',
      noKK: '',
      namaKK: '',
      telp: '',
      alamat: '',
      provinsi: '',
      kabKota: '',
      kecamatan: '',
      kelurahan: '',
      kodePos: '',
      nikAyah: '',
      namaAyah: '',
      tahunAyah: '',
      statusAyah: '',
      pendidikanAyah: '',
      pekerjaanAyah: '',
      telpAyah: '',
      nikIbu: '',
      namaIbu: '',
      tahunIbu: '',
      statusIbu: '',
      pendidikanIbu: '',
      pekerjaanIbu: '',
      telpIbu: '',
      nikWali: '',
      namaWali: '',
      tahunWali: '',
      pendidikanWali: '',
      pekerjaanWali: '',
      telpWali: '',
      penghasilan: '',
      statusTempatTinggal: '',
      jarakRumah: '',
      transportasi: '',
    },
    DialogSiswaSiswi: false,
    DialogKehadiran: false,
    DialogTask: false,
    DialogJumlahTugas: false,
    endecryptType: '',
    jumlahTugas: 0,
    jumlahTugasTemp: 0,
    kkm: '',
    inputKehadiran: {
      idUser: '',
      mapel: '',
      semester: '',
      sakit: 0,
      alfa: 0,
      ijin: 0,
    },
    inputTemp: [],
    inputTempAll: [],
    taskTrigger: '',
    conditionNilai: [],

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Data Kelas Siswa Siswi - MTsS. SIROJUL ATHFAL",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
    // const route = useRoute()
    // let kls = route.params.kelas
    // const { data: dataSetupSiswaSiswi } = user.userGet({page: 1, limit: 20, keyword: '', kelas: kls})
    // return { dataSetupSiswaSiswi }
  },
  computed: {
    ...mapState({
      loadingtable: store => store.user.loadingtable
    }),
    ...mapGetters({
      siswasiswiAll: 'user/siswasiswiAll', 
    }),
    kelasText() {
      this.kelas = this.$route.params.kelas
      return this.kelas
    },
    mapelText() {
      this.mapel = this.$route.query.mapel
      return this.mapel
    },
  },
  watch: {
    siswasiswiAll: {
			deep: true,
			async handler(value) {
        this.DataSiswaSiswi = []
        this.pageOptions = []
        if(this.kondisi == 'penilaian'){
          let kumpul = value.records
          let dataPenilaian = kumpul[0].dataPenilaian.filter(k => k.mapel === this.mapel)[0]
          this.jumlahTugas = String(dataPenilaian.dataJadwal.jumlahTugas)
          this.jumlahTugasTemp = String(dataPenilaian.dataJadwal.jumlahTugas)
          this.kkm = String(dataPenilaian.dataJadwal.kkm)
          await Promise.all(kumpul.map(str => {
            let nilai = str.dataPenilaian.filter(k => k.mapel === this.mapel)[0].dataNK.nilai
            let semester = str.dataPenilaian.filter(k => k.mapel === this.mapel)[0].semester
            let kehadiran = str.dataPenilaian.filter(k => k.mapel === this.mapel)[0].dataNK.kehadiran
            let totalNilaiTugas = Number(nilai.tugas1) + Number(nilai.tugas2) + Number(nilai.tugas3) + Number(nilai.tugas4) + Number(nilai.tugas5) + Number(nilai.tugas6) + Number(nilai.tugas7) + Number(nilai.tugas8) + Number(nilai.tugas9) + Number(nilai.tugas10)
            let rataRataTugas = totalNilaiTugas === 0 ? 0 : totalNilaiTugas / Number(this.jumlahTugas)
            let rataRataNilai = (Number(rataRataTugas) + Number(nilai.uts) + Number(nilai.uas)) / 3
            this.DataSiswaSiswi.push({
              ...str,
              dataNilai: nilai,
              semester: semester,
              dataKehadiran: kehadiran,
              totalNilaiTugas: rataRataTugas != 0 ? Math.ceil(rataRataTugas) : 0,
              rataRataNilai: rataRataNilai != 0 ? Math.ceil(rataRataNilai) : 0,
              hurufNilai: rataRataNilai <= 50 ? 'E' : rataRataNilai <= 65 ? 'D' : rataRataNilai <= 75 ? 'C' : rataRataNilai <= 85 ? 'B' : 'A',
            })
            // console.log(nilai);
          }))
        }else if(this.kondisi == 'view'){
          this.DataSiswaSiswi = value.records
        }
				this.pageSummary = {
					page: this.DataSiswaSiswi.length ? value.pageSummary.page : 0,
					limit: this.DataSiswaSiswi.length ? value.pageSummary.limit : 0,
					total: this.DataSiswaSiswi.length ? value.pageSummary.total : 0,
					totalPages: this.DataSiswaSiswi.length ? value.pageSummary.totalPages : 0
				}
        for (let index = 1; index <= this.pageSummary.totalPages; index++) {
          this.pageOptions.push(index)
        }
      }
		},
    page: {
			deep: true,
			handler(value) {
        this.getSiswaSiswi({page: value, limit: this.limit, keyword: this.searchData, kelas: this.kelas})
        this.headerKondisi(this.kondisi)
			}
		},
    limit: {
			deep: true,
			handler(value) {
        this.page = 1
				this.getSiswaSiswi({page: 1, limit: value, keyword: this.searchData, kelas: this.kelas})
        this.headerKondisi(this.kondisi)
			}
		},
  },
  mounted() {
    this.roleID = localStorage.getItem('roleID')
    this.kelas = this.$route.params.kelas
    this.mapel = this.$route.query.mapel
    this.kondisi = this.$route.params.kondisi
    this.getSiswaSiswi({page: 1, limit: 20, keyword: '', kelas: this.kelas})
    this.headerKondisi(this.kondisi)
	},
	methods: {
		...mapActions({
      fetchData: "fetchData", 
      getSiswaSiswi: "user/getSiswaSiswi", 
    }),
    headerKondisi(kondisi) {
      this.headers = []
      if(kondisi === 'view'){
        this.headers.push(
          { title: "No", key: "number", sortable: false, width: "5%" },
          { title: "#", key: "data-table-expand", sortable: false, width: "5%" },
          { title: "Nomor Induk", key: "nomorInduk", sortable: false },
          { title: "Nama", key: "nama", sortable: false },
          { title: "Email", key: "email", sortable: false },
          { title: "Status", key: "statusAktif", sortable: false },
        )
      }else if(kondisi === 'penilaian'){
        this.headers.push(
          { title: "No", key: "number", sortable: false, width: "5%" },
          { title: "#", key: "data-table-expand", sortable: false, width: "5%" },
          { title: "Nomor Induk", key: "nomorInduk", sortable: false },
          { title: "Nama", key: "nama", sortable: false },
          { title: "Nilai Akhir Tugas", key: "tugas", sortable: false },
          { title: "Nilai UTS", key: "uts", sortable: false },
          { title: "Nilai UAS", key: "uas", sortable: false },
          { title: "Kehadiran", key: "kehadiran", sortable: false },
          { title: "Nilai Akhir", key: "rataRataNilai", sortable: false },
          { title: "Nilai Huruf", key: "hurufNilai", sortable: false },
        )
      }
    },
    simpanPerubahan(nilai, item, mapel, task, kondisi) {
      let obj, bodyData;
      if(kondisi === 'single'){
        let key = Object.keys(item.dataNilai)
        let value = Object.values(item.dataNilai)
        obj = {
          tugas1: key[0] == task ? Number(nilai) : value[0],
          tugas2: key[1] == task ? Number(nilai) : value[1],
          tugas3: key[2] == task ? Number(nilai) : value[2],
          tugas4: key[3] == task ? Number(nilai) : value[3],
          tugas5: key[4] == task ? Number(nilai) : value[4],
          tugas6: key[5] == task ? Number(nilai) : value[5],
          tugas7: key[6] == task ? Number(nilai) : value[6],
          tugas8: key[7] == task ? Number(nilai) : value[7],
          tugas9: key[8] == task ? Number(nilai) : value[8],
          tugas10: key[9] == task ? Number(nilai) : value[9],
          uts: key[10] == task ? Number(nilai) : value[10],
          uas: key[11] == task ? Number(nilai) : value[11],
        }
        bodyData = {
          jenis: 'nilai',
          idUser: item.idUser,
          mapel: mapel,
          semester: item.semester,
          dataNilai: {
            semester: item.semester, 
            nilai: obj
          }
        }
      }else if(kondisi === 'all'){
        let dataNilai = item.map(val => {
          let key = Object.keys(val.dataNilai)
          let value = Object.values(val.dataNilai)
          let hasilNilai = nilai.filter(v => v.idUser === val.idUser)[0].nilai

          obj = {
            tugas1: key[0] == task ? Number(hasilNilai) : value[0],
            tugas2: key[1] == task ? Number(hasilNilai) : value[1],
            tugas3: key[2] == task ? Number(hasilNilai) : value[2],
            tugas4: key[3] == task ? Number(hasilNilai) : value[3],
            tugas5: key[4] == task ? Number(hasilNilai) : value[4],
            tugas6: key[5] == task ? Number(hasilNilai) : value[5],
            tugas7: key[6] == task ? Number(hasilNilai) : value[6],
            tugas8: key[7] == task ? Number(hasilNilai) : value[7],
            tugas9: key[8] == task ? Number(hasilNilai) : value[8],
            tugas10: key[9] == task ? Number(hasilNilai) : value[9],
            uts: key[10] == task ? Number(hasilNilai) : value[10],
            uas: key[11] == task ? Number(hasilNilai) : value[11],
          }
          return {
            semester: val.semester,
            idUser: val.idUser,
            dataNilai:{
              semester: val.semester,
              nilai: obj
            }
          }
        })
        bodyData = {
          jenis: 'nilaiAll',
          mapel: mapel,
          dataNilai,
        }
      }
      // return console.log(bodyData);
      this.$store.dispatch('user/postNilai', bodyData)
      .then((res) => {
        this.DialogTask = true
        this.getSiswaSiswi({page: this.page, limit: this.limit, keyword: this.searchData, kelas: this.kelas})
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    ubahJumlahTask(kelas, mapel) {
      let bodyData = {
        jenis: 'jumlah_tugas',
        mapel: mapel,
        kelas: kelas,
        jumlahTugas: this.jumlahTugas,
        kkm: this.kkm,
      }
      this.$store.dispatch('user/postNilai', bodyData)
      .then((res) => {
        this.DialogJumlahTugas = false
        this.jumlahTugasTemp = this.jumlahTugas
        this.getSiswaSiswi({page: this.page, limit: this.limit, keyword: this.searchData, kelas: this.kelas})
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    openDialog(item){
      this.previewData = {
        idUser: item.idUser,
        namaRole: item.namaRole,
        nama: this.uppercaseLetterFirst2(item.nama),
        username: item.username,
        email: item.email,
        password: item.kataSandi,
        nikSiswa: item.nikSiswa ? item.nikSiswa : '-',
        nomorInduk: item.nomorInduk,
        tempat: item.tempat,
        tanggalLahir: item.tanggalLahir,
        jenisKelamin: item.jenisKelamin,
        agama: item.agama.label,
        anakKe: item.anakKe ? item.anakKe : '-',
        jumlahSaudara: item.jumlahSaudara ? item.jumlahSaudara : '-',
        hobi: item.hobi ? item.hobi.label : '-',
        citaCita: item.citaCita ? item.citaCita.label : '-',
        kelas: item.kelas ? item.kelas : '-',
        jenjang: item.dataSekolahSebelumnya.jenjang.label,
        statusSekolah: item.dataSekolahSebelumnya.statusSekolah.label,
        namaSekolah: item.dataSekolahSebelumnya.namaSekolah,
        npsn: item.dataSekolahSebelumnya.npsn ? item.dataSekolahSebelumnya.npsn : '-',
        alamatSekolah: this.uppercaseLetterFirst2(item.dataSekolahSebelumnya.alamatSekolah),
        kabkotSekolah: this.uppercaseLetterFirst2(item.dataSekolahSebelumnya.kabkotSekolah.nama),
        noPesertaUN: item.dataSekolahSebelumnya.noPesertaUN ? item.dataSekolahSebelumnya.noPesertaUN : '-',
        noSKHUN: item.dataSekolahSebelumnya.noSKHUN ? item.dataSekolahSebelumnya.noSKHUN : '-',
        noIjazah: item.dataSekolahSebelumnya.noIjazah ? item.dataSekolahSebelumnya.noSKHUN : '-',
        nilaiUN: item.dataSekolahSebelumnya.nilaiUN ? item.dataSekolahSebelumnya.noSKHUN : '-',
        noKK: item.noKK,
        namaKK: this.uppercaseLetterFirst2(item.namaKK),
        telp: item.dataAlamatOrangtua.telp,
        alamat: this.uppercaseLetterFirst2(item.dataAlamatOrangtua.alamat),
        provinsi: this.uppercaseLetterFirst2(item.dataAlamatOrangtua.provinsi.nama),
        kabKota: this.uppercaseLetterFirst2(item.dataAlamatOrangtua.kabKota.nama),
        kecamatan: this.uppercaseLetterFirst2(item.dataAlamatOrangtua.kecamatan.nama),
        kelurahan: this.uppercaseLetterFirst2(item.dataAlamatOrangtua.kelurahan.nama),
        kodePos: item.dataAlamatOrangtua.kodePos,
        nikAyah: item.dataOrangtua.dataAyah.nikAyah,
        namaAyah: this.uppercaseLetterFirst2(item.dataOrangtua.dataAyah.namaAyah),
        tahunAyah: item.dataOrangtua.dataAyah.tahunAyah,
        statusAyah: item.dataOrangtua.dataAyah.statusAyah.label,
        pendidikanAyah: item.dataOrangtua.dataAyah.pendidikanAyah.label,
        pekerjaanAyah: item.dataOrangtua.dataAyah.pekerjaanAyah.label,
        telpAyah: item.dataOrangtua.dataAyah.telpAyah,
        nikIbu: this.uppercaseLetterFirst2(item.dataOrangtua.dataIbu.nikIbu),
        namaIbu: item.dataOrangtua.dataIbu.namaIbu,
        tahunIbu: item.dataOrangtua.dataIbu.tahunIbu,
        statusIbu: item.dataOrangtua.dataIbu.statusIbu.label,
        pendidikanIbu: item.dataOrangtua.dataIbu.pendidikanIbu.label,
        pekerjaanIbu: item.dataOrangtua.dataIbu.pekerjaanIbu.label,
        telpIbu: item.dataOrangtua.dataIbu.telpIbu,
        nikWali: item.dataOrangtua.dataWali.nikWali ? item.dataOrangtua.dataWali.nikWali : '-',
        namaWali: item.dataOrangtua.dataWali.namaWali ? this.uppercaseLetterFirst2(item.dataOrangtua.dataWali.namaWali) : '-',
        tahunWali: item.dataOrangtua.dataWali.tahunWali ? item.dataOrangtua.dataWali.tahunWali : '-',
        pendidikanWali: item.dataOrangtua.dataWali.pendidikanWali ? item.dataOrangtua.dataWali.pendidikanWali.label : '-',
        pekerjaanWali: item.dataOrangtua.dataWali.pekerjaanWali ? item.dataOrangtua.dataWali.pekerjaanWali.label : '-',
        telpWali: item.dataOrangtua.dataWali.telpWali ? item.dataOrangtua.dataWali.telpWali : '-',
        penghasilan: item.penghasilan ? item.penghasilan.label : '-',
        statusTempatTinggal: item.dataLainnya.statusTempatTinggal ? item.dataLainnya.statusTempatTinggal.label : '-',
        jarakRumah: item.dataLainnya.jarakRumah ? item.dataLainnya.jarakRumah.label : '-',
        transportasi: item.dataLainnya.transportasi ? item.dataLainnya.transportasi.label : '-',
      }
      this.DialogSiswaSiswi = true
    },
    clearData(){
      this.previewData = {
        idUser: '',
        namaRole: '',
        nama: '',
        username: '',
        email: '',
        password: '',
        nikSiswa: '',
        nomorInduk: '',
        tempat: '',
        tanggalLahir: '',
        jenisKelamin: '',
        agama: '',
        anakKe: '',
        jumlahSaudara: '',
        hobi: '',
        citaCita: '',
        kelas: '',
        jenjang: '',
        statusSekolah: '',
        namaSekolah: '',
        npsn: '',
        alamatSekolah: '',
        kabkotSekolah: '',
        noPesertaUN: '',
        noSKHUN: '',
        noIjazah: '',
        nilaiUN: '',
        noKK: '',
        namaKK: '',
        telp: '',
        alamat: '',
        provinsi: '',
        kabKota: '',
        kecamatan: '',
        kelurahan: '',
        kodePos: '',
        nikAyah: '',
        namaAyah: '',
        tahunAyah: '',
        statusAyah: '',
        pendidikanAyah: '',
        pekerjaanAyah: '',
        telpAyah: '',
        nikIbu: '',
        namaIbu: '',
        tahunIbu: '',
        statusIbu: '',
        pendidikanIbu: '',
        pekerjaanIbu: '',
        telpIbu: '',
        nikWali: '',
        namaWali: '',
        tahunWali: '',
        pendidikanWali: '',
        pekerjaanWali: '',
        telpWali: '',
        penghasilan: '',
        statusTempatTinggal: '',
        jarakRumah: '',
        transportasi: '',
      }
    },
    conditional(){
      this.conditionNilai = []
      for (let index = 0; index < (2 + Number(this.jumlahTugasTemp)); index++) {
        this.conditionNilai.push({
          name: index < Number(this.jumlahTugasTemp) ? `TUGAS ${index+1}` : index == Number(this.jumlahTugasTemp) ? 'UTS' : 'UAS',
          trigger: index < Number(this.jumlahTugasTemp) ? `tugas${index+1}` : index == Number(this.jumlahTugasTemp) ? 'uts' : 'uas',
          statusCondition: false,
        })
      }
    },
    taskDialog(){
      this.taskTrigger = ''
      this.inputTempAll = []
      this.conditional()
      this.DialogTask = true
    },
    formNilai(item, status, trig){
      this.taskTrigger = trig
      this.inputTemp = []
      this.inputTempAll = []
      this.conditional()
      let objIndex = this.conditionNilai.findIndex((obj => obj.trigger === trig));
      this.conditionNilai[objIndex].statusCondition = status
      item.map(str => {
        this.inputTemp[str.idUser] = String(str.dataNilai[trig])
        this.inputTempAll.push({
          idUser: str.idUser,
          trigger: trig,
          nilai: String(str.dataNilai[trig])
        })
      })
      // console.log(this.inputTempAll);
    },
    bukaDialog(item){
      this.inputKehadiran = {
        idUser: item.idUser,
        mapel: this.mapel,
        semester: item.semester,
        sakit: String(item.dataKehadiran.sakit),
        alfa: String(item.dataKehadiran.alfa),
        ijin: String(item.dataKehadiran.ijin),
      }
      this.DialogKehadiran = true
    },
    simpanKehadiran(){
      let bodyData = {
        jenis: 'kehadiran',
        idUser: this.inputKehadiran.idUser,
        mapel: this.inputKehadiran.mapel,
        semester: this.inputKehadiran.semester,
        dataKehadiran: { 
          semester: this.inputKehadiran.semester,
          kehadiran: {
            sakit: Number(this.inputKehadiran.sakit),
            alfa: Number(this.inputKehadiran.alfa),
            ijin: Number(this.inputKehadiran.ijin),
          }
        }
      }
      this.$store.dispatch('user/postNilai', bodyData)
      .then((res) => {
        this.DialogKehadiran = false
        this.getSiswaSiswi({page: this.page, limit: this.limit, keyword: this.searchData, kelas: this.kelas})
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    gotolist(kondisi, param = null) {
      if(kondisi === 'view'){
        this.$router.push({name: "DataKelasSiswa", params: { kelas: param }});
      }else{
        this.$router.push({name: "DataAkademis"});
      }
    },
    gotolist2(mapel) {
      this.$router.push({name: "DataDetailAkademis", params: { mapel: mapel.replace(' ', '-') }});
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
    dataChange(kondisi, e, max){
      if(kondisi === 'jmltugas' && Number(e) > max) this.jumlahTugas = max
      if(kondisi === 'kkm' && Number(e) > max) this.kkm = max
    },
    updateNilai(e, idUser){
      let objIndex = this.inputTempAll.findIndex((obj => obj.idUser === idUser));
      this.inputTempAll[objIndex].nilai = e
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
.textfieldnilai {
  /* height: 50px !important; */
  margin: 5px !important;
  font-size: 12px !important;
  width: 60px !important;
}
</style>

<style scoped>
.wadah {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 5px;
}
.iconstyle {
  margin-left: 5px;
  margin-right: 5px;
}
.link {
  color: #000;
  cursor: pointer;
  text-decoration: none;
}
.link:hover {
  color: #6fe484;
  cursor: pointer;
  text-decoration: underline;
}
.tulisan-td {
  font-size: 12px !important;
}
.titik2 {
  text-indent: 5em;
}
</style>