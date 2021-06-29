import { createApp } from "vue";
import App from "./App.vue";

export async function simpleTest() {
  return (await import("@testproject/async-lib")).asyncFunc();
}

createApp(App).mount("#app");
simpleTest();
