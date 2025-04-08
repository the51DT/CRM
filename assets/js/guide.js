// contents router
function routerContent(route, event) {
  // Prevent the default behavior of the event (like a link click)
  event.preventDefault();

  // Load the new content into the .swiper-content element
  $(".swiper-content").load(route);

  // Remove the 'active' class from all buttons within .v-list-item
  $(".v-list-item > button").removeClass("active");

  // Add the 'active' class to the current target button
  if (event.currentTarget) {
    event.currentTarget.classList.add("active");
  } else {
    console.error("event.currentTarget is not available");
  }
}

$(function () {
  // 맨 처음 load
  $(".swiper-content").load("../components/guide/Home.html");

  /*
   ** theme switch
   */
  const themeLight = () => {
    $("body").data("theme", "light").removeClass("dark-mode");
    $(".theme-switch .theme-text").text("하양이");
  };

  const themeDark = () => {
    $("body").data("theme", "dark").addClass("dark-mode");
    $(".theme-switch .theme-text").text("까망이");
  };

  $(".toggle_switch input").on("change", ({ target }) => {
    $(target).prop("checked")
      ? localStorage.setItem("theme", "dark")
      : localStorage.removeItem("theme");
    $("body").data("theme") === "dark" ? themeLight() : themeDark();
  });

  $(() => {
    const currentTheme = localStorage.getItem("theme");
    const $toggleSwitch = $(".toggle_switch input");

    if (currentTheme === "dark") {
      $toggleSwitch.prop("checked", true);
      themeDark();
    } else {
      $toggleSwitch.prop("checked", false);
      themeLight();
    }
  });

  // guide lnb
  sideSwiper = new Swiper(".side-swiper", {
    slidesPerView: "auto",
    initialSlide: 0,
    resistanceRatio: 0,
    slideToClickedSlide: false,
    updateOnWindowResize: true,
    autoHeight: true,
    on: {
      slideChangeTransitionStart: function () {
        const slider = this;
        if (slider.activeIndex === 0) {
          menuButton.classList.add("cross");
        } else {
          menuButton.classList.remove("cross");
        }

        // $(".project-select").selectmenu("close");
      },
      slideChangeTransitionEnd: function () {
        const slider = this;
        if (slider.activeIndex === 1) {
          isMenuOpen = false; // Reset the menu state when the menu is fully closed
        }
      },
    },
  });
});
