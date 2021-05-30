/*
This is a list of functions which I regularly use in my projects.
The plan is to maintain this file and let it grow so that this gets more useful over time.
contact me on jithin396@gmail.com
*/

const myTools = {
  //query selector function to get single element
  select: function (element) {
    return document.querySelector(element);
  },

  //query selector function to get multiple element
  selectAll: function (element) {
    return document.querySelectorAll(element);
  },

  //to toggle scroll, the element position should be fixed
  scrollOff: function (element) {
    this.select("html").style.overflow = "hidden";
    this.select(element).style.overflow = "hidden";
    return this;
  },

  //to turn the scroll on
  scrollOn: function (element) {
    this.select("html").style.overflow = "visible";
    this.select(element).style.overflow = "visible";
    return this;
  },

  //to scroll to an element
  scrollTo: function (element) {
    this.select(element).scrollIntoView();
    return this;
  },

  //returns true if an element is in viewport
  elementInViewport: function (element) {
    let el = this.select(element);
    var top = el.offsetTop;
    var left = el.offsetLeft;
    var width = el.offsetWidth;
    var height = el.offsetHeight;

    while (el.offsetParent) {
      el = el.offsetParent;
      top += el.offsetTop;
      left += el.offsetLeft;
    }

    return (
      top < window.pageYOffset + window.innerHeight &&
      left < window.pageXOffset + window.innerWidth &&
      top + height > window.pageYOffset &&
      left + width > window.pageXOffset
    );
  },

  //sending a simple email, mail should be the mailid to which user should send email
  simpleMail: function (mail, subject, message) {
    let mailto_link =
      "mailto:" + mail + "?subject=" + subject + "&body=" + message;
    win = window.open(mailto_link);
  },

  // scrollDirectionUp: function () {
  //   // print "false" if direction is down and "true" if up
  //   let value = oldScroll > scrollY;
  //   oldScroll = scrollY;
  //   return value;
  // };
};

export { myTools };
