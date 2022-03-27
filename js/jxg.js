"GLOBAL VARIABLES";
//

"START";
{
    //ATTRIBUTES
    function quickAttribute(attributeName, style) {
        var queryResult = document.querySelectorAll(`[${attributeName}]`)
        Array.from(queryResult).forEach((element) => {
            var attribute = element.getAttribute(attributeName);
            element.setAttribute("style", (element.getAttribute("style") ?? "") + style + ": " + attribute + "; ");
            element.removeAttribute(attributeName);
        });
    }

    // X-HEIGHT(XH)
    quickAttribute("x-h", "height");
    // X-MINHEIGHT(XMIH)
    quickAttribute("x-h-min", "min-height");
    // X-MAXHEIGHT(XMAH)
    quickAttribute("x-h-max", "max-height");

    // X-WIDTH(XW)
    quickAttribute("x-w", "width");
    // X-MINWIDTH(XMIW)
    quickAttribute("x-w-min", "min-width");
    // X-MAXWIDTH(XMAW)
    quickAttribute("x-w-max", "max-width");

    // X-MARGIN(XM)
    quickAttribute("x-m", "margin");
    quickAttribute("x-m-left", "margin-left");
    quickAttribute("x-m-right", "margin-right");
    quickAttribute("x-m-top", "margin-top");
    quickAttribute("x-m-bottom", "margin-bottom");

    // X-PADDING(XP)
    quickAttribute("x-p", "padding");
    quickAttribute("x-p-left", "padding-left");
    quickAttribute("x-p-right", "padding-right");
    quickAttribute("x-p-top", "padding-top");
    quickAttribute("x-p-bottom", "padding-bottom");

    // X-TEXT-FONT(XF)
    quickAttribute("x-t-f", "font-family");
    // X-TEXT-COLOR(XC)
    quickAttribute("x-t-c", "color");
    // X-TEXT-SIZE(XTSIZE)
    quickAttribute("x-t-size", "font-size");
    // X-TEXT-ALIGN(XTALIGN)
    quickAttribute("x-t-align", "text-align");
    // X-BGCOLOR(XBGC)
    quickAttribute("x-bg-c", "background-color");

    // X-JUSTIFY-CONTENT(XJC)
    quickAttribute("x-jc", "justify-content");
    // X-ALIGN-ITEMS(XAI)
    quickAttribute("x-ai", "align-items");
    // X-FLEX-WRAP(XFW)
    quickAttribute("x-fw", "flex-wrap");

    // X-SIDEBAR-TOP-OFFSET(XSTO)
    quickAttribute("x-sidebar-top-offset", "--sidebar-top-offset");

    //BUTTONS
    var buttons = document.querySelectorAll("x-button");
    Array.from(buttons).forEach((button) => {
        button.className += " x-button";
        button.outerHTML = button.outerHTML.replace("x-button", "button");
    });

    //INPUTS
    var inputs = document.querySelectorAll("x-input");
    Array.from(inputs).forEach((input) => {
        input.className += " x-input";
        input.outerHTML = input.outerHTML.replace("x-input", "input");
    });

    //NAVBAR
    var navbarCollapses = document.querySelectorAll("x-navbar-collapse");
    Array.from(navbarCollapses).forEach((collapse) => {
        var minWidth = 0;
        Array.from(collapse.children).forEach((element) => element.setAttribute("x-collapse", false));
        collapse.childNodes.forEach((node) => { if (node.nodeName == "X-NAVBAR-ITEM") minWidth += node.clientWidth * 1.1 });
        collapse.setAttribute("x-collapse-w-min", minWidth.toString());
        collapse.setAttribute("x-toggle", false);

        var xName = collapse.getAttribute("x-name");
        if (xName == null)
        {
            console.error(`No x-name was specified for collapseable navbar!`);
            return;
        }
        var toggleButton = document.querySelector(`x-toggle-button[x-name="${xName}"]`);
        if (toggleButton == null)
        {
            console.error(`No toggle button found with x-name: ${xName}!`);
            return;
        }
        toggleButton.addEventListener('click', () => {
            collapse.setAttribute("x-toggle", (!(collapse.getAttribute("x-toggle") === "true")).toString());
        });
    });

    let onResizeFunc = () => {
        var navbarCollapses = document.querySelectorAll("x-navbar-collapse");
        Array.from(navbarCollapses).forEach((collapse) => {
            var minWidth = collapse.getAttribute("x-collapse-w-min");
            var short = (collapse.parentElement.clientWidth < parseFloat(minWidth));
            var xName = collapse.getAttribute("x-name");

            collapse.setAttribute("x-collapse", short.toString());
            Array.from(collapse.children).forEach((element) => element.setAttribute("x-collapse", short.toString()));

            var toggleButton = document.querySelector(`x-toggle-button[x-name="${xName}"]`);
            toggleButton.style.display = short ? "block" : "none";
        });
    }
    onResizeFunc();
    window.addEventListener("resize", onResizeFunc);
}

function jxgTooltip(xname) {
    document.querySelector(`x-tooltip[x-name="${xname}"]`).setAttribute("x-visible", "true");
    setTimeout(() => {
        document.querySelector(`x-tooltip[x-name="${xname}"]`).setAttribute("x-visible", "false");
    }, 1000);
}