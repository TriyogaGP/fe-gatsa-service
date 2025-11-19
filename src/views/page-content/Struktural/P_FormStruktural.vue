<template>
  <div>
    <h2 class="subheading grey--text text-decoration-underline">Formulir Struktural</h2>
    <div class="text-right wadah">
      <span class="link" @click="gotolist()">Data Struktural</span>
      <v-icon size="small" class="iconstyle" icon="mdi mdi-menu-right" />
      <span>Formulir Struktural</span>
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
          title="Data Alamat"
          :value="2"
        ></v-stepper-item>

        <v-divider style="border: solid 1px #272727;" />

        <v-stepper-item
          :complete="stepperVal > 3"
          title="Data Kelengkapan"
          :value="3"
        ></v-stepper-item>

        <v-divider style="border: solid 1px #272727;" />

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
      id_user: null,
      nama_lengkap: null,
      username: null,
      email: null,
      password: null,
    },
    tampungStepTwo: {
      id_user: null,
      tempat: null,
      tanggal_lahir: null,
      jenis_kelamin: null,
      agama: null,
      telp: null,
      alamat: null,
      provinsi: null,
      kabkota: null,
      kecamatan: null,
      kelurahan: null,
      kode_pos: null,
    },
    tampungStepThree: {
      id_user: null,
      nomor_induk: null,
      pendidikan_guru: null,
      jabatan_guru: null,
      mengajar_bidang: null,
      mengajar_kelas: null,
      wali_kelas: null,
    },
  }),
  setup() {
    useMeta({
      title: "Formulir Struktural",
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
            tempat: value?.tempat,
            tanggal_lahir: value?.tanggalLahir,
            jenis_kelamin: value?.jenisKelamin,
            agama: value?.agama?.value,
            telp: value?.telp,
            alamat: value?.alamat,
            provinsi: value?.provinsi?.kode,
            kabkota: value?.kabKota?.kode,
            kecamatan: value?.kecamatan?.kode,
            kelurahan: value?.kelurahan?.kode,
            kode_pos: value?.kodePos,
          }
        }
        if(this.stepperVal === 3){
          const mengajar_kelas = value?.mengajarKelas
          this.tampungStepThree = {
            id_user: value?.idUser,
            nomor_induk: value?.nomorInduk,
            pendidikan_guru: value?.pendidikanGuru?.value,
            jabatan_guru: value?.jabatanGuru,
            mengajar_bidang: value?.mengajarBidang,
            mengajar_kelas: (mengajar_kelas || '').split(', ').map(item => item.trim()).filter(item => item),
            wali_kelas: value?.waliKelas,
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