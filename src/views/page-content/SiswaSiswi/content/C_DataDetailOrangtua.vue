<template>
  <div>
		<v-card class="mb-0 pa-8" outlined elevation="0">
			<h2 class="subheading black--text"><u>>>Data Detail Orangtua</u></h2>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					No & Nama Kepala Keluarga
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
							class="d-flex justify-center align-center"
						>
              <TextField
                v-model="inputDataDetailOrangtua.no_kk"
                label-tf="No Kartu Keluarga"
                @keypress="onlyNumber($event,25, inputDataDetailOrangtua.no_kk)"
                :clearable-tf="true"
              />
						</v-col>
						<v-col
							cols="12"
							md="6"
							class="d-flex justify-end align-center pl-2"
						>
              <TextField
								v-model="inputDataDetailOrangtua.nama_kk"
								label-tf="Nama Kepala Keluarga"
								:clearable-tf="true"
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
					Telepon
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<TextField
						v-model="inputDataDetailOrangtua.telp"
						label-tf="Telepon"
						@keypress="onlyNumber($event, 15, inputDataDetailOrangtua.telp)"
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
					Alamat
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<TextArea
						v-model="inputDataDetailOrangtua.alamat"
						label-ta="Alamat"
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
					Provinsi
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<Autocomplete
						v-model="inputDataDetailOrangtua.provinsi"
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
					<Autocomplete
						v-model="inputDataDetailOrangtua.kabkota"
						:data-a="KabKotaOptions"
						item-title="nama"
						item-value="kode"
						label-a="Kabupaten / Kota"
						:clearable-a="true"
						:disabled-a="inputDataDetailOrangtua.provinsi ? false : true"
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
					<Autocomplete
						v-model="inputDataDetailOrangtua.kecamatan"
						:data-a="KecamatanOptions"
						item-title="nama"
						item-value="kode"
						label-a="Kecamatan"
						:clearable-a="true"
						:disabled-a="inputDataDetailOrangtua.kabkota ? false : true"
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
					<Autocomplete
						v-model="inputDataDetailOrangtua.kelurahan"
						:data-a="KelurahanOptions"
						item-title="nama"
						item-value="kode"
						label-a="Kelurahan"
						:clearable-a="true"
						:disabled-a="inputDataDetailOrangtua.kecamatan ? false : true"
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
					<TextField
						v-model="inputDataDetailOrangtua.kode_pos"
						label-tf="Kode Pos"
						:disabled-tf="true"
					/>
				</v-col>
			</v-row>
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
					<Autocomplete
						v-model="inputDataDetailOrangtua.penghasilan"
						:data-a="penghasilanOptions"
						item-title="label"
						item-value="kode"
						label-a="Penghasilan"
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
					Status Tempat Tinggal
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<Autocomplete
						v-model="inputDataDetailOrangtua.status_tempat_tinggal"
						:data-a="statustempattinggalOptions"
						item-title="label"
						item-value="kode"
						label-a="Status Tempat Tinggal"
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
					Jarak Rumah
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<Autocomplete
						v-model="inputDataDetailOrangtua.jarak_rumah"
						:data-a="jarakrumahOptions"
						item-title="label"
						item-value="kode"
						label-a="Jarak Rumah"
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
					Transportasi
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<Autocomplete
						v-model="inputDataDetailOrangtua.transportasi"
						:data-a="transportasiOptions"
						item-title="label"
						item-value="kode"
						label-a="Transportasi"
						:clearable-a="true"
					/>
				</v-col>
			</v-row>
      <h2 class="subheading black--text"><u>>>Data Ayah</u></h2>
      <v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					NIK & Nama Ayah
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
							class="d-flex justify-center align-center"
						>
              <TextField
                v-model="inputDataDetailOrangtua.nik_ayah"
                label-tf="NIK Ayah"
                @keypress="onlyNumber($event, 18, inputDataDetailOrangtua.nik_ayah)"
                :clearable-tf="true"
              />
						</v-col>
						<v-col
							cols="12"
							md="6"
							class="d-flex justify-end align-center pl-2"
						>
              <TextField
								v-model="inputDataDetailOrangtua.nama_ayah"
								label-tf="Nama Ayah"
								:clearable-tf="true"
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
					Status & Tahun Ayah
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
							class="d-flex justify-center align-center"
						>
              <Autocomplete
                v-model="inputDataDetailOrangtua.status_ayah"
                :data-a="statusorangtuaOptions"
                item-title="label"
                item-value="kode"
                label-a="Status Ayah"
                :clearable-a="true"
              />
						</v-col>
						<v-col
							cols="12"
							md="6"
							class="d-flex justify-end align-center pl-2"
						>
              <Autocomplete
                v-model="inputDataDetailOrangtua.tahun_ayah"
                :data-a="tahunOptions"
                label-a="Tahun Ayah"
                :clearable-a="true"
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
					Pendidikan & Pekerjaan Ayah
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
							class="d-flex justify-center align-center"
						>
              <Autocomplete
                v-model="inputDataDetailOrangtua.pendidikan_ayah"
                :data-a="pendidikanOptions"
                item-title="label"
                item-value="kode"
                label-a="Pendidikan Ayah"
                :clearable-a="true"
              />
						</v-col>
						<v-col
							cols="12"
							md="6"
							class="d-flex justify-end align-center pl-2"
						>
              <Autocomplete
                v-model="inputDataDetailOrangtua.pekerjaan_ayah"
                :data-a="pekerjaanOptions"
                item-title="label"
                item-value="kode"
                label-a="Pekerjaan Ayah"
                :clearable-a="true"
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
					Telepon Ayah
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<TextField
						v-model="inputDataDetailOrangtua.telp_ayah"
						label-tf="Telepon Ayah"
						@keypress="onlyNumber($event, 15, inputDataDetailOrangtua.telp_ayah)"
						:clearable-tf="true"
					/>
				</v-col>
			</v-row>
      <h2 class="subheading black--text"><u>>>Data Ibu</u></h2>
      <v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					NIK & Nama Ibu
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
							class="d-flex justify-center align-center"
						>
              <TextField
                v-model="inputDataDetailOrangtua.nik_ibu"
                label-tf="NIK Ibu"
                @keypress="onlyNumber($event, 18, inputDataDetailOrangtua.nik_ibu)"
                :clearable-tf="true"
              />
						</v-col>
						<v-col
							cols="12"
							md="6"
							class="d-flex justify-end align-center pl-2"
						>
              <TextField
								v-model="inputDataDetailOrangtua.nama_ibu"
								label-tf="Nama Ibu"
								:clearable-tf="true"
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
					Status & Tahun Ibu
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
							class="d-flex justify-center align-center"
						>
              <Autocomplete
                v-model="inputDataDetailOrangtua.status_ibu"
                :data-a="statusorangtuaOptions"
                item-title="label"
                item-value="kode"
                label-a="Status Ibu"
                :clearable-a="true"
              />
						</v-col>
						<v-col
							cols="12"
							md="6"
							class="d-flex justify-end align-center pl-2"
						>
              <Autocomplete
                v-model="inputDataDetailOrangtua.tahun_ibu"
                :data-a="tahunOptions"
                label-a="Tahun Ibu"
                :clearable-a="true"
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
					Pendidikan & Pekerjaan Ibu
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
							class="d-flex justify-center align-center"
						>
              <Autocomplete
                v-model="inputDataDetailOrangtua.pendidikan_ibu"
                :data-a="pendidikanOptions"
                item-title="label"
                item-value="kode"
                label-a="Pendidikan Ibu"
                :clearable-a="true"
              />
						</v-col>
						<v-col
							cols="12"
							md="6"
							class="d-flex justify-end align-center pl-2"
						>
              <Autocomplete
                v-model="inputDataDetailOrangtua.pekerjaan_ibu"
                :data-a="pekerjaanOptions"
                item-title="label"
                item-value="kode"
                label-a="Pekerjaan Ibu"
                :clearable-a="true"
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
					Telepon Ibu
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<TextField
						v-model="inputDataDetailOrangtua.telp_ibu"
						label-tf="Telepon Ibu"
						@keypress="onlyNumber($event, 15, inputDataDetailOrangtua.telp_ibu)"
						:clearable-tf="true"
					/>
				</v-col>
			</v-row>
      <h2 class="subheading black--text"><u>>>Data Wali</u></h2>
      <v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					NIK & Nama Wali
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
							class="d-flex justify-center align-center"
						>
              <TextField
                v-model="inputDataDetailOrangtua.nik_wali"
                label-tf="NIK Wali"
                @keypress="onlyNumber($event, 18, inputDataDetailOrangtua.nik_wali)"
                :clearable-tf="true"
              />
						</v-col>
						<v-col
							cols="12"
							md="6"
							class="d-flex justify-end align-center pl-2"
						>
              <TextField
								v-model="inputDataDetailOrangtua.nama_wali"
								label-tf="Nama Wali"
								:clearable-tf="true"
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
					Telepon & Tahun Wali
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
							class="d-flex justify-center align-center"
						>
              <TextField
                v-model="inputDataDetailOrangtua.telp_wali"
                label-tf="Telepon Wali"
                @keypress="onlyNumber($event, 15, inputDataDetailOrangtua.telp_wali)"
                :clearable-tf="true"
              />
						</v-col>
						<v-col
							cols="12"
							md="6"
							class="d-flex justify-end align-center pl-2"
						>
              <Autocomplete
                v-model="inputDataDetailOrangtua.tahun_wali"
                :data-a="tahunOptions"
                label-a="Tahun Wali"
                :clearable-a="true"
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
					Pendidikan & Pekerjaan Wali
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
							class="d-flex justify-center align-center"
						>
              <Autocomplete
                v-model="inputDataDetailOrangtua.pendidikan_wali"
                :data-a="pendidikanOptions"
                item-title="label"
                item-value="kode"
                label-a="Pendidikan Wali"
                :clearable-a="true"
              />
						</v-col>
						<v-col
							cols="12"
							md="6"
							class="d-flex justify-end align-center pl-2"
						>
              <Autocomplete
                v-model="inputDataDetailOrangtua.pekerjaan_wali"
                :data-a="pekerjaanOptions"
                item-title="label"
                item-value="kode"
                label-a="Pekerjaan Wali"
                :clearable-a="true"
              />
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</v-card>
		<v-row no-gutters>
			<v-col cols="12" class="float-right">
				<Button
					class="float-right mt-3 white--text text--darken-2"
					color-button="#00479b"
					nama-button="Selanjutnya"
					:disabled-button="kondisiTombol"
					@proses="stepFour()"
				/>
				<Button
					class="float-right mr-4 mt-3"
					color-button="#9b1f15"
					nama-button="Kembali"
					@proses="backStep()"
				/>
			</v-col>
		</v-row>
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
import { mapActions, mapState } from "vuex";
import PopUpNotifikasiVue from '../../../Layout/PopUpNotifikasi.vue';
export default {
  components: {
    PopUpNotifikasiVue
  },
	props: {
    stepperVal: {
      type: Number,
      default: null
    },
		dataStepFour: Object,
  },
  data: () => ({
		inputDataDetailOrangtua: {
      id_user: '',
      no_kk: '',
      nama_kk: '',
      nama_ayah: '',
      tahun_ayah: null,
      status_ayah: null,
      nik_ayah: '',
      pendidikan_ayah: null,
      pekerjaan_ayah: null,
      telp_ayah: '',
      nama_ibu: '',
      tahun_ibu: null,
      status_ibu: null,
      nik_ibu: '',
      pendidikan_ibu: null,
      pekerjaan_ibu: null,
      telp_ibu: '',
      nama_wali: '',
      tahun_wali: null,
      nik_wali: '',
      pendidikan_wali: null,
      pekerjaan_wali: null,
      telp_wali: '',
      penghasilan: null,
      status_tempat_tinggal: null,
      jarak_rumah: null,
      transportasi: null,
      telp: '',
      alamat: '',
      provinsi: null,
      kabkota: null,
      kecamatan: null,
      kelurahan: null,
      kode_pos: '',
    },
		kondisiTombol: true,

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	computed: {
		...mapState({
			pendidikanOptions: store => store.setting.pendidikanOptions,
			pekerjaanOptions: store => store.setting.pekerjaanOptions,
			penghasilanOptions: store => store.setting.penghasilanOptions,
			statusorangtuaOptions: store => store.setting.statusorangtuaOptions,
			statustempattinggalOptions: store => store.setting.statustempattinggalOptions,
			jarakrumahOptions: store => store.setting.jarakrumahOptions,
			transportasiOptions: store => store.setting.transportasiOptions,
			ProvinsiOptions: store => store.setting.ProvinsiOptions,
			KabKotaOptions: store => store.setting.KabKotaOptions,
			KecamatanOptions: store => store.setting.KecamatanOptions,
			KelurahanOptions: store => store.setting.KelurahanOptions,
		}),
		tahunOptions(){
			const d = new Date();
			let tahunData = []
			for (let tahun = 1945; tahun <= d.getFullYear(); tahun++) {
				tahunData.push(tahun.toString())
			}
			return tahunData
		},
  },
	watch: {
		inputDataDetailOrangtua:{
			deep: true,
			handler(value) {
				if(!value.provinsi){
					this.inputDataDetailOrangtua.kabkota = null
					this.inputDataDetailOrangtua.kecamatan = null
					this.inputDataDetailOrangtua.kelurahan = null
					this.inputDataDetailOrangtua.kode_pos = null
				}

				if(value.no_kk != '' && value.nama_kk != '' && value.telp != '' && value.alamat != '' && value.provinsi != null && value.kabkota != null && value.kecamatan != null && value.kelurahan != null &&
          value.nik_ayah != '' && value.nama_ayah != '' && value.status_ayah != null && value.tahun_ayah != null && value.pendidikan_ayah != null && value.pekerjaan_ayah != null &&
          value.nik_ibu != '' && value.nama_ibu != '' && value.status_ibu != null && value.tahun_ibu != null && value.pendidikan_ibu != null && value.pekerjaan_ibu != null &&
					value.penghasilan != null){
					this.kondisiTombol = false
				}else{
					this.kondisiTombol = true
				}
				localStorage.setItem('stepFour', JSON.stringify(this.inputDataDetailOrangtua))
				// this.wadahInput()
			}
		},
		dataStepFour: {
			deep: true,
			handler(value) {
				this.inputDataDetailOrangtua = {
					id_user: value.id_user ? value.id_user : null,
          no_kk: value.no_kk ? value.no_kk : null,
          nama_kk: value.nama_kk ? value.nama_kk : null,
          nama_ayah: value.nama_ayah ? value.nama_ayah : null,
          tahun_ayah: value.tahun_ayah ? value.tahun_ayah : null,
          status_ayah: value.status_ayah ? value.status_ayah.kode : null,
          nik_ayah: value.nik_ayah ? value.nik_ayah : null,
          pendidikan_ayah: value.pendidikan_ayah ? value.pendidikan_ayah.kode : null,
          pekerjaan_ayah: value.pekerjaan_ayah ? value.pekerjaan_ayah.kode : null,
          telp_ayah: value.telp_ayah ? value.telp_ayah : null,
          nama_ibu: value.nama_ibu ? value.nama_ibu : null,
          tahun_ibu: value.tahun_ibu ? value.tahun_ibu : null,
          status_ibu: value.status_ibu ? value.status_ibu.kode : null,
          nik_ibu: value.nik_ibu ? value.nik_ibu : null,
          pendidikan_ibu: value.pendidikan_ibu ? value.pendidikan_ibu.kode : null,
          pekerjaan_ibu: value.pekerjaan_ibu ? value.pekerjaan_ibu.kode : null,
          telp_ibu: value.telp_ibu ? value.telp_ibu : null,
          nama_wali: value.nama_wali ? value.nama_wali : null,
          tahun_wali: value.tahun_wali ? value.tahunWali : null,
          nik_wali: value.nik_wali ? value.nik_wali : null,
          pendidikan_wali: value.pendidikan_wali ? value.pendidikan_wali.kode : null,
          pekerjaan_wali: value.pekerjaan_wali ? value.pekerjaan_wali.kode : null,
          telp_wali: value.telp_wali ? value.telp_wali : null,
          penghasilan: value.penghasilan ? value.penghasilan.kode : null,
          status_tempat_tinggal: value.status_tempat_tinggal ? value.status_tempat_tinggal.kode : null,
          jarak_rumah: value.jarak_rumah ? value.jarak_rumah.kode : null,
          transportasi: value.transportasi ? value.transportasi.kode : null,
					telp: value.telp ? value.telp : null,
					alamat: value.alamat ? value.alamat : null,
					provinsi: value.provinsi ? value.provinsi.kode : null,
					kabkota: value.kabkota ? value.kabkota.kode : null,
					kecamatan: value.kecamatan ? value.kecamatan.kode : null,
					kelurahan: value.kelurahan ? value.kelurahan.kode : null,
					kode_pos: value.kode_pos ? value.kode_pos : null,
				}
				this.getWilayah({ bagian: 'kabkota', KodeWilayah: this.inputDataDetailOrangtua.provinsi })
				this.getWilayah({ bagian: 'kecamatan', KodeWilayah: this.inputDataDetailOrangtua.kabkota })
				this.getWilayah({ bagian: 'kelurahan', KodeWilayah: this.inputDataDetailOrangtua.kecamatan })
			}
		},
	},
	mounted() {
		this.inputDataDetailOrangtua.id_user = this.$route.params.uid;
		this.getPendidikan()
		this.getPekerjaan()
		this.getPenghasilan()
		this.getStatusOrangTua()
		this.getStatusTempatTinggal()
		this.getJarakRumah()
		this.getTransportasi()
		this.getWilayah({ bagian: 'provinsi', KodeWilayah: null })
	},
	methods: {
		...mapActions({
			getPendidikan: 'setting/getPendidikan', 
			getPekerjaan: 'setting/getPekerjaan', 
			getPenghasilan: 'setting/getPenghasilan', 
			getStatusOrangTua: 'setting/getStatusOrangTua', 
			getStatusTempatTinggal: 'setting/getStatusTempatTinggal', 
			getJarakRumah: 'setting/getJarakRumah', 
			getTransportasi: 'setting/getTransportasi', 
			getWilayah: 'setting/getWilayah',
		}),
		wadahInput(){
			let inputFormFour = {
				idUser: this.inputDataDetailOrangtua.id_user,
				noKK: this.inputDataDetailOrangtua.no_kk,
				namaKK: this.inputDataDetailOrangtua.nama_kk,
				namaAyah: this.inputDataDetailOrangtua.nama_ayah,
				tahunAayah: this.inputDataDetailOrangtua.tahun_ayah,
				statusAyah: this.inputDataDetailOrangtua.status_ayah,
				nikAyah: this.inputDataDetailOrangtua.nik_ayah,
				pendidikanAyah: this.inputDataDetailOrangtua.pendidikan_ayah,
				pekerjaanAyah: this.inputDataDetailOrangtua.pekerjaan_ayah,
				telpAyah: this.inputDataDetailOrangtua.telp_ayah,
				namaIbu: this.inputDataDetailOrangtua.nama_ibu,
				tahunIbu: this.inputDataDetailOrangtua.tahun_ibu,
				statusIbu: this.inputDataDetailOrangtua.status_ibu,
				nikIbu: this.inputDataDetailOrangtua.nik_ibu,
				pendidikanIbu: this.inputDataDetailOrangtua.pendidikan_ibu,
				pekerjaanIbu: this.inputDataDetailOrangtua.pekerjaan_ibu,
				telpIbu: this.inputDataDetailOrangtua.telp_ibu,
				namaWali: this.inputDataDetailOrangtua.nama_wali,
				tahunWali: this.inputDataDetailOrangtua.tahun_wali,
				nikWali: this.inputDataDetailOrangtua.nik_wali,
				pendidikanWali: this.inputDataDetailOrangtua.pendidikan_wali,
				pekerjaanWali: this.inputDataDetailOrangtua.pekerjaan_wali,
				telpWali: this.inputDataDetailOrangtua.telp_wali,
				penghasilan: this.inputDataDetailOrangtua.penghasilan,
				statusTempatTinggal: this.inputDataDetailOrangtua.status_tempat_tinggal,
				jarakRumah: this.inputDataDetailOrangtua.jarak_rumah,
				transportasi: this.inputDataDetailOrangtua.transportasi,
				telp: this.inputDataDetailOrangtua.telp,
				alamat: this.inputDataDetailOrangtua.alamat,
				provinsi: this.inputDataDetailOrangtua.provinsi,
				kabKota: this.inputDataDetailOrangtua.kabkota,
				kecamatan: this.inputDataDetailOrangtua.kecamatan,
				kelurahan: this.inputDataDetailOrangtua.kelurahan,
				kodePos: this.inputDataDetailOrangtua.kode_pos,
			}
      this.$emit("DataStepFour", inputFormFour)
    },
		wilayah(kondisi, e){
			if(kondisi === 'provinsi'){
				if(e){
					this.getWilayah({ bagian: 'kabkota', KodeWilayah: e })
					this.inputDataDetailOrangtua.kabkota = null
					this.inputDataDetailOrangtua.kecamatan = null
					this.inputDataDetailOrangtua.kelurahan = null
					this.inputDataDetailOrangtua.kode_pos = ''
				}
			}else if(kondisi === 'kabkota'){
				if(e){
					this.getWilayah({ bagian: 'kecamatan', KodeWilayah: e })
					if(e !== this.inputDataDetailOrangtua.kecamatan) {
						this.inputDataDetailOrangtua.kecamatan = null
						this.inputDataDetailOrangtua.kelurahan = null
						this.inputDataDetailOrangtua.kode_pos = ''
					}
				}else{
					this.inputDataDetailOrangtua.kecamatan = null
					this.inputDataDetailOrangtua.kelurahan = null
					this.inputDataDetailOrangtua.kode_pos = ''
				}
			}else if(kondisi === 'kecamatan'){
				if(e){
					this.getWilayah({ bagian: 'kelurahan', KodeWilayah: e })
					if(e !== this.inputDataDetailOrangtua.kelurahan) {
						this.inputDataDetailOrangtua.kelurahan = null
						this.inputDataDetailOrangtua.kode_pos = ''	
					}
				}else{
					this.inputDataDetailOrangtua.kelurahan = null
					this.inputDataDetailOrangtua.kode_pos = ''
				}
			}else if(kondisi === 'kelurahan'){
				if(e){
					let data = this.KelurahanOptions.filter(str => str.kode === e)
					if(this.$route.params.kondisi === 'ADD'){
						this.inputDataDetailOrangtua.kode_pos = data[0].kodePos
					}else if(this.$route.params.kondisi === 'EDIT'){
						this.inputDataDetailOrangtua.kode_pos = this.inputDataDetailOrangtua.kode_pos ? data.length ? data[0].kodePos : this.inputDataDetailOrangtua.kode_pos : data[0].kodePos
					}
				}else{
					this.inputDataDetailOrangtua.kode_pos = ''
				}
			}
		},
		backStep() {
      this.$emit("backStep", 3);
    },
		stepFour() {
			this.$emit("StepFour");
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