// ==UserScript==
// @name           Restore pre-Proton Downloads Button
// @version        1.0
// @author         aminomancer
// @homepage       https://github.com/aminomancer
// @description    The new downloads button has a nice progress animation (even if the conic-gradient anti-aliasing isn't great) but I'm not at all a fan of the new ultra-thin icon style itself. I've invested a lot of energy into restoring the previous, bolder icons, so I can't leave the downloads button untouched. The whole DOM structure has fundamentally changed so restoring the old animations was quite a challenge. I decided to keep the progress animation and simply thicken it, but the other animations are modified versions of the old ones. Changing the animations can be done in CSS, but it will break the javascript method that switches from the download icon to the progress animation, because it's listening for "animationend" events and checking the animation name. The original animations all had different names, while the new ones use the same name. We can't really make this work with just one set of keyframes, since the start and finish animations are very different. One is a "dip" and the other more like a "blip," so I had to change the animation names, which requires changing the callback. This standalone version of the script doesn't require any additional files, other than a script loader. It will modify the callback and load the CSS and icons itself. If you use my theme or my userChrome.au.css file, you should get the other version, since it's better to load icons from file than from data URIs.
// ==/UserScript==

(function () {
    function init() {
        let sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(
            Ci.nsIStyleSheetService
        );

        document.documentElement.setAttribute("pre-proton-downloads-button", true);
        DownloadsIndicatorView._showNotification = function _showNotification(aType) {
            let anchor = DownloadsButton._placeholder;
            if (!anchor || !isElementVisible(anchor.parentNode)) {
                // Our container isn't visible, so can't show the animation:
                return;
            }
            anchor.setAttribute("notification", aType);
            anchor.setAttribute("animate", "");

            this._currentNotificationType = aType;

            const onNotificationAnimEnd = (event) => {
                if (
                    event.animationName !== "downloadsButtonNotification" &&
                    event.animationName !== "downloadsIndicatorStartDip" &&
                    event.animationName !== "downloadsIndicatorFinishPulse"
                ) {
                    return;
                }
                anchor.removeEventListener("animationend", onNotificationAnimEnd);

                requestAnimationFrame(() => {
                    anchor.removeAttribute("notification");
                    anchor.removeAttribute("animate");

                    requestAnimationFrame(() => {
                        let nextType = this._nextNotificationType;
                        this._currentNotificationType = null;
                        this._nextNotificationType = null;
                        if (nextType && isElementVisible(anchor.parentNode)) {
                            this._showNotification(nextType);
                        }
                    });
                });
            };
            anchor.addEventListener("animationend", onNotificationAnimEnd);
        };

        const css = `/*Restore_pre-Proton_Downloads_Button_Stylesheet*/:root[pre-proton-downloads-button] #downloads-button>.toolbarbutton-badge-stack>#downloads-indicator-progress-outer{visibility:hidden;top:calc(50% - 8.5px);left:calc(50% - 8.5px);width:17px;height:16.5px;border-radius:100%;border-width:2px;}:root[pre-proton-downloads-button] #downloads-button[progress]:not([notification],[animate])>.toolbarbutton-badge-stack>#downloads-indicator-progress-outer{visibility:visible;}:root[pre-proton-downloads-button] #downloads-button[progress]:not([notification],[animate])>.toolbarbutton-badge-stack>#downloads-indicator-anchor>#downloads-indicator-icon{visibility:hidden!important;}:root[pre-proton-downloads-button] #downloads-indicator-progress-inner{width:20px;height:20px;top:-4.5px;left:-4.5px;position:relative;background:conic-gradient(var(--toolbarbutton-icon-fill-attention) var(--download-progress-pcent),transparent var(--download-progress-pcent));border-radius:100%;}:root[pre-proton-downloads-button] #downloads-indicator-anchor{list-style-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'><style>:root>use:not(:target),:root>g:not(:target){display:none;}</style><defs><path id='arrow-icon' d='M7.293 12.725a1 1 0 0 0 1.414 0l5-5a1 1 0 0 0-1.414-1.413L9 9.605V1.019a1 1 0 0 0-2 0v8.586L3.707 6.312a1 1 0 0 0-1.414 1.413l5 5z'/><path id='short-bar-icon' d='m 13,14 a 1,1 0 1 1 0,2 h -10 a 1,1 0 1 1 0,-2 z'/><path id='long-bar-icon' d='m 14,14 a 1,1 0 1 1 0,2 h -12 a 1,1 0 1 1 0,-2'/></defs><use id='arrow' fill='context-fill' fill-opacity='context-fill-opacity' href='%23arrow-icon'/><g id='arrow-with-bar' fill='context-fill' fill-opacity='context-fill-opacity'><use href='%23arrow-icon'/><use href='%23short-bar-icon'/></g><use id='default-bar' fill='context-fill' fill-opacity='context-fill-opacity' href='%23short-bar-icon'/><use id='progress-bar-bg' fill='context-fill' fill-opacity='.2' href='%23long-bar-icon'/><use id='progress-bar-fg' fill='context-fill' fill-opacity='context-fill-opacity' href='%23long-bar-icon'/></svg>#arrow-with-bar")!important;}@keyframes downloadsIndicatorStartDip{0%{transform:translateY(0);animation-timing-function:linear}50%{transform:translateY(0);animation-timing-function:ease-out}88%{transform:translateY(3px);animation-timing-function:ease-out}100%{transform:translateY(0)}}@keyframes downloadsIndicatorFinishPulse{from{transform:scale(1)}37.5%{transform:scale(1.4);animation-timing-function:ease-out}to{transform:scale(1);animation-timing-function:ease-in}}:root[pre-proton-downloads-button] #downloads-indicator-icon{visibility:visible!important;}:root[pre-proton-downloads-button] #downloads-button[notification="start"]>.toolbarbutton-badge-stack>#downloads-indicator-anchor>#downloads-indicator-icon{animation-name:downloadsIndicatorStartDip;animation-duration:360ms;animation-delay:100ms;animation-iteration-count:1;}:root[pre-proton-downloads-button] #downloads-button[notification="finish"]>.toolbarbutton-badge-stack>#downloads-indicator-anchor>#downloads-indicator-icon{animation-name:downloadsIndicatorFinishPulse;animation-delay:250ms;animation-duration:300ms;animation-iteration-count:2;}:root[pre-proton-downloads-button] #downloads-indicator-finish-box{display:none!important;}:root[pre-proton-downloads-button] #downloads-button>.toolbarbutton-badge-stack>#downloads-indicator-start-box{pointer-events:none;-moz-context-properties:fill,fill-opacity,stroke;grid-area:initial;top:-4px!important;left:calc(50% - 10px);z-index:0;height:48px;}:root[pre-proton-downloads-button] #downloads-indicator-start-image{min-width:658px;height:48px;list-style-image:none;}@keyframes downloadsIndicatorNotificationStart{from{transform:translateX(0);fill:var(--toolbarbutton-icon-fill);fill-opacity:var(--toolbarbutton-icon-fill-opacity)}to{transform:translateX(-637.7px);fill:var(--toolbarbutton-icon-fill-attention);fill-opacity:1}}:root[pre-proton-downloads-button] #downloads-button[animate][notification="start"]>.toolbarbutton-badge-stack>#downloads-indicator-start-box>#downloads-indicator-start-image{--anim-steps:31!important;list-style-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMzQ0IiBoZWlnaHQ9Ijk4Ij48c3ZnIHdpZHRoPSI0MiIgaGVpZ2h0PSI5OCIvPjxzdmcgd2lkdGg9IjQyIiBoZWlnaHQ9Ijk4IiB4PSI0MiIvPjxzdmcgd2lkdGg9IjQyIiBoZWlnaHQ9Ijk4IiB4PSI4NCI+PHBhdGggZmlsbD0iY29udGV4dC1maWxsIiBkPSJNMTguNTIgNDQuNDY0YTMuNTEgMy41MSAwIDAwNC45NjIgMGwxNy41NDYtMTcuNTQ2YTMuNTEgMy41MSAwIDAwLTQuOTYyLTQuOTU5TDI0LjUxIDMzLjUxNVYzLjM4NWEzLjUxIDMuNTEgMCAwMC03LjAxOSAwdjMwLjEzTDUuOTM1IDIxLjk2YTMuNTEgMy41MSAwIDAwLTQuOTYyLjA4OCAzLjUwNiAzLjUwNiAwIDAwMCA0Ljg3bDE3LjU0NiAxNy41NDd6IiBvcGFjaXR5PSIuMzMzIi8+PC9zdmc+PHN2ZyB3aWR0aD0iNDIiIGhlaWdodD0iOTgiIHg9IjEyNiI+PHBhdGggZmlsbD0iY29udGV4dC1maWxsIiBkPSJNMTguNTg2IDQ0Ljg0YTMuNDE0IDMuNDE0IDAgMDA0LjgyOCAwbDE3LjA3LTE3LjA3MWEzLjQxNCAzLjQxNCAwIDAwLTQuODI3LTQuODI1TDI0LjQxNCAzNC4xODdWNC44NzNhMy40MTQgMy40MTQgMCAwMC02LjgyOCAwdjI5LjMxNEw2LjM0MyAyMi45NDRhMy40MTQgMy40MTQgMCAwMC00LjgyOC4wODYgMy40MSAzLjQxIDAgMDAwIDQuNzM5bDE3LjA3MSAxNy4wN3oiIG9wYWNpdHk9Ii42NjciLz48L3N2Zz48c3ZnIHdpZHRoPSI0MiIgaGVpZ2h0PSI5OCIgeD0iMTY4Ij48cGF0aCBmaWxsPSJjb250ZXh0LWZpbGwiIGQ9Ik0xOC42NTUgNDUuMjI0YTMuMzE3IDMuMzE3IDAgMDA0LjY5IDBMMzkuOTMgMjguNjM5YTMuMzE3IDMuMzE3IDAgMDAtNC42OS00LjY4N0wyNC4zMTcgMzQuODc1VjYuMzk1YTMuMzE3IDMuMzE3IDAgMDAtNi42MzQgMHYyOC40OEw2Ljc2MSAyMy45NTJhMy4zMTcgMy4zMTcgMCAwMC00LjY5LjA4MyAzLjMxNCAzLjMxNCAwIDAwMCA0LjYwNGwxNi41ODQgMTYuNTg1eiIvPjwvc3ZnPjxzdmcgd2lkdGg9IjQyIiBoZWlnaHQ9Ijk4IiB4PSIyMTAiPjxwYXRoIGZpbGw9ImNvbnRleHQtZmlsbCIgZD0iTTE4LjcyNCA0NS42MTNhMy4yMTkgMy4yMTkgMCAwMDQuNTUxIDBMMzkuMzY4IDI5LjUyYTMuMjE5IDMuMjE5IDAgMDAtNC41NS00LjU0OGwtMTAuNiAxMC41OTlWNy45MzZhMy4yMTkgMy4yMTkgMCAwMC02LjQzNyAwdjI3LjYzNUw3LjE4MyAyNC45NzJhMy4yMTkgMy4yMTkgMCAwMC00LjU1MS4wOCAzLjIxNSAzLjIxNSAwIDAwMCA0LjQ2OGwxNi4wOTIgMTYuMDkzeiIvPjwvc3ZnPjxzdmcgd2lkdGg9IjQyIiBoZWlnaHQ9Ijk4IiB4PSIyNTIiPjxwYXRoIGZpbGw9ImNvbnRleHQtZmlsbCIgZD0iTTE4Ljc5NSA0Ni4wMDVhMy4xMiAzLjEyIDAgMDA0LjQxIDBsMTUuNTk5LTE1LjU5OEEzLjEyIDMuMTIgMCAwMDM0LjM5MyAyNkwyNC4xMiAzNi4yNzJWOS40ODhhMy4xMiAzLjEyIDAgMDAtNi4yNCAwdjI2Ljc4NEw3LjYwOSAyNmEzLjEyIDMuMTIgMCAwMC00LjQxLjA3OCAzLjExNiAzLjExNiAwIDAwMCA0LjMzbDE1LjU5NyAxNS41OTd6Ii8+PC9zdmc+PHN2ZyB3aWR0aD0iNDIiIGhlaWdodD0iOTgiIHg9IjI5NCI+PHBhdGggZmlsbD0iY29udGV4dC1maWxsIiBkPSJNMTguODY1IDQ2LjM5OGEzLjAyIDMuMDIgMCAwMDQuMjcgMGwxNS4xMDEtMTUuMWEzLjAyIDMuMDIgMCAwMC00LjI3LTQuMjY4bC05Ljk0NiA5Ljk0NXYtMjUuOTNhMy4wMiAzLjAyIDAgMDAtNi4wNCAwdjI1LjkzTDguMDM0IDI3LjAzYTMuMDIgMy4wMiAwIDAwLTQuMjcuMDc1IDMuMDE3IDMuMDE3IDAgMDAwIDQuMTkybDE1LjEgMTUuMTAxeiIvPjwvc3ZnPjxzdmcgd2lkdGg9IjQyIiBoZWlnaHQ9Ijk4IiB4PSIzMzYiPjxwYXRoIGZpbGw9ImNvbnRleHQtZmlsbCIgZD0iTTE4LjkzNSA0Ni43OWEyLjkyIDIuOTIgMCAwMDQuMTMgMEwzNy42NyAzMi4xODhhMi45MiAyLjkyIDAgMDAtNC4xMy00LjEyN2wtOS42MTggOS42MThWMTIuNjAxYTIuOTIgMi45MiAwIDAwLTUuODQxIDB2MjUuMDc3TDguNDYyIDI4LjA2YTIuOTIgMi45MiAwIDAwLTQuMTMuMDczIDIuOTE4IDIuOTE4IDAgMDAwIDQuMDU0bDE0LjYwMyAxNC42MDR6Ii8+PC9zdmc+PHN2ZyB3aWR0aD0iNDIiIGhlaWdodD0iOTgiIHg9IjM3OCI+PHBhdGggZmlsbD0iY29udGV4dC1maWxsIiBkPSJNMTkuMDA1IDQ3LjE4NGEyLjgyMSAyLjgyMSAwIDAwMy45OSAwTDM3LjEgMzMuMDc3YTIuODIxIDIuODIxIDAgMDAtMy45OS0zLjk4NmwtOS4yOSA5LjI5VjE0LjE1N2EyLjgyMSAyLjgyMSAwIDAwLTUuNjQyIDB2MjQuMjI0bC05LjI5MS05LjI5YTIuODIxIDIuODIxIDAgMDAtMy45OS4wNyAyLjgxOSAyLjgxOSAwIDAwMCAzLjkxNmwxNC4xMDcgMTQuMTA3eiIvPjwvc3ZnPjxzdmcgd2lkdGg9IjQyIiBoZWlnaHQ9Ijk4IiB4PSI0MjAiPjxwYXRoIGZpbGw9ImNvbnRleHQtZmlsbCIgZD0iTTE5LjA3NiA0Ny41NzZhMi43MjIgMi43MjIgMCAwMDMuODQ5IDBsMTMuNjEtMTMuNjFhMi43MjIgMi43MjIgMCAwMC0zLjg0OC0zLjg0N2wtOC45NjQgOC45NjRWMTUuNzFhMi43MjIgMi43MjIgMCAwMC01LjQ0NSAwdjIzLjM3M2wtOC45NjQtOC45NjRhMi43MjIgMi43MjIgMCAwMC0zLjg0OS4wNjggMi43MiAyLjcyIDAgMDAwIDMuNzc4bDEzLjYxIDEzLjYxMXoiLz48L3N2Zz48c3ZnIHdpZHRoPSI0MiIgaGVpZ2h0PSI5OCIgeD0iNDYyIj48cGF0aCBmaWxsPSJjb250ZXh0LWZpbGwiIGQ9Ik0xOS4xNDUgNDcuOTY3YTIuNjIzIDIuNjIzIDAgMDAzLjcxIDBMMzUuOTcgMzQuODUxYTIuNjIzIDIuNjIzIDAgMDAtMy43MS0zLjcwN2wtOC42MzggOC42MzlWMTcuMjU5YTIuNjIzIDIuNjIzIDAgMDAtNS4yNDYgMHYyMi41MjRsLTguNjM5LTguNjM5YTIuNjIzIDIuNjIzIDAgMDAtMy43MS4wNjYgMi42MiAyLjYyIDAgMDAwIDMuNjRsMTMuMTE3IDEzLjExN3oiLz48L3N2Zz48c3ZnIHdpZHRoPSI0MiIgaGVpZ2h0PSI5OCIgeD0iNTA0Ij48cGF0aCBmaWxsPSJjb250ZXh0LWZpbGwiIGQ9Ik0xOS4yMTUgNDguMzU3YTIuNTI1IDIuNTI1IDAgMDAzLjU3IDBMMzUuNDEgMzUuNzMzYTIuNTI1IDIuNTI1IDAgMDAtMy41Ny0zLjU2OGwtOC4zMTUgOC4zMTRWMTguODAxYTIuNTI1IDIuNTI1IDAgMDAtNS4wNSAwVjQwLjQ4bC04LjMxNC04LjMxNGEyLjUyNSAyLjUyNSAwIDAwLTMuNTcuMDYzIDIuNTIyIDIuNTIyIDAgMDAwIDMuNTA1bDEyLjYyNCAxMi42MjR6Ii8+PC9zdmc+PHN2ZyB3aWR0aD0iNDIiIGhlaWdodD0iOTgiIHg9IjU0NiI+PHBhdGggZmlsbD0iY29udGV4dC1maWxsIiBkPSJNMTkuMjg0IDQ4Ljc0NGEyLjQyNyAyLjQyNyAwIDAwMy40MzIgMEwzNC44NSAzNi42MDlhMi40MjcgMi40MjcgMCAwMC0zLjQzMS0zLjQyOWwtNy45OTIgNy45OTJWMjAuMzM1YTIuNDI3IDIuNDI3IDAgMDAtNC44NTQgMHYyMC44MzdsLTcuOTkyLTcuOTkyYTIuNDI3IDIuNDI3IDAgMDAtMy40MzIuMDYgMi40MjQgMi40MjQgMCAwMDAgMy4zN2wxMi4xMzUgMTIuMTM0eiIvPjwvc3ZnPjxzdmcgd2lkdGg9IjQyIiBoZWlnaHQ9Ijk4IiB4PSI1ODgiPjxwYXRoIGZpbGw9ImNvbnRleHQtZmlsbCIgZD0iTTE5LjM1MyA0OS4xMjlhMi4zMyAyLjMzIDAgMDAzLjI5NCAwTDM0LjI5NSAzNy40OGEyLjMzIDIuMzMgMCAwMC0zLjI5NC0zLjI5MkwyMy4zMyA0MS44NlYyMS44NThhMi4zMyAyLjMzIDAgMDAtNC42NiAwVjQxLjg2TDExIDM0LjE5YTIuMzMgMi4zMyAwIDAwLTMuMjk1LjA1OCAyLjMyNyAyLjMyNyAwIDAwMCAzLjIzNGwxMS42NDggMTEuNjQ4eiIvPjwvc3ZnPjxzdmcgd2lkdGg9IjQyIiBoZWlnaHQ9Ijk4IiB4PSI2MzAiPjxwYXRoIGZpbGw9ImNvbnRleHQtZmlsbCIgZD0iTTE5LjQyMSA0OS41MWEyLjIzMyAyLjIzMyAwIDAwMy4xNTggMGwxMS4xNjQtMTEuMTY0YTIuMjMzIDIuMjMzIDAgMDAtMy4xNTctMy4xNTVsLTcuMzUzIDcuMzUzVjIzLjM3YTIuMjMzIDIuMjMzIDAgMDAtNC40NjYgMHYxOS4xNzNsLTcuMzUzLTcuMzUzYTIuMjMzIDIuMjMzIDAgMDAtMy4xNTguMDU1IDIuMjMgMi4yMyAwIDAwMCAzLjFMMTkuNDIxIDQ5LjUxeiIvPjwvc3ZnPjxzdmcgd2lkdGg9IjQyIiBoZWlnaHQ9Ijk4IiB4PSI2NzIiPjxwYXRoIGZpbGw9ImNvbnRleHQtZmlsbCIgZD0iTTE5LjQ4OCA0OS44ODhhMi4xMzcgMi4xMzcgMCAwMDMuMDIyIDBsMTAuNjg2LTEwLjY4NmEyLjEzNyAyLjEzNyAwIDAwLTMuMDIyLTMuMDJsLTcuMDM4IDcuMDM4VjI0Ljg3YTIuMTM3IDIuMTM3IDAgMDAtNC4yNzQgMHYxOC4zNWwtNy4wMzgtNy4wMzhhMi4xMzcgMi4xMzcgMCAwMC0zLjAyMi4wNTMgMi4xMzUgMi4xMzUgMCAwMDAgMi45NjdsMTAuNjg2IDEwLjY4NnoiLz48L3N2Zz48c3ZnIHdpZHRoPSI0MiIgaGVpZ2h0PSI5OCIgeD0iNzE0Ij48cGF0aCBmaWxsPSJjb250ZXh0LWZpbGwiIGQ9Ik0xOS41NTYgNTAuMjYyYTIuMDQyIDIuMDQyIDAgMDAyLjg4OCAwbDEwLjIxMS0xMC4yMTFhMi4wNDIgMi4wNDIgMCAwMC0yLjg4OC0yLjg4NmwtNi43MjUgNi43MjZWMjYuMzU1YTIuMDQyIDIuMDQyIDAgMDAtNC4wODUgMHYxNy41MzZsLTYuNzI1LTYuNzI2YTIuMDQyIDIuMDQyIDAgMDAtMi44ODguMDUxIDIuMDQgMi4wNCAwIDAwMCAyLjgzNWwxMC4yMTIgMTAuMjExeiIvPjwvc3ZnPjxzdmcgd2lkdGg9IjQyIiBoZWlnaHQ9Ijk4IiB4PSI3NTYiPjxwYXRoIGZpbGw9ImNvbnRleHQtZmlsbCIgZD0iTTE5LjYyMyA1MC42MzNhMS45NDggMS45NDggMCAwMDIuNzU1IDBsOS43NDItOS43NDNhMS45NDggMS45NDggMCAwMC0yLjc1NS0yLjc1M2wtNi40MTYgNi40MTd2LTE2LjczYTEuOTQ4IDEuOTQ4IDAgMDAtMy44OTcgMHYxNi43M2wtNi40MTctNi40MTdhMS45NDggMS45NDggMCAwMC0yLjc1NS4wNDkgMS45NDcgMS45NDcgMCAwMDAgMi43MDRsOS43NDMgOS43NDN6Ii8+PC9zdmc+PHN2ZyB3aWR0aD0iNDIiIGhlaWdodD0iOTgiIHg9Ijc5OCI+PHBhdGggZmlsbD0iY29udGV4dC1maWxsIiBkPSJNMTkuNjg5IDUwLjk5OGExLjg1NiAxLjg1NiAwIDAwMi42MjQgMGw5LjI4LTkuMjc5YTEuODU2IDEuODU2IDAgMDAtMi42MjUtMi42MjJsLTYuMTExIDYuMTExVjI5LjI3NGExLjg1NiAxLjg1NiAwIDAwLTMuNzEyIDB2MTUuOTM0bC02LjExMi02LjExMWExLjg1NiAxLjg1NiAwIDAwLTIuNjI0LjA0NiAxLjg1NCAxLjg1NCAwIDAwMCAyLjU3NkwxOS42OSA1MXoiLz48L3N2Zz48c3ZnIHdpZHRoPSI0MiIgaGVpZ2h0PSI5OCIgeD0iODQwIj48cGF0aCBmaWxsPSJjb250ZXh0LWZpbGwiIGQ9Ik0xOS43NTMgNTEuMzU4YTEuNzY1IDEuNzY1IDAgMDAyLjQ5NSAwbDguODIzLTguODI0YTEuNzY1IDEuNzY1IDAgMDAtMi40OTUtMi40OTNsLTUuODExIDUuODF2LTE1LjE1YTEuNzY1IDEuNzY1IDAgMDAtMy41MyAwdjE1LjE1bC01LjgxLTUuODFhMS43NjUgMS43NjUgMCAwMC0yLjQ5Ni4wNDQgMS43NjMgMS43NjMgMCAwMDAgMi40NWw4LjgyNCA4LjgyM3oiLz48L3N2Zz48c3ZnIHdpZHRoPSI0MiIgaGVpZ2h0PSI5OCIgeD0iODgyIj48cGF0aCBmaWxsPSJjb250ZXh0LWZpbGwiIGQ9Ik0xOS44MTUgNTEuNzExYTEuNjc1IDEuNjc1IDAgMDAyLjM2OSAwbDguMzc0LTguMzc0YTEuNjc1IDEuNjc1IDAgMDAtMi4zNjgtMi4zNjdsLTUuNTE1IDUuNTE1di0xNC4zOGExLjY3NSAxLjY3NSAwIDAwLTMuMzUgMHYxNC4zOGwtNS41MTYtNS41MTVhMS42NzUgMS42NzUgMCAwMC0yLjM2OC4wNDIgMS42NzMgMS42NzMgMCAwMDAgMi4zMjVsOC4zNzQgOC4zNzR6Ii8+PC9zdmc+PHN2ZyB3aWR0aD0iNDIiIGhlaWdodD0iOTgiIHg9IjkyNCI+PHBhdGggZmlsbD0iY29udGV4dC1maWxsIiBkPSJNMTkuODc4IDUyLjA1N2ExLjU4NyAxLjU4NyAwIDAwMi4yNDQgMGw3LjkzNS03LjkzNWExLjU4NyAxLjU4NyAwIDAwLTIuMjQ0LTIuMjQzbC01LjIyNiA1LjIyNlYzMy40OGExLjU4NyAxLjU4NyAwIDAwLTMuMTc0IDB2MTMuNjI2bC01LjIyNi01LjIyNmExLjU4NyAxLjU4NyAwIDAwLTIuMjQ0LjA0IDEuNTg1IDEuNTg1IDAgMDAwIDIuMjAzbDcuOTM1IDcuOTM1eiIvPjwvc3ZnPjxzdmcgd2lkdGg9IjQyIiBoZWlnaHQ9Ijk4IiB4PSI5NjYiPjxwYXRoIGZpbGw9ImNvbnRleHQtZmlsbCIgZD0iTTE5Ljk0IDUyLjM5NWExLjUwMSAxLjUwMSAwIDAwMi4xMjIgMGw3LjUwNi03LjUwN2ExLjUwMSAxLjUwMSAwIDAwLTIuMTIzLTIuMTJsLTQuOTQzIDQuOTQzVjM0LjgyYTEuNTAxIDEuNTAxIDAgMDAtMy4wMDMgMHYxMi44OWwtNC45NDMtNC45NDRhMS41MDEgMS41MDEgMCAwMC0yLjEyMy4wMzggMS41IDEuNSAwIDAwMCAyLjA4M2w3LjUwNiA3LjUwN3oiLz48L3N2Zz48c3ZnIHdpZHRoPSI0MiIgaGVpZ2h0PSI5OCIgeD0iMTAwOCI+PHBhdGggZmlsbD0iY29udGV4dC1maWxsIiBkPSJNMTkuOTk3IDUyLjcyMmExLjQxOCAxLjQxOCAwIDAwMi4wMDUgMGw3LjA5LTcuMDlhMS40MTggMS40MTggMCAwMC0yLjAwNS0yLjAwNGwtNC42NyA0LjY3VjM2LjEyM2ExLjQxOCAxLjQxOCAwIDAwLTIuODM1IDB2MTIuMTc1bC00LjY3LTQuNjdhMS40MTggMS40MTggMCAwMC0yLjAwNC4wMzYgMS40MTcgMS40MTcgMCAwMDAgMS45NjhsNy4wOSA3LjA5eiIvPjwvc3ZnPjxzdmcgd2lkdGg9IjQyIiBoZWlnaHQ9Ijk4IiB4PSIxMDUwIj48cGF0aCBmaWxsPSJjb250ZXh0LWZpbGwiIGQ9Ik0yMC4wNTUgNTMuMDM3YTEuMzM4IDEuMzM4IDAgMDAxLjg5MSAwbDYuNjg4LTYuNjg4YTEuMzM4IDEuMzM4IDAgMDAtMS44OTEtMS44OWwtNC40MDUgNC40MDVWMzcuMzc5YTEuMzM4IDEuMzM4IDAgMDAtMi42NzUgMHYxMS40ODVsLTQuNDA1LTQuNDA1YTEuMzM4IDEuMzM4IDAgMDAtMS44OTEuMDMzIDEuMzM2IDEuMzM2IDAgMDAwIDEuODU3bDYuNjg4IDYuNjg4eiIvPjwvc3ZnPjxzdmcgd2lkdGg9IjQyIiBoZWlnaHQ9Ijk4IiB4PSIxMDkyIj48cGF0aCBmaWxsPSJjb250ZXh0LWZpbGwiIGQ9Ik0yMC4xMDggNTMuMzM3YTEuMjYgMS4yNiAwIDAwMS43ODMgMGw2LjMwNC02LjMwNGExLjI2IDEuMjYgMCAwMC0xLjc4Mi0xLjc4MmwtNC4xNTIgNC4xNTNWMzguNTc4YTEuMjYgMS4yNiAwIDAwLTIuNTIyIDB2MTAuODI2bC00LjE1Mi00LjE1M2ExLjI2IDEuMjYgMCAwMC0xLjc4My4wMzIgMS4yNiAxLjI2IDAgMDAwIDEuNzVsNi4zMDQgNi4zMDR6Ii8+PC9zdmc+PHN2ZyB3aWR0aD0iNDIiIGhlaWdodD0iOTgiIHg9IjExMzQiPjxwYXRoIGZpbGw9ImNvbnRleHQtZmlsbCIgZD0iTTIwLjE2IDUzLjYyYTEuMTg5IDEuMTg5IDAgMDAxLjY4IDBsNS45NDQtNS45NDRhMS4xODkgMS4xODkgMCAwMC0xLjY4LTEuNjhsLTMuOTE1IDMuOTE0VjM5LjcwNGExLjE4OSAxLjE4OSAwIDAwLTIuMzc4IDBWNDkuOTFsLTMuOTE0LTMuOTE0YTEuMTg5IDEuMTg5IDAgMDAtMS42ODEuMDMgMS4xODggMS4xODggMCAwMDAgMS42NWw1Ljk0NCA1Ljk0M3oiLz48L3N2Zz48c3ZnIHdpZHRoPSI0MiIgaGVpZ2h0PSI5OCIgeD0iMTE3NiI+PHBhdGggZmlsbD0iY29udGV4dC1maWxsIiBkPSJNMjAuMjA3IDUzLjg3N2ExLjEyMyAxLjEyMyAwIDAwMS41ODcgMGw1LjYxNC01LjYxNGExLjEyMyAxLjEyMyAwIDAwLTEuNTg4LTEuNTg2bC0zLjY5NyAzLjY5N3YtOS42NGExLjEyMyAxLjEyMyAwIDAwLTIuMjQ1IDB2OS42NGwtMy42OTctMy42OTdhMS4xMjMgMS4xMjMgMCAwMC0xLjU4OC4wMjggMS4xMjIgMS4xMjIgMCAwMDAgMS41NThsNS42MTQgNS42MTR6Ii8+PC9zdmc+PHN2ZyB3aWR0aD0iNDIiIGhlaWdodD0iOTgiIHg9IjEyMTgiPjxwYXRoIGZpbGw9ImNvbnRleHQtZmlsbCIgZD0iTTIwLjI0NyA1NC4xYTEuMDY1IDEuMDY1IDAgMDAxLjUwNiAwbDUuMzI1LTUuMzI2YTEuMDY1IDEuMDY1IDAgMDAtMS41MDYtMS41MDVsLTMuNTA3IDMuNTA4di05LjE0NWExLjA2NSAxLjA2NSAwIDAwLTIuMTMgMHY5LjE0NWwtMy41MDgtMy41MDhhMS4wNjUgMS4wNjUgMCAwMC0xLjUwNi4wMjcgMS4wNjQgMS4wNjQgMCAwMDAgMS40NzhsNS4zMjYgNS4zMjZ6Ii8+PC9zdmc+PHN2ZyB3aWR0aD0iNDIiIGhlaWdodD0iOTgiIHg9IjEyNjAiPjxwYXRoIGZpbGw9ImNvbnRleHQtZmlsbCIgZD0iTTIwLjI3OCA1NC4yNzJhMS4wMiAxLjAyIDAgMDAxLjQ0MyAwbDUuMTAzLTUuMTAyYTEuMDIgMS4wMiAwIDAwLTEuNDQzLTEuNDQybC0zLjM2IDMuMzZ2LTguNzYyYTEuMDIgMS4wMiAwIDAwLTIuMDQyIDB2OC43NjJsLTMuMzYtMy4zNmExLjAyIDEuMDIgMCAwMC0xLjQ0My4wMjUgMS4wMiAxLjAyIDAgMDAwIDEuNDE3bDUuMTAyIDUuMTAyeiIvPjwvc3ZnPjxzdmcgd2lkdGg9IjQyIiBoZWlnaHQ9Ijk4IiB4PSIxMzAyIi8+PC9zdmc+");animation-name:downloadsIndicatorNotificationStart;animation-duration:540ms;transform:translateX(0);animation-delay:64ms;animation-timing-function:steps(31);}`;
        let uri = makeURI("data:text/css;charset=UTF=8," + encodeURIComponent(css));
        sss.loadAndRegisterSheet(uri, sss.AUTHOR_SHEET);
    }

    if (gBrowserInit.delayedStartupFinished) {
        init();
    } else {
        let delayedListener = (subject, topic) => {
            if (topic == "browser-delayed-startup-finished" && subject == window) {
                Services.obs.removeObserver(delayedListener, topic);
                init();
            }
        };
        Services.obs.addObserver(delayedListener, "browser-delayed-startup-finished");
    }
})();
