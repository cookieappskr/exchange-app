<template>
  <ModalBase ref="opportunityDealModal" :headerTitle="headerTitle">
    <div>
      <h1>
        User "{{ opportunity.fromUser.username }}" has an amazing offer for you!
      </h1>
      <template v-if="opportunity.fromExchange">
        <div class="card-image">
          <figure class="image is-4by3">
            <!-- TODO: Display Exchange Image -->
            <img :src="opportunity.fromExchange.image" />
          </figure>
        </div>
        <div class="info-container">
          <div class="info-heading">
            <p class="app-title">{{ opportunity.fromExchange.title }}</p>
            <p class="description">
              {{ opportunity.fromExchange.description }}
            </p>
          </div>
          <div class="info-value">
            <div class="info-value-title">Price:</div>
            <div class="info-value-money">
              ${{ opportunity.fromExchange.price }}
            </div>
          </div>
        </div>
      </template>
      <template v-if="opportunity.price">
        <div class="info-container">
          <div class="info-heading">
            <p class="app-title">
              "{{ opportunity.fromUser.username }}" wants to exchange price
            </p>
          </div>
          <div class="info-value">
            <div class="info-value-title">Price:</div>
            <div class="info-value-money">${{ opportunity.price }}</div>
          </div>
        </div>
      </template>
      <hr />
      <h1>For Yours...</h1>
      <div class="card-image">
        <figure class="image is-4by3">
          <!-- TODO: Display Exchange Image -->
          <img :src="opportunity.toExchange.image" />
        </figure>
      </div>
      <div class="info-container">
        <div class="info-heading">
          <p class="app-title">{{ opportunity.toExchange.title }}</p>
          <p class="description">{{ opportunity.toExchange.description }}</p>
        </div>
        <div class="info-value">
          <div class="info-value-title">Price:</div>
          <div class="info-value-money">
            ${{ opportunity.toExchange.price }}
          </div>
        </div>
      </div>
    </div>
    <!-- 버튼그룹 주입부 정의시작 -->
    <template #activator>
      <button class="button is-block is-success is-light is-fullwidth">
        View a deal
      </button>
    </template>
    <template #footerButtons>
      <button @click="acceptOpportunity" class="button is-success">
        Accept Deal
      </button>
      <button @click="declineOpportunity" class="button is-danger">
        Decline Deal
      </button>
    </template>
    <!-- //  버튼그룹 주입부 정의끝 -->
  </ModalBase>
</template>

<script>
import ModalBase from "./Modal.vue";
export default {
  props: {
    opportunity: {
      type: Object,
      required: true,
    },
  },
  components: {
    ModalBase,
  },
  computed: {
    modal() {
      return this.$refs.opportunityDealModal;
    },
    headerTitle() {
      return this.opportunity.fromExchange
        ? `Here is an offer for a ${this.opportunity.fromExchange.type}`
        : `Here is an offer for credits`;
    },
  },
  methods: {
    acceptOpportunity() {
      console.log("ACCEPT");
      this.$store.dispatch("opportunity/acceptOpportunity", {
        data: this.opportunity,
        onSuccess: this.modal.close,
      });
    },
    declineOpportunity() {
      console.log("DECLINE");
      this.$store.dispatch("opportunity/declineOpportunity", {
        data: this.opportunity,
        onSuccess: this.modal.close,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.info-container {
  display: flex;
  margin: 20px 0;
  .info-heading {
    flex: 1;
    font-size: 20px;
    padding-right: 30px;
    .app-title {
      font-weight: bold;
      font-size: 30px;
    }
  }
  .info-value {
    &-title {
      font-size: 20px;
      text-align: center;
    }
    &-money {
      font-size: 45px;
      font-weight: bold;
    }
  }
}
</style>
