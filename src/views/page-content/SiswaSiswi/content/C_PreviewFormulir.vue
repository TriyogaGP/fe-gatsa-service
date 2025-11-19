<template>
  <div>
		<v-card class="mb-0 pa-8" outlined elevation="0">
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
					Siswa / Siswi
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
          {{ DataStepOne.nama_lengkap }}
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
					{{ DataStepOne.username }}
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
          {{ DataStepOne.email }}
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
					<!-- {{ passText }} ({{ DataStepOne.password }}) -->
					{{ DataStepOne.password }}
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
					{{ DataStepTwo.nik_siswa ? DataStepTwo.nik_siswa : '-' }}
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
					{{ DataStepTwo.nomor_induk }}
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
					{{ DataStepTwo.tempat }}, {{ convertDateForMonth(DataStepTwo.tanggal_lahir) }}
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
					{{ DataStepTwo.jenis_kelamin }}
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
          {{ agamaText }}
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
					{{ DataStepTwo.anakke }}
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
					{{ DataStepTwo.jumlah_saudara }}
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
					{{ hobiText }}
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
					{{ citacitaText }}
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
					{{ DataStepTwo.kelas }}
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
					{{ jenjangsekolahText }}
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
					{{ statussekolahText }}
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
					{{ DataStepThree.nama_sekolah }}
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
					{{ DataStepThree.npsn }}
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
					{{ DataStepThree.alamat_sekolah }}
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
					{{ kabkotaOnlyText }}
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
					{{ DataStepThree.no_peserta_un ? DataStepThree.no_peserta_un : '-' }}
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
					{{ DataStepThree.no_skhun ? DataStepThree.no_skhun : '-' }}
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
					{{ DataStepThree.no_ijazah ? DataStepThree.no_ijazah : '-' }}
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
					{{ DataStepThree.nilai_un ? DataStepThree.nilai_un : '-' }}
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
					{{ DataStepFour.no_kk }}
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
					{{ DataStepFour.nama_kk }}
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
					{{ DataStepFour.telp }}
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
					{{ DataStepFour.alamat }}
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
					{{ provinsiText }}
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
          {{ kabkotaText }}
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
          {{ kecamatanText }}				
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
					{{ kelurahanText }}
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
          {{ DataStepFour.kode_pos }}
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
					{{ DataStepFour.nik_ayah }}
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
					{{ DataStepFour.nama_ayah }}
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
					{{ DataStepFour.tahun_ayah }}
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
					{{ statusTextAyah }}
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
					{{ pendidikanTextAyah }}
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
					{{ pekerjaanTextAyah }}
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
					{{ DataStepFour.telp_ayah }}
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
					{{ DataStepFour.nik_ibu }}
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
					{{ DataStepFour.nama_ibu }}
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
					{{ DataStepFour.tahun_ibu }}
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
					{{ statusTextIbu }}
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
					{{ pendidikanTextIbu }}
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
					{{ pekerjaanTextIbu }}
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
					{{ DataStepFour.telp_ibu }}
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
					{{ DataStepFour.nik_wali ? DataStepFour.nik_wali : '-' }}
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
					{{ DataStepFour.nama_wali ? DataStepFour.nama_wali : '-' }}
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
					{{ DataStepFour.tahun_wali ? DataStepFour.tahun_wali : '-' }}
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
					{{ pendidikanTextWali }}
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
					{{ pekerjaanTextWali }}
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
					{{ DataStepFour.telp_wali ? DataStepFour.telp_wali : '-' }}
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
					{{ penghasilanText }}
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
					{{ statustempattinggalText }}
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
					{{ jarakrumahText }}
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
					{{ transportasiText }}
				</v-col>
			</v-row>
		</v-card>
    <v-row no-gutters>
			<v-col cols="12" class="float-right">
				<Button
					class="float-right mt-3 white--text text--darken-2"
					color-button="#00479b"
					:nama-button="`${kondisi === 'ADD' ? 'Simpan' : 'Ubah'} Data`"
					@proses="simpanData()"
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
        @proses="goToProses"
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
    // DataStepOne: Object,
    // DataStepTwo: Object,
    // DataStepThree: Object,
    // DataStepFour: Object,
  },
  data: () => ({
		lazyStep2: false,
		preview: true,
    kondisi: '',
    passText: '',
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
	setup(){
		let DataStepOne = JSON.parse(localStorage.getItem('stepOne'))
		let DataStepTwo = JSON.parse(localStorage.getItem('stepTwo'))
		let DataStepThree = JSON.parse(localStorage.getItem('stepThree'))
		let DataStepFour = JSON.parse(localStorage.getItem('stepFour'))
		return { DataStepOne, DataStepTwo, DataStepThree, DataStepFour } 
	},
	computed: {
		...mapState({
			agamaOptions: store => store.setting.agamaOptions,
			hobiOptions: store => store.setting.hobiOptions,
			citacitaOptions: store => store.setting.citacitaOptions,
			jenjangOptions: store => store.setting.jenjangOptions,
			KabKotaOnlyOptions: store => store.setting.KabKotaOnlyOptions,
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
		agamaText(){
			return this.agamaOptions.filter(str => str.value === this.DataStepTwo.agama)[0].label
		},
		hobiText(){
			return this.DataStepTwo.hobi ? this.hobiOptions.filter(str => str.value === this.DataStepTwo.hobi)[0].label : '-'
		},
		citacitaText(){
			return this.DataStepTwo.cita_cita ? this.citacitaOptions.filter(str => str.value === this.DataStepTwo.cita_cita)[0].label : '-'
		},
		statussekolahText(){
			return this.statusSekolahOptions.filter(str => str.value === this.DataStepThree.status_sekolah )[0].label
		},
		jenjangsekolahText(){
			return this.jenjangOptions.filter(str => str.value === this.DataStepThree.jenjang)[0].label
		},
		pendidikanTextAyah(){
			return this.pendidikanOptions.filter(str => str.value === this.DataStepFour.pendidikan_ayah)[0].label
		},
		pendidikanTextIbu(){
			return this.pendidikanOptions.filter(str => str.value === this.DataStepFour.pendidikan_ibu)[0].label
		},
		pendidikanTextWali(){
			return this.DataStepFour.pendidikan_wali ? this.pendidikanOptions.filter(str => str.value === this.DataStepFour.pendidikan_wali)[0].label : '-'
		},
		pekerjaanTextAyah(){
			console.log(this.DataStepFour.pekerjaan_ayah, this.pekerjaanOptions);
			
			return this.pekerjaanOptions.filter(str => str.value === this.DataStepFour.pekerjaan_ayah)[0].label
		},
		pekerjaanTextIbu(){
			return this.pekerjaanOptions.filter(str => str.value === this.DataStepFour.pekerjaan_ibu)[0].label
		},
		pekerjaanTextWali(){
			return this.DataStepFour.pekerjaan_wali ? this.pekerjaanOptions.filter(str => str.value === this.DataStepFour.pekerjaan_wali)[0].label : '-'
		},
		statusTextAyah(){
			return this.statusorangtuaOptions.filter(str => str.value === this.DataStepFour.status_ayah)[0].label
		},
		statusTextIbu(){
			return this.statusorangtuaOptions.filter(str => str.value === this.DataStepFour.status_ibu)[0].label
		},
		penghasilanText(){
			return this.penghasilanOptions.filter(str => str.value === this.DataStepFour.penghasilan)[0].label
		},
		statustempattinggalText(){
			return this.DataStepFour.status_tempat_tinggal ? this.statustempattinggalOptions.filter(str => str.value === this.DataStepFour.status_tempat_tinggal)[0].label : '-'
		},
		jarakrumahText(){
			return this.DataStepFour.jarak_rumah ? this.jarakrumahOptions.filter(str => str.value === this.DataStepFour.jarak_rumah)[0].label : '-'
		},
		transportasiText(){
			return this.DataStepFour.transportasi ? this.transportasiOptions.filter(str => str.value === this.DataStepFour.transportasi)[0].label : '-'
		},
		provinsiText(){
			return this.ProvinsiOptions.filter(str => str.kode === this.DataStepFour.provinsi)[0].nama
		},
		kabkotaText(){
			let kabkota = this.KabKotaOptions.filter(str => str.kode === this.DataStepFour.kabkota)[0]
			return `${kabkota.jenisKabKota} ${kabkota.nama}`
		},
		kecamatanText(){
			return this.KecamatanOptions.filter(str => str.kode === this.DataStepFour.kecamatan)[0].nama
		},
		kelurahanText(){
			let keldes = this.KelurahanOptions.filter(str => str.kode === this.DataStepFour.kelurahan)[0]
			return `${keldes.jenisKelDes} ${keldes.nama}`
		},
		kabkotaOnlyText(){
			let kabkota = this.KabKotaOnlyOptions.filter(str => str.kode === this.DataStepThree.kabkot_sekolah)[0]
			return `${kabkota.jenisKabKota} ${kabkota.nama}`
		},
  },
	watch: {
    stepperVal(n, o) {
      if (n != o && n == 4) {
        this.lazyStep2 = true;
      } else {
        this.lazyStep2 = false;
      }
    },
	},
	mounted() {
    this.kondisi = this.$route.params.kondisi
		this.getDataMaster({ kode: 'agama' })
		this.getDataMaster({ kode: 'hobi' })
		this.getDataMaster({ kode: 'citacita' })
		this.getDataMaster({ kode: 'jenjangsekolah' })
		this.getDataMaster({ kode: 'pendidikan' })
		this.getDataMaster({ kode: 'pekerjaan' })
		this.getDataMaster({ kode: 'statusorangtua' })
		this.getDataMaster({ kode: 'statustempattinggal' })
		this.getDataMaster({ kode: 'jarakrumah' })
		this.getDataMaster({ kode: 'transportasi' })
		this.getWilayah2023({ bagian: 'kabkotaOnly', KodeWilayah: null })
		this.getWilayah2023({ bagian: 'provinsi', KodeWilayah: null })
		this.getWilayah2023({ bagian: 'kabkota', KodeWilayah: this.DataStepFour.provinsi })
		this.getWilayah2023({ bagian: 'kecamatan', KodeWilayah: this.DataStepFour.kabkota })
		this.getWilayah2023({ bagian: 'kelurahan', KodeWilayah: this.DataStepFour.kecamatan })
	},
	methods: {
		...mapActions({
			fetchData: "fetchData", 
			getDataMaster: 'setting/getDataMaster',
			getWilayah2023: "setting/getWilayah2023",
		}),
		simpanData() {
      let bodyData = {
				user: {
					jenis: this.kondisi,
          idUser: this.DataStepOne.id_user,
          consumerType: 4,
          nama: this.DataStepOne.nama_lengkap,
          username: this.DataStepOne.username,
          email: this.DataStepOne.email,
          password: this.DataStepOne.password,
        },
        userdetail: {
          nikSiswa: this.DataStepTwo.nik_siswa,
          nomorInduk: this.DataStepTwo.nomor_induk,
          tempat: this.DataStepTwo.tempat,
          tanggalLahir: this.DataStepTwo.tanggal_lahir,
          jenisKelamin: this.DataStepTwo.jenis_kelamin,
          agama: this.DataStepTwo.agama,
          anakKe: this.DataStepTwo.anakke,
          jumlahSaudara: this.DataStepTwo.jumlah_saudara,
          hobi: this.DataStepTwo.hobi,
          citaCita: this.DataStepTwo.cita_cita,
					dataSekolahSebelumnya: {
						jenjang: this.DataStepThree.jenjang,
						statusSekolah: this.DataStepThree.status_sekolah,
						namaSekolah: this.DataStepThree.nama_sekolah,
						npsn: this.DataStepThree.npsn,
						alamatSekolah: this.DataStepThree.alamat_sekolah,
						kabkotSekolah: this.DataStepThree.kabkot_sekolah,
						noPesertaUN: this.DataStepThree.no_peserta_un,
						noSKHUN: this.DataStepThree.no_skhun,
						noIjazah: this.DataStepThree.no_ijazah,
						nilaiUN: this.DataStepThree.nilai_un,
					},
          noKK: this.DataStepFour.no_kk,
          namaKK: this.DataStepFour.nama_kk,
					dataOrangtua: {
						dataAyah: {
							namaAyah: this.DataStepFour.nama_ayah,
							tahunAyah: this.DataStepFour.tahun_ayah,
							statusAyah: this.DataStepFour.status_ayah,
							nikAyah: this.DataStepFour.nik_ayah,
							pendidikanAyah: this.DataStepFour.pendidikan_ayah,
							pekerjaanAyah: this.DataStepFour.pekerjaan_ayah,
							telpAyah: this.DataStepFour.telp_ayah,
						},
						dataIbu: {
							namaIbu: this.DataStepFour.nama_ibu,
							tahunIbu: this.DataStepFour.tahun_ibu,
							statusIbu: this.DataStepFour.status_ibu,
							nikIbu: this.DataStepFour.nik_ibu,
							pendidikanIbu: this.DataStepFour.pendidikan_ibu,
							pekerjaanIbu: this.DataStepFour.pekerjaan_ibu,
							telpIbu: this.DataStepFour.telp_ibu,
						},
						dataWali: {
							namaWali: this.DataStepFour.nama_wali,
							tahunWali: this.DataStepFour.tahun_wali,
							nikWali: this.DataStepFour.nik_wali,
							pendidikanWali: this.DataStepFour.pendidikan_wali,
							pekerjaanWali: this.DataStepFour.pekerjaan_wali,
							telpWali: this.DataStepFour.telp_wali,
						},
					},
					penghasilan: this.DataStepFour.penghasilan,
					dataAlamatOrangtua: {
						telp: this.DataStepFour.telp,
						alamat: this.DataStepFour.alamat,
						provinsi: this.DataStepFour.provinsi,
						kabKota: this.DataStepFour.kabkota,
						kecamatan: this.DataStepFour.kecamatan,
						kelurahan: this.DataStepFour.kelurahan,
						kodePos: this.DataStepFour.kode_pos,
					},
					kelas: this.DataStepTwo.kelas,
					dataLainnya: {
						statusTempatTinggal: this.DataStepFour.status_tempat_tinggal,
						jarakRumah: this.DataStepFour.jarak_rumah,
						transportasi: this.DataStepFour.transportasi,
					}
        }
      }
      this.$store.dispatch('user/postSiswaSiswi', bodyData)
      .then((res) => {
				if(localStorage.getItem('roleID') !== '1'){
					let payload = {
						jenis: 'CREATE',
						idUser: '2MMOu7xFdkbe4YFRjpp71fRkV26',
						type: 'Record',
						judul: `${this.kondisi === 'ADD' ? 'Penambahan' : 'Perubahan'} data siswa/siswi`,
						pesan: {
							message: `data siswa/siswi telah ${this.kondisi === 'ADD' ? 'ditambah' : 'diubah'} oleh <strong>${localStorage.getItem('nama')}</strong>`,
							payload: bodyData,
						},
						params: null,
						dikirim: `dikirim oleh <strong>${localStorage.getItem('nama')}</strong>`,
						createBy: localStorage.getItem('idLogin'),
					}
					this.$store.dispatch('setting/postNotifikasi', payload)
				}
				localStorage.removeItem('stepOne')
				localStorage.removeItem('stepTwo')
				localStorage.removeItem('stepThree')
				localStorage.removeItem('stepFour')
        this.notifikasi("success", res.data.message, "2")
			})
			.catch((err) => {
        if(err.response.data.status == '404'){
					this.notifikasi("error", err.response.data.message, "1")
				}else if(err.response.data.status == '422'){
					this.notifikasi("warning", err.response.data.message, "1")
				}
			});
		},
    goToProses(){
			this.$router.push({name: "DataSiswaSiswi"});
		},
		cancel() {
      this.stepperVal = --this.stepperVal;
    },
    backStep() {
      this.$emit("backStep", 4);
    },
    endecryptData(kondisi, pass) {
      let url = kondisi === 'EDIT' ? 'decrypt-pass' : 'encrypt-pass' 
      let payload = {
				method: "get",
				url: `settings/${url}?kata=${pass}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.passText = res.data.result.hasil;
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
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

<style>
</style>