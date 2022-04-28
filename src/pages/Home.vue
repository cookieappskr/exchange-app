<template>
  <div>
    <Hero :onSearchFilter="filterExchange" />
    <ExchangeList :exchanges="exchanges" />
    <Pagination
      :onNextPage="getMoreExchanges"
      :isFetching="isFetchingMoreData"
      :currentPage="currentPage"
    />
  </div>
</template>

<script>
import Hero from "../components/Hero.vue";
import ExchangeList from "../components/ExchangeList.vue";
import Pagination from "../components/Pagination.vue";
export default {
  name: "Home",
  components: {
    Hero,
    ExchangeList,
    Pagination,
  },
  data() {
    return {
      searchExchangeTitle: "",
    };
  },
  computed: {
    exchanges() {
      // return this.$store.state.exchange.items;
      return this.$store.getters["exchange/filterExchanges"](
        this.searchExchangeTitle
      ); // 함수형태로 정의된 getter
    },
    isFetchingMoreData() {
      return this.$store.state.exchange.pagination.isFetchingData;
    },
    currentPage() {
      return this.$store.getters["exchange/currentPage"];
    },
  },
  mounted() {
    // 화면에 표시될 때 실행됨
  },
  created() {
    // 한번만 실행되며, 이 이후 mounted 실행됨
    this.$store.dispatch("exchange/getExchanges");
  },
  methods: {
    getMoreExchanges({ page }) {
      this.$store.dispatch("exchange/getMoreExchanges", { page });
    },
    // Hero 컴포넌트에 인자로 넘겨지는 콜백함수로 Hero 컴포넌트의 searchText가 넘어옴
    filterExchange(searchText) {
      console.log(searchText);
      this.searchExchangeTitle = searchText;
    },
  },
};
</script>

<style lang="scss"></style>
