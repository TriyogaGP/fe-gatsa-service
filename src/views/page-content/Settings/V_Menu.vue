<template>
  <div>
		<h1 class="subheading grey--text">Panel Menu</h1>
		<v-row no-gutters class="pa-2">
			<v-col cols="12" md="6">
        <Button 
					color-button="light-blue darken-3"
					icon-button="mdi mdi-plus-thick"
					nama-button="Tambah"
					@proses="bukaDialog(null, 0)"
				/>
				<Button 
					color-button="light-blue darken-3"
					icon-button="mdi mdi-cog-outline"
					nama-button="Sequence Menu"
					@proses="bukaDialogSet()"
				/>
			</v-col>
			<v-col cols="12" md="6">
        <v-row no-gutters>
          <v-col cols="12" md="9">
            <TextField
							v-model="searchData"
							icon-prepend-tf="mdi mdi-magnify"
							label-tf="Pencarian..."
							:clearable-tf="true"
							@click:clear="() => {
								page = 1
								getMenu({page: 1, limit: limit, keyword: ''})
							}"
							@keyup.enter="() => {
								page = 1
								getMenu({page: 1, limit: limit, keyword: searchData})
							}"
						/>
          </v-col>
          <v-col cols="12" md="3" class="pl-2 d-flex justify-end align-center">
            <Autocomplete
							v-model="page"
							:data-a="pageOptions"
							label-a="Page"
							:disabled-a="DataMenu.length ? false : true"
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
				:items="DataMenu"
				expand-on-click
				v-model:expanded="expanded"
				item-value="idMenu"
				density="comfortable"
				hide-default-footer
				hide-default-header
				class="elavation-3 rounded"
				:items-per-page="itemsPerPage"
				@page-count="pageCount = $event"
        @click:row="clickrow"
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
				<template #[`item.menuIcon`]="{ item }">
          <v-icon color="white" :icon="item.raw.menuIcon" />
				</template>
        <template #[`item.statusAktif`]="{ item }">
          <v-icon size="small" v-if="item.raw.statusAktif == true" color="green" icon="mdi mdi-check" />
          <v-icon size="small" v-else-if="item.raw.statusAktif == false" color="red" icon="mdi mdi-close" />
        </template>
        <template #expanded-row="{ columns, item }">
					<tr>
						<td :colspan="columns.length">
							<Button 
								color-button="#0bd369"
								icon-button="mdi mdi-pencil"
								nama-button="Ubah"
								@proses="bukaDialog(item.raw, 1)"
							/>
							<Button 
								color-button="#0bd369"
								:icon-button="item.raw.statusAktif === false ? 'mdi mdi-eye' : 'mdi mdi-eye-off'"
								:nama-button="item.raw.statusAktif === false ? 'Active' : 'Non Active'"
								@proses="postRecord(item.raw, 'STATUSRECORD', !item.raw.statusAktif)"
							/>
							<Button 
								color-button="#bd3a07"
								icon-button="mdi mdi-delete"
								nama-button="Hapus"
								@proses="postRecord(item.raw, 'DELETE', null)"
							/>
						</td>
					</tr>
				</template>
				<template #bottom>
					<v-divider :thickness="2" class="border-opacity-100" color="white" />
					<v-row no-gutters>
						<v-col cols="12" lg="10" class="pa-2 d-flex justify-start align-center">
							<span>Halaman <strong>{{ pageSummary.page ? pageSummary.page : 0 }}</strong> dari Total Halaman <strong>{{ pageSummary.totalPages ? pageSummary.totalPages : 0 }}</strong> (Records {{ pageSummary.total ? pageSummary.total : 0 }})</span>
						</v-col>
						<v-col cols="12" lg="2" class="pa-2 text-right">
							<div class="d-flex justify-start align-center">
								<Autocomplete
									v-model="limit"
									pilihan-a="select"
									:data-a="limitPage"
									label-a="Limit"
									:disabled-a="DataMenu.length ? false : true"
								/>
								<Button
									variant="plain"
									size-button="large"
									model-button="comfortable"
									color-button="#ffffff"
									icon-button="mdi mdi-arrow-left-circle-outline"
									:disabled-button="DataMenu.length ? pageSummary.page != 1 ? false : true : true"
									@proses="() => { page = pageSummary.page - 1 }"
								/>
								<Button
									variant="plain"
									size-button="large"
									model-button="comfortable"
									color-button="#ffffff"
									icon-button="mdi mdi-arrow-right-circle-outline"
									:disabled-button="DataMenu.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
									@proses="() => { page = pageSummary.page + 1 }"
								/>
							</div>
						</v-col>
					</v-row>
				</template>
			</v-data-table>
		</div>
		<v-dialog
      v-model="DialogMenu"
      scrollable
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>{{editedIndex == 0 ? 'Tambah' : editedIndex == 1 ? 'Ubah' : 'View'}} Data Menu</v-toolbar-title>
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
        <v-card-text class="pt-4" style="font-size: 13px;">
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Kategori Menu
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <Autocomplete
                v-model="inputMenu.kategori"
                :data-a="kategoriOptions"
                item-title="text"
                item-value="value"
                label-a="Kategori Menu"
                :clearable-a="true"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Menu Text
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <TextField
                v-model="inputMenu.menu_text"
                label-tf="Menu Text"
                :clearable-tf="true"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Menu Route
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <TextField
                v-model="inputMenu.menu_route"
                label-tf="Menu Route"
                :clearable-tf="true"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Menu Icon
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <TextField
                v-model="inputMenu.menu_icon"
                label-tf="Menu Icon"
                :clearable-tf="true"
              />
            </v-col>
          </v-row>
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
								v-if="editedIndex == 0"
								color-button="black"
								nama-button="Simpan Data"
								:disabled-button="kondisiTombol"
								@proses="postRecord(null, 'ADD', null)"
							/>
							<Button 
								v-if="editedIndex == 1"
								color-button="black"
								nama-button="Ubah Data"
								:disabled-button="kondisiTombol"
								@proses="postRecord(null, 'EDIT', null)"
							/>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
		<v-dialog
      v-model="DialogSet"
      scrollable
      persistent
      transition="dialog-bottom-transition"
      width="auto"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Set Urutan Menu</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { DialogSet = false }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4 v-dialog--custom">
          <v-tabs
            v-model="tab"
            grow
            bg-color="background-dialog-card"
            density="comfortable"
          >
            <v-tab value="menu">
              Menu ({{ Menu.length }})
            </v-tab>
            <v-tab value="submenu">
              SubMenu ({{ SubMenu.length }})
            </v-tab>
          </v-tabs>
          <v-window v-model="tab">
            <v-window-item value="menu">
              <v-card color="background-dialog-card" class="pa-1">
                <v-toolbar color="surface">
                  <v-toolbar-title>Menu</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <Button
                    v-if="!editingMenu"
                    variant="plain"
                    color-button="#ffffff"
                    icon-button="mdi mdi-sort-variant"
                    model-button="comfortable"
                    size-button="large"
                    @proses="actionMenu('edit')"
                  />
                  <Button
                    v-if="editingMenu"
                    variant="plain"
                    color-button="#ffffff"
                    icon-button="mdi mdi-check"
                    model-button="comfortable"
                    size-button="large"
                    @proses="actionMenu('done')"
                  />
                  <Button
                    v-if="editingMenu"
                    variant="plain"
                    color-button="#ffffff"
                    icon-button="mdi mdi-close"
                    model-button="comfortable"
                    size-button="large"
                    @proses="actionMenu('undo')"
                  />
                </v-toolbar>
                <v-divider :thickness="2" color="white" class="border-opacity-100" />
                <v-list two-line>
                  <draggable :list="Menu" v-bind="optionsMenu" class="kotakDrag">
                    <v-list-item v-for="v in Menu" :key="v.idMenu" class="kotak">
                      <template v-slot:prepend>
                        <v-icon :icon="v.menuIcon" />
                      </template>
                      <v-list-item-title>{{ v.menuText }}</v-list-item-title>
                      <v-list-item-subtitle style="color: white !important;">{{ v.menuRoute }}</v-list-item-subtitle>
                    </v-list-item>
                  </draggable>
                </v-list>
              </v-card>
            </v-window-item>
            <v-window-item value="submenu">
              <v-card color="background-dialog-card" class="pa-1">
                <v-toolbar color="surface">
                  <v-toolbar-title>SubMenu</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <Button
                    v-if="!editingMenu"
                    variant="plain"
                    color-button="#ffffff"
                    icon-button="mdi mdi-sort-variant"
                    model-button="comfortable"
                    size-button="large"
                    @proses="actionSubMenu('edit')"
                  />
                  <Button
                    v-if="editingMenu"
                    variant="plain"
                    color-button="#ffffff"
                    icon-button="mdi mdi-check"
                    model-button="comfortable"
                    size-button="large"
                    @proses="actionSubMenu('done')"
                  />
                  <Button
                    v-if="editingMenu"
                    variant="plain"
                    color-button="#ffffff"
                    icon-button="mdi mdi-close"
                    model-button="comfortable"
                    size-button="large"
                    @proses="actionSubMenu('undo')"
                  />
                </v-toolbar>
                <v-divider :thickness="2" color="white" class="border-opacity-100" />
                <v-list two-line>
                  <draggable :list="optionsSubMenu" class="kotakDrag">
                    <v-list-item v-for="v in SubMenu" :key="v.idMenu" class="kotak">
                      <template v-slot:prepend>
                        <v-icon :icon="v.menuIcon" />
                      </template>
                      <v-list-item-title>{{ v.menuText }}</v-list-item-title>
                      <v-list-item-subtitle style="color: white !important;">{{ v.menuRoute }}</v-list-item-subtitle>
                    </v-list-item>
                  </draggable>
                </v-list>
              </v-card>
            </v-window-item>
          </v-window>
        </v-card-text>
        <v-divider />
        <v-card-actions />
      </v-card>
    </v-dialog>
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
import { VueDraggableNext } from 'vue-draggable-next'
export default {
  name: 'Menu',
	components: { PopUpNotifikasiVue, draggable: VueDraggableNext },
  data: () => ({
    tab: "",
		expanded: [],
		DataMenu: [],
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
      { title: "KATEGORI", key: "kategori", sortable: false },
      { title: "NAMA MENU", key: "menuText", sortable: false },
      { title: "NAMA ROUTE", key: "menuRoute", sortable: false },
      { title: "NAMA ICON", key: "menuIcon", sortable: false },
      { title: "STATUS MENU", key: "statusAktif", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		kategoriOptions: [
			{ value: "menu", text: "Menu" },
			{ value: "submenu", text: "SubMenu" },
		],
		DialogMenu: false,
		DialogSet: false,
		kondisiTombol: true,
		editedIndex: 0,
		inputMenu: {
      id_menu: '',
			kategori: null,
			menu_text: '',
			menu_route: '',
			menu_icon: '',
		},
    Menu: [],
    SubMenu: [],
    beforeMenu: null,
		editingMenu: false,
    beforeSubMenu: null,
		editingSubMenu: false,
    
		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Settings (Menu)",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
  },
  computed: {
    ...mapState({
      loadingtable: 'setting/loadingtable',
    }),
    ...mapGetters({
			menuAll: 'setting/menuAll',
			sequencemenuAll: 'setting/sequencemenuAll',
		}),
		optionsMenu () {
			return {
				disabled: !this.editingMenu
			}
		},
		optionsSubMenu () {
			return {
				disabled: !this.editingSubMenu
			}
		}
  },
	watch: {
    menuAll: {
			deep: true,
			handler(value) {
        this.pageOptions = []
				this.DataMenu = value.records
				this.pageSummary = {
					page: value.pageSummary.page,
					limit: value.pageSummary.limit,
					total: value.pageSummary.total,
					totalPages: value.pageSummary.totalPages
				}
        for (let index = 1; index <= this.pageSummary.totalPages; index++) {
          this.pageOptions.push(index)
        }
        this.DataMenu.map(val => { 
          if(val.kategori === 'menu'){
            this.Menu.push(val)
          }else if(val.kategori === 'submenu'){
            this.SubMenu.push(val)
          }
        })
			}
		},
    sequencemenuAll: {
			deep: true,
			handler(value) {
				this.Menu = value.Menu
				this.SubMenu = value.SubMenu
			}
		},
    inputMenu: {
      deep: true,
      handler(value){
				if(value.menu_text == null){ this.inputMenu.menu_text = '' }
				if(value.menu_route == null){ this.inputMenu.menu_route = '' }
				if(value.menu_icon == null){ this.inputMenu.menu_icon = '' }
        
        if(value.kategori != null && value.menu_text != '' && value.menu_icon != ''){
          this.kondisiTombol = false
        }else{
          this.kondisiTombol = true
        }
      }
    },
    page: {
			deep: true,
			handler(value) {
				this.getMenu({page: value, limit: this.limit, keyword: this.searchData})
			}
		},
    limit: {
			deep: true,
			handler(value) {
        this.page = 1
				this.getMenu({page: 1, limit: value, keyword: this.searchData})
			}
		},
  },
	mounted() {
		this.getMenu({page: 1, limit: this.limit, keyword: this.searchData});
	},
	methods: {
		...mapActions({
      getMenu: "setting/getMenuData",
      getSequenceMenu: "setting/getSequenceMenu",
    }),
    postRecord(item = null, jenis, status_aktif) {
      let bodyData = {
				ADDEDIT: {
          jenis: jenis,
          id_menu: jenis === 'ADD' ? '' : this.inputMenu.id_menu,
          kategori: this.inputMenu.kategori,
          menu_text: this.inputMenu.menu_text,
          menu_route: this.inputMenu.menu_route,
          menu_icon: this.inputMenu.menu_icon,
        },
				STATUSDELETE: {
					jenis: jenis,
					id_menu: item?.idMenu,
          status_aktif: status_aktif,
				}
      }
      this.$store.dispatch('setting/postMenuData', jenis === 'ADD' || jenis === 'EDIT' ? bodyData.ADDEDIT : bodyData.STATUSDELETE)
      .then((res) => {
        this.DialogMenu = false
        this.getMenu({page: 1, limit: this.limit, keyword: this.searchData});
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    SimpanSequenceMenu(kategori) {
      this.$store.dispatch('setting/postSequenceMenu', {
        Menu : kategori === 'menu' ? this.Menu : this.SubMenu
      })
      .then((res) => {
        this.getSequenceMenu()
        this.notifikasi("success", res.data.message, "2")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    gotoRefresh(){
      window.location.reload();
    },
		bukaDialog(item, index){
      this.editedIndex = index
      if(index == 0){
        this.inputMenu.id_menu = ''
        this.inputMenu.kategori = null
        this.inputMenu.menu_text = ''
        this.inputMenu.menu_route = ''
        this.inputMenu.menu_icon = ''
      }else{
				this.inputMenu.id_menu = item.idMenu
				this.inputMenu.kategori = item.kategori
        this.inputMenu.menu_text = item.menuText
        this.inputMenu.menu_route = item.menuRoute
        this.inputMenu.menu_icon = item.menuIcon
      }
      this.DialogMenu = true
    },
    bukaDialogSet(){
      this.getSequenceMenu()
      this.DialogSet = true
    },
		tutupDialog(){
			this.inputMenu.id_menu = ''
			this.inputMenu.kategori = null
			this.inputMenu.menu_text = ''
			this.inputMenu.menu_route = ''
			this.inputMenu.menu_icon = ''
			this.DialogMenu = false
		},
    actionMenu (e) {
      if (e === 'edit') {
        this.beforeMenu = Object.assign([],this.Menu)
      }      
      if (e === 'undo') {
        this.Menu = this.beforeMenu
        this.beforeMenu = null
      }
      if (e === 'done') {
        this.SimpanSequenceMenu('menu')
        this.beforeMenu = null
      }
      this.editingMenu = !this.editingMenu
    },
    actionSubMenu (e) {
      if (e === 'edit') {
        this.beforeSubMenu = Object.assign([],this.SubMenu)
      }      
      if (e === 'undo') {
        this.SubMenu = this.beforeSubMenu
        this.beforeSubMenu = null
      }
      if (e === 'done') {
        this.SimpanSequenceMenu('submenu')
        this.beforeSubMenu = null
      }
      this.editingSubMenu = !this.editingSubMenu
    },
    clickrow(event, data) {
      const index = this.$data.expanded.find(i => i === data?.item?.raw?.idMenu);
      if(typeof index === 'undefined') return this.$data.expanded = [];
      this.$data.expanded.splice(0, 1)
      this.$data.expanded.push(data?.item?.raw?.idMenu);
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
.v-tab {
	font-size: 8pt !important;
	font-weight: bold !important;
}
.kotak {
	border: 2px dashed #000;
	border-radius: 10px;
	text-align: justify;
	background: rgb(98, 97, 97);
	color: rgb(255, 255, 255) !important;
	margin: 2px;
  /* padding: 2px; */
  font-size: 12pt;
}
.kotakDrag {
  border: 2px solid #000;
	border-radius: 10px;
  background: rgb(98, 97, 97);
	margin: 2px;
  color: rgb(255, 255, 255) !important;
  font-size: 12pt;
}
</style>