AOS.init({
  duration: 700,
});

addMobileMenuListeners();

initSmoothScrolling();

function addMobileMenuListeners() {
  const mobileLinks = document.getElementsByClassName("close-menu");
  mobileLinks[0].addEventListener("click", closeMobileMenu);

  for (const link of mobileLinks) {
    link.addEventListener("click", closeMobileMenu);
  }
}

function closeMobileMenu() {
  let mobileMenuToggle = document.getElementById("menu-button");
  mobileMenuToggle.checked = false;
}

function initSmoothScrolling() {
  const sectionLinks = [
    "hero-section",
    "services",
    "services",
    "projects",
    "about",
    "contact",
  ];

  sectionLinks.forEach((section) => {
    const linkList = document.querySelectorAll(`[href='#${section}']`);

    linkList.forEach((link) => {
      const navSection = document.getElementById(section);

      const scrollSettings = {
        toElement: navSection,
        duration: 1500,
        easing: "swing",
      };

      link.addEventListener("click", (e) => smoothScroll(scrollSettings));
    });
  });
}

// detect keyboard users

const keyboardUserCssClass = "keyboardUser";

function setIsKeyboardUser(isKeyboard) {
  const { body } = document;
  if (isKeyboard) {
    body.classList.contains(keyboardUserCssClass) ||
      body.classList.add(keyboardUserCssClass);
  } else {
    body.classList.remove(keyboardUserCssClass);
  }
}

// Disables input outlines except for when user is navigating via 
// tab key to maintain accessibility
document.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    setIsKeyboardUser(true);
  }
});

document.addEventListener("click", (e) => {
  // Pressing ENTER on buttons triggers a click event with coordinates to 0
  setIsKeyboardUser(!e.screenX && !e.screenY);
});

document.addEventListener("mousedown", (e) => {
  setIsKeyboardUser(false);
});
