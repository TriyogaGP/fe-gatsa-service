<template>
  <div>
    <h1 class="subheading grey--text">Data Siswa Siswi</h1>
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
          <Button 
            v-if="roleID === '1' || roleID === '2'"
            color-button="#0bd369"
            icon-button="mdi mdi-import"
            nama-button="Import Data"
            @proses="() => { dialogImport = true }"
          />
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
                icon-button="mdi mdi-export"
                nama-button="Export Data"
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
                @click="exportExcel('full')"
                color="nav-back"
							  class="SelectedMenu"
              >
                <template v-slot:append>
                  <v-icon size="middle" icon="mdi mdi-export" color="icon-white" />
                </template>
                <v-list-item-title>
						      <span class="menufont">Export Data Full</span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="exportExcel('emis')"
                color="nav-back"
							  class="SelectedMenu"
              >
                <template v-slot:append>
                  <v-icon size="middle" icon="mdi mdi-export" color="icon-white" />
                </template>
                <v-list-item-title>
                  <span class="menufont">Export Data Emis</span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
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
                  getSiswaSiswi(roleID === '1' || roleID === '2' ? {page: 1, limit: limit, keyword: ''} : {page: 1, limit: limit, keyword: '', kelas: mengajarKelas})
                }"
                @keyup.enter="() => {
                  page = 1
                  getSiswaSiswi(roleID === '1' || roleID === '2' ? {page: 1, limit: limit, keyword: searchData} : {page: 1, limit: limit, keyword: searchData, kelas: mengajarKelas})
                }"
              />
            </v-col>
            <v-col cols="12" md="3" class="d-flex justify-end align-center">
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
          v-model:expanded="expanded"
          item-value="idUser"
          density="comfortable"
          hide-default-footer
          hide-default-header
          class="elavation-3 rounded"
          :items-per-page="itemsPerPage"
          @page-count="pageCount = $event"
          @click:row="clickrow"
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
            <span v-html="uppercaseLetterFirst2(item.raw.nama)" /> 
          </template>
          <template #[`item.statusAktif`]="{ item }">
            <v-icon size="small" v-if="item.raw.statusAktif == true" color="green" icon="mdi mdi-check" />
            <v-icon size="small" v-else-if="item.raw.statusAktif == false" color="red" icon="mdi mdi-close" />
          </template>
          <template #[`item.validasi`]="{ item }">
            <v-icon size="small" v-if="item.raw.validasiAkun == true" color="green" icon="mdi mdi-check" />
            <v-icon size="small" v-else-if="item.raw.validasiAkun == false" color="red" icon="mdi mdi-close" />
          </template>
          <template #[`item.mutasi`]="{ item }">
            <v-icon size="small" v-if="item.raw.mutasiAkun == true" color="green" icon="mdi mdi-check" />
            <v-icon size="small" v-else-if="item.raw.mutasiAkun == false" color="red" icon="mdi mdi-close" />
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
                  :disabled-button="item.raw.mutasiAkun == true || item.raw.statusAktif == false"
                  @proses="ubahData(item.raw.idUser)"
                />
                <Button
                  v-if="roleID === '1' || roleID === '2' || (roleID === '3' && kondisiKepalaSekolah)"
                  color-button="#0bd369"
                  :icon-button="item.raw.statusAktif === false ? 'mdi mdi-eye' : 'mdi mdi-eye-off'"
                  :nama-button="item.raw.statusAktif === false ? 'Active' : 'Non Active'"
                  :disabled-button="item.raw.mutasiAkun == true"
                  @proses="postRecord(item.raw, 'STATUSRECORD', !item.raw.statusAktif)"
                />
                <Button 
                  v-if="roleID === '1' || roleID === '2' || (roleID === '3' && kondisiKepalaSekolah)"
                  color-button="#bd3a07"
                  icon-button="mdi mdi-delete"
                  nama-button="Hapus"
                  :disabled-button="item.raw.mutasiAkun == true || item.raw.statusAktif == false"
                  @proses="postRecord(item.raw, 'DELETE', null)"
                />
                <Button
                  v-if="roleID === '1' || roleID === '2' || (roleID === '3' && kondisiKepalaSekolah)"
                  color-button="#0bd369"
                  :icon-button="item.raw.validasiAkun === false ? 'mdi mdi-check' : 'mdi mdi-clear'"
                  :nama-button="item.raw.validasiAkun === false ? 'Validate' : 'Non Validate'"
                  :disabled-button="item.raw.mutasiAkun == true || item.raw.statusAktif == false"
                  @proses="postRecord(item.raw, 'VALIDASIAKUN', !item.raw.validasiAkun)"
                />
                <Button
                  v-if="roleID === '1' || roleID === '2' || (roleID === '3' && kondisiKepalaSekolah)"
                  color-button="#0bd369"
                  icon-button="mdi mdi-account-cancel-outline"
                  nama-button="Mutasi Akun"
                  @proses="postRecord(item.raw, 'MUTASIAKUN', !item.raw.mutasiAkun)"
                />
                <Button 
                  color-button="#04f7f7"
                  icon-button="mdi mdi-information"
                  nama-button="Detail"
                  @proses="openDialog(item.raw)"
                />
                <Button
                  v-if="roleID === '1' || roleID === '2'"
                  color-button="#0bd369"
                  icon-button="mdi mdi-upload"
                  nama-button="Upload Berkas"
                  :disabled-button="item.raw.statusAktif == false"
                  @proses="() => { dialogUploadBerkas = true; previewData.idUser = item.raw.idUser; }"
                />
                <Button
                  :loading="isLoadingbtnPDF"
                  color-button="#04f7f7"
                  icon-button="mdi mdi-file-pdf-box"
                  nama-button="PDF"
                  @proses="pdfCreate(item.raw.idUser, null, null, 'create')"
                />
              </td>
            </tr>
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
                    :disabled-a="DataSiswaSiswi.length ? false : true"
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
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <h2 class="subheading black--text"><u>>>Data Sekolah Sebelumnya</u></h2>
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <h2 class="subheading black--text"><u>>>Data Detail Orangtua</u></h2>
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <h2 class="subheading black--text"><u>>>Data Ayah</u></h2>
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <h2 class="subheading black--text"><u>>>Data Ibu</u></h2>
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <h2 class="subheading black--text"><u>>>Data Wali</u></h2>
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <h2 class="subheading black--text"><u>>>Data Lainnya</u></h2>
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <v-row no-gutters>
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
          <h2 class="subheading black--text"><u>>>Berkas</u></h2>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              FC Ijazah
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <Button
                :loading="isLoadingbtnPDF1"
                color-button="#0bd369"
                icon-button="mdi mdi-file-pdf-box"
                nama-button="Lihat Berkas"
                @proses="pdfCreate(previewData.idUser, previewData.fcIjazah, 'ijazah', 'berkas')"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              FC SKHUN
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <Button
                :loading="isLoadingbtnPDF2"
                color-button="#0bd369"
                icon-button="mdi mdi-file-pdf-box"
                nama-button="Lihat Berkas"
                @proses="pdfCreate(previewData.idUser, previewData.fcSKHUN, 'skhun', 'berkas')"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              FC Kartu Keluarga
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <Button
                :loading="isLoadingbtnPDF3"
                color-button="#0bd369"
                icon-button="mdi mdi-file-pdf-box"
                nama-button="Lihat Berkas"
                @proses="pdfCreate(previewData.idUser, previewData.fcKK, 'kk', 'berkas')"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              FC KTP Orangtua
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <Button
                :loading="isLoadingbtnPDF4"
                color-button="#0bd369"
                icon-button="mdi mdi-file-pdf-box"
                nama-button="Lihat Berkas"
                @proses="pdfCreate(previewData.idUser, previewData.fcKTPOrtu, 'ktp', 'berkas')"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              FC Akta Lahir
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <Button
                :loading="isLoadingbtnPDF5"
                color-button="#0bd369"
                icon-button="mdi mdi-file-pdf-box"
                nama-button="Lihat Berkas"
                @proses="pdfCreate(previewData.idUser, previewData.fcAktaLahir, 'aktalahir', 'berkas')"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              FC SKL
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <Button
                :loading="isLoadingbtnPDF6"
                color-button="#0bd369"
                icon-button="mdi mdi-file-pdf-box"
                nama-button="Lihat Berkas"
                @proses="pdfCreate(previewData.idUser, previewData.fcSKL, 'skl', 'berkas')"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions />
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogPDF"
      scrollable
			persistent
      transition="dialog-bottom-transition"
      width="1000px"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Data PDF Siswa Siswi</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { dialogPDF = false; }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4">
          <PdfCetakan
            :dialog-pdf="dialogPDF"
            :url-sk="urlSk"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogUploadBerkas"
      scrollable
			persistent
      transition="dialog-bottom-transition"
      width="800px"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Upload Berkas Siswa Siswi</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { dialogUploadBerkas = false; previewData.idUser = ''; }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4">
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              FC Ijazah
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <Button
                color-button="#0bd369"
                icon-button="mdi mdi-upload"
                nama-button="Upload Berkas"
                @proses="pilihFile('ijazah')"
              />
              <input 
                ref="inputIjazah"
                :key="componentKey"
                type="file"
                accept=".pdf"
                style="display: none"
                @change="uploadBerkas($event, 'ijazah')"
              >
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              FC SKHUN
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <Button
                color-button="#0bd369"
                icon-button="mdi mdi-upload"
                nama-button="Upload Berkas"
                @proses="pilihFile('skhun')"
              />
              <input 
                ref="inputSKHUN"
                :key="componentKey"
                type="file"
                accept=".pdf"
                style="display: none"
                @change="uploadBerkas($event, 'skhun')"
              >
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              FC Kartu Keluarga
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <Button
                color-button="#0bd369"
                icon-button="mdi mdi-upload"
                nama-button="Upload Berkas"
                @proses="pilihFile('kk')"
              />
              <input 
                ref="inputKK"
                :key="componentKey"
                type="file"
                accept=".pdf"
                style="display: none"
                @change="uploadBerkas($event, 'kk')"
              >
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              FC KTP
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <Button
                color-button="#0bd369"
                icon-button="mdi mdi-upload"
                nama-button="Upload Berkas"
                @proses="pilihFile('ktp')"
              />
              <input 
                ref="inputKTP"
                :key="componentKey"
                type="file"
                accept=".pdf"
                style="display: none"
                @change="uploadBerkas($event, 'ktp')"
              >
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              FC Akta Lahir
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <Button
                color-button="#0bd369"
                icon-button="mdi mdi-upload"
                nama-button="Upload Berkas"
                @proses="pilihFile('aktalahir')"
              />
              <input 
                ref="inputAktaLahir"
                :key="componentKey"
                type="file"
                accept=".pdf"
                style="display: none"
                @change="uploadBerkas($event, 'aktalahir')"
              >
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              FC SKL
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <Button
                color-button="#0bd369"
                icon-button="mdi mdi-upload"
                nama-button="Upload Berkas"
                @proses="pilihFile('skl')"
              />
              <input 
                ref="inputSKL"
                :key="componentKey"
                type="file"
                accept=".pdf"
                style="display: none"
                @change="uploadBerkas($event, 'skl')"
              >
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions />
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
          <v-toolbar-title>Import Data Siswa Siswi</v-toolbar-title>
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
            <div class="kotak" @click="pilihFile('excel')">
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
              class="text-end"
              cols="12"
            >
              <Button
                color-button="light-blue darken-3"
                icon-button="mdi mdi-download"
                nama-button="Download Template"
                @proses="downloadTemplate()"
              />
            </v-col>
          </v-row>         
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="DialogKelasExport"
      fullscreen
      scrollable
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Memilih Kelas</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { DialogKelasExport = false }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4 ScrollFullscreen">
          <div
            v-for="data in DataKelas"
            :key="data.kategori"
            class="mt-4"
          >
            <h3 class="subheading black--text ml-3"><u>Kelas ({{ data.kategori }})</u></h3>
            <v-container fluid>
              <v-row v-if="DataKelas.length">
                <v-col
                  v-for="hasil in data.dataKelas"
                  :key="hasil.kelas"
                  cols="3"
                >
                  <v-card color="white" @click="hasil.jumlah > 0 ? exportExcelEmis(hasil.kelas) : warningNotif()">
                    <v-sheet color="green" class="sheetData" elevation="2">
                      <v-icon icon="mdi mdi-account-multiple" size="large" />
                      <v-card-subtitle class="text-black" style="font-weight: bold; font-size: 15px; margin-left: 5px;">Kelas {{ hasil.kelas }}</v-card-subtitle>
                    </v-sheet>
                    <v-card-actions>
                      <v-divider :thickness="2" />
                      <v-card-title class="text-black">{{ hasil.jumlah }} Orang</v-card-title>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-overlay :value="isLoadingExport" class="align-center justify-center">
      <div style="width: 550px;">
        <v-progress-linear
          class="pa-3"
          indeterminate
          color="black darken-3"
        />
        <h4 style="color: #FFF; text-align: center; background-color: #272727;">Sedang proses export data, harap menunggu ...</h4>
      </div>
    </v-overlay>
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
import { mapActions, mapState, mapGetters } from "vuex";
import { useMeta } from 'vue-meta'
import PopUpNotifikasiVue from "../../Layout/PopUpNotifikasi.vue";
import PdfCetakan from '../../Layout/PdfCetakan.vue';
export default {
  name: 'DataSiswaSiswi',
  components: {
    PdfCetakan,
    PopUpNotifikasiVue
  },
  data: () => ({
    isLoadingbtnPDF: false,
    isLoadingbtnPDF1: false,
    isLoadingbtnPDF2: false,
    isLoadingbtnPDF3: false,
    isLoadingbtnPDF4: false,
    isLoadingbtnPDF5: false,
    isLoadingbtnPDF6: false,
    isLoadingExport: false,
    expanded: [],
		DataSiswaSiswi: [],
    DataKelas: [],
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
      { title: "NAMA", key: "nama", sortable: false },
      { title: "EMAIL", key: "email", sortable: false },
      { title: "KELAS", key: "kelas", sortable: false },
      { title: "VALIDASI AKUN", key: "validasi", sortable: false },
      { title: "MUTASI AKUN", key: "mutasi", sortable: false },
      { title: "STATUS", key: "statusAktif", sortable: false },
      { title: "FLAG", key: "flag", sortable: false, width: "5%" },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
    roleID: '',
    mengajarKelas: '',
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
      fotoProfil: '',
      fcIjazah: '',
      fcSKHUN: '',
      fcKK: '',
      fcKTPOrtu: '',
      fcAktaLahir: '',
      fcSKL: '',
    },
    dialogPDF: false,
    DialogSiswaSiswi: false,
    dialogUploadBerkas: false,
    dialogImport: false,
    DialogKelasExport: false,
    urlSk: window.location.href,
    endecryptType: '',
    BASE_URL: '',
    componentKey: 0,
    fcIjazah: '',
    fcSKHUN: '',
    fcKK: '',
    fcKTP: '',
    fcAktaLahir: '',
    fcSKL: '',
    kondisiKepalaSekolah: false,

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Data Siswa Siswi",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
  },
  computed: {
    ...mapState({
      jabatan: store => store.setting.jabatanOptions,
      kelas: store => store.setting.kelasOptions,
      loadingtable: store => store.user.loadingtable,
    }),
    ...mapGetters({
      siswasiswiAll: 'user/siswasiswiAll',
      kelasSiswa: 'kelas/kelasSiswa',
      UID: 'setting/userUID',
    }),
    kelasOptions(){
			return this.kelas
		},
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
        this.$router.push({name: "FormulirSiswaSiswi", params: { kondisi: 'ADD', uid: value }});
      }
    },
    kelasSiswa: {
      deep: true,
			handler(value) {
        let result = [
          { kategori: '7'},
          { kategori: '8'},
          { kategori: '9'},
        ]

        result.map(async val => {
          let hasil = []
          await value.map(str => {
            let split = str.kelas.split('-')
            if(split[0] === val.kategori){
              hasil.push({
                kelas: str.kelas,
                jumlah: str.jumlah,
              })
            }
            return hasil
          })
          this.DataKelas.push({
            kategori: val.kategori,
            dataKelas: hasil,
          })
        })
      }
    },
    siswasiswiAll: {
			deep: true,
			handler(value) {
        // let datasiswa = value.records
        // if(this.roleID === '3' && !this.kondisiKepalaSekolah){
        //   this.DataSiswaSiswi = datasiswa.filter(val => !val.flag)
        //   return this.DataSiswaSiswi
        // }
        this.pageOptions = []
        this.DataSiswaSiswi = value.records
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
				this.getSiswaSiswi(this.roleID === '1' || this.roleID === '2' || (this.roleID === '3' && this.kondisiKepalaSekolah) ? {page: value, limit: this.limit, keyword: this.searchData} : {page: value, limit: this.limit, keyword: this.searchData, kelas: this.mengajarKelas})
			}
		},
    limit: {
			deep: true,
			handler(value) {
				this.getSiswaSiswi(this.roleID === '1' || this.roleID === '2' || (this.roleID === '3' && this.kondisiKepalaSekolah) ? {page: 1, limit: value, keyword: this.searchData} : {page: 1, limit: value, keyword: this.searchData, kelas: this.mengajarKelas})
			}
		},
    jabatanOptions: {
			deep: true,
			handler(value) {
				if(this.roleID === '3'){
					if(value.includes('Kepala Sekolah')){
						this.kondisiKepalaSekolah = true
        		this.getSiswaSiswi(this.roleID === '1' || this.roleID === '2' || (this.roleID === '3' && this.kondisiKepalaSekolah) ? {page: this.page, limit: this.limit, keyword: this.searchData} : {page: this.page, limit: this.limit, keyword: this.searchData, kelas: this.mengajarKelas});
					}
        //   else{
				// 		this.kondisiKepalaSekolah = false
        //   }
        // if(this.roleID === '3' && !this.kondisiKepalaSekolah) return this.headers.splice(6,4)
				}
			}
		}
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.BASEURL = process.env.VUE_APP_BASE_URL
    this.roleID = localStorage.getItem('roleID')
    this.mengajarKelas = localStorage.getItem('mengajar_kelas')
		this.getSiswaSiswi(this.roleID === '1' || this.roleID === '2' || (this.roleID === '3' && this.kondisiKepalaSekolah) ? {page: this.page, limit: this.limit, keyword: this.searchData} : {page: this.page, limit: this.limit, keyword: this.searchData, kelas: this.mengajarKelas});
		this.getKelas({kondisi: 'All'});
	},
	methods: {
		...mapActions({
      fetchData: 'fetchData',
      uploadFiles: 'upload/uploadFiles',
      getSiswaSiswi: 'user/getSiswaSiswi',
      getKelasSiswa: 'kelas/getKelasSiswa',
      getKelas: 'setting/getKelas',
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
      this.$store.dispatch('user/postSiswaSiswi', bodyData)
      .then((res) => {
        if(localStorage.getItem('roleID') !== '1'){
					let payload = {
						jenis: 'CREATE',
						idUser: '2MMOu7xFdkbe4YFRjpp71fRkV26',
						type: 'Record',
						judul: `${jenis === 'STATUSRECORD' || jenis === 'DELETE' ? 'Status Record' : jenis === 'MUTASIAKUN' ? 'Mutasi Akun' : 'Validasi Akun'} data siswa/siswa`,
						pesan: {
							message: `data siswa/siswa telah diubah ${jenis === 'STATUSRECORD' || jenis === 'DELETE' ? 'status record' : jenis === 'MUTASIAKUN' ? 'mutasi akun' : 'validasi akun'} oleh <strong>${localStorage.getItem('nama')}</strong>`,
							payload: bodyData,
						},
						params: null,
            dikirim: `dikirim oleh <strong>${localStorage.getItem('nama')}</strong>`,
            createBy: localStorage.getItem('idLogin'),
					}
					this.$store.dispatch('setting/postNotifikasi', payload)
				}
        this.getSiswaSiswi(this.roleID === '1' || this.roleID === '2' || (this.roleID === '3' && this.kondisiKepalaSekolah) ? {page: 1, limit: this.limit, keyword: this.searchData} : {page: 1, limit: this.limit, keyword: this.searchData, kelas: this.mengajarKelas})
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    ubahData(uid){
      this.$router.push({name: "FormulirSiswaSiswi", params: { kondisi: 'EDIT', uid: uid }});
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
        nikIbu: item.dataOrangtua.dataIbu.nikIbu,
        namaIbu: this.uppercaseLetterFirst2(item.dataOrangtua.dataIbu.namaIbu),
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
        fotoProfil: item.fotoProfil,
        fcIjazah: item.berkas.fcIjazah,
        fcSKHUN: item.berkas.fcSKHUN,
        fcKK: item.berkas.fcKK,
        fcKTPOrtu: item.berkas.fcKTPOrtu,
        fcAktaLahir: item.berkas.fcAktaLahir,
        fcSKL: item.berkas.fcSKl,
      }
      console.log(item);
      this.DialogSiswaSiswi = true
    },
    downloadTemplate() {
			this.isLoadingExport = true
			fetch(`${this.BASEURL}user/template/4`, {
				method: 'GET',
				dataType: "xml",
			})
			.then(response => response.arrayBuffer())
			.then(async response => {
				// console.log(response)
				this.isLoadingExport = false
				let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
				this.downloadBlob(blob,`Template Data Siswa.xlsx`)
				this.notifikasi("success", 'Sukses Export Excel', "1")
			})
		},
    exportExcel(kategori) {
      if(kategori === 'full'){
        this.isLoadingExport = true
        fetch(`${this.BASEURL}user/exportexcel?kategori=${kategori}&kelas=${this.kelasOptions.map(str => str.kelas).join(', ')}`, {
          method: 'GET',
          dataType: "xml",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('user_token')}`
          }
        })
        .then(response => response.arrayBuffer())
        .then(async response => {
          // console.log(response)
          this.isLoadingExport = false
          let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          this.downloadBlob(blob,`Data Siswa Siswi.xlsx`)
          this.notifikasi("success", 'Sukses Export Excel', "1")
        })
      }else if(kategori === 'emis'){
        this.getKelasSiswa({kelas: null, roleID: this.roleID})
        this.DialogKelasExport = true
      }
		},
    exportExcelEmis(kelas) {
      this.isLoadingExport = true
      fetch(`${this.BASEURL}user/exportexcel?kategori=emis&kelas=${kelas}`, {
        method: 'GET',
        dataType: "xml",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`
        }
      })
      .then(response => response.arrayBuffer())
      .then(async response => {
        // console.log(response)
        this.isLoadingExport = false
        let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        this.downloadBlob(blob,`Data Siswa Siswi ${kelas} (EMIS).xlsx`)
        this.notifikasi("success", 'Sukses Export Excel', "1")
      })
		},
    pdfCreate(idUser, berkas = null, jenis = null, view) {
      if(view === 'berkas'){
        jenis === 'ijazah' ? this.isLoadingbtnPDF1 = true
        : jenis === 'skhun' ? this.isLoadingbtnPDF2 = true
        : jenis === 'kk' ? this.isLoadingbtnPDF3 = true
        : jenis === 'ktp' ? this.isLoadingbtnPDF4 = true
        : jenis === 'aktalahir' ? this.isLoadingbtnPDF5 = true
        : this.isLoadingbtnPDF6 = true
        this.dialogPDF = false
        this.urlSk = ''
        if(!berkas) {
          jenis === 'ijazah' ? this.isLoadingbtnPDF1 = false
          : jenis === 'skhun' ? this.isLoadingbtnPDF2 = false
          : jenis === 'kk' ? this.isLoadingbtnPDF3 = false
          : jenis === 'ktp' ? this.isLoadingbtnPDF4 = false
          : jenis === 'aktalahir' ? this.isLoadingbtnPDF5 = false
          : this.isLoadingbtnPDF6 = false
          const nameJenis = jenis === 'ijazah' ? 'Ijazah'
          : jenis === 'skhun' ? 'SKHUN'
          : jenis === 'kk' ? 'Kartu Keluarga'
          : jenis === 'ktp' ? 'KTP Orang Tua'
          : jenis === 'aktalahir' ? 'Akta Lahir'
          : 'Surat Keterangan Lulus'
          return this.notifikasi("warning", `Data Berkas ${nameJenis} tidak ditemukan!`, "1")
        }
        this.urlSk = berkas
        setTimeout(() => {
          jenis === 'ijazah' ? this.isLoadingbtnPDF1 = false
          : jenis === 'skhun' ? this.isLoadingbtnPDF2 = false
          : jenis === 'kk' ? this.isLoadingbtnPDF3 = false
          : jenis === 'ktp' ? this.isLoadingbtnPDF4 = false
          : jenis === 'aktalahir' ? this.isLoadingbtnPDF5 = false
          : this.isLoadingbtnPDF6 = false
          this.dialogPDF = true;
        }, 3000);
      }else if(view === 'create'){
        this.dialogPDF = false
        this.isLoadingbtnPDF = true
        this.urlSk = ''
        fetch(`${this.BASEURL}user/pdfcreate/${idUser}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('user_token')}`
          }
        })
        .then(response => response.arrayBuffer())
        .then(async response => {
          let blob = new Blob([response], { type: 'application/pdf' })
          this.urlSk = window.URL.createObjectURL(blob)
        })
        setTimeout(() => {
          this.isLoadingbtnPDF = false
          this.dialogPDF = true;
        }, 3000);
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
        fotoProfil: '',
        fcIjazah: '',
        fcSKHUN: '',
        fcKK: '',
        fcKTPOrtu: '',
        fcAktaLahir: '',
        fcSKL: '',
      }
    },
    pilihFile(jenis) {
      if(jenis === 'ijazah') return this.$refs.inputIjazah.click();
      else if(jenis === 'skhun') return this.$refs.inputSKHUN.click();
      else if(jenis === 'kk') return this.$refs.inputKK.click();
      else if(jenis === 'ktp') return this.$refs.inputKTP.click();
      else if(jenis === 'aktalahir') return this.$refs.inputAktaLahir.click();
      else if(jenis === 'skl') return this.$refs.inputSKL.click();
      else if(jenis === 'excel') return this.$refs.inputExcel.click();
    },
    async uploadBerkas(e, jenis) {
      let files = e.target.files[0];
      if(!files) return this.notifikasi("warning", 'Ulangi unggah Foto Profile', "1")
      let ukuran = (files.size / (1024*1024)).toFixed(2);
      if(ukuran > 5.00) { 
        this.componentKey++; 
        return this.notifikasi("warning", 'Unggah Foto Profile anda terlalu besar !', "1")
      }
      if(jenis === 'ijazah') { this.fcIjazah = files.name; this.prosesUpload(jenis, files); files = ''; }
      else if(jenis === 'skhun') { this.fcSKHUN = files.name; this.prosesUpload(jenis, files); files = ''; }
      else if(jenis === 'kk') { this.fcKK = files.name; this.prosesUpload(jenis, files); files = ''; }
      else if(jenis === 'ktp') { this.fcKTP = files.name; this.prosesUpload(jenis, files); files = ''; }
      else if(jenis === 'aktalahir') { this.fcAktaLahir = files.name; this.prosesUpload(jenis, files); files = ''; }
      else if(jenis === 'skl') { this.fcSKL = files.name; this.prosesUpload(jenis, files); files = ''; }
    },
    async prosesUpload(jenis, dataUpload) {
      let uploadDataBerkas = await this.uploadLampiran(this.previewData.idUser, jenis, dataUpload)
      if(uploadDataBerkas != undefined){ 
        if(localStorage.getItem('roleID') !== '1'){
					let payload = {
						jenis: 'CREATE',
						idUser: '2MMOu7xFdkbe4YFRjpp71fRkV26',
						type: 'Record',
						judul: `Upload berkas data siswa/siswa`,
						pesan: {
							message: `data siswa/siswa telah diupload berkasnya oleh <strong>${localStorage.getItem('nama')}</strong>`,
							payload: null,
						},
						params: null,
            dikirim: `dikirim oleh <strong>${localStorage.getItem('nama')}</strong>`,
            createBy: localStorage.getItem('idLogin'),
					}
					this.$store.dispatch('setting/postNotifikasi', payload)
				}
        this.clearFile(jenis)
        this.getSiswaSiswi(this.roleID === '1' || this.roleID === '2' || (this.roleID === '3' && this.kondisiKepalaSekolah) ? {page: this.page, limit: this.limit, keyword: this.searchData} : {page: this.page, limit: this.limit, keyword: this.searchData, kelas: this.mengajarKelas});
        this.notifikasi("success", `Berhasil upload berkas ${jenis === 'ijazah' ? 'Ijazah' : jenis === 'skhun' ? 'SKHUN' : jenis === 'kk' ? 'Kartu Keluarga' : jenis === 'ktp' ? 'KTP Orangtua' : jenis === 'aktalahir' ? 'Akta Lahir' : 'SKL'}`, "1")
      }else{ 
        this.componentKey++;
        this.clearFile(jenis)
        this.notifikasi("error", `Gagal upload berkas ${jenis === 'ijazah' ? 'Ijazah' : jenis === 'skhun' ? 'SKHUN' : jenis === 'kk' ? 'Kartu Keluarga' : jenis === 'ktp' ? 'KTP Orangtua' : jenis === 'aktalahir' ? 'Akta Lahir' : 'SKL'}`, "1")
      }
    },
    async uploadLampiran(idUser, jenis, dataUpload) {
			if(dataUpload){
				const bodyData = {
					idUser: idUser,
					field: jenis,
					nama_folder: idUser,
					nama_file: `${idUser}-${jenis}`,
					jenis: "pdf",
					bagian: "berkas",
					table: "UserDetail",
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
    clearFile(jenis) {
      if(jenis === 'ijazah') {
        this.fcIjazah = ''
        this.$refs.inputIjazah.value = null;
      }else if(jenis === 'skhun') {
        this.fcSKHUN = ''
        this.$refs.inputSKHUN.value = null;
      }else if(jenis === 'kk') {
        this.fcKK = ''
        this.$refs.inputKK.value = null;
      }else if(jenis === 'ktp') {
        this.fcKTP = ''
        this.$refs.inputKTP.value = null;
      }else if(jenis === 'aktalahir') {
        this.fcAktaLahir = ''
        this.$refs.inputAktaLahir.value = null;
      }else if(jenis === 'skl') {
        this.fcSKL = ''
        this.$refs.inputSKL.value = null;
      }
    },
    async importExcel(e) {
      this.isLoadingExport = true
      let files = e.target.files[0];
      if(files){
				const bodyData = {
					jenis: "excel",
				  createupdateBy: localStorage.getItem('idLogin'),
					files: files,
				};
				try {
					await this.uploadFiles(bodyData);
          files = ''
          this.isLoadingExport = false
          this.$refs.inputExcel.value = null
          if(localStorage.getItem('roleID') !== '1'){
            let payload = {
              jenis: 'CREATE',
              idUser: '2MMOu7xFdkbe4YFRjpp71fRkV26',
              type: 'Record',
              judul: `Import data siswa/siswa`,
              pesan: {
                message: `data siswa/siswa telah diimport oleh <strong>${localStorage.getItem('nama')}</strong>`,
                payload: null,
              },
              params: null,
              dikirim: `dikirim oleh <strong>${localStorage.getItem('nama')}</strong>`,
              createBy: localStorage.getItem('idLogin'),
            }
            this.$store.dispatch('setting/postNotifikasi', payload)
          }
          this.getSiswaSiswi(this.roleID === '1' || this.roleID === '2' || (this.roleID === '3' && this.kondisiKepalaSekolah) ? {page: this.page, limit: this.limit, keyword: this.searchData} : {page: this.page, limit: this.limit, keyword: this.searchData, kelas: this.mengajarKelas});
					this.notifikasi("success", "Berhasil Import Data Siswa Siswi", "1")
				} catch (err) {
          this.isLoadingExport = false
          this.componentKey++;
          files = ''
          this.$refs.inputExcel.value = null
          this.notifikasi("error", "Gagal Import Data Siswa Siswi", "1")
				}
			}else{
        this.isLoadingExport = false
        this.componentKey++;
        files = ''
        this.$refs.inputExcel.value = null
        this.notifikasi("warning", "Ulangi lagi Import Data Siswa Siswi", "1")
      }  
    },
    warningNotif(){
      this.notifikasi("warning", "Tidak ada siswa/i dikelas ini", "1")
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
.listData {
	width: 200px !important;
}
.v-input .v-label {
  font-size: 11pt !important;
}
.v-text-field.v-input--dense {
  font-size: 13px !important;
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
.SelectedMenu{
  min-height: 35px !important;
}
.SelectedMenu:hover {
	border-radius: 4px;
	background: #939494;
	cursor: pointer;
	color: white;
}
.SelectedMenu-active {
	border-radius: 4px;
	background: rgba(132, 131, 195, 0.19);
	cursor: pointer;
	color: white;
}
.v-list-item__title {
  align-self: center;
  font-size: 10pt !important;
  font-weight: bold;
}
.myclass {
  color: red;
  background-color: green;
}
</style>