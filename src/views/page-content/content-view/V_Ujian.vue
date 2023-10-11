<template>
  <div>
		<div class="kotakatas">
			<div class="timer">
				<CountDown
					:starttime="starttime" 
					:endtime="endtime" 
					:kondisi="timerKondisi"
					@selesaiwaktu="valuesData"
					trans='{  
						"day":"Hari",
						"hours":"Jam",
						"minutes":"Menit",
						"seconds":"Detik",
						"expired":"Event has been expired.",
						"running":"Till the end of event.",
						"upcoming":"Till start of event.",
						"status": {
							"expired":"Expired",
							"running":"Running",
							"upcoming":"Future"
						}}'
				/>
			</div>
		</div>
		<v-row>
			<v-col cols="12" class="kotakawal">
				<v-expansion-panels class="kotakexpand">
					<v-expansion-panel title="Panel Jawaban">
						<template v-slot:text>
							<div class="panelScroll">
								<h3 style="text-decoration: overline underline;">Pilihan Ganda</h3>
								<v-row v-if="jawabanPilihanTemp.length" no-gutters>
									<v-col cols="12" lg="2" class="d-flex flex-row justify-center align-center" v-for="(data, index) in jawabanPilihanTemp" :key="data.kode">
										<div class="lingkaran" :style="!data.jawaban ? 'background-color: red;' : 'background-color: green;'">{{ (index+1) }}</div>
									</v-col>
								</v-row>
								<v-divider v-if="jawabanMenjodohkanTemp.length" :thickness="2" class="border-opacity-100 mt-3 mb-3" />
								<h3 style="text-decoration: overline underline;">Menjodohkan</h3>
								<v-row v-if="jawabanMenjodohkanTemp.length" no-gutters>
									<v-col cols="12" lg="2" class="d-flex flex-row justify-center align-center" v-for="(data, index) in jawabanMenjodohkanTemp" :key="data.kode">
										<div class="lingkaran" :style="!data.jawaban ? 'background-color: red;' : 'background-color: green;'">{{ (index+1) + jawabanPilihanTemp.length }}</div>
									</v-col>
								</v-row>
								<v-divider v-if="jawabanBenarSalahTemp.length" :thickness="2" class="border-opacity-100 mt-3 mb-3" />
								<h3 style="text-decoration: overline underline;">Benar Salah</h3>
								<v-row v-if="jawabanBenarSalahTemp.length" no-gutters>
									<v-col cols="12" lg="2" class="d-flex flex-row justify-center align-center" v-for="(data, index) in jawabanBenarSalahTemp" :key="data.kode">
										<div class="lingkaran" :style="!data.jawaban ? 'background-color: red;' : 'background-color: green;'">{{ (index+1) + jawabanPilihanTemp.length + jawabanMenjodohkanTemp.length }}</div>
									</v-col>
								</v-row>
								<v-divider v-if="jawabanEssayTemp.length" :thickness="2" class="border-opacity-100 mt-3 mb-3" />
								<h3 style="text-decoration: overline underline;">Essay</h3>
								<v-row v-if="jawabanEssayTemp.length" no-gutters>
									<v-col cols="12" lg="2" class="d-flex flex-row justify-center align-center" v-for="(data, index) in jawabanEssayTemp" :key="data.kode">
										<div class="lingkaran" :style="!data.jawaban ? 'background-color: red;' : 'background-color: green;'">{{ (index+1) + jawabanPilihanTemp.length + jawabanMenjodohkanTemp.length + jawabanBenarSalahTemp.length }}</div>
									</v-col>
								</v-row>
							</div>
						</template>
					</v-expansion-panel>
				</v-expansion-panels>
			</v-col>
		</v-row>
		<v-card class="pa-1 rounded wadahbawah" variant="outlined" elevation="4">
			<v-row no-gutters>
				<v-col cols="2" class="logo">
					<img :src="logoSekolah" width="100" />
				</v-col>
				<v-col cols="8" class="kepalasoal">
					<p class="namasekolah">{{ cmssettings?.namasekolah }}</p>
					<p class="alamat">{{ `${cmssettings?.alamat} ${cmssettings?.kelurahan.label} ${cmssettings?.kecamatan.label} ${cmssettings?.kabupatenkota.label} ${cmssettings?.kodepos}` }}</p>
					<p class="alamat">{{ `Phone ${cmssettings?.telepon}` }}</p>
				</v-col>
				<v-col cols="2" />
			</v-row>
			<v-divider :thickness="2" class="border-opacity-100" />
			<v-row no-gutters>
				<v-col cols="12" class="kepalasoal">
					<p class="kop">{{ cmssettings?.jenisraport.label }}</p>
					<p class="kop">{{ cmssettings?.tahunpelajaran }}</p>
				</v-col>
			</v-row>
			<div class="kotakinfo">
				<!-- ini informasi -->
				<p style="font-weight: bold; font: 15px;">Petunjuk:</p>
				<ol>
					<li>Awalan dengan membaca basmalah dan ahkiri dengan hamdalah.</li>
					<li>Perikasalah dan bacalah soal – soal sebelum anda menjawab.</li>
					<li>Laporkan kepada pengawas ujian jika ingin menanyakan sesuatu.</li>
					<li>Dahulukan mengerjakan soal-soal yang dianggap mudah.</li>
					<li>Pilihlah salah satu jawaban yang paling benar dengan memilih pilihan a, b, c, d, atau e.</li>
					<li>Periksalah seluruh pekerjaan anda sebelum diserahkan kepada pengawas.</li>
				</ol>
			</div>
			<table border="0" width="100%" cellspacing="0" cellpadding="0">
				<tr>
					<td width="14%" class="texttitle">Nama Sekolah</td>
					<td width="30%" class="textdes">: {{ cmssettings?.namasekolah }}</td>
					<td width="18%">&nbsp;</td>
					<td width="16%" class="texttitle">Kelas</td>
					<td width="20%" class="textdes">: {{ previewData.kelas }}</td>
				</tr>
				<tr>
					<td width="14%" class="texttitle">Nomor Induk</td>
					<td width="30%" class="textdes">: {{ previewData.nomorInduk }}</td>
					<td width="18%">&nbsp;</td>
					<td width="16%" class="texttitle">Semester</td>
					<td width="20%" class="textdes">: {{ cmssettings?.semester.label }}</td>
				</tr>
				<tr>
					<td width="14%" class="texttitle">Nama Siswa/i</td>
					<td width="30%" class="textdes">: {{ previewData.nama }}</td>
					<td width="18%">&nbsp;</td>
					<td width="16%" class="texttitle">Tahun Pelajaran</td>
					<td width="20%" class="textdes">: {{ cmssettings?.tahunpelajaran }}</td>
				</tr>
			</table>
			<v-divider :thickness="2" class="border-opacity-100" />
			<!-- Panel Soal -->
			<div v-if="soal.jmlpilihanganda > 0">
				<p class="point">I. Pilihlah jawaban yang paling tepat!</p>
				<div style="margin-left: 15px;">
					<table class="kotaksoal" v-for="(index) in soal.jmlpilihanganda" :key="index" border="0" width="100%" cellspacing="0" cellpadding="0">
						<tr>
							<td width="2%" style="vertical-align: top; font-weight: bold;">{{ `${index}.` }}</td>
							<td style="font-weight: 500;">
								<div v-if="!soal.pilihanganda[index-1].pertanyaan.file">
									<span v-html="soal.pilihanganda[index-1].pertanyaan.text" />
								</div>
								<div v-else>
									<v-img :src="`${API_URL}berkas/${soal.pilihanganda[index-1].pertanyaan.file}`" width="100" />
									<span v-html="soal.pilihanganda[index-1].pertanyaan.text" />
								</div>
							</td>
						</tr>
						<tr>
							<td />
							<td>
								<v-radio-group
									v-model="jawabanPilihanTemp[index-1].jawaban"
									v-for="(datapilihan, i) in soal.pilihanganda[index-1].pilihan"
									:key="datapilihan.kode"
									column
									hide-details
								>
									<!-- @change="pilihanJawaban($event, soal.pilihanganda[index-1].kode)" -->
									<v-radio :value="datapilihan.value">
										<template v-slot:label>
											<span style="width: 25px;">{{ `${pilihan[i]}.` }}</span>
											<div v-if="!datapilihan.file">
												<span v-html="datapilihan.text" />
											</div>
											<div v-else>
												<v-img :src="`${API_URL}berkas/${datapilihan.file}`" width="100" style="margin-bottom: 2px;" />
												<span v-html="datapilihan.text" />
											</div>
										</template>
									</v-radio>
								</v-radio-group>
							</td>
						</tr>
					</table>
				</div>
			</div>
			<div v-if="soal.jmlmenjodohkan > 0">
				<p class="point">II. Menjodohkan!</p>
				<div class="kotaksoal" style="margin-left: 15px;">
					<table class="tabelJodoh" border="1" width="100%" cellspacing="0" cellpadding="0">
						<tr style="text-align: center; vertical-align: middle; font-weight: bold;">
							<td width="2%">No</td>
							<td>Pernyataan / Jawaban</td>
							<td width="10%" v-for="(index) in soal.jmlmenjodohkan" :key="index">
								<div v-if="!soal.menjodohkan[index-1].pilihan[index-1].file">
									<span v-html="soal.menjodohkan[index-1].pilihan[index-1].text" />
								</div>
								<div v-else>
									<v-img :src="`${API_URL}berkas/${soal.menjodohkan[index-1].pilihan[index-1].file}`" width="100" />
									<span v-html="soal.menjodohkan[index-1].pilihan[index-1].text" />
								</div>
							</td>
						</tr>
						<tr v-for="(x) in soal.jmlmenjodohkan" :key="x">
							<td width="2%" style="vertical-align: middle; text-align: center; font-weight: bold;">{{ `${x+soal.jmlpilihanganda}.` }}</td>
							<td style="vertical-align: middle; font-weight: bold;">
								<div v-if="!soal.menjodohkan[x-1].pertanyaan.file">
									<span v-html="soal.menjodohkan[x-1].pertanyaan.text" />
								</div>
								<div v-else>
									<v-img :src="`${API_URL}berkas/${soal.menjodohkan[x-1].pertanyaan.file}`" width="100" />
									<span v-html="soal.menjodohkan[x-1].pertanyaan.text" />
								</div>
							</td>
							<td style="font-weight: 500;" v-for="(dataPilihan, k) in soal.menjodohkan[x-1].pilihan" :key="k">
								<v-radio-group
									v-model="jawabanMenjodohkanTemp[x-1].jawaban"
									column
									hide-details
								>
									<v-radio :value="dataPilihan.value">
										<template v-slot:label>
											<!-- <span style="width: 25px;">{{ dataPilihan.value }}</span> -->
										</template>
									</v-radio>
								</v-radio-group>	
							</td>
						</tr>
					</table>
				</div>
			</div>
			<div v-if="soal.jmlbenarsalah > 0">
				<p class="point">III. Pilihlah Benar (B) atau Salah (S) pada pernyataan yang paling tepat!</p>
				<div style="margin-left: 15px;">
					<table class="kotaksoal" v-for="(index) in soal.jmlbenarsalah" :key="index" border="0" width="100%" cellspacing="0" cellpadding="0">
						<tr>
							<td width="2%" style="vertical-align: top; font-weight: bold;">{{ `${index+soal.jmlpilihanganda+soal.jmlmenjodohkan}.` }}</td>
							<td style="font-weight: 500;"><span v-html="soal.benarsalah[index-1].pertanyaan.text" /></td>
						</tr>
						<tr>
							<td />
							<td>
								<v-radio-group
									v-model="jawabanBenarSalahTemp[index-1].jawaban"
									v-for="(datapilihan) in soal.benarsalah[index-1].pilihan"
									:key="datapilihan.kode"
									column
									hide-details
								>
									<v-radio :value="datapilihan.value">
										<template v-slot:label>
											<span>{{ datapilihan.text }}</span>
										</template>
									</v-radio>
								</v-radio-group>
							</td>
						</tr>
					</table>
				</div>
			</div>
			<div v-if="soal.jmlessay > 0">
				<p class="point">IV. Jawablah pertanyaan ini dengan benar!</p>
				<div style="margin-left: 15px;">
					<table class="kotaksoal" v-for="(index) in soal.jmlessay" :key="index" border="0" width="100%" cellspacing="0" cellpadding="0">
						<tr>
							<td width="2%" style="vertical-align: top; font-weight: bold;">{{ `${index+soal.jmlpilihanganda+soal.jmlmenjodohkan+soal.jmlbenarsalah}.` }}</td>
							<td style="font-weight: 500;">
								<div v-if="!soal.essay[index-1].pertanyaan.file">
									<span v-html="soal.essay[index-1].pertanyaan.text" />
								</div>
								<div v-else>
									<v-img :src="`${API_URL}berkas/${soal.essay[index-1].pertanyaan.file}`" width="100" />
									<span v-html="soal.essay[index-1].pertanyaan.text" />
								</div>
							</td>
						</tr>
						<tr>
							<td />
							<td>
								<TextArea
									v-model="jawabanEssayTemp[index-1].jawaban"
									label-ta="Jawaban"
									rows="4"
									class="mt-2"
									:clearable-ta="true"
								/>
							</td>
						</tr>
					</table>
				</div>
			</div>
		</v-card>
		<v-row>
			<v-col cols="12" class="text-end">
				<Button
					color-button="#0bd369"
					nama-button="Simpan Jawaban"
					@proses="() => {
						prosesTombol = 0
						notifikasi('question2', 'Yakin dengan jawaban anda ?', '2')
					}"
				/>
				<Button
					color-button="#04f7f7"
					nama-button="Reset Jawaban"
					@proses="ResetJawaban()"
				/>
				<Button
					color-button="#bd3a07"
					nama-button="Kembali"
					@proses="() => {
						prosesTombol = 1;
						notifikasi('question', 'Yakin tetap ingin keluar, jawaban anda akan hilang ?', '2');
					}"
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
        @proses="prosesTombol === 0 ? SimpanUjian() : BackChannel()"
        @cancel="dialogNotifikasi = false"
      />
    </v-dialog>
	</div>
