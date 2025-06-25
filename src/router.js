import { createRouter, createWebHistory } from "vue-router";
import Login from "./views/Login.vue";
import Start from "./views/Start.vue";
import Matches from "./views/Matches.vue";
import Admin from "./views/Admin.vue";
import MatchDetail from "./views/MatchDetail.vue";
import Stats from "./views/Stats.vue";

const routes = [
  { path: "/login", name: "Login", component: Login },
  { path: "/", name: "Start", component: Start },
  { path: "/matches", name: "Matches", component: Matches },
  { path: "/matches/:id", name: "MatchDetail", component: MatchDetail },
  { path: "/admin", name: "Admin", component: Admin },
  { path: "/stats", name: "Stats", component: Stats },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
