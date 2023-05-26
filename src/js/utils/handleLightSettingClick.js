// Image light setting
export const handleLightSettingClick = (ref) => {
  if (ref.classList.contains("hidden")) {
    ref.classList.add("flex");
    ref.classList.remove("hidden");

    return;
  }

  ref.classList.add("hidden");
  ref.classList.remove("flex");
};