</template>

<script>import { mapActions, mapState, mapGetters } from "vuex";
import { useMeta } from 'vue-meta'
import PopUpNotifikasi from "../../Layout/PopUpNotifikasi.vue";
import CountDown from "../../Layout/CountDown.vue";
export default {
  name: 'Ujian',
  components: {
    PopUpNotifikasi,
		CountDown,
  },
  data: () => ({
		API_URL: process.env.VUE_APP_BASE_URL_VIEW,
		now: new Date(),
		kondisi: false,
		starttime: '',
		endtime: '',
		previewData: {
			idUser: '',
			nama: '',
			nomorInduk: '',
			kelas: '',
			mapel: '',
		},
		soal: {
			pilihanganda: [],
			jmlpilihanganda: 0,
			essay: [],
			jmlessay: 0,
			menjodohkan: [],
			jmlmenjodohkan: 0,
			benarsalah: [],
			jmlbenarsalah: 0,
		},
		pilihan: ['A','B','C','D','E'],
		jawabanPilihanTemp: [],
		jawabanEssayTemp: [],
		jawabanMenjodohkanTemp: [],
		jawabanBenarSalahTemp: [],
		prosesTombol: 0,
		
    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Ujian",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
  },
  computed: {
    ...mapGetters({
      jadwalExamBy: 'user/jadwalExamBy',
			cmssettings: 'setting/cmssettings',
    }),
		timerKondisi() {
      return this.kondisi
    },
		logoSekolah(){
      return this.cmssettings ? `${this.API_URL}bahan/${this.cmssettings.logo}` : null
    },
		jenisExam(){
      return this.cmssettings ? this.cmssettings?.jenisraport?.value.toLowerCase() : null
    },
  },
  watch: {
		jadwalExamBy: {
			deep: true,
			handler(value){
				this.previewData = {
					idUser: value?.idUser,
					nama: value?.nama,
					nomorInduk: value?.nomorInduk,
					kelas: value?.kelas,
					mapel: value?.kodemapel,
				}
				this.starttime = value?.startDate
				this.endtime = value?.endDate
				this.soal = {
					pilihanganda: value?.dataQuestionExam?.pilihanganda,
					jmlpilihanganda: value?.dataQuestionExam?.pilihanganda.length,
					essay: value?.dataQuestionExam?.essay,
					jmlessay: value?.dataQuestionExam?.essay.length,
					menjodohkan: value?.dataQuestionExam?.menjodohkan,
					jmlmenjodohkan: value?.dataQuestionExam?.menjodohkan.length,
					benarsalah: value?.dataQuestionExam?.benarsalah,
					jmlbenarsalah: value?.dataQuestionExam?.benarsalah.length,
				}
				this.soal.pilihanganda.map(val => {
					this.jawabanPilihanTemp.push({
						kode: val.kode,
						jawaban: ''
					})
				})
				this.soal.essay.map(val => {
					this.jawabanEssayTemp.push({
						kode: val.kode,
						jawaban: ''
					})
				})
				this.soal.menjodohkan.map(val => {
					this.jawabanMenjodohkanTemp.push({
						kode: val.kode,
						jawaban: ''
					})
				})
				this.soal.benarsalah.map(val => {
					this.jawabanBenarSalahTemp.push({
						kode: val.kode,
						jawaban: ''
					})
				})
				if(this.convertDateTime(value.endDate) < this.convertDateTime(this.now)){
					this.prosesTombol = 1
					this.notifikasi("warning", "Tidak bisa masuk ke panel ujian ini !", "2")
				}
			}
		}
	},
  mounted() {
		this.getJadwalExambyID(this.$route.params.kode)
		this.getCMSSettings()
	},
	methods: {
		...mapActions({
			getJadwalExambyID: 'user/getJadwalExambyID',
			getCMSSettings: 'setting/getCMSSettings',
			// getListExam: 'setting/getListExam',
		}),
		// pilihanJawaban(e, kodesoal) {
		// 	let objIndex = this.jawabanPilihanTemp.findIndex((obj => obj.kode === kodesoal));
		// 	this.jawabanPilihanTemp[objIndex].jawaban = e.target.value
		// },
		SimpanUjian() {
			let bodyData = {
        idUser: this.previewData.idUser,
        mapel: this.previewData.mapel,
        kelas: this.previewData.kelas,
        jawabanPG: JSON.stringify(this.jawabanPilihanTemp),
        jawabanEssay: JSON.stringify(this.jawabanEssayTemp),
        jawabanMenjodohkan: JSON.stringify(this.jawabanMenjodohkanTemp),
        jawabanBenarSalah: JSON.stringify(this.jawabanBenarSalahTemp),
      }
      // return console.log(bodyData);
      this.$store.dispatch('user/postJawabanExam', bodyData)
      .then((res) => {
				this.prosesTombol = 1
				this.notifikasi("success", "Berhasil menyimpan jawaban anda!", "2")
				setTimeout(() => {
					this.dialogNotifikasi = false
					this.BackChannel()
				}, 10000);
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
		},
		ResetJawaban() {
			let tampungpilihan = this.jawabanPilihanTemp
			let tampungessay = this.jawabanEssayTemp
			let tampungmenjodohkan = this.jawabanMenjodohkanTemp
			let tampungbenarsalah = this.jawabanBenarSalahTemp
			this.jawabanPilihanTemp = []
			this.jawabanEssayTemp = []
			this.jawabanMenjodohkanTemp = []
			this.jawabanBenarSalahTemp = []
			tampungpilihan.map(val => {
				this.jawabanPilihanTemp.push({
					kode: val.kode,
					jawaban: ''
				})
			})
			tampungessay.map(val => {
				this.jawabanEssayTemp.push({
					kode: val.kode,
					jawaban: ''
				})
			})
			tampungmenjodohkan.map(val => {
				this.jawabanMenjodohkanTemp.push({
					kode: val.kode,
					jawaban: ''
				})
			})
			tampungbenarsalah.map(val => {
				this.jawabanBenarSalahTemp.push({
					kode: val.kode,
					jawaban: ''
				})
			})
		},
		valuesData(val) {
			if(val) {
				this.kondisi = val
				this.prosesTombol = 0
				this.notifikasi("warning", "Waktu ujian sudah selesai", "2")
				setTimeout(() => {
					this.dialogNotifikasi = false
					this.SimpanUjian()
				}, 10000);
			}
    },
		BackChannel() {
			// this.getListExam({ kelas: localStorage.getItem('kelas') })
			window.close()
			// this.$router.push({name: "DataExam", params: { jenis: this.jenisExam }});
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
.panelScroll {
  height: 100% !important;
  max-height: 350px !important;
	font-size: 12px !important;
	font-weight: 500 !important;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 5px;
	border-radius: 5px;
}
.panelScroll::-webkit-scrollbar {
  width: 16px;
}
.panelScroll::-webkit-scrollbar-thumb {
  background-color: #272727;
  border: 5px solid #c3c2c2;
  border-radius: 10rem;
}
.panelScroll::-webkit-scrollbar-track {
  position: absolute;
  right: -3rem;
  top: -50rem;
  background: transparent;
}

.tabelJodoh,.tabelJodoh td,.tabelJodoh th {
  border: 2px solid #000;
  padding: 5px;
}
.tabelJodoh {
  width: 100%;
  border-collapse: collapse;
}
</style>

<style lang="scss">
.v-selection-control--density-default {
	--v-selection-control-size: 30px !important;
}
.v-selection-control .v-label {
	font-size: 13px !important;
	opacity: 1;
	font-weight: 500;
}
.kotakatas {
	height: 100px;
	width: 100%;
	position: fixed;
	background-color: #272727;
	color: #FFF;
	display: flex;
	justify-content: center;
	align-items: center;
	border-bottom: 2px solid rgb(59, 111, 254);
	z-index: 1;
}
.wadahbawah {
	height: 100% !important;
  max-height: 470px !important;
	margin-top: 110px;
	margin-left: 10px;
	margin-right: 10px;
	padding: 40px !important;
	overflow-y: auto;
  overflow-x: hidden;
}
.wadahbawah::-webkit-scrollbar {
  width: 16px;
}
.wadahbawah::-webkit-scrollbar-thumb {
  background-color: #4CAF50;
  border: 5px solid #FFF;
  border-radius: 10rem;
}
.wadahbawah::-webkit-scrollbar-track {
  position: absolute;
  right: -3rem;
  top: -50rem;
  background: transparent;
}
.kepalasoal {
	display: flex;
	flex-direction: column;
	justify-content: center;
	height: auto;
}
.logo {
	text-align: center; 
}
.namasekolah {
	text-align: center; 
	font-weight: bold; 
	font-size: 25px; 
}
.alamat {
	text-align: center; 
	font-weight: bold; 
	font-size: 12px; 
}
.kop {
	text-align: center; 
	font-weight: bold; 
	font-size: 18px; 
}
.texttitle {
	text-align: left;
	font-weight: bold;
	font-size: 13px;
}
.textdes {
	text-align: left;
	font-size: 13px;
}
.kotakawal{
	display: flex;
	flex-direction: row-reverse;
}
.v-expansion-panel {
	background-color: #c3c2c2 ;
	border: 2px solid #FFF;
	color: #000;
	font-weight: bold;
	border-radius: 10px;
}
.v-expansion-panel-text__wrapper {
	padding: 5px !important;
	height: 350px !important;
}
.lingkaran {
	width: 25px;
	height: 25px;
	border: 2px solid#000;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 13px;
	color: #FFF;
	margin: 2px;
}
.kotakexpand {
	width: 350px;
	height: auto;
	margin-top: 20px;
	margin-right: 20px;
	position: fixed;
	z-index: 2;
}
.kotakinfo {
	width: 100%;
	height: auto;
	background-color: #c3c2c2;
	border: 2px dashed #000;
	border-radius: 10px;
	margin-bottom: 5px;
	padding: 10px 20px;
	font-size: 13px;
	color: #000;
}
.kotaksoal {
	// width: 100%;
	height: auto;
	// background-color: #c3c2c2;
	border: 2px dashed #000;
	border-radius: 10px;
	margin-bottom: 10px;
	padding: 5px 10px;
	font-size: 13px;
	color: #000;
}
.point {
	font-size: 15px;
	font-weight: bold;
}
.timer {
  color: #000;
  text-align:center;
	font-size: 30px;
  .day, .hour, .min, .sec {
		display: inline-block;
    font-weight: bold;
    text-align: center;
		margin: 0 20px;
    .format {
      font-weight: bold;
      font-size: 15px;
			color: #FFF;
    }
  }
  .number{
    background: #FFF;
    padding: 0 5px;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
		justify-content: center;
		align-items: center;
  }
  .message {
    font-size: 14px;
    font-weight: 400;
    margin-top: 5px;
  }
  .status-tag{
    width: 270px;
    margin: 10px auto;
    padding: 8px 0;
    font-weight: 500;
    color: #000;
    text-align: center;
    border-radius: 15px;
    &.upcoming{
      background-color: lightGreen;
    }
    &.running{
      background-color: gold;
    }
    &.expired{
      background-color: silver;
    }
  }
}
@media screen and (min-width: 1920px) {
  .wadahbawah {
		height: 100% !important;
  	max-height: 750px !important;
	}
}
</style>