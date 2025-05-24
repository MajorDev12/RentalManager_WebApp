export const adjustSidebarWidth = (setWidth) => {
  const screenWidth = window.innerWidth;
  let newWidth;

  if (screenWidth >= 1200) {
    newWidth = 260; // Desktop
  } else if (screenWidth >= 1024) {
    newWidth = 68; // Laptop/Tablet
  } else if (screenWidth >= 768) {
    newWidth = 0; // Small tablet
  } else {
    newWidth = 0; // Mobile
  }

  setWidth(newWidth);
};
