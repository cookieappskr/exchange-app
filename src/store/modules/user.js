import { db } from "../../db";
import {
  onAuthStateChanged,
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  query,
  where,
  doc,
  collection,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

export default {
  namespaced: true,
  state() {
    return {
      // 로그인한 사용자의 정보만 저장하면 됨
      data: null,
      auth: {
        isProcessing: false,
        error: "",
      },
    };
  },
  getters: {
    isAuthenticated(state) {
      return !!state.data; // data == null then return false (undefined data에 유용)
    },
    isExchangeOwner: (state) => (exchangeUserId) =>
      state.data && exchangeUserId && state.data.id === exchangeUserId,
  },
  mutations: {
    setAuthIsProcessing(state, payload) {
      state.auth.isProcessing = payload;
    },
    setAuthError(state, payload) {
      state.auth.error = payload;
    },
    setUser(state, payload) {
      state.data = payload;
    },
    updateProfile(state, payload) {
      state.data = { ...state.data, ...payload }; // 업데이트 개념이므로 변경안된것은 유지되어야 함
    },
    updateCredit(state, payload) {
      state.data.credit += payload;
    },
  },
  actions: {
    // 프로필업데이트
    async updateProfile({ commit, dispatch }, { data, onSuccess }) {
      commit("setAuthIsProcessing", true);
      commit("setAuthError", "");

      const userDoc = doc(db, "users", data.id);

      // 기존에 exchange가 있는 경우 모두 지우고 다시 등록함
      if (data.exchanges) {
        delete data.exchanges;
      }

      try {
        // await setDoc(userDoc, data);
        await updateDoc(userDoc, data);
        commit("updateProfile", data);
        dispatch("toast/success", "Profile has been updated!", { root: true });
        onSuccess();
      } catch (e) {
        commit("setAuthError", e.message);
      } finally {
        commit("setAuthIsProcessing", false);
      }
    },

    // 로그인처리
    async login({ commit, dispatch }, { email, password }) {
      console.log("이메일 " + email + " 비밀번호 : " + password);
      // 로딩처리 및 에러초기화
      commit("setAuthIsProcessing", true);
      commit("setAuthError", "");

      // 로그인처리
      try {
        await signInWithEmailAndPassword(getAuth(), email, password);
      } catch (e) {
        commit("setAuthError", e.message);
        dispatch("toast/error", e.message, { root: true });
      } finally {
        commit("setAuthIsProcessing", false);
      }
    },

    // 액션 안에서 다른 액션을 호출하기 위해서 dispatch사용함
    async register({ commit, dispatch }, { email, password, username }) {
      // 로딩처리 및 에러초기화
      commit("setAuthIsProcessing", true);
      commit("setAuthError", "");

      // 인증관련 진행 시 try catch 구문활용 필요
      try {
        const { user } = await createUserWithEmailAndPassword(
          getAuth(),
          email,
          password
        );

        // 회원정보 데이터저장
        await dispatch("createUserProfile", {
          id: user.uid,
          username,
          avatar:
            "https://w1.pngwing.com/pngs/726/597/png-transparent-graphic-design-icon-customer-service-avatar-icon-design-call-centre-yellow-smile-forehead.png",
          credit: 0,
          exchanges: [],
        });

        return user;
      } catch (e) {
        commit("setAuthError", e.message);
        // 실패토스트
        dispatch("toast/error", e.message, { root: true }); // root : true 함으로써 루트에서 액션 서잋함
      } finally {
        // 성공/실패와 무관하게 항상실행됨
        commit("setAuthIsProcessing", false);
      }
    },

    // 회원정보저장
    async createUserProfile(_, { id, ...profile }) {
      await setDoc(doc(db, "users", id), { ...profile, id });
    },

    // 세션정보 확인
    onAuthChange({ commit, dispatch }, callback) {
      commit("setAuthIsProcessing", true);
      onAuthStateChanged(getAuth(), async (user) => {
        if (user) {
          await dispatch("getUserProfile", user);
          commit("setAuthIsProcessing", false);
          callback(user);
        } else {
          console.log("로그아웃");
          commit("setAuthIsProcessing", false);
          callback(null);
        }
      });
    },

    // 유저프로필 정보 확인
    async getUserProfile({ commit }, user) {
      // 유저정보 확인
      const docRef = doc(db, "users", user.uid);
      const snapshot = await getDoc(docRef);
      const userProfile = snapshot.data();

      // 유저등록 Exchange 항목확인
      const userExchangeQuery = query(
        collection(db, "exchanges"),
        where("user", "==", docRef)
      );
      const userExchangeSnapshot = await getDocs(userExchangeQuery);
      const userExchangeList = userExchangeSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // 데이터 정리
      const userWithProfile = {
        id: user.uid,
        email: user.email,
        ...userProfile,
        exchanges: userExchangeList, // 이게 마지막에 와야 함 ?? 왜 그런지는 모름
      };
      commit("setUser", userWithProfile);
    },

    // 로그아웃
    async logout({ commit }) {
      try {
        await signOut(getAuth());
        commit("setUser", null);
      } catch (e) {
        console.error("Cannot logut!");
      }
    },

    // 업로드 이미지
    async uploadImage(_, { bytes, name, onSuccess, onProgress }) {
      const storage = getStorage();
      const imageRef = ref(storage, name);

      const uploadTask = uploadBytesResumable(imageRef, bytes); // 진척률을 보여주기 위해 uploadBytes 대신 resumable사용
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // 상태변할 때 마다 호출되는 콜백함수
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => {
          console.error(error.message);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          onSuccess(downloadUrl);
        }
      );
    },
  },
};
