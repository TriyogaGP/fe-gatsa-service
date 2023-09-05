<template>
  <div>
		<v-card class="mb-0 pa-8" outlined elevation="0">
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
					<TextField
						v-model="inputDataSiswaSiswi.nik_siswa"
						label-tf="NIK Siswa/i"
						@keypress="onlyNumber($event, 25, inputDataSiswaSiswi.nik_siswa)"
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
					Nomor Induk
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<TextField
						v-model="inputDataSiswaSiswi.nomor_induk"
						label-tf="Nomor Induk"
						@keypress="onlyNumber($event, 25, inputDataSiswaSiswi.nomor_induk)"
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
								v-model="inputDataSiswaSiswi.tempat"
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
								v-model="inputDataSiswaSiswi.tanggal_lahir"
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
					<Autocomplete
						v-model="inputDataSiswaSiswi.jenis_kelamin"
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
						v-model="inputDataSiswaSiswi.agama"
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
					Anak Ke & Jumlah Saudara
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
								v-model="inputDataSiswaSiswi.anakke"
								label-tf="Anak Ke"
								@keypress="onlyNumber($event, 2, inputDataSiswaSiswi.anakke)"
								:clearable-tf="true"
							/>
						</v-col>
						<v-col
							cols="12"
							md="6"
							class="d-flex justify-end align-center pl-2"
						>
							<TextField
								v-model="inputDataSiswaSiswi.jumlah_saudara"
								label-tf="Jumlah Saudara"
								@keypress="onlyNumber($event, 2, inputDataSiswaSiswi.jumlah_saudara)"
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
					Hobi
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<Autocomplete
						v-model="inputDataSiswaSiswi.hobi"
						:data-a="hobiOptions"
						item-title="label"
						item-value="kode"
						label-a="Hobi"
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
					Cita - Cita
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<Autocomplete
						v-model="inputDataSiswaSiswi.cita_cita"
						:data-a="citacitaOptions"
						item-title="label"
						item-value="kode"
						label-a="Cita - Cita"
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
						v-model="inputDataSiswaSiswi.kelas"
						:data-a="kelasOptions"
						item-title="kelas"
						item-value="kelas"
						label-a="Kelas"
						:clearable-a="true"
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
import PopUpNotifikasiVue from "../../../Layout/PopUpNotifikasi.vue";
export default {
	components: {
    PopUpNotifikasiVue
  },
	props: {
    stepperVal: {
      type: Number,
      default: null
    },
		dataStepTwo: Object,
  },
  data: () => ({
		inputDataSiswaSiswi: {
      id_user: '',
      nik_siswa: '',
      nomor_induk: '',
      tempat: '',
      tanggal_lahir: '',
      jenis_kelamin: null,
      agama: null,
      anakke: '',
      jumlah_saudara: '',
      hobi: null,
      cita_cita: null,
      kelas: null,
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
			agamaOptions: store => store.setting.agamaOptions,
			hobiOptions: store => store.setting.hobiOptions,
			citacitaOptions: store => store.setting.citacitaOptions,
			kelasOptions: store => store.setting.kelasOptions,
		}),
  },
	watch: {
		inputDataSiswaSiswi:{
			deep: true,
			handler(value) {
				if(value.nomor_induk != '' && value.tempat != '' && value.tanggal_lahir != '' && value.jenis_kelamin != '' && value.agama != '' && value.kelas != ''){
					this.kondisiTombol = false
				}else{
					this.kondisiTombol = true
				}
				localStorage.setItem('stepTwo', JSON.stringify(this.inputDataSiswaSiswi))
				// this.wadahInput()
			}
		},
		dataStepTwo: {
			deep: true,
			handler(value) {
				this.inputDataSiswaSiswi = {
					id_user: value.id_user ? value.id_user : null,
					nik_siswa: value.nik_siswa ? value.nik_siswa : null,
					nomor_induk: value.nomor_induk ? value.nomor_induk : null,
					tempat: value.tempat ? value.tempat : null,
					tanggal_lahir: value.tanggal_lahir ? value.tanggal_lahir : null,
					jenis_kelamin: value.jenis_kelamin ? value.jenis_kelamin : null,
					agama: value.agama ? value.agama.kode : null,
					anakke: value.anakke ? value.anakke : null,
					jumlah_saudara: value.jumlah_saudara ? value.jumlah_saudara : null,
					hobi: value.hobi ? value.hobi.kode : null,
					cita_cita: value.cita_cita ? value.cita_cita.kode : null,
					kelas: value.kelas ? value.kelas : null,
				}
			}
		},
	},
	mounted() {
		this.inputDataSiswaSiswi.id_user = this.$route.params.uid;
		this.getAgama()
		this.getHobi()
		this.getCitaCita()
		this.getKelas({kondisi: 'All'})
	},
	methods: {
		...mapActions({
			getAgama: 'setting/getAgama',
			getHobi: 'setting/getHobi',
			getCitaCita: 'setting/getCitaCita',
			getKelas: 'setting/getKelas',
		}),
		wadahInput(){
			let inputFormTwo = {
				nikSiswa: this.inputDataSiswaSiswi.nik_siswa,
				nomorInduk: this.inputDataSiswaSiswi.nomor_induk,
				tempat: this.inputDataSiswaSiswi.tempat,
				tanggalLahir: this.inputDataSiswaSiswi.tanggal_lahir,
				jenisKelamin: this.inputDataSiswaSiswi.jenis_kelamin,
				agama: this.inputDataSiswaSiswi.agama,
				anakKe: this.inputDataSiswaSiswi.anakke,
				jumlahSaudara: this.inputDataSiswaSiswi.jumlah_saudara,
				hobi: this.inputDataSiswaSiswi.hobi,
				citaCita: this.inputDataSiswaSiswi.cita_cita,
				kelas: this.inputDataSiswaSiswi.kelas,
			}
      this.$emit("DataStepTwo", inputFormTwo)
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