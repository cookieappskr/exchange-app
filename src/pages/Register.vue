<template>
  <div class="page-wrapper">
    <div class="container has-text-centered">
      <div class="column is-4 is-offset-4">
        <h3 class="title has-text-grey">Register</h3>

        <!-- 가입폼 -->
        <div class="box">
          <form>
            <div class="field">
              <div class="control">
                <input
                  class="input is-large"
                  type="email"
                  placeholder="Email"
                  autocomplete="email"
                  v-model="form.email"
                />
                <FormErrors :errors="v$.form.email.$errors" />
              </div>
            </div>
            <div class="field">
              <div class="control">
                <input
                  class="input is-large"
                  type="text"
                  placeholder="Username"
                  v-model="form.username"
                />
                <FormErrors :errors="v$.form.username.$errors" />
              </div>
            </div>
            <div class="field">
              <div class="control">
                <input
                  class="input is-large"
                  type="password"
                  placeholder="Password"
                  autocomplete="current-password"
                  v-model="form.password"
                />
                <FormErrors :errors="v$.form.password.$errors" />
              </div>
            </div>
            <div class="field">
              <div class="control">
                <input
                  class="input is-large"
                  type="password"
                  placeholder="Repeat the password"
                  v-model="form.repeatPassword"
                />
                <FormErrors :errors="v$.form.repeatPassword.$errors" />
              </div>
            </div>
            <button
              type="button"
              class="button is-block is-info is-large is-fullwidth"
              @click="register"
              :disabled="isProcessing"
            >
              Sign Up
            </button>
          </form>
        </div>

        <!-- 링크부 -->
        <p class="has-text-grey">
          <a>Sign In With Google</a>&nbsp; <a>Sign Up</a>&nbsp;·&nbsp;
          <a href="../">Need Help?</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
// 밸리데이션
import useVuelidate from "@vuelidate/core";
import {
  required,
  sameAs,
  minLength,
  email,
  helpers,
} from "@vuelidate/validators";
import FormErrors from "../components/FormErrors.vue";

// 사용자정보
import useAuth from "../composition/useAuth";

// 초기화
const setupInitialData = () => {
  return {
    email: "",
    password: "",
    repeatPassword: "",
    username: "",
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
    async register() {
      // 밸리데이션
      const isValid = await this.v$.$validate();
      if (isValid) {
        this.v$.$reset();
        // 데이터저장
        this.$store.dispatch("user/register", this.form);
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
        repeatPassword: {
          required: helpers.withMessage("비밀번호확인은 필수입니다", required),
          sameAs: helpers.withMessage(
            "비밀번호가 동일해야 합니다",
            sameAs(this.form.password)
          ),
        },
        username: {
          required: helpers.withMessage("유저이름은 필수입니다", required),
        },
      },
    };
  },

  /* lazy 방식으로 데이터가 변경된 경우에만 표시돔
  computed: {
    isProcessing() {
      return this.$store.state.user.register.isProcessing;
    },
    error() {
      return this.$store.state.user.register.error;
    },
  },*/

  /* useAuth composition을 이용해서 재사용처리함 
  computed: mapState("user", {
    // 첫번재 인자로 'user' module을 지정할 수 있음
    isProcessing: ({ register }) => register.isProcessing,
    error: ({ register }) => register.error,
  }),
  */
  // 에러메시지 출력 (computed는 값이 같을 경우에는 처리 안되므로, computed property를 watch함)
  watch: {
    // 로그인 시 홈으로 이동
    isAuthenticated(value) {
      if (value) {
        this.$router.push("/");
      }
    },
    /* 이 부분은 stor에서 toast로 처리하게 되어 필요없음
    error(message) {
      console.log(message);
      if (message) {
        alert(message);
      }
    }, */
    // 회원가입 후 에러상황과 프로세싱을 보고 완료여부 판단해서 메인으로 리다이렉팅함 (프로세스전 F -> 프로세스중 T-> 에러없으면 리다이렉팅
    /* 이 부분도 router에서 redirect 하므로 필요없음
    isProcessing(value, oldValue) {
      if (!value && oldValue && !this.error) {
        this.$router.push("/login");
      }
    },*/
  },
};
</script>
<style scoped>
/* Left formatting  */
/* .form-error {
    text-align: initial;
  } */
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
