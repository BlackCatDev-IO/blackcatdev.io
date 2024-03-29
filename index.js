const mobileMenuToggle = document.getElementById("menu-button");

AOS.init({
  duration: 700,
});

initSmoothScrolling();
disableScrollingOnMobileMenu();
addMobileMenuListeners();

function addMobileMenuListeners() {
  const mobileLinks = document.getElementsByClassName("close-menu");

  for (const link of mobileLinks) {
    link.addEventListener("click", closeMobileMenu);
  }
}

function closeMobileMenu() {
  mobileMenuToggle.checked = false;
  document.body.style.overflow = "scroll";
}

function disableScrollingOnMobileMenu() {
  mobileMenuToggle.addEventListener("change", (e) => {
    console.log("change");
    if (e.target.checked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
    }
  });
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
