// ==UserScript==
// @name         Playground Links
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Adds links to our playgrounds and jira tickets to the PR title.
// @author       You
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function onLocationChange()
    {
        initPr();
    }

    function initPr()
    {
        if(!/RogerAI\/.*\/pull\/\d/.test(window.location.pathname)) return;
        addJiraLink();
        addPlaygroundLink();
        addPlaygroundTicketLinks();
    }

    function replaceSegment(reg, buildLink)
    {
        const titleElement = document.querySelector('.gh-header-title .js-issue-title');
        if(!titleElement) return;
        const titleNodes = [...titleElement.childNodes];

        const sanitizedText = titleNodes
            .filter(n => n.nodeType === Node.TEXT_NODE)
            .map(n => n.textContent)
            .join(" ");

        if(!sanitizedText.match(reg)?.length) return;

        const newNodes = titleNodes.reduce((acc, n) => {
            const titleText = n.textContent;
            const match = titleText.match(reg);
            if(n.nodeType === Node.TEXT_NODE && match?.length) {
                var parts = titleText.split(match[0]);
                acc.push(document.createTextNode(parts[0]))
                var link = document.createElement('a');
                link.setAttribute("target", "_blank")
                link.text = match[0]
                link.setAttribute("href", buildLink(match));
                acc.push(link);
                if(parts[1]) {
                    acc.push(document.createTextNode(parts[1]))
                }
            } else {
                acc.push(n);
            }
            return acc;
        }, [])

        titleNodes.forEach(n => titleElement.removeChild(n));
        newNodes.forEach(n => titleElement.appendChild(n));
    }

    function addPlaygroundLink()
    {
        const prNumber = document.querySelector('.gh-header-title .f1-light').textContent.replace('#','');
        replaceSegment(/\[playground\]/i, match => `https://pr-${prNumber}.playgrounds.corpayone.com`);
    }

    function addJiraLink()
    {
        replaceSegment(/\[([A-Za-z]+\-\d+)\]/, match => `https://roger-team.atlassian.net/browse/${match[1]}`);
    }

    function addPlaygroundTicketLinks()
    {
        const prefixes = {
            "admin": "roger-admin",
            "api": "Roger-Backend",
            "data-entry": "roger-data-entry",
            "economic": "roger-apps-economic",
            "identity": "roger-identity",
            "ripe": "ripe",
            "web": "Roger-Web",
        };

        const prefixReg = Object.keys(prefixes).join("|");
        const regex = new RegExp(`\\[((${prefixReg}):pull\\-(\\d+))\\]`);
        replaceSegment(regex, match => `https://github.com/RogerAI/${prefixes[match[2]]}/pull/${match[3]}`);
    }

    function initialize()
    {
        console.log("Initializing Playground Link Script");
        let oldPushState = history.pushState;
        history.pushState = function pushState() {
            let ret = oldPushState.apply(this, arguments);
            window.dispatchEvent(new Event('pushstate'));
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        };

        let oldReplaceState = history.replaceState;
        history.replaceState = function replaceState() {
            let ret = oldReplaceState.apply(this, arguments);
            window.dispatchEvent(new Event('replacestate'));
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        };

        window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event('locationchange'));
        });

        window.addEventListener('locationchange', function () {
            onLocationChange();
        });

        // this is lazy but we'll loose the links if the title is edited
        initPr();
        setInterval(() => initPr(), 250);
    }

    initialize();
})();