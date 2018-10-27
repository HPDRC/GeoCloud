var serverIp = "http://jarvis.cs.fiu.edu/geocloudbackend",
    dataSetsList = {}; 
 
var userDatasets = {}; 
/** 
 * getDataSets is a function that makes an AJAX request to the backend 
 * and passes the xml document to handleDataSets function 
 */ 
function getDataSets() { 
    var xhr = makeCORSRequest(serverIp + "/datasetlist.aspx", "GET", function (err, result) { 
        var msg; 
        if (err) { 
            msg = "[getDataSets] " + err; 
            //setMessage(msg); 
            console.error(msg); 
            return; 
        } 
 
        handleDataSets(result.responseXML); 
    }); 
 
    xhr.send(); 
} 
/** 
 * handleDataSets creates the dataset list used to display in GeoCloud 
 * @param {Document} xmldoc - An XML document with datasets 
 */ 
function handleDataSets(xmldoc) { 
    var xmlDataSets, 
        dataSets = [], 
        dataset, 
        i, 
        description = ""; 
 
    if (xmldoc === null) { 
	    //setMessage("Bad XML response from server"); 
	    console.error("handleDataSets(): xmldoc was null. Not proper XML, bad response."); 
	    return; 
    } 
 
    xmlDataSets = xmldoc.documentElement.getElementsByTagName("DataSet"); 
    if (xmlDataSets == null) { 
	    return; 
    } 
 
    // get the datasets from the xml and put them in a object and push into the array 
    for (i = 0; i < xmlDataSets.length; i++) { 
	    // dataset object 
        dataSet = {} 
	    dataSet.id = xmlDataSets[i].getElementsByTagName("Id")[0].childNodes[0].nodeValue; 
	    dataSet.name = xmlDataSets[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue; 
	    dataSet.pubDate = xmlDataSets[i].getElementsByTagName("PubDate")[0].childNodes[0].nodeValue; 
	    dataSet.creator = xmlDataSets[i].getElementsByTagName("Creator")[0].childNodes[0].nodeValue; 
	    if (xmlDataSets[i].getElementsByTagName("Desc")[0] && xmlDataSets[i].getElementsByTagName("Desc")[0].childNodes[0]) { 
	        description = xmlDataSets[i].getElementsByTagName("Desc")[0].childNodes[0].nodeValue; 
	    } else { 
	        description = ""; 
	    } 
	    dataSet.description = description; 
	    dataSets.push(dataSet); 
	    if (!dataSetsList[dataSet.id]) { 
	        dataSetsList[dataSet.id] = dataSet; 
	    } 
 
    } 
 
    // update the data panel 
    updateDataPanel(); 
} 
 
/** 
 * The updateDataPanel changes the left panel of the UI 
 */ 
function updateDataPanel() { 
    var leftPane = document.getElementById("datasets"), 
        datalist = document.createElement("ul"), 
        id, 
        dataset, 
        item, 
        span, 
        data, 
        tooltipLabel; 
 
    datalist.id = "data-list"; 
    for (id in dataSetsList) { 
        dataSet = dataSetsList[id]; 
        item = document.createElement("li"); 
        span = document.createElement("span"); 
 
        item.id = "item" + dataSet.id; 
        if (dataSet.data) { 
            item.className = "dataset-drawn"; 
            item.onclick = (function () { 
                var itemId = id; 
                return function () { 
                    removeFromMap(itemId); 
                } 
            })(); 
        } else { 
            item.onclick = (function () { 
                var itemId = id; 
                return function () { 
                    addToMap(itemId); 
                } 
            })(); 
        } 
 
        span.className = "datasetNames"; 
        span.appendChild(document.createTextNode(dataSet.name)); 
        item.appendChild(span); 
        datalist.appendChild(item); 
    } 
 
    for (data in userDatasets) { 
        dataset = userDatasets[data]; 
        item = document.createElement("li"); 
        span = document.createElement("span"); 
 
        item.id = "item" + dataset.id; 
        item.className = "userdata"; 
        if (dataset.data) { 
            item.className += " dataset-drawn"; 
            item.onclick = (function () { 
                var index = data; 
                return function () { 
                    removeUserData(index); 
                }; 
            })(); 
        } else { 
            item.onclick = (function () { 
 
            })(); 
        } 
        span.className = "datasetNames"; 
        span.appendChild(document.createTextNode(dataset.name)); 
        item.appendChild(span); 
        datalist.appendChild(item); 
    } 
 
    leftPane.innerHTML = ""; 
    leftPane.appendChild(datalist); 
 
    for (id in dataSetsList) { 
        dataSet = dataSetsList[id]; 
        tooltipLabel = dataSet.name + "<br/>id: " + dataSet.id + "<br/>pub Date: " + dataSet.pubDate + "<br/>creator: " + dataSet.creator + "<br/>description: " + dataSet.description; 
        new dijit.Tooltip({ 
            connectId: ["item" + dataSet.id], 
            label: tooltipLabel 
        }); 
    } 
 
} 
 
/** 
 * Changes the button and adds the dataset to the map 
 */ 
function addToMap(id) { 
 
    requestNeededData(id); 
    var item = dojo.byId('item' + id); 
    item.className = "dataset-drawn"; 
    item.onclick = function () { 
        removeFromMap(id); 
    } 
} 
 
function removeUserData(id) { 
    if (userDatasets[id].type == "GroundTile") { 
        appMap.RemoveLayer(userDatasets[id].data.layer); 
    } else if (userDatasets[id].type == "GeoData") { 
        userDatasets[id].data.undraw(); 
    } 
    delete userDatasets[id]; 
    updateDataPanel(); 
    document.location.replace("#" + createUriParams());
} 
 
/* 
 *  Changes the button and removes a dataset from the map 
 */ 
function removeFromMap(id) { 
    if (dataSetsList[id].data) { 
        dataSetsList[id].data.undraw(); 
        delete dataSetsList[id].data; 
    } 
 
    var item = dojo.byId('item' + id); 
    item.className = ""; 
    item.onclick = function () { 
        addToMap(id); 
    } 
    document.location.replace("#" + createUriParams());
} 
 
/* 
 * requestNeededData requires the id of a dataset and then calculates the required boundary and proceeds to make a  
 * call to getData to make an AJAX request with the boundary information.  
 */ 
var requestQueue = []; 
function requestNeededData(id, zoomed) { 
    zoomed = typeof zoomed !== 'undefined' ? zoomed : false; 
    var boundary = mapApp.GetMap().GetVisibleExtent(),
        corner1 = [], 
        corner2 = [], 
        currentBbox, 
        level = mapApp.GetMap().GetLevel(); 
 
    corner1[0] = boundary[0]; 
    corner1[1] = boundary[1]; 
    corner2[0] = boundary[2]; 
    corner2[1] = boundary[3]; 
    currentBbox = [corner1, corner2]; 
 
 
    //Check if this is a new dataset's first call, so it just call getData now 
    if ( (zoomed == true) || (!dataSetsList[id].data)) { 
        requestQueue.push([id, currentBbox, level]); 
    } else { 
        var bbox = dataSetsList[id].bbox; 
        if (currentBbox[0][0] < bbox[0][0]) { 
            var xPoint = currentBbox[0]; 
            var yPoint = [bbox[0][0]]; 
            if (currentBbox[1][1] < bbox[1][1]) { 
                yPoint.push(bbox[1][1]); 
            } else { 
                yPoint.push(currentBbox[1][1]); 
            } 
            requestQueue.push([id, [xPoint, yPoint], level]); 
        } 
 
        if (currentBbox[0][1] > bbox[0][1]) { 
            var yPoint = [currentBbox[1][0], bbox[0][1]]; 
            var xPoint = []; 
            if (bbox[0][0] > currentBbox[0][0]) { 
                xPoint.push(bbox[0][0]); 
            } else { 
                xPoint.push(currentBbox[0][0]); 
            } 
            xPoint.push(currentBbox[0][1]); 
            requestQueue.push([id, [xPoint, yPoint], level]); 
        } 
 
        if (currentBbox[1][0] > bbox[1][0]) { 
            var yPoint = currentBbox[1]; 
            var xPoint = [bbox[1][0]]; 
            if (bbox[0][1] < currentBbox[0][1]) { 
                xPoint.push(bbox[0][1]); 
            } else { 
                xPoint.push(currentBbox[0][1]); 
            } 
            requestQueue.push([id, [xPoint, yPoint], level]); 
        } 
 
        if (currentBbox[1][1] < bbox[1][1]) { 
            var xPoint = [currentBbox[0][0], bbox[1][1]]; 
            var yPoint = []; 
            if (bbox[1][0] < currentBbox[1][0]) { 
                yPoint.push(bbox[1][0]); 
            } else { 
                yPoint.push(currentBbox[1][0]); 
            } 
            yPoint.push(currentBbox[1][1]); 
            requestQueue.push([id, [xPoint, yPoint], level]); 
        } 
    } 
    dataSetsList[id].bbox = currentBbox; 
    getData(); 
 
} 
 
/* 
 * getData makes a AJAX request to the backend and pulls the dataset and processes the xml 
 * and then processes the spatial data and draws on the map 
 */ 
//var dataSets = {}; 
function getData() { 
    if (requestQueue.length == 0) { 
        return; 
    } 
 
    var item = requestQueue.shift(); 
    var id = item[0]; 
    var bbox = item[1]; 
    var level = item[2]; 
 
    var url = serverIp + "/getdataset.aspx?" 
 
    var parameters = "id=" + id + 
            "&lat1=" + bbox[0][1] + 
            "&lon1=" + bbox[0][0] + 
            "&lat2=" + bbox[1][1] + 
            "&lon2=" + bbox[1][0] + 
            "&level=" + level; 
 
    var xhr = makeCORSRequest(url + parameters, "GET", function (err, http_request) { 
        var dataset, 
            data; 
 
        if (err) { 
            console.error("[getData] " + err); 
            //setMessage("Server is not responding:" + err); 
            return; 
        } 
 
        //parse the XML 
        dataset = TerraFly.XMLDataSet.parse(http_request.responseXML); 
         
        //no records found, perhaps there was no data found within the current map boundary. 
        if (dataset == null) { 
            getData(); 
            if (!dataSetsList[id].data) { 
                //setMessage("No data found in this boundary, try in a different area"); 
                removeFromMap(id); 
            } 
            return; 
        } 
 
        // a GeoData object does not exist for the dataset 
        if (!dataSetsList[id].data) { 
            data = new GeoData(mapApp.GetMap(), dataSetsList[id].name, id, dataset.keys, dataset.records); 
            dataSetsList[id].data = data; 
            if (settings[id]) { 
                data.setStyle(settings[id].style); 
                recalculateRanges(data); 
                data.draw(function () { 
                    if (settings[id].analysis) { 
                        getAnalysis(id, settings[id].analysis); 
                    } 
                    delete settings[id]; 
                }); 
            } else if (!data.style) { 
                setDataSettings(id, data, function () { 
                    data.draw(); 
                }); 
            } else { 
                recalculateRanges(data); 
                data.draw(); 
            } 
        } else { 
            // dataset exists 
            data = dataSetsList[id].data; 
            data.addRecords(dataset.records); 
            recalculateRanges(data); 
        } 
 
        getData(); 
    }); 
 
    xhr.send(); 
} 
 
function getAnalysis(id, analysisParams) { 
    if (analysisParams.type == "autocorre") { 
        if (analysisParams.params[0] == "single") { 
            autoCorrelation(id, "Single", analysisParams.params[1]); 
        } else { 
            autoCorrelation(id, "Bivariate", analysisParams.params[1], analysisParams.params[2]); 
        } 
    } 
} 
 
function recalculateRanges(data) { 
    var style = data._style; 
    if (data.records[0].geometry.type == "Point") { 
        var color = style.color; 
        if (color.type === "Range") { //if it a color range, must recalculate it. 
            var attribute = color.attribute; 
            var colors = color.value['_color']; 
            var value = calculateRangeValue(data.records, attribute, colors); 
            data.styles('color', function (record) { 
                return value[record[attribute]]; 
            }); 
        } 
    } else { //Polygon 
        if (style.fillColor.type == "Range") { 
            var fillColor = style.fillColor; 
            var colorsValue = fillColor["_color"]; 
            var attribute = fillColor.attribute; 
            var value = calculateClasses(data.records, attribute, fillColor.classes, colorsValue); 
 
            data.styles('fillColor', function (record) { 
                return value[record[attribute]]; 
            }); 
        } 
    } 
    data.style = style; 
} 
 
/* 
 * setMessage uses TerraFly's API to show a message  
 * message is a string which would be displayed 
 * animTime is the delay till it fades in ms. 
function setMessage(message, animTime) { 
    map0.SetMessageAlpha(0); 
    map0.MBFadeAni(0, 100); 
    map0.SetMessageText(message); 
    animTime = animTime || 3000; 
    setTimeout(function () { map0.HideMessageBar(); }, animTime); 
} 
*/ 
 
 
/* 
 * Has the draw settings for the data 
 * 
 */ 
function setDataSettings(id, data, fn) { 
    var tabContainer = dijit.registry.byId("settingsTabs"); 
    var generalTab = dijit.byId("generalSettings"); 
    var pointTab = dijit.byId("pointSettings"); 
    var polygonTab = dijit.byId("polygonSettings"); 
 
    tabContainer.selectChild(generalTab); 
 
    var attributes = data.keys; 
    var attriSelect = dojo.byId('attribute'); 
    var markSelect = dojo.byId('markerName'); 
    var pAttriSelect = dojo.byId('pAttribute'); 
    attriSelect.innerHTML = ""; 
    markSelect.innerHTML = ""; 
    pAttriSelect.innerHTML = ""; 
    for (var i = 0; i < attributes.length; i++) { //create the options for the dropdown 
        var attribute = attributes[i]; 
        attriSelect.add(new Option(attribute)); 
        markSelect.add(new Option(attribute)); 
        pAttriSelect.add(new Option(attribute)); 
    } 
 
 
    //connect to the button an onclick event to pass the correct id 
    var handler = dojo.connect(dojo.byId('dataButton'), 'onclick', function () { 
        submitDataSettings(id, data, fn); 
        dijit.byId("settingsDialog").hide(); 
        dojo.disconnect(handler); 
    }); 
    if (data.records[0].geometry.type == "Point") { 
        //create the different palette tool tips. 
        createPaletteTooltip(dojo.byId('color')); 
        createPaletteTooltip(dojo.byId('lowColor')); 
        createPaletteTooltip(dojo.byId('highColor')); 
        pointTab.set("disabled", false); 
        polygonTab.set("disabled", true); 
    } else { 
        createPaletteTooltip(dojo.byId('fillColor')); 
        createPaletteTooltip(dojo.byId('lineColor')); 
        pointTab.set("disabled", true); 
        polygonTab.set("disabled", false); 
    } 
    dijit.byId("settingsDialog").show(); //finally show the dialog 
} 
 
/* 
 * helper function used to create palette tooltips, just provide the Node. 
 */ 
function createPaletteTooltip(node) { 
    var myPalette = new dijit.ColorPalette({ 
        palette: "7x10", 
        onChange: function (val) { node.value = val; } 
    }); 
 
    var myTooltipDialog = new dijit.TooltipDialog({ 
        style: "width: 250px;", 
        content: myPalette, 
        onMouseLeave: function () { 
            dijit.popup.close(myTooltipDialog); 
        } 
    }); 
 
    dojo.connect(node, 'onclick', function () { 
        dijit.popup.open({ 
            popup: myTooltipDialog, 
            around: node 
        }); 
    }); 
} 
 
/* 
 * called when the user is done editing the settings for the dataset and then applies it 
 */ 
function submitDataSettings(id, data, fn) { 
    var style = {}; 
    if (data.records[0].geometry.type == "Point") { 
        var markerName = dojo.byId("markerName").value; 
        style = { color: {}, markerName: markerName }; //create a style object with color object 
        data.styles('markerName', function (record) { 
            return record[markerName]; 
        }); 
 
        if (dojo.byId('singleColor').checked === true) { //if they choose a single color 
            style.color.type = "Single"; // make it type Single 
            style.color.value = dojo.byId("color").value; //and just assign the color value 
            data.styles('color', style.color.value); 
        } else if (dojo.byId('rangeColor').checked === true) { 
            var color = []; 
            var attribute = dojo.byId("attribute").value; // and attribute values from the fields 
 
            var value = dojo.byId('rangeValues').value; 
            //checks what is the value of the dropdown box 
            switch (value) { 
                case "red-blue": 
                    color.push("#ff0000"); //red 
                    color.push("#0000ff"); //blue 
                    break; 
                case "blue-yellow": 
                    color.push("#0000ff"); //blue 
                    color.push("#ffff00"); //yellow 
                    break; 
                case "red_green_blue": 
                    color.push("#ff0000"); 
                    color.push("#00ff00"); 
                    color.push("#0000ff"); 
                    break; 
                default: 
                    color.push(dojo.byId("lowColor").value); // low 
                    color.push(dojo.byId("highColor").value); // high 
            } 
 
            var value = calculateRangeValue(data.records, attribute, color); 
            data.styles('color', function (record) { 
                return value[record[attribute]]; 
            }); 
 
            style.color = { 
                type: "Range", //type Range 
                attribute: attribute, //remember what attribute it was on 
                _color: color 
            } 
 
        } else if (dojo.byId('imgMarker').checked === true) { 
            style.imgMarker = {}; 
            if (dojo.byId('markerPoint').checked === true) { 
                style.imgMarker = "a"; 
                marker = imageMarkers.a; 
            } else { 
                style.imgMarker = "b"; 
                marker = imageMarkers.b; 
            } 
            data.styles('imgMarker', marker); 
 
 
        } 
    } else { //Polygon 
        //style = { 'fillColor': "#aaccff", 'fillAlpha': 50, 'lineColor': "#ffff00", 'lineWidth': 1, 'lineAlpha': 100 }; 
        style.fillAlpha = parseInt(dojo.byId("fillAlpha").value); 
        style.lineColor = dojo.byId("lineColor").value; 
        style.lineWidth = parseInt(dojo.byId("lineWidth").value); 
        style.lineAlpha = parseInt(dojo.byId("lineAlpha").value); 
 
        data.styles('fillAlpha', style.fillAlpha) 
            .styles('lineColor', style.lineColor) 
            .styles('lineWidth', style.lineWidth) 
            .styles('lineAlpha', style.lineAlpha); 
 
        var fillColor = {}; 
 
        if (dojo.byId("pSingle").checked == true) { 
            fillColor.type = "Single"; 
            fillColor.value = dojo.byId("fillColor").value; 
            data.styles('fillColor', fillColor.value); 
        } else { 
            var colorsValue = dojo.byId("pRangeColors").value; 
            switch (colorsValue) { 
                case "red_blue": 
                    colorsValue = ['#ff0000', '#0000ff']; 
                    break; 
                default: 
                    colorsValue = ["#F7D0A8", "#8F4801"]; 
            } 
            fillColor = { type: "Range" }; 
            var attribute = dojo.byId("pAttribute").value; 
            var classes = parseInt(dojo.byId("classes").value); 
            fillColor.attribute = attribute; 
            fillColor.classes = classes; 
 
            var value = calculateClasses(data.records, attribute, classes, colorsValue); 
            data.styles('fillColor', function (record) { 
                return value[record[attribute]]; 
            }); 
            fillColor._color = colorsValue; 
        } 
        style.fillColor = fillColor; 
    } 
 
    data._style = style; 
 
    fn(); 
} 
 
/* 
 * Helper function which calculates the classes and assign values to them 
 * 
 */ 
function calculateClasses(records, attribute, classes, colorRange) { 
 
    var attributeValues = []; 
 
    //Gather each unique value 
    for (var i = 0; i < records.length; i++) { 
        if (attributeValues.indexOf(records[i][attribute])) { //checks if it is in the array 
            attributeValues.push(records[i][attribute]); 
        } 
    } 
 
    //Sort the values, might need to be changed to be more general 
    var sortedValues = attributeValues.sort(function (a, b) { 
        return a - b 
    }); 
    var length = attributeValues.length / classes; 
 
    var range = hexColorRange(colorRange[0], colorRange[1], classes); 
 
    var colorValues = {}; 
 
    for (var i = 0; i < sortedValues.length; i++) { 
        colorValues[sortedValues[i]] = range[Math.floor(i / length)]; 
    } 
 
    return colorValues; 
} 
 
/* 
 * Performs the range calculation for each unique value of the attribute 
 * returns an objet of color hex value strings to attribute values 
 */ 
function calculateRangeValue(records, attribute, color) { 
 
    var attributeValues = []; //array to store the unique attribute values 
    for (var i = 0; i < records.length; i++) { 
        if (attributeValues.indexOf(records[i][attribute]) == -1) { //checks if it is in the array 
            attributeValues.push(records[i][attribute]); 
        } 
    } 
    var colors; 
    if (color.length === 2) { 
 
        colors = hexColorRange(color[0], color[1], attributeValues.length); //create the range 
    } else { 
 
        colors = complexColorRange(color[0], color[1], color[2], attributeValues.length); 
    } 
    var value = { _color: color } //keep a referene to the color for when redrawing 
    for (var i = 0; i < colors.length; i++) { 
        value[attributeValues[i]] = colors[i]; // assign attribute value to color pair 
    } 
    return value; 
} 
 
//var newData = dataSets[7].records.sort(function(a,b) { a.value - b.value } ) 
 
/* 
* showeTable replaces drawTable function and uses Dojo's dialog system to display 
* the table 
* parameters: a records object, an array of keys to the object's "key value pairs". 
*/ 
function showTable(id) { 
    if (!dataSetsList[id].data || dijit.byId(id + "table")) { 
        return; 
    } 
 
    var data = dataSetsList[id].data, 
        records = data.records, 
        keys = [], 
        image = ""; 
 
    for (var i = 0; i < data.keys.length; i++) { 
        if (data.keys[i] !== "spatial") 
            keys.push(data.keys[i]); 
    } 
    // create the table tags 
    image += '<table class="dataTable"><thead><tr>'; 
    // add a table header (thead) which can be used to give the header a nice CSS style 
    for (var i = 0; i < keys.length; i++) { 
        image += "<th>" + keys[i] + "</th>"; 
    } 
    image += "</tr></thead><tbody>"; 
    // loop over creating each row of the table 
    for (var i = 0; i < records.length; i++) { 
        var record = records[i]; 
        image += "<tr>"; 
        //loop over to create the data cells for the roll 
        for (var j = 0; j < keys.length; j++) { 
            image += "<td>" + record[keys[j]] + "</td>"; 
        } 
        image += "</tr>"; 
    } 
 
    image += "</tbody></table>"; 
    image = "<div class='table'>" + image + "</div>"; 
    createFloatingPane(id + "table", dataSetsList[id].name, image, true); 
} 
 
 
/* 
* getDataSetList just returns the existing datasets 
*/ 
function getDataSetList() { 
    var list = [] 
    for (var set in dataSetsList) { 
        list.push(dataSetsList[set]); 
    } 
    return list; 
} 
 
 
/* 
 * existingDataSetButton is called by the 'Create from existing Dataset' menu item 
 * it gets the dataSetList and processes it to create a radio button selection  
 * of current data sets to be processed. It then calls the wizard to show. 
 */ 
function existingDataSetButton() { 
    var dataSetList = getDataSetList(); 
 
    var image = "<h2>Existing DataSets</h2>"; 
    for (var i = 0; i < dataSetList.length; i++) { 
        image += '<input type="radio" name="id" value="' + dataSetList[i].id + '"/>'; 
        image += dataSetList[i].name + "<br>"; 
    } 
 
    var operations = ""; 
 
    operations = '<input type="radio" name="methodname" value="clustering"  onclick="onClusterClick()"/>' + 
                ' Clustering <br>'; 
 
    dojo.byId("wizardDataSets").innerHTML = image; 
    dojo.byId("operations").innerHTML = operations; 
 
    dijit.byId('wizardDialog').show(); 
} 
 
function uploadDataSetButton() { 
    dijit.byId('uploadDialog').show(); 
} 
 
/* 
 * toggleLayer is called when the user changes the checkbox next to a layer name 
 * It then checks the box and either hides the layer or makes it visible depending on value 
 */ 
function toggleLayer(id) { 
    if (dataSetsList[id].data.layer) { //check to see if the layer even exists 
        if (dojo.byId(id + 'toggle').checked) { 
            dataSetsList[id].data.layer.SetVisible(true); 
        } else { 
            dataSetsList[id].data.layer.SetVisible(false); 
        } 
    } 
} 
 
/* 
 * The mapMoved function is called by the TerraFlyAPI when the map moves 
 * it calls requestNeededData on all data in dataSets 
 * then it calls getData to get the data from the server. 
 */ 
function mapMoved() { 
    var datasets = getCurrentDataSets(); 
    for (var i in datasets) { 
        requestNeededData(datasets[i]); 
    } 
    for (var id in userDatasets) { 
        if (userDatasets[id].type == "GroundTile") { 
            userDatasets[id].data.redraw(); 
        } 
    } 
    document.location.replace("#" + createUriParams());
} 
 
/* 
 * mapZoomed is called by TerraFly's API on Zoom end function  
 * it cleans the layer and deletes the dataset and then calls 
 * requestNeededData to fetch the new data from the server. 
 * This is done for any level of detail done on the dataset by the server. 
 */ 
function mapZoomed() { 
    var datasets = getCurrentDataSets(); 
    for (var i in datasets) { 
        requestNeededData(datasets[i], true); 
    } 
    for (var id in userDatasets) { 
        if (userDatasets[id].type == "GroundTile") { 
            userDatasets[id].data.redraw(); 
        } 
    } 
    document.location.replace("#" + createUriParams()) 
    //mapMoved(); 
} 
 
 
function wizardDone() { 
    var query = dojo.formToQuery("existingDataSetParameters"); 
    url = "proxy/?" + serverIp + "/generatedataset.aspx?" + query; 
    var downloadObj = new TDownloadRequest(url, 
	function (http_request, status) { 
	    //anonymous callback function 
	    if (http_request.status == 200) { 
	        setTimeout(getDataSets, 1000); 
	    } 
	}); 
    downloadObj.Send(); 
    dijit.byId("wizardDialog").hide(); 
} 
 
function onClusterClick() { 
    var node = dojo.byId("operationParameters"); 
    node.innerHTML = "Clustering <br>" + 
                     "New Name:<input type='text' name='targetname'> <br>" + 
                     "Minimal Points:<input type='text' name='a' class='number' value='3'> <br>" + 
                     "Epsilon:<input type='text' name='b' class='number' value='1.5'> <br>"; 
} 
 
/* 
 * Gets all currently drawn datasets and returns an array 
 */ 
function getCurrentDataSets() { 
    var drawnData = []; 
    for (var id in dataSetsList) { 
        if (dataSetsList[id].data) { 
            drawnData.push(id); 
        } 
    } 
    return drawnData; 
} 
 
/* 
 * Gets the style code to identify the styles 
 * m = Point/Marker 
 * p = Polygon 
 * s = single 
 * r = range 
 * i = image 
 * returns a string example "ms" for a marker with a single color scheme 
 */ 
function getStyleCode(id) { 
    var style = dataSetsList[id].data.style; 
    var image = ""; 
 
    if (style.markerName) { 
        image += "m" 
 
        var type = style.color.type; 
        if (type == "Single") { 
            image += "s"; 
        } else if (type == "Range") { 
            image += "r"; 
        } else { 
            image += "i"; 
        } 
 
    } else { //polygon 
        image += "p"; 
 
        if (style.fillColor.type == "range") { 
            image += "r"; 
        } else { 
            image += "s"; 
        } 
 
    } 
 
    return image; 
} 
 
function showExpression() { 
    var select = createDataSetSelect(), 
        expression = document.createElement("input"), 
        tableBtn = document.createElement("button"), 
        enter = document.createElement("button"), 
        clear = document.createElement("button"), 
        errorBox = document.createElement("div"), 
        datasetDiv = document.createElement("div"), 
        expDiv = document.createElement("div"), 
        datasetLabel = document.createElement("label"), 
        expressionLabel = document.createElement("label"), 
        pane = createFloatingPane("columnPane", "Add a column", "<div id='columnContent'> </div>"); 
 
    expression.type = "text"; 
    tableBtn.className = "btn"; 
    enter.className = "btn"; 
    clear.className = "btn"; 
    tableBtn.innerHTML = "Show Table"; 
    enter.innerHTML = "Enter"; 
    clear.innerHTML = "Clear"; 
    errorBox.className = "error"; 
    errorBox.style.display = "none"; 
 
    datasetLabel.innerHTML = "Datasets:"; 
    expressionLabel.innerHTML = "Expression:"; 
 
    tableBtn.onclick = function () { 
        showTable(select.value); 
    }; 
 
    enter.onclick = function () { 
        generateNewColumn(select.value, expression.value, errorBox); 
    }; 
 
    clear.onclick = function () { 
        expression.value = ""; 
        errorBox.style.display = "none"; 
 
    }; 
 
    datasetDiv.appendChild(datasetLabel); 
    datasetDiv.appendChild(select); 
    datasetDiv.appendChild(tableBtn); 
 
    expDiv.appendChild(expressionLabel); 
    expDiv.appendChild(expression); 
    expDiv.appendChild(enter); 
    expDiv.appendChild(clear); 
 
    var columnContent = document.getElementById("columnContent"); 
    columnContent.appendChild(datasetDiv); 
    columnContent.appendChild(expDiv); 
    columnContent.appendChild(errorBox); 
 
 
 
 
} 
 
function generateNewColumn(id, expression, errorBox) { 
    try { 
        var values = DataSetExp.parse(expression, dataSetsList[id].data.records); 
    } catch (err) { 
        errorBox.innerHTML = "<p>" + err + "</p>"; 
        errorBox.style.display = "block"; 
        return; 
    } 
    errorBox.style.display = "none"; 
    var content = dojo.byId("charts"), 
        tableDiv = document.createElement("div"), 
        addDiv = document.createElement("div"), 
        columnName = document.createElement("input"), 
        addButton = document.createElement("button"), 
        table = "", 
        errorMsg = document.createElement("div"), 
        dialog = dijit.byId("chartDialog"); 
 
 
    content.innerHTML = ""; 
 
    table = "<table><tbody>"; 
    for (var i in values) { 
        table += "<tr><td>" + values[i] + "</td></tr>"; 
    } 
 
    table += "</tbody></table>"; 
 
    addButton.innerHTML = "Add"; 
    errorMsg.className = "error"; 
 
    addDiv.appendChild(document.createTextNode("New Column Name")); 
    addDiv.appendChild(document.createElement("br")); 
    addDiv.appendChild(columnName); 
    addDiv.appendChild(document.createElement("br")); 
    addDiv.appendChild(addButton); 
    addDiv.appendChild(document.createElement("br")); 
    addDiv.appendChild(errorMsg); 
 
    addButton.onclick = function () { 
        try { 
            dataSetsList[id].data.addColumn(columnName.value, values); 
            errorMsg.style.display = "none"; 
            dialog.hide(); 
        } catch (e) { 
            errorMsg.innerHTML = e; 
            errorMsg.style.display = "inline-block"; 
        } 
 
    }; 
 
    tableDiv.innerHTML = table; 
    tableDiv.style.cssFloat = "left"; 
    tableDiv.style.styleFloat = "left"; 
    tableDiv.style.marginRight = "50px"; 
    content.appendChild(tableDiv); 
    content.appendChild(addDiv); 
 
    dialog.show(); 
 
} 
 
 
function createDataSetSelect(all) { 
    var select = document.createElement("select"); 
    select.add(new Option()); 
    for (var dataset in dataSetsList) { 
        if (all || dataSetsList[dataset].data) { 
            var option = new Option(dataSetsList[dataset].name); 
            option.value = dataset; 
            select.add(option); 
        } 
    } 
 
    return select; 
} 
 
function calcDiseaseCluster(id, method, alpha, data) { 
    var geodata = data || dataSetsList[id].data.toGeoJSON(true), 
        content = "", 
        xhr; 
 
    content = "geodata=" + geodata + "&method=" + method + "&alpha=" + alpha; 
 
    xhr = makeCORSRequest("http://131.94.133.233/cgi-bin/diseaseDetect.py", "POST", function (err, result) { 
        if (err) { 
            var msg = "[calcDiseaseCluster] " + err; 
            console.error(msg); 
            basicStandby.hide(); 
            return; 
        } 
 
        handleDiseaseClust(result.responseText, id, method, alpha); 
    }); 
 
    document.body.appendChild(basicStandby.domNode); 
    basicStandby.show(); 
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 
    xhr.send(content); 
} 
 
function handleDiseaseClust(response, id, method, alpha) { 
    var data = parseDiseaseCluster(response), 
        name = dataSetsList[id].name + " disease cluster", 
        dialog = dijit.byId("chartDialog"); 
 
    basicStandby.hide(); 
    dialog.hide(); 
    var dataset = {}; 
    dataset.id = id + method + alpha; 
    dataset.type = "GeoData"; 
    dataset.name = dataSetsList[id].name + " " + method + " " + alpha; 
    dataset.data = new GeoData(mapApp.GetMap(), dataset.name, alpha, data.keys, data.records); 
 
    userDatasets[dataset.id] = dataset; 
 
    // prompt dataset style settings 
    setDataSettings(dataset.id, dataset, function () { 
        addInfoWindow(dataset); 
    }); 
} 
 
function diseaseCluster() { 
    var dialog = dijit.byId("chartDialog"), 
        datasets = createDataSetSelect(), 
        content = dojo.byId("charts"), 
        method = document.createElement("select"), 
        alpha = document.createElement("input"), 
        submit = document.createElement("button"); 
 
    content.innerHTML = ""; 
 
    method.add(new Option("pam")); 
    method.add(new Option("bnpam")); 
    method.add(new Option("knpam")); 
 
    alpha.value = "0.02"; 
 
    submit.onclick = function () { 
        calcDiseaseCluster(datasets.value, method.value, alpha.value); 
    }; 
 
    submit.appendChild(document.createTextNode("Analyze")); 
    content.appendChild(document.createTextNode("Dataset :")); 
    content.appendChild(datasets); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(document.createTextNode("Method: ")); 
    content.appendChild(method); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(document.createTextNode("alpha: ")); 
    content.appendChild(alpha); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(submit); 
 
    dialog.show(); 
 
} 
 
 
 
function addInfoWindow(data) { 
    data.addEvent("click", true, function () { 
        var image = []; 
 
        for (var key in this) { 
            if (key !== "_feature" && key !== "geometry") { 
                image.push(key + ": " + this[key]); 
            } 
 
        } 
 
        this._feature.ShowInfoWindow("width=240;height=100", "data", image.join('\n')); 
    }); 
} 
 
function infoWindow() { 
    var dialog = dijit.byId("chartDialog"), 
        datasets = createDataSetSelect(), 
        content = dojo.byId("charts"), 
        ok = document.createElement("button"), 
        datasetLabel = document.createElement("label"); 
 
    content.innerHTML = ""; 
    datasetLabel.innerHTML = "Dataset:"; 
    ok.className = "btn"; 
 
    ok.onclick = function () { 
        addInfoWindow(dataSetsList[datasets.value].data); 
        dialog.hide(); 
    }; 
 
    ok.appendChild(document.createTextNode("OK")); 
 
    content.appendChild(datasetLabel); 
    content.appendChild(datasets); 
    content.appendChild(ok); 
 
    dialog.show(); 
} 
 
function makeCORSRequest(url, method, callback) { 
    if (typeof XMLHttpRequest === "undefined") { 
        return null; 
    } 
 
    var xhr = new XMLHttpRequest(); 
    if ("withCredentials" in xhr) { 
        xhr.open(method, url, true); 
    } else { 
        xhr.open(method, "proxy/?" + url, true); 
    } 
 
    xhr.onreadystatechange = function () { 
        if (xhr.readyState == 4) { 
            if (xhr.status == 200) { 
                callback(null, xhr); 
            } else { 
                callback(new Error("Request failed: Status " + xhr.status)); 
            } 
        } 
    }; 
 
    return xhr; 
} 
 
function createScatterPlot() { 
    var dialog = dijit.byId("chartDialog"), 
        content = dojo.byId("charts"), 
        button = document.createElement("button"), 
        select = createDataSetSelect(), 
        propSelectx = document.createElement("select"), 
        propSelecty = document.createElement("select"), 
        datasetLabel = document.createElement("label"), 
        xLabel = document.createElement("label"), 
        yLabel = document.createElement("label"); 
 
 
    select.id = "scatterPlotDataSet"; 
    content.innerHTML = ""; 
    button.className = "btn"; 
 
    button.onclick = function () { 
        dialog.hide(); 
        drawScatterPlot(dataSetsList[select.value].data.records, dataSetsList[select.value].name, propSelectx.value, propSelecty.value); 
    } 
    select.onchange = function () { 
        var keys = dataSetsList[this.value].data.keys; 
        propSelectx.innerHTML = ""; 
        propSelecty.innerHTML = ""; 
        for (var i = 0; i < keys.length; i++) { 
            propSelectx.add(new Option(keys[i])); 
            propSelecty.add(new Option(keys[i])); 
        } 
    } 
 
    datasetLabel.appendChild(document.createTextNode("Dataset:")); 
    xLabel.appendChild(document.createTextNode("X:")); 
    yLabel.appendChild(document.createTextNode("Y:")); 
    button.appendChild(document.createTextNode("OK")); 
    content.appendChild(datasetLabel); 
    content.appendChild(select); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(xLabel); 
    content.appendChild(propSelectx); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(yLabel); 
    content.appendChild(propSelecty); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(button); 
 
    dialog.show(); 
} 
 
function createPieChart() { 
    var dialog = dijit.byId("chartDialog"), 
        content = dojo.byId("charts"), 
        button = document.createElement("button"), 
        select = createDataSetSelect(), 
        valueSelect = document.createElement("select"), 
        labelSelect = document.createElement("select"), 
        datasetLabel = document.createElement("label"), 
        valueLabel = document.createElement("label"), 
        labelLabel = document.createElement("label"); 
 
    select.id = "PieChartDataSet"; 
    content.innerHTML = ""; 
    button.className = "btn"; 
 
    button.onclick = function () { 
        dialog.hide(); 
        drawPieChart(dataSetsList[select.value].data.records, dataSetsList[select.value].name, valueSelect.value, labelSelect.value); 
    } 
    select.onchange = function () { 
        var keys = dataSetsList[this.value].data.keys; 
        valueSelect.innerHTML = ""; 
        labelSelect.innerHTML = ""; 
        for (var i = 0; i < keys.length; i++) { 
            valueSelect.add(new Option(keys[i])); 
            labelSelect.add(new Option(keys[i])); 
        } 
    } 
 
    datasetLabel.appendChild(document.createTextNode("Dataset:")); 
    valueLabel.appendChild(document.createTextNode("Value:")); 
    labelLabel.appendChild(document.createTextNode("Label:")); 
 
    button.appendChild(document.createTextNode("OK")); 
    content.appendChild(datasetLabel); 
    content.appendChild(select); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(valueLabel); 
    content.appendChild(valueSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(labelLabel); 
    content.appendChild(labelSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(button); 
 
    dialog.show(); 
} 
