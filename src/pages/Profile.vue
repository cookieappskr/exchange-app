<template>
  <div class="page-wrapper">
    <div class="columns">
      <div class="container profile">
        <div class="section profile-heading">
          <div class="columns is-mobile is-multiline">
            <div class="column is-2">
              <figure class="image header-icon user-profile-image">
                <img class="is-rounded" :src="user?.avatar" />
              </figure>
            </div>
            <div class="column is-4-tablet is-10-mobile name">
              <div class="user-info">
                <p>
                  <span class="title is-bold">{{ user?.username }}</span>
                  <br />
                </p>
                <p class="tagline">{{ user?.info }}</p>
              </div>
              <ProfileModal :user="user" />
            </div>
            <div
              @click="selectedOpportunities = 'received'"
              :class="{ 'is-active': selectedOpportunities === 'received' }"
              class="stats-tab stats-tab-interactive column is-2-tablet is-4-mobile has-text-centered"
            >
              <p class="stat-val">Received</p>
              <p class="stat-key">{{ opportunities.length }} Opportunities</p>
            </div>
            <div
              @click="selectedOpportunities = 'sent'"
              :class="selectedOpportunities === 'sent' ? 'is-active' : ''"
              class="stats-tab stats-tab-interactive column is-2-tablet is-4-mobile has-text-centered"
            >
              <p class="stat-val">Sent</p>
              <p class="stat-key">
                {{ sendOpportunities.length }} Opportunities
              </p>
            </div>
            <div
              class="stats-tab column is-2-tablet is-4-mobile has-text-centered"
            >
              <p class="stat-val">{{ user?.credit }}</p>
              <p class="stat-key">Credits</p>
            </div>
          </div>
        </div>
        <!-- opportunities -->
        <div
          class="columns is-mobile is-multiline"
          v-if="selectedOpportunities === 'received'"
        >
          <template v-if="opportunities && opportunities.length > 0">
            <div
              class="column is-3-tablet is-6-mobile"
              v-for="item in opportunities"
              :key="item.id"
            >
              <div class="card">
                <div class="card-image" v-if="item.fromExchange">
                  <figure class="image is-4by3">
                    <img :src="item.fromExchange.image" />
                  </figure>
                </div>
                <div class="card-image" v-else>
                  <figure class="image is-4by3">
                    <img
                      src="https://cdn.pixabay.com/photo/2017/09/07/08/54/money-2724241__480.jpg"
                    />
                  </figure>
                </div>
                <div class="card-content">
                  <div class="media">
                    <div class="media-content">
                      <p class="title is-6" v-if="item.fromExchange">
                        <b>Offer:</b> {{ item.fromExchange.title }}
                      </p>
                      <p class="title is-6" v-else>
                        <b>Offer:</b> {{ item.price }}$
                      </p>
                      <p class="title is-6"><b>Request:</b> {{ item.title }}</p>
                      <p class="subtitle is-6">
                        <span
                          class="tag is-dark subtitle"
                          :class="[
                            { 'is-success': item.status === 'accepted' },
                            { 'is-danger': item.status === 'declined' },
                            { 'is-warning': item.status === 'pending' },
                          ]"
                          >{{ item.status }}</span
                        >
                      </p>
                    </div>
                  </div>
                  <div class="content">
                    <p v-if="item.fromExchange">
                      {{ item.fromExchange.description }}
                    </p>
                    <p v-else>User want to exchange you item form money</p>
                  </div>
                </div>
                <footer class="card-footer">
                  <OpportunityDealModal
                    :opportunity="item"
                    v-if="item.status === 'pending'"
                  />
                  <OpportunityResultModal :opportunity="item" v-else />
                </footer>
              </div>
              <br />
            </div>
          </template>
        </div>
        <!-- // End opportunities -->
        <!-- sent opportunities -->
        <div
          class="columns is-mobile is-multiline"
          v-if="selectedOpportunities === 'sent'"
        >
          <template v-if="sendOpportunities && sendOpportunities.length > 0">
            <div
              class="column is-3-tablet is-6-mobile"
              v-for="item in sendOpportunities"
              :key="item.id"
            >
              <div class="card">
                <div class="card-image" v-if="item.toExchange">
                  <figure class="image is-4by3">
                    <img :src="item.toExchange.image" />
                  </figure>
                </div>
                <div class="card-content">
                  <div class="media">
                    <div class="media-content">
                      <p class="title is-6"><b>Request:</b> {{ item.title }}</p>
                      <p class="title is-6" v-if="item.fromExchange">
                        <b>Offer:</b> {{ item.fromExchange.title }}
                      </p>
                      <p class="title is-6" v-else>
                        <b>Offer:</b> {{ item.price }}$
                      </p>
                      <p class="subtitle is-6">
                        <span
                          class="tag is-dark subtitle"
                          :class="[
                            { 'is-success': item.status === 'accepted' },
                            { 'is-danger': item.status === 'declined' },
                            { 'is-warning': item.status === 'pending' },
                          ]"
                          >{{ item.status }}</span
                        >
                      </p>
                    </div>
                  </div>
                  <div class="content">
                    <p v-if="item.fromExchange">
                      {{ item.fromExchange.description }}
                    </p>
                    <p v-else>Price exchange</p>
                  </div>
                </div>
              </div>
              <br />
            </div>
          </template>
        </div>
        <!-- // End send opportunities -->
      </div>
    </div>
  </div>
