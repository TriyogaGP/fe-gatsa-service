<template>
	<div>
		<div class="nav-header">
			<div class="nav-logo">
				<v-img class="gambarLogo" :src="logoSekolah" />
				<span class="textNamaSekolah">{{ namaSekolah }}</span>
			</div>
			<v-divider vertical :thickness="2" color="white" />
			<div class="left"><v-icon start size="middle" icon="mdi mdi-arrow-left-circle" color="icon-white" /></div>
			<div id="navbar" class="navbar">
				<ul class="nav">
					<li v-if="roleID !== '4'">
						<routerLink to="/dashboard">
							<v-icon start size="middle" icon="mdi mdi-view-dashboard" color="icon-white" />Dashboard
						</routerLink>
					</li>
					<li v-for="data in optionMenu" :key="data.menuText">
						<routerLink v-if="!data.kondisi" :to="data.menuText === 'Ujian' && roleID === '4' ? `${data.menuRoute}/${jenisExam}` : data.menuRoute" :class="`${data.subMenu.length ? 'expand-btn' : ''}`">
							<v-icon start size="middle" :icon="data.menuIcon" color="icon-white" />
							{{ data.menuText === 'Wali Kelas' && wali_kelas !== '' ? `${wali_kelas === null ? data.menuText : `${data.menuText} ${wali_kelas}`}` : 
							data.menuText === 'Ujian' && roleID === '4' ? `${data.menuText} ${jenisExam}` : data.menuText }}
						</routerLink>
						<routerLink v-if="data.kondisi" to="" class="expand-btn">
							<v-icon start size="middle" :icon="data.menuIcon" color="icon-white" />{{ data.menuText }}
						</routerLink>
						<ul v-if="(data.subMenu.length && !data.kondisi) || (!data.subMenu.length && data.kondisi)">
							<li v-for="submenu in (!data.kondisi) ? data.subMenu : mengajarOptions" :key="(!data.kondisi) ? submenu.menuText : submenu.label">
								<routerLink :to="(!data.kondisi) ? submenu.menuRoute : `/data-akademis/${jenis}/${submenu.link}`">
									<v-icon start size="middle" :icon="(!data.kondisi) ? submenu.menuIcon : 'mdi mdi-book-education'" color="icon-white" />{{ (!data.kondisi) ? submenu.menuText : submenu.label }}
								</routerLink>
							</li>
						</ul>
					</li>
				</ul>
			</div>
			<div class="right"><v-icon start size="middle" icon="mdi mdi-arrow-right-circle" color="icon-white" /></div>
			<!-- <header class="scroll navbar">
				<ul class="menu-items">
					<li v-if="roleID !== '4'" class="no-dropdown-beranda">
						<routerLink to="/dashboard" class="menu-item first-item">
							<v-icon start size="middle" icon="mdi mdi-view-dashboard" color="icon-white" />Dashboard
						</routerLink>
					</li>
					<li v-for="data in optionMenu" :key="data.menuText" :class="`${data.subMenu.length && !data.kondisi ? 'dropdown' : !data.subMenu.length && data.kondisi ? 'dropdown-single' : 'no-dropdown'}`">
						<routerLink v-if="!data.kondisi" :to="data.menuText === 'Ujian' && roleID === '4' ? `${data.menuRoute}/${jenisExam}` : data.menuRoute" :class="`${data.subMenu.length ? 'menu-item first-item expand-btn' : 'menu-item first-item'}`">
							<v-icon start size="middle" :icon="data.menuIcon" color="icon-white" />
							{{ data.menuText === 'Wali Kelas' && wali_kelas !== '' ? `${wali_kelas === null ? data.menuText : `${data.menuText} ${wali_kelas}`}` : 
							data.menuText === 'Ujian' && roleID === '4' ? `${data.menuText} ${jenisExam}` : data.menuText }}
						</routerLink>
						<routerLink v-if="data.kondisi" to="" class="menu-item first-item expand-btn">
							<v-icon start size="middle" :icon="data.menuIcon" color="icon-white" />{{ data.menuText }}
						</routerLink>
						<ul class="dropdown-menu">
							<li v-for="submenu in (!data.kondisi) ? data.subMenu : mengajarOptions" :key="(!data.kondisi) ? submenu.menuText : submenu.label">
								<routerLink :to="(!data.kondisi) ? submenu.menuRoute : '/data-akademis/${jenis}/'+submenu.link" class="menu-subitem first-subitem">
									<v-icon start size="middle" :icon="(!data.kondisi) ? submenu.menuIcon : 'mdi mdi-book-education'" color="icon-white" />{{ (!data.kondisi) ? submenu.menuText : submenu.label }}
								</routerLink>
							</li>
						</ul>
					</li>
				</ul>
			</header> -->
			<div class="nav-proses">
				<v-badge
					v-if="roleID === '1'"
					:content="`${totalNotif >= 99 ? '99+' : totalNotif}`"
					:value="`${totalNotif >= 99 ? '99+' : totalNotif}`"
					color="green"
					overlap
					:style="`${totalNotif >= 99 ? 'margin-right: 15px;' : 'margin-right: 5px;'}`"
				>
				<!-- class="badgeNotif" -->
					<v-btn
						size="small"
						icon="mdi mdi-bell"
						color="icon-white"
						style="height: 28px; width: 28px;"
						router to="/notifikasi" />
				</v-badge>
				<v-menu
					rounded="t-xs b-lg"
					open-on-click
					offset-y
					transition="slide-y-transition"
					location="bottom"
				>
					<template v-slot:activator="{ props }">
						<span
							class="white--text ma-3 UserPanel"
							v-bind="props"
						>
							{{ inisialuppercaseLetterFirst(nama) }}
							<v-avatar size="35">
								<v-img :src="fotoProfil"></v-img>
							</v-avatar>
						</span>
					</template>

					<v-list
						:lines="false"
						density="comfortable"
						nav
						class="listData"
					>
						<v-list-item
							v-if="roleID === '1'"
							router to="/settings"
							color="nav-back"
							class="SelectedMenu"
						>
							<template v-slot:append>
								<v-icon size="middle" icon="mdi mdi-cog-outline" color="icon-white" />
							</template>
							<v-list-item-title>
								<span class="menufont">Pengaturan</span>
							</v-list-item-title>
						</v-list-item>
						<v-list-item
							router to="/profile"
							color="nav-back"
							class="SelectedMenu"
						>
							<template v-slot:append>
								<v-icon size="middle" icon="mdi mdi-account" color="icon-white" />
							</template>
							<v-list-item-title>
								<span class="menufont">Profil</span>
							</v-list-item-title>
						</v-list-item>
						<v-list-item
							router to="/broadcast"
							color="nav-back"
							class="SelectedMenu"
						>
							<template v-slot:append>
								<span class="boxnotif" v-html="totalBroadcast" />
								<v-icon size="middle" icon="mdi mdi-broadcast" color="icon-white" />
							</template>
							<v-list-item-title>
								<span class="menufont">Broadcast</span>
							</v-list-item-title>
						</v-list-item>
						<v-list-item
							v-if="roleID === '3' || roleID === '4'"
							router to="/percakapan"
							color="nav-back"
							class="SelectedMenu"
						>
							<template v-slot:append>
								<v-icon size="middle" icon="mdi mdi-chat" color="icon-white" />
							</template>
							<v-list-item-title>
								<span class="menufont">Percakapan</span>
							</v-list-item-title>
						</v-list-item>
						<v-list-item
							@click="keluar()"
							color="nav-back"
							class="SelectedMenu"
						>
							<template v-slot:append>
								<v-icon size="middle" icon="mdi mdi-logout" color="icon-white" />
							</template>
							<v-list-item-title>
								<span class="menufont">Keluar</span>
							</v-list-item-title>
						</v-list-item>
					</v-list>
				</v-menu>
			</div>
			<v-icon end style="margin-right: 10px;" size="middle" class="menu-tampilan-right" icon="mdi mdi-format-list-bulleted" @click.stop="drawer = !drawer" color="icon-white" />
		</div>
		<v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
			location="right"
    >
			<v-divider :thickness="2" color="white" style="margin: 10px 0px;" />
			<v-menu
				rounded="t-xs b-lg"
				open-on-click
				offset-y
				transition="slide-y-transition"
				location="left"
			>
				<template v-slot:activator="{ props }">
					<span
						class="white--text ma-3 UserPanel"
						v-bind="props"
					>
						{{ inisialuppercaseLetterFirst(nama) }}
						<v-avatar size="35">
							<v-img :src="fotoProfil"></v-img>
						</v-avatar>
					</span>
				</template>

				<v-list
					:lines="false"
					density="comfortable"
					nav
					class="listData"
				>
					<v-list-item
						v-if="roleID === '1'"
						router to="/settings"
						color="nav-back"
						class="SelectedMenu"
					>
						<template v-slot:append>
							<v-icon size="middle" icon="mdi mdi-cog-outline" color="icon-white" />
						</template>
						<v-list-item-title>
							<span class="menufont">Pengaturan</span>
						</v-list-item-title>
					</v-list-item>
					<v-list-item
						router to="/profile"
						color="nav-back"
						class="SelectedMenu"
					>
						<template v-slot:append>
							<v-icon size="middle" icon="mdi mdi-account" color="icon-white" />
						</template>
						<v-list-item-title>
							<span class="menufont">Profil</span>
						</v-list-item-title>
					</v-list-item>
					<v-list-item
						router to="/notifikasi"
						color="nav-back"
						class="SelectedMenu"
					>
						<template v-slot:append>
							<span class="boxnotif" v-html="totalNotif" />
							<v-icon size="middle" icon="mdi mdi-bell" color="icon-white" />
						</template>
						<v-list-item-title>
							<span class="menufont">Notifikasi</span>
						</v-list-item-title>
					</v-list-item>
					<v-list-item
						router to="/broadcast"
						color="nav-back"
						class="SelectedMenu"
					>
						<template v-slot:append>
							<span class="boxnotif" v-html="totalBroadcast" />
							<v-icon size="middle" icon="mdi mdi-broadcast" color="icon-white" />
						</template>
						<v-list-item-title>
							<span class="menufont">Broadcast</span>
						</v-list-item-title>
					</v-list-item>
					<v-list-item
						v-if="roleID === '3' || roleID === '4'"
						router to="/percakapan"
						color="nav-back"
						class="SelectedMenu"
					>
						<template v-slot:append>
							<v-icon size="middle" icon="mdi mdi-chat" color="icon-white" />
						</template>
						<v-list-item-title>
							<span class="menufont">Percakapan</span>
						</v-list-item-title>
					</v-list-item>
					<v-list-item
						@click="keluar()"
						color="nav-back"
						class="SelectedMenu"
					>
						<template v-slot:append>
							<v-icon size="middle" icon="mdi mdi-logout" color="icon-white" />
						</template>
						<v-list-item-title>
							<span class="menufont">Keluar</span>
						</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
			<v-divider :thickness="2" color="white" style="margin: 10px 0px;" />
			<v-list 
				v-if="roleID !== '4'"
				:lines="false"
				density="comfortable"
				nav
				style="padding: 0px;"
			>
				<v-list-item
					router to="/dashboard"
					color="nav-back"
					class="SelectedMenu"
				>
					<v-list-item-title>
						<v-icon start size="middle" icon="mdi mdi-view-dashboard" color="icon-white" />
						<span class="menufont">Dashboard</span>
					</v-list-item-title>
				</v-list-item>
			</v-list>
			<v-menu
				v-for="data in menuOptions" :key="data.menuText"
				open-on-click
				rounded="t-xs b-lg"
				offset-y
				transition="slide-y-transition"
				location="left"
			>
				<template v-slot:activator="{ props }">
					<v-list
						v-bind="props"
						:lines="false"
						density="comfortable"
						nav
						style="padding: 0px;"
					>
						<v-list-item
							v-if="data.menuText !== 'Wali Kelas' && (roleID === '1' || roleID === '2' || roleID === '4')"
							router :to="data.menuText === 'Ujian' ? `${data.menuRoute}/${jenisExam}` : !data.kondisi ? data.menuRoute : ''"
							color="nav-back"
							class="SelectedMenu"
						>
							<v-list-item-title>
								<v-icon start size="middle" :icon="data.menuIcon" color="icon-white" />
								<span class="menufont">{{ data.menuText === 'Ujian' ? `${data.menuText} ${jenisExam}` : data.menuText }}</span>
							</v-list-item-title>
						</v-list-item>
						<v-list-item
							v-if="data.menuText !== 'Wali Kelas' && data.menuText !== 'Jadwal Mengajar' && data.menuText !== 'Guru' && data.menuText !== 'Siswa Siswi' && roleID === '3'"
							router :to="!data.kondisi ? data.menuRoute : ''"
							color="nav-back"
							class="SelectedMenu"
						>
							<v-list-item-title>
								<v-icon start size="middle" :icon="data.menuIcon" color="icon-white" />
								<span class="menufont">{{ data.menuText }}</span>
							</v-list-item-title>
						</v-list-item>
						<v-list-item
							v-if="data.menuText === 'Wali Kelas' && wali_kelas !== ''"
							router :to="data.menuRoute"
							color="nav-back"
							class="SelectedMenu"
						>
							<v-list-item-title>
								<v-icon start size="middle" :icon="data.menuIcon" color="icon-white" />
								<span class="menufont">{{ `${data.menuText}${wali_kelas == null ? '':' '+wali_kelas}` }}</span>
							</v-list-item-title>
						</v-list-item>
						<v-list-item
							v-if="data.menuText === 'Jadwal Mengajar' && kondisiWaKaBidKurikulum && roleID === '3'"
							router :to="data.menuRoute"
							color="nav-back"
							class="SelectedMenu"
						>
							<v-list-item-title>
								<v-icon start size="middle" :icon="data.menuIcon" color="icon-white" />
								<span class="menufont">{{ data.menuText }}</span>
							</v-list-item-title>
						</v-list-item>
						<v-list-item
							v-if="data.menuText === 'Siswa Siswi' && kondisiWaKaBidKesiswaan && roleID === '3'"
							router :to="data.menuRoute"
							color="nav-back"
							class="SelectedMenu"
						>
							<v-list-item-title>
								<v-icon start size="middle" :icon="data.menuIcon" color="icon-white" />
								<span class="menufont">{{ data.menuText }}</span>
							</v-list-item-title>
						</v-list-item>
						<v-list-item
							v-if="(data.menuText === 'Siswa Siswi' || data.menuText === 'Guru') && kondisiKepalaSekolah && roleID === '3'"
							router :to="data.menuRoute"
							color="nav-back"
							class="SelectedMenu"
						>
							<v-list-item-title>
								<v-icon start size="middle" :icon="data.menuIcon" color="icon-white" />
								<span class="menufont">{{ data.menuText }}</span>
							</v-list-item-title>
						</v-list-item>
					</v-list>
				</template>

				<v-list
					v-if="data.subMenu.length && !data.kondisi"
					:lines="false"
					density="comfortable"
					nav
					class="listData"
				>
					<v-list-item
						v-for="v in data.subMenu"
						:key="v.menuText"
						router :to="v.menuRoute"
						color="nav-back"
						class="SelectedMenu"
					>
						<template v-slot:append>
							<v-icon size="middle" :icon="v.menuIcon" color="icon-white" />
						</template>
						<v-list-item-title>
							<span class="menufont">{{ v.menuText }}</span>
						</v-list-item-title>
					</v-list-item>
				</v-list>
				<v-list
					v-if="data.kondisi"
					:lines="false"
					density="comfortable"
					nav
					class="listData"
				>
					<v-list-item
						v-for="v in mengajarOptions"
						:key="v.label"
						router :to="`/data-akademis/${jenis}/${v.link}`"
						color="nav-back"
						class="SelectedMenu"
					>
						<template v-slot:append>
							<v-icon size="middle" icon="mdi mdi-book-education" color="icon-white" />
						</template>
						<v-list-item-title>
							<span class="menufont">{{ v.label }}</span>
						</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
			<!-- <h4 class="text-center">----- Menu Lainnya -----</h4>
      <v-list
				density="comfortable"
				nav
				style="padding: 0px; margin-left: 3px;"
				class="listData"
			>
				<v-list-item color="nav-back" class="SelectedMenu">
					<v-list-item-title>Foo</v-list-item-title>
				</v-list-item>
				<v-list-item color="nav-back" class="SelectedMenu">
					<v-list-item-title>Bar</v-list-item-title>
				</v-list-item>
				<v-list-item color="nav-back" class="SelectedMenu">
					<v-list-item-title>Fizz</v-list-item-title>
				</v-list-item>
				<v-list-item color="nav-back" class="SelectedMenu">
					<v-list-item-title>Buzz</v-list-item-title>
				</v-list-item>
      </v-list> -->
    </v-navigation-drawer>
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
				@proses="goToProses"
				@cancel="dialogNotifikasi = false"
			/>
		</v-dialog>
	</div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import PopUpNotifikasi from "@/views/Layout/PopUpNotifikasi.vue";
