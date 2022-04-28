<template>
  <div class="page-wrapper">
    <div class="container">
      <div class="form-container">
        <form>
          <div class="field">
            <label class="label">Type</label>
            <div class="control">
              <div class="select">
                <select v-model="form.type">
                  <option value="service">Service</option>
                  <option value="product">Product</option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label">Title</label>
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="Some Nice Product"
                v-model="form.title"
              />
              <FormErrors :errors="v$.form.title.$errors" />
            </div>
          </div>
          <div class="field">
            <label class="label">Description</label>
            <div class="control">
              <textarea
                class="textarea"
                placeholder="Some catchy description about product"
                v-model="form.description"
              >
              </textarea>
              <FormErrors :errors="v$.form.description.$errors" />
            </div>
          </div>
          <div class="field">
            <label class="label">Image Link</label>
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="https://unsplash...."
                v-model="form.image"
              />
              <FormErrors :errors="v$.form.image.$errors" />
            </div>
          </div>
          <div class="field">
            <label class="label">Price</label>
            <div class="control">
              <input
                class="input"
                type="number"
                placeholder="249"
                v-model="form.price"
              />
              <FormErrors :errors="v$.form.price.$errors" />
            </div>
          </div>
          <div class="field">
            <label class="label">Country</label>
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="Slovakia"
                v-model="form.country"
              />
            </div>
          </div>
          <div class="field">
            <label class="label">City</label>
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="Bratislava"
                v-model="form.city"
              />
            </div>
          </div>

          <!-- TODO: provide tags inputs -->
          <div class="field">
            <label class="label">Tags</label>
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="programming"
                @input="handleTags"
              />

              <!-- 태그목록  -->
              <div
                v-for="tag in form.tags"
                :key="tag"
                class="tag is-primary is-medium"
              >
                {{ tag }}
              </div>
            </div>
          </div>
          <div class="field is-grouped">
            <div class="control">
              <button class="button is-link" @click.prevent="createExchange">
                Submit
              </button>
            </div>
            <div class="control">
              <button class="button is-text">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { supportedFileType } from "../helpers/validators";
import useVuelidate from "@vuelidate/core";
import {
  required,
  minLength,
  minValue,
  url,
  helpers,
} from "@vuelidate/validators";
import FormErrors from "../components/FormErrors.vue";

const setupInitialData = () => {
  return {
    title: "",
    description: "",
    type: "product",
    image: "",
    price: 0,
    country: "",
    city: "",
    tags: [],
  };
};

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  components: {
    FormErrors,
  },
  data() {
    return {
      form: setupInitialData(),
    };
  },
  methods: {
    async createExchange() {
      const isValid = await this.v$.$validate();
      if (isValid) {
        // 밸리데이션 감지부 초기화
        this.v$.$reset();
        // alert(JSON.stringify(this.form));
        this.$store.dispatch("exchange/createExchange", {
          data: this.form,
          onSuccess: () => {
            this.form = setupInitialData();
          },
        });
      }
    },
    handleTags(event) {
      const { value } = event.target;
      if (
        value &&
        value.trim().length > 1 &&
        (value.substr(-1) === "," || value.substr(-1) === " ")
      ) {
        const _value = value.split(",")[0].trim();

        // 중복체크
        if (!this.form.tags.includes(_value)) {
          this.form.tags.push(_value);
        }
        event.target.value = "";
      }
    },
  },
  validations() {
    return {
      form: {
        title: {
          required: helpers.withMessage("타이틀은 필수입니다", required),
          minLength: helpers.withMessage(
            "타이틀은 최소 10글자 이상이어야 합니다.",
            minLength(10)
          ),
        },
        description: {
          required: helpers.withMessage("설명은 필수입니다.", required),
        },
        type: {
          required: helpers.withMessage("타입은 필수입니다", required),
        },
        image: {
          required: helpers.withMessage("이미지는 필수입니다", required),
          url: helpers.withMessage("이미지는 URL형식에 맞아야 합니다", url),
          supportedFileType: helpers.withMessage(
            "파일타입은 .png, .jpg만 등록가능합니다",
            supportedFileType
          ),
        },
        price: {
          required: helpers.withMessage("가격은 필수입니다", required),
          minValue: helpers.withMessage(
            "가격은 10원 이상이어야 합니다",
            minValue(10)
          ),
        },
        country: {},
        city: {},
        tags: {},
      },
    };
  },
};
</script>

<style scoped>
.form-container {
  max-width: 960px;
  margin: 0 auto;
  margin-top: 40px;
}
.tag {
  margin: 3px;
}
</style>
