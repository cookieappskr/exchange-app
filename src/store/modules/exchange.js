import { db } from "../../db";
import slugify from "slugify";
import {
  getDocs,
  getDoc,
  query,
  where,
  startAfter,
  startAt,
  limit,
  doc,
  addDoc,
  collection,
  Timestamp,
} from "firebase/firestore";

const initPagination = () => ({
  itemCount: 2,
  lastItem: null,
  paginationHistory: [],
  isFetchingData: false, // 페이징 데이터 가오ㄴ지 여
});

// module은 createStore에 사용될 소스이므로 createStore 할 필요없음
export default {
  namespaced: true, // action 등 처리할 때 네임스페이스를 지정해 주어야 함 (getExchagnes -> exchange/getExchange)
  state() {
    return {
      items: [],
      item: {}, // 디테일 조회용 State 정보로 저장할 필요가 없으므로 이걸로 퉁쳐서 저장함
      pagination: initPagination(),
    };
  },
  mutations: {
    setExchanges(state, payload) {
      state.items = payload;
    },
    setExchange(state, payload) {
      state.item = payload;
    },
    setLastItem(state, payload) {
      state.pagination.lastItem = payload;
    },
    setPaginationHistory(state, payload) {
      state.pagination.paginationHistory.push(payload);
    },
    setIsFetchingData(state, payload) {
      state.pagination.isFetchingData = payload;
    },
    resetPagination(state) {
      state.pagination = initPagination();
    },
  },
  actions: {
    // Deal 생성 (상품정보, 사는 사람정보를 Deal정보에 저장)
    async createDeal({ rootState, dispatch }, { data, onSuccess }) {
      // 구매자 정보 조회
      data.userId = rootState.user.data.id;

      // 구매정보 저장
      const results = await addDoc(collection(db, "deals"), data);
      dispatch("toast/success", "성공적으로 등록되었습니다", { root: true });
      console.log("구매정보 저장 : ", results);

      // 성공콜백함수 호출
      onSuccess();
    },

    // context = { state, commit }
    async getExchanges({ commit, state }) {
      // 페이징 히스토리 초기화
      commit("resetPagination");

      // 데이터조회
      const exchangeQuery = query(
        collection(db, "exchanges"),
        limit(state.pagination.itemCount)
      );
      const snapshot = await getDocs(exchangeQuery);

      // 데이터처리
      const results = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      //   const results = await _fetchExchanges(); // promise
      commit("setExchanges", results);

      // 페이징처리용 마지막아이템 저장
      commit("setLastItem", snapshot.docs[snapshot.docs.length - 1]);
      commit("setPaginationHistory", snapshot.docs[0]);
    },

    // 페이징용 데이터조회함수
    async getMoreExchanges({ commit, state }, { page }) {
      // 데이터 패칭처리
      if (state.pagination.isFetchingData) {
        return;
      }
      commit("setIsFetchingData", true);

      // 쿼리
      let exchangeQuery;
      if (page === "next") {
        exchangeQuery = query(
          collection(db, "exchanges"),
          startAfter(state.pagination.lastItem),
          limit(state.pagination.itemCount)
        );
      } else {
        const lastItemIndex = state.pagination.paginationHistory.length - 1;
        const previousItem =
          state.pagination.paginationHistory[lastItemIndex - 1];

        // 첫페이지이면 페칭안함
        if (!previousItem) {
          commit("setIsFetchingData", false);
          return;
        }
        state.pagination.paginationHistory.splice(lastItemIndex, 1); // 나중을 위해 히스토리 현재찾는 것 기준으로 이후것은 잘라내기
        exchangeQuery = query(
          collection(db, "exchanges"),
          startAt(previousItem),
          limit(state.pagination.itemCount)
        );
      }
      // 조회 및 패칭 완료처리
      const snapshot = await getDocs(exchangeQuery);
      commit("setIsFetchingData", false);

      // 데이터처리
      if (snapshot.docs.length === 0) {
        return;
      }
      const results = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      commit("setExchanges", results);

      // 페이징처리용 마지막아이템 저장
      commit("setLastItem", snapshot.docs[snapshot.docs.length - 1]);

      if (page === "next") {
        commit("setPaginationHistory", snapshot.docs[0]);
      }
    },

    // 생성
    async createExchange({ rootState, dispatch }, { data, onSuccess }) {
      // 콘텐츠에 유저정보를 연결하는 좋은 방법 => 유저아이디만 저장하는게 아니라 유저ref를 전달하면 나중에 찾기쉬움 (중요중요중요)
      // 유저Ref 확인 및 정보추가
      const userRef = doc(db, "users", rootState.user.data.id);
      data.user = userRef;
      data.slug = slugify(data.title, {
        replacement: "-",
        lower: true,
        strict: true,
      });
      data.createdAt = Timestamp.fromDate(new Date());

      // DB저장
      const results = await addDoc(collection(db, "exchanges"), data);
      dispatch("toast/success", "성공적으로 등록되었습니다", { root: true }); // 루트모듈에서 처리해야 하므로
      console.log(results);

      // State업데이트
      // commit("setExchange", results);

      // 콜백함수 처리
      onSuccess();
    },

    // 상세정보 조회
    async getExchangeBySlug({ commit }, slug) {
      // 기존정보 안보이게 초기화
      commit("setExchange", {});

      // 새정보 쿼리 및 저장하기
      const docQuery = query(
        collection(db, "exchanges"),
        where("slug", "==", slug)
      );
      const snapshot = await getDocs(docQuery);
      const result = snapshot.docs[0].data();
      result.id = snapshot.docs[0].id; // id 생성

      // 유저정보 추가하기 (user를 ID가 아니라 ref형태로 저장해서 바로 getDoc할 수 있음)
      const userSnapshot = await getDoc(result.user);
      result.user = userSnapshot.data();
      result.user.id = userSnapshot.id;

      commit("setExchange", result);
    },

    // 유저정보 확인
  },
  // Getters
  getters: {
    currentPage(state) {
      if (!state.pagination.paginationHistory) {
        return;
      }
      return state.pagination.paginationHistory.length;
    },
    filterExchanges: (state) => (searchText) => {
      const { items } = state;
      if (!searchText) {
        return items;
      }
      const filteredExchanges = items.filter((item) => {
        return (
          item.title &&
          item.title.toLowerCase().includes(searchText.toLowerCase())
        );
      });
      return filteredExchanges;
    },
  },
};
