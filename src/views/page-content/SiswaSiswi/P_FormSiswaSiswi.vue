<template>
  <div>
    <h2 class="subheading grey--text text-decoration-underline">Formulir SiswaSiswi</h2>
    <div class="text-right wadah">
      <span class="link" @click="gotolist()">Data Siswa Siswi</span>
      <v-icon size="small" class="iconstyle" icon="mdi mdi-menu-right" />
      <span>Formulir SiswaSiswi</span>
    </div>
    <v-stepper alt-labels v-model="stepperVal">
      <v-stepper-header style="color: #272727; font-size: 10pt; font-weight: bold;">
        <v-stepper-item
          :complete="stepperVal > 1"
          title="Data Log in"
          :value="1"
        ></v-stepper-item>

        <v-divider style="border: solid 1px #272727;" />

        <v-stepper-item
          :complete="stepperVal > 2"
          title="Data Siswa/i"
          :value="2"
        ></v-stepper-item>

        <v-divider style="border: solid 1px #272727;" />
        
        <v-stepper-item
        :complete="stepperVal > 3"
        title="Data Sekolah Sebelumnya"
        :value="3"
        ></v-stepper-item>

        <v-divider style="border: solid 1px #272727;" />

        <v-stepper-item
          :complete="stepperVal > 4"
          title="Data Detail Orang Tua"
          :value="4"
        ></v-stepper-item>

        <v-divider style="border: solid 1px #272727;" />

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
      id_user: null,
      nama_lengkap: null,
      username: null,
      email: null,
      password: null,
    },
    tampungStepTwo: {
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
    tampungStepThree: {
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
    tampungStepFour: {
      id_user: null,
      no_kk: null,
      nama_kk: null,
      nama_ayah: null,
      tahun_ayah: null,
      status_ayah: null,
      nik_ayah: null,
      pendidikan_ayah: null,
      pekerjaan_ayah: null,
      telp_ayah: null,
      nama_ibu: null,
      tahun_ibu: null,
      status_ibu: null,
      nik_ibu: null,
      pendidikan_ibu: null,
      pekerjaan_ibu: null,
      telp_ibu: null,
      nama_wali: null,
      tahun_wali: null,
      nik_wali: null,
      pendidikan_wali: null,
      pekerjaan_wali: null,
      telp_wali: null,
      penghasilan: null,
      status_tempat_tinggal: null,
      jarak_rumah: null,
      transportasi: null,
      telp: null,
      alamat: null,
      provinsi: null,
      kabkota: null,
      kecamatan: null,
      kelurahan: null,
      kode_pos: null,
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
            id_user: value?.idUser,
            nama_lengkap: value?.nama,
            username: value?.username,
            email: value?.email,
            password: value?.kataSandi,
          }
        }
        if(this.stepperVal === 2){
          this.tampungStepTwo = {
            id_user: value?.idUser,
            nik_siswa: value?.nikSiswa,
            nomor_induk: value?.nomorInduk,
            tempat: value?.tempat,
            tanggal_lahir: value?.tanggalLahir,
            jenis_kelamin: value?.jenisKelamin,
            agama: value?.agama?.value,
            anakke: value?.anakKe,
            jumlah_saudara: value?.jumlahSaudara,
            hobi: value?.hobi?.value,
            cita_cita: value?.citaCita?.value,
            kelas: value?.kelas,
          }
        }
        if(this.stepperVal === 3){
          this.tampungStepThree = {
            id_user: value?.idUser,
            jenjang: value?.dataSekolahSebelumnya?.jenjang?.value,
            status_sekolah: value?.dataSekolahSebelumnya?.statusSekolah?.value,
            nama_sekolah: value?.dataSekolahSebelumnya?.namaSekolah,
            npsn: value?.dataSekolahSebelumnya?.npsn,
            alamat_sekolah: value?.dataSekolahSebelumnya?.alamatSekolah,
            kabkot_sekolah: value?.dataSekolahSebelumnya?.kabkotSekolah?.kode,
            no_peserta_un: value?.dataSekolahSebelumnya?.noPesertaUN,
            no_skhun: value?.dataSekolahSebelumnya?.noSKHUN,
            no_ijazah: value?.dataSekolahSebelumnya?.noIjazah,
            nilai_un: value?.dataSekolahSebelumnya?.nilaiUN,
          }
        }
        if(this.stepperVal === 4){
          this.tampungStepFour = {
            id_user: value?.idUser,
            no_kk: value?.noKK,
            nama_kk: value?.namaKK,
            nama_ayah: value?.dataOrangtua?.dataAyah?.namaAyah,
            tahun_ayah: value?.dataOrangtua?.dataAyah?.tahunAyah,
            status_ayah: value?.dataOrangtua?.dataAyah?.statusAyah?.value,
            nik_ayah: value?.dataOrangtua?.dataAyah?.nikAyah,
            pendidikan_ayah: value?.dataOrangtua?.dataAyah?.pendidikanAyah?.value,
            pekerjaan_ayah: value?.dataOrangtua?.dataAyah?.pekerjaanAyah?.value,
            telp_ayah: value?.dataOrangtua?.dataAyah?.telpAyah,
            nama_ibu: value?.dataOrangtua?.dataIbu?.namaIbu,
            tahun_ibu: value?.dataOrangtua?.dataIbu?.tahunIbu,
            status_ibu: value?.dataOrangtua?.dataIbu?.statusIbu?.value,
            nik_ibu: value?.dataOrangtua?.dataIbu?.nikIbu,
            pendidikan_ibu: value?.dataOrangtua?.dataIbu?.pendidikanIbu?.value,
            pekerjaan_ibu: value?.dataOrangtua?.dataIbu?.pekerjaanIbu?.value,
            telp_ibu: value?.dataOrangtua?.dataIbu?.telpIbu,
            nama_wali: value?.dataOrangtua?.dataWali?.namaWali,
            tahun_wali: value?.dataOrangtua?.dataWali?.tahunWali,
            nik_wali: value?.dataOrangtua?.dataWali?.nikWali,
            pendidikan_wali: value?.dataOrangtua?.dataWali?.pendidikanWali?.value,
            pekerjaan_wali: value?.dataOrangtua?.dataWali?.pekerjaanWali?.value,
            telp_wali: value?.dataOrangtua?.dataWali?.telpWali,
            penghasilan: value?.penghasilan?.value,
            status_tempat_tinggal: value?.dataLainnya?.statusTempatTinggal?.value,
            jarak_rumah: value?.dataLainnya?.jarakRumah?.value,
            transportasi: value?.dataLainnya?.transportasi?.value,
            telp: value?.dataAlamatOrangtua?.telp,
            alamat: value?.dataAlamatOrangtua?.alamat,
            provinsi: value?.dataAlamatOrangtua?.provinsi?.kode,
            kabkota: value?.dataAlamatOrangtua?.kabKota?.kode,
            kecamatan: value?.dataAlamatOrangtua?.kecamatan?.kode,
            kelurahan: value?.dataAlamatOrangtua?.kelurahan?.kode,
            kode_pos: value?.dataAlamatOrangtua?.kodePos,
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