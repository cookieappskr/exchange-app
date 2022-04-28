<template>
  <div>
    <!-- 닫힘모드 : 팝업오픈 버튼 -->
    <!-- Slot으로부터 버튼 주입받기 (단, 액션은 직접 걸면 안되고 주위를 감싸고 걸어야 함!!!!)-->
    <template v-if="$slots.activator">
      <div @click="open">
        <slot name="activator" />
      </div>
    </template>
    <!-- 기본버튼은 activator가 없을 경우에만 표시됨 -->
    <button
      v-else
      @click="open"
      class="button is-block is-success is-light is-fullwidth"
    >
      Update Info
    </button>

    <!-- 열림모드 : -->
    <div :class="['modal', { 'is-active': isOpen }]">
      <div class="modal-background"></div>
      <div class="modal-card">
        <!-- 팝업 헤더 -->
        <header class="modal-card-head">
          <p class="modal-card-title">{{ headerTitle }}</p>
          <button @click="close" class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          <!-- 팝업 바디-->
          <slot />
        </section>

        <!-- 팝업 풋터 -->
        <footer class="modal-card-foot">
          <!-- Opportunity Deal 버튼표시부 -->
          <template v-if="$slots.footerButtons">
            <div>
              <slot name="footerButtons" />
            </div>
          </template>
          <!-- // Opportunity Deal 버튼표시부 끝 -->
          <button
            v-else
            @click="submit"
            class="button is-success"
            :disabled="isDisabled"
          >
            Save changes
          </button>
          <button @click="close" class="button">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    headerTitle: {
      type: String,
      default: "Confirmation window",
    },
    onModalSubmit: {
      type: Function,
      required: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    submit() {
      this.onModalSubmit({
        onSuccess: this.close,
      });
    },
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },
  },
};
</script>

<style></style>
