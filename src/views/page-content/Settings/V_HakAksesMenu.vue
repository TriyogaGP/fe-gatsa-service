<template>
  <div>
		<h1 class="subheading grey--text">Panel Hak Akses Menu</h1>
		<v-row no-gutters class="pa-2">
			<v-col cols="12" md="6" />
			<v-col cols="12" md="6">
				<v-row no-gutters>
					<v-col cols="12" md="9">
						<Autocomplete
							v-model="searchData"
							icon-prepend-tf="mdi mdi-magnify"
							label-tf="Pencarian..."
							:clearable-tf="true"
							@click:clear="() => { page = 1; getRoleMenu({page: 1, limit: limit, keyword: ''}); }"
							@keyup.enter="(e) => { page = 1; getRoleMenu({page: 1, limit: limit, keyword: e}); }"
						/>
					</v-col>
					<v-col cols="12" md="3" class="pl-2 d-flex justify-end align-center">
						<Autocomplete
							v-model="page"
							:data-a="pageOptions"
							label-a="Page"
							:disabled-a="DataHakAksesMenu.length ? false : true"
						/>
					</v-col>
				</v-row>
			</v-col>
    </v-row>
    <div class="px-1">
			<v-data-table
				loading-text="Sedang memuat... Harap tunggu"
				no-data-text="Tidak ada data yang tersedia"
				no-results-text="Tidak ada catatan yang cocok ditemukan"
				:headers="headers"
				:loading="loadingtable"
				:items="DataHakAksesMenu"
				:expand-on-click="DetailMenu === false ? true : false"
				show-expand
				item-value="idRoleMenu"
				density="comfortable"
				hide-default-footer
				hide-default-header
				class="elavation-3 rounded"
				:items-per-page="itemsPerPage"
				@page-count="pageCount = $event"
			>
				<!-- header -->
				<template #headers="{ columns }">
					<tr>
						<td v-for="header in columns" :key="header.title" class="tableHeader">{{ header.title.toUpperCase() }}</td>
					</tr>
				</template>
				<template #[`item.number`]="{ item }">
					{{ page > 1 ? ((page - 1)*limit) + item.index + 1 : item.index + 1 }}
				</template>
				<template #[`item.menu`]="{ item }">
					<Button 
						color-button="#04f7f7"
						icon-button="mdi mdi-information"
						nama-button="Detail"
						@proses="openDetail(item.raw.menu)"
					/>
				</template>
				<template #expanded-row="{ columns, item }">
					<tr>
						<td :colspan="columns.length">
							<Button 
								color-button="#0bd369"
								icon-button="mdi mdi-pencil"
								nama-button="Ubah"
								@proses="bukaDialog(item.raw)"
							/>
						</td>
					</tr>
				</template>
				<template #bottom>
					<v-divider :thickness="2" class="border-opacity-100" color="white" />
					<v-row no-gutters>
						<v-col cols="10" class="pa-2 d-flex justify-start align-center">
							<span>Halaman <strong>{{ pageSummary.page ? pageSummary.page : 0 }}</strong> dari Total Halaman <strong>{{ pageSummary.totalPages ? pageSummary.totalPages : 0 }}</strong> (Records {{ pageSummary.total ? pageSummary.total : 0 }})</span>
						</v-col>
						<v-col cols="2" class="pa-2 text-right">
							<div class="d-flex justify-start align-center">
								<Autocomplete
									v-model="limit"
									pilihan-a="select"
									:data-a="limitPage"
									label-a="Limit"
									:disabled-a="DataHakAksesMenu.length ? false : true"
								/>
								<Button
									variant="plain"
									size-button="large"
									model-button="comfortable"
									color-button="#ffffff"
									icon-button="mdi mdi-arrow-left-circle-outline"
									:disabled-button="DataHakAksesMenu.length ? pageSummary.page != 1 ? false : true : true"
									@proses="() => { page = pageSummary.page - 1 }"
								/>
								<Button
									variant="plain"
									size-button="large"
									model-button="comfortable"
									color-button="#ffffff"
									icon-button="mdi mdi-arrow-right-circle-outline"
									:disabled-button="DataHakAksesMenu.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
									@proses="() => { page = pageSummary.page + 1 }"
								/>
							</div>
						</v-col>
					</v-row>
				</template>
			</v-data-table>
		</div>
		<v-dialog
      v-model="DialogRoleMenu"
			scrollable
			persistent
			transition="dialog-bottom-transition"
			width="auto"
    >
			<v-card color="background-dialog-card">
				<v-toolbar color="surface">
					<v-toolbar-title>Ubah Data Hak Akses Menu</v-toolbar-title>
					<v-spacer />
					<v-toolbar-items>
						<Button
							variant="plain"
							color-button="#ffffff"
							icon-button="mdi mdi-close"
							model-button="comfortable"
							size-button="large"
							@proses="tutupDialog()"
						/>
					</v-toolbar-items>
				</v-toolbar>
				<v-card-text class="pt-4 v-dialog--custom">
					<v-card
						color="black"
						class="pa-2 mb-2"
						v-for="i in (1 + jumlahMenuHakAkses)"
						:key="i"
					>
						<div class="text-right">
							<Button
								v-if="i !== (1 + jumlahMenuHakAkses)"
								variant="plain"
								color-button="#ffffff"
								icon-button="mdi mdi-close"
								model-button="comfortable"
								size-button="large"
								@proses="removeMenu(i-1)"
							/>
						</div>
						<v-row no-gutters>
							<v-col
								cols="12"
								md="4"
								class="pt-2 d-flex align-center font-weight-bold"
							>
								Menu
							</v-col>
							<v-col
								cols="12"
								md="8"
								class="pt-3"
							>
								<Autocomplete
									v-model="inputTempRoleMenu.menu[i-1]"
									:data-a="menuOptions"
									item-title="menuText"
									item-value="idMenu"
									label-a="Pilih Menu"
									:clearable-a="true"
								/>
									<!-- @update:modelValue="changeData($event, i-1, 'menu')" -->
							</v-col>
						</v-row>
						<v-row no-gutters>
							<v-col
								cols="12"
								md="4"
								class="pt-2 d-flex align-center font-weight-bold"
							>
								Sub Menu
							</v-col>
							<v-col
								cols="12"
								md="8"
								class="pt-3"
							>
								<Autocomplete
									v-model="inputTempRoleMenu.submenu[i-1]"
									:data-a="submenuOptions"
									item-title="menuText"
									item-value="idMenu"
									label-a="Pilih Sub Menu"
									multiple
									chips
									closable-chips
									:clearable-a="true"
								/>
									<!-- @update:modelValue="changeData($event, i-1, 'submenu')" -->
							</v-col>
						</v-row>
						<v-row no-gutters>
							<v-col
								cols="12"
								md="4"
								class="pt-2 d-flex align-center font-weight-bold"
							>
								Kondisi
							</v-col>
							<v-col
								cols="12"
								md="8"
								class="pt-3"
							>
								<Autocomplete
									v-model="inputTempRoleMenu.kondisi[i-1]"
									:data-a="kondisiOptions"
									label-a="Kondisi"
									:clearable-a="true"
								/>
									<!-- @update:modelValue="changeData($event, i-1, 'kondisi')" -->
							</v-col>
						</v-row>
					</v-card>
				</v-card-text>
				<v-divider />
				<v-card-actions>
					<v-row 
						no-gutters
						class="mt-1 mr-3"
					>
						<v-col
							class="text-end"
							cols="12"
						>
							<Button
								color-button="black"
								nama-button="Ubah Data"
								@proses="SimpanForm()"
							/>
						</v-col>
					</v-row>
				</v-card-actions>
      </v-card>
    </v-dialog>
		<v-bottom-sheet
      v-model="DetailMenu"
			scrollable
      persistent
    >
      <v-sheet color="surface" style="font-size: 14px;">
        <div class="text-right">
					<Button
						variant="plain"
						color-button="#ffffff"
						icon-button="mdi mdi-close"
						model-button="comfortable"
						size-button="large"
						@proses="() => { DetailMenu = false; menu = []; }"
					/>
        </div>
        <v-card color="background-dialog-card" class="ma-4 pa-2">
					<div v-if="menu.length" class="customScroll">
						<v-list
							:lines="false"
							density="compact"
							nav
							class="listData"
						>
							<v-list-item
								v-for="val in menu"
								:key="val.idMenu"
							>
								<v-list-item-title>
									<v-icon icon="mdi mdi-square-small" />{{ `${val.menuText} (kondisi = ${val.kondisi})` }}
									<v-list-item
										v-for="v in val.subMenu"
										:key="v.idMenu"
									>
										<v-list-item-title><v-icon icon="mdi mdi-circle-small" />{{ v.menuText }}</v-list-item-title>
									</v-list-item>
								</v-list-item-title>
							</v-list-item>
						</v-list>
						<strong>*NB: jika true submenu dari luar dan jika false submenu dari dalam</strong>
					</div>
					<span v-else>Tidak ada Menu</span>
				</v-card>
      </v-sheet>
    </v-bottom-sheet>
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
        @proses="gotoRefresh"
        @cancel="dialogNotifikasi = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { useMeta } from 'vue-meta'
