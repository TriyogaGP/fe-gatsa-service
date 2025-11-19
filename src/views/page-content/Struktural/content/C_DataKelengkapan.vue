<template>
  <div>
		<v-card class="mb-0 pa-8" outlined elevation="0">
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
					<TextField
						v-model="inputDataKelengkapan.nomor_induk"
						label-tf="Nomor Induk"
						formatrulesTf="text"
						:rules-tf="inputDataKelengkapan.nomor_induk != '' ? true : false"
						:clearable-tf="true"
						@keypress="onlyNumber($event, 25, inputDataKelengkapan.nomor_induk)"
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
					<Autocomplete
						v-model="inputDataKelengkapan.pendidikan_guru"
						:data-a="pendidikanOptions"
						item-title="label"
						item-value="value"
						label-a="Pendidikan Struktural"
						:rules-a="inputDataKelengkapan.pendidikan_guru != '' ? true : false"
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
					Jabatan Struktural
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<Autocomplete
						v-model="inputDataKelengkapan.jabatan_guru"
						:data-a="jabatanOptions"
						item-title="label"
						item-value="value"
						label-a="Jabatan Struktural"
						multiple
						chips
						closable-chips
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
					Mengajar Bidang
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<Autocomplete
						v-model="inputDataKelengkapan.mengajar_bidang"
						:data-a="mengajarOptions"
						item-title="label"
						item-value="value"
						label-a="Mengajar Bidang"
						multiple
						chips
						closable-chips
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
					Mengajar Kelas
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<Autocomplete
						v-model="inputDataKelengkapan.mengajar_kelas"
						:data-a="kelasOptions"
						item-title="kelas"
						item-value="kelas"
						label-a="Mengajar Kelas"
						multiple
						chips
						closable-chips
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
					Wali Kelas
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<Autocomplete
						v-model="inputDataKelengkapan.wali_kelas"
						:data-a="kelasUseOptions"
						item-title="kelas"
						item-value="kelas"
						label-a="Wali Kelas"
						:clearable-a="true"
						:disabled-a="kondisiJabatan"
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
					@proses="stepThree()"
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
		dataStepThree: Object,
  },
  data: () => ({
		inputDataKelengkapan: {
      id_user: null,
      nomor_induk: null,
      pendidikan_guru: null,
      jabatan_guru: null,
      mengajar_bidang: null,
      mengajar_kelas: null,
      wali_kelas: null,
    },
		kondisiJabatan: true,
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
			jabatanOptions: store => store.setting.jabatanOptions,
			mengajarOptions: store => store.setting.mengajarOptions,
			kelasOptions: store => store.setting.kelasOptions,
			kelasUseOptions: store => store.setting.kelasUseOptions,
		}),
  },
	watch: {
		inputDataKelengkapan:{
			deep: true,
			handler(value) {
				if(value.jabatan_guru !== null && value.jabatan_guru.length === 0){
					this.inputDataKelengkapan.wali_kelas = null
					this.kondisiJabatan = true
				}

				if(value.jabatan_guru !== null){
					let jabatan = value.jabatan_guru.includes('7')
					if(jabatan){
						this.kondisiJabatan = false
					}else{
						this.inputDataKelengkapan.wali_kelas = null
						this.kondisiJabatan = true
					}
				}
				if(value.nomor_induk != null && value.pendidikan_guru != null){
					this.kondisiTombol = false
				}else{
					this.kondisiTombol = true
				}
				
				localStorage.setItem('stepThree', JSON.stringify(this.inputDataKelengkapan))
			}
		},
		dataStepThree: {
			deep: true,
			handler(value) {
				this.inputDataKelengkapan = {
					id_user: value?.id_user,
					nomor_induk: value?.nomor_induk,
					pendidikan_guru: value?.pendidikan_guru,
					jabatan_guru: value?.jabatan_guru,
					mengajar_bidang: value?.mengajar_bidang,
					mengajar_kelas: value?.mengajar_kelas,
					wali_kelas: value?.wali_kelas,
				}
				if(this.inputDataKelengkapan.wali_kelas){
					this.getKelas({ kondisi: 'Use', walikelas: this.inputDataKelengkapan.wali_kelas })
				}
			}
		},
	},
	mounted() {
		this.inputDataKelengkapan.id_user = this.$route.params.uid;
		this.getDataMaster({ kode: 'pendidikan' })
		this.getDataMaster({ kode: 'jabatan' })
		this.getDataMaster({ kode: 'mengajar' })
		this.getKelas({ kondisi: 'All' })
		this.getKelas({ kondisi: 'Use', walikelas: null })
	},
	methods: {
		...mapActions({
			getDataMaster: 'setting/getDataMaster',
			getKelas: 'setting/getKelas',
		}),
		backStep() {
      this.$emit("backStep", 2);
    },
		stepThree() {
			this.$emit("StepThree");
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