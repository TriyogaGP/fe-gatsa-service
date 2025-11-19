import { createRouter, createWebHashHistory } from "vue-router";
import Login from "@/views/Login.vue";
import ForgotPass from "@/views/ForgotPass.vue";

const routes = [
  {
    path: "/",
    name: "LogIn",
    component: Login,
  },
  {
    path: "/forgot-pass",
    name: "ForgotPass",
    component: ForgotPass,
  },
  {
    path: '/ujian/:kode',
    name: 'Ujian',
    component: () => import('@/views/page-content/content-view/V_Ujian.vue')
  },
  {
    path: '/',
    component: () => import("@/views/Layout/index.vue"),
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue')
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue')
      },
      {
        path: '/settings',
        name: 'Pengaturan',
        props: true,
        component: () => import('@/views/Settings.vue')
      },
      {
        path: '/notifikasi',
        name: 'Notifikasi',
        component: () => import('@/views/Notifikasi.vue')
      },
      {
        path: '/broadcast',
        name: 'Broadcast',
        component: () => import('@/views/Broadcast.vue')
      },
      {
        path: '/percakapan',
        name: 'Percakapan',
        component: () => import('@/views/Percakapan.vue')
      },
      // {
      //   path: '/testing',
      //   name: 'Testing',
      //   component: () => import('@/views/Testing.vue')
      // },

      {
        path: '/data-administrator',
        name: 'DataAdministrator',
        component: () => import('@/views/page-content/Administrator/V_Administrator.vue')
      },
      {
        path: '/formulir-administrator/:kondisi/:uid',
        name: 'FormulirAdministrator',
        props: true,
        component: () => import('@/views/page-content/Administrator/P_FormAdministrator.vue')
      },
      {
        path: '/data-struktural',
        name: 'DataStruktural',
        component: () => import('@/views/page-content/Struktural/V_Struktural.vue')
      },
      {
        path: '/formulir-struktural/:kondisi/:uid',
        name: 'FormulirStruktural',
        props: true,
        component: () => import('@/views/page-content/Struktural/P_FormStruktural.vue')
      },
      {
        path: '/data-siswa-siswi',
        name: 'DataSiswaSiswi',
        component: () => import('@/views/page-content/SiswaSiswi/V_SiswaSiswi.vue')
      },
      {
        path: '/formulir-siswa-siswi/:kondisi/:uid',
        name: 'FormulirSiswaSiswi',
        props: true,
        component: () => import('@/views/page-content/SiswaSiswi/P_FormSiswaSiswi.vue')
      },
      {
        path: '/data-kelas-siswa/:kelas',
        name: 'DataKelasSiswa',
        component: () => import('@/views/page-content/content-view/V_KelasSiswa.vue')
      },
      {
        path: '/data-jadwal-mengajar',
        name: 'DataJadwalMengajar',
        component: () => import('@/views/page-content/content-view/V_JadwalMengajar.vue')
      },
      {
        path: '/data-detail-kelas-siswa/:kondisi/:kelas',
        name: 'DataDetailKelasSiswa',
        component: () => import('@/views/page-content/content-view/V_DetailKelasSiswa.vue')
      },
      {
        path: '/data-akademis',
        name: 'DataAkademis',
        component: () => import('@/views/page-content/content-view/V_Akademis.vue'),
      },
      {
        path: '/data-akademis/:jenis/:mapel',
        name: 'DataDetailAkademis',
        component: () => import('@/views/page-content/content-view/V_DetailAkademis.vue')
      },
      {
        path: '/data-wali-kelas',
        name: 'DataWaliKelas',
        component: () => import('@/views/page-content/content-view/V_WaliKelasSiswa.vue'),
      },
      {
        path: '/question-exam',
        name: 'QuestionExam',
        component: () => import('@/views/page-content/content-view/V_QuestionExam.vue')
      },
      {
        path: '/list-exam',
        name: 'JadwalExam',
        component: () => import('@/views/page-content/content-view/V_JadwalExam.vue')
      },
      {
        path: '/data-exam/:jenis',
        name: 'DataExam',
        component: () => import('@/views/page-content/content-view/V_Exam.vue')
      },
      {
        path: '/koreksi-exam',
        name: 'KoreksiExam',
        component: () => import('@/views/page-content/content-view/V_KoreksiExam.vue')
      },
      
      {
        path: '/:pathMatch(.*)*',
        name: 'UnderConstruction',
        component: () => import('@/views/Layout/UnderConstruction.vue')
      },
    ]
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
