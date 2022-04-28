<template>
  <ModalBase
    :onModalSubmit="createOpportunity"
    :isDisabled="!isAllowedPrice || hasNotEnoughtCredit"
    ref="exchangeModal"
    :headerTitle="'Exchange info'"
  >
    <!-- 닫힘모드 : 오픈버튼 주입 -->
    <template #activator>
      <button class="button is-large is-danger is-outlined m-b-sm is-fullwidth">
        Make a deal
      </button>
    </template>

    <!-- 열림모드 : 내용부 -->
    <div class="deal">
      <div class="deal-highlight">{{ exchange.user.username }}'s Offer</div>
      <div class="deal-wrapper">
        <div>Offering {{ exchange.type }}</div>
        <div>{{ exchange.title }}({{ exchange.price }}$)</div>
      </div>
      <div class="deal-highlight">Your Offer</div>
      <div class="counter-offer">
        <div class="field">
          Would you prefer to exchange credit ?
          <label class="checkbox is-large">
            <input type="checkbox" v-model="isPriceSelected" />
            Yes
          </label>
        </div>
        <div v-if="isPriceSelected">
          <div class="field">
            <label class="label">How Much Credit ?</label>
            <div class="control">
              <input
                :disabled="!isPriceSelected"
                class="input"
                type="number"
                placeholder="40"
                v-model="selectedPrice"
              />
              <i v-if="!hasNotEnoughtCredit">
                You don't have enough of credit
              </i>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="field">
            <label class="label">Exchange</label>
            <div class="control">
              <div class="select">
                <select v-model="selectedExchange" :disabled="isPriceSelected">
                  <option
                    v-for="item in userExchanges"
                    :key="item.slug"
                    :value="item"
                  >
                    {{ item.title }}
                  </option>
                </select>
              </div>
              <!-- 상품가격 -->
              <div>
                Your item price :
                <span class="deal-highlight"
                  >{{ selectedExchange.price }}$</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- 제출가격 -->
        <div>Offered Price : {{ offeredPrice }}</div>
        <div class="mb-1 message is-small" :class="percentageDifferenceClass">
          <div class="message-body">
            {{ differenceString }}
          </div>
        </div>

        <!-- 크래딧부족 알림 영역 -->
        <div v-if="hasNotEnoughCredit" class="message is-danger is-small">
          <div class="message-body">
            You don't have enough credit for this transaction. Remaining credit
            : {{ user.credit }}$
          </div>
        </div>
        <i>Allowed difference is {{ ALLOWED_PRICE_DIFFERENCE }}%</i>
      </div>
    </div>
  </ModalBase>
</template>

<script>
import ModalBase from "./Modal.vue";
export default {
  components: {
    ModalBase,
  },
  props: {
    exchange: {
      type: Object,
      required: true,
    },
    userExchanges: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      opportunity: {},
      selectedPrice: 0,
      isPriceSelected: false,
      selectedExchange: this.userExchanges[0],
      ALLOWED_PRICE_DIFFERENCE: 20,
    };
  },
  computed: {
    user() {
      return this.$store.state.user.data;
    },
    hasNotEnoughCredit() {
      if (!this.isPriceSelected) {
        return false;
      }
      return this.user.credit < this.selectedPrice;
    },
    modal() {
      return this.$refs.exchangeModal;
    },
    offeredPrice() {
      // 가격입력란이 활성화되면 입력란 가격이, 아니면 선택상품의 가격이 .. 그것도 아니면 0가 출력
      if (this.isPriceSelected) {
        return this.selectedPrice;
      } else if (this.selectedExchange) {
        return this.selectedExchange.price;
      } else {
        return 0;
      }
    },
    differenecePercentage() {
      if (this.offeredPrice === null || this.offeredPrice === "") {
        return null;
      }
      const priceDifferenece = this.offeredPrice - this.exchange.price;
      return Math.round(
        ((priceDifferenece / this.exchange.price) * 100 * 100) / 100
      );
    },
    isAllowedPrice() {
      if (!this.offeredPrice) {
        console.log("Offered price 없음");
        return false;
      }
      return (
        this.differenecePercentage <= this.ALLOWED_PRICE_DIFFERENCE &&
        this.differenecePercentage >= this.ALLOWED_PRICE_DIFFERENCE * -1
      );
    },
    percentageDifferenceClass() {
      return this.isAllowedPrice ? "is-success" : "is-danger";
    },
    differenceString() {
      if (this.differenecePercentage === null) {
        return "";
      }
      if (this.differenecePercentage === 0) {
        return "You are offering the exact same amount";
      }
      const differenceText =
        this.differenecePercentage > 0 ? "highter" : "lower";
      return `Offered price is ${this.differenecePercentage}% ${differenceText} than exchange price`;
    },
  },
  methods: {
    createOpportunity({ onSuccess }) {
      // 객체생성
      const data = {
        title: this.exchange.title,
        fromUserId: this.user.id,
        fromExchangeId: this.selectedExchange?.id,
        toExchangeId: this.exchange.id,
        toUserId: this.exchange.user.id,
        price: this.selectedPrice,
      };

      // 데이터확인 및 생성
      this.$store.dispatch("opportunity/createOpportunity", {
        data,
        onSuccess,
      });
    },
  },
  watch: {
    isPriceSelected(value) {
      if (value) {
        this.selectedExchange = null;
      } else {
        this.selectedExchange = this.userExchanges[0];
      }
    },
  },
};
</script>

<style scoped lang="scss">
.price {
  padding: 7px;
  &-allowed {
    background-color: #cdeacd;
  }
  &-declined {
    background-color: #ffc2c2;
  }
}
.deal-wrapper {
  margin-bottom: 10px;
}
.counter-offer,
.deal-wrapper {
  border: 2px solid grey;
  padding: 10px;
  margin-top: 10px;
  &-title {
    font-size: 21px;
    margin: 5px 0;
    font-weight: bold;
  }
}
.deal {
  font-size: 19px;
  &-highlight {
    font-size: 19px;
    font-weight: bold;
  }
}
.disabled {
  &.field {
    input,
    textarea,
    select {
      pointer-events: none;
      color: grey;
    }
    label {
      color: grey;
    }
  }
}
</style>
