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
						item-value="kode"
						label-a="Jenjang Sekolah"
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
						item-value="kode"
						label-a="Status Sekolah"
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
      id_user: '',
      jenjang: null,
      status_sekolah: null,
      nama_sekolah: '',
      npsn: '',
      alamat_sekolah: '',
      kabkot_sekolah: null,
      no_peserta_un: '',
      no_skhun: '',
      no_ijazah: '',
      nilai_un: '',
    },
		kondisiTombol: true,
		statusSekolahOptions: [
			{ label: 'Negeri', kode: 1 },
			{ label: 'Swasta', kode: 2 },
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

				if(value.jenjang != null && value.status_sekolah != '' && value.nama_sekolah != '' && value.alamat_sekolah != '' && value.kabkot_sekolah != null){
					this.kondisiTombol = false
				}else{
					this.kondisiTombol = true
				}
				localStorage.setItem('stepThree', JSON.stringify(this.inputDataSekolahSebelum))
				// this.wadahInput()
			}
		},
		dataStepThree: {
			deep: true,
			handler(value) {
				this.inputDataSekolahSebelum = {
					id_user: value.id_user ? value.id_user : null,
					jenjang: value.jenjang ? value.jenjang.kode : null,
					status_sekolah: value.status_sekolah ? value.status_sekolah.kode : null,
					nama_sekolah: value.nama_sekolah ? value.nama_sekolah : null,
					npsn: value.npsn ? value.npsn : null,
					alamat_sekolah: value.alamat_sekolah ? value.alamat_sekolah : null,
					kabkot_sekolah: value.kabkot_sekolah ? value.kabkot_sekolah.kode : null,
					no_peserta_un: value.no_peserta_un ? value.no_peserta_un : null,
					no_skhun: value.no_skhun ? value.no_skhun : null,
					no_ijazah: value.no_ijazah ? value.no_ijazah : null,
					nilai_un: value.nilai_un ? value.nilai_un : null,
				}
			}
		},
	},
	mounted() {
		this.inputDataSekolahSebelum.id_user = this.$route.params.uid;
		this.getJenjangSekolah()
		this.getWilayah2023({ bagian: 'kabkotaOnly', KodeWilayah: null })
	},
	methods: {
		...mapActions({
			getJenjangSekolah: 'setting/getJenjangSekolah',
			getWilayah2023: 'setting/getWilayah2023',
		}),
		wadahInput(){
			let inputFormThree = {
				jenjang: this.inputDataSekolahSebelum.jenjang,
				statusSekolah: this.inputDataSekolahSebelum.status_sekolah,
				namaSekolah: this.inputDataSekolahSebelum.nama_sekolah,
				npsn: this.inputDataSekolahSebelum.npsn,
				alamatSekolah: this.inputDataSekolahSebelum.alamat_sekolah,
				kabkotSekolah: this.inputDataSekolahSebelum.kabkot_sekolah,
				noPesertaUN: this.inputDataSekolahSebelum.no_peserta_un,
				noSKHUN: this.inputDataSekolahSebelum.no_skhun,
				noIjazah: this.inputDataSekolahSebelum.no_ijazah,
				nilaiUN: this.inputDataSekolahSebelum.nilai_un,
			}
      this.$emit("DataStepThree", inputFormThree)
    },
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