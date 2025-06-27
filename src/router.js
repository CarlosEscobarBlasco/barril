import { createRouter, createWebHistory } from "vue-router";
import Login from "./views/Login.vue";
import Start from "./views/Start.vue";
import Matches from "./views/Matches.vue";
import Admin from "./views/Admin.vue";
import MatchDetail from "./views/MatchDetail.vue";
import Stats from "./views/Stats.vue";
import PlayerStats from "./views/PlayerStats.vue";
import TotalStats from "./views/TotalStats.vue";
import Players from "./views/Players.vue";
import Actions from "./views/Actions.vue";
import Courts from "./views/Courts.vue";
import { supabase } from "./supabase";

const routes = [
  { path: "/login", name: "Login", component: Login },
  { path: "/", name: "Start", component: Start },
  { path: "/matches", name: "Matches", component: Matches },
  { path: "/matches/:id", name: "MatchDetail", component: MatchDetail },
  { path: "/admin", name: "Admin", component: Admin },
  { path: "/stats", name: "Stats", component: Stats },
  { path: "/player-stats", name: "PlayerStats", component: PlayerStats },
  { path: "/total-stats", name: "TotalStats", component: TotalStats },
  { path: "/players", name: "Players", component: Players },
  { path: "/actions", name: "Actions", component: Actions },
  { path: "/courts", name: "Courts", component: Courts },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const publicPages = ["/login"];
  const requiresAuth = !publicPages.includes(to.path);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAuthenticated = !!session;

  if (to.path === "/login" && isAuthenticated) {
    next("/");
  } else if (requiresAuth && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;
