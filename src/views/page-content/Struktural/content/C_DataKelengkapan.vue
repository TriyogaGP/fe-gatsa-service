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
						@keypress="onlyNumber($event, 25, inputDataKelengkapan.nomor_induk)"
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
						item-value="kode"
						label-a="Pendidikan Struktural"
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
						item-value="kode"
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
						item-value="kode"
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
						item-disabled="disabled"
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
		dataStepThree: Object,
  },
  data: () => ({
		inputDataKelengkapan: {
      id_user: '',
      nomor_induk: '',
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
					value.wali_kelas = ''
					this.kondisiJabatan = true
				}

				if(value.jabatan_guru !== null){
					let jabatan = value.jabatan_guru.includes(7)
					if(jabatan){
						this.kondisiJabatan = false
					}else{
						this.kondisiJabatan = true
					}
				}

				if(value.nomor_induk != '' && value.pendidikan_guru != null && value.jabatan_guru != null && value.mengajar_bidang != null && value.mengajar_kelas != null){
					this.kondisiTombol = false
				}else{
					this.kondisiTombol = true
				}
				localStorage.setItem('stepThree', JSON.stringify(this.inputDataKelengkapan))
				// this.wadahInput()
			}
		},
		dataStepThree: {
			deep: true,
			handler(value) {
				this.inputDataKelengkapan = {
					id_user: value.id_user ? value.id_user : null,
					nomor_induk: value.nomor_induk ? value.nomor_induk : null,
					pendidikan_guru: value.pendidikan_guru ? value.pendidikan_guru.kode : null,
					jabatan_guru: value.jabatan_guru ? value.jabatan_guru : null,
					mengajar_bidang: value.mengajar_bidang ? value.mengajar_bidang : null,
					mengajar_kelas: value.mengajar_kelas ? value.mengajar_kelas.split(', ') : null,
					wali_kelas: value.wali_kelas ? value.wali_kelas : null,
				}
				if(this.inputDataKelengkapan.wali_kelas){
					this.getKelas({ kondisi: 'Use', walikelas: this.inputDataKelengkapan.wali_kelas })
				}
			}
		},
	},
	mounted() {
		this.inputDataKelengkapan.id_user = this.$route.params.uid;
		this.getPendidikan()
		this.getJabatan()
		this.getMengajar()
		this.getKelas({ kondisi: 'All' })
		this.getKelas({ kondisi: 'Use', walikelas: null })
	},
	methods: {
		...mapActions({
			getPendidikan: 'setting/getPendidikan',
			getJabatan: 'setting/getJabatan',
			getMengajar: 'setting/getMengajar',
			getKelas: 'setting/getKelas',
		}),
		wadahInput(){
			let inputFormThree = {
				nomorInduk: this.inputDataKelengkapan.nomor_induk,
				pendidikanGuru: this.inputDataKelengkapan.pendidikan_guru,
				jabatanGuru: this.inputDataKelengkapan.jabatan_guru,
				mengajarBidang: this.inputDataKelengkapan.mengajar_bidang,
				mengajarKelas: this.inputDataKelengkapan.mengajar_kelas,
				waliKelas: this.inputDataKelengkapan.wali_kelas,
			}
      this.$emit("DataStepThree", inputFormThree)
    },
		// remove(item, kondisi) {
		// 	if(kondisi === 'jabatan'){
		// 		if(item.kode === 7){
		// 			this.inputDataKelengkapan.wali_kelas = ''
		// 			this.kondisiJabatan = true
		// 		}
		// 		this.inputDataKelengkapan.jabatan_guru.splice(this.inputDataKelengkapan.jabatan_guru.indexOf(item.kode), 1);
		// 	}else if(kondisi === 'bidang'){
		// 		this.inputDataKelengkapan.mengajar_bidang.splice(this.inputDataKelengkapan.mengajar_bidang.indexOf(item.kode), 1);
		// 	}else if(kondisi === 'kelas'){
		// 		this.inputDataKelengkapan.mengajar_kelas.splice(this.inputDataKelengkapan.mengajar_kelas.indexOf(item.kelas), 1);
		// 	}
    // },
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