import io from 'socket.io-client'
export default {
	components: {
    PopUpNotifikasi
  },
	props: {
    namaSekolah: {
      type: String,
      default: null
    },
    logoSekolah: {
      type: String,
      default: null
    },
    totalNotif: {
      type: Number,
      default: 0,
    },
    totalBroadcast: {
      type: Number,
      default: 0,
    },
  },
	data: () => ({
		API_URL: process.env.VUE_APP_BASE_URL_VIEW,
		drawer: false,
		fotoProfil: '',
		roleID: '',
		nama: '',
		wali_kelas: '',
		kondisiKepalaSekolah: false,
		kondisiWaKaBidKesiswaan: false,
		kondisiWaKaBidKurikulum: false,
		menuOptions: [],
		jenis: '',

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	computed: {
		...mapState({
			mengajar: store => store.setting.mengajarOptions,
			jabatan: store => store.setting.jabatanOptions,
		}),
		...mapGetters({
      cmssettings: 'setting/cmssettings',
    }),
    jenisExam(){
      return this.cmssettings ? this.cmssettings.jenisraport.value : null
    },
		mengajarOptions(){
			if(this.roleID === '3'){
				let mengajar_bidang = localStorage.getItem('mengajar_bidang').split(', ')
				let result = []
				mengajar_bidang.map(str => {
					let hasil = this.mengajar.filter(val => { return val.kode == str })
					result.push({ label: hasil.length ? hasil[0].label : '', link: hasil.length ? hasil[0].label.replace(' ', '-') : '' })
				})
				return result
			}
		},
		jabatanOptions(){
			if(this.roleID === '3'){
				let jabatan_guru = localStorage.getItem('jabatan_guru').split(', ')
				let result = []
				jabatan_guru.map(str => {
					let hasil = this.jabatan.filter(val => { return val.kode == str })
					result.push(hasil.length ? hasil[0].label : '')
				})
				return result
			}
		},
		optionMenu(){
			if(this.roleID === '3'){
				let jabatan_guru = localStorage.getItem('jabatan_guru').split(', ')
				let result = []
				jabatan_guru.map(str => {
					let hasil = this.jabatan.filter(val => { return val.kode == str })
					result.push(hasil.length ? hasil[0].label : '')
				})
				this.jenis = 'mapel'
        if(result.includes('WaKaBid. Kurikulum')){
					return this.menuOptions.filter(el => { return this.wali_kelas === '' ? el.menuText != "Wali Kelas" && el.menuText != "Guru" && el.menuText != "Siswa Siswi" : el.menuText != "Guru" && el.menuText != "Siswa Siswi"; })
        }else if(result.includes('WaKaBid. Kesiswaan')){
          return this.menuOptions.filter(el => { return this.wali_kelas === '' ? el.menuText != "Wali Kelas" && el.menuText != "Guru" && el.menuText != "Jadwal Mengajar" : el.menuText != "Guru" && el.menuText != "Jadwal Mengajar"; })
				}else if(result.includes('Kepala Sekolah')){
          return this.menuOptions.filter(el => { return this.wali_kelas === '' ? el.menuText != "Wali Kelas" : el; })
        }else{
          return this.menuOptions.filter(el => { return this.wali_kelas === '' ? el.menuText != "Wali Kelas" && el.menuText != "Guru" && el.menuText != "Siswa Siswi" && el.menuText != "Jadwal Mengajar" : el.menuText != "Guru" && el.menuText != "Siswa Siswi" && el.menuText != "Jadwal Mengajar"; })
				}
			}else if(this.roleID === '4'){
				return this.menuOptions
			}else if(this.roleID === '1' || this.roleID === '2'){
				return this.menuOptions
      }
		}
  },
	watch: {
		jabatanOptions: {
			deep: true,
			handler(value) {
				if(this.roleID === '3'){
					if(value.includes('WaKaBid. Kurikulum')){
						this.kondisiWaKaBidKurikulum = true
					}else if(value.includes('WaKaBid. Kesiswaan')){
						this.kondisiWaKaBidKesiswaan = true
					}else if(value.includes('Kepala Sekolah')){
						this.kondisiKepalaSekolah = true
					}
				}
			}
		}
	},
	mounted() {
		if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
		this.fotoProfil = localStorage.getItem('fotoProfil')
		this.nama = localStorage.getItem('nama')
		this.roleID = localStorage.getItem('roleID')
		this.wali_kelas = localStorage.getItem('wali_kelas')
		this.Navbar()
		this.getMengajar()
		this.getJabatan()
    this.getCMSSettings()
		// const element = document.getElementById("navbar");
		// console.log(element.scrollWidth);
	},
	methods: {
		...mapActions({
      getCMSSettings: 'setting/getCMSSettings',
			getMengajar: "setting/getMengajar",
			getJabatan: "setting/getJabatan",
			getMenu: "setting/getMenu",
			AuthLogout: "auth/AuthLogout",
		}),
		Navbar(){
			this.getMenu(this.roleID)
			.then((res) => {
				let data = res.data.result;
				this.menuOptions = data.length ? data[0].menu : null
			})
			.catch((err) => {
				if(err.response.data.status === 401) {
					return this.notifikasi("error", err.response.data.message, "2")
				}
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		keluar() {
			this.notifikasi("question", "Apakah anda yakin ingin keluar ?", "2")
		},
		goToProses(){
			this.AuthLogout(localStorage.getItem('idLogin'))
			.then((res) => {
				const socket = io(this.API_URL);
        socket.emit("dataonline");
				localStorage.clear();
				// localStorage.removeItem('user_token');
				// localStorage.removeItem('nama');
				// localStorage.removeItem('nama_role');
				// localStorage.removeItem('idLogin');
				// localStorage.removeItem('roleID');
				// localStorage.removeItem('fotoProfil');
				// localStorage.removeItem('jabatan_guru');
				// localStorage.removeItem('mengajar_bidang');
				// localStorage.removeItem('mengajar_kelas');
				// localStorage.removeItem('wali_kelas');
				// localStorage.removeItem('kelas');
				this.$router.push({name: "LogIn"});
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
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
.v-list-item__append > .v-badge .v-icon, .v-list-item__append > .v-icon {
	margin-inline-start: 5px !important;
}
.theme--light.v-list {
	width: 200px !important;
}
.navigasi {
	display: flex;
}
.menu-tampilan-right {
	display: none;
}
.listData {
	width: 200px !important;
}
.v-list-item--density-default.v-list-item--one-line {
	min-height: 35px !important;
}
.theme--dark.v-icon {
	color: #FFFFFF !important;
}
.v-list-item {
	padding: 0px 6px !important;
}
.theme--dark.v-list {
	background-color: #272727 !important;
}
.v-btn.v-btn--density-default {
	height: calc(var(--v-btn-height) + 0px);
}

.nav-header {
	position: fixed;
	padding: 0px 10px;
	width: 100%;
	height: 60px;
	background: #272727;
	z-index: 1;
	border-bottom: 3px solid #4CAF50;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.nav-logo{
	width: 450px;
	max-width: fit-content;
}
.nav-proses{
	width: 24%;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	color: #FFF;
}

@media screen and (max-width: 960px) {
  	.navbar, .nav-proses {
		display: none;
	}
	.menu-tampilan-right {
		display: block;
		text-align: left;
	}
}
</style>

<style>
/* .v-toolbar__content > .v-toolbar-title {
	margin-inline-start: 16px;
	max-width: 250px !important;
} */
.menufont {
	font-size: 9pt !important;
	color: #FFFFFF;
}
.SelectedMenu{
	margin-left: 3px;
	background-color: #272727;
	color: white;
	cursor: pointer;
	border-radius: 4px;
}
.SelectedMenu:hover {
	background-color: #4CAF50;
}
.SelectedMenu:active {
	background-color: #272727;
}
.badgeNotif {
	margin-right: 15px;
}
.UserPanel {
	cursor: pointer;
}
.scrollNotif{
  max-height: 500px !important;
  overflow-y: auto !important;
}
.box{
	width: 75px;
	height: 20px;
  /* background-image:-moz-linear-gradient(top, #272727, #5a5757); */
	/* background-image: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#272727), to(#5a5757), color-stop(1,#5a5757)); */
	margin: 4px;
  color: #FFF;
}
.boxnotif{
	-moz-border-radius: 5px;
	-webkit-border-radius: 5px;
	-khtml-border-radius: 5px; 
	border-radius: 5px;
	padding: 0px 5px;
	text-align: center;
	font-size: 8pt;
	font-weight: bold;
	background-color: rgba(10, 204, 117, 0.694);
	border: 1px solid #FFFFFF;
	color: #FFFFFF;
}
</style>