</template>

<script>
import useAuth from "../composition/useAuth";
import ProfileModal from "../components/ProfileModal.vue";
import OpportunityDealModal from "../components/OpportunityDealModal.vue";
import OpportunityResultModal from "../components/OpportunityResultModal.vue";

export default {
  components: {
    ProfileModal,
    OpportunityDealModal,
    OpportunityResultModal,
  },
  setup() {
    return {
      ...useAuth(),
    };
  },
  data() {
    return {
      selectedOpportunities: "received",
    };
  },
  computed: {
    opportunities() {
      return this.$store.state.opportunity.opportunities;
    },
    sendOpportunities() {
      return this.$store.state.opportunity.sendOppertunities;
    },
  },
  watch: {
    isAuthenticated(value) {
      if (!value) {
        this.$router.push("/login");
      }
    },
  },
  created() {
    this.$store.dispatch("opportunity/getOpportunities");
    this.$store.dispatch("opportunity/getSendOpportunities");
  },
};
</script>

<style scoped>
.link {
  font-weight: 500;
  color: rgb(79, 79, 172);
  text-decoration: underline;
}
.user-info {
  margin-bottom: 10px;
}
.stats-error {
  font-size: 40px;
  font-weight: bold;
  margin-top: 30px;
}
.delete-item {
  color: red;
}
.stats-tab {
  border-bottom: 2px solid transparent;
  transition: 0.5s;
}
.stats-tab:hover {
  cursor: pointer;
  border-bottom: 2px solid black;
}
.stats-tab.is-active {
  border-bottom: 2px solid black;
}
.stat-val {
  font-size: 2em;
  padding-top: 20px;
  font-weight: bold;
}
.stat-key {
  font-size: 1.4em;
  font-weight: 200;
}
.section.profile-heading
  .column.is-2-tablet.has-text-centered
  + .has-text-centered {
  border-left: 1px dotted rgba(0, 0, 0, 0.2);
}
.container.profile {
  margin-top: 1%;
}
.control.is-pulled-left span.select {
  margin-right: 5px;
  border-radius: 2px;
}
.modal-card .content h1 {
  padding: 40px 10px 10px;
  border-bottom: 1px solid #dadada;
}
.container.profile .profile-options .tabs ul li.link a {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f1f1f1;
}
.card-footer {
  justify-content: center;
  padding: 5px;
}
</style>
