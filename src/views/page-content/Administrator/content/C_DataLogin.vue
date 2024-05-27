<template>
  <div>
		<v-card class="mb-0 pa-8" outlined elevation="0">
			<h2 class="subheading black--text"><u>>>Data Log In</u></h2>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Consumer Type
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<Autocomplete
						v-model="inputDataLogIn.level"
						:data-a="levelOptions"
						item-title="title"
						item-value="value"
						label-a="Consumer Type"
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
					Nama Lengkap
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<TextField
						v-model="inputDataLogIn.nama_lengkap"
						label-tf="Nama Lengkap"
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
					Username
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<TextField
						v-model="inputDataLogIn.username"
						label-tf="Username"
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
					Email
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<TextField
						v-model="inputDataLogIn.email"
						label-tf="Email"
						:rules-tf="inputDataLogIn.email != '' ? true : false"
						hide-details="auto"
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
					Kata Sandi
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<TextField
						v-model="inputDataLogIn.password"
						:slot-tf="true"
						label-tf="Kata Sandi"
						:type-tf="passType ? 'text' : 'password'"
						:icon-append-tf="passType ? 'mdi mdi-eye-lock' : 'mdi mdi-eye-lock-open'"
						:clearable-tf="true"
						@prosesicon="onClickVisible('passType')"
					/>
				</v-col>
			</v-row>
		</v-card>
		<v-row no-gutters>
			<v-col cols="12" class="float-right">
				<Button
					class="float-right mt-3 white--text text--darken-2"
					color-button="#00479b"
					nama-button="Selanjutnya"
					:disabled-button="kondisiTombol"
					@proses="stepOne()"
				/>
				<Button
					class="float-right mr-4 mt-3"
					color-button="#9b1f15"
					nama-button="Kembali Ke List"
					@proses="gotolist()"
				/>
			</v-col>
		</v-row>
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
import { mapActions } from "vuex";
import PopUpNotifikasi from "../../../Layout/PopUpNotifikasi.vue";
export default {
	components: {
    PopUpNotifikasi
  },
	props: {
    stepperVal: {
      type: Number,
      default: null
    },
    dataStepOne: Object,
  },
  data: () => ({
		inputDataLogIn: {
      id_user: '',
      level: null,
      nama_lengkap: '',
      username: '',
      email: '',
      password: '',
    },
    levelOptions: [
			{ title: 'Super Administrator', value: 1 },
			{ title: 'Administrator', value: 2 },
		],
    passType: '',
    endecryptType: '',
    kondisi: '',
    kondisiTombol: true,

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	watch: {
		inputDataLogIn: {
			deep: true,
			handler(value) {
				if(value.nama_lengkap != '' && value.username != '' && value.email != '' && value.password != ''){
					this.kondisiTombol = false
				}else{
					this.kondisiTombol = true
				}
				localStorage.setItem('stepOne', JSON.stringify(this.inputDataLogIn))
				// this.wadahInput()
			}
		},
		dataStepOne: {
			deep: false,
			handler(value) {
				this.inputDataLogIn = {
					id_user: value.id_user ? value.id_user : null,
					level: value.level ? value.level : null,
					nama_lengkap: value.nama_lengkap ? value.nama_lengkap : null,
					username: value.username ? value.username : null,
					email: value.email ? value.email : null,
					password: value.password ? value.password : null,
				}
				this.endecryptData()
			}
		},
	},
	mounted() {
		this.inputDataLogIn.id_user = this.$route.params.uid;
		this.kondisi = this.$route.params.kondisi;
	},
	methods: {
		...mapActions({
			fetchData: 'fetchData',
    }),
		wadahInput(){
			let inputFormOne = {
				idUser: this.inputDataLogIn.id_user,
				consumerType: this.inputDataLogIn.level,
				nama: this.inputDataLogIn.nama_lengkap,
				username: this.inputDataLogIn.username,
				email: this.inputDataLogIn.email,
				password: this.inputDataLogIn.password,
			}
      this.$emit("DataStepOne", inputFormOne)
    },
		onClickVisible(d) {
      this[d] = !this[d]
    },
    endecryptData() { 
      let payload = {
				method: "get",
				url: `settings/decryptPass?kata=${this.inputDataLogIn.password}`,
				authToken: localStorage.getItem('user_token')
			};
      this.inputDataLogIn.password = ''
			this.fetchData(payload)
			.then((res) => {
				this.inputDataLogIn.password = res.data.result.hasil;
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
		gotolist() {
      this.$emit("BackToList");
    },
		stepOne() {
			this.$emit("StepOne");
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

<style>

</style>