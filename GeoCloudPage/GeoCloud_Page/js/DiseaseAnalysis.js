var diseaseUri = "http://jarvis.cs.fiu.edu/analysis/"; 
var toolDescriptions = { 
    meanCenter: "The mean center is the average x- and y-coordinate of all the features in the study area.", 
    medianFeature: "The median point is a location that minimizes travel from it to all other features in the dataset.", 
    standardDistance: "The standard distance tool provides a measure of the feature distribution around their mean center.", 
    distributionalTrend: "The Distributional trends tool provides an ellipse to give a measure of the feature distribution and trends", 
    spatialCluster: "The Spatial cluster tool provides several clusters which is a set of neighboring areas and in clusters far more cases appear. ", 
    hotSpot: "The Hotspot analysis tool identifies hot spot(cluster with high value) and cold spot(cluster with low value) using  the Getis-Ord Gi* statistic method.", 
    clusterOutlier: "The Cluster and Outlier Analysis identifies hot spot(cluster with high value) , cold spot(cluster with low value)  and outlier.This tool using Anselin Local Moran's I statistic method.", 
    diseaseMap: "The input of disease map is the cases/dead number and population number of each area, and the output is the incidence/mortality.", 
    SMRMap: "The standardized mortality ratio(SMR), is expressed as either a ratio  quantifying the increase or decrease in mortality of a study cohort with respect to the general population.", 
    linearRegression: "Linear regression is an approach to modeling the relationship between a dependent variable y and one or more explanatory variables denoted as x.", 
    spatialAutoRegressionLag: "Maximum likelihood estimation of spatial simultaneous autoregressive lag and mixed models of the form: \ny = rho W y + X beta + e", 
    spatialAutoRegressionError: " Maximum likelihood estimation of spatial simultaneous autoregressive error models of the form:\ny = X beta + u, u = lambda W u + e", 
    clusteringTool: "The clustering tool can support many datesets using several cluster method to display the users search results . ", 
    clusteringResultUrlDes: "Please get your result from the following URL-Click the 'GO' button to view the result:  " 
}; 
var legends = { 
    gizval: [ 
            ["#3661d4", Number.NEGATIVE_INFINITY, -2.58], 
            ["#9b98cd", -2.58, -1.96], 
            ["#c2c1bc", -1.96, -1.65], 
            ["#fffdc6", -1.65, 1.65], 
            ["#fecc99", 1.65, 1.96], 
            ["#f86963", 1.96, 2.58], 
            ["#ce3236", 2.58, Number.POSITIVE_INFINITY] 
 
    ], 
    pval: [ 
            ["#3661d4", 0.0, 0.01], 
            ["#9b98cd", 0.01, 0.05], 
            ["#c2c1bc", 0.05, 0.10], 
            ["#fffdc6", 0.10, 1], 
            ["#fecc99", 0.05, 0.10], 
            ["#f86963", 0.01, 0.05], 
            ["#ce3236", 0.0, 0.01] 
    ] 
}; 
 
 
 
