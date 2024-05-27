<template>
  <div>
    <h1 class="subheading grey--text text-decoration-underline">Data {{ roleID === '4' || roleID === '3' ? 'Guru' : 'Struktural' }}</h1>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-alert
        v-if="roleID === '1' || roleID === '2'"
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
            <li>- Tombol Delete ada 2 (Delete Soft & Delete Hard).</li>
            <li>- Tombol Delete Soft tidak menghapus data dari database hanya di jadikan nonaktif dan ditandai dengan flag merah.</li>
            <li>- Tombol Delete Hard menghapus data dari database secara permanen.</li>
            <li>- Mengurutkan data berdasarkan NOMOR INDUK, NAMA, STATUS.</li>
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
        :items="DataStruktural"
        expand-on-click
        item-value="idUser"
        :sort-by="sortBy"
        density="comfortable"
        hide-default-footer
        hide-default-header
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
        <template #[`item.number`]="{ item }">
          {{ page > 1 ? ((page - 1)*limit) + item.index + 1 : item.index + 1 }}
        </template>
        <template #[`item.nama`]="{ item }">
          <span v-html="uppercaseLetterFirst2(item.raw.nama)" /><br>
          <span v-html="item.raw.email" /> 
        </template>
        <template #[`item.jabatan`]="{ item }">
          <span v-if="item.raw.jabatanGuru === null">-</span>
          <ul v-else><li v-for="v in item.raw.jabatanGuru" :key="v.kode">{{ v.label === 'Wali Kelas' ? `${v.label} (${item.raw.waliKelas})` : v.label }}</li></ul>
        </template>
        <template #[`item.mapel`]="{ item }">
          <span v-if="item.raw.mengajarBidang === null">-</span>
          <ul v-else><li v-for="v in item.raw.mengajarBidang" :key="v.kode">{{ v.label }}</li></ul>
        </template>
        <template #[`item.kelas`]="{ item }">
          <!-- <ul><li v-for="kelas in item.raw.mengajarKelas.split(', ')" :key="kelas">{{ kelas }}</li></ul> -->
          <span v-if="item.raw.mengajarKelas === null">-</span>
          <span v-else v-html="item.raw.mengajarKelas" />
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
                v-if="roleID === '1' || roleID === '2' || (roleID === '3' && kondisiKepalaSekolah)"
                color-button="#0bd369"
                icon-prepend-button="mdi mdi-pencil"
                nama-button="Ubah"
                :disabled-button="item.raw.statusAktif === false"
                @proses="ubahData(item.raw.idUser, 'ubahdata')"
              />
              <Button
                v-if="roleID === '1' || roleID === '2' || (roleID === '3' && kondisiKepalaSekolah)"
                color-button="#0bd369"
                :icon-prepend-button="item.raw.statusAktif === false ? 'mdi mdi-eye' : 'mdi mdi-eye-off'"
                :nama-button="item.raw.statusAktif === false ? 'Active' : 'Non Active'"
                @proses="postRecord(item.raw, 'STATUSRECORD', !item.raw.statusAktif)"
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
                    v-if="roleID === '1' || roleID === '2' || (roleID === '3' && kondisiKepalaSekolah)"
                    v-bind="props"
                    color-button="#bd3a07"
                    icon-prepend-button="mdi mdi-delete"
                    icon-append-button="mdi mdi-menu-down"
                    nama-button="Hapus"
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
                    @click="postRecord(item.raw, 'DELETESOFT', null)"
                    class="SelectedMenu"
                    active-class="SelectedMenu-active"
                    title="Delete Soft"
                    :disabled="item.raw.statusAktif === false"
                  >
                    <template v-slot:prepend>
                      <v-icon size="middle" icon="mdi mdi-delete" color="icon-white" />
                    </template>
                    <template v-slot:title>
                      <span class="menufont">Delete Soft</span>
                    </template>
                  </v-list-item>
                  <v-list-item
                    @click="postRecord(item.raw, 'DELETEHARD', null)"
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
              <Button
                v-if="roleID === '1' || roleID === '2'"
                color-button="#0bd369"
                icon-prepend-button="mdi mdi-signature-freehand"
                nama-button="Signature"
                :disabled-button="item.raw.statusAktif === false"
                @proses="ubahData(item.raw.idUser, 'signature')"
              />
              <Button 
                color-button="#04f7f7"
                icon-prepend-button="mdi mdi-information"
                nama-button="Detail"
                @proses="openDialog(item.raw)"
              />
            </td>
          </tr>
        </template>
        <template #top>
          <v-row no-gutters class="pa-2">
            <v-col cols="12" md="6">
              <Button 
                v-if="roleID === '1' || roleID === '2' || (roleID === '3' && kondisiKepalaSekolah)"
                color-button="light-blue darken-3"
                icon-prepend-button="mdi mdi-plus-thick"
                nama-button="Tambah"
                @proses="getUID"
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
                      getStruktural({page: 1, limit: limit, keyword: ''})
                    }"
                    @keyup.enter="() => {
                      page = 1
                      getStruktural({page: 1, limit: limit, keyword: searchData})
                    }"
                  />
                </v-col>
                <v-col cols="12" md="3" class="d-flex justify-end align-center">
                  <Autocomplete
                    v-model="page"
                    :data-a="pageOptions"
                    label-a="Page"
                    :disabled-a="DataStruktural.length ? false : true"
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
                v-if="DataStruktural.length && selectRecord.length < DataStruktural.length"
                color-button="#0bd369"
                icon-prepend-button="mdi mdi-select-all"
                :nama-button="`Choose All (${selectRecord.length})`"
                @proses="allData(DataStruktural)"
              />
              <Button
                v-if="selectRecord.length"
                color-button="#0bd369"
                icon-prepend-button="mdi mdi-select-remove"
                :nama-button="`Remove Select`"
                @proses="() => { selectRecord = [] }"
              />
              <Button 
                color-button="#bd3a07"
                icon-prepend-button="mdi mdi-delete"
                nama-button="Hapus Record Selected"
                :disabled-button="!DataStruktural.length"
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
                  :disabled-a="DataStruktural.length ? false : true"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="#ffffff"
                  icon-button="mdi mdi-arrow-left-circle-outline"
                  :disabled-button="DataStruktural.length ? pageSummary.page != 1 ? false : true : true"
                  @proses="() => { page = pageSummary.page - 1 }"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="#ffffff"
                  icon-button="mdi mdi-arrow-right-circle-outline"
                  :disabled-button="DataStruktural.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
                  @proses="() => { page = pageSummary.page + 1 }"
                />
              </div>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="DialogStruktural"
      scrollable
      persistent
      transition="dialog-bottom-transition"
      width="auto"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Data Detail Struktural</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { clearData(); DialogStruktural = false; }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4 v-dialog--custom">
          <div class="text-center">
            <v-avatar size="150" style="border: solid 2px #000;">
              <v-img :src="previewData.fotoProfil"></v-img>
            </v-avatar>
          </div>
          <Fieldset
            legend="Data Log In"
            :toggleable="true"
          >
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
                class="d-flex align-center font-weight-bold"
              >
                Kata Sandi
              </v-col>
              <v-col
                cols="12"
                md="8"
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
            <v-row v-if="roleID === '1' || roleID === '2'" no-gutters>
              <v-col
                cols="12"
                md="4"
                class="d-flex align-center font-weight-bold"
              >
                Tanda Tangan
              </v-col>
              <v-col
                cols="12"
                md="8"
              > 
                <span v-if="previewData.signature === null">Belum ada Tanda Tangan</span>
                <v-img v-else :src="previewData.signature" style="border: solid 1px #000; height: 100px; width: 100px;"></v-img>
              </v-col>
            </v-row>
          </Fieldset>
          <Fieldset
            legend="Data Alamat"
            :toggleable="true"
            :collapsed="true"
          >
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
                Kelurahan / Desa
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
          </Fieldset>
          <Fieldset
            legend="Data Kelengkapan"
            :toggleable="true"
            :collapsed="true"
          >
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
                Pendidikan Struktural
              </v-col>
              <v-col
                cols="12"
                md="8"
                class="pt-3"
              >
                {{ previewData.pendidikanGuru }}
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col
                cols="12"
                md="4"
                class="pt-2 d-flex align-center font-weight-bold"
              >
                Jabatan Struktural
              </v-col>
              <v-col
                cols="12"
                md="8"
                class="pt-3"
              >
                {{ previewData.jabatanGuru }}
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col
                cols="12"
                md="4"
                class="pt-2 d-flex align-center font-weight-bold"
              >
                Mangajar Bidang
              </v-col>
              <v-col
                cols="12"
                md="8"
                class="pt-3"
              >
                {{ previewData.mengajarBidang }}
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col
                cols="12"
                md="4"
                class="pt-2 d-flex align-center font-weight-bold"
              >
                Mangajar Kelas
              </v-col>
              <v-col
                cols="12"
                md="8"
                class="pt-3"
              >
                {{ previewData.mengajarKelas }}
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col
                cols="12"
                md="4"
                class="pt-2 d-flex align-center font-weight-bold"
              >
                Wali Kelas
              </v-col>
              <v-col
                cols="12"
                md="8"
                class="pt-3"
              >
                {{ previewData.waliKelas ? previewData.waliKelas : '-' }}
              </v-col>
            </v-row>
          </Fieldset>
        </v-card-text>
        <v-divider />
        <v-card-actions />
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="DialogSignature"
      scrollable
      persistent
      transition="dialog-bottom-transition"
      width="auto"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Signature</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { previewData.idUser = ''; clearCrop(); clear(); DialogSignature = false; }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4 v-dialog--custom">
          <v-row no-gutters>
            <v-col
              cols="12"
              md="6"
              class="d-flex align-center justify-center font-weight-bold"
            >
              Signature
            </v-col>
            <v-col
              cols="12"
              md="6"
              class="d-flex align-center justify-center font-weight-bold"
            >
              Crop Signature
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="6"
              class="d-flex align-center justify-center"
            >
              <VueSignaturePad
                id="signature"
                width="300px"
                height="300px"
                ref="signaturePad"
                :options="options"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
              class="d-flex align-center justify-center"
            >
              <Cropper
                ref="cropper"
                class="cropper-signature"
                :src="image.src"
                :stencil-component="RectangleStencil"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="6"
              class="d-flex align-center justify-center"
            >
              <Button
                color-button="#0bd369"
                nama-button="Clear"
                @proses="clear()"
              />
              <Button
                color-button="#0bd369"
                nama-button="Undo"
                @proses="undo()"
              />
              <Button
                color-button="#0bd369"
                nama-button="Proses"
                @proses="save()"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
              class="d-flex align-center justify-center"
            >
              <Button
                color-button="#0bd369"
                nama-button="Crop Signature"
                @proses="crop()"
              />
              <Button
                color-button="#0bd369"
                nama-button="Clear"
                @proses="clearCrop()"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions />
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
import { mapActions, mapState, mapGetters } from "vuex";
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
  name: 'DataStruktural',
  components: {
    PopUpNotifikasi, RectangleStencil
  },
  data: () => ({
		expanded: [],
		DataStruktural: [],
    selectRecord: [],
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
		kumpulSort: '',
		headers: [
      { title: "No", key: "number", sortable: false, width: "5%" },
      { title: "#", key: "data-table-expand", sortable: false, width: "5%" },
      { title: "NOMOR INDUK", key: "nomorInduk", sortable: true },
      { title: "NAMA / EMAIl", key: "nama", sortable: true },
      { title: "JABATAN", key: "jabatan", sortable: false },
      { title: "MATA PELAJARAN", key: "mapel", sortable: false },
      { title: "KELAS", key: "kelas", sortable: false, width: "15%" },
      { title: "STATUS", key: "statusAktif", sortable: true },
      { title: "FLAG", key: "flag", sortable: false, width: "5%" },
      { title: "#", key: "data-table-select", sortable: false, width: "3%" },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
    roleID: '',
    previewData: {
      idUser: '',
      namaRole: '',
      nama: '',
      username: '',
      email: '',
      password: '',
      tempat: '',
      tanggalLahir: '',
      jenisKelamin: '',
      agama: '',
      telp: '',
      alamat: '',
      provinsi: '',
      kabKota: '',
      kecamatan: '',
      kelurahan: '',
      kodePos: '',
      nomorInduk: '',
      pendidikanGuru: '',
      jabatanGuru: '',
      mengajarBidang: '',
      mengajarKelas: '',
      waliKelas: '',
      fotoProfil: '',
      signature: null,
    },
    DialogStruktural: false,
    DialogSignature: false,
    endecryptType: '',
    kondisiKepalaSekolah: false,
    options: {
      penColor: "#000",
    },
    image: {
      src: null,
      type: null,
    },

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Data Struktural",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
		return { RectangleStencil }
  },
  computed: {
		...mapState({
			jabatan: store => store.setting.jabatanOptions,
			loadingtable: store => store.user.loadingtable,
		}),
    ...mapGetters({
      strukturalAll: 'user/strukturalAll',
      UID: 'setting/userUID',
    }),
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
		},
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
    UID: {
      deep: true,
			handler(value) {
        this.$router.push({name: "FormulirStruktural", params: { kondisi: 'ADD', uid: value }});
      }
    },
    strukturalAll: {
			deep: true,
			handler(value) {
        this.pageOptions = []
        this.DataStruktural = value.records
				this.pageSummary = {
					page: this.DataStruktural.length ? value.pageSummary.page : 0,
					limit: this.DataStruktural.length ? value.pageSummary.limit : 0,
					total: this.DataStruktural.length ? value.pageSummary.total : 0,
					totalPages: this.DataStruktural.length ? value.pageSummary.totalPages : 0
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
          this.getStruktural({page: value, limit: this.limit, keyword: this.searchData, sorting: this.kumpulSort})
        }
			}
		},
    limit: {
			deep: true,
			handler(value) {
        this.page = 1
				this.getStruktural({page: 1, limit: value, keyword: this.searchData, sorting: this.kumpulSort})
			}
		},
    jabatanOptions: {
			deep: true,
			handler(value) {
				if(this.roleID === '3'){
					if(value.includes('Kepala Sekolah')){
						this.kondisiKepalaSekolah = true
					}
				}
			}
		}
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.roleID = localStorage.getItem('roleID')
		this.getStruktural({page: this.page, limit: this.limit, keyword: this.searchData, sorting: this.kumpulSort});
    if(this.roleID === '4') { this.headers.splice(7,3); }
	},
	methods: {
		...mapActions({
      fetchData: 'fetchData',
      uploadFiles: 'upload/uploadFiles',
      getStruktural: 'user/getStruktural',
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
      this.$store.dispatch('user/postStruktural', bodyData)
      .then((res) => {
        if(localStorage.getItem('roleID') !== '1'){
					let payload = {
						jenis: 'CREATE',
						idUser: '2MMOu7xFdkbe4YFRjpp71fRkV26',
						type: 'Record',
						judul: 'Status Record data struktural',
						pesan: {
							message: `data struktural telah diubah status <strong>${localStorage.getItem('nama')}</strong>`,
							payload: bodyData,
						},
						params: null,
            dikirim: `dikirim oleh <strong>${localStorage.getItem('nama')}</strong>`,
            createBy: localStorage.getItem('idLogin'),
					}
					this.$store.dispatch('setting/postNotifikasi', payload)
				}
        this.getStruktural({page: 1, limit: this.limit, keyword: this.searchData, sorting: this.kumpulSort})
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    ubahData(uid, jenis){
      if(jenis === 'ubahdata'){
        this.$router.push({name: "FormulirStruktural", params: { kondisi: 'EDIT', uid: uid }});
      }else if(jenis === 'signature'){
        this.previewData.idUser = uid
        this.DialogSignature = true
      }
    },
    openDialog(item){
      // this.getAdminbyUID(uid)
      // console.log(item);
      this.previewData = {
        idUser: item.idUser,
        namaRole: item.namaRole,
        nama: item.nama,
        username: item.username,
        email: item.email,
        password: item.kataSandi,
        tempat: item.tempat,
        tanggalLahir: item.tanggalLahir,
        jenisKelamin: item.jenisKelamin,
        agama: item.agama.label,
        telp: item.telp,
        alamat: item.alamat,
        provinsi: item.provinsi.nama,
        kabKota: `${item.kabKota.jenisKabKota} ${item.kabKota.nama}`,
        kecamatan: item.kecamatan.nama,
        kelurahan: `${item.kelurahan.jenisKelDes} ${item.kelurahan.nama}`,
        kodePos: item.kodePos,
        nomorInduk: item.nomorInduk,
        pendidikanGuru: item.pendidikanGuru.label,
        jabatanGuru: item.jabatanGuru === null ? '-' : item.jabatanGuru.map(str => { return str.label; }).sort().join(', '),
        mengajarBidang: item.mengajarBidang === null ? '-' : item.mengajarBidang.map(str => { return str.label; }).sort().join(', '),
        mengajarKelas: item.mengajarKelas === null ? '-' : item.mengajarKelas,
        waliKelas: item.waliKelas,
        fotoProfil: item.fotoProfil,
        signature: item.signature,
      }
      this.DialogStruktural = true
    },
    clearData(){
      this.previewData = {
        idUser: '',
        namaRole: '',
        nama: '',
        username: '',
        email: '',
        password: '',
        tempat: '',
        tanggalLahir: '',
        jenisKelamin: '',
        agama: '',
        telp: '',
        alamat: '',
        provinsi: '',
        kabKota: '',
        kecamatan: '',
        kelurahan: '',
        kodePos: '',
        nomorInduk: '',
        pendidikanGuru: '',
        jabatanGuru: '',
        mengajarBidang: '',
        mengajarKelas: '',
        waliKelas: '',
        fotoProfil: '',
        signature: null,
      }
    },
    undo() {
      this.$refs.signaturePad.undoSignature();
    },
    clear() {
      this.$refs.signaturePad.clearSignature();
    },
    async save() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      if(isEmpty) return alert('tidak ada signature!')
      const block = data.split(";");
      const contentType = block[0].split(":")[1];
      const realData = block[1].split(",")[1];
      const blob = this.b64toBlob(realData, contentType);
      // console.log(blob);
      this.loadImage(blob)
    },
    loadImage(files) {
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
        let uploadSignature = await this.uploadLampiran(this.previewData.idUser, blob)
        if(uploadSignature != undefined){
          this.notifikasi("success", "Signature berhasil di buat !", "1")
        }else{ 
          this.notifikasi("failed", "Signature gagal di buat !", "1")
        }
        this.previewData.idUser = '';
        this.clearCrop(); 
        this.clear(); 
        this.DialogSignature = false;
			}, this.image.type);

		},
    async uploadLampiran(idUser, dataUpload) {
			if(dataUpload){
				const bodyData = {
					idUser: idUser,
					field: 'signature',
					nama_folder: idUser,
					nama_file: `${idUser}-signature`,
					jenis: "image",
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
    clearCrop(){
      this.image = {
        src: null,
        type: null,
      }
			this.$refs.cropper.value = null
    },
    allData(item) {
      if(item.length === this.selectRecord.length) return this.notifikasi("warning", "Data sudah di pilih semua pada page ini!", "1")
      item.map(val => {
        if(!this.selectRecord.includes(val.idUser)){
          this.selectRecord.push(val.idUser)
        }
      })
    },
    hapusAllRecord() {
      if(!this.selectRecord.length) return this.notifikasi("warning", "Belum ada record yang di pilih!", "1")
      let bodyData = {
        user: {
          jenis: 'DELETESELECTEDHARD',
          idUser: this.selectRecord,
        },
        userdetail: {}
      }
      this.$store.dispatch('user/postStruktural', bodyData)
      .then((res) => {
        this.selectRecord = []
        this.getStruktural({page: this.page, limit: this.limit, keyword: this.searchData, sorting: this.kumpulSort});
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    b64toBlob(b64Data, contentType, sliceSize) {
      contentType = contentType || '';
      sliceSize = sliceSize || 512;
      var byteCharacters = atob(b64Data);
      var byteArrays = [];
      for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
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
    updateSort(data) {
      this.sortBy = data
			this.kumpulSort = this.sortBy.map((val) => {
        return `${val.key}-${val.order === 'asc' ? 'ASC' : 'DESC'}`
      }).join(',')
		  this.getStruktural({page: this.page, limit: this.limit, keyword: this.searchData, sorting: this.kumpulSort});
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
</style>