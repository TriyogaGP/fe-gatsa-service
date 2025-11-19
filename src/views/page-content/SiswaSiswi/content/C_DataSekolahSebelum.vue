<template>
  <div>
		<v-card class="mb-0 pa-8" outlined elevation="0">
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
					<Autocomplete
						v-model="inputDataSekolahSebelum.jenjang"
						:data-a="jenjangOptions"
						item-title="label"
						item-value="value"
						label-a="Jenjang Sekolah"
						:rules-a="inputDataSekolahSebelum.jenjang != '' ? true : false"
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
					Status Sekolah
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<Autocomplete
						v-model="inputDataSekolahSebelum.status_sekolah"
						:data-a="statusSekolahOptions"
						item-title="label"
						item-value="value"
						label-a="Status Sekolah"
						:rules-a="inputDataSekolahSebelum.status_sekolah != '' ? true : false"
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
					Nama Sekolah
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<TextField
						v-model="inputDataSekolahSebelum.nama_sekolah"
						label-tf="Nama Sekolah"
						formatrulesTf="text"
						:rules-tf="inputDataSekolahSebelum.nama_sekolah != '' ? true : false"
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
					NPSN
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<TextField
						v-model="inputDataSekolahSebelum.npsn"
						label-tf="NPSN"
						@keypress="onlyNumber($event, 25, inputDataSekolahSebelum.npsn)"
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
					Alamat Sekolah
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<TextArea
						v-model="inputDataSekolahSebelum.alamat_sekolah"
						label-ta="Alamat Sekolah"
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
					Kabupaten / Kota Sekolah
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<Autocomplete
						v-model="inputDataSekolahSebelum.kabkot_sekolah"
						:data-a="optionsKabKota"
						item-title="nama"
						item-value="kode"
						label-a="Kabupaten / Kota Sekolah"
						:rules-a="inputDataSekolahSebelum.kabkot_sekolah != '' ? true : false"
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
					No Peserta UN
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<TextField
						v-model="inputDataSekolahSebelum.no_peserta_un"
						label-tf="No Peserta UN"
						@keypress="onlyNumber($event, 20, inputDataSekolahSebelum.no_peserta_un)"
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
					No SKHUN
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<TextField
						v-model="inputDataSekolahSebelum.no_skhun"
						label-tf="No SKHUN"
						@keypress="onlyNumber($event, 20, inputDataSekolahSebelum.no_skhun)"
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
					No Ijazah
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<TextField
						v-model="inputDataSekolahSebelum.no_ijazah"
						label-tf="No Ijazah"
						@keypress="onlyNumber($event, 20, inputDataSekolahSebelum.no_ijazah)"
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
					Nilai UN
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<TextField
						v-model="inputDataSekolahSebelum.nilai_un"
						label-tf="Nilai UN"
						@keypress="onlyNumber($event, 3, inputDataSekolahSebelum.nilai_un)"
						:clearable-tf="true"
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
		inputDataSekolahSebelum: {
      id_user: null,
      jenjang: null,
      status_sekolah: null,
      nama_sekolah: null,
      npsn: null,
      alamat_sekolah: null,
      kabkot_sekolah: null,
      no_peserta_un: null,
      no_skhun: null,
      no_ijazah: null,
      nilai_un: null,
    },
		kondisiTombol: true,
		statusSekolahOptions: [
			{ label: 'Negeri', value: 1 },
			{ label: 'Swasta', value: 2 },
		],

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	computed: {
		...mapState({
			jenjangOptions: store => store.setting.jenjangOptions,
			KabKotaOnlyOptions: store => store.setting.KabKotaOnlyOptions,
		}),
		optionsKabKota(){
      let kabkota = this.KabKotaOnlyOptions.map(x => {
        return {
          kode: x.kode,
          nama: `${x.jenisKabKota} ${x.nama}`
        }
      })
      return kabkota
    },
  },
	watch: {
		inputDataSekolahSebelum:{
			deep: true,
			handler(value) {
				if(value.nilai_un >= 100){
					value.nilai_un = 100
				}

				if(value.jenjang != null && value.status_sekolah != null && value.nama_sekolah != null && value.alamat_sekolah != null && value.kabkot_sekolah != null){
					this.kondisiTombol = false
				}else{
					this.kondisiTombol = true
				}
				localStorage.setItem('stepThree', JSON.stringify(this.inputDataSekolahSebelum))
			}
		},
		dataStepThree: {
			deep: true,
			handler(value) {
				this.inputDataSekolahSebelum = {
					id_user: value?.id_user,
					jenjang: value?.jenjang,
					status_sekolah: value?.status_sekolah,
					nama_sekolah: value?.nama_sekolah,
					npsn: value?.npsn,
					alamat_sekolah: value?.alamat_sekolah,
					kabkot_sekolah: value?.kabkot_sekolah,
					no_peserta_un: value?.no_peserta_un,
					no_skhun: value?.no_skhun,
					no_ijazah: value?.no_ijazah,
					nilai_un: value?.nilai_un,
				}
			}
		},
	},
	mounted() {
		this.inputDataSekolahSebelum.id_user = this.$route.params.uid;
		this.getDataMaster({ kode: 'jenjangsekolah' })
		this.getWilayah2023({ bagian: 'kabkotaOnly', KodeWilayah: null })
	},
	methods: {
		...mapActions({
			getDataMaster: 'setting/getDataMaster',
			getWilayah2023: 'setting/getWilayah2023',
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