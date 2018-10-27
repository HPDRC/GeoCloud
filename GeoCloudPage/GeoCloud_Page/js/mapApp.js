require(["dojo/dom", 
         "dojo/dom-style", 
         "dojo/dom-construct", 
         "dojox/widget/Wizard", 
         "dojo/domReady!", 
         "dijit/Dialog", 
		 "dijit/layout/BorderContainer", 
		 "dijit/layout/TabContainer", 
		 "dijit/layout/ContentPane", 
		 "dojo/parser", 
		 "dijit/MenuBar", 
		 "dijit/PopupMenuBarItem", 
		 "dijit/MenuItem", 
		 "dijit/DropDownMenu", 
         "dojox/layout/FloatingPane", 
         "dijit/ColorPalette", 
         "dijit/TooltipDialog", 
         "dijit/Tooltip", 
         "dojox/charting/Chart", 
         "dojox/charting/axis2d/Default", 
         "dojox/charting/plot2d/Lines", 
		 "dojox/charting/plot2d/Scatter", 
         "dojox/charting/plot2d/Grid", 
         "dojox/charting/action2d/Magnify", 
         "dojox/form/Uploader", 
         "dojox/form/uploader/plugins/IFrame", 
         "dojox/form/uploader/FileList", 
         "dojox/layout/FloatingPane", 
         "dojox/widget/Standby"], 
//function called when all modules are loaded 
			function (dom, domStyle, wizard) { 
 
			    /* 
			    * Function to hide a DOM node 
			    * param: node is a Dojo dom node object or a string of the id 
			    */ 
			    function hideNode(node) { 
			        domStyle.set(node, "display", "none"); 
			    } 
 
			    /* 
			    * Function to show a DOM node 
			    * param: node is a Dojo dom node object or a string of the id 
			    */ 
			    function showNode(node) { 
			        domStyle.set(node, "display", "block") 
			    } 
 
			    //Using dojo's dom modules to manipulate the dom for cross browser support 
			    //document.getElementById("loader").style.display = "none"; 
			    /*		    hideNode("loader"); 
                            //document.getElementById("appLayout").style.display = "block"; 
                            showNode("appLayout"); 
             
                            getDataSets(); 
             
                            setTimeout(on_pageLoad, 5);*/ 
			}); 
 
/** 
 * creates a Dojo floating pane which can be moved around and resized in the browser 
 * @param {string} id - the HTML element id to set the pane 
 * @param {string} title - the title to display on the title bar of the pane 
 * @param {string|DocumentFragment} content - A string of HTML elements or a Document fragment to be the body of the pane 
 * @param {boolean} [resize] - optional parameter to allow resizing of the pane 
 * @param {object} [size] - optional parameter of an object with a width and height property to change the default size of 500px by 400px 
 * @returns a Dojo FloatingPane object 
 */ 
function createFloatingPane(id, title, content, resize, size, datasetID) { 
    var pane = document.createElement("div"), 
        sizeStyle = "width:500px;height:400px"; 
 
    if (size && size.width) { 
        sizeStyle = "width:" + size.width + "px;height:" + size.height + "px"; 
    } 
    pane.id = id; 
    if (content instanceof DocumentFragment) { 
        pane.appendChild(content); 
    } else { 
        pane.innerHTML = content; 
    } 
    document.body.insertBefore(pane, dojo.byId("appLayout")); 
 
    var floatingPane = new dojox.layout.FloatingPane({ 
        title: title, 
        resizable: !!resize, 
        dockable: true, 
        style: "position:absolute;top:0;left:0;" + sizeStyle + ";z-index:100;overflow:hidden;", 
        id: id 
    }, pane); 
 
    floatingPane.startup(); 

    if(datasetID) {
        var closeIcon = document.getElementById(id).getElementsByClassName("dojoxFloatingCloseIcon");
        closeIcon[0].onclick = function () {
            delete userDatasets[datasetID];
            updateDataPanel();
            document.location.replace("#" + createUriParams());

            closeIcon.onclick = null;
        }
    }
 
    return floatingPane; 
} 
 
