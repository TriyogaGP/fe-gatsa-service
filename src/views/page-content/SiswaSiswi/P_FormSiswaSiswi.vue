<template>
  <div>
    <h1 class="subheading grey--text">Formulir SiswaSiswi</h1>
    <div class="text-right wadah">
      <span class="link" @click="gotolist()">Data Siswa Siswi</span>
      <v-icon size="small" class="iconstyle" icon="mdi mdi-menu-right" />
      <span>Formulir SiswaSiswi</span>
    </div>
    <v-stepper v-model="stepperVal">
      <v-stepper-header>
        <v-stepper-item
          :complete="stepperVal > 1"
          title="Data Log in"
          :value="1"
        ></v-stepper-item>

        <v-divider></v-divider>

        <v-stepper-item
          :complete="stepperVal > 2"
          title="Data Siswa/i"
          :value="2"
        ></v-stepper-item>

        <v-divider></v-divider>

        <v-stepper-item
          :complete="stepperVal > 3"
          title="Data Sekolah Sebelumnya"
          :value="3"
        ></v-stepper-item>

        <v-stepper-item
          :complete="stepperVal > 4"
          title="Data Detail Orang Tua"
          :value="4"
        ></v-stepper-item>

        <v-divider></v-divider>

        <v-stepper-item
          title="Preview Formulir"
          :value="5"
        ></v-stepper-item>
      </v-stepper-header>

      <v-stepper-window>
        <v-stepper-window-item :value="1">
          <C_DataLogin 
            :stepper-val="stepperVal"
            :data-step-one="tampungStepOne"
            @StepOne="nextStep(1)"
            @BackToList="gotolist()"
          />
        </v-stepper-window-item>

        <v-stepper-window-item :value="2">
          <C_DataSiswa 
            :stepper-val="stepperVal"
            :data-step-two="tampungStepTwo"
            @backStep="backStep(2)"
            @StepTwo="nextStep(2)"
          />
        </v-stepper-window-item>

        <v-stepper-window-item :value="3">
          <C_DataSekolahSebelum 
            :stepper-val="stepperVal"
            :data-step-three="tampungStepThree"
            @backStep="backStep(3)"
            @StepThree="nextStep(3)"
          />
        </v-stepper-window-item>

        <v-stepper-window-item :value="4">
          <C_DataDetailOrangtua 
            :stepper-val="stepperVal"
            :data-step-four="tampungStepFour"
            @backStep="backStep(4)"
            @StepFour="nextStep(4)"
          />
        </v-stepper-window-item>

        <v-stepper-window-item :value="5">
          <v-lazy v-model="lazyStep2">
            <C_PreviewFormulir 
              :stepper-val="stepperVal"
              @backStep="stepperVal = $event"
            />
          </v-lazy>
        </v-stepper-window-item>
      </v-stepper-window>
    </v-stepper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { useMeta } from 'vue-meta'
import C_DataLogin from "./content/C_DataLogin.vue";
import C_DataSiswa from "./content/C_DataSiswa.vue";
import C_DataSekolahSebelum from "./content/C_DataSekolahSebelum.vue";
import C_DataDetailOrangtua from "./content/C_DataDetailOrangtua.vue";
import C_PreviewFormulir from "./content/C_PreviewFormulir.vue";

