<template>
  <div>
    <h2 class="subheading grey--text text-decoration-underline">Pengaturan</h2>
    <v-card class="mb-2 pa-1 rounded" variant="outlined" elevation="4">
      <v-tabs
        v-model="tab"
        align-tabs="center"
        color="#4CAF50"
        bg-color="surface"
        slider-color="#4CAF50"
        density="compact"
        show-arrows
        stacked
      >
        <v-tab
          v-for="hasil in pengaturan"
          :key="hasil.link"
          :value="hasil.link"
        >
          <v-icon :icon="hasil.icon" size="large" />
          {{ hasil.title }}
        </v-tab>
      </v-tabs>
      <v-divider :thickness="3" color="#4CAF50" class="border-opacity-100" />
      <v-tabs-window v-model="tab">
        <v-tabs-window-item
          v-for="n in pengaturan.length"
          :key="n"
          :value="n"
        >
          <V_GeneralCMS v-if="n == 1" />
          <V_HakAkses v-if="n == 2" />
          <V_Menu v-if="n == 3" />
          <V_HakAksesMenu v-if="n == 4" />
          <V_RFID v-if="n == 5" />
          <V_Kelas v-if="n == 6" />
          <V_Wilayah2023 v-if="n == 7" />
        </v-tabs-window-item>
      </v-tabs-window>
		</v-card>
  </div>
</template>

<script>
import { useMeta } from 'vue-meta'
import V_GeneralCMS from './page-content/Settings/V_GeneralCMS.vue'
import V_HakAkses from './page-content/Settings/V_HakAkses.vue'
import V_Menu from './page-content/Settings/V_Menu.vue'
import V_HakAksesMenu from './page-content/Settings/V_HakAksesMenu.vue'
import V_RFID from './page-content/Settings/V_RFID.vue'
import V_Kelas from './page-content/Settings/V_Kelas.vue'
import V_Wilayah from './page-content/Settings/V_Wilayah.vue'
import V_Wilayah2023 from './page-content/Settings/V_Wilayah2023.vue'
import V_MapWilayah from './page-content/Settings/V_MapWilayah.vue'

export default {
	name: "Pengaturan",
	components: { V_GeneralCMS, V_HakAkses, V_Menu, V_HakAksesMenu, V_RFID, V_Kelas, V_Wilayah, V_Wilayah2023, V_MapWilayah },
	data: () => ({
		tab: null,
		settingPanel: 0,
    pengaturan: [
      { title: 'General CMS', icon: 'mdi mdi-wrench-cog', link: 1 },
      { title: 'Hak Akses', icon: 'mdi mdi-shield-account-variant', link: 2 },
      { title: 'Menu', icon: 'mdi mdi-view-list', link: 3 },
      { title: 'Hak Akses Menu', icon: 'mdi mdi-shield-account-variant', link: 4 },
      { title: 'RFID Card', icon: 'mdi mdi-id-card', link: 5 },
      { title: 'Kelas', icon: 'mdi mdi-view-list', link: 6 },
      { title: 'Wilayah', icon: 'mdi mdi-map', link: 7 },
      // { title: 'Map Wilayah', icon: 'mdi mdi-map', link: 8 },
    ]
	}),
	mounted() {
		this.settingPanel = 1
	},
  setup() {
    useMeta({
      title: "Settings",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
  },
	methods:{
		LinkRoute(number){
			this.settingPanel = number
		}
	}
}
</script>
<style>
.judul {
  font-size: 10pt !important;
  font-weight: bold;
  letter-spacing: 0.1666666667em !important;
  line-height: 2rem;
  text-transform: uppercase;
  font-family: "Roboto", sans-serif !important;
}
</style>