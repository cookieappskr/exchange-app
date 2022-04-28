<template>
  <ModalBase :onModalSubmit="updateProfile" ref="exchangeModal">
    <form>
      <div class="field">
        <label class="title">Username</label>
        <input class="input" v-model="userProfile.username" />
      </div>
      <!-- 아바타 파일업로드 영역 -->
      <div class="file has-name">
        <div>
          <label class="file-label">
            <input
              @change="handleUpload"
              class="file-input"
              type="file"
              name="resume"
            />
            <span class="file-cta">
              <span class="file-icon">
                <font-awesome-icon icon="upload" />
              </span>
              <span class="file-label"> Choose a file… </span>
            </span>
          </label>
        </div>
        <progress class="progress" :value="progress" max="100">
          {{ progress }}%
        </progress>
        <img
          v-if="userProfile.avatar"
          :src="userProfile.avatar"
          class="image-preview"
          alt=""
        />
      </div>
      <div class="field">
        <label class="title">Info about user</label>
        <input class="input" v-model="userProfile.info" />
      </div>
      <div class="field">
        <label class="title">Address</label>
        <input class="input" v-model="userProfile.address" />
      </div>
      <div class="field">
        <label class="title">Country</label>
        <input class="input" v-model="userProfile.country" />
      </div>
      <div class="field">
        <label class="title">Phone</label>
        <input class="input" v-model="userProfile.phone" />
      </div>
    </form>

    <!-- MobalBase 내에 버튼컴포넌트 주입하기 -->
    <template #activator>
      <button class="button is-block is-primary is-light is-fullwidth">
        Update Profile
      </button>
    </template>
    <!-- // 커스텀 컴포넌트 주입끝 -->
  </ModalBase>
</template>

<script>
import ModalBase from "./Modal.vue";
export default {
  // props는 직접 v-model로 연결하면 안되므로 data에 해당 내용을 중계해서 연결해야 함
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  components: {
    ModalBase,
  },
  data() {
    return {
      userProfile: { ...this.user },
      progress: 0,
    };
  },
  computed: {
    modal() {
      return this.$refs.exchangeModal;
    },
  },
  methods: {
    updateProfile() {
      // 성공 시 화면 닫히는 callback function을 같이 보냄
      this.$store.dispatch("user/updateProfile", {
        data: this.userProfile,
        // onSuccess: onSuccess, // 인자로 ({ onSuccess})이렇게 해 닫히지만 이 폼을 참조할 수 있게 ref를 정의해도 됨
        onSuccess: () => this.modal.close(), // computedProperty -> ref 참조해서
      });
      // this.isOpen = false; 이렇게 해도 되지만 이건 성공을 보장하지 못함
    },
    handleUpload(e) {
      const self = this; // 그냥 this.$store 하면 reader context를 참조하므로 에러발생함
      const file = e.target.files[0];
      const reader = new FileReader(); // 자바스크립트의 기본파일리더

      reader.readAsArrayBuffer(file);
      reader.onload = function () {
        self.$store.dispatch("user/uploadImage", {
          bytes: reader.result,
          name: file.name,
          onSuccess: (url) => {
            self.userProfile.avatar = url;
          },
          onProgress: (progress) => {
            self.progress = progress;
          },
        });
      };
    },
  },
};
</script>

<style scoped>
.image-preview {
  height: 200px;
}
.progress {
  margin: 15px;
}
</style>