import PopUpNotifikasiVue from "../../Layout/PopUpNotifikasi.vue";
export default {
  name: 'HakAksesMenu',
	components: { PopUpNotifikasiVue },
  data: () => ({
    isLoading: false,
		DataHakAksesMenu: [],
		searchData: "",
		page: 1,
    pageCount: 0,
    itemsPerPage: 100,
    limit: 20,
		limitPage: [5,10,20,50,100],
		pageOptions: [],
		pageSummary: {
			page: '',
			limit: '',
			total: '',
			totalPages: ''
		},
		headers: [
      { title: "No", key: "number", sortable: false, width: "7%" },
      { title: "#", key: "data-table-expand", sortable: false, width: "5%" },
      { title: "NAMA ROLE", key: "namaRole", sortable: false },
      { title: "MENU", key: "menu", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		menuOptions: [],
		submenuOptions: [],
		menu: [],
		DialogRoleMenu: false,
		DetailMenu: false,
		kondisiTombol: true,
		editedIndex: 0,
		jumlahMenuHakAkses: 0,
		inputTempRoleMenu: {
			id_role: '',
			id_role_menu: '',
			menu: [],
			submenu: [],
			kondisi: [],
		},
		kondisiOptions: [true, false],

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Settings (Hak Akses Menu) - MTsS. SIROJUL ATHFAL",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
  },
	computed: {
		...mapState({
			loadingtable: store => store.setting.loadingtable,
		}),
		...mapGetters({
			menuAll: 'setting/menuAll',
			rolemenuAll: 'setting/rolemenuAll',
		}),
	},
	watch: {
		menuAll: {
			deep: true,
			handler(value) {
				value.map(str => {
					if(str.kategori === 'menu'){
						this.menuOptions.push(str)
					}else if(str.kategori === 'submenu'){
						this.submenuOptions.push(str)
					}
				})
			}
		},
		rolemenuAll: {
			deep: true,
			handler(value) {
        this.pageOptions = []
				this.DataHakAksesMenu = value.records
				this.pageSummary = {
					page: value.pageSummary.page,
					limit: value.pageSummary.limit,
					total: value.pageSummary.total,
					totalPages: value.pageSummary.totalPages
				}
				for (let index = 1; index <= this.pageSummary.totalPages; index++) {
          this.pageOptions.push(index)
        }
			}
		},
		page: {
			deep: true,
			handler(value) {
				this.getRoleMenu({page: value, limit: this.limit, keyword: this.searchData})
			}
		},
		limit: {
			deep: true,
			handler(value) {
				this.page = 1
				this.getRoleMenu({page: 1, limit: value, keyword: this.searchData})
			}
		},
	},
	mounted() {
		this.getRoleMenu({page: 1, limit: this.limit, keyword: this.searchData});
	},
	methods: {
		...mapActions({
			fetchData: 'fetchData',
			getMenu: 'setting/getMenuData',
			getRoleMenu: 'setting/getRoleMenu',
		}),
		bukaDialog(item){
			this.getMenu({pilihan: 'ALL'})
			this.inputTempRoleMenu.id_role = item.idRole
			this.inputTempRoleMenu.id_role_menu = item.idRoleMenu
			this.jumlahMenuHakAkses = item.menu.length
			for (let index = 0; index < (1 + this.jumlahMenuHakAkses); index++) {
				if(index < this.jumlahMenuHakAkses){
					let submenu = item.menu[index].subMenu.map(x => x.idMenu)
					this.inputTempRoleMenu.menu.push(item.menu[index].idMenu)
					this.inputTempRoleMenu.submenu.push(submenu)
					this.inputTempRoleMenu.kondisi.push(item.menu[index].kondisi)
				}else{
					this.inputTempRoleMenu.menu.push(null)
					this.inputTempRoleMenu.submenu.push([])
					this.inputTempRoleMenu.kondisi.push(false)
				}
			}
      this.DialogRoleMenu = true
    },
		tutupDialog(){
			this.inputTempRoleMenu = {
				id_role: '',
				id_role_menu: '',
				menu: [],
				submenu: [],
				kondisi: [],
			},
			this.DialogRoleMenu = false
		},
		changeData(diganti, index, untuk) {
			if(untuk === 'menu') {
				this.inputTempRoleMenu.menu[index] = diganti
			}else if(untuk === 'submenu') {
				this.inputTempRoleMenu.submenu[index] = diganti
			}else if(untuk === 'kondisi') {
				this.inputTempRoleMenu.kondisi[index] = diganti
			}
		},
		removeMenu(index){
			this.inputTempRoleMenu.menu.splice(index, 1)
			this.inputTempRoleMenu.submenu.splice(index, 1)
			this.inputTempRoleMenu.kondisi.splice(index, 1);
			this.jumlahMenuHakAkses = this.inputTempRoleMenu.menu.length - 1
		},
		SimpanForm() {
			const menu = [];
			let total = 1 + this.jumlahMenuHakAkses
			if(this.inputTempRoleMenu.menu.includes(null)) total = total - 1
			for (let index = 0; index < total; index++) {
				let submenu = this.inputTempRoleMenu.submenu[index].map(x => { return { idMenu: x }})
				menu.push({
					idMenu: this.inputTempRoleMenu.menu[index],
					subMenu: submenu,
					kondisi: this.inputTempRoleMenu.kondisi[index],
				});
			}
			let bodyData = {
				id_role_menu: this.inputTempRoleMenu.id_role_menu,
        id_role: this.inputTempRoleMenu.id_role,
        menu: menu.length ? menu : [],
      }
			this.$store.dispatch('setting/postRoleMenu', bodyData)
      .then((res) => {
        this.tutupDialog()
        this.getRoleMenu({page: 1, limit: this.limit, keyword: this.searchData});
        this.notifikasi("success", res.data.message, "2")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
		},
		gotoRefresh(){
      window.location.reload();
    },
		openDetail(item){
			this.menu = item
			this.DetailMenu = true
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

<style scoped>
.customScroll {
  width: 100%;
  height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
}
.customScroll::-webkit-scrollbar {
  width: 16px;
}
.customScroll::-webkit-scrollbar-thumb {
  background-color: #4CAF50;
  border: 5px solid #e1e1f0;
  border-radius: 10rem;
}
.customScroll::-webkit-scrollbar-track {
  position: absolute;
  right: -3rem;
  top: -50rem;
  background: transparent;
}
.listData {
	background-color: #e1e1f0;
	color: black;
	margin: 0px !important;
}
</style>