/** 
 * Makes a request for Kriging image 
 * @param {string} id - The id of the dataset 
 * @param {string} sampleRate - The sample rate for Kriging 
 * @param {string} alpha - The transparancy value for the image 
 * @param {object} [userData] - Optional dataset, used to redraw the image when the map moves 
 */ 
function krigingRequest(id, sampleRate, alpha, userData) { 
    //var krigingUrl = "http://131.94.133.223/kriging/Default.aspx"; 
    var krigingUrl = "http://jarvis.cs.fiu.edu/kriging/default.aspx", 
        boundary = map0.GetBounds(), 
        lat1 = boundary.latitude1, 
        lon1 = boundary.longitude1, 
        lat2 = boundary.latitude2, 
        lon2 = boundary.longitude2, 
        level = map0.GetLevel(), 
        requestParams = "?ul_lat=" + lat1 + 
                        "&ul_lon=" + lon1 + 
                        "&br_lat=" + lat2 + 
                        "&br_lon=" + lon2 + 
                        "&level=" + level + 
                        "&datasetid=" + id + 
                        "&smp_rate=" + sampleRate, 
        url = encodeURI(krigingUrl + requestParams), 
        name = dataSetsList[id].name + " kriging", 
        dataset = {}; 
 
    if (userData) { 
        userData.layer.Clean(); 
        userData.tile = userData.layer.AddGroundTile(url, lat1, lon1, lat2, lon2); 
        userData.tile.SetGroundTileStyle( { opacity: alpha / 100 } );
    } else { 
        dataset.name = name; 
        dataset.id = id + "k"; 
        dataset.info = [id, "krigingRequest", sampleRate, alpha];
        dataset.data = {}; 
        dataset.type = "GroundTile"; 
        dataset.data.layer = map0.AddLayer(name, dataset.id, true, false); 
        dataset.data.tile = dataset.data.layer.AddGroundTile(url, lat1, lon1, lat2, lon2); 
        dataset.data.tile.SetGroundTileStyle( { opacity: alpha / 100 } );
        dataset.data.redraw = (function (id, sampleRate, alpha) { 
            return function () { 
                krigingRequest(id, sampleRate, alpha, this); 
            }; 
 
        })(id, sampleRate, alpha); 
 
        userDatasets[dataset.id] = dataset; 
    } 
    updateDataPanel(); 

    document.location.replace("#" + createUriParams());
} 
 
/** 
 * Shows the kriging dialog to enter input 
 */ 
function kriging() { 
    var content = document.getElementById("krigingContent"), 
        selectLabel = document.createElement("label"), 
        select = createDataSetSelect(), 
        rateLabel = document.createElement("label"), 
        rate = document.createElement("input"), 
        alphaLabel = document.createElement("label"), 
        alpha = document.createElement("input"), 
        button = document.createElement("button"); 
 
    content.innerHTML = ""; 
 
    select.id = "krigingId"; 
    rate.id = "sampleRate"; 
    alpha.id = "krigingAlpha"; 
 
    rate.className = "number"; 
    alpha.className = "number"; 
 
    selectLabel.appendChild(document.createTextNode("Dataset:")); 
    rateLabel.appendChild(document.createTextNode("Sample Rate:")); 
    alphaLabel.appendChild(document.createTextNode("Alpha:")); 
 
    selectLabel.htmlFor = "kringingId"; 
    rateLabel.htmlFor = "sampleRate"; 
    alphaLabelhtmlFor = "krigingAlpha"; 
 
    alpha.value = "50"; 
    rate.value = "10"; 
 
    button.appendChild(document.createTextNode("Analyze")); 
    button.className = "btn"; 
    button.onclick = function () { 
        krigingRequest(select.value, rate.value, alpha.value); 
        dijit.byId('krigingDialog').hide(); 
    } 
 
    content.appendChild(selectLabel); 
    content.appendChild(select); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(rateLabel); 
    content.appendChild(rate); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(alphaLabel); 
    content.appendChild(alpha); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(button); 
 
 
    dijit.byId('krigingDialog').show(); 
} 
 
/** 
 * Sends a post in GeoJSON format to process the data and return a result  
 * for auto correlation.  
 * @param {string} id - The id of the dataset to do the analysis 
 * @param {string} moranType - The type either Bivariate or Single 
 * @param {string} value - The attribute to do analysis on 
 * @param {string} [value2] - The second attribute for bivariate analysis 
 */ 
function autoCorrelation(id, moranType, value, value2) { 
    var geodata,
        content = "", 
        req; 
 
    if(dataSetsList[id] && dataSetsList[id].data) {
        geodata = dataSetsList[id].data.toGeoJSON(); 
    }
    else {
        window.setTimeout(function(){autoCorrelation(id, moranType, value, value2)}, 1000);
        return 1;
    }
    content = "geodata=" + geodata + "&vcol=" + value; 
    if (moranType === "Bivariate") { 
        content += "," + value2; 
    } 
    if (window.XMLHttpRequest) { 
        req = new XMLHttpRequest(); 
    } else { 
        req = new ActiveXObject("Microsoft.XMLHTTP"); 
    } 
 
    req.onreadystatechange = function () { 
        if (req.readyState == 4 && req.status == 200) { 
            handleAutoCorre(req.responseText, {me:"autoCorrelation", id:id, moranType:moranType,value:value, value2:value2}); 
        } 
    }; 
 
    document.body.appendChild(basicStandby.domNode); 
    basicStandby.show(); 
    req.open("POST", "/py_scripts/auto_corre_cgi.py", true); 
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 
    req.send(content); 
 
} 
 
