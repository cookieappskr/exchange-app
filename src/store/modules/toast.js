// 실패.성공에 따른 토스트메시지 표시체
import { useToast } from "vue-toastification";
const toast = useToast();

export default {
  namespaced: true,
  actions: {
    success(_, message) {
      toast.success(message);
    },
    error(_, message) {
      toast.error(message);
    },
  },
};
