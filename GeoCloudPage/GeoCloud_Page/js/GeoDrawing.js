/* 
 * GeoDrawing.js 
 * contains functions that draw data on the map 
 */ 
 
var GeoDrawFactory = {}; // Factory which has the draw methods for each geometry type 
/* 
* drawPoint takes a layer, coordinates, record, and creates a marker on the layer 
* coordinate = [-80.34808, 25.753566] 
* record = { "non-spatial": data, ...} 
*/ 
GeoDrawFactory["Point"] = function drawPoint(layer, coordinate, record, style) { 
    var pointStyle = {}, 
        marker, 
        img, 
        color, 
        name; 
 
    if (style.imgMarker) { 
        img = style.imgMarker(); 
        marker = layer.addImgMarker(coordinate, img.url, img.parameters) 
    } else { 
        color = style['color'](record); 
 
        pointStyle = { 
                shape: true, 
                shape_points:5, 
                shape_radius1: 12, 
                shape_radius2: 6, 
                line: true, 
                line_opacity: 100, 
                line_width: 1, 
                line_color: "#000", 
                fill: true, 
                fill_opacity: 80, 
                fill_color: color
         } 
        pointStyle.font_color = contrastColor(color); //find the contrasting color for font 
        name = style.markerName(record); 
        var markerSetting = new tf.map.Feature({ 
            type: "Point", 
            coordinates: coordinate, 
            style:pointStyle
        }); 
        marker = layer.AddMapFeature(markerSetting);
    } 
    return marker; 
} 
 
 
 
/* 
* drawPoly takes a layer, coordinates, record, and and creates a polygon on the layer 
* coordinates = [[-80.41277, 25.77846], [-80.41278, 25.77779], [-80.412, 25.7778], [-80.41197, 25.77847], [-80.41277, 25.77846]] 
* record = { "non-spatial": data, ...} 
*/ 
GeoDrawFactory["Polygon"] = function drawPolygon(layer, coordinates, record, style) { 
    //FILL_COLOR=0xAACCFF;FILL_ALPHA=50;LINE_COLOR=0xFFFF00;LINE_WIDTH=1;LINE_ALPHA=100 
    var polyStyle = {}; 
 
    var polyStyle = new tf.map.Feature({ 
            type: "Polygon", 
            coordinates: coordinates, 
            style: { 
                line: true, 
                line_opacity: style.lineAlpha(record), 
                line_width: style.lineWidth(record), 
                line_color: style.lineColor(record), 
                fill: true, 
                fill_opacity: style.fillAlpha(record), 
                fill_color: style.fillColor(record) 
            } 
    });
 
    layer.AddMapFeature(polyStyle); 
    return layer; 
} 
 
/* 
* drawMultiPolygon takes a multipolygon and draws several polygons based on it 
* coordinates =  [ [[-80.41277, 25.77846], [-80.41278, 25.77779]], [[-80.412, 25.7778], [-80.41197, 25.77847], [-80.41277, 25.77846]] ] 
* 
*/ 
GeoDrawFactory["MultiPolygon"] = function drawMultiPolygon(layer, coordinates, record, style) { 
    var polyStyle = {}; 
 
     var polyStyle = new tf.map.Feature({ 
            type: "MultiPolygon", 
            coordinates: coordinates, 
            style: { 
                line: true, 
                line_opacity: style.lineAlpha(record), 
                line_width: style.lineWidth(record), 
                line_color: style.lineColor(record), 
                fill: true, 
                fill_opacity: style.fillAlpha(record), 
                fill_color: style.fillColor(record) 
            } 
    });
    
    layer.AddMapFeature(polyStyle);
    return layer;
} 
 
function setPointListener(id, index, feature) { 
    var record = dataSets[id].records[index], 
        keys = dataSets[id].keys, 
        content = [], 
        contentStr, 
        i; 
    for (i = 0; i < keys.length; i++)  { 
        content.push(keys[i] + ": " + record[keys[i]]); 
    } 
    contentStr = content.join('\n'); 
    feature.SetOnClickListener(function () { 
        feature.ShowInfoWindow("width=240;height=100", "label", contentStr); 
    }); 
} 
 
