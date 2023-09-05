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
        path: '/dataAdministrator',
        name: 'DataAdministrator',
        component: () => import('@/views/page-content/Administrator/V_Administrator.vue')
      },
      {
        path: '/formulirAdministrator/:kondisi/:uid',
        name: 'FormulirAdministrator',
        props: true,
        component: () => import('@/views/page-content/Administrator/P_FormAdministrator.vue')
      },
      {
        path: '/dataStruktural',
        name: 'DataStruktural',
        component: () => import('@/views/page-content/Struktural/V_Struktural.vue')
      },
      {
        path: '/formulirStruktural/:kondisi/:uid',
        name: 'FormulirStruktural',
        props: true,
        component: () => import('@/views/page-content/Struktural/P_FormStruktural.vue')
      },
      {
        path: '/dataSiswaSiswi',
        name: 'DataSiswaSiswi',
        component: () => import('@/views/page-content/SiswaSiswi/V_SiswaSiswi.vue')
      },
      {
        path: '/formulirSiswaSiswi/:kondisi/:uid',
        name: 'FormulirSiswaSiswi',
        props: true,
        component: () => import('@/views/page-content/SiswaSiswi/P_FormSiswaSiswi.vue')
      },
      {
        path: '/dataKelas',
        name: 'DataKelas',
        component: () => import('@/views/page-content/content-view/V_Kelas.vue')
      },
      {
        path: '/dataKelasSiswa/:kelas',
        name: 'DataKelasSiswa',
        component: () => import('@/views/page-content/content-view/V_KelasSiswa.vue')
      },
      {
        path: '/dataJadwalMengajar',
        name: 'DataJadwalMengajar',
        component: () => import('@/views/page-content/content-view/V_JadwalMengajar.vue')
      },
      {
        path: '/dataDetailKelasSiswa/:kondisi/:kelas',
        name: 'DataDetailKelasSiswa',
        component: () => import('@/views/page-content/content-view/V_DetailKelasSiswa.vue')
      },
      {
        path: '/dataAkademis',
        name: 'DataAkademis',
        component: () => import('@/views/page-content/content-view/V_Akademis.vue'),
      },
      {
        path: '/dataAkademis/:mapel',
        name: 'DataDetailAkademis',
        component: () => import('@/views/page-content/content-view/V_DetailAkademis.vue')
      },
      {
        path: '/dataWaliKelas',
        name: 'DataWaliKelas',
        component: () => import('@/views/page-content/content-view/V_WaliKelasSiswa.vue'),
      },
      {
        path: '/question-exam',
        name: 'Question-Exam',
        component: () => import('@/views/page-content/content-view/V_QuestionExam.vue')
      },
      {
        path: '/list-exam',
        name: 'Jadwal-Exam',
        component: () => import('@/views/page-content/content-view/V_JadwalExam.vue')
      },
    ]
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
