// ==UserScript==
// @name         TradingView Remove Pop up
// @namespace    http://tampermonkey.net/
// @version      2026-02-24-v3
// @description  This simple is used for remove pop up ads in tradingview
// @author       Anton
// @match        https://www.tradingview.com/chart/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tradingview.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const DIALOG_CLASS= 'dialog-LTmlUPkK';
    const TITLE_CLASS= 'title-qAW2FX1Z';
    const TOAST_DURATION= 4200; // ms
    const TOAST_FADE_TIME = 450; // ms (must match CSS transition)

    // ────────────────────────────────────────────────
    //  Create & inject toast styles
    // ────────────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
        .toast-container {
            position: fixed;
            inset: auto 24px 24px auto;
            z-index: 9999999;
            display: flex;
            flex-direction: column-reverse;
            gap: 12px;
            pointer-events: none;
        }

        .toast {
            min-width: 260px;
            max-width: 420px;
            padding: 14px 18px;
            border-radius: 10px;
            background: rgba(32, 32, 38, 0.96);
            color: #f1f1f6;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            font-family: system-ui, sans-serif;
            font-size: 15px;
            line-height: 1.45;
            opacity: 0;
            transform: translateY(24px) scale(0.96);
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            pointer-events: auto;
        }

        .toast.visible {
            opacity: 1;
            transform: translateY(0) scale(1);
        }

        .toast .close {
            position: absolute;
            top: 8px; right: 12px;
            font-size: 20px;
            line-height: 1;
            color: #aaa;
            cursor: pointer;
            opacity: 0.7;
            pointer-events: auto;
        }

        .toast .close:hover { color: white; opacity: 1; }

        @media (prefers-color-scheme: light) {
            .toast {
                background: rgba(250, 250, 255, 0.94);
                color: #111827;
                box-shadow: 0 8px 32px rgba(0,0,0,0.18);
            }
        }
    `;
    document.head.appendChild(style);

    // Container for toasts
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);

    // ────────────────────────────────────────────────
    //  Show toast function
    // ────────────────────────────────────────────────
    function showToast(message) {
        if (!message?.trim()) return;

        const toast = document.createElement('div');
        toast.className = 'toast';

        const text = document.createTextNode(message);
        toast.appendChild(text);

        // Optional close button
        const close = document.createElement('span');
        close.className = 'close';
        close.textContent = '×';
        close.onclick = () => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), TOAST_FADE_TIME);
        };
        toast.appendChild(close);

        container.appendChild(toast);

        // Show
        requestAnimationFrame(() => {
            requestAnimationFrame(() => toast.classList.add('visible'));
        });

        // Auto-dismiss
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => {
                if (toast.isConnected) toast.remove();
            }, TOAST_FADE_TIME);
        }, TOAST_DURATION);
    }
    // ────────────────────────────────────────────────
    //  Process & remove a single dialog
    // ────────────────────────────────────────────────
    function handleDialog(el) {
        const titleEl = el.querySelector(`.${TITLE_CLASS}`);
        const titleText = titleEl?.textContent?.trim() || '';

        if (titleText) {
            showToast("Error: " + titleText);
        }
        let button = el.querySelector(".overlayBtn-xxA0F0Gn");
        setTimeout(function() {
            button.click();
        }, 100);
    }

    // ────────────────────────────────────────────────
    //  MutationObserver logic
    // ────────────────────────────────────────────────
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type !== 'childList') continue;

            // Check newly added nodes
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) continue;

                // 1. The added node itself is a dialog
                if (node.classList.contains(DIALOG_CLASS)) {
                    handleDialog(node);
                    continue;
                }
            }
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    document.querySelectorAll(`.${DIALOG_CLASS}`).forEach(handleDialog);

})();