function selectMeanCenter() { 
    var dialog = dijit.byId("chartDialog"), 
        content = dojo.byId("charts"), 
        button = document.createElement("button"), 
        datasetSelect = createDataSetSelect(), 
        weightSelect = document.createElement("select"), 
        datasetLabel = document.createElement("label"), 
        weightLabel = document.createElement("label"), 
        description = document.createElement("div"); 
 
    description.className = "description"; 
    content.innerHTML = ""; 
    button.className = "btn"; 
 
    button.onclick = function () { 
        dialog.hide(); 
        getMeanCenter(datasetSelect.value, weightSelect.value); 
 
    } 
 
    datasetSelect.onchange = function () { 
        var keys = dataSetsList[this.value].data.keys; 
        weightSelect.innerHTML = ""; 
 
        weightSelect.add(new Option("none")); 
        for (var i = 0; i < keys.length; i++) { 
            weightSelect.add(new Option(keys[i])); 
        } 
    }; 
 
    datasetLabel.appendChild(document.createTextNode("Dataset:")); 
    weightLabel.appendChild(document.createTextNode("weight:")); 
    description.appendChild(document.createTextNode(toolDescriptions.meanCenter)); 
    button.appendChild(document.createTextNode("OK")); 
 
    content.appendChild(description); 
    content.appendChild(datasetLabel); 
    content.appendChild(datasetSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(weightLabel); 
    content.appendChild(weightSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(button); 
 
    dialog.show(); 
}; 
 
function getMeanCenter(id, weight) { 
    weight = weight || "none"; 
    var url = diseaseUri + "geodistribution/meanctr/" + id + "/1/" + weight + "/"; 
 
    var xhr = makeCORSRequest(url, "GET", function (err, res) { 
        if (err) { 
            console.error("[getMeanCenter] " + err.message); 
            return; 
        } 
        handleMeanCenter(res.responseText, {me:"getMeanCenter", id:id, weight:weight}); 
    }); 
    xhr.send(); 
} 
 
function handleMeanCenter(response, info) { 
    var data = TerraFly.GeoJSON.parse(response), 
        dataset = {}, 
        style = {}; 
 
    dataset.id = info.id + "mc"; 
    dataset.info = [info.id, info.me, info.weight];
    dataset.type = "GeoData"; 
    dataset.name = dataSetsList[info.id].name + " mean center"; 
    dataset.data = new GeoData(map0, dataset.name, dataset.id, data.keys, data.records, dataset.info); 
    userDatasets[dataset.id] = dataset; 
 
    updateDataPanel(); 
 
    //setDataSettings(dataset.id, dataset.data); 
    style.markerName = "Mean Center"; 
    style.color = {}; 
    style.color.type = "Single"; 
    style.color.value = "#ff0000"; 
    dataset.data._style = style; 
 
    dataset.data.styles('markerName', function () { 
        return style.markerName; 
    }) 
                .styles('color', style.color.value) 
                .draw(); 
 
} 
 
function selectMedianFeature() { 
    var dialog = dijit.byId("chartDialog"), 
        content = dojo.byId("charts"), 
        button = document.createElement("button"), 
        datasetSelect = createDataSetSelect(), 
        weightSelect = document.createElement("select"), 
        datasetLabel = document.createElement("label"), 
        weightLabel = document.createElement("label"), 
        description = document.createElement("div"); 
 
    description.className = "description"; 
    content.innerHTML = ""; 
    button.className = "btn"; 
 
    button.onclick = function () { 
        dialog.hide(); 
        getMedianFeature(datasetSelect.value, weightSelect.value); 
    } 
 
    datasetSelect.onchange = function () { 
        var keys = dataSetsList[this.value].data.keys; 
        weightSelect.innerHTML = ""; 
 
        weightSelect.add(new Option("none")); 
        for (var i = 0; i < keys.length; i++) { 
            weightSelect.add(new Option(keys[i])); 
        } 
    }; 
 
    datasetLabel.appendChild(document.createTextNode("Dataset:")); 
    weightLabel.appendChild(document.createTextNode("weight:")); 
    button.appendChild(document.createTextNode("OK")); 
    description.appendChild(document.createTextNode(toolDescriptions.medianFeature)); 
 
    content.appendChild(description); 
    content.appendChild(datasetLabel); 
    content.appendChild(datasetSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(weightLabel); 
    content.appendChild(weightSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(button); 
 
    dialog.show(); 
}; 
 
function getMedianFeature(id, weight) { 
    weight = weight || "none"; 
    var url = diseaseUri + "geodistribution/medianctr/" + id + "/1/" + weight + "/"; 
 
    var xhr = makeCORSRequest(url, "GET", function (err, res) { 
        if (err) { 
            console.error("[getMedianFeature] " + err.message); 
            return; 
        } 
        handleMedianFeature(res.responseText, {me:"getMedianFeature", id:id, weight:weight}); 
    }); 
    xhr.send(); 
} 
 
function handleMedianFeature(response, info) { 
    var data = TerraFly.GeoJSON.parse(response), 
        dataset = {}, 
        style = {}; 
 
    dataset.id = info.id + "mf"; 
    dataset.info = [info.id, info.me, info.weight];
    dataset.type = "GeoData"; 
    dataset.name = dataSetsList[info.id].name + " median feature"; 
    dataset.data = new GeoData(map0, dataset.name, dataset.id, data.keys, data.records, dataset.info); 
    userDatasets[dataset.id] = dataset; 
 
    updateDataPanel(); 
 
    //setDataSettings(dataset.id, dataset.data); 
    style.markerName = "Median Feature"; 
    style.color = {}; 
    style.color.type = "Single"; 
    style.color.value = "#ff0000"; 
    dataset.data._style = style; 
 
    dataset.data.styles('markerName', function () { 
        return style.markerName; 
    }) 
                .styles('color', style.color.value) 
                .draw(); 
} 
 
function selectStandardDistance() { 
    var dialog = dijit.byId("chartDialog"), 
        content = dojo.byId("charts"), 
        button = document.createElement("button"), 
        datasetSelect = createDataSetSelect(), 
        weightSelect = document.createElement("select"), 
        stdSelect = document.createElement("select"), 
        datasetLabel = document.createElement("label"), 
        weightLabel = document.createElement("label"), 
        stdLabel = document.createElement("label"), 
        description = document.createElement("div"); 
 
    description.className = "description"; 
    content.innerHTML = ""; 
    button.className = "btn"; 
 
    button.onclick = function () { 
        dialog.hide(); 
        getStandardDistance(datasetSelect.value, weightSelect.value, stdSelect.value); 
 
    } 
 
    stdSelect.add(new Option("1.0")); 
    stdSelect.add(new Option("2.0")); 
    stdSelect.add(new Option("3.0")); 
 
 
    datasetSelect.onchange = function () { 
        var keys = dataSetsList[this.value].data.keys; 
        weightSelect.innerHTML = ""; 
 
        weightSelect.add(new Option("none")); 
        for (var i = 0; i < keys.length; i++) { 
            weightSelect.add(new Option(keys[i])); 
        } 
    }; 
 
    datasetLabel.appendChild(document.createTextNode("Dataset:")); 
    weightLabel.appendChild(document.createTextNode("weight:")); 
    stdLabel.appendChild(document.createTextNode("standard:")); 
    button.appendChild(document.createTextNode("OK")); 
    description.appendChild(document.createTextNode(toolDescriptions.standardDistance)); 
 
    content.appendChild(description); 
    content.appendChild(datasetLabel); 
    content.appendChild(datasetSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(weightLabel); 
    content.appendChild(weightSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(stdLabel); 
    content.appendChild(stdSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(button); 
 
    dialog.show(); 
}; 
 
function getStandardDistance(id, weight, std) { 
    weight = weight || "none"; 
    var url = diseaseUri + "geodistribution/stddst/" + id + "/1/" + weight + "/" + std + "/" 
 
    var xhr = makeCORSRequest(url, "GET", function (err, res) { 
        if (err) { 
            console.error("[getStandardDistance] " + err.message); 
            return; 
        } 
        handleStandardDistance(res.responseText, {me:"getStandardDistance", id:id, weight:weight, std:std}); 
    }); 
    xhr.send(); 
} 
 
function handleStandardDistance(response, info) { 
    var data = TerraFly.GeoJSON.parse(response), 
        dataset = {}, 
        style = {}; 
 
    dataset.id = info.id + "sd"; 
    dataset.info = [info.id, info.me, info.weight, info.std];
    dataset.type = "GeoData"; 
    dataset.name = dataSetsList[info.id].name + " standard distance"; 
    dataset.data = new GeoData(map0, dataset.name, dataset.id, data.keys, data.records, dataset.info); 
    userDatasets[dataset.id] = dataset; 
 
    updateDataPanel(); 
 
    style.fillAlpha = 50; 
    style.lineColor = "#ffff00"; 
    style.lineWidth = 1; 
    style.lineAlpha = 50; 
    style.fillColor = "#aaccff"; 
    dataset.data._style = style; 
    dataset.data.styles('fillAlpha', style.fillAlpha) 
                .styles('lineColor', style.lineColor) 
                .styles('lineWidth', style.lineWidth) 
                .styles('lineAlpha', style.lineAlpha) 
                .styles('fillColor', style.fillColor) 
                .draw(); 
} 
 
function selectDistributionalTrends() { 
    var dialog = dijit.byId("chartDialog"), 
        content = dojo.byId("charts"), 
        button = document.createElement("button"), 
        datasetSelect = createDataSetSelect(), 
        weightSelect = document.createElement("select"), 
        stdSelect = document.createElement("select"), 
        datasetLabel = document.createElement("label"), 
        weightLabel = document.createElement("label"), 
        stdLabel = document.createElement("label"), 
        description = document.createElement("div"); 
 
    description.className = "description"; 
 
    content.innerHTML = ""; 
    button.className = "btn"; 
 
    button.onclick = function () { 
        dialog.hide(); 
        getDistributionalTrends(datasetSelect.value, weightSelect.value, stdSelect.value); 
 
    } 
 
 
    stdSelect.add(new Option("1.0")); 
    stdSelect.add(new Option("2.0")); 
    stdSelect.add(new Option("3.0")); 
 
    datasetSelect.onchange = function () { 
        var keys = dataSetsList[this.value].data.keys; 
        weightSelect.innerHTML = ""; 
 
        weightSelect.add(new Option("none")); 
        for (var i = 0; i < keys.length; i++) { 
            weightSelect.add(new Option(keys[i])); 
        } 
    }; 
 
    datasetLabel.appendChild(document.createTextNode("Dataset:")); 
    weightLabel.appendChild(document.createTextNode("weight:")); 
    stdLabel.appendChild(document.createTextNode("standard:")); 
    button.appendChild(document.createTextNode("OK")); 
    description.appendChild(document.createTextNode(toolDescriptions.distributionalTrend)); 
 
    content.appendChild(description); 
    content.appendChild(datasetLabel); 
    content.appendChild(datasetSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(weightLabel); 
    content.appendChild(weightSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(stdLabel); 
    content.appendChild(stdSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(button); 
 
    dialog.show(); 
}; 
 
function getDistributionalTrends(id, weight, std) { 
    weight = weight || "none"; 
    var url = diseaseUri + "geodistribution/trends/" + id + "/1/" + weight + "/" + std + "/"; 
 
    var xhr = makeCORSRequest(url, "GET", function (err, res) { 
        if (err) { 
            console.error("[getDistributionalTrends] " + err.message); 
            return; 
        } 
        handleDistributionalTrends(res.responseText, {me:"getDistributionalTrends", id:id, weight:weight, std:std}); 
    }); 
    xhr.send(); 
} 
 
function handleDistributionalTrends(response, info) { 
    var data = TerraFly.GeoJSON.parse(response), 
        dataset = {}, 
        style = {}; 
 
    dataset.id = info.id + "dt"; 
    dataset.info = [info.id, info.me, info.weight, info.std];
    dataset.type = "GeoData"; 
    dataset.name = dataSetsList[info.id].name + " trend"; 
    dataset.data = new GeoData(map0, dataset.name, dataset.id, data.keys, data.records, dataset.info); 
    userDatasets[dataset.id] = dataset; 
 
    updateDataPanel(); 
 
    style.fillAlpha = 50; 
    style.lineColor = "#ffff00"; 
    style.lineWidth = 1; 
    style.lineAlpha = 50; 
    style.fillColor = "#aaccff"; 
    dataset.data._style = style; 
    dataset.data.styles('fillAlpha', style.fillAlpha) 
                .styles('lineColor', style.lineColor) 
                .styles('lineWidth', style.lineWidth) 
                .styles('lineAlpha', style.lineAlpha) 
                .styles('fillColor', style.fillColor) 
                .draw(); 
} 
 
function selectSpatialCluster() { 
    var dialog = dijit.byId("chartDialog"), 
        content = dojo.byId("charts"), 
        button = document.createElement("button"), 
        datasetSelect = createDataSetSelect(), 
        popSelect = document.createElement("select"), 
        caseSelect = document.createElement("select"), 
        datasetLabel = document.createElement("label"), 
        popLabel = document.createElement("label"), 
        caseLabel = document.createElement("label"), 
        description = document.createElement("div"); 
 
    description.className = "description"; 
    content.innerHTML = ""; 
    button.className = "btn"; 
 
    button.onclick = function () { 
        dialog.hide(); 
        getSpatialCluster(datasetSelect.value, popSelect.value, caseSelect.value); 
 
    } 
 
    datasetSelect.onchange = function () { 
        var keys = dataSetsList[this.value].data.keys; 
        popSelect.innerHTML = ""; 
        caseSelect.innerHTML = ""; 
 
        for (var i = 0; i < keys.length; i++) { 
            popSelect.add(new Option(keys[i])); 
            caseSelect.add(new Option(keys[i])); 
        } 
    }; 
 
    datasetLabel.appendChild(document.createTextNode("Dataset:")); 
    popLabel.appendChild(document.createTextNode("population:")); 
    caseLabel.appendChild(document.createTextNode("case:")); 
    button.appendChild(document.createTextNode("OK")); 
    description.appendChild(document.createTextNode(toolDescriptions.spatialCluster)); 
 
    content.appendChild(description); 
    content.appendChild(datasetLabel); 
    content.appendChild(datasetSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(popLabel); 
    content.appendChild(popSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(caseLabel); 
    content.appendChild(caseSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(button); 
 
    dialog.show(); 
} 
 
//add by peng liu20140624 to inform user  
require(["dijit/Dialog", "dojo/domReady!"], function (Dialog) { 
    myDialog = new Dialog({ 
        title: "Warning Dialog", 
        content: "Please input the number of clusters.", 
        style: "width: 300px" 
    }); 
}); 
 
//selectClusteringTool is added by Peng 20140618  
function selectClusteringTool() { 
 
    //to create elements for this dialog 
    var dialog = dijit.byId("chartDialog"), 
        content = dojo.byId("charts"), 
        okButton = document.createElement("button"), 
        goButton = document.createElement("button"), 
        datasetSelect = document.createElement("select"), 
        datasetLabel = document.createElement("label"), 
        clusmethSelect = document.createElement("select"), 
        clusmethLabel = document.createElement("label"), 
        numclusInput = document.createElement("input"), 
        numclusLabel = document.createElement("label"), 
        descDiv = document.createElement("div"), 
        resultDiv = document.createElement("div"); 
 
 
 
    okButton.id = "okButton"; 
    goButton.id = "goButton"; 
    datasetSelect.id = "datasetSelect"; 
    datasetLabel.id = "datasetLabel"; 
    clusmethSelect.id = "clusmethSelect"; 
    clusmethLabel.id = "clusmethLabel"; 
    numclusInput.id = "numclusInput"; 
    //only input numbers 
    numclusInput.onkeydown = function () {//add by peng liu 20140624 used to restrict only can input numbers 
 
        if (!(event.keyCode == 46) && !(event.keyCode == 8) && !(event.keyCode == 37) && !(event.keyCode == 39)) 
            if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105))) 
                event.returnValue = false; 
    }; 
 
    numclusLabel.id = "numclusLabel"; 
    descDiv.id = "descDiv"; 
    resultDiv.id = "resultDiv"; 
 
 
    descDiv.className = "description"; 
    resultDiv.className = "description"; 
 
    resultDiv.style.display = "none"; 
 
 
    content.innerHTML = ""; 
    okButton.className = "btn"; 
    okButton.style.display = "inline"; 
    goButton.className = "btn"; 
    goButton.style.display = "none"; 
 
    okButton.onclick = function () { 
 
        //check if clustermethod is kmeans, the number of clusters is required 
        if (clusmethSelect.value == "kmeans") { 
            if (numclusInput.value.length < 1) { 
                myDialog.show(); 
                return; 
            } 
        } 
        //sent the request data to the server and get the result from server 
        getClusteringTool(datasetSelect.value, clusmethSelect.value, numclusInput.value); 
 
    }; 
 
    clusmethSelect.onchange = function () { 
 
        //only when cluster-method is k-means, the numclusInput is available  
        if (this.value == "kmeans") { 
            numclusInput.disabled = false; 
        } 
        else { 
            numclusInput.disabled = true; 
        } 
    }; 
 
 
    datasetLabel.appendChild(document.createTextNode("Dataset:")); 
    clusmethLabel.appendChild(document.createTextNode("Cluster Method:")); 
    numclusLabel.appendChild(document.createTextNode("Number of Clusters:")); 
    okButton.appendChild(document.createTextNode("OK")); 
    goButton.appendChild(document.createTextNode("GO")); 
    descDiv.appendChild(document.createTextNode(toolDescriptions.clusteringTool)); 
 
    //to add data items into the dataset dropdownlist 
    ClusterToolGetDataSets(); 
 
    //to add data items into the ClusterMethod dropdownlist 
    ClusterToolGetClusterMethod(clusmethSelect); 
 
    //add all elements in this dialog 
    content.appendChild(descDiv); 
    content.appendChild(resultDiv); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(datasetLabel); 
    content.appendChild(datasetSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(clusmethLabel); 
    content.appendChild(clusmethSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(numclusLabel); 
    content.appendChild(numclusInput); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(okButton); 
    content.appendChild(goButton); 
 
 
    dialog.show(); 
} 
 
 
function getSpatialCluster(id, population, disease) { 
    var url = diseaseUri + "cluster/Cluster/" + id + "/1/" + population + "/" + disease + "/"; 
 
    var xhr = makeCORSRequest(url, "GET", function (err, res) { 
        if (err) { 
            console.error("[getSpatialCluster] " + err.message); 
            return; 
        } 
        handleSpatialCluster(res.responseText, {me:"getSpatialCluster", id:id, population:population, disease:disease}); 
    }); 
    xhr.send(); 
} 
 
// getClusteringTool added by Peng on 20140619 for Clustering Method Task  
//this function is to request one page to get the result url 
function getClusteringTool(datasetSelectId, clustermethod, numclusters) { 
 
    var url = "http://terranode-239/geocloud/newofflinejob.aspx?method=" + clustermethod + "&datasetid=" + datasetSelectId + "&noclusters=" + numclusters; 
    var xhr = makeCORSRequest(url, "GET", function (err, res) { 
        if (err) { 
            console.error("[getClusteringTool] " + err.message); 
            return; 
        } 
        handleClusteringTool(res.responseText); 
    }); 
    xhr.send(); 
} 
 
 
 
function handleSpatialCluster(response, info) { 
    var data = TerraFly.GeoJSON.parse(response), 
        dataset = {}, 
        style = {}; 
 
    dataset.id = info.id + "sc"; 
    dataset.info = [info.id, info.me, info.population, info.disease]; 
    dataset.type = "GeoData"; 
    dataset.name = dataSetsList[info.id].name + " spatial cluster"; 
    dataset.data = new GeoData(map0, dataset.name, dataset.id, data.keys, data.records, dataset.info); 
    userDatasets[dataset.id] = dataset; 
 
    updateDataPanel(); 
 
    style.markerName = "cluster"; 
    style.color = {}; 
    style.color.type = "Single"; 
    style.color.value = "#ff0000"; 
    dataset.data._style = style; 
 
    dataset.data.styles('markerName', function () { 
        return style.markerName; 
    }) 
                .styles('color', style.color.value) 
                .draw(function () { 
                    this.addEvent("click", true, function () { 
                        this._feature.ShowInfoWindow("width=100;height=50", "p value", this.pvalue); 
                    }); 
                }); 
} 
 
//added by Peng on 20140619 for Clustering Method Task   
//used to hide and show different controls after click the ok button 
function handleClusteringTool(responseText) { 
 
    var xmlError, xmlURL; 
     
    if (responseText.indexOf("error") > -1) { 
 
        xmlError = responseText.substring(7, responseText.indexOf("<", 7)); 
        alert(xmlError); 
        return; 
    } 
 
    if (responseText.indexOf("url") > -1) { 
 
        xmlURL = responseText.substring(5, responseText.indexOf("<", 5)); 
 
    } 
 
    //open one new page to access the result 
   // window.top.open(xmlURL); 
 
    /* the following code is to show another dialog page and then to click go button to access the result page.But I think it is convenient for users to view result page directly. */ 
 
    //hide okButton,datasetSelect,datasetLabel,clusmethSelect,clusmethLabel,numclusSelect,numclusLabel/ 
    okButton.style.display = "none"; 
 
    datasetSelect.style.display = "none"; 
    datasetLabel.style.display = "none"; 
 
    clusmethSelect.style.display = "none"; 
    clusmethLabel.style.display = "none"; 
 
    numclusInput.style.display = "none"; 
    numclusLabel.style.display = "none"; 
 
    descDiv.style.display = "none"; 
 
    //reset descDiv and result value    
    resultDiv.appendChild(document.createTextNode(toolDescriptions.clusteringResultUrlDes)); 
    //resultDiv.appendChild(document.createTextNode(xmlURL)); 
 
    //display goButton, resultDiv,descDiv  
    goButton.style.display = "inline"; 
    resultDiv.style.display = ""; 
 
    resultDiv.appendChild(document.createTextNode(xmlURL)); 
 
    //add one click event to the gobutton, to open the result page 
    goButton.onclick = function () { 
        //open one new page to access the result 
        window.top.open(xmlURL); 
    }; 
    
} 
 
 
/** added by Peng Liu on 20140619 for clustering tool add data items into dropdownlist control: cluster method 
    to initialize the cluster method dropdownlist control 
    this function should be confirmed how to get the methods either database or just hardcode 
**/ 
function ClusterToolGetClusterMethod(objclusmethSelect) { 
 
    var cmId = "kmeans"; 
    var cmName = "kmeans"; 
    objclusmethSelect.add(new Option(cmName, cmId)); 
    cmId = "dbscan"; 
    cmName = "dbscan"; 
    objclusmethSelect.add(new Option(cmName, cmId)); 
 
} 
 
/** added by Peng Liu on 20140619 for clustering tool    
 * ClusterToolGetDataSets is a function that makes an AJAX request to the backend 
 * and passes the xml document to add data items into the dataset dropdownlist. 
 */ 
function ClusterToolGetDataSets() { 
    var xhr = makeCORSRequest(serverIp + "/GeoCloud/datasetlist.aspx", "GET", function (err, result) { 
        var msg; 
        if (err) { 
            msg = "[getDataSets] " + err; 
            setMessage(msg); 
            console.error(msg); 
            return; 
        } 
 
        handleClusteringToolDataSets(result.responseXML); 
    }); 
 
    xhr.send(); 
} 
/**added by Peng Liu on 20140619 for clustering tool  add data items into the dataset dropdownlist control 
 * handleDataSets creates the dataset list used to display in GeoCloud 
 * @param {Document} xmldoc - An XML document with datasets 
 */ 
function handleClusteringToolDataSets(xmldoc) { 
    var xmlDataSets, 
        dataSets = [], 
        dataset, 
        i, 
        description = ""; 
 
    if (xmldoc === null) { 
        setMessage("Bad XML response from server"); 
        console.error("handleClusteringToolDataSets(): xmldoc was null. Not proper XML, bad response."); 
        return; 
    } 
 
    xmlDataSets = xmldoc.documentElement.getElementsByTagName("DataSet"); 
    if (xmlDataSets == null) { 
        return; 
    } 
 
    // get the datasets from the xml and put them in the dataset dropdownlist 
    for (i = 0; i < xmlDataSets.length; i++) { 
 
        var ctdatasetId = xmlDataSets[i].getElementsByTagName("Id")[0].childNodes[0].nodeValue; 
        var ctdatasetName = xmlDataSets[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue; 
        //add the data item to dataset dropdownlist 
        datasetSelect.add(new Option(ctdatasetName, ctdatasetId)); 
    } 
 
} 
 
 
function selectHotSpot() { 
    var dialog = dijit.byId("chartDialog"), 
        content = dojo.byId("charts"), 
        button = document.createElement("button"), 
        datasetSelect = createDataSetSelect(), 
        valueSelect = document.createElement("select"), 
        datasetLabel = document.createElement("label"), 
        valueLabel = document.createElement("label"), 
        description = document.createElement("div"); 
 
    description.className = "description"; 
    content.innerHTML = ""; 
    button.className = "btn"; 
 
    button.onclick = function () { 
        dialog.hide(); 
        getHotSpot(datasetSelect.value, valueSelect.value); 
 
    } 
 
    datasetSelect.onchange = function () { 
        var keys = dataSetsList[this.value].data.keys; 
        valueSelect.innerHTML = ""; 
 
        for (var i = 0; i < keys.length; i++) { 
            valueSelect.add(new Option(keys[i])); 
        } 
    }; 
 
 
    datasetLabel.appendChild(document.createTextNode("Dataset:")); 
    valueLabel.appendChild(document.createTextNode("value:")); 
    button.appendChild(document.createTextNode("OK")); 
    description.appendChild(document.createTextNode(toolDescriptions.hotSpot)); 
 
    content.appendChild(description); 
    content.appendChild(datasetLabel); 
    content.appendChild(datasetSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(valueLabel); 
    content.appendChild(valueSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(button); 
 
    dialog.show(); 
}; 
 
function getHotSpot(id, param) { 
    var url = diseaseUri + "cluster/hotspot/" + id + "/1/" + param + "/"; 
 
    var xhr = makeCORSRequest(url, "GET", function (err, res) { 
        if (err) { 
            console.error("[getHotSpot] " + err.message); 
            return; 
        } 
        handleHotSpot(res.responseText, {me:"getHotSpot", id:id, param:param}); 
    }); 
    xhr.send(); 
} 
 
function givalZvalColor(value) { 
    var color; 
    if (value > 2.58) { 
        color = "#ce3236"; 
    } else if (value > 1.96) { 
        color = "#f86963"; 
    } else if (value > 1.65) { 
        color = "#fecc99"; 
    } else if (value > -1.65) { 
        color = "#fffdc6"; 
    } else if (value > -1.96) { 
        color = "#c2c1bc"; 
    } else if (value > -2.58) { 
        color = "#9b98cd"; 
    } else { 
        color = "#3661d4"; 
    } 
    return color; 
} 
 
function pvalColor(pval, zval) { 
    var color; 
    if (zval < 0) { 
 
        if (pval > 0.10) { 
            color = "#fffdc6"; 
        } else if (pval > 0.05) { 
            color = "#c2c1bc"; 
        } else if (pval > 0.01) { 
            color = "#9b98cd"; 
        } else { 
            color = "#3661d4"; 
        } 
    } else { 
        if (pval > 0.10) { 
            color = "#ffffc6"; 
        } else if (pval > 0.05) { 
            color = "#fecc99"; 
        } else if (pval > 0.01) { 
            color = "#f86963"; 
        } else { 
            color = "#ce3236"; 
        } 
    } 
    return color; 
} 
 
function handleHotSpot(response, info) { 
    var gdata = TerraFly.GeoJSON.parse(response), 
        pdata = TerraFly.GeoJSON.parse(response), 
        gdataset = {}, 
        pdataset = {}, 
        name = dataSetsList[info.id].name.substring(0, 10) + "...", 
        legend = document.createDocumentFragment(); 
 
    gdataset.id = info.id + "hsg"; 
    gdataset.info = [info.id, info.me, info.param];
    gdataset.type = "GeoData"; 
    gdataset.name = name + "gival hotspot"; 
    gdataset.data = new GeoData(map0, gdataset.name, gdataset.id, gdata.keys, gdata.records, gdataset.info); 
    userDatasets[gdataset.id] = gdataset; 
 
    pdataset.id = info.id + "hsp"; 
    pdataset.info = [info.id, info.me, info.param];
    pdataset.type = "GeoData"; 
    pdataset.name = name + "pval hotspot"; 
    pdataset.data = new GeoData(map0, pdataset.name, pdataset.id, pdata.keys, pdata.records, pdataset.info); 
    userDatasets[pdataset.id] = pdataset; 
 
    updateDataPanel(); 
 
    gdataset.data.styles('fillAlpha', 100) 
                .styles('lineColor', "#000000") 
                .styles('lineWidth', 1) 
                .styles('lineAlpha', 50) 
                .styles('fillColor', function (d) { 
                    return givalZvalColor(d.gival); 
                }) 
                .draw(function () { 
                    this.addEvent("click", true, showHotSpotInfoWindow); 
                }); 
 
    pdataset.data.styles('fillAlpha', 100) 
                .styles('lineColor', "#000000") 
                .styles('lineWidth', 1) 
                .styles('lineAlpha', 50) 
                .styles('fillColor', function (d) { 
                    return pvalColor(d.pval, d.gival); 
                }) 
                .draw(function () { 
                    this.addEvent("click", true, showHotSpotInfoWindow); 
                }); 
 
    var givalLegend = createLegend("gival", legends.gizval), 
        pvalLegend = createLegend("p-value", legends.pval, "~"); 
    legend.appendChild(givalLegend); 
    legend.appendChild(pvalLegend); 
    createFloatingPane("hotspotl" + gdata.id, "Hotspot legend", legend, true, { width: 150, height: 400 }, gdataset.id) 
} 
 
function showHotSpotInfoWindow() { 
    var lat = this.geometry.coordinates[0][0][1], 
        lon = this.geometry.coordinates[0][0][0], 
        image = ""; 
 
    if (lat instanceof Array) { 
        lat = lon[1]; 
        lon = lon[0]; 
    } 
    image += "gival: " + this.gival.toFixed(6) + "<br>" 
            + "pval: " + this.pval.toFixed(6); 
 
    map0.ShowInfoWindow(lat, lon, "width=200;height=100", this.id, image); 
} 
 
function selectClusterOutlier() { 
    var dialog = dijit.byId("chartDialog"), 
        content = dojo.byId("charts"), 
        button = document.createElement("button"), 
        datasetSelect = createDataSetSelect(), 
        valueSelect = document.createElement("select"), 
        datasetLabel = document.createElement("label"), 
        valueLabel = document.createElement("label"), 
        description = document.createElement("div"); 
 
    description.className = "description"; 
    content.innerHTML = ""; 
    button.className = "btn"; 
 
    button.onclick = function () { 
        dialog.hide(); 
        getClusterOutlier(datasetSelect.value, valueSelect.value); 
 
    } 
 
    datasetSelect.onchange = function () { 
        var keys = dataSetsList[this.value].data.keys; 
        valueSelect.innerHTML = ""; 
 
        for (var i = 0; i < keys.length; i++) { 
            valueSelect.add(new Option(keys[i])); 
        } 
    }; 
 
    datasetLabel.appendChild(document.createTextNode("Dataset:")); 
    valueLabel.appendChild(document.createTextNode("value:")); 
    button.appendChild(document.createTextNode("OK")); 
    description.appendChild(document.createTextNode(toolDescriptions.clusterOutlier)); 
 
    content.appendChild(description); 
    content.appendChild(datasetLabel); 
    content.appendChild(datasetSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(valueLabel); 
    content.appendChild(valueSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(button); 
 
    dialog.show(); 
}; 
 
function getClusterOutlier(id, param) { 
    var url = diseaseUri + "cluster/ClusterandOuter/" + id + "/1/" + param + "/"; 
 
    var xhr = makeCORSRequest(url, "GET", function (err, res) { 
        if (err) { 
            console.error("[getClusterOutlier] " + err.message); 
            return; 
        } 
        handleClusterOutlier(res.responseText, {me:"getClusterOutLier", id:id, param:param}); 
    }); 
    xhr.send(); 
} 
 
function handleClusterOutlier(response, info) { 
    var ldata = TerraFly.GeoJSON.parse(response), 
        zdata = TerraFly.GeoJSON.parse(response), 
        pdata = TerraFly.GeoJSON.parse(response), 
        ldataset = {}, 
        zdataset = {}, 
        pdataset = {}, 
        name = dataSetsList[info.id].name.substring(0, 10) + "...", 
        legend = document.createDocumentFragment(); 
 
    ldataset.id = info.id + "mcl"; 
    ldataset.info = [info.id , info.me, info.param];
    ldataset.type = "GeoData"; 
    ldataset.name = name + " localMoranI"; 
    ldataset.data = new GeoData(map0, ldataset.name, ldataset.id, ldata.keys, ldata.records, ldataset.info); 
    userDatasets[ldataset.id] = ldataset; 
 
    zdataset.id = info.id + "mcz"; 
    zdataset.info = [info.id , info.me, info.param];
    zdataset.type = "GeoData"; 
    zdataset.name = name + " zval"; 
    zdataset.data = new GeoData(map0, zdataset.name, zdataset.id, zdata.keys, zdata.records, zdataset.info); 
    userDatasets[zdataset.id] = zdataset; 
 
    pdataset.id = info.id + "mcp"; 
    pdataset.info = [info.id , info.me, info.param];
    pdataset.type = "GeoData"; 
    pdataset.name = name + " pval C&O"; 
    pdataset.data = new GeoData(map0, pdataset.name, pdataset.id, pdata.keys, pdata.records, pdataset.info); 
    userDatasets[pdataset.id] = pdataset; 
 
    updateDataPanel(); 
    var localMoranIColor = calcRange(ldata.records, "localMoranI", "4", "BuGn"); 
    ldataset.data.styles('fillAlpha', 100) 
                .styles('lineColor', "#000000") 
                .styles('lineWidth', 1) 
                .styles('lineAlpha', 50) 
                .styles('fillColor', function (d) { 
                    return localMoranIColor(d); 
                }) 
                .draw(function () { 
                    this.addEvent("click", true, showClusterOutlierInfoWindow); 
                }); 
 
    zdataset.data.styles('fillAlpha', 100) 
                .styles('lineColor', "#000000") 
                .styles('lineWidth', 1) 
                .styles('lineAlpha', 50) 
                .styles('fillColor', function (d) { 
                    return givalZvalColor(d.zval); 
                }) 
                .draw(function () { 
                    this.addEvent("click", true, showClusterOutlierInfoWindow); 
                }); 
 
    pdataset.data.styles('fillAlpha', 100) 
                .styles('lineColor', "#000000") 
                .styles('lineWidth', 1) 
                .styles('lineAlpha', 50) 
                .styles('fillColor', function (d) { 
                    return pvalColor(d.pval, d.zval); 
                }) 
                .draw(function () { 
                    this.addEvent("click", true, showClusterOutlierInfoWindow); 
                }); 
 
    var moranLegend = createLegend("Local Moran I", localMoranIColor.legend()), 
        zvalLegend = createLegend("Zval", legends.gizval), 
        pvalLegend = createLegend("p-value", legends.pval, "~"); 
    legend.appendChild(moranLegend); 
    legend.appendChild(zvalLegend); 
    legend.appendChild(pvalLegend); 
    createFloatingPane("clout" + ldata.id, "Cluster & Outlier legend", legend, true, { width: 150, height: 450 }, ldataset.id) 
} 
 
function showClusterOutlierInfoWindow() { 
    var lat = this.geometry.coordinates[0][0][1], 
        lon = this.geometry.coordinates[0][0][0], 
        image = ""; 
 
    if (lat instanceof Array) { 
        lat = lon[1]; 
        lon = lon[0]; 
    } 
    image += "z-value: " + this.zval.toFixed(6) + "<br>" 
            + "p-value: " + this.pval.toFixed(6) + "<br>" 
            + "localMoranI: " + this.localMoranI.toFixed(6); 
 
    map0.ShowInfoWindow(lat, lon, "width=200;height=100", this.id, image); 
} 
 
function calcRange(records, attribute, classes, colorScale, reverse) { 
 
    var attributeValues = [], 
		sortedValues = [], 
		colorValues = {}, 
		range = colorbrewer[colorScale][classes]; 
 
    for (var i = 0; i < records.length; i++) { 
        if (attributeValues.indexOf(records[i][attribute])) { 
            attributeValues.push(records[i][attribute]); 
        } 
    } 
    if (reverse) { 
        sortedValues = attributeValues.sort(function (a, b) { 
            return b - a 
        }); 
    } else { 
        sortedValues = attributeValues.sort(function (a, b) { 
            return a - b 
        }); 
    } 
    length = attributeValues.length / classes; 
 
    for (var i = 0; i < sortedValues.length; i++) { 
        colorValues[sortedValues[i]] = range[Math.floor(i / length)]; 
    } 
 
    var colorGenerator = function (record) { 
        return colorValues[record[attribute]]; 
 
    }; 
 
    colorGenerator.legend = function () { 
        var image = []; 
 
        for (var i = 0; i < classes; i++) { 
            image[i] = [range[i], sortedValues[Math.floor(i * length)], sortedValues[Math.floor(((i + 1) * length) - 1)]]; 
        } 
        return image; 
    } 
 
    return colorGenerator; 
} 
 
function createLegend(caption, keys, symbol) { 
    var tableNode = document.createElement("table"), 
        captionNode = document.createElement("caption"), 
        tbodyNode = document.createElement("tbody"); 
    rowNode = document.createElement("tr"), 
    colorNode = document.createElement("td"), 
    valueNode = document.createElement("td"), 
    symbol = symbol || "-"; 
 
    tableNode.className = "legend"; 
    colorNode.className = "legendColor"; 
    valueNode.className = "legendValue"; 
 
    for (var i = 0; i < keys.length; i++) { 
        var row = rowNode.cloneNode(), 
            color = colorNode.cloneNode(), 
            value = valueNode.cloneNode(), 
            left = keys[i][1], 
            right = keys[i][2], 
            image = ""; 
 
        if (left === Number.NEGATIVE_INFINITY) { 
            image = "<" + right.toFixed(2); 
        } else if (right === Number.POSITIVE_INFINITY) { 
            image = ">" + left.toFixed(2); 
        } else { 
            image = left.toFixed(2) + " " + symbol + " " + right.toFixed(2); 
        } 
 
        color.style.backgroundColor = keys[i][0]; 
        value.appendChild(document.createTextNode(image)); 
        row.appendChild(color); 
        row.appendChild(value); 
        tbodyNode.appendChild(row); 
    } 
 
    captionNode.appendChild(document.createTextNode(caption)); 
    tableNode.appendChild(captionNode); 
    tableNode.appendChild(tbodyNode); 
 
    return tableNode; 
} 
 
function selectDiseaseMap() { 
    var dialog = dijit.byId("chartDialog"), 
        content = dojo.byId("charts"), 
        button = document.createElement("button"), 
        datasetSelect = createDataSetSelect(), 
        popSelect = document.createElement("select"), 
        caseSelect = document.createElement("select"), 
        siteSelect = document.createElement("select"), 
        groupsSelect = document.createElement("select"), 
        datasetLabel = document.createElement("label"), 
        popLabel = document.createElement("label"), 
        caseLabel = document.createElement("label"), 
        siteLabel = document.createElement("label"), 
        groupsLabel = document.createElement("label"), 
        description = document.createElement("div"); 
 
    description.className = "description"; 
    content.innerHTML = ""; 
    button.className = "btn"; 
 
    button.onclick = function () { 
        dialog.hide(); 
        getDiseaseMap(datasetSelect.value, popSelect.value, caseSelect.value, siteSelect.value, groupsSelect.value); 
 
    } 
 
    groupsSelect.add(new Option("6")); 
    groupsSelect.add(new Option("8")); 
    groupsSelect.add(new Option("10")); 
 
    datasetSelect.onchange = function () { 
        var keys = dataSetsList[this.value].data.keys; 
        popSelect.innerHTML = ""; 
        caseSelect.innerHTML = ""; 
        siteSelect.innerHTML = ""; 
 
        siteSelect.add(new Option("none")); 
 
        for (var i = 0; i < keys.length; i++) { 
            popSelect.add(new Option(keys[i])); 
            caseSelect.add(new Option(keys[i])); 
            siteSelect.add(new Option(keys[i])); 
        } 
    }; 
 
    datasetLabel.appendChild(document.createTextNode("Dataset:")); 
    popLabel.appendChild(document.createTextNode("population:")); 
    caseLabel.appendChild(document.createTextNode("case:")); 
    siteLabel.appendChild(document.createTextNode("site name:")); 
    groupsLabel.appendChild(document.createTextNode("legend groups:")); 
    button.appendChild(document.createTextNode("OK")); 
    description.appendChild(document.createTextNode(toolDescriptions.diseaseMap)); 
 
    content.appendChild(description); 
    content.appendChild(datasetLabel); 
    content.appendChild(datasetSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(popLabel); 
    content.appendChild(popSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(caseLabel); 
    content.appendChild(caseSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(siteLabel); 
    content.appendChild(siteSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(groupsLabel); 
    content.appendChild(groupsSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(button); 
 
    dialog.show(); 
}; 
 
function getDiseaseMap(id, population, cases, site, groups) { 
    var url = diseaseUri + "map/diseasemap/" + id + "/1/" + population + "/" + cases + "/" + site + "/"; 
 
    var xhr = makeCORSRequest(url, "GET", function (err, res) { 
        if (err) { 
            console.error("[getDiseaseMap] " + err.message); 
            return; 
        } 
        handleDiseaseMap(res.responseText, {me:"getDiseaseMap", id:id, population:population, cases:cases, site:site, groups:groups}); 
    }); 
    xhr.send(); 
} 
 
function handleDiseaseMap(response, info) { 
    var data = TerraFly.GeoJSON.parse(response), 
        dataset = {}, 
        name = dataSetsList[info.id].name.substring(0, 10) + "...", 
        legend = document.createDocumentFragment(); 
 
    dataset.id = info.id + "hsg" + info.groups; 
    dataset.info = [info.id, info.me, info.population, info.cases, info.site, info.groups]; 
    dataset.type = "GeoData"; 
    dataset.name = name + "disease map" + info.groups; 
    dataset.data = new GeoData(map0, dataset.name, dataset.id, data.keys, data.records, dataset.info); 
    userDatasets[dataset.id] = dataset; 
 
    updateDataPanel(); 
    var color = calcRange(data.records, "rate", info.groups, "RdYlGn", true); 
    dataset.data.styles('fillAlpha', 100) 
                .styles('lineColor', "#000000") 
                .styles('lineWidth', 1) 
                .styles('lineAlpha', 50) 
                .styles('fillColor', function (d) { 
                    return color(d); 
                }) 
                .draw(function () { 
                    this.addEvent("click", true, function () { 
                        var data = [{ 
                            percent: this.percent, 
                            name: "Rate" 
                        }, 
                            { 
                                percent: this.largestpercent, 
                                name: "Largest rate" 
                            }]; 
 
                        drawPieChart(data, this.nm, "percent", "name"); 
                    }); 
                }); 
 
    var colorLegend = createLegend("rate", color.legend()); 
    legend.appendChild(colorLegend); 
    createFloatingPane("dml" + data.id + info.groups, "Disease Map legend", legend, true, { width: 150, height: 400 }, dataset.id); 
} 
 
function selectSMRMap() { 
    var dialog = dijit.byId("chartDialog"), 
        content = dojo.byId("charts"), 
        button = document.createElement("button"), 
        datasetSelect = createDataSetSelect(), 
        popSelect = document.createElement("select"), 
        caseSelect = document.createElement("select"), 
        siteSelect = document.createElement("select"), 
        groupsSelect = document.createElement("select"), 
        datasetLabel = document.createElement("label"), 
        popLabel = document.createElement("label"), 
        caseLabel = document.createElement("label"), 
        siteLabel = document.createElement("label"), 
        groupsLabel = document.createElement("label"), 
        description = document.createElement("div"); 
 
    description.className = "description"; 
    content.innerHTML = ""; 
    button.className = "btn"; 
 
    button.onclick = function () { 
        dialog.hide(); 
        getSMRMap(datasetSelect.value, popSelect.value, caseSelect.value, siteSelect.value, parseInt(groupsSelect.value)); 
 
    } 
    groupsSelect.add(new Option("6")); 
    groupsSelect.add(new Option("8")); 
    groupsSelect.add(new Option("10")); 
 
    datasetSelect.onchange = function () { 
        var keys = dataSetsList[this.value].data.keys; 
        popSelect.innerHTML = ""; 
        caseSelect.innerHTML = ""; 
        siteSelect.innerHTML = ""; 
 
        siteSelect.add(new Option("none")); 
 
        for (var i = 0; i < keys.length; i++) { 
            popSelect.add(new Option(keys[i])); 
            caseSelect.add(new Option(keys[i])); 
            siteSelect.add(new Option(keys[i])); 
        } 
    }; 
 
    datasetLabel.appendChild(document.createTextNode("Dataset:")); 
    popLabel.appendChild(document.createTextNode("population:")); 
    caseLabel.appendChild(document.createTextNode("case:")); 
    siteLabel.appendChild(document.createTextNode("site name:")); 
    groupsLabel.appendChild(document.createTextNode("legend groups:")); 
    button.appendChild(document.createTextNode("OK")); 
    description.appendChild(document.createTextNode(toolDescriptions.SMRMap)); 
 
    content.appendChild(description); 
    content.appendChild(datasetLabel); 
    content.appendChild(datasetSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(popLabel); 
    content.appendChild(popSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(caseLabel); 
    content.appendChild(caseSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(siteLabel); 
    content.appendChild(siteSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(groupsLabel); 
    content.appendChild(groupsSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(button); 
 
    dialog.show(); 
}; 
 
function getSMRMap(id, population, cases, site, groups) { 
    var url = diseaseUri + "map/smrmap/" + id + "/1/" + population + "/" + cases + "/" + site + "/"; 
 
    var xhr = makeCORSRequest(url, "GET", function (err, res) { 
        if (err) { 
            console.error("[getSMRMap] " + err.message); 
            return; 
        } 
        handleSMRMap(res.responseText, {me:"getSMRMap", id:id, population:population, cases:cases, site:site, groups:groups}); 
    }); 
    xhr.send(); 
} 
 
function handleSMRMap(response, info) { 
    var data = TerraFly.GeoJSON.parse(response), 
        dataset = {}, 
        name = dataSetsList[info.id].name.substring(0, 10) + "...", 
        legend = document.createDocumentFragment(); 
 
    dataset.id = info.id + "hsg"; 
    dataset.info = [info.id, info.me, info.population, info.cases, info.site, info.groups];
    dataset.type = "GeoData"; 
    dataset.name = name + "SMR map"; 
    dataset.data = new GeoData(map0, dataset.name, dataset.id, data.keys, data.records, dataset.info); 
    userDatasets[dataset.id] = dataset; 
 
    updateDataPanel(); 
    var color = calcRange(data.records, "SMR", info.groups, "RdBu", true); 
    dataset.data.styles('fillAlpha', 100) 
                .styles('lineColor', "#000000") 
                .styles('lineWidth', 1) 
                .styles('lineAlpha', 50) 
                .styles('fillColor', function (d) { 
                    return color(d); 
                }) 
                .draw(); 
 
    var colorLegend = createLegend("SMR", color.legend()); 
    legend.appendChild(colorLegend); 
    createFloatingPane("smrmapl" + data.id, "SMR map legend", legend, true, { width: 150, height: 400 }, dataset.id); 
} 
 
function selectLinearRegression() { 
    var dialog = dijit.byId("chartDialog"), 
        content = dojo.byId("charts"), 
        button = document.createElement("button"), 
        datasetSelect = createDataSetSelect(), 
        dependentSelect = document.createElement("select"), 
        explanatorySelect = [], 
        explanatoryAdd = document.createElement("button"); 
    datasetLabel = document.createElement("label"), 
    dependentLabel = document.createElement("label"), 
    explanatoryLabel = document.createElement("label"), 
    description = document.createElement("div"); 
 
    description.className = "description"; 
    content.innerHTML = ""; 
    button.className = "btn"; 
    explanatoryAdd.className = "btn"; 
    explanatorySelect.push(document.createElement("select")); 
 
    button.onclick = function () { 
        dialog.hide(); 
        var x = [] 
        for (var i = 0; i < explanatorySelect.length; i++) { 
            x[i] = explanatorySelect[i].value; 
        } 
        getLinearRegression(datasetSelect.value, dependentSelect.value, x); 
 
    } 
 
    explanatoryAdd.onclick = function () { 
        var newFragment = document.createDocumentFragment(), 
            newExplanatorySelect = explanatorySelect[0].cloneNode(true), 
            newExplanatoryLabel = explanatoryLabel.cloneNode(true); 
 
        explanatorySelect.push(newExplanatorySelect); 
        newFragment.appendChild(document.createElement("br")); 
        newFragment.appendChild(newExplanatoryLabel); 
        newFragment.appendChild(newExplanatorySelect); 
 
 
        content.insertBefore(newFragment, explanatoryAdd); 
    } 
 
    datasetSelect.onchange = function () { 
        var keys = dataSetsList[this.value].data.keys; 
        dependentSelect.innerHTML = ""; 
        for (var j = 0; j < explanatorySelect.length; j++) { 
            explanatorySelect[j].innerHTML = ""; 
        } 
 
        for (var i = 0; i < keys.length; i++) { 
            dependentSelect.add(new Option(keys[i])); 
            for (var j = 0; j < explanatorySelect.length; j++) { 
                explanatorySelect[j].add(new Option(keys[i])); 
            } 
        } 
    }; 
 
    datasetLabel.appendChild(document.createTextNode("Dataset:")); 
    dependentLabel.appendChild(document.createTextNode("y:")); 
    explanatoryLabel.appendChild(document.createTextNode("x:")); 
    button.appendChild(document.createTextNode("OK")); 
    explanatoryAdd.appendChild(document.createTextNode("+")); 
    description.appendChild(document.createTextNode(toolDescriptions.linearRegression)); 
 
    content.appendChild(description); 
    content.appendChild(datasetLabel); 
    content.appendChild(datasetSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(dependentLabel); 
    content.appendChild(dependentSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(explanatoryLabel); 
    content.appendChild(explanatorySelect[0]); 
    content.appendChild(explanatoryAdd); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(button); 
 
    dialog.show(); 
}; 
 
function getLinearRegression(id, y, x) { 
    var url = diseaseUri + "regression/linear/" + id + "/1/" + y + "/" + x.join('&') + "/"; 
 
    var xhr = makeCORSRequest(url, "GET", function (err, res) { 
        if (err) { 
            console.error("[getLinearRegression] " + err.message); 
            return; 
        } 
        handleLinearRegression(res.responseText, {me:"getLinearRegression", id:id, y:y, x:x}); 
    }); 
    xhr.send(); 
} 
 
function handleLinearRegression(response, info) { 
    var result = JSON.parse(response).rst, 
        image = document.createDocumentFragment(), 
        pnode = document.createElement("pre"),
        dataset = {};
 
    dataset.id = info.id + "lr"; 
    dataset.info = [info.id, info.me, info.y, info.x];
    dataset.type = "paneData"; 
    dataset.name = dataSetsList[info.id].name + " linear regression"; 
    userDatasets[dataset.id] = dataset;

    pnode.appendChild(document.createTextNode(result)); 
    image.appendChild(pnode); 
    createFloatingPane("linreg" + data.id, "Linear Regression", image, true, { width: 500, height: 300 }, dataset.id); 
    
    updateDataPanel();

    document.location.replace("#" + createUriParams());
} 
 
function selectAutoRegressionLag() { 
    var dialog = dijit.byId("chartDialog"), 
    content = dojo.byId("charts"), 
    button = document.createElement("button"), 
    datasetSelect = createDataSetSelect(), 
    dependentSelect = document.createElement("select"), 
    explanatorySelect = [], 
    explanatoryAdd = document.createElement("button"); 
    datasetLabel = document.createElement("label"), 
    dependentLabel = document.createElement("label"), 
    explanatoryLabel = document.createElement("label"), 
    description = document.createElement("div"); 
 
    description.className = "description"; 
    content.innerHTML = ""; 
    button.className = "btn"; 
    explanatoryAdd.className = "btn"; 
    explanatorySelect.push(document.createElement("select")); 
 
    button.onclick = function () { 
        dialog.hide(); 
        var x = [] 
        for (var i = 0; i < explanatorySelect.length; i++) { 
            x[i] = explanatorySelect[i].value; 
        } 
        getAutoRegressionLag(datasetSelect.value, dependentSelect.value, x); 
 
    } 
 
    explanatoryAdd.onclick = function () { 
        var newFragment = document.createDocumentFragment(), 
            newExplanatorySelect = explanatorySelect[0].cloneNode(true), 
            newExplanatoryLabel = explanatoryLabel.cloneNode(true); 
 
        explanatorySelect.push(newExplanatorySelect); 
        newFragment.appendChild(document.createElement("br")); 
        newFragment.appendChild(newExplanatoryLabel); 
        newFragment.appendChild(newExplanatorySelect); 
 
 
        content.insertBefore(newFragment, explanatoryAdd); 
    } 
 
    datasetSelect.onchange = function () { 
        var keys = dataSetsList[this.value].data.keys; 
        dependentSelect.innerHTML = ""; 
        for (var j = 0; j < explanatorySelect.length; j++) { 
            explanatorySelect[j].innerHTML = ""; 
        } 
 
        for (var i = 0; i < keys.length; i++) { 
            dependentSelect.add(new Option(keys[i])); 
            for (var j = 0; j < explanatorySelect.length; j++) { 
                explanatorySelect[j].add(new Option(keys[i])); 
            } 
        } 
    }; 
 
    datasetLabel.appendChild(document.createTextNode("Dataset:")); 
    dependentLabel.appendChild(document.createTextNode("y:")); 
    explanatoryLabel.appendChild(document.createTextNode("x:")); 
    button.appendChild(document.createTextNode("OK")); 
    explanatoryAdd.appendChild(document.createTextNode("+")); 
    description.appendChild(document.createTextNode(toolDescriptions.spatialAutoRegressionLag)); 
 
    content.appendChild(description); 
    content.appendChild(datasetLabel); 
    content.appendChild(datasetSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(dependentLabel); 
    content.appendChild(dependentSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(explanatoryLabel); 
    content.appendChild(explanatorySelect[0]); 
    content.appendChild(explanatoryAdd); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(button); 
 
    dialog.show(); 
}; 
 
function getAutoRegressionLag(id, y, x) { 
    var url = diseaseUri + "regression/spatialauto/" + id + "/1/" + y + "/" + x.join('&') + "/"; 
 
    var xhr = makeCORSRequest(url, "GET", function (err, res) { 
        if (err) { 
            console.error("[getAutoRegressionLag] " + err.message); 
            return; 
        } 
        handleAutoRegressionLag(res.responseText, {me:"getAutoRegressionLag", id:id, y:y, x:x}); 
    }); 
    xhr.send(); 
} 
 
function handleAutoRegressionLag(response, info) { 
    var result = JSON.parse(response).rst, 
        image = document.createDocumentFragment(), 
        pnode = document.createElement("pre"),
        dataset = {}; 
 
    dataset.id = info.id + "sal"; 
    dataset.info = [info.id, info.me, info.y, info.x];
    dataset.type = "paneData"; 
    dataset.name = dataSetsList[info.id].name + " spatial auto-regression lag"; 
    userDatasets[dataset.id] = dataset;

    pnode.appendChild(document.createTextNode(result)); 
    image.appendChild(pnode); 
    createFloatingPane("spatialauto" + data.id, "Spatial auto-regression lag", image, true, { width: 500, height: 300 }, dataset.id); 

    updateDataPanel();

    document.location.replace("#" + createUriParams());
} 
 
function selectAutoRegressionError() { 
    var dialog = dijit.byId("chartDialog"), 
    content = dojo.byId("charts"), 
    button = document.createElement("button"), 
    datasetSelect = createDataSetSelect(), 
    dependentSelect = document.createElement("select"), 
    explanatorySelect = [], 
    explanatoryAdd = document.createElement("button"); 
    datasetLabel = document.createElement("label"), 
    dependentLabel = document.createElement("label"), 
    explanatoryLabel = document.createElement("label"), 
    description = document.createElement("div"); 
 
    description.className = "description"; 
    content.innerHTML = ""; 
    button.className = "btn"; 
    explanatoryAdd.className = "btn"; 
    explanatorySelect.push(document.createElement("select")); 
 
    button.onclick = function () { 
        dialog.hide(); 
        var x = [] 
        for (var i = 0; i < explanatorySelect.length; i++) { 
            x[i] = explanatorySelect[i].value; 
        } 
        getAutoRegressionError(datasetSelect.value, dependentSelect.value, x); 
 
    } 
 
    explanatoryAdd.onclick = function () { 
        var newFragment = document.createDocumentFragment(), 
            newExplanatorySelect = explanatorySelect[0].cloneNode(true), 
            newExplanatoryLabel = explanatoryLabel.cloneNode(true); 
 
        explanatorySelect.push(newExplanatorySelect); 
        newFragment.appendChild(document.createElement("br")); 
        newFragment.appendChild(newExplanatoryLabel); 
        newFragment.appendChild(newExplanatorySelect); 
 
 
        content.insertBefore(newFragment, explanatoryAdd); 
    } 
 
    datasetSelect.onchange = function () { 
        var keys = dataSetsList[this.value].data.keys; 
        dependentSelect.innerHTML = ""; 
        for (var j = 0; j < explanatorySelect.length; j++) { 
            explanatorySelect[j].innerHTML = ""; 
        } 
 
        for (var i = 0; i < keys.length; i++) { 
            dependentSelect.add(new Option(keys[i])); 
            for (var j = 0; j < explanatorySelect.length; j++) { 
                explanatorySelect[j].add(new Option(keys[i])); 
            } 
        } 
    }; 
 
    datasetLabel.appendChild(document.createTextNode("Dataset:")); 
    dependentLabel.appendChild(document.createTextNode("y:")); 
    explanatoryLabel.appendChild(document.createTextNode("x:")); 
    button.appendChild(document.createTextNode("OK")); 
    explanatoryAdd.appendChild(document.createTextNode("+")); 
    description.appendChild(document.createTextNode(toolDescriptions.spatialAutoRegressionError)); 
 
    content.appendChild(description); 
    content.appendChild(datasetLabel); 
    content.appendChild(datasetSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(dependentLabel); 
    content.appendChild(dependentSelect); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(explanatoryLabel); 
    content.appendChild(explanatorySelect[0]); 
    content.appendChild(explanatoryAdd); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(button); 
 
    dialog.show(); 
}; 
 
function getAutoRegressionError(id, y, x) { 
    var url = diseaseUri + "regression/errorauto/" + id + "/1/" + y + "/" + x.join('&') + "/"; 
 
    var xhr = makeCORSRequest(url, "GET", function (err, res) { 
        if (err) { 
            console.error("[getAutoRegressionError] " + err.message); 
            return; 
        } 
        handleAutoRegressionError(res.responseText, {me:"getAutoRegressionError", id:id, y:y, x:x}); 
    }); 
    xhr.send(); 
} 
 
function handleAutoRegressionError(response, info) { 
    var result = JSON.parse(response).rst, 
        image = document.createDocumentFragment(), 
        pnode = document.createElement("pre"),
        dataset = {}; 
 
    dataset.id = info.id + "saem"; 
    dataset.info = [info.id, info.me, info.y, info.x];
    dataset.type = "paneData"; 
    dataset.name = dataSetsList[info.id].name + " spatial auto-regression error model"; 
    userDatasets[dataset.id] = dataset;

    pnode.appendChild(document.createTextNode(result)); 
    image.appendChild(pnode); 
    createFloatingPane("autoerror" + data.id, "Spatial auto-regression error model", image, true, { width: 500, height: 300 }, dataset.id);

    updateDataPanel();

    document.location.replace("#" + createUriParams());
}