export default {
  name: 'FormulirSiswaSiswi',
  components: {
    C_DataLogin,
    C_DataSiswa,
    C_DataSekolahSebelum,
    C_DataDetailOrangtua,
    C_PreviewFormulir
  },
  data: () => ({
    stepperVal: 1,
    steps: 5,
    lazyStep2: false,
    tampungStepOne: {
      id_user: '',
      nama_lengkap: '',
      username: '',
      email: '',
      password: '',
    },
    tampungStepTwo: {
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
    tampungStepThree: {
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
    tampungStepFour: {
      id_user: '',
      no_kk: '',
      nama_kk: '',
      nama_ayah: '',
      tahun_ayah: null,
      status_ayah: null,
      nik_ayah: '',
      pendidikan_ayah: null,
      pekerjaan_ayah: null,
      telp_ayah: '',
      nama_ibu: '',
      tahun_ibu: null,
      status_ibu: null,
      nik_ibu: '',
      pendidikan_ibu: null,
      pekerjaan_ibu: null,
      telp_ibu: '',
      nama_wali: '',
      tahun_wali: null,
      nik_wali: '',
      pendidikan_wali: null,
      pekerjaan_wali: null,
      telp_wali: '',
      penghasilan: null,
      status_tempat_tinggal: null,
      jarak_rumah: null,
      transportasi: null,
      telp: '',
      alamat: '',
      provinsi: null,
      kabkota: null,
      kecamatan: null,
      kelurahan: null,
      kode_pos: '',
    },
  }),
  setup() {
    useMeta({
      title: "Formulir Siswa Siswi",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
  },
  computed: {
    ...mapGetters({
      siswasiswiBy: 'user/siswasiswiBy',
    })
  },
  watch: {
    stepperVal(n, o) {
      if (n !== o) {
        window.scrollTo(0, 0);
      }

      if (n != o && n == 5) {
        this.lazyStep2 = true;
      } else {
        this.lazyStep2 = false;
      }
    },
    siswasiswiBy: {
      deep: true,
      handler(value) {
        if(this.stepperVal === 1){
          this.tampungStepOne = {
            id_user: value.idUser ? value.idUser : '',
            nama_lengkap: value.nama ? value.nama : '',
            username: value.username ? value.username : '',
            email: value.email ? value.email : '',
            password: value.kataSandi ? value.kataSandi : '',
          }
        }
        if(this.stepperVal === 2){
          this.tampungStepTwo = {
            id_user: value.idUser ? value.idUser : '',
            nik_siswa: value.nikSiswa ? value.nikSiswa : '',
            nomor_induk: value.nomorInduk ? value.nomorInduk : '',
            tempat: value.tempat ? value.tempat : '',
            tanggal_lahir: value.tanggalLahir ? value.tanggalLahir : '',
            jenis_kelamin: value.jenisKelamin ? value.jenisKelamin : null,
            agama: value.agama ? value.agama : null,
            anakke: value.anakKe ? value.anakKe : '',
            jumlah_saudara: value.jumlahSaudara ? value.jumlahSaudara : '',
            hobi: value.hobi ? value.hobi : null,
            cita_cita: value.citaCita ? value.citaCita : null,
            kelas: value.kelas ? value.kelas : null,
          }
        }
        if(this.stepperVal === 3){
          this.tampungStepThree = {
            id_user: value.idUser ? value.idUser : '',
            jenjang: value.dataSekolahSebelumnya.jenjang ? value.dataSekolahSebelumnya.jenjang : null,
            status_sekolah: value.dataSekolahSebelumnya.statusSekolah ? value.dataSekolahSebelumnya.statusSekolah : null,
            nama_sekolah: value.dataSekolahSebelumnya.namaSekolah ? value.dataSekolahSebelumnya.namaSekolah : '',
            npsn: value.dataSekolahSebelumnya.npsn ? value.dataSekolahSebelumnya.npsn : '',
            alamat_sekolah: value.dataSekolahSebelumnya.alamatSekolah ? value.dataSekolahSebelumnya.alamatSekolah : '',
            kabkot_sekolah: value.dataSekolahSebelumnya.kabkotSekolah ? value.dataSekolahSebelumnya.kabkotSekolah : null,
            no_peserta_un: value.dataSekolahSebelumnya.noPesertaUN ? value.dataSekolahSebelumnya.noPesertaUN : '',
            no_skhun: value.dataSekolahSebelumnya.noSKHUN ? value.dataSekolahSebelumnya.noSKHUN : '',
            no_ijazah: value.dataSekolahSebelumnya.noIjazah ? value.dataSekolahSebelumnya.noIjazah : '',
            nilai_un: value.dataSekolahSebelumnya.nilaiUN ? value.dataSekolahSebelumnya.nilaiUN : '',
          }
        }
        if(this.stepperVal === 4){
          this.tampungStepFour = {
            id_user: value.idUser ? value.idUser : '',
            no_kk: value.noKK ? value.noKK : '',
            nama_kk: value.namaKK ? value.namaKK : '',
            nama_ayah: value.dataOrangtua.dataAyah.namaAyah ? value.dataOrangtua.dataAyah.namaAyah : '',
            tahun_ayah: value.dataOrangtua.dataAyah.tahunAyah ? value.dataOrangtua.dataAyah.tahunAyah : null,
            status_ayah: value.dataOrangtua.dataAyah.statusAyah ? value.dataOrangtua.dataAyah.statusAyah : null,
            nik_ayah: value.dataOrangtua.dataAyah.nikAyah ? value.dataOrangtua.dataAyah.nikAyah : '',
            pendidikan_ayah: value.dataOrangtua.dataAyah.pendidikanAyah ? value.dataOrangtua.dataAyah.pendidikanAyah : null,
            pekerjaan_ayah: value.dataOrangtua.dataAyah.pekerjaanAyah ? value.dataOrangtua.dataAyah.pekerjaanAyah : null,
            telp_ayah: value.dataOrangtua.dataAyah.telpAyah ? value.dataOrangtua.dataAyah.telpAyah : '',
            nama_ibu: value.dataOrangtua.dataIbu.namaIbu ? value.dataOrangtua.dataIbu.namaIbu : '',
            tahun_ibu: value.dataOrangtua.dataIbu.tahunIbu ? value.dataOrangtua.dataIbu.tahunIbu : null,
            status_ibu: value.dataOrangtua.dataIbu.statusIbu ? value.dataOrangtua.dataIbu.statusIbu : null,
            nik_ibu: value.dataOrangtua.dataIbu.nikIbu ? value.dataOrangtua.dataIbu.nikIbu : '',
            pendidikan_ibu: value.dataOrangtua.dataIbu.pendidikanIbu ? value.dataOrangtua.dataIbu.pendidikanIbu : null,
            pekerjaan_ibu: value.dataOrangtua.dataIbu.pekerjaanIbu ? value.dataOrangtua.dataIbu.pekerjaanIbu : null,
            telp_ibu: value.dataOrangtua.dataIbu.telpIbu ? value.dataOrangtua.dataIbu.telpIbu : '',
            nama_wali: value.dataOrangtua.dataWali.namaWali ? value.dataOrangtua.dataWali.namaWali : '',
            tahun_wali: value.dataOrangtua.dataWali.tahunWali ? value.dataOrangtua.dataWali.tahunWali : null,
            nik_wali: value.dataOrangtua.dataWali.nikWali ? value.dataOrangtua.dataWali.nikWali : '',
            pendidikan_wali: value.dataOrangtua.dataWali.pendidikanWali ? value.dataOrangtua.dataWali.pendidikanWali : null,
            pekerjaan_wali: value.dataOrangtua.dataWali.pekerjaanWali ? value.dataOrangtua.dataWali.pekerjaanWali : null,
            telp_wali: value.dataOrangtua.dataWali.telpWali ? value.dataOrangtua.dataWali.telpWali : '',
            penghasilan: value.penghasilan ? value.penghasilan : null,
            status_tempat_tinggal: value.dataLainnya.statusTempatTinggal ? value.dataLainnya.statusTempatTinggal : null,
            jarak_rumah: value.dataLainnya.jarakRumah ? value.dataLainnya.jarakRumah : null,
            transportasi: value.dataLainnya.transportasi ? value.dataLainnya.transportasi : null,
            telp: value.dataAlamatOrangtua.telp ? value.dataAlamatOrangtua.telp : '',
            alamat: value.dataAlamatOrangtua.alamat ? value.dataAlamatOrangtua.alamat : '',
            provinsi: value.dataAlamatOrangtua.provinsi ? value.dataAlamatOrangtua.provinsi : null,
            kabkota: value.dataAlamatOrangtua.kabKota ? value.dataAlamatOrangtua.kabKota : null,
            kecamatan: value.dataAlamatOrangtua.kecamatan ? value.dataAlamatOrangtua.kecamatan : null,
            kelurahan: value.dataAlamatOrangtua.kelurahan ? value.dataAlamatOrangtua.kelurahan : null,
            kode_pos: value.dataAlamatOrangtua.kodePos ? value.dataAlamatOrangtua.kodePos : '',
          }
        }
      },
    },
  },
  mounted() {
    // let uid = this.$route.params.uid;
    if(this.$route.params.kondisi === 'EDIT') return this.getSiswaSiswibyUID({uid: this.$route.params.uid, mapel: null})
  },
	methods: {
		...mapActions({
      getSiswaSiswibyUID: 'user/getSiswaSiswibyUID',
    }),
    gotolist() {
      localStorage.removeItem('stepOne')
      localStorage.removeItem('stepTwo')
      localStorage.removeItem('stepThree')
      localStorage.removeItem('stepFour')
      this.$router.push({name: "DataSiswaSiswi"});
    },
    // DataStepOne(data) {
    //   this.tampungStepOne = data
    // },
    // DataStepTwo(data) {
    //   this.tampungStepTwo = data
    // },
    // DataStepThree(data) {
    //   this.tampungStepThree = data
    // },
    // DataStepFour(data) {
    //   this.tampungStepFour = data
    // },
    nextStep(step) {
      this.stepperVal = step + 1;
      if(this.$route.params.kondisi === 'EDIT') return this.getSiswaSiswibyUID({uid: this.$route.params.uid, mapel: null})
    },
    backStep(step) {
      this.stepperVal = step - 1;
      if(this.$route.params.kondisi === 'EDIT') return this.getSiswaSiswibyUID({uid: this.$route.params.uid, mapel: null})
    },
	}
}
</script>

<style scoped>
.wadah {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 5px;
}
.iconstyle {
  margin-left: 5px;
  margin-right: 5px;
}
.link {
  color: #000;
  cursor: pointer;
  text-decoration: none;
}
.link:hover {
  color: #6fe484;
  cursor: pointer;
  text-decoration: underline;
}
</style>