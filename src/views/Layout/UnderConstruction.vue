<template>
  <div style="height: 100%;">
    <div class="tampil">
      <v-card class="elevation-12 tampilView" color="white">
        <v-img class="gambarUnderConstruction" :src="logoUnderConstruction"/>
        <h3>Halaman ini masih dalam masa pembangunan, ikuti kami untuk pembaharuan halaman ini!</h3>
        <!-- <Button
          router to="/"
          icon-append-button="mdi mdi-arrow-right-thick"
          nama-button="Kembali ke Website"
        /> -->
          <!-- @proses="gotoDashboard()" -->
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "App",
  data: () => ({
    API_URL: process.env.VUE_APP_BASE_URL_VIEW,
  }),
  computed: {
    ...mapGetters({
      cmssettings: 'setting/cmssettings',
    }),
    logoUnderConstruction(){
      return this.cmssettings ? `${this.API_URL}bahan/${this.cmssettings.underconstruction}` : null
    },
  },
  mounted(){
    this.getCMSSettings()
	},
	methods: {
		...mapActions({
      getCMSSettings: 'setting/getCMSSettings',
    }),
    // gotoDashboard(){
    //   let roleID = localStorage.getItem('roleID')
    //   this.$router.push(roleID === '4' ? {name: "Profile"} : {name: "Dashboard"});
    // }
  }
}
</script>

<style scoped>
.tampil {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.tampilView {
  width: 90%;
  max-width: 700px;
  padding: 20px;
  text-align: center;
}
.gambarUnderConstruction {
  height: 50%;
  max-height: 300px;
}
@media screen and (min-width: 1920px) {
  .tampilView {
    max-width: 800px;
    width: 90%;
  }
}
</style>