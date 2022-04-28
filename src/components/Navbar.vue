<template>
  <header class="header">
    <nav class="navbar" :class="$route.path === '/' ? '' : 'with-background'">
      <div class="container">
        <div class="navbar-brand">
          <a
            class="navbar-item has-text-white is-size-2 has-text-weight-bold"
            href="#"
          >
            {{ brandName }}
          </a>
          <span
            @click="isMenuOpen = !isMenuOpen"
            role="button"
            tabindex="0"
            class="navbar-burger burger has-text-white"
            :class="{ 'is-active': isMenuOpen }"
            data-target="navbar-menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </span>
        </div>
        <div
          id="navbar-menu"
          class="navbar-menu"
          :class="{ 'is-active': isMenuOpen }"
        >
          <div class="navbar-end">
            <router-link
              v-if="isAuthenticated"
              to="/profile"
              class="navbar-item nav-web"
            >
              {{ user.email }}
            </router-link>
            <router-link
              v-for="item in menuItems"
              :key="item.text"
              :to="item.link"
              class="navbar-item nav-web"
              >{{ item.text }}</router-link
            >
            <template v-if="!isAuthenticated">
              <router-link class="navbar-item" to="/login">Login</router-link>
              <router-link class="navbar-item" to="/register"
                >Register</router-link
              >
            </template>
            <template v-else>
              <router-link class="navbar-item" to="/exchanges/new"
                >New Exchange</router-link
              >
              <router-link class="navbar-item" to="/profile"
                >Profile</router-link
              >
              <div class="navbar-item clickable" @click="logout">Logout</div>
            </template>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import useAuth from "../composition/useAuth"; // 정보반환체 가짐
// default 객체 : data function을 가짐 : 데이터 객체를 반환함
export default {
  props: {
    brandName: {
      type: String,
      required: true,
      default: "My Default Title",
    },
    menuItems: {
      type: Array,
      required: true,
    },
  },
  setup() {
    return {
      ...useAuth(),
    };
  },
  data() {
    return {
      isMenuOpen: {
        type: Boolean,
        default: false,
      },
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters["user/isAuthenticated"];
    },
  },
  methods: {
    logout() {
      this.$store.dispatch("user/logout");
    },
    handleWindowResizing(e) {
      // event listener로 전달되므로 이벤트를 사용가능함
      if (this.isMenuOpen && e.target.innerWidth > 1020) {
        this.isMenuOpen = false;
      }
    },
  },
  created() {
    window.addEventListener("resize", this.handleWindowResizing);
  },
  unmounted() {
    window.removeEventListener("resize", this.handleWindowResizing);
  },
};
</script>

<style></style>
