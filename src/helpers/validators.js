import { helpers } from "@vuelidate/validators";

export const supportedFileType = (value) => {
  // 값이 빈값이면 true반환 (에러메시지 표시제외)
  if (!helpers.req(value)) {
    return true;
  }
  const allowedFormats = ["jpg", "png", "jpeg", "svg"];
  const extension = value.split(".").pop();
  return allowedFormats.includes(extension);
};