var imageMarkers = { 
    a: { url: "http://131.94.133.223/imgs/markerPoint25.png", 
        parameters: {  
            'xOffset': 12, 
            'yOffset': 25, 
            'borderAlpha': 0 
            } 
    }, 
 
    b: { url: "http://131.94.133.223/imgs/pinMarker.png", 
        parameters: { xOffset: 10, 
            yOffset: 25, 
            borderAlpha: 0 
        } 
    } 
} 
 
 
function drawScatterPlot(data, chartTitle, xProp, yProp) { 
 
    var chart, 
        pane, 
        id; 
 
    // random generated string 
    id = "scatterplot-" + (Math.random() + 1).toString(36).substring(7); 
    pane = createFloatingPane("pane-" + id, chartTitle, "<div id='" + id + "'></div>"); 
    
    chart = TerraFly.Chart.ScatterPlot() 
        .x(function (d) { return d[xProp]; }) 
        .y(function (d) { return d[yProp]; }) 
        .xLabel(xProp) 
        .yLabel(yProp); 
    
    d3.select("#" + id) 
        .datum(data) 
        .call(chart); 
} 
 
function drawPieChart(data, chartTitle, value, label) { 
    var chart, 
        pane, 
        id; 
    // random generated string 
    id = "piechart-" + (Math.random() + 1).toString(36).substring(7); 
    pane = createFloatingPane("pane-" + id, chartTitle, "<div id='" + id + "'></div>", true, { width: 600, height: 500 }); 
 
    chart = TerraFly.Chart.Pie() 
        .value(function (d) { return d[value]; }) 
        .label(function (d) { return d[label]; }) 
        .width(600) 
        .height(485) 
        .margin( {top: 60, right: 60, bottom: 60, left: 60} ); 
 
    d3.select("#" + id) 
        .datum(data) 
        .call(chart); 
} 
 
function drawAutoCorrelationGraph(dataSetId, chartTitle, axis, points, slope, datasetID) { 
    var func = drawAutoCorrelationGraph; 
    dijit.byId("chartDialog").hide(); 
    if (!func.charts) { 
        func.charts = 0; 
    } 
    var id = "chart" + func.charts; 
    var title = dataSetsList[dataSetId].name + " " + id; 
    var pane = createFloatingPane(id + "Pane", title, "<div id='" + id +"'> </div>", true, {}, datasetID); 
    var chart = new dojox.charting.Chart(id, { title: chartTitle, titlePos: "top" }); 
    chart.addPlot("default", { type: "Scatter" }); 
    if (slope) chart.addPlot("slope", { type: "Default", markers: false }); 
    chart.addPlot("zero", { type: "Default", markers: false }); 
    //chart.addPlot("Grid", { type: "Grid", hMajorLines: true, hMinorLines: false, vMajorLines: true, vMinorLines: false }); 
    chart.addAxis("x", { title: axis.x, titleOrientation: "away" }); 
    chart.addAxis("y", { vertical: true, title: axis.y }); 
    chart.addSeries("plot", points, { stroke: { color: "blue" } }); 
    var ends = findEnds(points); 
    if (slope) { 
        var xEnds = ends[0]; 
        var first = { x: xEnds[0], y: xEnds[0] * slope }; 
        var second = { x: xEnds[1], y: xEnds[1] * slope }; 
        chart.addSeries("slope", [first, { x: 0, y: 0 }, second], { plot: "slope", stroke: { width: 3 } }); 
    } 
    chart.addSeries("xAxis", [{ x: ends[0][0], y: 0 }, { x: ends[0][1], y: 0 }], { plot: "zero", stroke: { color: "#e0e0e0" }}); 
    chart.addSeries("yAxis", [{ x: 0, y: ends[1][0] }, { x: 0, y: ends[1][1] }], { plot: "zero", stroke: { color: "#e0e0e0" }}); 
    var mag = new dojox.charting.action2d.Magnify(chart, "default"); 
    chart.render(); 
    func.charts++; 
    func.previous = []; 
 
    chart.connectToPlot("default", function (evt) { 
        var shape = evt.shape, type = evt.type; 
        if (type === "onclick") { 
            console.log("onmouseclick was called"); 
            console.log("Index is: ", evt.index); 
            var pointClicked = points[evt.index]; 
            console.log("pointClick.id: " + pointClicked.id); 
            var idSet = dataSetsList[dataSetId].data.idSet; 
            var record = idSet[pointClicked.id]; 
 
            if (evt.event.ctrlKey !== true) { 
                while (func.previous.length > 0) { 
                    var prev = func.previous.pop(); 
                    var prevFeature = prev.feature; 
                    var prevShape = prev.shape; 
                    prevFeature.setStyle(prevFeature.originalStyle); 
                    prevShape.setStroke(prevShape.originalStroke); 
                } 
            } 
            if (!shape.originalStroke) { 
                shape.originalStroke = shape.getStroke(); 
            } 
            shape.setStroke({ color: "red" }); 
            var feature = record._feature; 
            if (!feature.originalStyle) { 
                var originalStyle = {}; 
                for (var prop in feature._style) { 
                    originalStyle[prop] = feature._style[prop]; 
                } 
                feature.originalStyle = originalStyle; 
            } 
 
            if (feature instanceof TPolygon) { 
                var count = 0; 
                var intervalID = setInterval(function () { 
                    if (count % 2 == 0) { 
                        feature.setStyle({ fillColor: "#46CC25", lineColor: "#000000" }); 
                    } else { 
                        feature.setStyle({ fillColor: feature.originalStyle.fillColor, lineColor: feature.originalStyle.lineColor }); 
                    } 
                    if (++count > 5) { 
                        window.clearInterval(intervalID); 
                        feature.setStyle({ fillColor: feature.originalStyle.fillColor, lineColor: "#46CC25", lineWidth: 4, lineAlpha: 100 }); 
                    } 
                }, 500); 
            } else { 
                feature.setStyle({ color: "#46CC25" }); 
            } 
            var current = { feature: feature, shape: shape }; 
            func.previous.push(current); 
        } 
    }); 
} 
 
