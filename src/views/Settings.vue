<template>
  <div>
    <h1 class="subheading grey--text text-decoration-underline">Pengaturan</h1>
    <v-card class="mb-2 pa-1 rounded" variant="outlined" elevation="4">
      <v-container fluid>
        <v-row>
          <v-col
            v-for="hasil in pengaturan"
            :key="hasil.link"
            cols="12"
            lg="4"
          >
            <v-card color="white" style="border: 2px solid #000;" @click="LinkRoute(hasil.link)">
              <v-sheet color="green" class="sheetData" elevation="2">
                <v-icon :icon="hasil.icon" size="large" />
              </v-sheet>
              <v-card-actions>
                <v-divider :thickness="2" class="border-opacity-75" />
                <v-card-title class="text-black">{{ hasil.title }}</v-card-title>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
		<v-divider :thickness="2" color="black" class="border-opacity-100" />
		<v-card v-if="settingPanel != 0" class="mt-2 mb-2 pa-1 rounded" variant="outlined" elevation="4">
			<V_GeneralCMS v-if="settingPanel == 1" />
			<V_HakAkses v-if="settingPanel == 2" />
			<V_Menu v-if="settingPanel == 3" />
			<V_HakAksesMenu v-if="settingPanel == 4" />
			<V_RFID v-if="settingPanel == 5" />
			<V_Kelas v-if="settingPanel == 6" />
			<!-- <V_Wilayah v-if="settingPanel == 6" /> -->
			<V_Wilayah2023 v-if="settingPanel == 7" />
			<!-- <V_MapWilayah v-if="settingPanel == 8" /> -->
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