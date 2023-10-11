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
							class="d-flex justify-center align-center"
						>
							<TextField
								v-model="inputDataAlamat.tempat"
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
								v-model="inputDataAlamat.tanggal_lahir"
								placeholder="Tanggal Lahir"
								format="dd-MM-yyyy"
								:enable-time-picker="false"
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
					<Autocomplete
						v-model="inputDataAlamat.jenis_kelamin"
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
					<Autocomplete
						v-model="inputDataAlamat.agama"
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
					<TextField
						v-model="inputDataAlamat.telp"
						label-tf="Telepon"
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
						:data-a="KabKotaOptions"
						item-title="nama"
						item-value="kode"
						label-a="Kabupaten / Kota"
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
					Kelurahan
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<Autocomplete
						v-model="inputDataAlamat.kelurahan"
						:data-a="KelurahanOptions"
						item-title="nama"
						item-value="kode"
						label-a="Kelurahan"
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
    PopUpNotifikasi,
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
      id_user: '',
      tempat: '',
      tanggal_lahir: '',
      jenis_kelamin: null,
      agama: null,
      telp: '',
      alamat: '',
      provinsi: null,
      kabkota: null,
      kecamatan: null,
      kelurahan: null,
      kode_pos: '',
    },
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
      agamaOptions: state => state.setting.agamaOptions,
      ProvinsiOptions: state => state.setting.ProvinsiOptions,
      KabKotaOptions: state => state.setting.KabKotaOptions,
      KecamatanOptions: state => state.setting.KecamatanOptions,
      KelurahanOptions: state => state.setting.KelurahanOptions,
    }),
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

				if(value.tempat != '' && value.tanggal_lahir != '' && value.jenis_kelamin != null && value.agama != null && value.telp != '' && value.alamat != '' && value.provinsi != null &&
					value.kabkota != null && value.kecamatan != null && value.kelurahan != null){
					this.kondisiTombol = false
				}else{
					this.kondisiTombol = true
				}
				localStorage.setItem('stepTwo', JSON.stringify(this.inputDataAlamat))
				// this.wadahInput()
			}
		},
		dataStepTwo: {
			deep: true,
			handler(value) {
				this.inputDataAlamat = {
					id_user: value.id_user ? value.id_user : null,
					tempat: value.tempat ? value.tempat : null,
					tanggal_lahir: value.tanggal_lahir ? value.tanggal_lahir : null,
					jenis_kelamin: value.jenis_kelamin ? value.jenis_kelamin : null,
					agama: value.agama ? value.agama.kode : null,
					telp: value.telp ? value.telp : null,
					alamat: value.alamat ? value.alamat : null,
					provinsi: value.provinsi ? value.provinsi.kode : null,
					kabkota: value.kabkota ? value.kabkota.kode : null,
					kecamatan: value.kecamatan ? value.kecamatan.kode : null,
					kelurahan: value.kelurahan ? value.kelurahan.kode : null,
					kode_pos: value.kode_pos ? value.kode_pos : null,
				}
				this.getWilayah({ bagian: 'kabkota', KodeWilayah: this.inputDataAlamat.provinsi })
				this.getWilayah({ bagian: 'kecamatan', KodeWilayah: this.inputDataAlamat.kabkota })
				this.getWilayah({ bagian: 'kelurahan', KodeWilayah: this.inputDataAlamat.kecamatan })
			}
		},
	},
	mounted() {
		this.inputDataAlamat.id_user = this.$route.params.uid;
		this.kondisi = this.$route.params.kondisi;
		this.getAgama()
		this.getWilayah({ bagian: 'provinsi', KodeWilayah: null })
	},
	methods: {
		...mapActions({
			getAgama: 'setting/getAgama',
			getWilayah: 'setting/getWilayah',
		}),
		wadahInput(){
			let inputFormTwo = {
				tempat: this.inputDataAlamat.tempat,
				tanggalLahir: this.inputDataAlamat.tanggal_lahir,
				jenisKelamin: this.inputDataAlamat.jenis_kelamin,
				agama: this.inputDataAlamat.agama,
				telp: this.inputDataAlamat.telp,
				alamat: this.inputDataAlamat.alamat,
				provinsi: this.inputDataAlamat.provinsi,
				kabKota: this.inputDataAlamat.kabkota,
				kecamatan: this.inputDataAlamat.kecamatan,
				kelurahan: this.inputDataAlamat.kelurahan,
				kodePos: this.inputDataAlamat.kode_pos,
			}
      this.$emit("DataStepTwo", inputFormTwo)
    },
		wilayah(kondisi, e){
			if(kondisi === 'provinsi'){
				if(e){
					this.getWilayah({ bagian: 'kabkota', KodeWilayah: e })
					this.inputDataAlamat.kabkota = null
					this.inputDataAlamat.kecamatan = null
					this.inputDataAlamat.kelurahan = null
					this.inputDataAlamat.kode_pos = ''
				}
			}else if(kondisi === 'kabkota'){
				if(e){
					this.getWilayah({ bagian: 'kecamatan', KodeWilayah: e })
					if(e !== this.inputDataAlamat.kecamatan) {
						this.inputDataAlamat.kecamatan = null
						this.inputDataAlamat.kelurahan = null
						this.inputDataAlamat.kode_pos = ''
					}
				}else{
					this.inputDataAlamat.kecamatan = null
					this.inputDataAlamat.kelurahan = null
					this.inputDataAlamat.kode_pos = ''
				}
			}else if(kondisi === 'kecamatan'){
				if(e){
					this.getWilayah({ bagian: 'kelurahan', KodeWilayah: e })
					if(e !== this.inputDataAlamat.kelurahan) {
						this.inputDataAlamat.kelurahan = null
						this.inputDataAlamat.kode_pos = ''	
					}
				}else{
					this.inputDataAlamat.kelurahan = null
					this.inputDataAlamat.kode_pos = ''
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
					this.inputDataAlamat.kode_pos = ''
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