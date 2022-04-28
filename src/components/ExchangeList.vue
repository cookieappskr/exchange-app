<template>
  <section class="posts">
    <div class="container">
      <div class="posts-type">Latest Posts</div>
      <div class="columns is-multiline">
        <!-- Item -->
        <div
          v-for="item in exchanges"
          :key="item.id"
          class="column is-12-mobile is-6-tablet is-4-widescreen is-6-desktop"
        >
          <div class="item post-card bottom-border">
            <router-link
              :to="{ name: 'ExchangeDetail', params: { slug: item.slug } }"
            >
              <figure
                class="image is-2by1 item-figure background-img"
                :style="{
                  'background-image': `url(${item.image})`,
                }"
                alt=""
              ></figure>
              <div class="item-featured">
                <!-- 폰트사용 -->
                <div class="exchange-icon">
                  <font-awesome-icon icon="star" />
                </div>
              </div>
            </router-link>
            <div class="item-tags">
              <a
                v-for="tag in item.tags"
                :key="tag"
                class="button is-rounded"
                href="#"
                title="Some Title"
                >#{{ tag }}</a
              >
            </div>
            <h2 class="title item-title is-size-4 has-text-weight-extra-bold">
              <a class="item-link" href="#">{{ item.title }}</a>
            </h2>
            <div class="level">
              <div class="level-left">
                <div class="item-author">{{ item.user?.id }}</div>
              </div>
              <div class="level-right">
                {{ item.createdAt.toDate().toDateString() }}
              </div>
            </div>
          </div>
        </div>
        <!-- End of item -->
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    exchanges: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
.posts {
  padding-top: 70px;
}
.posts-type {
  font-size: 34px;
  margin-bottom: 10px;
  font-weight: bold;
}
.exchange-icon {
  color: #ffbc8c;
  height: 24px;
  width: 24px;
  display: flex;
  align-items: center;
}
</style>
