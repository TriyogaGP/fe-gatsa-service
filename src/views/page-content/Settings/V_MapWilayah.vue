<template>
  <div>
		<h1 class="subheading grey--text">Panel Map Wilayah</h1>
		<v-card class="mt-2 mb-2 pa-1" outlined elevation="0">
			<h5 id="title" class="mb-2 text-center"></h5>
			<svg-map-n
				:map="indonesia"
				/>
				<!-- @click="ViewMap($event)"
				@focus="(e) => { e.target.style.fill = 'green' }"
				@mouseover="(e) => { e.target.style.fill = 'red'; pointLocation(e); }"
				@mouseleave="(e) => { e.target.style.fill = '' }"
				@mouseout="unpointLocation($event)"
				@mousemove="moveOnLocation($event)" -->
			{{ pointedLocation }}
		</v-card>
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
import { mapActions, mapGetters, mapState } from "vuex";
import { useMeta } from 'vue-meta'
import PopUpNotifikasi from "../../Layout/PopUpNotifikasi.vue";
import indonesia from "../../../core/plugins/indonesia.js";
export default {
  name: 'MapWilayah',
	components: { PopUpNotifikasi },
  data: () => ({
		indonesia,
		pointedLocation: null,
		tooltipStyle: null,

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	setup() {
    useMeta({
      title: "Settings (Map Wilayah)",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
  },
	computed: {},
	watch: {},
	mounted() {
		document.getElementById('title').innerHTML = `DNM Mobile Sales on Indonesia`
	},
	methods: {
		ViewMap(e) {
			document.getElementById('title').innerHTML = `Provinsi : ${e.target.ariaLabel}`
			this.getData(e.target.ariaLabel)
		},
		pointLocation(e) {
			this.pointedLocation = `Provinsi : ${e.target.ariaLabel}`
		},
		unpointLocation(e) {
			this.pointedLocation = null
			this.tooltipStyle = { display: 'none' }
		},
		moveOnLocation(e) {
			this.tooltipStyle = {
				display: 'block',
				top: `${e.clientY + 10}px`,
				left: `${e.clientX - 100}px`,
			}
		},
		notifikasi(kode, text, proses){
      this.dialogNotifikasi = true
      this.notifikasiKode = kode
      this.notifikasiText = text
      this.notifikasiButton = proses
    },
	},
}
</script>