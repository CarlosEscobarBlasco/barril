import { createRouter, createWebHistory } from "vue-router";
import Login from "./components/views/Login.vue";
import Dashboard from "./components/views/Dashboard.vue";
import Matches from "./components/views/Matches.vue";
import MatchDetail from "./components/views/MatchDetail.vue";

const routes = [
  { path: "/", name: "Login", component: Login },
  { path: "/dashboard", name: "Dashboard", component: Dashboard, meta: { title: 'Barril' } },
  { path: "/matches", name: "Matches", component: Matches, meta: { title: 'Partidos' } },
  { path: "/matches/:id", name: "MatchDetail", component: MatchDetail, meta: { title: 'Detalles de partido' } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