function addFeatureSelect(data) { 
     
    data.addEvent("click", true, (function () { 
        var prevFeature; 
         
        return function() { 
            if (prevFeature) { 
                prevFeature.setStyle(prevFeature.originalStyle); 
            } 
 
            var feature = this._feature; 
 
            var originalStyle = {}; 
            for (var prop in feature._style) { 
                originalStyle[prop] = feature._style[prop]; 
            } 
            feature.originalStyle = originalStyle; 
 
            if (feature instanceof TPolygon || feature instanceof TerraFly.MultiPolygon) { 
                var count = 0; 
                var intervalID = setInterval(function () { 
                    if (count % 2 == 0) { 
                        feature.setStyle({ fillColor: "#46CC25", lineColor: "#000000" }); 
                    } else { 
                        feature.setStyle({ fillColor: feature.originalStyle.fillColor, lineColor: feature.originalStyle.lineColor }); 
                    } 
                    if (++count > 5) { 
                        window.clearInterval(intervalID); 
                        feature.setStyle({ fillColor: feature.originalStyle.fillColor, lineColor: "#46CC25", lineWidth: 4, lineAlpha: 100 }); 
                    } 
                }, 500); 
            } else { 
                feature.setStyle({ color: "#46CC25" }); 
            } 
            prevFeature = feature; 
        } 
    })()); 
 
 
} 
 
/* 
 *  givens an array of points, it finds the min and max x values 
 * Helper function used to help draw a line for auto correlation 
 */ 
function findEnds(points) { 
    var xMin = xMax = 0, 
        yMin = yMax = 0; 
    for (var i in points) { 
        if (xMin > points[i].x) { 
            xMin = points[i].x; 
        } 
        if (xMax < points[i].x) { 
            xMax = points[i].x; 
        } 
        if (yMin > points[i].y) { 
            yMin = points[i].y; 
        } 
        if (yMax < points[i].y) { 
            yMax = points[i].y; 
        } 
    } 
    return [[xMin, xMax], [yMin, yMax]]; 
} 
 
// Programmer: Larry Battle  
// Date: Mar 06, 2011 
// Purpose: Calculate standard deviation, variance, and average among an array of numbers. 
var isArray = function (obj) { 
    return Object.prototype.toString.call(obj) === "[object Array]"; 
}; 
getNumWithSetDec = function (num, numOfDec) { 
    var pow10s = Math.pow(10, numOfDec || 0); 
    return (numOfDec) ? Math.round(pow10s * num) / pow10s : num; 
}; 
getAverageFromNumArr = function (numArr, numOfDec) { 
    if (!isArray(numArr)) { return false; } 
    var i = numArr.length, 
		sum = 0; 
    while (i--) { 
        sum += numArr[i]; 
    } 
    return getNumWithSetDec((sum / numArr.length), numOfDec); 
}; 
getVariance = function (numArr, numOfDec) { 
    if (!isArray(numArr)) { return false; } 
    var avg = getAverageFromNumArr(numArr, numOfDec), 
		i = numArr.length, 
		v = 0; 
 
    while (i--) { 
        v += Math.pow((numArr[i] - avg), 2); 
    } 
    v /= numArr.length; 
    return getNumWithSetDec(v, numOfDec); 
}; 
getStandardDeviation = function (numArr, numOfDec) { 
    if (!isArray(numArr)) { return false; } 
    var stdDev = Math.sqrt(getVariance(numArr, numOfDec)); 
    return getNumWithSetDec(stdDev, numOfDec); 
}; 
 
function normalize(x) { 
    var u = getAverageFromNumArr(x,4); 
    var b = getStandardDeviation(x, 4); 
 
    var newX = []; 
    for (var i = 0; i < x.length; i++) { 
        newX[i] = (x[i] - u) / b; 
    } 
 
    return newX; 
}
