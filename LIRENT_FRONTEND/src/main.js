import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";

import App from "@/App.vue";
import router from "@/router";

// Import bootstrap
import "@/assets/scss/styles.scss";
import * as bootstrap from "bootstrap";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);
app.use(pinia);
app.use(router);

app.mount("#app");
