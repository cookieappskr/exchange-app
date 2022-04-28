import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faStar, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// 아이콘 사용할 것 추가
library.add([faStar, faUpload]);

// 앱정의
let app;

// Auth, Session 확인용 (로그인/로그아웃 시)
store.dispatch("user/onAuthChange", () => {
  if (!app) {
    app = createApp(App);
    app.use(store);
    app.use(router);
    app.use(Toast);

    app.component("font-awesome-icon", FontAwesomeIcon);
    app.mount("#app");
  }
});