/** 
 * Handles the auto correlation analysis results and changes the 
 * style of the data and creates a chart 
 * @param {string} response - The response data from the analysis 
 * @param {string} id - The id of the dataset 
 * @param {string} val1 - The name of the first parameter for the analysis 
 * @param {string} [val2] - The name of the second parameter for the analysis 
 */ 
function handleAutoCorre(response, info) { 
    var dataset = {}; 
 
    dataset.id = info.id + "ac"; 
    dataset.info = [info.id, info.me, info.moranType, info.value, info.value2];
    dataset.type = "paneData"; 
    dataset.name = dataSetsList[info.id].name + " spatial auto-corre"; 
    userDatasets[dataset.id] = dataset;

    basicStandby.hide(); 

    try { 
        //var result = JSON.parse(response.replace(/<\/?textarea>/ig, "")); 
        var result = JSON.parse(response.substring(response.indexOf("[{"),response.indexOf("}]")+2));
    } catch (err) { 
        console.log("Error: " + err); 
        return; 
    } 
    if (result.length == 0) { 
        setMessage("Invalid Data for Auto Correlation"); 
        return; 
    } 
    var idSet = dataSetsList[info.id].data.idSet; 
    var globalMorans = result[0].global_moransi; 
    var points = []; 
    for (var i = 0; i < result.length; i++) { 
        var point = {}, 
            feature = idSet[result[i].id]._feature; 
        point.x = result[i].std_valx; 
        if (info.val2 == "") { 
            point.y = result[i].std_sl; 
        } else { 
            point.y = result[i].std_valy 
        } 
        point.id = result[i].id; 
        var quadLoc = 0; 
        if (point.x > 0) { 
            if (point.y > 0) { 
                quadLoc = 1; 
            } else { 
                quadLoc = 4; 
            } 
        } else { 
            if (point.y > 0) { 
                quadLoc = 2; 
            } else { 
                quadLoc = 3; 
            } 
        } 
        point.quadLoc = quadLoc; 
        var color = "#FFFFFF"; 
        switch (point.quadLoc) { 
            case 1: 
                color = "#F52A34"; 
                break; 
            case 2: 
                color = "#9C9DFF"; 
                break; 
            case 3: 
                color = "#4C2AF5"; 
                break; 
            case 4: 
                color = "#FF9CA1"; 
                break; 
 
        } 
        if (feature instanceof TMarker) { 
            feature.setStyle({ color: color }); 
        } else { 
            feature.setStyle({ fillColor: color }); 
        } 
 
        points.push(point); 
    } 
    drawAutoCorrelationGraph(info.id, "Global Moran's I = " + globalMorans, { x: "std_" + info.val1, y: "std_sl_" + info.val2 }, points, globalMorans, dataset.id); 

    updateDataPanel();

    document.location.replace("#" + createUriParams());
} 
 
/** 
 * Selects a dataset for auto correlation 
 */ 
function selectDataSet() { 
    var dialog = dijit.byId("chartDialog"), 
        content = dojo.byId("charts"), 
        button = document.createElement("button"), 
        select = createDataSetSelect(), 
        moranSelect = document.createElement("select"), 
        datasetLabel = document.createElement("label"), 
        moranLabel = document.createElement("label"); 
 
    moranSelect.id = "moranType"; 
    select.id = "autoCorreDataSet"; 
    content.innerHTML = ""; 
    button.className = "btn"; 
 
    moranSelect.add(new Option("Single")); 
    moranSelect.add(new Option("Bivariate")); 
 
    button.onclick = function () { 
        calcAutoCorre(select.value, moranSelect.value); 
    } 
 
    datasetLabel.appendChild(document.createTextNode("Dataset:")); 
    moranLabel.appendChild(document.createTextNode("Moran's I type:")); 
    button.appendChild(document.createTextNode("OK")); 
    content.appendChild(datasetLabel); 
    content.appendChild(select); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(moranLabel); 
    content.appendChild(moranSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(button); 
 
    dialog.show(); 
 
} 
 
/** 
 * Shows the dialog to select parameters for auto correlations 
 */ 
function calcAutoCorre(id, moranType) { 
    var dialog = dijit.byId("chartDialog"), 
        content = dojo.byId("charts"), 
        attributes = dataSetsList[id].data.keys, 
        select = document.createElement("select"), 
        button = document.createElement("button"), 
        select2 = document.createElement("select"); 
 
    content.innerHTML = ""; 
    select.id = "autoCorreSelect"; 
    button.className = "btn"; 
 
    for (var i = 0; i < attributes.length; i++) { //create the options for the dropdown 
        var attribute = attributes[i]; 
        select.add(new Option(attribute)); 
        select2.add(new Option(attribute)); 
    } 
 
 
    button.onclick = function () { 
        autoCorrelation(id, moranType, select.value, select2.value); 
    }; 
    button.appendChild(document.createTextNode("Auto Correlation")); 
    content.appendChild(select); 
    if (moranType === "Bivariate") { 
        content.appendChild(select2); 
    } 
    content.appendChild(button); 
 
    dialog.show(); 
}
