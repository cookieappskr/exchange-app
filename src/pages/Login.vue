<template>
  <div class="page-wrapper">
    <div class="container has-text-centered">
      <div class="column is-4 is-offset-4">
        <h3 class="title has-text-grey">Login</h3>
        <p class="subtitle has-text-grey">Please login to proceed.</p>

        <!-- 로그인폼 -->
        <div class="box">
          <form>
            <div class="field">
              <div class="control">
                <input
                  v-model="form.email"
                  class="input is-large"
                  type="email"
                  placeholder="Your Email"
                  autofocus=""
                  autocomplete="email"
                />
                <FormErrors :errors="v$.form.email.$errors" />
              </div>
            </div>
            <div class="field">
              <div class="control">
                <input
                  v-model="form.password"
                  class="input is-large"
                  type="password"
                  placeholder="Your Password"
                  autocomplete="current-password"
                />
                <FormErrors :errors="v$.form.password.$errors" />
              </div>
            </div>
            <button
              type="button"
              class="button is-block is-info is-large is-fullwidth"
              @click="login"
              :disabled="isProcessing"
            >
              Sign In
            </button>
          </form>
        </div>

        <!-- 링크부 -->
        <p class="has-text-grey">
          <a href="#">Sign In With Google</a>&nbsp;
          <a href="#">Sign Up</a> &nbsp;·&nbsp;
          <a href="#">Need Help?</a>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
// 밸리데이션
import useVuelidate from "@vuelidate/core";
import { required, email, minLength, helpers } from "@vuelidate/validators";
import FormErrors from "../components/FormErrors.vue";
import useAuth from "../composition/useAuth";
const setupInitialData = () => {
  return {
    email: "",
    password: "",
  };
};

export default {
  setup() {
    return {
      ...useAuth(),
      v$: useVuelidate(),
    };
  },
  components: {
    FormErrors,
  },
  data() {
    return {
      form: setupInitialData(),
    };
  },
  methods: {
    async login() {
      const valid = await this.v$.$validate();
      if (valid) {
        this.v$.$reset();
        this.$store.dispatch("user/login", this.form);
      }
    },
  },
  watch: {
    // 로그인 상황 시 홈으로 이동
    isAuthenticated(value) {
      if (value) {
        this.$router.push("/");
      }
    },
  },
  validations() {
    return {
      form: {
        email: {
          required: helpers.withMessage("이메일은 필수입니다", required),
          email: helpers.withMessage("이메일 형식에 맞지 않습니다", email),
        },
        password: {
          required: helpers.withMessage("비밀번호는 필수입니다", required),
          minLength: helpers.withMessage(
            "비밀번호는 6글자이상입니다",
            minLength(6)
          ),
        },
      },
    };
  },
};
</script>

<style scoped>
.hero.is-success {
  background: #f2f6fa;
}
.hero .nav,
.hero.is-success .nav {
  -webkit-box-shadow: none;
  box-shadow: none;
}
.box {
  margin-top: 1rem;
}
.avatar {
  margin-top: -70px;
  padding-bottom: 20px;
}
.avatar img {
  padding: 5px;
  background: #fff;
  border-radius: 50%;
  -webkit-box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1),
    0 0 0 1px rgba(10, 10, 10, 0.1);
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
}
input {
  font-weight: 300;
}
p {
  font-weight: 700;
}
p.subtitle {
  padding-top: 1rem;
}
</style>
