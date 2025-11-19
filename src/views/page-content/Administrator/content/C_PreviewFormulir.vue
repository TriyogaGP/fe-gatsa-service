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
          {{ levelOptions.filter(str => str.value === DataStepOne.level )[0].text }}
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
          {{ DataStepTwo.kode_pos }}
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
  },
  data: () => ({
		lazyStep2: false,
		preview: true,
    kondisi: '',
    passText: '',
    levelOptions: [
			{ text: 'Super Administrator', value: 1 },
			{ text: 'Administrator', value: 2 },
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
		return { DataStepOne, DataStepTwo } 
	},
	computed: {
		...mapState({
      agamaOptions: state => state.setting.agamaOptions,
      ProvinsiOptions: state => state.setting.ProvinsiOptions,
      KabKotaOptions: state => state.setting.KabKotaOptions,
      KecamatanOptions: state => state.setting.KecamatanOptions,
      KelurahanOptions: state => state.setting.KelurahanOptions,
    }),
		agamaText(){
			return this.agamaOptions.filter(str => str.value === this.DataStepTwo.agama)[0].label
		},
		provinsiText(){
			return this.ProvinsiOptions.filter(str => str.kode === this.DataStepTwo.provinsi)[0].nama
		},
		kabkotaText(){
			let kabkota = this.KabKotaOptions.filter(str => str.kode === this.DataStepTwo.kabkota)[0]
			return `${kabkota.jenisKabKota} ${kabkota.nama}`
		},
		kecamatanText(){
			return this.KecamatanOptions.filter(str => str.kode === this.DataStepTwo.kecamatan)[0].nama
		},
		kelurahanText(){
			let keldes = this.KelurahanOptions.filter(str => str.kode === this.DataStepTwo.kelurahan)[0]
			return `${keldes.jenisKelDes} ${keldes.nama}`
		},
  },
	watch: {
    stepperVal(n, o) {
      if (n != o && n == 3) {
        this.lazyStep2 = true;
      } else {
        this.lazyStep2 = false;
      }
    },
	},
	mounted() {
    this.kondisi = this.$route.params.kondisi
		this.getDataMaster({ kode: 'agama' })
		this.getWilayah2023({ bagian: 'provinsi', KodeWilayah: null })
		this.getWilayah2023({ bagian: 'kabkota', KodeWilayah: this.DataStepTwo.provinsi })
		this.getWilayah2023({ bagian: 'kecamatan', KodeWilayah: this.DataStepTwo.kabkota })
		this.getWilayah2023({ bagian: 'kelurahan', KodeWilayah: this.DataStepTwo.kecamatan })
	},
	methods: {
		...mapActions({
			fetchData: 'fetchData',
			getDataMaster: 'setting/getDataMaster',
			getWilayah2023: 'setting/getWilayah2023',
		}),
		simpanData() {
      let bodyData = {
        user: {
          jenis: this.kondisi,
          idUser: this.DataStepOne.id_user,
          consumerType: this.DataStepOne.level,
          nama: this.DataStepOne.nama_lengkap,
          username: this.DataStepOne.username,
          email: this.DataStepOne.email,
          password: this.DataStepOne.password,
        },
        userdetail: {
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
        }
      }
      this.$store.dispatch('user/postAdministrator', bodyData)
      .then((res) => {
				localStorage.removeItem('stepOne')
				localStorage.removeItem('stepTwo')
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
			this.$router.push({name: "DataAdministrator"});
		},
		cancel() {
      this.stepperVal = --this.stepperVal;
    },
    backStep() {
      this.$emit("backStep", 2);
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