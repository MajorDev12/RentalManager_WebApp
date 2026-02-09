// helpers/navigation.js
let navigator;

export const setNavigator = (navigate) => {
  navigator = navigate;
};

export const navigateTo = (path) => {
  if (navigator) {
    navigator(path);
  }
};
