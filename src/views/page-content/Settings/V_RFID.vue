<template>
  <div>
		<h2 class="subheading grey--text text-decoration-underline">Panel RFID Card</h2>
		<v-data-table
			loading-text="Sedang memuat... Harap tunggu"
			no-data-text="Tidak ada data yang tersedia"
			no-results-text="Tidak ada catatan yang cocok ditemukan"
			:headers="headers"
			:loading="loadingtable"
			:items="DataRFIDCard"
			expand-on-click
			item-value="rfid"
			density="comfortable"
			hide-default-footer
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
			<template #[`item.number`]="{ index }">
				{{ page > 1 ? ((page - 1)*limit) + index + 1 : index + 1 }}
			</template>
			<template #[`item.nama`]="{ item }">
				<span v-html="`${uppercaseLetterFirst2(item.nama)} ${item.idUser !== '-' ? item.consumerType === 3 ? '(Guru)' : '(Siswa - Siswi)' : ''}`" />
			</template>
			<template #[`item.status`]="{ item }">
				<v-icon size="small" :color="item.status ? 'green' : 'red'" :icon="item.status ? 'mdi mdi-check' : 'mdi mdi-close'" />
			</template>
			<template #[`item.use`]="{ item }">
				<v-icon size="small" :color="item.use ? 'green' : 'red'" :icon="item.use ? 'mdi mdi-check' : 'mdi mdi-close'" />
			</template>
			<template #expanded-row="{ columns, item }">
				<tr>
					<td :colspan="columns.length">
						<Button 
							color-button="success"
							icon-prepend-button="mdi mdi-pencil"
							nama-button="Ubah"
							size-button="x-small"
							@proses="bukaDialog(item)"
						/>
						<Button 
							color-button="success"
							:icon-prepend-button="!item.status ? 'mdi mdi-eye' : 'mdi mdi-eye-off'"
							:nama-button="!item.status ? 'Active' : 'Non Active'"
							size-button="x-small"
							@proses="postRecord(item, 'STATUSRECORD', !item.status)"
						/>
						<Button 
							color-button="success"
							:icon-prepend-button="!item.use ? 'mdi mdi-check' : 'mdi mdi-close'"
							:nama-button="!item.use ? 'Use' : 'Not Use'"
							:disabled-button="item.idUser !== '-' ? false : true"
							size-button="x-small"
							@proses="postRecord(item, 'USERECORD', !item.use)"
						/>
						<Button 
							color-button="error"
							icon-prepend-button="mdi mdi-delete"
							nama-button="Hapus"
							size-button="x-small"
							@proses="postRecord(item, 'DELETE', null)"
						/>
					</td>
				</tr>
				<tr v-if="inputForm">
					<td :colspan="columns.length">
						<v-row no-gutters>
							<v-col
								cols="12"
								md="4"
								class="pa-1 d-flex align-center font-weight-bold"
							>
								<Autocomplete
									v-model="inputRFID.idUser"
									pilihan-a="autocompleteslot"
									:data-a="pilihanUser"
									item-title="text"
									item-value="value"
									label-a="ID User"
									:clearable-a="true"
								/>
								<Button 
									color-button="light-blue darken-3"
									nama-button="User Register"
									size-button="x-small"
									@proses="postRecord(null, 'EDIT', 0)"
								/>
							</v-col>
						</v-row>
					</td>
				</tr>
			</template>
			<template #top>
				<v-row no-gutters class="pa-2">
					<v-col cols="12" md="6" />
					<v-col cols="12" md="6">
						<TextField
							v-model="searchData"
							icon-prepend-tf="mdi mdi-magnify"
							label-tf="Pencarian..."
							:clearable-tf="true"
							@click:clear="() => {
								page = 1
								getDataRFID({page: 1, limit: limit, keyword: ''})
							}"
							@keyup.enter="() => {
								page = 1
								getDataRFID({page: 1, limit: limit, keyword: searchData})
							}"
						/>
					</v-col>
				</v-row>
				<v-divider :thickness="2" class="border-opacity-100" color="white" />
			</template>
			<template #bottom>
				<v-divider :thickness="2" class="border-opacity-100" color="white" />
				<v-row no-gutters>
					<v-col cols="12" lg="10" class="pa-2 d-flex justify-start align-center">
						<!-- <span>Halaman <strong>{{ pageSummary.page ? pageSummary.page : 0 }}</strong> dari Total Halaman <strong>{{ pageSummary.totalPages ? pageSummary.totalPages : 0 }}</strong> (Records {{ pageSummary.total ? pageSummary.total : 0 }})</span> -->
						<span style="font-size: 10pt;">Halaman</span>
						<div style="width: 100px; margin-left: 3px; margin-right: 3px;">
							<Autocomplete
								v-model="page"
								:data-a="pageOptions"
								label-a="Page"
								:disabled-a="DataRFIDCard.length ? false : true"
							/>
						</div>
						<span style="font-size: 10pt;">dari Total Halaman <strong>{{ pageSummary.totalPages ? pageSummary.totalPages : 0 }}</strong> (Records {{ pageSummary.total ? pageSummary.total : 0 }})</span>
					</v-col>
					<v-col cols="12" lg="2" class="pa-2 text-right">
						<div class="d-flex justify-start align-center">
							<Autocomplete
								v-model="limit"
								pilihan-a="select"
								:data-a="limitPage"
								label-a="Limit"
								:disabled-a="DataRFIDCard.length ? false : true"
							/>
							<Button
								variant="plain"
								size-button="large"
								model-button="comfortable"
								color-button="success"
								icon-button="mdi mdi-arrow-left-circle-outline"
								:disabled-button="DataRFIDCard.length ? pageSummary.page != 1 ? false : true : true"
								@proses="() => { page = pageSummary.page - 1 }"
							/>
							<Button
								variant="plain"
								size-button="large"
								model-button="comfortable"
								color-button="success"
								icon-button="mdi mdi-arrow-right-circle-outline"
								:disabled-button="DataRFIDCard.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
								@proses="() => { page = pageSummary.page + 1 }"
							/>
						</div>
					</v-col>
				</v-row>
			</template>
		</v-data-table>
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
  name: 'RFIDCard',
	components: { PopUpNotifikasi },
  data: () => ({
		expanded: [],
		DataRFIDCard: [],
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
      { title: "ID USER", key: "idUser", sortable: false },
      { title: "NAMA", key: "nama", sortable: false },
      { title: "RFID", key: "rfid", sortable: false },
      { title: "USE", key: "use", sortable: false },
      { title: "STATUS", key: "status", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		inputRFID: {
			idUser: '',
			rfid: '',
		},
		inputForm: false,
		pilihanUser: [],

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Settings (RFID Card)",
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
			rfidAll: 'setting/rfidAll',
      userBroadcastAll: 'setting/userBroadcastAll',
		}),
	},
	watch: {
		rfidAll: {
			deep: true,
			handler(value) {
        this.pageOptions = []
				this.DataRFIDCard = value.records
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
		userBroadcastAll: {
      deep: true,
      handler(value){
				this.pilihanUser = []
        value.map(val => {
          // if(val.group == 'Guru'){
          //   this.pilihanUser.push(val)
          // }else{
          //   this.pilihanUser.push(val)
					// }
					this.pilihanUser.push(val)
        })
      }
    },
		page: {
			deep: true,
			handler(value) {
				if(value){
					this.getDataRFID({page: value, limit: this.limit, keyword: this.searchData})
				}
			}
		},
		limit: {
			deep: true,
			handler(value) {
				this.page = 1
				this.getDataRFID({page: 1, limit: value, keyword: this.searchData})
			}
		},
  },
	mounted() {
		this.getDataRFID({page: 1, limit: this.limit, keyword: this.searchData});
	},
	methods: {
		...mapActions({
			getDataRFID: 'setting/getDataRFID',	
      getUserBroadcast: 'setting/getUserBroadcast',
		}),
		postRecord(item = null, jenis, trig) {
			if(this.inputRFID.idUser === null || this.inputRFID.idUser === '-') return this.notifikasi("warning", "User ID belum di pilih!", "1")
      let bodyData = {
				EDIT: {
					jenis: jenis,
					idUser: this.inputRFID.idUser,
					rfid: this.inputRFID.rfid,
				},
				RECORD: {
					jenis: jenis,
					rfid: item?.rfid,
					status: jenis === 'STATUSRECORD' ? trig : null,
					use: jenis === 'USERECORD' ? trig : null,
				}
      }
      this.$store.dispatch('setting/postDataRFID', jenis === 'EDIT' ? bodyData.EDIT : bodyData.RECORD)
      .then((res) => {
				this.inputForm = false
        this.getDataRFID({page: 1, limit: this.limit, keyword: this.searchData});
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
		bukaDialog(item){
			this.getUserBroadcast({kategori: 'USER', kode: 0})
			this.inputRFID = {
				idUser: item.idUser,
				rfid: item.rfid,
			}
      this.inputForm = true
    },
		clickrow(event, data) {
      const index = this.$data.expanded.find(i => i === data?.item?.rfid);
      if(typeof index === 'undefined') return this.$data.expanded = [];
      this.$data.expanded.splice(0, 1)
      this.$data.expanded.push(data?.item?.rfid);
			this.inputForm = false
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