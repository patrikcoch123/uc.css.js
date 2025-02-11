// ==UserScript==
// @name           Misc. Mods
// @version        1.9.1
// @author         aminomancer
// @homepage       https://github.com/aminomancer/uc.css.js
// @description    Various tiny mods not worth making separate scripts for. Read the comments inside the script for details.
// @license        This Source Code Form is subject to the terms of the Creative Commons Attribution-NonCommercial-ShareAlike International License, v. 4.0. If a copy of the CC BY-NC-SA 4.0 was not distributed with this file, You can obtain one at http://creativecommons.org/licenses/by-nc-sa/4.0/ or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
// ==/UserScript==

(function () {
    let config = {
        // by default the bookmarks toolbar unhides itself when you use the edit bookmark panel and
        // select the bookmarks toolbar as the bookmark's folder. this is super annoying so I'm
        // completely turning it off.
        "Disable bookmarks toolbar auto show": true,

        // on macOS the arrow keyboard shortcuts (cmd+shift+pgup) "wrap" relative to the tab bar, so
        // moving the final tab right will move it to the beginning of the tab bar. for some reason
        // this is turned off on linux and windows. I'm turning it on.
        "Moving tabs with arrow keys can wrap": true,

        // for some reason, when you open the downloads panel it automatically focuses the first
        // element, which is the footer if you don't have any downloads. this is inconsistent with
        // other panels, and a little annoying imo. it's not a big deal but one of firefox's biggest
        // problems compared to other browsers is a general lack of consistency. so I think removing
        // this whole behavior would probably be wise, but for now I'll just stop it from focusing
        // the *footer*, but still allow it to focus the first download item if there are any.
        "Stop downloads panel auto-focusing the footer button": true,

        // when you use the "move tab" hotkeys, e.g. Ctrl + Shift + PageUp, it only moves the active
        // tab, even if you have multiple tabs selected. this is inconsistent with the keyboard
        // shortcuts "move tab to end" or "move tab to start" and of course, inconsistent with the
        // drag & drop behavior. this will change the hotkeys so they move all selected tabs.
        "Move all selected tabs with hotkeys": true,

        // with browser.proton.places-tooltip.enabled, the bookmarks/history/tabs tooltip is
        // improved and normally it gets anchored to the element that popped up the tooltip, i.e.
        // the element you hovered. but for some reason menupopups are an exception. it does this on
        // all relevant elements, including bookmarks in panels, just not on bookmarks menu popups.
        // but I tested it and it works fine on menupopups so I'm removing the exception. there also
        // isn't any anchoring inside sidebars, because the bookmarks/history items in the sidebar
        // aren't actual DOM elements. there's just one node, the tree, and the individual items are
        // drawn inside it. so they're kind of like virtual nodes. we can't anchor to them the
        // normal way since they're not elements, but we can get their screen coordinates and
        // constrain the tooltip popup within those coordinates. so this will implement the proton
        // places tooltip behavior everywhere, rather than it being restricted to panels and the tab bar.
        "Anchor bookmarks menu tooltip to bookmark": true,

        // by default, when you hit ctrl+tab it waits 200ms before opening the panel. if you replace
        // the 200 with another number, it will wait that long in milliseconds instead.
        "Reduce ctrl+tab delay": 200,

        // normally, firefox only animates the stop/reload button when it's in the main customizable
        // navbar. if you enter customize mode and move the button to the tabs toolbar, menu bar, or
        // personal/bookmarks toolbar, the animated transition between the stop icon to the reload
        // icon disappears. the icon just instantly changes. I suspect this is done in order to
        // avoid potential problems with density modes, but it doesn't seem necessary. as long as
        // you provide some CSS it works fine:
        // #stop-reload-button {position: relative;}
        // #stop-reload-button > :is(#reload-button, #stop-button) > .toolbarbutton-animatable-box {display: block;}
        // :is(#reload-button, #stop-button) > .toolbarbutton-icon {padding: var(--toolbarbutton-inner-padding) !important;}
        "Allow stop/reload button to animate in other toolbars": true,

        // the toast popup that opens when you enable/disable tracking protection on a site has a
        // bug where it doesn't fade out when it closes. see here:
        // https://bugzilla.mozilla.org/show_bug.cgi?id=1724622
        "Fix missing tracking protection toast popup fade animation": true,

        // When you open a private window, it shows a little private browsing icon in the top of the
        // navbar, next to the window control buttons. It doesn't have a tooltip for some reason, so
        // if you don't already recognize the private browsing icon, you won't know what it means.
        // This simply gives it a localized tooltip like "You're in a Private Window" in English.
        // The exact string is drawn from Firefox's fluent files, so it depends on your language.
        "Give the private browsing indicator a tooltip": true,

        // The location where your bookmarks are saved by default is defined in the preference
        // browser.bookmarks.defaultLocation. This pref is updated every time you manually change a
        // bookmark's folder in the urlbar star button's edit bookmark panel. So if you want to save
        // to toolbar by default, but you just added a bookmark to a different folder with the
        // panel, that different folder now becomes your default location. So the next time you go
        // to add a bookmark, instead of saving it to your toolbar it'll save it to the most recent
        // folder you chose in the edit bookmark panel. This can be kind of annoying if you have a
        // main bookmarks folder and a bunch of smaller subfolders. So I added this option to
        // eliminate this updating behavior. This will stop Firefox from automatically updating the
        // preference every time you use the edit bookmark panel. Once you install the script there
        // will be a new checkbox in the edit bookmark panel, once you expand the "location"
        // section. If you uncheck this checkbox, Firefox will stop updating the default bookmark
        // location. So whatever the default location is set to at the time you uncheck the checkbox
        // will permanently remain your default location. You can still change the default location
        // by modifying the preference directly or by temporarily checking that checkbox. It just
        // means the default location will only automatically change when the checkbox is checked.
        "Preserve your default bookmarks folder": true,

        // By default, the private browsing indicator is just an inert <hbox> that sits next to the
        // window control buttons. Hovering it reveals a tooltip, but that's it. Without any hover
        // styles it seems kind of out of place. But giving something hover styles when it has no
        // actual function seems like a bad idea. So instead of doing nothing, clicking the
        // indicator will open a support page with info about private browsing. Better than nothing,
        // and I didn't want to make it a redundant "new private window" button.
        "Turn private browsing indicator into button": true,

        // By default, the permissions popup anchors to the center of the permissions box. But this
        // box can have anywhere from 1 to 20 icons visible at one time. So the permission winds up
        // appearing like it's just floating in space rather than anchored to something in
        // particular. This mod will change the method so that it anchors to the permission granted
        // icon instead. That's the first icon in the box. So it will appear left-aligned rather
        // than center aligned.
        "Anchor permissions popup to granted permission icon": true,

        // When you click and drag a tab, Firefox displays a small thumbnail preview of the tab's
        // content next to your mouse cursor (provided you have `nglayout.enable_drag_images` set to
        // true). This preview has a white background, so it will display as a 160x90px white
        // rectangle until the thumbnail loads. If you use "dark mode" a lot, this will pretty
        // consistently result in an unsightly white flash every time you click and drag a tab.
        // Unfortunately the white color is set at the Canvas level so can't be overridden with CSS.
        // But with JavaScript we can change the method that sets the background color. Instead of
        // using a fixed color value, this setting calculates the effective value of a CSS variable,
        // --in-content-bg-dark. This variable is already set by duskFox so you don't need to set it
        // yourself if you use my CSS theme. If you don't, then make sure you add
        // `:root{--in-content-bg-dark: #000}` to your userChrome.css, or it will fall back to white.
        "Customize tab drag preview background color": true,
    };
    class UCMiscMods {
        constructor() {
            if (config["Disable bookmarks toolbar auto show"])
                gEditItemOverlay._autoshowBookmarksToolbar = function () {};
            if (config["Moving tabs with arrow keys can wrap"]) gBrowser.arrowKeysShouldWrap = true;
            if (config["Stop downloads panel auto-focusing the footer button"])
                this.stopDownloadsPanelFocus();
            if (config["Move all selected tabs with hotkeys"]) this.moveTabKeysMoveSelectedTabs();
            if (config["Anchor bookmarks menu tooltip to bookmark"]) this.anchorBookmarksTooltip();
            this.reduceCtrlTabDelay(config["Reduce ctrl+tab delay"]);
            if (config["Allow stop/reload button to animate in other toolbars"])
                this.stopReloadAnimations();
            if (config["Fix missing tracking protection toast popup fade animation"])
                this.fixProtectionsToast();
            if (config["Give the private browsing indicator a tooltip"])
                this.addPrivateBrowsingTooltip();
            if (config["Preserve your default bookmarks folder"])
                this.makeDefaultBookmarkFolderPermanent();
            if (config["Turn private browsing indicator into button"])
                this.privateBrowsingIndicatorButton();
            if (config["Anchor permissions popup to granted permission icon"])
                this.anchorPermissionsPopup();
            if (config["Customize tab drag preview background color"]) this.tabDragPreview();
            this.randomTinyStuff();
        }
        stopDownloadsPanelFocus() {
            eval(
                `DownloadsPanel._focusPanel = function ` +
                    DownloadsPanel._focusPanel
                        .toSource()
                        .replace(/DownloadsFooter\.focus\(\)\;/, ``)
            );
        }
        moveTabKeysMoveSelectedTabs() {
            gBrowser.moveTabsBackward = function () {
                let tabs = this.selectedTab.multiselected ? this.selectedTabs : [this.selectedTab];
                let previousTab = this.tabContainer.findNextTab(tabs[0], {
                    direction: -1,
                    filter: (tab) => !tab.hidden,
                });
                for (let tab of tabs) {
                    if (previousTab) this.moveTabTo(tab, previousTab._tPos);
                    else if (this.arrowKeysShouldWrap && tab._tPos < this.browsers.length - 1)
                        this.moveTabTo(tab, this.browsers.length - 1);
                }
            };
            gBrowser.moveTabsForward = function () {
                let tabs = this.selectedTab.multiselected ? this.selectedTabs : [this.selectedTab];
                let nextTab = this.tabContainer.findNextTab(tabs[tabs.length - 1], {
                    direction: 1,
                    filter: (tab) => !tab.hidden,
                });
                for (let i = tabs.length - 1; i >= 0; i--) {
                    let tab = tabs[i];
                    if (nextTab) this.moveTabTo(tab, nextTab._tPos);
                    else if (this.arrowKeysShouldWrap && tab._tPos > 0) this.moveTabTo(tab, 0);
                }
            };
            eval(
                `gBrowser._handleKeyDownEvent = function ` +
                    gBrowser._handleKeyDownEvent
                        .toSource()
                        .replace(/moveTabBackward/, `moveTabsBackward`)
                        .replace(/moveTabForward/, `moveTabsForward`)
            );
        }
        anchorBookmarksTooltip() {
            BookmarksEventHandler.fillInBHTooltip = function (aDocument, aEvent) {
                var node;
                var cropped = false;
                var targetURI;
                let tooltip = aEvent.target;
                if (tooltip.triggerNode.localName == "treechildren") {
                    var tree = tooltip.triggerNode.parentNode;
                    var cell = tree.getCellAt(aEvent.clientX, aEvent.clientY);
                    if (cell.row == -1) return false;
                    node = tree.view.nodeForTreeIndex(cell.row);
                    cropped = tree.isCellCropped(cell.row, cell.col);
                    // get coordinates for the cell in a tree.
                    var cellCoords = tree.getCoordsForCellItem(cell.row, cell.col, "cell");
                } else {
                    var tooltipNode = tooltip.triggerNode;
                    if (tooltipNode._placesNode) node = tooltipNode._placesNode;
                    else targetURI = tooltipNode.getAttribute("targetURI");
                }
                if (!node && !targetURI) return false;
                var title = node ? node.title : tooltipNode.label;
                var url;
                if (targetURI || PlacesUtils.nodeIsURI(node)) url = targetURI || node.uri;
                if (!cropped && !url) return false;
                if (gProtonPlacesTooltip) {
                    aEvent.target.setAttribute("position", "after_start");
                    if (tooltipNode) aEvent.target.moveToAnchor(tooltipNode, "after_start");
                    else if (tree && cellCoords)
                        // anchor the tooltip to the tree cell
                        aEvent.target.moveTo(
                            cellCoords.left + tree.screenX,
                            cellCoords.bottom + tree.screenY
                        );
                }
                let tooltipTitle = aEvent.target.querySelector(".places-tooltip-title");
                tooltipTitle.hidden = !title || title == url;
                if (!tooltipTitle.hidden) tooltipTitle.textContent = title;
                let tooltipUrl = aEvent.target.querySelector(".places-tooltip-uri");
                tooltipUrl.hidden = !url;
                if (!tooltipUrl.hidden) tooltipUrl.value = url;
                return true;
            };
        }
        reduceCtrlTabDelay(delay) {
            if (delay === 200) return;
            ctrlTab.open = function () {
                if (this.isOpen) return;
                this.canvasWidth = Math.ceil((screen.availWidth * 0.85) / this.maxTabPreviews);
                this.canvasHeight = Math.round(this.canvasWidth * tabPreviews.aspectRatio);
                this.updatePreviews();
                this._selectedIndex = 1;
                gBrowser.warmupTab(this.selected._tab);
                this._timer = setTimeout(() => {
                    this._timer = null;
                    this._openPanel();
                }, delay);
            };
        }
        stopReloadAnimations() {
            eval(
                `CombinedStopReload.switchToStop = function ` +
                    CombinedStopReload.switchToStop
                        .toSource()
                        .replace(/switchToStop/, "")
                        .replace(/#nav-bar-customization-target/, `.customization-target`)
            );
            eval(
                `CombinedStopReload.switchToReload = function ` +
                    CombinedStopReload.switchToReload
                        .toSource()
                        .replace(/switchToReload/, "")
                        .replace(/#nav-bar-customization-target/, `.customization-target`)
            );
        }
        fixProtectionsToast() {
            eval(
                `gProtectionsHandler.showProtectionsPopup = function ` +
                    gProtectionsHandler.showProtectionsPopup
                        .toSource()
                        .replace(
                            /PanelMultiView\.hidePopup\(this\.\_protectionsPopup\)/,
                            `this._protectionsPopup.hidePopup(true)`
                        )
            );
        }
        async addPrivateBrowsingTooltip() {
            this.privateL10n = await new Localization(["browser/aboutPrivateBrowsing.ftl"], true);
            let l10nId = PrivateBrowsingUtils.isWindowPrivate(window)
                ? "about-private-browsing-info-title"
                : "about-private-browsing-not-private";
            document.querySelector(".private-browsing-indicator").tooltipText =
                await this.privateL10n.formatValue([l10nId]);
        }
        makeDefaultBookmarkFolderPermanent() {
            let { panel } = StarUI;
            let checkbox = panel.querySelector("#editBMPanel_newFolderBox").appendChild(
                _ucUtils.createElement(document, "checkbox", {
                    id: "editBookmarkPanel_persistLastLocation",
                    label: "Remember last location",
                    accesskey: "R",
                    tooltiptext:
                        "Update the default bookmark folder when you change it. If unchecked, the folder chosen when this was checked will remain the default folder indefinitely.",
                    oncommand: `Services.prefs.setBoolPref("userChrome.bookmarks.editDialog.persistLastLocation", this.checked)`,
                })
            );
            panel.addEventListener("popupshowing", (e) => {
                if (e.target !== panel) return;
                let pref = Services.prefs.getBoolPref(
                    "userChrome.bookmarks.editDialog.persistLastLocation",
                    true
                );
                checkbox.checked = pref;
            });
            eval(
                `StarUI._storeRecentlyUsedFolder = async function ` +
                    StarUI._storeRecentlyUsedFolder
                        .toSource()
                        .replace(/^async \_storeRecentlyUsedFolder/, "")
                        .replace(
                            /if \(didChangeFolder\)/,
                            `if (didChangeFolder && Services.prefs.getBoolPref("userChrome.bookmarks.editDialog.persistLastLocation", true))`
                        )
            );
        }
        privateBrowsingIndicatorButton() {
            let indicator = document.querySelector(".private-browsing-indicator");
            let tooltiptext = indicator.getAttribute("tooltiptext");
            let markup = `<button class="private-browsing-indicator" aria-live="polite"
                tooltiptext="${tooltiptext}" style="appearance:none;min-width:revert"
                oncommand="openHelpLink('private-browsing-myths')" />`;
            indicator.replaceWith(MozXULElement.parseXULToFragment(markup));
        }
        anchorPermissionsPopup() {
            gPermissionPanel._initializePopup();
            eval(
                `gPermissionPanel._openPopup = function ` +
                    gPermissionPanel._openPopup
                        .toSource()
                        .replace(/_openPopup/, "")
                        .replace(/\"bottomcenter/, `"bottomleft`)
                        .replace(
                            /(PanelMultiView\.openPopup)/,
                            `let bounds = windowUtils.getBoundsWithoutFlushing;\n    let anchorBounds = bounds(this._permissionGrantedIcon);\n    let diff = anchorBounds.left - bounds(this._identityPermissionBox).left + (anchorBounds.width / 2);\n    this._permissionPopup.style.setProperty("--uc-panel-left-offset", diff + "px");\n\n    $1`
                        )
            );
            let { _permissionPopup } = gPermissionPanel;
            _permissionPopup.setAttribute("anchor-to-icon", true);
            // we want the icon to be the same height as the container. normally it's only 16px
            // which affects the popup positioning. we can increase the height but it's just an
            // image element. so, doing so would mean the icon must have explicit width/height
            // attributes. otherwise the image will be resized vertically by a lot. the icon does
            // have explicit values, but some users may use custom icons. so to ensure this doesn't
            // happen, set block padding equal to half the difference between the icon height and
            // the urlbar height, minus the urlbar padding.
            _permissionPopup.style.marginInline = `calc(-20px + var(--uc-panel-left-offset, 0px))`;
        }
        tabDragPreview() {
            let { tabContainer } = gBrowser;
            if (tabContainer.hasOwnProperty("on_dragstart")) return;
            eval(
                `tabContainer.on_dragstart = function ` +
                    tabContainer.on_dragstart
                        .toSource()
                        .replace(/on_dragstart/, "")
                        .replace(
                            /\"white\"/,
                            `getComputedStyle(this).getPropertyValue("--in-content-bg-dark").trim() || "white"`
                        )
            );
        }
        randomTinyStuff() {
            // give the tracking protection popup's info button a tooltip
            let etpPanel = document
                .getElementById("template-protections-popup")
                ?.content.querySelector("#protections-popup");
            let setEtpPopupInfoTooltip = (e) => {
                let infoButton = e.target.querySelector("#protections-popup-info-button");
                let ariaLabel = infoButton.getAttribute("aria-label");
                if (ariaLabel) {
                    infoButton.removeAttribute("data-l10n-id");
                    infoButton.setAttribute("tooltiptext", ariaLabel);
                } else if (infoButton.getAttribute("data-l10n-id"))
                    return document.l10n.translateElements([infoButton]);
                etpPanel.removeEventListener("popupshowing", setEtpPopupInfoTooltip);
            };
            if (etpPanel) etpPanel.addEventListener("popupshowing", setEtpPopupInfoTooltip);

            // support icons for the "move sidebar to left" and "move sidebar to right" buttons in
            // the sidebar switcher dropdown menu that appear when you click the sidebar switcher:
            // #sidebar-reverse-position[to-position="left"] {
            //     list-style-image: url(chrome://browser/skin/back.svg);
            // }
            // #sidebar-reverse-position[to-position="right"] {
            //     list-style-image: url(chrome://browser/skin/forward.svg);
            // }
            SidebarUI.showSwitcherPanel = function () {
                this._ensureShortcutsShown();
                this._switcherPanel.addEventListener(
                    "popuphiding",
                    () => this._switcherTarget.classList.remove("active"),
                    { once: true }
                );
                let onRight = this._positionStart == RTL_UI;
                let label = onRight
                    ? gNavigatorBundle.getString("sidebar.moveToLeft")
                    : gNavigatorBundle.getString("sidebar.moveToRight");
                this._reversePositionButton.setAttribute("label", label);
                this._reversePositionButton.setAttribute("to-position", onRight ? "left" : "right");
                this._switcherPanel.hidden = false;
                this._switcherPanel.openPopup(this._icon);
                this._switcherTarget.classList.add("active");
            };
        }
    }

    if (gBrowserInit.delayedStartupFinished) new UCMiscMods();
    else {
        let delayedListener = (subject, topic) => {
            if (topic == "browser-delayed-startup-finished" && subject == window) {
                Services.obs.removeObserver(delayedListener, topic);
                new UCMiscMods();
            }
        };
        Services.obs.addObserver(delayedListener, "browser-delayed-startup-finished");
    }
})();
