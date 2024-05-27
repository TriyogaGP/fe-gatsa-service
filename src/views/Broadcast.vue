<template>
  <div>
    <h1 class="subheading grey--text text-decoration-underline">Data Broadcast</h1>
    <Button 
      v-if="roleID === '1' || roleID === '2' || roleID === '3'"
      color-button="light-blue darken-3"
      icon-prepend-button="mdi mdi-broadcast"
      nama-button="Broadcast"
      @proses="() => {
        this.getBerkas({kategori: 'tautan'})
        this.DialogBroadcast = true
      }"
    />
    <v-card class="mt-2 mb-2 pa-1 rounded" variant="outlined" elevation="4">
      <v-tabs
        v-if="roleID === '1' || roleID === '2' || roleID === '3'"
        v-model="tab"
        grow
        bg-color="background-dialog-card"
        density="comfortable"
      >
        <v-tab v-for="item in itemsTab" :key="item.code" :value="item.code">
          <v-icon :icon="item.icon" />
          {{ item.text }}
        </v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item value="1">
          <div v-if="dataNotifikasi.length" class="wadah-notif">
            <v-row>
              <v-col cols="12" md="12" class="text-right">
                <Button 
                  color-button="light-blue darken-3"
                  nama-button="Tandai Telah Dibaca"
                  size-button="x-small"
                  @proses="tandai(dataNotifikasi)"
                />
              </v-col>
            </v-row>
            <div class="wadah-notif-scroll">
              <v-infinite-scroll @load="load" side="end">
                <div v-for="notif, k in dataNotifikasi" :key="k" class="kotak-notif" @click="!downloadTautan ? openDialog(notif) : ''">
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <span class="box fourcorners" style="background-color: rgba(19, 234, 216, 0.822); color: black;">{{notif.type}}</span>
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                      class="kondisiNotif"
                    >
                      <p>{{notif.isRead ? 'sudah dibaca' : 'belum dibaca' }} <v-icon :color="notif.isRead == true ? 'green' : 'red'" :icon="notif.isRead == true ? 'mdi mdi-check' : 'mdi mdi-close'" /></p>
                    </v-col>
                  </v-row>
                  <p class="judulNotif">{{notif.judul}}</p>
                  <span class="pesanNotif" v-html="notif.pesan.message" /><br>
                  <span v-if="notif.pesan.payload != 'null'" class="pesanNotif">payload: </span>
                  <span v-if="notif.pesan.payload != 'null'" class="pesanNotif" v-html="notif.pesan.payload" />
                  <span v-if="notif.tautan.length" class="judulNotif"><v-icon color="black" size="large" icon="mdi mdi-attachment" /> Lampiran</span>
                  <v-row v-if="notif.tautan.length">
                    <v-col
                      class="grid-col-tautan"
                      v-for="tautan in notif.tautan" :key="tautan.idBerkas"
                    >
                      <div class="kotak-tautan" @click="downloadBerkas(tautan)">
                        <v-icon v-if="tautan.type === 'Gambar'" size="x-large" icon="mdi mdi-file-image" />
                        <v-icon v-if="tautan.type === 'File' && tautan.ext === 'docx'" size="x-large" icon="mdi mdi-file-word-box" />
                        <v-icon v-if="tautan.type === 'File' && tautan.ext === 'xlsx'" size="x-large" icon="mdi mdi-file-excel-box" />
                        <v-icon v-if="tautan.type === 'File' && tautan.ext === 'pdf'" size="x-large" icon="mdi mdi-file-pdf-box" />
                        <v-icon v-if="tautan.type === 'File' && tautan.ext === 'txt'" size="x-large" icon="mdi mdi-file-document" />
                        {{ (tautan.title || '').length > 25 ? `${tautan.title.substring(0, 25)}...` : `${tautan.title}.${tautan.ext}` }}
                      </div>
                    </v-col>
                  </v-row>
                  <p class="tanggalNotif" v-html="notif.dikirim" />
                  <p class="tanggalNotif">{{notif.createdAt}}</p>
                </div>
                <template v-slot:empty>
                  <v-alert type="warning">Tidak ada data broadcast lagi ...</v-alert>
                </template>
              </v-infinite-scroll>
            </div>
          </div>
          <!-- <div v-if="dataNotifikasi.length" class="wadah-kategori">
            <Button 
              class="kotak-type"
              nama-button="Tampilkan lebih banyak lagi"
              :disabled-button="!pageSummary.hasNext"
              @proses="() => {
                getNotifikasi({kategori: kodeKategori, page: pageSummary.page + 1, limit: limit})
                page = pageSummary.page + 1
              }"
            />
          </div> -->
          <v-alert v-else-if="!dataNotifikasi.length && roleID !== '4'" type="warning">Tidak ada Broadcast</v-alert>
        </v-window-item>
        <v-window-item value="2">
          <v-data-table
            v-model="selectRecord"
            loading-text="Sedang memuat... Harap tunggu"
            no-data-text="Tidak ada data yang tersedia"
            no-results-text="Tidak ada catatan yang cocok ditemukan"
            :headers="headers"
            :loading="loadingtable"
            :items="dataNotifikasi"
            item-value="idNotifikasi"
            density="comfortable"
            hide-default-footer
            hide-default-header
            class="elavation-3 rounded"
            :items-per-page="itemsPerPage"
            @page-count="pageCount = $event"
            @update:modelValue="(event) => { selectRecord = event; }"
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
            <!-- <template #[`item.check`]="{ item }">
              <v-checkbox
                v-model="selectRecord"
                :value="item.raw.idNotifikasi"
                hide-details
              />
            </template> -->
            <template #[`item.pesan`]="{ item }">
              <span v-html="item.raw.pesan.message" />
            </template>
            <template #[`item.isRead`]="{ item }">
              <v-icon size="small" v-if="item.raw.isRead == true" color="green" icon="mdi mdi-check" />
              <v-icon size="small" v-else-if="item.raw.isRead == false" color="red" icon="mdi mdi-close" />
            </template>
            <template #[`item.opsi`]="{ item }">
              <Button 
                color-button="#bd3a07"
                icon-prepend-button="mdi mdi-delete"
                nama-button="Hapus"
                @proses="hapusNotifikasi(item.raw, 'Single')"
              />
            </template>
            <template #bottom>
              <v-divider :thickness="2" class="border-opacity-100" color="white" />
              <v-row no-gutters>
                <v-col cols="12" class="pa-2 d-flex justify-start align-center">
                  <Button
                    v-if="dataNotifikasi.length && selectRecord.length < dataNotifikasi.length"
                    color-button="#0bd369"
                    icon-prepend-button="mdi mdi-select-all"
                    :nama-button="`Choose All (${selectRecord.length})`"
                    @proses="allData(dataNotifikasi)"
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
                    :disabled-button="!dataNotifikasi.length"
                    @proses="hapusNotifikasi(selectRecord, 'Multiple')"
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
                      :disabled-a="dataNotifikasi.length ? false : true"
                    />
                    <Button
                      variant="plain"
                      size-button="large"
                      model-button="comfortable"
                      color-button="#ffffff"
                      icon-button="mdi mdi-arrow-left-circle-outline"
                      :disabled-button="dataNotifikasi.length ? pageSummary.page != 1 ? false : true : true"
                      @proses="() => { page = pageSummary.page - 1 }"
                    />
                    <Button
                      variant="plain"
                      size-button="large"
                      model-button="comfortable"
                      color-button="#ffffff"
                      icon-button="mdi mdi-arrow-right-circle-outline"
                      :disabled-button="dataNotifikasi.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
                      @proses="() => { page = pageSummary.page + 1 }"
                    />
                  </div>
                </v-col>
              </v-row>
            </template>
          </v-data-table>
        </v-window-item>
      </v-window>

      <!-- untuk siswa -->
      <div v-if="dataNotifikasi.length && roleID === '4'" class="wadah-notif">
        <v-row>
          <v-col cols="12" md="12" class="text-right">
            <Button 
              color-button="light-blue darken-3"
              nama-button="Tandai Telah Dibaca"
              size-button="x-small"
              @proses="tandai(dataNotifikasi)"
            />
          </v-col>
        </v-row>
        <div class="wadah-notif-scroll">
          <v-infinite-scroll @load="load" side="end">
            <div v-for="notif in dataNotifikasi" :key="notif.idNotifikasi" class="kotak-notif" @click="!downloadTautan ? openDialog(notif) : ''">
              <v-row no-gutters>
                <v-col
                  cols="12"
                  md="6"
                >
                  <span class="box fourcorners" style="background-color: rgba(19, 234, 216, 0.822); color: black;">{{notif.type}}</span>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  class="kondisiNotif"
                >
                  <p>{{notif.isRead ? 'sudah dibaca' : 'belum dibaca' }} <v-icon :color="notif.isRead == true ? 'green' : 'red'" :icon="notif.isRead == true ? 'mdi mdi-check' : 'mdi mdi-close'" /></p>
                </v-col>
              </v-row>
              <p class="judulNotif">{{notif.judul}}</p>
              <span class="pesanNotif" v-html="notif.pesan.message" /><br>
              <span v-if="notif.pesan.payload" class="pesanNotif">payload: </span>
              <span v-if="notif.pesan.payload" class="pesanNotif" v-html="notif.pesan.payload" />
              <v-row v-if="notif.tautan.length">
                <v-col
                  class="grid-col-tautan"
                  v-for="tautan in notif.tautan" :key="tautan.idBerkas"
                >
                  <div class="kotak-tautan" @click="downloadBerkas(tautan)">
                    <v-icon v-if="tautan.type === 'Gambar'" icon="mdi mdi-file-image" />
                    <v-icon v-if="tautan.type === 'File' && tautan.ext === 'docx'" icon="mdi mdi-file-word-box" />
                    <v-icon v-if="tautan.type === 'File' && tautan.ext === 'xlsx'" icon="mdi mdi-file-excel-box" />
                    <v-icon v-if="tautan.type === 'File' && tautan.ext === 'pdf'" icon="mdi mdi-file-pdf-box" />
                    <v-icon v-if="tautan.type === 'File' && tautan.ext === 'txt'" icon="mdi mdi-file-document" />
                    {{ (tautan.title || '').length > 25 ? `${tautan.title.substring(0, 25)}...` : `${tautan.title}.${tautan.ext}` }}
                  </div>
                </v-col>
              </v-row>
              <p class="tanggalNotif" v-html="notif.dikirim" />
              <p class="tanggalNotif">{{notif.createdAt}}</p>
            </div>
            <template v-slot:empty>
              <v-alert type="warning">Tidak ada data broadcast lagi ...</v-alert>
            </template>
          </v-infinite-scroll>
        </div>
      </div>
      <!-- <div v-if="dataNotifikasi.length && roleID === '4'" class="wadah-kategori">
        <Button 
          class="kotak-type"
          nama-button="Tampilkan lebih banyak lagi"
          :disabled-button="!pageSummary.hasNext"
          @proses="() => {
            getNotifikasi({kategori: kodeKategori, page: pageSummary.page + 1, limit: limit})
            page = pageSummary.page + 1
          }"
        />
      </div> -->
      <v-alert v-else-if="!dataNotifikasi.length && roleID === '4'" type="warning">Tidak ada Broadcast</v-alert>
      <!-- untuk siswa -->
    </v-card>
    <v-dialog
      v-model="DialogNotifikasi"
      scrollable
      persistent
      transition="dialog-bottom-transition"
      width="auto"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Detail Broadcast</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { DialogNotifikasi = false; }"
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
              Type
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ `: ${detailData.type}` }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Judul
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ `: ${detailData.judul}` }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Pesan
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <!-- {{ `: ${detailData.pesan}` }} -->
              : <span class="pesanNotif" v-html="detailData.pesan.message" /><br>
            </v-col>
          </v-row>
          <!-- <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Payload
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              : <span v-if="detailData.pesan.payload" class="pesanNotif" v-html="`${detailData.pesan.payload !== 'null' ? detailData.pesan.payload : '-'}`" />
            </v-col>
          </v-row> -->
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Params
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ `: ${detailData.params ? detailData.params : '-'}` }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Dikirim Oleh
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              : <span v-html="detailData.dikirim"></span>  
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Waktu
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ `: ${detailData.createdAt}` }}
            </v-col>
          </v-row>
          <v-row v-if="detailData.tautan.length">
            <v-col
              class="grid-col-tautan"
              v-for="tautan in detailData.tautan" :key="tautan.idBerkas"
            >
              <div class="kotak-tautan" @click="downloadBerkas(tautan)">
                <v-icon v-if="tautan.type === 'Gambar'" size="x-large" icon="mdi mdi-file-image" />
                <v-icon v-if="tautan.type === 'File' && tautan.ext === 'docx'" size="x-large" icon="mdi mdi-file-word-box" />
                <v-icon v-if="tautan.type === 'File' && tautan.ext === 'xlsx'" size="x-large" icon="mdi mdi-file-excel-box" />
                <v-icon v-if="tautan.type === 'File' && tautan.ext === 'pdf'" size="x-large" icon="mdi mdi-file-pdf-box" />
                <v-icon v-if="tautan.type === 'File' && tautan.ext === 'txt'" size="x-large" icon="mdi mdi-file-document" />
                {{ (tautan.title || '').length > 25 ? `${tautan.title.substring(0, 25)}...` : `${tautan.title}.${tautan.ext}` }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions />
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="DialogBroadcast"
      scrollable
      persistent
      transition="dialog-bottom-transition"
      width="auto"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Share Broadcast</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { clearData(); DialogBroadcast = false; }"
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
              Kategori
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
            <Autocomplete
              v-model="kategoriBroadcast"
              :data-a="pilihanKategori"
              item-title="text"
              item-value="value"
              label-a="Kategori"
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
              ID User{{ kategoriBroadcast && ` - kategori ${kategoriBroadcast.toLowerCase()}` }}
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <Autocomplete
                v-model="inputData.idUser"
                :pilihan-a="kategoriBroadcast === 'USER' ? 'autocompleteslot' : 'autocomplete'"
                :data-a="pilihanUser"
                item-title="text"
                item-value="value"
                :label-a="`${kategoriBroadcast ? `ID User - kategori ${kategoriBroadcast.toLowerCase()}` : 'ID User'}`"
                multiple
                chips
                closable-chips
                :clearable-a="true"
                :disabled-a="idUserField"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Judul
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <TextArea
                v-model="inputData.judul"
                label-ta="Judul"
                rows="4"
                :clearable-ta="true"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Pesan
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <TextArea
                v-model="inputData.pesan"
                label-ta="Pesan"
                rows="4"
                :clearable-ta="true"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Tautan Berkas
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <Autocomplete
                v-model="inputData.tautan"
                pilihan-a="autocompleteslot"
                slot-a="second"
                :data-a="berkasOptions"
                item-title="title"
                item-value="idBerkas"
                label-a="Tautan Berkas"
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
          <v-row no-gutters>
            <v-col
              class="text-end"
              cols="12"
            >
              <Button
                color-button="black"
                nama-button="Share Broadcast"
                :disabled-button="kondisiTombol"
                @proses="postRecord(kategoriBroadcast)"
              />
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay v-model="isProcessing" persistent class="align-center justify-center">
      <div style="width: 550px;">
        <v-progress-linear
          v-model="progress"
          color="light-blue darken-3"
          height="25"
          striped
          :active="show"
          :indeterminate="query"
          :query="true"
        >
          <template v-slot:default="{ value }">
            <strong>{{ Math.ceil(value) }}%</strong>
          </template>
        </v-progress-linear>
        <h4 style="color: #FFF; text-align: center; background-color: #272727;">Sedang proses broadcast</h4>
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
import { mapActions, mapState, mapGetters } from "vuex";
import { useMeta } from 'vue-meta'
import PopUpNotifikasi from "./Layout/PopUpNotifikasi.vue";
import notifikasi from "../core/services/composeables/notifikasi";

export default {
  name: 'Broadcast',
  components: {
    PopUpNotifikasi
  },
  data: () => ({
    roleID: '',
    page: 1,
    limit: 20,
    DialogNotifikasi: false,
    DialogBroadcast: false,
    isProcessing: false,
    idUserField: true,
    kondisiTombol: true,
    dataNotifikasi: [],
    kodeKategori: '',
    pageSummary: {
      limit: '',
      page: '',
      hasNext: false,
      lastID: '',
      total: '',
      totalPage: '',
    },
    detailData: {
      idNotifikasi: '',
      idUser: '',
      type: '',
      judul: '',
      pesan: '',
      params: null,
      tautan: '',
      dikirim: '',
      isRead: false,
      createdAt: ''
    },
    pilihanKategori: [
      { text: 'user', value: 'USER' },
      { text: 'kelas', value: 'KELAS' },
    ],
    pilihanUser: [],
    kategoriBroadcast: null,
    inputData: {
      idUser: null,
      judul: '',
      pesan: '',
    },
    progress: 0,
    query: false,
    show: true,
    interval: 0,
    dataBroadcast: 0,
    downloadTautan: false,
    itemsTab: [
			{code: '1', text: 'Menerima', icon: 'mdi mdi-broadcast'},
			{code: '2', text: 'Mengirim', icon: 'mdi mdi-broadcast'},
		],
		tab: '',
    pageCount: 0,
    itemsPerPage: 100,
		limitPage: [5,10,20,50,100],
    headers: [
      { title: "#", key: "data-table-select", sortable: false, width: "3%" },
      { title: "No", key: "number", sortable: false, width: "3%" },
      { title: "TUJUAN", key: "tujuan", sortable: false, width: "10%" },
      { title: "JUDUL", key: "judul", sortable: false, width: "15%" },
      { title: "PESAN", key: "pesan", sortable: false, width: "25%" },
      { title: "ISREAD", key: "isRead", sortable: false, width: "5%" },
      { title: "OPSI", key: "opsi", sortable: false, width: "5%" },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
    selectRecord: [],

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Broadcast",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
    const { refetch: dataCountNotifikasi } = notifikasi.countingNotif({
      enabled: false,
    })
    return { dataCountNotifikasi }
  },
  computed: {
    ...mapState({
      berkas: store => store.setting.berkasOptions,
			loadingtable: store => store.setting.loadingtable,
    }),
    ...mapGetters({
      notifikasiAll: 'setting/notifikasiAll',
      userBroadcastAll: 'setting/userBroadcastAll',
    }),
		berkasOptions(){
			return this.berkas
		},
  },
  watch: {
    inputData: {
			deep: true,
			handler(value) {
				if(value.idUser != null && value.judul != '' && value.pesan != ''){
					this.kondisiTombol = false
				}else{
					this.kondisiTombol = true
				}
			}
		},
    kategoriBroadcast: {
      deep: true,
      handler(value){
        this.inputData.idUser = null
        this.idUserField = true
        this.pilihanUser = []
        const jabatan = localStorage.getItem('jabatan_guru') ? localStorage.getItem('jabatan_guru').split(', ') : []
        this.getUserBroadcast({kategori: value, kode: jabatan.includes('1') || jabatan.includes('2') || jabatan.includes('3') || jabatan.includes('4') ? 1 : 0})
        // this.getUserBroadcast({kategori: value, kode: jabatan.includes('1') ? 1 : 0})
      }
    },
    userBroadcastAll: {
      deep: true,
      handler(value){
        this.idUserField = false
        value.map(val => {
          if(val.nama !== localStorage.getItem('nama')){
            this.pilihanUser.push(val)
          }
        })
      }
    },
    notifikasiAll: {
      deep: true,
      handler(value){
        let data = value.records
        this.dataNotifikasi = []
        if(this.kodeKategori === 'penerima'){
          data.map(val => {
            this.dataNotifikasi.push(val)
          })
          this.pageSummary = {
            limit: value.pageSummary.limit,
            page: value.pageSummary.page,
            hasNext: value.pageSummary.hasNext,
            lastID: value.pageSummary.lastID,
            totalPage: value.pageSummary.totalPage
          }
        }else{
          this.dataNotifikasi = data
          this.pageSummary = {
            page: value.pageSummary.page,
            limit: value.pageSummary.limit,
            total: value.pageSummary.total,
            totalPage: value.pageSummary.totalPage
          }
        }
      }
    },
    tab: {
      deep: true,
      handler(value){
        if(value === '1'){
          this.kodeKategori = 'penerima'
        }else{
          this.kodeKategori = 'pengirim'
        }
        this.dataNotifikasi = []
			  this.getNotifikasi({kategori: '4', untuk: this.kodeKategori, page: this.page, limit: this.limit})
      }
    },
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.roleID = localStorage.getItem('roleID')
  },
  beforeDestroy () {
    clearInterval(this.interval)
  },
	methods: {
		...mapActions({
      getNotifikasi: 'setting/getNotifikasi',
      getUserBroadcast: 'setting/getUserBroadcast',
			getBerkas: "setting/getBerkas",
    }),
    load ({ side, done }) {
      setTimeout(() => {
        if (side === 'end') {
          if(this.pageSummary.hasNext){
            this.page = this.pageSummary.page + 1
            this.getNotifikasi({kategori: '4', untuk: this.kodeKategori, page: this.page, limit: this.limit})
            done('ok')
          }else{
            done('empty')
          }
        }
      }, 1000)
    },
    openDialog(item){
      this.detailData = {
        idNotifikasi: item.idNotifikasi,
        idUser: item.idUser,
        type: item.type,
        judul: item.judul,
        pesan: item.pesan,
        params: item.params,
        dikirim: item.dikirim,
        tautan: item.tautan,
        isRead: item.isRead,
        createdAt: item.createdAt
      }
      if(this.detailData.isRead) this.DialogNotifikasi = true
      let bodyData = {
        jenis: 'ISREAD',
        idNotifikasi: item.idNotifikasi,
      }
      this.$store.dispatch('setting/postNotifikasi', bodyData)
      .then((res) => {
        this.DialogNotifikasi = true
        this.dataNotifikasi = []
        this.dataCountNotifikasi()
        this.getNotifikasi({kategori: '4', untuk: this.kodeKategori, page: this.page, limit: this.limit})
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    async tandai(data){
      let dataFilter = data.filter(x => !x.isRead)
      if(!dataFilter.length) return this.notifikasi("warning", 'Semua sudah ditandai', "1")
      let kirim = await Promise.all(dataFilter.map(async val => {
        let status = []
        let bodyData = {
          jenis: 'ISREAD',
          idNotifikasi: val.idNotifikasi,
        }
        try {
					let response = await this.$store.dispatch('setting/postNotifikasi', bodyData)
          status.push(response.data.status)
				} catch (err) {
          status.push(err.response.data.status)
				}
        return status[0]
      }))
      if(kirim.filter(el => el == 200).length){
        this.dataNotifikasi = []
        this.dataCountNotifikasi()
        this.tab = '1'
        this.getNotifikasi({kategori: '4', untuk: this.kodeKategori, page: this.page, limit: this.limit})
      }else{
        this.notifikasi("error", 'Gagal proses data', "1")
      }
    },
    clearData(){
      this.pilihanUser = []
      this.kategoriBroadcast = ''
      this.inputData = {
        idUser: '',
        judul: '',
        pesan: '',
      }
    },
    postRecord(kategoriBroadcast){
      const hasil = []
      if(kategoriBroadcast === 'KELAS') {
        this.inputData.idUser.map(val => {
          this.pilihanUser.map(k => {
            if(val === k.text){
              k.listUser.map(v => {
                hasil.push(v)
              })
            }
          })
        })
        this.dataBroadcast = hasil.length
      }
      
      if(kategoriBroadcast === 'USER'){
        this.dataBroadcast = this.inputData.idUser.length
      }
      let bodyData = {
        jenis: 'BROADCAST',
        idUser: kategoriBroadcast === 'USER' ? this.inputData.idUser : hasil,
        type: 'Broadcast',
        judul: this.inputData.judul,
        pesan: {
          message: this.inputData.pesan,
          payload: null,
        },
        tautan: this.inputData.tautan ? this.inputData.tautan : null,
        dikirim: `dikirim oleh <strong>${localStorage.getItem('nama')} - sebagai ${localStorage.getItem('nama_role')} </strong>`,
        createBy: localStorage.getItem('idLogin'),
        params: null,
      }
      this.queryAndIndeterminate(1, bodyData)
    },
    downloadBerkas(item) {
      this.downloadTautan = true
			fetch(item.file, {
				method: 'GET',
				dataType: "xml",
			})
			.then(response => response.arrayBuffer())
			.then(async response => {
				// console.log(response)
				let blob = new Blob([response], {
          type: item.ext === 'docx'
							? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : item.ext === 'xlsx'
							? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : item.ext === 'pdf'
							? 'application/pdf' : 'plain/text',
        })
				this.downloadBlob(blob,`${item.title}.${item.ext}`)
        this.downloadTautan = false
			})
		},
    queryAndIndeterminate(dataindex, bodyData) {
      this.isProcessing = true
      this.query = true
      this.show = true
      this.progress = 0
      let nilai = 0

      setTimeout(() => {
        this.query = false
        this.interval = setInterval(() => {
          if (this.progress === 100 || nilai === this.dataBroadcast-1) {
            // console.log(bodyData);
            this.$store.dispatch('setting/postNotifikasi', bodyData)
            .then((res) => {
              clearInterval(this.interval)
              this.query = false
              this.show = false
              this.progress = 0
              this.isProcessing = false
              this.clearData()
              this.DialogBroadcast = false
              this.tab = '2'
              this.getNotifikasi({kategori: '4', untuk: this.kodeKategori, page: 1, limit: this.limit})
              this.notifikasi("success", "Share Broadcast telah berhasil", "1")
            })
            .catch((err) => {
              this.notifikasi("error", err.response.data.message, "1")
            });
            // return setTimeout(this.queryAndIndeterminate, 2000)
          }
          nilai += dataindex
          const data = (nilai / this.dataBroadcast) * 100
          this.progress = Math.ceil(data)
        }, 1000)
      }, 2500)
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
    hapusNotifikasi(item, kategori){
      if(!this.selectRecord.length && kategori === 'Multiple') return this.notifikasi("warning", "Belum ada record yang di pilih!", "1")
      let bodyData = {
        jenis: 'DELETEBROADCAST',
        idNotifikasi: kategori === 'Single' ? item.idNotifikasi : this.selectRecord
      }
      this.$store.dispatch('setting/postNotifikasi', bodyData)
      .then((res) => {
        this.tab = '2'
        this.selectRecord = []
        this.getNotifikasi({kategori: '4', untuk: this.kodeKategori, page: 1, limit: this.limit})
        this.notifikasi("success", res.data.message, "1")
      })
      .catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
      });
    },
    allData(item) {
      if(item.length === this.selectRecord.length) return this.notifikasi("warning", "Data sudah di pilih semua pada page ini!", "1")
      item.map(val => {
        if(!this.selectRecord.includes(val.idNotifikasi)){
          this.selectRecord.push(val.idNotifikasi)
        }
      })
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
.v-tab {
	font-size: 8pt !important;
	font-weight: bold !important;
}
.kondisiNotif {
	margin-bottom: 1px !important;
	font-size: 10px;
	text-align: right;
	font-style: italic;
}
.judulNotif {
	margin-bottom: 1px !important;
	font-size: 14px;
	font-weight: bold;
}
.pesanNotif {
	margin-bottom: 1px !important;
	font-size: 12px;
	font-weight: 500;
	text-align: justify;
}
.tanggalNotif {
	margin-bottom: 1px !important;
	font-size: 10px;
	font-weight: 500;
	text-align: right;
	font-style: italic;
}
.wadah-kategori {
  height: 100%;
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
}
.v-btn:not(.v-btn--round).v-size--default {
  height: 28px;
  min-width: 64px;
  padding: 0 12px;
}
.wadah-notif {
  width: 100%;
  padding: 0px 100px;
  margin-top: 5px;
}
.kotak-notif {
  height: 100%;
  width: 100%;
  border: 2px solid #000;
  border-radius: 10px;
  background-color: #FFF;
  padding: 10px;
  margin: 5px 0px;
  cursor: pointer;
}
.kotak-type {
  margin: 0px 5px;
  border: 2px solid #000;
  border-radius: 50px !important;
  color: white;
  background-color: rgb(2, 179, 249);
  font-size: 8pt;
  align-items: center;
  display: flex;
  justify-content: center;
  line-height: normal;
  position: relative;
  text-align: center;
}
.fourcorners{
	-moz-border-radius: 5px;
	-webkit-border-radius: 5px;
	-khtml-border-radius: 5px; 
	border-radius: 5px;
	padding: 5px;
	text-align: center;
	font-size: 10px;
}
.textPilihan {
	font-size: 0.8125rem;
  font-weight: 500;
  align-items: center;
  display: flex;
  line-height: normal;
  margin-bottom: 5px;
}
.iconPilihan {
  align-items: center;
  display: flex;
  justify-content: center;
  line-height: normal;
  position: relative;
  text-align: center;
  height: 40px;
}
.kotak-tautan {  
  color: black;
  background-color: white;
  font-size: 8pt;
  font-weight: 500;
  cursor: pointer;
  height: 55px;
  width: max-content;
	border-radius: 5px !important;
	border: 2px solid #000;
	padding: 5px !important;
  margin: 5px 0px;
	display: grid;
	grid-template-columns: repeat(auto-fit,minmax(125px,1fr));
	justify-items: center;
	grid-gap: 2px;
}
.kotak-tautan:hover{
  background-color: rgb(100, 94, 94);
  color: #FFF;
  transition: 0.8s;
}
</style>
<style>
.theme--light.v-subheader {
  color: rgba(0, 0, 0, 0.6) !important;
  font-weight: bold !important;
}
.grid-col-tautan {
  flex-grow: 0 !important;
  padding: 10px 0px 5px 5px !important;
  margin-left: 10px !important;
}
</style>