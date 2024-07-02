<template>
  <div>
		<h1 class="subheading grey--text text-decoration-underline">Panel Hak Akses</h1>
		<v-data-table
			loading-text="Sedang memuat... Harap tunggu"
			no-data-text="Tidak ada data yang tersedia"
			no-results-text="Tidak ada catatan yang cocok ditemukan"
			:headers="headers"
			:loading="loadingtable"
			:items="DataHakAkses"
			expand-on-click
			item-value="idRole"
			density="comfortable"
			hide-default-footer
			hide-default-header
			class="elavation-3 rounded"
			:items-per-page="itemsPerPage"
			@page-count="pageCount = $event"
			@click:row="clickrow"
			v-model:expanded="expanded"
		>
			<!-- header -->
			<template #headers="{ columns }">
				<tr>
					<td v-for="header in columns" :key="header.title" class="tableHeader">{{ header.title.toUpperCase() }}</td>
				</tr>
			</template>
			<template #loader>
				<LoaderDataTables />
			</template>
			<template #[`item.number`]="{ item }">
				{{ page > 1 ? ((page - 1)*limit) + item.index + 1 : item.index + 1 }}
			</template>
			<template #[`item.status`]="{ item }">
				<v-icon size="small" v-if="item.raw.status == true" color="green" icon="mdi mdi-check" />
				<v-icon size="small" v-else-if="item.raw.status == false" color="red" icon="mdi mdi-close" />
			</template>
			<template #expanded-row="{ columns, item }">
				<tr>
					<td :colspan="columns.length">
						<Button 
							color-button="#0bd369"
							icon-prepend-button="mdi mdi-pencil"
							nama-button="Ubah"
							@proses="bukaDialog(item.raw, 1)"
						/>
						<Button 
							color-button="#0bd369"
							:icon-prepend-button="item.raw.status === false ? 'mdi mdi-eye' : 'mdi mdi-eye-off'"
							:nama-button="item.raw.status === false ? 'Active' : 'Non Active'"
							@proses="postRecord(item.raw, 'STATUSRECORD', !item.raw.status)"
						/>
						<!-- <Button 
							color-button="#bd3a07"
							icon-prepend-button="mdi mdi-delete"
							nama-button="Hapus"
							@proses="postRecord(item.raw, 'DELETE', null)"
						/> -->
					</td>
				</tr>
			</template>
			<template #top>
				<v-row no-gutters class="pa-2">
					<v-col cols="12" md="6">
						<Button 
							color-button="light-blue darken-3"
							icon-prepend-button="mdi mdi-plus-thick"
							nama-button="Tambah"
							@proses="bukaDialog(null, 0)"
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
										getRole({page: 1, limit: limit, keyword: ''})
									}"
									@keyup.enter="() => {
										page = 1
										getRole({page: 1, limit: limit, keyword: searchData})
									}"
								/>
							</v-col>
							<v-col cols="12" md="3" class="pl-2 d-flex justify-end align-center">
								<Autocomplete
									v-model="page"
									:data-a="pageOptions"
									label-a="Page"
									:disabled-a="DataHakAkses.length ? false : true"
								/>
							</v-col>
						</v-row>
					</v-col>
				</v-row>
				<v-divider :thickness="2" class="border-opacity-100" color="white" />
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
								:disabled-a="DataHakAkses.length ? false : true"
							/>
							<Button
								variant="plain"
								size-button="large"
								model-button="comfortable"
								color-button="#ffffff"
								icon-button="mdi mdi-arrow-left-circle-outline"
								:disabled-button="DataHakAkses.length ? pageSummary.page != 1 ? false : true : true"
								@proses="() => { page = pageSummary.page - 1 }"
							/>
							<Button
								variant="plain"
								size-button="large"
								model-button="comfortable"
								color-button="#ffffff"
								icon-button="mdi mdi-arrow-right-circle-outline"
								:disabled-button="DataHakAkses.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
								@proses="() => { page = pageSummary.page + 1 }"
							/>
						</div>
					</v-col>
				</v-row>
			</template>
		</v-data-table>
		<v-dialog
      v-model="DialogRole"
			scrollable
			persistent
			transition="dialog-bottom-transition"
			width="auto"
    >
			<v-card color="background-dialog-card">
				<v-toolbar color="surface">
					<v-toolbar-title>{{editedIndex == 0 ? 'Tambah' : editedIndex == 1 ? 'Ubah' : 'View'}} Data Hak Akses</v-toolbar-title>
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
					<v-row no-gutters>
						<v-col
							cols="12"
							md="4"
							class="pt-2 d-flex align-center font-weight-bold"
						>
							Role Name
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="inputRole.nama_role"
								label-tf="Role Name"
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
export default {
  name: 'HakAkses',
	components: { PopUpNotifikasi },
  data: () => ({
		expanded: [],
		DataHakAkses: [],
		searchData: '',
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
      { title: "STATUS ROLE", key: "status", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		DialogRole: false,
		kondisiTombol: true,
		editedIndex: 0,
		inputRole: {
			id_role: '',
			nama_role: '',
		},

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Settings (Hak Akses)",
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
			roleAll: 'setting/roleAll',
		}),
	},
	watch: {
		roleAll: {
			deep: true,
			handler(value) {
        this.pageOptions = []
				this.DataHakAkses = value.records
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
    inputRole: {
      deep: true,
      handler(value){
				if(value.nama_role == null){ this.inputRole.nama_role = '' }
        if(value.nama_role != ''){
          this.kondisiTombol = false
        }else{
          this.kondisiTombol = true
        }
      }
    },
		page: {
			deep: true,
			handler(value) {
				if(value){
					this.getRole({page: value, limit: this.limit, keyword: this.searchData})
				}
			}
		},
		limit: {
			deep: true,
			handler(value) {
				this.page = 1
				this.getRole({page: 1, limit: value, keyword: this.searchData})
			}
		},
  },
	mounted() {
		this.getRole({page: 1, limit: this.limit, keyword: this.searchData});
	},
	methods: {
		...mapActions({
			getRole: 'setting/getRole',	
		}),
		postRecord(item = null, jenis, status) {
      let bodyData = {
				ADDEDIT: {
					jenis: jenis,
					id_role: jenis === 'ADD' ? '' : this.inputRole.id_role,
					nama_role: this.inputRole.nama_role,
				},
				STATUSDELETE: {
					jenis: jenis,
					id_role: item?.idRole,
					status: status,
				}
      }
      this.$store.dispatch('setting/postRole', jenis === 'ADD' || jenis === 'EDIT' ? bodyData.ADDEDIT : bodyData.STATUSDELETE)
      .then((res) => {
        this.DialogRole = false
        this.getRole({page: 1, limit: this.limit, keyword: this.searchData});
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
		bukaDialog(item, index){
      this.editedIndex = index
      if(index == 0){
        this.inputRole.id_role = ''
        this.inputRole.nama_role = ''
      }else{
				this.inputRole.id_role = item.idRole
        this.inputRole.nama_role = item.namaRole
      }
      this.DialogRole = true
    },
		tutupDialog(){
			this.inputRole.id_role = ''
			this.inputRole.nama_role = ''
			this.DialogRole = false
		},
		clickrow(event, data) {
      const index = this.$data.expanded.find(i => i === data?.item?.raw?.idRole);
      if(typeof index === 'undefined') return this.$data.expanded = [];
      this.$data.expanded.splice(0, 1)
      this.$data.expanded.push(data?.item?.raw?.idRole);
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