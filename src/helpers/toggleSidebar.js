export const toggleSidebar = (setWidth) => {
  const screenWidth = window.innerWidth;

  setWidth(prevWidth => {
    let newWidth = prevWidth;

    if (screenWidth >= 1200) {
      // Desktop: toggle between 260 and 68
      newWidth = prevWidth === 260 ? 68 : 260;
    } else if (screenWidth >= 1024) {
      // Tablet/Small tablet: toggle between 68 and 0
      newWidth = prevWidth === 68 ? 0 : 68;
    } else if (screenWidth >= 768) {
      // Tablet/Small tablet: toggle between 68 and 0
      newWidth = prevWidth === 260 ? 0 : 260;
    } else {
      // Mobile: toggle between 0 and 260
      newWidth = prevWidth === 260 ? 0 : 260;
    }

    return newWidth;
  });
};
