<template>
  <div>
    <!-- <v-card class="pa-1 rounded" style="border: 1px solid #000; border-radius: 5px;"> -->
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-row class="ma-1 tampilView">
        <v-col cols="8" class="kotakleft">
          <v-tabs
            v-model="tab"
            fixed-tabs
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
              <div v-if="roleID === '1' || roleID === '2'" class="customScrollLeft">
                <div class="text-right">
                  <Button 
                    color-button="#0bd369"
                    :icon-button="kondisiForm ? 'mdi mdi-eye' : 'mdi mdi-eye-off'"
                    nama-button="Ubah Data Diri"
                    @proses="() => { kondisiForm = !kondisiForm; }"
                  />
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
                    <span v-if="kondisiForm" v-html="previewData.nama"></span>
                    <TextField
                      v-else
                      v-model="inputAdministrator.nama"
                      label-tf="Nama Lengkap"
                      :clearable-tf="true"
                    />
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
                    <span v-if="kondisiForm" v-html="previewData.username"></span>
                    <TextField
                      v-else
                      v-model="inputAdministrator.username"
                      label-tf="Username"
                      :clearable-tf=true
                    />
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
                    <span v-if="kondisiForm" v-html="previewData.email"></span>
                    <TextField
                      v-else
                      v-model="inputAdministrator.email"
                      label-tf="Email"
                      :rules="this.inputAdministrator.email != '' ? [rules.emailRules] : []"
                      hide-details="auto"
                      :clearable-tf="true"
                    />
                  </v-col>
                </v-row>
                <v-row no-gutters>
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
                    {{ previewData.password }}&nbsp;
                    <v-icon
                      class="mr-1"
                      color="light-black darken-3"
                      tabindex="-1"
                      @click="endecryptData('endecryptType')"
                      :icon="endecryptType ? 'mdi mdi-eye-lock' : 'mdi mdi-eye-lock-open'"
                      size="large"
                    />
                  </v-col>
                </v-row>
                <h2 class="subheading black--text"><u>>>Data Alamat</u></h2>
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
                    <span v-if="kondisiForm">{{ `${previewData.tempat}, ${convertDateForMonth(previewData.tanggalLahir)}` }}</span>
                    <v-row v-else no-gutters>
                      <v-col
                        cols="12"
                        md="6"
                        class="d-flex justify-center align-center"
                      >
                        <TextField
                          v-model="inputAdministrator.tempat"
                          label-tf="Tempat Lahir"
                          :clearable-tf="true"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        md="6"
                        class="pl-2 d-flex justify-end align-center"
                      >
                        <vue-date-picker
                          v-model="inputAdministrator.tanggalLahir"
                          placeholder="Tanggal Lahir"
                          format="dd-MM-yyyy"
                          :enable-time-picker="false"
                          :teleport="true"
                          auto-apply
                        />
                      </v-col>
                    </v-row>
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
                    <span v-if="kondisiForm" v-html="previewData.jenisKelamin"></span>
                    <Autocomplete
                      v-else
                      v-model="inputAdministrator.jenisKelamin"
                      :data-a="jenisKelaminOptions"
                      label-a="Jenis Kelamin"
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
                    Agama
                  </v-col>
                  <v-col
                    cols="12"
                    md="8"
                    class="pt-3"
                  >
                    <span v-if="kondisiForm" v-html="previewData.agama"></span>
                    <Autocomplete
                      v-else
                      v-model="inputAdministrator.agama"
                      :data-a="agamaOptions"
                      item-title="label"
                      item-value="kode"
                      label-a="Agama"
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
                    Telepon
                  </v-col>
                  <v-col
                    cols="12"
                    md="8"
                    class="pt-3"
                  >
                    <span v-if="kondisiForm" v-html="previewData.telp"></span>
                    <TextField
                      v-else
                      v-model="inputAdministrator.telp"
                      label-tf="Telepon"
                      :clearable-tf="true"
                      @keypress="onlyNumber($event, 15, inputAdministrator.telp)"
                    />
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
                    <span v-if="kondisiForm" v-html="previewData.alamat"></span>
                    <v-textarea
                      v-else
                      v-model="inputAdministrator.alamat"
                      placeholder="Alamat"
                      label="Alamat"
                      rows="4"
                      variant="solo"
                      density="comfortable"
                      color="light-black darken-3"
                      bg-color="white"
                      hide-details
                      clearable
                      no-resize
                    />
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
                    <span v-if="kondisiForm" v-html="previewData.provinsi"></span>
                    <Autocomplete
                      v-else
                      v-model="inputAdministrator.provinsi"
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
                    <span v-if="kondisiForm" v-html="previewData.kabKota"></span>
                    <Autocomplete
                      v-else
                      v-model="inputAdministrator.kabKota"
                      :data-a="KabKotaOptions"
                      item-title="nama"
                      item-value="kode"
                      label-a="Kabupaten / Kota"
                      :clearable-a="true"
                      :disabled-a="inputAdministrator.provinsi ? false : true"
                      @ubah="wilayah('kabkota', $event)"
                    />
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
                    <span v-if="kondisiForm" v-html="previewData.kecamatan"></span>
                    <Autocomplete
                      v-else
                      v-model="inputAdministrator.kecamatan"
                      :data-a="KecamatanOptions"
                      item-title="nama"
                      item-value="kode"
                      label-a="Kecamatan"
                      :clearable-a="true"
                      :disabled-a="inputAdministrator.kabKota ? false : true"
                      @ubah="wilayah('kecamatan', $event)"
                    />
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
                    <span v-if="kondisiForm" v-html="previewData.kelurahan"></span>
                    <Autocomplete
                      v-else
                      v-model="inputAdministrator.kelurahan"
                      :data-a="KelurahanOptions"
                      item-title="nama"
                      item-value="kode"
                      label-a="Kelurahan"
                      :clearable-a="true"
                      :disabled-a="inputAdministrator.kecamatan ? false : true"
                      @ubah="wilayah('kelurahan', $event)"
                    />
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
                    <span v-if="kondisiForm" v-html="previewData.kodePos"></span>
                    <TextField
                      v-else
                      v-model="inputAdministrator.kodePos"
                      label-tf="Kode Pos"
                      :disabled-tf="true"
                    />
                  </v-col>
                </v-row>
                <div class="text-right">
                  <Button
                    v-if="!kondisiForm"
                    color-button="#0bd369"
                    nama-button="Simpan Data"
                    @proses="SimpanDataProfile()"
                  />
                </div>
              </div>
              <div v-if="roleID === '3'" class="customScrollLeft">
                <div class="text-right">
                  <Button 
                    color-button="#0bd369"
                    :icon-button="kondisiForm ? 'mdi mdi-eye' : 'mdi mdi-eye-off'"
                    nama-button="Ubah Data Diri"
                    @proses="() => { kondisiForm = !kondisiForm; }"
                  />
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
                    <span v-if="kondisiForm" v-html="previewData.nama"></span>
                    <TextField
                      v-else
                      v-model="inputGuru.nama"
                      label-tf="Nama Lengkap"
                      :clearable-tf="true"
                    />
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
                    <span v-if="kondisiForm" v-html="previewData.username"></span>
                    <TextField
                      v-else
                      v-model="inputGuru.username"
                      label-tf="Username"
                      :clearable-tf="true"
                    />
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
                    <span v-if="kondisiForm" v-html="previewData.email"></span>
                    <TextField
                      v-else
                      v-model="inputGuru.email"
                      label-tf="Email"
                      :rules="this.inputGuru.email != '' ? [rules.emailRules] : []"
                      hide-details="auto"
                      :clearable-tf="true"
                    />
                  </v-col>
                </v-row>
                <h2 class="subheading black--text"><u>>>Data Alamat</u></h2>
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
                    <span v-if="kondisiForm">{{ `${previewData.tempat}, ${convertDateForMonth(previewData.tanggalLahir)}` }}</span>
                    <v-row v-else no-gutters>
                      <v-col
                        cols="12"
                        md="6"
                        class="d-flex justify-center align-center"
                      >
                        <TextField
                          v-model="inputGuru.tempat"
                          label-tf="Tempat Lahir"
                          :clearable-tf="true"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        md="6"
                        class="pl-2 d-flex justify-end align-center"
                      >
                        <vue-date-picker
                          v-model="inputGuru.tanggalLahir"
                          placeholder="Tanggal Lahir"
                          format="dd-MM-yyyy"
                          :enable-time-picker="false"
                          :teleport="true"
                          auto-apply
                        />
                      </v-col>
                    </v-row>
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
                    <span v-if="kondisiForm" v-html="previewData.jenisKelamin"></span>
                    <Autocomplete
                      v-else
                      v-model="inputGuru.jenisKelamin"
                      :data-a="jenisKelaminOptions"
                      label-a="Jenis Kelamin"
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
                    Agama
                  </v-col>
                  <v-col
                    cols="12"
                    md="8"
                    class="pt-3"
                  >
                    <span v-if="kondisiForm" v-html="previewData.agama"></span>
                    <Autocomplete
                      v-else
                      v-model="inputGuru.agama"
                      :data-a="agamaOptions"
                      item-title="label"
                      item-value="kode"
                      label-a="Agama"
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
                    Telepon
                  </v-col>
                  <v-col
                    cols="12"
                    md="8"
                    class="pt-3"
                  >
                    <span v-if="kondisiForm" v-html="previewData.telp"></span>
                    <TextField
                      v-else
                      v-model="inputGuru.telp"
                      label-tf="Telepon"
                      :clearable-tf="true"
                      @keypress="onlyNumber($event, 15, inputGuru.telp)"
                    />
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
                    <span v-if="kondisiForm" v-html="previewData.alamat"></span>
                    <v-textarea
                      v-else
                      v-model="inputGuru.alamat"
                      placeholder="Alamat"
                      label="Alamat"
                      rows="4"
                      variant="solo"
                      density="comfortable"
                      color="light-black darken-3"
                      bg-color="white"
                      hide-details
                      clearable
                      no-resize
                    />
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
                    <span v-if="kondisiForm" v-html="previewData.provinsi"></span>
                    <Autocomplete
                      v-else
                      v-model="inputGuru.provinsi"
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
                    <span v-if="kondisiForm" v-html="previewData.kabKota"></span>
                    <Autocomplete
                      v-else
                      v-model="inputGuru.kabKota"
                      :data-a="KabKotaOptions"
                      item-title="nama"
                      item-value="kode"
                      label-a="Kabupaten / Kota"
                      :clearable-a="true"
                      :disabled-a="inputGuru.provinsi ? false : true"
                      @ubah="wilayah('kabkota', $event)"
                    />
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
                    <span v-if="kondisiForm" v-html="previewData.kecamatan"></span>
                    <Autocomplete
                      v-else
                      v-model="inputGuru.kecamatan"
                      :data-a="KecamatanOptions"
                      item-title="nama"
                      item-value="kode"
                      label-a="Kecamatan"
                      :clearable-a="true"
                      :disabled-a="inputGuru.kabKota ? false : true"
                      @ubah="wilayah('kecamatan', $event)"
                    />
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
                    <span v-if="kondisiForm" v-html="previewData.kelurahan"></span>
                    <Autocomplete
                      v-else
                      v-model="inputGuru.kelurahan"
                      :data-a="KelurahanOptions"
                      item-title="nama"
                      item-value="kode"
                      label-a="Kelurahan"
                      :clearable-a="true"
                      :disabled-a="inputGuru.kecamatan ? false : true"
                      @ubah="wilayah('kelurahan', $event)"
                    />
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
                    <span v-if="kondisiForm" v-html="previewData.kodePos"></span>
                    <TextField
                      v-else
                      v-model="inputGuru.kodePos"
                      label-tf="Kode Pos"
                      :disabled-tf="true"
                    />
                  </v-col>
                </v-row>
                <h2 class="subheading black--text"><u>>>Data Kelengkapan</u></h2>
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
                    <span v-if="kondisiForm" v-html="previewData.nomorInduk"></span>
                    <TextField
                      v-else
                      v-model="inputGuru.nomorInduk"
                      label-tf="Nomor Induk"
                      :clearable-tf="true"
                      @keypress="onlyNumber($event, 25, inputGuru.nomorInduk)"
                    />
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
                    <span v-if="kondisiForm" v-html="previewData.pendidikanGuru"></span>
                    <Autocomplete
                      v-else
                      v-model="inputGuru.pendidikanGuru"
                      :data-a="pendidikanOptions"
                      item-title="label"
                      item-value="kode"
                      label-a="Pendidikan Struktural"
                      :clearable-a="true"
                    />
                  </v-col>
                </v-row>
                <div class="text-right">
                  <Button
                    v-if="!kondisiForm"
                    color-button="#0bd369"
                    nama-button="Simpan Data"
                    @proses="SimpanDataProfile()"
                  />
                </div>
              </div>
              <div v-if="roleID === '4'" class="customScrollLeft">
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
              </div>
            </v-window-item>
            <v-window-item value="2">
              <div class="customScrollLeft">
                <v-row no-gutters>
                  <v-col
                    cols="12"
                    md="4"
                    class="pt-2 d-flex align-center"
                  >
                    Kata Sandi Lama
                  </v-col>
                  <v-col
                    cols="12"
                    md="8"
                    class="pt-3"
                  >
                    <TextField
                      v-model="authData.passwordLama"
                      :slot-tf="true"
                      label-tf="Kata Sandi Lama"
                      :type-tf="passTypeLama ? 'text' : 'password'"
                      :icon-append-tf="passTypeLama ? 'mdi mdi-eye-lock' : 'mdi mdi-eye-lock-open'"
                      :clearable-tf="true"
                      @prosesicon="onClickVisible('passTypeLama')"
                    />
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col
                    cols="12"
                    md="4"
                    class="pt-2 d-flex align-center"
                  >
                    Kata Sandi Baru
                  </v-col>
                  <v-col
                    cols="12"
                    md="8"
                    class="pt-3"
                  >
                    <TextField
                      v-model="authData.passwordBaru"
                      :slot-tf="true"
                      label-tf="Kata Sandi Baru"
                      :type-tf="passTypeBaru ? 'text' : 'password'"
                      :icon-append-tf="passTypeBaru ? 'mdi mdi-eye-lock' : 'mdi mdi-eye-lock-open'"
                      :clearable-tf="true"
                      @prosesicon="onClickVisible('passTypeBaru')"
                    />
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col
                    cols="12"
                    md="4"
                    class="pt-2 d-flex align-center"
                  >
                    Kata Sandi Konfirmasi Baru
                  </v-col>
                  <v-col
                    cols="12"
                    md="8"
                    class="pt-3"
                  >
                    <TextField
                      v-model="authData.passwordConfBaru"
                      :slot-tf="true"
                      label-tf="Kata Sandi Konfirmasi Baru"
                      :type-tf="passTypeConfBaru ? 'text' : 'password'"
                      :icon-append-tf="passTypeConfBaru ? 'mdi mdi-eye-lock' : 'mdi mdi-eye-lock-open'"
                      :clearable-tf="true"
                      @prosesicon="onClickVisible('passTypeConfBaru')"
                    />
                  </v-col>
                </v-row>
                <div class="text-right mt-2">
                  <Button
                    color-button="#0bd369"
                    nama-button="Ubah Kata Sandi"
                    :disabled-button="kondisiTombol"
                    @proses="UbahKataSandi()"
                  />
                </div>
              </div>
            </v-window-item>
          </v-window>
        </v-col>
        <v-col cols="4" class="kotakright">
          <div class="mt-4 d-flex flex-column justify-space-between align-center">
            <div class="avatar" @click="pilihFile()">
              <span class="tulisan">
                <v-icon color="white" icon="mdi mdi-camera-account" />&nbsp;Ubah Foto Profil
              </span>
              <v-img :src="previewData.fotoProfil" />
            </div>
            <input 
              ref="fotoProfile"
              :key="componentKey"
              type="file"
              accept="image/*"
              style="display: none"
              @change="uploadFotoProfile($event)"
            >
          </div>
          <p class="white--text subheading mt-1 text-center"><strong>{{nama}}</strong></p>
          <p class="white--text text-center">{{namaRole}}</p>
          <v-divider :thickness="2" class="border-opacity-100" />
          <div v-if="roleID === '4'" class="customScrollRight">
            <h4 class="white--text text-center ma-4">******&nbsp;Berkas - Berkas&nbsp;******</h4>
            <v-row no-gutters class="mb-2">
              <v-col cols="12" md="6" class="d-flex align-center text-left">
                <span class="white--text">*FC Ijazah</span>
              </v-col>
              <v-col cols="12" md="6" class="text-right">
                <Button
                  :loading="isLoadingbtnPDF1"
                  color-button="#0bd369"
                  nama-button="Lihat Berkas"
                  icon-button="mdi mdi-file-pdf-box"
                  @proses="pdfCreate(previewData.fcIjazah, 'ijazah')"
                />
              </v-col>
            </v-row>
            <v-row no-gutters class="mb-2">
              <v-col cols="12" md="6" class="d-flex align-center text-left">
                <span class="white--text">*FC SKHUN</span>
              </v-col>
              <v-col cols="12" md="6" class="text-right">
                <Button
                  :loading="isLoadingbtnPDF2"
                  color-button="#0bd369"
                  nama-button="Lihat Berkas"
                  icon-button="mdi mdi-file-pdf-box"
                  @proses="pdfCreate(previewData.fcSKHUN, 'skhun')"
                />
              </v-col>
            </v-row>
            <v-row no-gutters class="mb-2">
              <v-col cols="12" md="6" class="d-flex align-center text-left">
                <span class="white--text">*FC SKHUN</span>
              </v-col>
              <v-col cols="12" md="6" class="text-right">
                <Button
                  :loading="isLoadingbtnPDF3"
                  color-button="#0bd369"
                  nama-button="Lihat Berkas"
                  icon-button="mdi mdi-file-pdf-box"
                  @proses="pdfCreate(previewData.fcKK, 'kk')"
                />
              </v-col>
            </v-row>
            <v-row no-gutters class="mb-2">
              <v-col cols="12" md="6" class="d-flex align-center text-left">
                <span class="white--text">*FC KTP Orangtua</span>
              </v-col>
              <v-col cols="12" md="6" class="text-right">
                <Button
                  :loading="isLoadingbtnPDF4"
                  color-button="#0bd369"
                  nama-button="Lihat Berkas"
                  icon-button="mdi mdi-file-pdf-box"
                  @proses="pdfCreate(previewData.fcKTPOrtu, 'ktp')"
                />
              </v-col>
            </v-row>
            <v-row no-gutters class="mb-2">
              <v-col cols="12" md="6" class="d-flex align-center text-left">
                <span class="white--text">*FC Akta Lahir</span>
              </v-col>
              <v-col cols="12" md="6" class="text-right">
                <Button
                  :loading="isLoadingbtnPDF5"
                  color-button="#0bd369"
                  nama-button="Lihat Berkas"
                  icon-button="mdi mdi-file-pdf-box"
                  @proses="pdfCreate(previewData.fcAktaLahir, 'aktalahir')"
                />
              </v-col>
            </v-row>
            <v-row no-gutters class="mb-2">
              <v-col cols="12" md="6" class="d-flex align-center text-left">
                <span class="white--text">*FC SKL</span>
              </v-col>
              <v-col cols="12" md="6" class="text-right">
                <Button
                  :loading="isLoadingbtnPDF6"
                  color-button="#0bd369"
                  nama-button="Lihat Berkas"
                  icon-button="mdi mdi-file-pdf-box"
                  @proses="pdfCreate(previewData.fcSKL, 'skl')"
                />
              </v-col>
            </v-row>
            <!-- <h4 class="white--text text-center ma-4">******&nbsp;Raport Nilai&nbsp;******</h4> -->
          </div>
          <div v-if="roleID === '3'" class="customScrollRight">
            <h4 class="white--text text-center ma-4">******&nbsp;Data Kelengkapan&nbsp;******</h4>
            <v-row no-gutters class="mb-2">
              <v-col cols="12" md="12">
                <div class="white--text text-left" style="font-weight: bold;">*Jabatan Struktural</div>
                <div class="white--text text-left" style="font-size: 13px;">
                  <v-list
                    :lines="false"
                    density="compact"
                    nav
                    class="listData"
                  >
                    <v-list-item v-for="jabatan in arrayData.jabatanGuru" :key="jabatan">
                      <v-list-item-title>
                        <v-icon icon="mdi mdi-square-small" />{{ jabatan }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </div>
              </v-col>
            </v-row>
            <v-row no-gutters class="mb-2">
              <v-col cols="12" md="12">
                <div class="white--text text-left" style="font-weight: bold;">*Mangajar Bidang</div>
                <div class="white--text text-left" style="font-size: 13px;">
                  <v-list
                    :lines="false"
                    density="compact"
                    nav
                    class="listData"
                  >
                    <v-list-item v-for="bidang in arrayData.mengajarBidang" :key="bidang">
                      <v-list-item-title>
                        <v-icon icon="mdi mdi-square-small" />{{ bidang }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </div>
              </v-col>
            </v-row>
            <v-row no-gutters class="mb-2">
              <v-col cols="12" md="12">
                <div class="white--text text-left" style="font-weight: bold;">*Mangajar Kelas</div>
                <div class="white--text text-left" style="font-size: 13px;">
                  <v-list
                    :lines="false"
                    density="compact"
                    nav
                    class="listData"
                  >
                    <v-list-item v-for="kelas in arrayData.mengajarKelas" :key="kelas">
                      <v-list-item-title>
                        <v-icon icon="mdi mdi-square-small" />{{ kelas }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </div>
              </v-col>
            </v-row>
            <v-row no-gutters class="mb-2">
              <v-col cols="12" md="12">
                <div class="white--text text-left" style="font-weight: bold;">*Wali Kelas</div>
                <div class="white--text text-left" style="font-size: 13px;">{{ previewData.waliKelas ? previewData.waliKelas : '-' }}</div>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-card>
    <v-dialog
      v-model="dialogPDF"
      transition="dialog-bottom-transition"
			persistent
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
        <v-card-text class="pt-4" style="font-size: 13px;">
          <PdfCetakan
            :dialog-pdf.sync="dialogPDF"
            :url-sk.sync="urlSk"
          />
        </v-card-text>
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
            :stencil-component="$options.components.Stencil"
          />
            <!-- :stencil-component="CircleStencil" -->
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
        :notifikasi-kode.sync="notifikasiKode"
        :notifikasi-text.sync="notifikasiText"
        :notifikasi-button.sync="notifikasiButton"
        @proses="goToProses"
        @cancel="dialogNotifikasi = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { useMeta } from 'vue-meta'
import PopUpNotifikasiVue from "./Layout/PopUpNotifikasi.vue";
import PdfCetakan from "./Layout/PdfCetakan.vue";
import Stencil from "./Layout/Stencil.vue";
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
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
  name: 'Profile',
  components: { PopUpNotifikasiVue, PdfCetakan, Cropper, CircleStencil, Stencil },
  data: () => ({
    roleID: '',
    nama: '',
    namaRole: '',
    isLoadingbtnPDF1: false,
    isLoadingbtnPDF2: false,
    isLoadingbtnPDF3: false,
    isLoadingbtnPDF4: false,
    isLoadingbtnPDF5: false,
    isLoadingbtnPDF6: false,
    dialogPDF: false,
    urlSk: window.location.href,
    BASE_URL: '',
    inputAdministrator: {
      idUser: '',
      nama: '',
      username: '',
      email: '',
      tempat: '',
      tanggalLahir: '',
      jenisKelamin: null,
      agama: null,
      telp: '',
      alamat: '',
      provinsi: null,
      kabKota: null,
      kecamatan: null,
      kelurahan: null,
      kodePos: '',
    },
    inputGuru: {
      idUser: '',
      nomorInduk: '',
      nama: '',
      username: '',
      email: '',
      tempat: '',
      tanggalLahir: '',
      jenisKelamin: null,
      agama: null,
      telp: '',
      alamat: '',
      provinsi: null,
      kabKota: null,
      kecamatan: null,
      kelurahan: null,
      kodePos: '',
      pendidikanGuru: null,
    },
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
      pendidikanGuru: '',
      jabatanGuru: '',
      mengajarBidang: '',
      mengajarKelas: '',
      waliKelas: '',
      fotoProfil: '',
      fcIjazah: '',
      fcSKHUN: '',
      fcKK: '',
      fcKTPOrtu: '',
      fcAktaLahir: '',
      fcSKL: '',
    },
    arrayData: {
      jabatanGuru: '',
      mengajarBidang: '',
      mengajarKelas: '',
    },
    authData: {
      passwordLama: '',
      passwordBaru: '',
      passwordConfBaru: '',
    },
    kondisiForm: true,
    jenisKelaminOptions: ['Laki - Laki', 'Perempuan'],
    levelOptions: [
			{ text: 'Super Administrator', value: 1 },
			{ text: 'Administrator', value: 2 },
		],
    kondisiTombol: true,
    passType: '',
    passTypeLama: '',
    passTypeBaru: '',
    passTypeConfBaru: '',
    endecryptType: '',
    rules: {
			emailRules: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'email tidak valid'
			},
		},
    itemsTab: [
			{code: '1', text: 'Data Profile', icon: 'mdi mdi-account'},
			{code: '2', text: 'Ubah Kata Sandi', icon: 'mdi mdi-lock'},
		],
		tab: '',
		componentKey: 0,
    dialogCrop: false,
    image: {
      src: null,
      type: null,
    },
    FileFotoProfil: '',
    fotoProfil: '',

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Profile - MTsS. SIROJUL ATHFAL",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
    return { CircleStencil }
  },
  computed: {
    ...mapState({
      agamaOptions: state => state.setting.agamaOptions,
      pendidikanOptions: state => state.setting.pendidikanOptions,
      ProvinsiOptions: state => state.setting.ProvinsiOptions,
      KabKotaOptions: state => state.setting.KabKotaOptions,
      KecamatanOptions: state => state.setting.KecamatanOptions,
      KelurahanOptions: state => state.setting.KelurahanOptions,
    }),
    ...mapGetters({
      dataprofile: 'auth/dataprofile',
    }),
  },
  watch:{
		dataprofile:{
      deep: true,
			handler(value){
        if(this.roleID === '3'){
          this.inputGuru = {
            idUser: value.idUser,
            nomorInduk: value.nomorInduk,
            nama: this.uppercaseLetterFirst2(value.nama),
            username: value.username,
            email: value.email,
            tempat: value.tempat,
            tanggalLahir: value.tanggalLahir,
            jenisKelamin: value.jenisKelamin,
            agama: value.agama.kode,
            telp: value.telp,
            alamat: this.uppercaseLetterFirst2(value.alamat),
            provinsi: value.provinsi.kode,
            kabKota: value.kabKota.kode,
            kecamatan: value.kecamatan.kode,
            kelurahan: value.kelurahan.kode,
            kodePos: value.kodePos,
            pendidikanGuru: value.pendidikanGuru.kode,
          }
          this.getAgama()
          this.getPendidikan()
          this.getWilayah({ bagian: 'provinsi', KodeWilayah: null })
          this.getWilayah({ bagian: 'kabkota', KodeWilayah: this.inputGuru.provinsi })
          this.getWilayah({ bagian: 'kecamatan', KodeWilayah: this.inputGuru.kabKota })
          this.getWilayah({ bagian: 'kelurahan', KodeWilayah: this.inputGuru.kecamatan })
        }
        if(this.roleID === '1' || this.roleID === '2'){
          this.inputAdministrator = {
            idUser: value.idUser,
            nama: this.uppercaseLetterFirst2(value.nama),
            username: value.username,
            email: value.email,
            tempat: value.tempat,
            tanggalLahir: value.tanggalLahir,
            jenisKelamin: value.jenisKelamin,
            agama: value.agama.kode,
            telp: value.telp,
            alamat: value.alamat ? this.uppercaseLetterFirst2(value.alamat) : '-',
            provinsi: value.provinsi.kode,
            kabKota: value.kabKota.kode,
            kecamatan: value.kecamatan.kode,
            kelurahan: value.kelurahan.kode,
            kodePos: value.kodePos,
          }
          this.getAgama()
          this.getWilayah({ bagian: 'provinsi', KodeWilayah: null })
          this.getWilayah({ bagian: 'kabkota', KodeWilayah: this.inputAdministrator.provinsi })
          this.getWilayah({ bagian: 'kecamatan', KodeWilayah: this.inputAdministrator.kabKota })
          this.getWilayah({ bagian: 'kelurahan', KodeWilayah: this.inputAdministrator.kecamatan })
        }
        this.previewData = {
          idUser: value.idUser,
          namaRole: value.namaRole,
          nama: this.uppercaseLetterFirst2(value.nama),
          username: value.username,
          email: value.email,
          password: value.kataSandi,
          nikSiswa: this.roleID === '4' ? value.nikSiswa ? value.nikSiswa : '-' : null,
          nomorInduk: this.roleID === '4' || this.roleID === '3' ? value.nomorInduk : null,
          tempat: value.tempat,
          tanggalLahir: value.tanggalLahir,
          jenisKelamin: value.jenisKelamin,
          agama: value.agama.label,
          anakKe: this.roleID === '4' ? value.anakKe ? value.anakKe : '-' : null,
          jumlahSaudara: this.roleID === '4' ? value.jumlahSaudara ? value.jumlahSaudara : '-' : null,
          hobi: this.roleID === '4' ? value.hobi ? value.hobi.label : '-' : null,
          citaCita: this.roleID === '4' ? value.citaCita ? value.citaCita.label : '-' : null,
          kelas: this.roleID === '4' ? value.kelas ? value.kelas : '-' : null,
          jenjang: this.roleID === '4' ? value.dataSekolahSebelumnya.jenjang.label : null,
          statusSekolah: this.roleID === '4' ? value.dataSekolahSebelumnya.statusSekolah.label : null,
          namaSekolah: this.roleID === '4' ? value.dataSekolahSebelumnya.namaSekolah : null,
          npsn: this.roleID === '4' ? value.dataSekolahSebelumnya.npsn ? value.dataSekolahSebelumnya.npsn : '-' : null,
          alamatSekolah: this.roleID === '4' ? this.uppercaseLetterFirst2(value.dataSekolahSebelumnya.alamatSekolah) : null,
          kabkotSekolah: this.roleID === '4' ? this.uppercaseLetterFirst2(value.dataSekolahSebelumnya.kabkotSekolah.nama) : null,
          noPesertaUN: this.roleID === '4' ? value.dataSekolahSebelumnya.noPesertaUN ? value.dataSekolahSebelumnya.noPesertaUN : '-': null,
          noSKHUN: this.roleID === '4' ? value.dataSekolahSebelumnya.noSKHUN ? value.dataSekolahSebelumnya.noSKHUN : '-' : null,
          noIjazah: this.roleID === '4' ? value.dataSekolahSebelumnya.noIjazah ? value.dataSekolahSebelumnya.noSKHUN : '-' : null,
          nilaiUN: this.roleID === '4' ? value.dataSekolahSebelumnya.nilaiUN ? value.dataSekolahSebelumnya.noSKHUN : '-' : null,
          noKK: this.roleID === '4' ? value.noKK : null,
          namaKK: this.roleID === '4' ? this.uppercaseLetterFirst2(value.namaKK) : null,
          telp: this.roleID === '4' ? value.dataAlamatOrangtua.telp ? value.dataAlamatOrangtua.telp : '-' : value.telp ? value.telp : '-',
          alamat: this.uppercaseLetterFirst2(this.roleID === '4' ? value.dataAlamatOrangtua.alamat ? value.dataAlamatOrangtua.alamat : '-' : value.alamat ? value.alamat : '-'),
          provinsi: this.uppercaseLetterFirst2(this.roleID === '4' ? value.dataAlamatOrangtua.provinsi.nama : value.provinsi.nama),
          kabKota: this.uppercaseLetterFirst2(this.roleID === '4' ? value.dataAlamatOrangtua.kabKota.nama : value.kabKota.nama),
          kecamatan: this.uppercaseLetterFirst2(this.roleID === '4' ? value.dataAlamatOrangtua.kecamatan.nama : value.kecamatan.nama),
          kelurahan: this.uppercaseLetterFirst2(this.roleID === '4' ? value.dataAlamatOrangtua.kelurahan.nama : value.kelurahan.nama),
          kodePos: this.roleID === '4' ? value.dataAlamatOrangtua.kodePos : value.kodePos,
          nikAyah: this.roleID === '4' ? value.dataOrangtua.dataAyah.nikAyah : null,
          namaAyah: this.roleID === '4' ? this.uppercaseLetterFirst2(value.dataOrangtua.dataAyah.namaAyah) : null,
          tahunAyah: this.roleID === '4' ? value.dataOrangtua.dataAyah.tahunAyah : null,
          statusAyah: this.roleID === '4' ? value.dataOrangtua.dataAyah.statusAyah.label : null,
          pendidikanAyah: this.roleID === '4' ? value.dataOrangtua.dataAyah.pendidikanAyah.label : null,
          pekerjaanAyah: this.roleID === '4' ? value.dataOrangtua.dataAyah.pekerjaanAyah.label : null,
          telpAyah: this.roleID === '4' ? value.dataOrangtua.dataAyah.telpAyah : null,
          nikIbu: this.roleID === '4' ? value.dataOrangtua.dataIbu.nikIbu : null,
          namaIbu: this.roleID === '4' ? this.uppercaseLetterFirst2(value.dataOrangtua.dataIbu.namaIbu) : null,
          tahunIbu: this.roleID === '4' ? value.dataOrangtua.dataIbu.tahunIbu : null,
          statusIbu: this.roleID === '4' ? value.dataOrangtua.dataIbu.statusIbu.label : null,
          pendidikanIbu: this.roleID === '4' ? value.dataOrangtua.dataIbu.pendidikanIbu.label : null,
          pekerjaanIbu: this.roleID === '4' ? value.dataOrangtua.dataIbu.pekerjaanIbu.label : null,
          telpIbu: this.roleID === '4' ? value.dataOrangtua.dataIbu.telpIbu : null,
          nikWali: this.roleID === '4' ? value.dataOrangtua.dataWali.nikWali ? value.dataOrangtua.dataWali.nikWali : '-' : null,
          namaWali: this.roleID === '4' ? value.dataOrangtua.dataWali.namaWali ? this.uppercaseLetterFirst2(value.dataOrangtua.dataWali.namaWali) : '-' : null,
          tahunWali: this.roleID === '4' ? value.dataOrangtua.dataWali.tahunWali ? value.dataOrangtua.dataWali.tahunWali : '-' : null,
          pendidikanWali: this.roleID === '4' ? value.dataOrangtua.dataWali.pendidikanWali ? value.dataOrangtua.dataWali.pendidikanWali.label : '-' : null,
          pekerjaanWali: this.roleID === '4' ? value.dataOrangtua.dataWali.pekerjaanWali ? value.dataOrangtua.dataWali.pekerjaanWali.label : '-' : null,
          telpWali: this.roleID === '4' ? value.dataOrangtua.dataWali.telpWali ? value.dataOrangtua.dataWali.telpWali : '-' : null,
          penghasilan: this.roleID === '4' ? value.penghasilan ? value.penghasilan.label : '-' : null,
          statusTempatTinggal: this.roleID === '4' ? value.dataLainnya.statusTempatTinggal ? value.dataLainnya.statusTempatTinggal.label : '-' : null,
          jarakRumah: this.roleID === '4' ? value.dataLainnya.jarakRumah ? value.dataLainnya.jarakRumah.label : '-' : null,
          transportasi: this.roleID === '4' ? value.dataLainnya.transportasi ? value.dataLainnya.transportasi.label : '-' : null,
          pendidikanGuru: this.roleID === '3' ? value.pendidikanGuru.label : null,
          jabatanGuru: this.roleID === '3' ? value.jabatanGuru.map(str => { return str.label; }).sort().join(', ') : null,
          mengajarBidang: this.roleID === '3' ? value.mengajarBidang.map(str => { return str.label; }).sort().join(', ') : null,
          mengajarKelas: this.roleID === '3' ? value.mengajarKelas : null,
          waliKelas: this.roleID === '3' ? value.waliKelas : null,
          fotoProfil: value.fotoProfil,
          fcIjazah: this.roleID === '4' ? value.berkas.fcIjazah : null,
          fcSKHUN: this.roleID === '4' ? value.berkas.fcSKHUN : null,
          fcKK: this.roleID === '4' ? value.berkas.fcKK : null,
          fcKTPOrtu: this.roleID === '4' ? value.berkas.fcKTPOrtu : null,
          fcAktaLahir: this.roleID === '4' ? value.berkas.fcAktaLahir : null,
          fcSKL: this.roleID === '4' ? value.berkas.fcSKl : null,
        }
        this.arrayData = {
          jabatanGuru: this.roleID === '3' ? value.jabatanGuru.map(str => { return str.label; }).sort() : null,
          mengajarBidang: this.roleID === '3' ? value.mengajarBidang.map(str => { return str.label; }).sort() : null,
          mengajarKelas: this.roleID === '3' ? value.mengajarKelas.split(', ') : null,
        }
        localStorage.setItem('fotoProfil', this.previewData.fotoProfil)
			}
		},
		tab:{
      deep: true,
			handler(value){
				if (value == '1') {
          this.getProfile(localStorage.getItem("idLogin"))
          this.passType = true
          this.endecryptType = false
          this.clearForm()
        }
			}
		},
    authData: {
      deep: true,
      handler(value){
        if(value.passwordLama == null){ this.authData.passwordLama = '' }
        if(value.passwordBaru == null){ this.authData.passwordBaru = '' }
        if(value.passwordConfBaru == null){ this.authData.passwordConfBaru = '' }
  
        if(value.passwordLama != '' && value.passwordBaru != '' && value.passwordConfBaru != ''){
          this.kondisiTombol = false
        }else{
          this.kondisiTombol = true	
        }
      }
    },
    inputGuru:{
			deep: true,
			handler(value) {
				if(!value.provinsi){
					this.inputGuru.kabKota = null
					this.inputGuru.kecamatan = null
					this.inputGuru.kelurahan = null
					this.inputGuru.kodePos = ''
				}
      }
    },
    inputAdministrator:{
			deep: true,
			handler(value) {
				if(!value.provinsi){
					this.inputAdministrator.kabKota = null
					this.inputAdministrator.kecamatan = null
					this.inputAdministrator.kelurahan = null
					this.inputAdministrator.kodePos = ''
				}
      }
    },
	},
  mounted() {
    this.roleID = localStorage.getItem("roleID")
    this.nama = localStorage.getItem("nama")
    this.namaRole = localStorage.getItem("nama_role")
    this.BASE_URL = process.env.VUE_APP_BASE_URL_VIEW
    this.passType = true
    this.endecryptType = false
    this.passTypeLama = false
    this.passTypeBaru = false
    this.passTypeConfBaru = false
  },
  methods: {
    ...mapActions({
      fetchData: 'fetchData',
      uploadFiles: 'upload/uploadFiles',
      getAgama: 'setting/getAgama',
      getPendidikan: 'setting/getPendidikan',
      getWilayah: 'setting/getWilayah',
      getProfile: 'auth/getProfile',
    }),
    wilayah(kondisi, e){
			if(kondisi === 'provinsi'){
				if(e){
          this.getWilayah({ bagian: 'kabkota', KodeWilayah: e })
          if(this.roleID === '1' || this.roleID === '2'){
            this.inputAdministrator.kabKota = null
            this.inputAdministrator.kecamatan = null
            this.inputAdministrator.kelurahan = null
            this.inputAdministrator.kodePos = ''
          }else if(this.roleID === '3'){
            this.inputGuru.kabKota = null
            this.inputGuru.kecamatan = null
            this.inputGuru.kelurahan = null
            this.inputGuru.kodePos = ''
          }
				}
			}else if(kondisi === 'kabkota'){
				if(e){
					this.getWilayah({ bagian: 'kecamatan', KodeWilayah: e })
          if(this.roleID === '1' || this.roleID === '2'){
            if(e !== this.inputAdministrator.kecamatan) {
              this.inputAdministrator.kelurahan = null
              this.inputAdministrator.kodePos = ''	
            }
          }else if(this.roleID === '3'){
            if(e !== this.inputGuru.kecamatan) {
              this.inputGuru.kelurahan = null
              this.inputGuru.kodePos = ''	
            }
          }
				}else{
					if(this.roleID === '1' || this.roleID === '2'){
            this.inputAdministrator.kecamatan = null
            this.inputAdministrator.kelurahan = null
            this.inputAdministrator.kodePos = ''
          }else if(this.roleID === '3'){
            this.inputGuru.kecamatan = null
            this.inputGuru.kelurahan = null
            this.inputGuru.kodePos = ''
          }
				}
			}else if(kondisi === 'kecamatan'){
				if(e){
					this.getWilayah({ bagian: 'kelurahan', KodeWilayah: e })
          if(this.roleID === '1' || this.roleID === '2'){
            if(e !== this.inputAdministrator.kelurahan) {
              this.inputAdministrator.kodePos = ''	
            }
          }else if(this.roleID === '3'){
            if(e !== this.inputGuru.kelurahan) {
              this.inputGuru.kodePos = ''	
            }
          }
				}else{
					if(this.roleID === '1' || this.roleID === '2'){
            this.inputAdministrator.kelurahan = null
            this.inputAdministrator.kodePos = ''
          }else if(this.roleID === '3'){
            this.inputGuru.kelurahan = null
            this.inputGuru.kodePos = ''
          }
				}
			}else if(kondisi === 'kelurahan'){
				if(e){
					let data = this.KelurahanOptions.filter(str => str.kode === e)
          if(this.roleID === '1' || this.roleID === '2'){
            this.inputAdministrator.kodePos = data[0].kodePos
          }else if(this.roleID === '3'){
            this.inputGuru.kodePos = data[0].kodePos
          }
				}else{
					if(this.roleID === '1' || this.roleID === '2'){
            this.inputAdministrator.kodePos = ''
          }else if(this.roleID === '3'){
            this.inputGuru.kodePos = ''
          }
				}
			}
		},
    SimpanDataProfile(){
      let bodyData = {
        GURU: {
          idUser: localStorage.getItem('idLogin'),
          role: this.roleID,
          nomorInduk: this.inputGuru.nomorInduk,
          nama: this.inputGuru.nama,
          username: this.inputGuru.username,
          email: this.inputGuru.email,
          tempat: this.inputGuru.tempat,
          tanggalLahir: this.inputGuru.tanggalLahir,
          jenisKelamin: this.inputGuru.jenisKelamin,
          agama: this.inputGuru.agama,
          telp: this.inputGuru.telp,
          alamat: this.inputGuru.alamat,
          provinsi: this.inputGuru.provinsi,
          kabKota: this.inputGuru.kabKota,
          kecamatan: this.inputGuru.kecamatan,
          kelurahan: this.inputGuru.kelurahan,
          kodePos: this.inputGuru.kodePos,
          pendidikanGuru: this.inputGuru.pendidikanGuru,
        },
        ADMIN: {
          idUser: localStorage.getItem('idLogin'),
          role: this.roleID,
          nama: this.inputAdministrator.nama,
          username: this.inputAdministrator.username,
          email: this.inputAdministrator.email,
          tempat: this.inputAdministrator.tempat,
          tanggalLahir: this.inputAdministrator.tanggalLahir,
          jenisKelamin: this.inputAdministrator.jenisKelamin,
          agama: this.inputAdministrator.agama,
          telp: this.inputAdministrator.telp,
          alamat: this.inputAdministrator.alamat,
          provinsi: this.inputAdministrator.provinsi,
          kabKota: this.inputAdministrator.kabKota,
          kecamatan: this.inputAdministrator.kecamatan,
          kelurahan: this.inputAdministrator.kelurahan,
          kodePos: this.inputAdministrator.kodePos,
        },
      }
      this.$store.dispatch('auth/postProfile', this.roleID === '1' || this.roleID === '2' ? bodyData.ADMIN : bodyData.GURU)
      .then((res) => {
        this.kondisiForm = true
        this.clearForm()
        this.getProfile(localStorage.getItem('idLogin'))
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    UbahKataSandi() {
      let bodyData = {
        idUser: localStorage.getItem('idLogin'),
        passwordLama: this.authData.passwordLama,
        passwordBaru: this.authData.passwordBaru,
        passwordConfBaru: this.authData.passwordConfBaru,
      }
      this.$store.dispatch('auth/postKataSandi', bodyData)
      .then((res) => {
        this.kondisiForm = true
        this.clearForm()
        this.getProfile(localStorage.getItem('idLogin'))
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    pdfCreate(berkas, jenis) {
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
        return this.notifikasi("warning", 'Berkas tidak ditemukan !', "1")
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
    },
    pilihFile() {
      this.$refs.fotoProfile.click();
    },
    async uploadFotoProfile(e) {
      let files = e.target.files[0];
      if(!files) return this.notifikasi("warning", 'Ulangi unggah Foto Profile', "1")
      let ukuran = (files.size / (1024*1024)).toFixed(2);
      if(ukuran > 5.00) { 
        this.componentKey++; 
        return this.notifikasi("warning", 'Unggah Foto Profile anda terlalu besar !', "1")
      }
      this.fotoProfil = files.name
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
        this.FileFotoProfil = blob
        let uploadFotoProfil = await this.uploadLampiran(localStorage.getItem("idLogin"), this.FileFotoProfil)
        if(uploadFotoProfil != undefined){ 
          localStorage.setItem('fotoProfil', `${this.BASE_URL}/image/${uploadFotoProfil.data.result.idUser}/${uploadFotoProfil.data.result.namaFile}`)
          this.tutupDialogCrop()
          this.notifikasi("success", "Berhasil ubah Foto Profile", "2")
        }else{ 
          this.componentKey++;
          this.tutupDialogCrop()
          this.notifikasi("error", 'Gagal ubah Foto Profile', "1")
        }
			}, this.image.type);

		},
    tutupDialogCrop(){
      this.FileFotoProfil = ''
      this.fotoProfil = '';
      this.image = {
        src: null,
        type: null,
      }
      this.$refs.fotoProfile.value = null
      this.$refs.cropper.value = null
      this.dialogCrop = false
    },
    async uploadLampiran(idUser, dataUpload) {
			if(dataUpload){
				const bodyData = {
					idUser: idUser,
					field: 'fotoprofil',
					nama_folder: idUser,
					nama_file: `${idUser}-fotoprofil`,
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
    goToProses() {
      window.location.reload();
    },
    onClickVisible(d) {
      this[d] = !this[d]
    },
    endecryptData(d) {
      this[d] = !this[d]
      let url = this[d] ? 'decryptPass' : 'encryptPass' 
      let payload = {
				method: "get",
				url: `settings/${url}?kata=${this.previewData.password}`,
				authToken: localStorage.getItem('user_token')
			};
      this.previewData.password = ''
			this.fetchData(payload)
			.then((res) => {
				this.previewData.password = res.data.result.hasil;
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    clearForm(){
      this.authData = {
        passwordLama: '',
        passwordBaru: '',
        passwordConfBaru: '',
      }
      if(this.roleID === '3'){
        this.inputGuru = {
          idUser: '',
          nomorInduk: '',
          nama: '',
          username: '',
          email: '',
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
          pendidikanGuru: '',
        }
      }
      if(this.roleID === '1' || this.roleID === '2'){
        this.inputAdministrator = {
          idUser: '',
          nama: '',
          username: '',
          email: '',
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
        }
      }
    },
		notifikasi(kode, text, proses){
      this.dialogNotifikasi = true
      this.notifikasiKode = kode
      this.notifikasiText = text
      this.notifikasiButton = proses
    },
  },
}
</script>
<style scoped>
.listData {
	background-color: #272727;
	color: white;
	margin: 0px !important;
}
.tampilView{
  height: 450px;
}
.kotakleft {
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
}
.kotakright {
  border-left: 3px solid #4CAF50;
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
  padding: 10px;
  background-color: #272727;
  height: 100%;
  color: #ffffff;
}
.kotak {
	border: 2px dashed #000;
	border-radius: 5px;
	text-align: justify;
	background: #FFF;
	color: #000;
	margin: 5px;
  padding: 5px;
  font-size: 9pt;
}
.v-tab {
	font-size: 8pt !important;
	font-weight: bold !important;
}
.avatar {
  border: solid 2px #FFF;
  border-radius: 50%;
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
.customScrollLeft {
  width: 100%;
  height: 390px;
  background: #272727;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 5px;
  padding: 8px;
  border: 2px solid #272727;
	border-radius: 5px;
  color: #ffffff;
}

.customScrollLeft::-webkit-scrollbar {
  width: 16px;
}
.customScrollLeft::-webkit-scrollbar-thumb {
  background-color: #4CAF50;
  border: 5px solid #272727;
  border-radius: 10rem;
}
.customScrollLeft::-webkit-scrollbar-track {
  position: absolute;
  right: -3rem;
  top: -50rem;
  background: transparent;
}
.customScrollRight {
  width: 100%;
  height: 175px;
  background: #272727;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 5px;
}

.customScrollRight::-webkit-scrollbar {
  width: 16px;
}
.customScrollRight::-webkit-scrollbar-thumb {
  background-color: #4CAF50;
  border: 5px solid #272727;
  border-radius: 10rem;
}
.customScrollRight::-webkit-scrollbar-track {
  position: absolute;
  right: -3rem;
  top: -50rem;
  /* background: transparent; */
}
@media screen and (min-width: 1920px) {
  .tampilView {
    height: 770px;
  }
  .customScrollLeft {
    height: 710px;
  }
  .customScrollRight {
    height: 500px;
  }
}
</style>