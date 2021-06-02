import { myTools } from "./toolbox.js"; //my toolbox of js functions
import "./main.scss";

let myFunction = (function () {
  let width = window.innerWidth;
  let mode = "light";

  window.onload = function () {
    changewidth();
    if (width < 768) {
      document.body.scrollTop = document.documentElement.scrollTop = 0; // potential problem
      setTimeout(function () {
        myTools.scrollOff("body");
      }, 500);
    }
  };

  let toggleDark = () => {
    myTools.select("body").style.backgroundColor = "#000000";
    myTools.selectAll("p, h1, h4").forEach((elem) => {
      elem.style.color = "#ffffff";
    });
    myTools.selectAll(".card").forEach((elem) => {
      elem.style.backgroundColor = "#a8a8a8";
    });
    mode = "dark";
  };

  let toggleLight = () => {
    myTools.select("body").style.backgroundColor = "#ffffff";
    myTools.selectAll("p, h1, h4").forEach((elem) => {
      elem.style.color = "#000000";
    });
    myTools.selectAll(".card").forEach((elem) => {
      elem.style.backgroundColor = "#fafafa";
    });
    mode = "light";
  };

  //for smooth scroll, scroll event to be disabled while scrolling
  let smoothScroll = function () {
    //document.removeEventListener("scroll", scrollToTop);
    myTools.scrollOn("body");
    // setTimeout(function () {
    //   document.addEventListener("scroll", scrollToTop);
    // }, 500);
  };

  //to come back to top whenever page is loaded

  //for smooth scroll scroll event to be disabled while scrolling
  myTools.select(".arrowdown").addEventListener("click", smoothScroll);

  //for footer to work on banner screen
  myTools.selectAll("footer a").forEach((link) => {
    link.addEventListener("click", smoothScroll);
  });

  //sending mail
  myTools.select("#submit").addEventListener("click", () => {
    let mail = "jithinajiwebdesigns@gmail.com";
    let subject = myTools.select("#subject").value;
    let message = myTools.select("#message").value;
    myTools.select("#subject").value = "";
    myTools.select("#message").value = "";
    myTools.simpleMail(mail, subject, message);
  });

  let changewidth = function () {
    width = window.innerWidth;
    if (width < 768) {
      if (mode === "light") {
        toggleLight();
      } else {
        toggleDark();
      }
    } else {
      myTools.scrollOn("body");
      //these two line will fallback all styles and apply only default css styles for large screen
      toggleLight();
      myTools.select("p, h1, h2").removeAttribute("style");
      myTools.select("body").style.backgroundColor = "#fee166";
    }
  };

  window.addEventListener("resize", changewidth);

  //for image toggle from light to dark
  let toggleImage = function (elem) {
    if (elem.src.includes("dark.svg")) {
      elem.src = "./dist/assets/light.svg";
      myTools.select(".arrowdown").src = "./dist/assets/arrow-down.svg";
      elem.style.paddingBottom = "0px";
      toggleLight();
    } else {
      elem.src = "./dist/assets/dark.svg";
      elem.style.paddingBottom = "34px";
      myTools.select(".arrowdown").src = "./dist/assets/arrow-down-light.svg";
      toggleDark();
    }
  };

  myTools.select(".banner").addEventListener("click", () => {
    toggleImage(myTools.select(".banner"));
  });
})();
