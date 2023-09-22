<template>
  <div>
		<h1 class="subheading grey--text">Panel RFID Card</h1>
		<v-row no-gutters class="pa-2">
			<v-col cols="12" md="6" />
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
								getDataRFID({page: 1, limit: limit, keyword: ''})
							}"
							@keyup.enter="() => {
								page = 1
								getDataRFID({page: 1, limit: limit, keyword: searchData})
							}"
						/>
					</v-col>
					<v-col cols="12" md="3" class="pl-2 d-flex justify-end align-center">
						<Autocomplete
							v-model="page"
							:data-a="pageOptions"
							label-a="Page"
							:disabled-a="DataRFIDCard.length ? false : true"
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
				:items="DataRFIDCard"
				expand-on-click
				v-model:expanded="expanded"
				item-value="rfid"
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
				<template #[`item.nama`]="{ item }">
					<span v-html="`${uppercaseLetterFirst2(item.raw.nama)} ${item.raw.idUser !== '-' ? item.raw.consumerType === 3 ? '(Guru)' : '(Siswa - Siswi)' : ''}`" /><br>
				</template>
				<template #[`item.status`]="{ item }">
					<v-icon size="small" v-if="item.raw.status == true" color="green" icon="mdi mdi-check" />
					<v-icon size="small" v-else-if="item.raw.status == false" color="red" icon="mdi mdi-close" />
				</template>
				<template #[`item.use`]="{ item }">
					<v-icon size="small" v-if="item.raw.use == true" color="green" icon="mdi mdi-check" />
					<v-icon size="small" v-else-if="item.raw.use == false" color="red" icon="mdi mdi-close" />
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
							<Button 
								color-button="#0bd369"
								:icon-button="item.raw.status === false ? 'mdi mdi-eye' : 'mdi mdi-eye-off'"
								:nama-button="item.raw.status === false ? 'Active' : 'Non Active'"
								@proses="postRecord(item.raw, 'STATUSRECORD', !item.raw.status)"
							/>
							<Button 
								color-button="#0bd369"
								:icon-button="item.raw.use === false ? 'mdi mdi-check' : 'mdi mdi-close'"
								:nama-button="item.raw.use === false ? 'Use' : 'Not Use'"
								:disabled-button="item.raw.idUser !== '-' ? false : true"
								@proses="postRecord(item.raw, 'USERECORD', !item.raw.use)"
							/>
							<Button 
								color-button="#bd3a07"
								icon-button="mdi mdi-delete"
								nama-button="Hapus"
								@proses="postRecord(item.raw, 'DELETE', null)"
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
										@proses="postRecord(null, 'EDIT', 0)"
									/>
								</v-col>
							</v-row>
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
									:disabled-a="DataRFIDCard.length ? false : true"
								/>
								<Button
									variant="plain"
									size-button="large"
									model-button="comfortable"
									color-button="#ffffff"
									icon-button="mdi mdi-arrow-left-circle-outline"
									:disabled-button="DataRFIDCard.length ? pageSummary.page != 1 ? false : true : true"
									@proses="() => { page = pageSummary.page - 1 }"
								/>
								<Button
									variant="plain"
									size-button="large"
									model-button="comfortable"
									color-button="#ffffff"
									icon-button="mdi mdi-arrow-right-circle-outline"
									:disabled-button="DataRFIDCard.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
									@proses="() => { page = pageSummary.page + 1 }"
								/>
							</div>
						</v-col>
					</v-row>
				</template>
			</v-data-table>
		</div>
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
  name: 'RFIDCard',
	components: { PopUpNotifikasiVue },
  data: () => ({
		expanded: [],
		DataRFIDCard: [],
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
				this.getDataRFID({page: value, limit: this.limit, keyword: this.searchData})
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
      const index = this.$data.expanded.find(i => i === data?.item?.raw?.rfid);
      if(typeof index === 'undefined') return this.$data.expanded = [];
      this.$data.expanded.splice(0, 1)
      this.$data.expanded.push(data?.item?.raw?.rfid);
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