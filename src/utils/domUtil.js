/*
 * Copyright (c) 2023 by Allen_sun email: Allen_sun_js@hotmail.com, All Rights Reserved.
 */
export const setDocumentTitle = function (title) {
  document.title = title;
  const ua = navigator.userAgent;
  // eslint-disable-next-line
  const regex = /\bMicroMessenger\/([\d\.]+)/;
  if (regex.test(ua) && /ip(hone|od|ad)/i.test(ua)) {
    const i = document.createElement("iframe");
    // i.src = "/favicon.ico";
    // i.style.display = "none";
    // i.onload = function () {
    //   setTimeout(function () {
    //     i.remove();
    //   }, 9);
    // };
    // document.body.appendChild(i);
  }
};
