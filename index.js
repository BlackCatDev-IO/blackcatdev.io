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
        duration: 1000,
        easing: "swing",
      };

      link.addEventListener("click", (e) => smoothScroll(scrollSettings));
    });
  });
}
