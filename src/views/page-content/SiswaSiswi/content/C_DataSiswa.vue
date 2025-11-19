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
						formatrulesTf="text"
						:rules-tf="inputDataSiswaSiswi.nik_siswa != '' ? true : false"
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
						formatrulesTf="text"
						:rules-tf="inputDataSiswaSiswi.nomor_induk != '' ? true : false"
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
							class="d-flex justify-center align-start"
						>
							<TextField
								v-model="inputDataSiswaSiswi.tempat"
								label-tf="Tempat Lahir"
								formatrulesTf="text"
								:rules-tf="inputDataSiswaSiswi.tempat != '' ? true : false"
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
									v-model="inputDataSiswaSiswi.tanggal_lahir"
									placeholder="Tanggal Lahir"
									format="dd-MM-yyyy"
									:enable-time-picker="false"
									:teleport="true"
									:auto-position="false"
									:input-class="{ 'dp__input': showError }"
									position="left"
									auto-apply
									@update:model-value="validateTanggal(inputDataSiswaSiswi.tanggal_lahir)"
									@blur="validateTanggal(inputDataSiswaSiswi.tanggal_lahir)"
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
						v-model="inputDataSiswaSiswi.jenis_kelamin"
						:data-a="jenisKelaminOptions"
						label-a="Jenis Kelamin"
						:rules-a="inputDataSiswaSiswi.jenis_kelamin != '' ? true : false"
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
						item-value="value"
						label-a="Agama"
						:rules-a="inputDataSiswaSiswi.agama != '' ? true : false"
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
						item-value="value"
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
						item-value="value"
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
						:rules-a="inputDataSiswaSiswi.kelas != '' ? true : false"
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
		inputDataSiswaSiswi: {
      id_user: null,
      nik_siswa: null,
      nomor_induk: null,
      tempat: null,
      tanggal_lahir: null,
      jenis_kelamin: null,
      agama: null,
      anakke: null,
      jumlah_saudara: null,
      hobi: null,
      cita_cita: null,
      kelas: null,
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
			hobiOptions: store => store.setting.hobiOptions,
			citacitaOptions: store => store.setting.citacitaOptions,
			kelasOptions: store => store.setting.kelasOptions,
		}),
  },
	watch: {
		inputDataSiswaSiswi:{
			deep: true,
			handler(value) {
				if(value.nomor_induk != null && value.tempat != null && value.tanggal_lahir != null && value.jenis_kelamin != null && value.agama != null && value.kelas != null){
					this.kondisiTombol = false
				}else{
					this.kondisiTombol = true
				}
				localStorage.setItem('stepTwo', JSON.stringify(this.inputDataSiswaSiswi))
			}
		},
		dataStepTwo: {
			deep: true,
			handler(value) {
				this.inputDataSiswaSiswi = {
					id_user: value?.id_user,
					nik_siswa: value?.nik_siswa,
					nomor_induk: value?.nomor_induk,
					tempat: value?.tempat,
					tanggal_lahir: value?.tanggal_lahir,
					jenis_kelamin: value?.jenis_kelamin,
					agama: value?.agama,
					anakke: value?.anakke,
					jumlah_saudara: value?.jumlah_saudara,
					hobi: value?.hobi,
					cita_cita: value?.cita_cita,
					kelas: value?.kelas,
				}
				this.validateTanggal(this.inputDataSiswaSiswi.tanggal_lahir)
			}
		},
	},
	mounted() {
		this.inputDataSiswaSiswi.id_user = this.$route.params.uid;
		this.getDataMaster({ kode: 'agama' })
		this.getDataMaster({ kode: 'hobi' })
		this.getDataMaster({ kode: 'citacita' })
		this.getKelas({kondisi: 'All'})
	},
	methods: {
		...mapActions({
			getDataMaster: 'setting/getDataMaster',
			getKelas: 'setting/getKelas',
		}),
		validateTanggal(val) {
			this.showError = !val
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