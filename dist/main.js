(()=>{"use strict";const e={select:function(e){return document.querySelector(e)},selectAll:function(e){return document.querySelectorAll(e)},scrollOff:function(e){return this.select("html").style.overflow="hidden",this.select(e).style.overflow="hidden",this},scrollOn:function(e){return this.select("html").style.overflow="visible",this.select(e).style.overflow="visible",this},scrollTo:function(e){return this.select(e).scrollIntoView(),this},elementInViewport:function(e){let t=this.select(e);for(var o=t.offsetTop,l=t.offsetLeft,s=t.offsetWidth,n=t.offsetHeight;t.offsetParent;)t=t.offsetParent,o+=t.offsetTop,l+=t.offsetLeft;return o<window.pageYOffset+window.innerHeight&&l<window.pageXOffset+window.innerWidth&&o+n>window.pageYOffset&&l+s>window.pageXOffset},simpleMail:function(e,t,o){let l="mailto:"+e+"?subject="+t+"&body="+o;win=window.open(l)}};!function(){let t=window.innerWidth;window.onload=function(){n(),t<768&&(document.documentElement.scrollTop=0,setTimeout((function(){e.scrollOff("body")}),500))};let o=()=>{e.select("body").style.backgroundColor="#ffffff",e.selectAll("p, h1, h4").forEach((e=>{e.style.color="#000000"})),e.selectAll(".card").forEach((e=>{e.style.backgroundColor="#fafafa"}))},l=function(){e.elementInViewport(".banner")&&(document.documentElement.scrollTop=0,setTimeout((function(){e.scrollOff("body")}),200))},s=function(){document.removeEventListener("scroll",l),e.scrollOn("body"),setTimeout((function(){document.addEventListener("scroll",l)}),500)};e.select(".arrowdown").addEventListener("click",s),e.selectAll("footer a").forEach((e=>{e.addEventListener("click",s)})),e.select("#submit").addEventListener("click",(()=>{let t=e.select("#subject").value,o=e.select("#message").value;e.select("#subject").value="",e.select("#message").value="",e.simpleMail("jithinajiwebdesigns@gmail.com",t,o)}));let n=function(){t=window.innerWidth,t<768?(document.documentElement.scrollTop=0,setTimeout((function(){e.scrollOff("body")}),500),document.addEventListener("scroll",l),e.select(".arrowdown").addEventListener("click",s),e.selectAll("footer a").forEach((e=>{e.addEventListener("click",s)})),o()):(e.scrollOn("body"),document.removeEventListener("scroll",l),e.select(".arrowdown").removeEventListener("click",s),e.selectAll("footer a").forEach((e=>{e.removeEventListener("click",s)})),o(),e.select("p, h1, h2").removeAttribute("style"),e.select("body").style.backgroundColor="#fee166")};window.addEventListener("resize",n);e.select(".banner").addEventListener("click",(()=>{var t;(t=e.select(".banner")).src.includes("dark.svg")?(t.src="./dist/assets/light.svg",e.select(".arrowdown").src="./dist/assets/arrow-down.svg",t.style.paddingBottom="0px",o()):(t.src="./dist/assets/dark.svg",t.style.paddingBottom="34px",e.select(".arrowdown").src="./dist/assets/arrow-down-light.svg",e.select("body").style.backgroundColor="#000000",e.selectAll("p, h1, h4").forEach((e=>{e.style.color="#ffffff"})),e.selectAll(".card").forEach((e=>{e.style.backgroundColor="#a8a8a8"})))}))}()})();