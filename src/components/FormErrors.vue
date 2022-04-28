<template>
  <!-- 에러영역 -->
  <div v-for="error of errors" :key="error.$uid" class="form-error">
    <!-- 에러특정 및 에러메시지 표시 -->
    <div class="help is-danger">
      {{ error.$message }}
    </div>
  </div>
  <!-- // 에러영역 끝 -->
</template>

<script>
export default {
  props: {
    errors: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style></style>
