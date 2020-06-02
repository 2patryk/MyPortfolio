window.addEventListener("DOMContentLoaded", (event) => {
  WebFont.load({
    google: {
      families: ["Montserrat:300,400,500,600,700,800"],
    },
    active: fitMe,
  });

  AOS.init({
    once: true,
  });

  const menuButton = document.querySelector(".menuButton");
  const navLinks = document.querySelectorAll("nav > ul > li");
  const body = document.querySelector("body");
  const colNav = document.querySelector("header");
  const tags = document.querySelectorAll(".tag");
  const tags_array = [...tags];
  let customMargin = 0;
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
  let mobileView = window.innerWidth < 768 ? true : false;
  let newMobileView = mobileView;
  const translator = new Translator({
    persist: false,
    languages: ["en", "pl"],
    defaultLanguage: "en",
    detectLanguage: true,
    filesLocation: "/i18n",
  });

  translator.load();

  function fitMe() {
    const myFittyElement = fitty(".tag .tag-in > span", {
      minSize: 8,
      maxSize: 300,
    });
    let fittyLength = myFittyElement.length;
    let fittyDone = 0;

    myFittyElement.forEach((value) => {
      value.element.addEventListener("fit", function (e) {
        fittyDone++;
        if (fittyDone == fittyLength) updateTags();
      });
    });
  }

  updateMenuActive(window.scrollY);

  window.addEventListener(
    "resize",
    debounce(function () {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      
      let newMobileView = window.innerWidth < 768 ? true : false;
      if (mobileView != newMobileView) {
        mobileView = newMobileView;
        updateTags();
      }
    }, 250)
  );

  window.addEventListener("scroll", () => {
    updateMenuActive(window.scrollY);
    var header = document.getElementById("header");
    var sticky = header.offsetTop;
    if (window.pageYOffset > sticky) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  });

  menuButton.addEventListener("click", () => {
    if (colNav.classList.contains("overlay")) {
      colNav.classList.remove("overlay");
      menuButton.classList.remove("open");
      body.classList.remove("no-scroll");
    } else {
      colNav.classList.add("overlay");
      menuButton.classList.add("open");
      body.classList.add("no-scroll");
    }
  });

  for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].children[0].addEventListener("click", () => {
      colNav.classList.remove("overlay");
      menuButton.classList.remove("open");
      body.classList.remove("no-scroll");
    });
  }

  const defaultSwiperConfig = {
    slidesPerView: "auto",
    slidesOffsetAfter: 100,
    slidesOffsetBefore: 100,
    freeMode:true,
    // centeredSlides:true,
    observer: true,  
    observeParents: true,
    slideClass: "slide",
    // centeredSlides:true,
    
    // Navigation arrows
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  }

  var swiperLeft = new Swiper(".swiper-container--right", {
    
    initialSlide:0,
    ...defaultSwiperConfig
  });

  var swiperRight = new Swiper(".swiper-container--left", {
    
    initialSlide:4,
    ...defaultSwiperConfig
  });


  //from Underscore.js
  function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  function updateMenuActive(scrollY) {
    navLinks.forEach((element) => {
      const href = element.children[0].getAttribute("href");
      const ref = document.children[0].querySelector(href);
      if (
        ref.offsetTop - 1 <= scrollY &&
        ref.offsetTop + ref.offsetHeight > scrollY
      ) {
        navLinks.forEach((inElement) => {
          inElement.classList.remove("active");
        });
        element.classList.add("active");
      } else {
        element.classList.remove("active");
      }
    });
  }

  function updateTags() {
    customMargin = 0;
    tags_array.forEach((value, index) => {
      if (!mobileView) {
        customMargin += 30 + (50 * index) / 10;
        value.style.marginRight = customMargin + "px";
      } else {
        customMargin = "";
        value.style.marginRight = "";
      }
    });

    let newtags = tags_array.concat().sort((a, b) => {
      return (
        b.children[0].children[0].style.fontSize.slice(0, -2) -
        a.children[0].children[0].style.fontSize.slice(0, -2)
      );
    });

    newtags.forEach((value, index) => {
      value.classList.forEach((inValue) => {
        if (inValue.startsWith("order")) value.classList.remove(inValue);
      });
      if (mobileView) value.classList.add("order-" + (index + 1));
    });
  }
});
