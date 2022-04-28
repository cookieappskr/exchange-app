// import { db } from "../../db";

import {
  doc,
  Timestamp,
  addDoc,
  collection,
  getDocs,
  getDoc,
  query,
  where,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "../../db";

const extractDataFromOpportunity = async (opportunity, id) => {
  // 이건 있을 수도 있고 없을수도 있으므로 (돈으로 줄 때는 from 상품이 없음)
  if (opportunity.fromExchange) {
    const fromExchangeDoc = await getDoc(opportunity.fromExchange);
    opportunity.fromExchange = {
      ...fromExchangeDoc.data(),
      id: fromExchangeDoc.id,
    };
  }
  const fromUserDoc = await getDoc(opportunity.fromUser);
  opportunity.fromUser = { ...fromUserDoc.data(), id: fromUserDoc.id };
  const toExchangeDoc = await getDoc(opportunity.toExchange);
  opportunity.toExchange = { ...toExchangeDoc.data(), id: toExchangeDoc.id };
  opportunity.id = id;

  return opportunity;
};

export default {
  namespaced: true,
  state() {
    return {
      opportunities: [],
      sendOppertunities: [],
    };
  },
  mutations: {
    setOpportunities(state, { resource, payload }) {
      state[resource] = payload;
    },
    setOpportunityStatus(state, { id, status }) {
      const index = state.opportunities.findIndex((o) => o.id === id);
      state.opportunities[index].status = status;
    },
  },
  actions: {
    async getOpportunities({ rootState, dispatch, commit }) {
      //유저정보
      const userId = rootState.user.data.id;
      if (!userId) {
        dispatch("toast/error", "User is not logged in!", { root: true });
      } else {
        // 쿼리
        const opportunityQuery = query(
          collection(db, "opportunities"),
          where("toUser", "==", doc(db, "users", userId)) // 이걸 'users' + userId 형태로 하면 안됨
        );
        const snapshot = await getDocs(opportunityQuery);
        const results = await Promise.all(
          // extract에 await를 하지 않으면 에러발생. await 처리하면 promiss 반환. 이걸 처리하기 위해 await Promiss.all()처리함
          snapshot.docs.map((doc) =>
            extractDataFromOpportunity(doc.data(), doc.id)
          )
        );
        commit("setOpportunities", {
          resource: "opportunities",
          payload: results,
        });
      }
    },
    async getSendOpportunities({ rootState, dispatch, commit }) {
      // 유저정보
      const userId = rootState.user.data.id;
      if (!userId) {
        dispatch("toast/error", "유저정보가 없습니다", { root: true });
      } else {
        // 쿼리생성
        const opportunityQuery = query(
          collection(db, "opportunities"),
          where("fromUser", "==", doc(db, "users", userId))
        );
        const snapshot = await getDocs(opportunityQuery);
        // 데이터 추출
        const results = await Promise.all(
          snapshot.docs.map((doc) =>
            extractDataFromOpportunity(doc.data(), doc.id)
          )
        );
        // 데이터저장
        commit("setOpportunities", {
          resource: "sendOppertunities",
          payload: results,
        });
      }
    },

    // 거래실행
    async createOpportunity({ dispatch, commit }, { data, onSuccess }) {
      const opportunity = {
        title: data.title,
        createdAt: Timestamp.fromDate(new Date()),
        toUser: doc(db, "users", data.toUserId),
        fromUser: doc(db, "users", data.fromUserId),
        toExchange: doc(db, "exchanges", data.toExchangeId),
        status: "pending",
      };

      if (data.fromExchangeId) {
        opportunity.fromExchange = doc(db, "exchanges", data.fromExchangeId);
      } else {
        opportunity.price = data.price;
      }

      // 거래정보 생성
      await addDoc(collection(db, "opportunities"), opportunity);

      // 크래딧정보 DB차감 (금전 거래일 경우만)
      if (opportunity.price) {
        // 정보저장
        await updateDoc(opportunity.fromUser, {
          credit: increment(-opportunity.price),
        });
        // 크래딧 정보 상태값 업데이트
        commit("user/updateCredit", -opportunity.price, { root: true });
      }

      await dispatch("toast/success", "Opportunity was send!!", { root: true });
      onSuccess();
    },

    // 거래승인 (판매완료 : 크래딧 증가)
    async acceptOpportunity({ dispatch, commit }, { data, onSuccess }) {
      // 판매승인 상태변경
      const docRef = doc(db, "opportunities", data.id);
      await updateDoc(docRef, { status: "accepted" });

      // 크래딧정보 증가 (금전 거래일 경우만)
      if (data.price) {
        // 정보저장
        const toUserRef = doc(db, "users", data.toUser.id);
        await updateDoc(toUserRef, {
          credit: increment(data.price),
        });
        commit("user/updateCredit", data.price, { root: true });
      }

      commit("setOpportunityStatus", { id: data.id, status: "accepted" });
      dispatch("toast/success", "Opportunity was accepted", { root: true });
      onSuccess();
    },

    // 거래거절 (구매자에게 리펀드 필요)
    async declineOpportunity({ dispatch, commit }, { data, onSuccess }) {
      // 상태변경
      const docRef = doc(db, "opportunities", data.id);
      await updateDoc(docRef, { status: "declined" });

      // 구매자 리펀드
      if (data.price) {
        const fromUserRef = doc(db, "users", data.fromUser.id);
        await updateDoc(fromUserRef, {
          credit: increment(data.price),
        });
        // 나말고 다른사람 데이터를 바꿨기 때문에 굳이 상태값을 업데이트 할 필요는 없음
      }
      commit("setOpportunityStatus", { id: data.id, status: "declined" });
      dispatch("toast/success", "Opportunity was declined", { root: true });
      onSuccess();
    },
  },
};
