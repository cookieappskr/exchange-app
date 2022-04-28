import { createWebHistory, createRouter } from "vue-router"; // 일반방식
import { getAuth } from "firebase/auth";

// Page List
import HomePage from "../pages/Home";
import AboutPage from "../pages/About";
import FaqPage from "../pages/Faq";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import ProfilePage from "../pages/Profile";
import ExchangeCreatePage from "../pages/ExchangeCreate";
import ExchangeDetailPage from "../pages/ExchangeDetail";

const routes = [
  {
    path: "",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/about",
    name: "About",
    component: AboutPage,
  },
  {
    path: "/faq",
    name: "Faq",
    component: FaqPage,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    meta: { onlyGuestUser: true },
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterPage,
    meta: { onlyGuestUser: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: ProfilePage,
    meta: { onlyAuthUser: true },
  },
  {
    path: "/exchanges/new",
    name: "ExchangeCreate",
    component: ExchangeCreatePage,
    meta: { onlyAuthUser: true },
  },
  {
    path: "/exchanges/:slug",
    name: "ExchangeDetail",
    component: ExchangeDetailPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  // 로그인확인
  const isAuth = !!getAuth().currentUser; // currentUser 는 User 반환하는데, Boolean으로 전환하는 방법씀
  // 리다이렉팅
  if (to.meta.onlyAuthUser) {
    if (isAuth) {
      next();
    } else {
      next({ name: "Login" });
    }
  } else if (to.meta.onlyGuestUser) {
    if (isAuth) {
      next({ name: "Home" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
