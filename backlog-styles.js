// ==UserScript==
// @name         Backlog Styling
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://roger-team.atlassian.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const interval = setInterval(() => {
        initInterval();
    }, 250)

    function initInterval()
    {
        addStyles();
    }

    function addStyles()
    {
        const existing = document.querySelector('#cg-style');
        if(existing) return;
        console.log("adding custom styles");
        const styleElem = document.createElement('style');
        styleElem.setAttribute('id', 'cg-style')
        styleElem.innerHTML = `
.ghx-plan-band-2 .ghx-backlog-container .ghx-issue-content {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 8px !important;
}

.ghx-plan-band-2 .ghx-backlog-container .ghx-issue-content .ghx-end.ghx-items-container {
    display: flex;
    align-items: center;
    top: initial !important;
}

.ghx-plan-band-2 .ghx-backlog-container .ghx-issue-content .ghx-end.ghx-items-container .ghx-priority {
    display: flex;
    align-items: center;
}

.ghx-plan-band-2 .ghx-backlog-container .ghx-issue-content .ghx-backlog-card-expander-spacer {
    display: none;
}

.ghx-plan-band-2 .ghx-backlog-container .ghx-issue-content .ghx-plan-main-fields {
    display: flex;
    margin: 0;
    align-items: center;
    gap: 8px;
}

.ghx-plan-band-2 .ghx-backlog-container .ghx-issue-content .ghx-plan-main-fields .ghx-type.items-spacer {
    margin: 0;
    display: flex;
    align-items: center;
}

.ghx-plan-band-2 .ghx-backlog-container .ghx-issue-content .ghx-plan-extra-fields {
    display: inline-block;
    margin: 0;
}

.ghx-plan-band-2 .ghx-backlog-container .ghx-issue-content .ghx-plan-extra-fields [data-tooltip^="Status"] {
    display: inline-block;
    margin: 0;
}

.ghx-backlog-container .ghx-issue-content .ghx-plan-extra-fields [data-tooltip^="Status"] {
    border: 1px solid #0000;
    border-radius: 3px;
    padding: 0 6px !important;
    font-weight: 500;
}

.ghx-plan-extra-fields [data-tooltip="Status: Planning"],
.ghx-plan-extra-fields [data-tooltip="Status: To Do"],
.ghx-plan-extra-fields [data-tooltip="Status: Blocked"]
{
    color: var(--ds-text,#42526E);
    background-color: var(--ds-background-neutral,#DFE1E6);
}

.ghx-plan-extra-fields [data-tooltip="Status: Ready for Development"],
.ghx-plan-extra-fields [data-tooltip="Status: In Progress"],
.ghx-plan-extra-fields [data-tooltip="Status: Code Review"],
.ghx-plan-extra-fields [data-tooltip="Status: Ready for test"],
.ghx-plan-extra-fields [data-tooltip="Status: Test"],
.ghx-plan-extra-fields [data-tooltip="Status: Acceptance Test"],
.ghx-plan-extra-fields [data-tooltip="Status: In Progress"],
.ghx-plan-extra-fields [data-tooltip="Status: Ready for Deployment"]
{
    color: var(--ds-text-information,#0747A6);
    background-color: var(--ds-background-information,#DEEBFF);
}

.ghx-plan-extra-fields [data-tooltip="Status: Done"],
.ghx-plan-extra-fields [data-tooltip="Status: Won&#39;t Do"]
{
    color: var(--ds-text-success,#006644);
    background-color: var(--ds-background-success,#E3FCEF);
}
        `
        const head = document.querySelector('head');
        head.append(styleElem);
    }
})();