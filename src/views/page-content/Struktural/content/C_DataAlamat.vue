<template>
  <div>
		<v-card class="mb-0 pa-8" outlined elevation="0">
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
					<v-row no-gutters>
						<v-col
							cols="12"
							md="6"
							class="d-flex justify-center align-start"
						>
							<TextField
								v-model="inputDataAlamat.tempat"
								label-tf="Tempat Lahir"
								formatrulesTf="text"
								:rules-tf="inputDataAlamat.tempat != '' ? true : false"
                :clearable-tf="true"
							/>
						</v-col>
						<v-col
							cols="12"
							md="6"
							class="pl-2 d-flex justify-center align-start flex-wrap"
						>
							<div class="v-input_control_tanggal">
								<vue-date-picker
									v-model="inputDataAlamat.tanggal_lahir"
									placeholder="Tanggal Lahir"
									format="dd-MM-yyyy"
									:enable-time-picker="false"
									:teleport="true"
									:auto-position="false"
									:input-class="{ 'dp__input': showError }"
									position="left"
									auto-apply
									@update:model-value="validateTanggal(inputDataAlamat.tanggal_lahir)"
									@blur="validateTanggal(inputDataAlamat.tanggal_lahir)"
								/>
							</div>
							<span v-if="showError" class="v-messages-tanggal">Field ini wajib diisi !</span>
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
					<Autocomplete
						v-model="inputDataAlamat.jenis_kelamin"
						:data-a="jenisKelaminOptions"
						label-a="Jenis Kelamin"
						:rules-a="inputDataAlamat.jenis_kelamin != '' ? true : false"
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
					<Autocomplete
						v-model="inputDataAlamat.agama"
						:data-a="agamaOptions"
						item-title="label"
						item-value="value"
						label-a="Agama"
						:rules-a="inputDataAlamat.agama != '' ? true : false"
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
					<TextField
						v-model="inputDataAlamat.telp"
						label-tf="Telepon"
						formatrulesTf="text"
						:rules-tf="inputDataAlamat.telp != '' ? true : false"
						:clearable-tf="true"
						@keypress="onlyNumber($event, 15, inputDataAlamat.telp)"
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
						v-model="inputDataAlamat.alamat"
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
						v-model="inputDataAlamat.provinsi"
						:data-a="ProvinsiOptions"
						item-title="nama"
						item-value="kode"
						label-a="Provinsi"
						:rules-a="inputDataAlamat.provinsi != '' ? true : false"
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
						v-model="inputDataAlamat.kabkota"
						:data-a="optionsKabKota"
						item-title="nama"
						item-value="kode"
						label-a="Kabupaten / Kota"
						:rules-a="inputDataAlamat.kabkota != '' ? true : false"
						:clearable-a="true"
						:disabled-a="inputDataAlamat.provinsi ? false : true"
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
						v-model="inputDataAlamat.kecamatan"
						:data-a="KecamatanOptions"
						item-title="nama"
						item-value="kode"
						label-a="Kecamatan"
						:rules-a="inputDataAlamat.kecamatan != '' ? true : false"
						:clearable-a="true"
						:disabled-a="inputDataAlamat.kabkota ? false : true"
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
					Kelurahan / Desa
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<Autocomplete
						v-model="inputDataAlamat.kelurahan"
						:data-a="optionsKelurahan"
						item-title="nama"
						item-value="kode"
						label-a="Kelurahan / Desa"
						:rules-a="inputDataAlamat.kelurahan != '' ? true : false"
						:clearable-a="true"
						:disabled-a="inputDataAlamat.kecamatan ? false : true"
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
						v-model="inputDataAlamat.kode_pos"
						label-tf="Kode Pos"
						:disabled-tf="true"
					/>
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
					@proses="stepTwo()"
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
import { mapActions, mapState } from "vuex";
import PopUpNotifikasi from "../../../Layout/PopUpNotifikasi.vue";
export default {
	components: {
    PopUpNotifikasi
  },
	props: {
    stepperVal: {
      type: Number,
      default: null
    },
		dataStepTwo: Object,
  },
  data: () => ({
		inputDataAlamat: {
      id_user: null,
      tempat: null,
      tanggal_lahir: null,
      jenis_kelamin: null,
      agama: null,
      telp: null,
      alamat: null,
      provinsi: null,
      kabkota: null,
      kecamatan: null,
      kelurahan: null,
      kode_pos: null,
    },
		showError: false,
		kondisiTombol: true,
    jenisKelaminOptions: ['Laki - Laki', 'Perempuan'],

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	computed: {
		...mapState({
			agamaOptions: store => store.setting.agamaOptions,
			ProvinsiOptions: store => store.setting.ProvinsiOptions,
			KabKotaOptions: store => store.setting.KabKotaOptions,
			KecamatanOptions: store => store.setting.KecamatanOptions,
			KelurahanOptions: store => store.setting.KelurahanOptions,
		}),
		optionsKabKota(){
      let kabkota = this.KabKotaOptions.map(x => {
        return {
          kode: x.kode,
          nama: `${x.jenisKabKota} ${x.nama}`
        }
      })
      return kabkota
    },
		optionsKelurahan(){
      let kel = this.KelurahanOptions.map(x => {
        return {
          kode: x.kode,
          nama: `${x.jenisKelDes} ${x.nama}`
        }
      })
      return kel
    },
  },
	watch: {
		inputDataAlamat:{
			deep: true,
			handler(value) {
				if(!value.provinsi){
					this.inputDataAlamat.kabkota = null
					this.inputDataAlamat.kecamatan = null
					this.inputDataAlamat.kelurahan = null
					this.inputDataAlamat.kode_pos = null
				}

				if(value.tempat != null && value.tanggal_lahir != null && value.jenis_kelamin != null && value.agama != null && value.telp != null && value.alamat != null && value.provinsi != null &&
					value.kabkota != null && value.kecamatan != null && value.kelurahan != null){
					this.kondisiTombol = false
				}else{
					this.kondisiTombol = true
				}
				localStorage.setItem('stepTwo', JSON.stringify(this.inputDataAlamat))
			}
		},
		dataStepTwo: {
			deep: true,
			handler(value) {
				this.inputDataAlamat = {
					id_user: value?.id_user,
					tempat: value?.tempat,
					tanggal_lahir: value?.tanggal_lahir,
					jenis_kelamin: value?.jenis_kelamin,
					agama: value?.agama,
					telp: value?.telp,
					alamat: value?.alamat,
					provinsi: value?.provinsi,
					kabkota: value?.kabkota,
					kecamatan: value?.kecamatan,
					kelurahan: value?.kelurahan,
					kode_pos: value?.kode_pos,
				}
				this.validateTanggal(this.inputDataAlamat.tanggal_lahir)
				this.getWilayah2023({ bagian: 'kabkota', KodeWilayah: this.inputDataAlamat.provinsi })
				this.getWilayah2023({ bagian: 'kecamatan', KodeWilayah: this.inputDataAlamat.kabkota })
				this.getWilayah2023({ bagian: 'kelurahan', KodeWilayah: this.inputDataAlamat.kecamatan })
			}
		},
	},
	mounted() {
		this.inputDataAlamat.id_user = this.$route.params.uid;
		this.kondisi = this.$route.params.kondisi;
		this.getDataMaster({ kode: 'agama' })
		this.getWilayah2023({ bagian: 'provinsi', KodeWilayah: null })
	},
	methods: {
		...mapActions({
			getDataMaster: 'setting/getDataMaster',
			getWilayah2023: 'setting/getWilayah2023',
		}),
		validateTanggal(val) {
			this.showError = !val
		},
		wilayah(kondisi, e){
			if(kondisi === 'provinsi'){
				if(e){
					this.getWilayah2023({ bagian: 'kabkota', KodeWilayah: e })
					this.inputDataAlamat.kabkota = null
					this.inputDataAlamat.kecamatan = null
					this.inputDataAlamat.kelurahan = null
					this.inputDataAlamat.kode_pos = null
				}
			}else if(kondisi === 'kabkota'){
				if(e){
					this.getWilayah2023({ bagian: 'kecamatan', KodeWilayah: e })
					if(e !== this.inputDataAlamat.kecamatan) {
						this.inputDataAlamat.kecamatan = null
						this.inputDataAlamat.kelurahan = null
						this.inputDataAlamat.kode_pos = null
					}
				}else{
					this.inputDataAlamat.kecamatan = null
					this.inputDataAlamat.kelurahan = null
					this.inputDataAlamat.kode_pos = null
				}
			}else if(kondisi === 'kecamatan'){
				if(e){
					this.getWilayah2023({ bagian: 'kelurahan', KodeWilayah: e })
					if(e !== this.inputDataAlamat.kelurahan) {
						this.inputDataAlamat.kelurahan = null
						this.inputDataAlamat.kode_pos = null	
					}
				}else{
					this.inputDataAlamat.kelurahan = null
					this.inputDataAlamat.kode_pos = null
				}
			}else if(kondisi === 'kelurahan'){
				if(e){
					let data = this.KelurahanOptions.filter(str => str.kode === e)
					if(this.$route.params.kondisi === 'ADD'){
						this.inputDataAlamat.kode_pos = data[0].kodePos
					}else if(this.$route.params.kondisi === 'EDIT'){
						this.inputDataAlamat.kode_pos = this.inputDataAlamat.kode_pos ? data.length ? data[0].kodePos : this.inputDataAlamat.kode_pos : data[0].kodePos
					}
				}else{
					this.inputDataAlamat.kode_pos = null
				}
			}
		},
		backStep() {
      this.$emit("backStep");
    },
		stepTwo() {
			this.$emit("StepTwo");
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