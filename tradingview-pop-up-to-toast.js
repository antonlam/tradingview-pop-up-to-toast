// ==UserScript==
// @name         TradingView Remove Pop up
// @namespace    http://tampermonkey.net/
// @version      2026-02-23 v1
// @description  This simple is used for remove pop up ads in tradingview
// @author       Anton
// @match        https://www.tradingview.com/chart/GDLC2P5t/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tradingview.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    function removeDialogs() {
        let elements = document.querySelectorAll(".dialog-LTmlUPkK")
        elements.forEach(el =>console.log( el.querySelector(".title-qAW2FX1Z")?.textContent.trim()?? "" ));
        elements.forEach(el => el.remove());
    }
    setInterval(removeDialogs, 500);

})();