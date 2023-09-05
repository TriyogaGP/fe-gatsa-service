<template>
  <div>
    <h1 class="subheading grey--text">Formulir Struktural</h1>
    <div class="text-right wadah">
      <span class="link" @click="gotolist()">Data Struktural</span>
      <v-icon size="small" class="iconstyle" icon="mdi mdi-menu-right" />
      <span>Formulir Struktural</span>
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
          title="Data Alamat"
          :value="2"
        ></v-stepper-item>

        <v-divider></v-divider>

        <v-stepper-item
          :complete="stepperVal > 3"
          title="Data Kelengkapan"
          :value="3"
        ></v-stepper-item>

        <v-divider></v-divider>

        <v-stepper-item
          title="Preview Formulir"
          :value="4"
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
          <C_DataAlamat 
            :stepper-val="stepperVal"
            :data-step-two="tampungStepTwo"
            @backStep="backStep(2)"
            @StepTwo="nextStep(2)"
          />
        </v-stepper-window-item>

        <v-stepper-window-item :value="3">
          <C_DataKelengkapan 
            :stepper-val="stepperVal"
            :data-step-three="tampungStepThree"
            @backStep="backStep(3)"
            @StepThree="nextStep(3)"
          />
        </v-stepper-window-item>

        <v-stepper-window-item :value="4">
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
import C_DataAlamat from "./content/C_DataAlamat.vue";
import C_DataKelengkapan from "./content/C_DataKelengkapan.vue";
import C_PreviewFormulir from "./content/C_PreviewFormulir.vue";
export default {
  name: 'FormulirStruktural',
  components: {
    C_DataLogin,
    C_DataAlamat,
    C_DataKelengkapan,
    C_PreviewFormulir
  },
  data: () => ({
    stepperVal: 1,
    steps: 4,
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
      tempat: '',
      tanggal_lahir: '',
      jenis_kelamin: null,
      agama: null,
      telp: '',
      alamat: '',
      provinsi: null,
      kabkota: null,
      kecamatan: null,
      kelurahan: null,
      kode_pos: '',
    },
    tampungStepThree: {
      id_user: '',
      nomor_induk: '',
      pendidikan_guru: null,
      jabatan_guru: null,
      mengajar_bidang: null,
      mengajar_kelas: null,
      wali_kelas: null,
    },
  }),
  setup() {
    useMeta({
      title: "Formulir Struktural - MTsS. SIROJUL ATHFAL",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
  },
  computed: {
    ...mapGetters({
      strukturalBy: 'user/strukturalBy',
    })
  },
  watch: {
    stepperVal(n, o) {
      if (n !== o) {
        window.scrollTo(0, 0);
      }

      if (n != o && n == 4) {
        this.lazyStep2 = true;
      } else {
        this.lazyStep2 = false;
      }
    },
    strukturalBy: {
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
            tempat: value.tempat ? value.tempat : '',
            tanggal_lahir: value.tanggalLahir ? value.tanggalLahir : '',
            jenis_kelamin: value.jenisKelamin ? value.jenisKelamin : null,
            agama: value.agama ? value.agama : null,
            telp: value.telp ? value.telp : '',
            alamat: value.alamat ? value.alamat : '',
            provinsi: value.provinsi ? value.provinsi : null,
            kabkota: value.kabKota ? value.kabKota : null,
            kecamatan: value.kecamatan ? value.kecamatan : null,
            kelurahan: value.kelurahan ? value.kelurahan : null,
            kode_pos: value.kodePos ? value.kodePos : '',
          }
        }
        if(this.stepperVal === 3){
          this.tampungStepThree = {
            id_user: value.idUser ? value.idUser : '',
            nomor_induk: value.nomorInduk ? value.nomorInduk : '',
            pendidikan_guru: value.pendidikanGuru ? value.pendidikanGuru : null,
            jabatan_guru: value.jabatanGuru ? value.jabatanGuru : null,
            mengajar_bidang: value.mengajarBidang ? value.mengajarBidang : null,
            mengajar_kelas: value.mengajarKelas ? value.mengajarKelas : null,
            wali_kelas: value.waliKelas ? value.waliKelas : null,
          }
        }
      },
    }
  },
  mounted() {
    // let uid = this.$route.params.uid;
    if(this.$route.params.kondisi === 'EDIT') return this.getStrukturalbyUID(this.$route.params.uid)
  },
	methods: {
		...mapActions({
      getStrukturalbyUID: 'user/getStrukturalbyUID',
    }),
    gotolist() {
      localStorage.removeItem('stepOne')
      localStorage.removeItem('stepTwo')
      localStorage.removeItem('stepThree')
      this.$router.push({name: "DataStruktural"});
    },
    nextStep(step) {
      this.stepperVal = step + 1;
      if(this.$route.params.kondisi === 'EDIT') return this.getStrukturalbyUID(this.$route.params.uid)
    },
    backStep(step) {
      this.stepperVal = step - 1;
      if(this.$route.params.kondisi === 'EDIT') return this.getStrukturalbyUID(this.$route.params.uid)
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