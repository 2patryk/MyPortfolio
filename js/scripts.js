window.addEventListener('DOMContentLoaded', (event) => {

    WebFont.load({
        google: {
            families: ['Montserrat:300,400,600,700,800']
        }
    });

    AOS.init({
        once: true,
    });


    const menuButton = document.querySelector(".menuButton");
    const navLinks = document.querySelectorAll("nav > ul > li a");
    const body = document.querySelector("body");
    const colNav = document.querySelector("header");
    const tags = document.querySelectorAll(".tag");
    const tags_array = [...tags];
    let customMargin = 0;
    let vh = window.innerHeight * 0.01;
    let mobileView = window.innerWidth < 768 ? true : false;
    let newMobileView = mobileView;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    const myFittyElement = fitty('.tag .tag-in > span', {
        minSize: 8,
        maxSize: 300,
    });

    let fittyLength = myFittyElement.length;
    let fittyDone = 0;

    myFittyElement.forEach((value)=>{
        value.element.addEventListener('fit', function (e) {
                fittyDone++;
                if(fittyDone == fittyLength) updateTags();
            });
    })



    window.addEventListener('resize', debounce(function () {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        let newMobileView = window.innerWidth < 768 ? true : false;
        if (mobileView != newMobileView) {
            mobileView = newMobileView;
            updateTags();
        }
    }, 250));

    function updateTags() {
        customMargin = 0;  
        tags_array.forEach((value, index) => {
            if(!mobileView)
                customMargin += 30 + (50 * index / 10);
            else
                customMargin = 0;
            
            value.style.marginRight = customMargin + "px";
        })

        let newtags = tags_array.concat().sort((a, b) => {
            return (b.children[0].children[0].style.fontSize.slice(0, -2) - a.children[0].children[0].style.fontSize.slice(0, -2));
        })

        newtags.forEach((value, index) => {
            value.classList.forEach((inValue) => {
                if (inValue.startsWith("order"))
                    value.classList.remove(inValue);
            });
            if (mobileView)
                value.classList.add("order-" + (index + 1));
        })
    }


    menuButton.addEventListener('click', () => {
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
        navLinks[i].addEventListener("click", () => {
            colNav.classList.remove("overlay");
            menuButton.classList.remove("open");
            body.classList.remove("no-scroll");

        });
    }

    window.addEventListener('scroll', () => {
        var header = document.getElementById("header");
        var sticky = header.offsetTop;
        if (window.pageYOffset > sticky) {
            header.classList.add("sticky");
        } else {
            header.classList.remove("sticky");
        }
    });

    //from Underscore.js
    function debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };




});
