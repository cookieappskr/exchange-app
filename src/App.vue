<template>
  <div>
    <Navbar :brandName="brandName" :menuItems="menuItems" />
    <router-view />
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
export default {
  name: "App",
  components: {
    Navbar,
  },
  data() {
    return {
      brandName: "Exchange App",
      menuItems: [
        { text: "Home", link: "/" },
        { text: "About", link: "/about" },
        { text: "FAQ", link: "/faq" },
      ],
    };
  },
};
</script>

<style lang="scss">
@import "assets/styles/variables.scss";
@import "~bulma/bulma.sass"; // ~있는 것은 node_modules에 있는 package를 참조한다는 뜻임
@import "assets/styles/main.scss";
</style>
