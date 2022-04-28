// 인증과정에서 공통으로 사용되는 isProcessing, error 정보를 관리하기 위한 기능
// computed property와 state를 주로 사용함

import { useStore } from "vuex";
import { computed } from "vue";

export default function useAuth() {
  // state 활용위해 destructuring을 이용해 store -> state 접근
  const store = useStore(); // store = { state, mutations, .. }
  const { state } = store;
  const error = computed(() => state.user.auth.error);
  const isProcessing = computed(() => state.user.auth.isProcessing);
  const isAuthenticated = computed(() => store.getters["user/isAuthenticated"]);
  const user = computed(() => state.user.data);

  return {
    error,
    isProcessing,
    isAuthenticated,
    user,
  };
}
