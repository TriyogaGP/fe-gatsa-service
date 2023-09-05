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
          Guru
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
					Telepon
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					{{ DataStepTwo.telp }}
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
					{{ DataStepTwo.alamat }}
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
					{{ uppercaseLetterFirst2(provinsiText) }}
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
          {{ uppercaseLetterFirst2(kabkotaText) }}
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
          {{ uppercaseLetterFirst2(kecamatanText) }}				
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
					{{ uppercaseLetterFirst2(kelurahanText) }}
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
          {{ DataStepTwo.kode_pos }}
				</v-col>
			</v-row>
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
          {{ DataStepThree.nomor_induk }}
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
          {{ pendidikanText }}
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
          {{ jabatanText }}
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Mangajar Bidang
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
          {{ mengajatText }}
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Mangajar Kelas
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
          {{ kelasText }}
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
          {{ DataStepThree.wali_kelas ? DataStepThree.wali_kelas : '-' }}
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
      <PopUpNotifikasiVue
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
    // DataStepOne: Object,
    // DataStepTwo: Object,
    // DataStepThree: Object,
  },
  data: () => ({
		lazyStep2: false,
		preview: true,
    kondisi: '',
    passText: '',
    kelasText: '',

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
		return { DataStepOne, DataStepTwo, DataStepThree } 
	},
	computed: {
		...mapState({
			agamaOptions: store => store.setting.agamaOptions,
			pendidikanOptions: store => store.setting.pendidikanOptions,
			jabatanOptions: store => store.setting.jabatanOptions,
			mengajarOptions: store => store.setting.mengajarOptions,
			ProvinsiOptions: store => store.setting.ProvinsiOptions,
			KabKotaOptions: store => store.setting.KabKotaOptions,
			KecamatanOptions: store => store.setting.KecamatanOptions,
			KelurahanOptions: store => store.setting.KelurahanOptions,
		}),
		agamaText(){
			return this.agamaOptions.filter(str => str.kode === this.DataStepTwo.agama)[0].label
		},
		pendidikanText(){
			return this.pendidikanOptions.filter(str => str.kode === this.DataStepThree.pendidikan_guru)[0].label
		},
		jabatanText(){
			let kumpul = []
			this.DataStepThree.jabatan_guru.map(str => {
				let hasil = this.jabatanOptions.filter(val => val.kode === str)[0].label
				kumpul.push(hasil)
			})
			return kumpul.sort().join(', ')
		},
		mengajatText(){
			let kumpul = []
			this.DataStepThree.mengajar_bidang.map(str => {
				let hasil = this.mengajarOptions.filter(val => val.kode === str)[0].label
				kumpul.push(hasil) 
			})
			return kumpul.sort().join(', ')
		},
		provinsiText(){
			return this.ProvinsiOptions.filter(str => str.kode === this.DataStepTwo.provinsi)[0].nama
		},
		kabkotaText(){
			return this.KabKotaOptions.filter(str => str.kode === this.DataStepTwo.kabkota)[0].nama
		},
		kecamatanText(){
			return this.KecamatanOptions.filter(str => str.kode === this.DataStepTwo.kecamatan)[0].nama
		},
		kelurahanText(){
			return this.KelurahanOptions.filter(str => str.kode === this.DataStepTwo.kelurahan)[0].nama
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
		this.kelasText = this.DataStepThree.mengajar_kelas.sort().join(', ')
		this.getAgama()
		this.getPendidikan()
		this.getJabatan()
		this.getMengajar()
		this.getWilayah({ bagian: 'provinsi', KodeWilayah: null })
		this.getWilayah({ bagian: 'kabkota', KodeWilayah: this.DataStepTwo.provinsi })
		this.getWilayah({ bagian: 'kecamatan', KodeWilayah: this.DataStepTwo.kabkota })
		this.getWilayah({ bagian: 'kelurahan', KodeWilayah: this.DataStepTwo.kecamatan })
	},
	methods: {
		...mapActions({
			fetchData: "fetchData",
			getAgama: "setting/getAgama",
			getPendidikan: "setting/getPendidikan",
			getJabatan: "setting/getJabatan",
			getMengajar: "setting/getMengajar",
			getWilayah: "setting/getWilayah",
		}),
		simpanData() {
      let bodyData = {
        user: {
          jenis: this.kondisi,
          idUser: this.DataStepOne.id_user,
          consumerType: 3,
          nama: this.DataStepOne.nama_lengkap,
          username: this.DataStepOne.username,
          email: this.DataStepOne.email,
          password: this.DataStepOne.password,
        },
        userdetail: {
          nomorInduk: this.DataStepThree.nomor_induk,
          tempat: this.DataStepTwo.tempat,
          tanggalLahir: this.DataStepTwo.tanggal_lahir,
          jenisKelamin: this.DataStepTwo.jenis_kelamin,
          agama: this.DataStepTwo.agama,
          telp: this.DataStepTwo.telp,
          alamat: this.DataStepTwo.alamat,
          provinsi: this.DataStepTwo.provinsi,
          kabKota: this.DataStepTwo.kabkota,
          kecamatan: this.DataStepTwo.kecamatan,
          kelurahan: this.DataStepTwo.kelurahan,
          kodePos: this.DataStepTwo.kode_pos,
          pendidikanGuru: this.DataStepThree.pendidikan_guru,
          jabatanGuru: this.DataStepThree.jabatan_guru.sort().join(', '),
          mengajarBidang: this.DataStepThree.mengajar_bidang.sort().join(', '),
          mengajarKelas: this.DataStepThree.mengajar_kelas.sort().join(', '),
          waliKelas: this.DataStepThree.wali_kelas ? this.DataStepThree.wali_kelas : null,
        }
      }
      this.$store.dispatch('user/postStruktural', bodyData)
      .then((res) => {
				if(localStorage.getItem('roleID') !== '1'){
					let payload = {
						jenis: 'CREATE',
						idUser: '2MMOu7xFdkbe4YFRjpp71fRkV26',
						type: 'Record',
						judul: `${this.kondisi === 'ADD' ? 'Penambahan' : 'Perubahan'} data struktural`,
						pesan: {
							message: `data struktural telah ${this.kondisi === 'ADD' ? 'ditambah' : 'diubah'} oleh <strong>${localStorage.getItem('nama')}</strong>`,
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
				this.notifikasi("success", res.data.message, "2")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
		},
    goToProses(){
			this.$router.push({name: "DataStruktural"});
		},
		cancel() {
      this.stepperVal = --this.stepperVal;
    },
    backStep() {
      this.$emit("backStep", 3);
    },
    endecryptData(kondisi, pass) {
      let url = kondisi === 'EDIT' ? 'decryptPass' : 'encryptPass' 
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
.v-input .v-label {
  font-size: 11pt !important;
}
.v-text-field.v-input--dense {
  font-size: 13px !important;
}
</style>