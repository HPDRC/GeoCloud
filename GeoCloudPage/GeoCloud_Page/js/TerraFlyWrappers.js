/**
 * TerraFlyWrappers.js
 * Contains functions that wrap TerraFly's javascript API into a more bearable format.
 */

/**
 * @typedef coordinate
 * @type {number[]}
 */

/**
 * @typedef polygon
 * @type {coordinate[]}
 */

(function () {
    /**
     * Helper function which converts a color to the required string form for the API
     * @param {string} color - color repersented as a string in the form "#ffffff"
     * @returns the fixed color string as '0xFFFFFF'
     */
    function createColorString(color) {
        return '0x' + color.slice(1).toUpperCase();
    }

    /**
     * Helper function used to create the style string used by the API
     * @param {object} style - marker style object
     * @returns the string repersentation of the style
     */
    function createMarkerStyle(style) {
        var image = [];

        if (style.color) {
            image.push("MARKER_COLOR=" + createColorString(style.color));
        }

        if (style.fontColor) {
            image.push("FONT_COLOR=" + createColorString(style.fontColor));
        }

        if (style.font) {
            image.push("FONT=" + style.font);
        }

        if (style.size) {
            image.push("MARKER_SIZE=" + style.size);
        }

        return image.join(';');
    }

    /**
     * Helper function for addImgMarker, converts a style object into a string used by the
     * TerraFly API
     * @param {object} style - Image Marker style object
     * @returns the string representation
     */
    function createImgStyle(style) {
        var image = [];

        if (style.xOffset) {
            image.push("X_OFFSET=" + style.xOffset);
        }

        if (style.yOffset) {
            image.push("Y_OFFSET=" + style.yOffset);
        }

        if (style.borderAlpha) {
            image.push("BORDER_ALPHA=" + style.borderAlpha);
        }

        return image.join(';');
    }


    /**
     * helper function to create a string used in AddPolygon
     * input [ [[-80.41277, 25.77846], [-80.41278, 25.77779], [-80.412, 25.7778]] ]
     * returns "(25.77846,-80.41277;25.77779,-80.41278;25.7778,-80.412)"
     * Note: input is in lon, lat form, api is lat, lon
     * @param {polygon[]} coordinates - an array of polygons
     * @returns the string repersentation
     */
    function createPointString(coordinates) {
        var strPolygon = [], //create a polygonString
            polyCoordinates,
            polygon,
            strPoints,
            i;
        for (polygon = 0; polygon < coordinates.length; polygon++) {
            polyCoordinates = coordinates[polygon];
            strPoints = [];
            for (i = 0; i < polyCoordinates.length; i++) {
                //reverse coordinates as it is in long, lat form
                strPoints.push(polyCoordinates[i][1] + ',' + polyCoordinates[i][0]);
            }
            strPolygon.push("(" + strPoints.join(';') + ")");
        }
        return strPolygon.join(';');
    }


    /**
     * Helper function that converts a style object into a string repersentation
     * style: {'fillColor': '#FFFFFF', 'fillAlpha':50, ect... }
     * returns "FILL_COLOR=0xFFFFFF;FILL_ALPHA=50; ect..."
     * @param {object} style - polygon style object
     * @returns the string version
     */
    function createStyleString(style) {
        // { 'fillColor': "#ffffff", 'fillAlpha': 50, 'lineColor': "#ffff00", 'lineWidth': 1, 'lineAlpha': 100 }
        // "FILL_COLOR=0xAACCFF;FILL_ALPHA=50;LINE_COLOR=0xFFFF00;LINE_WIDTH=1;LINE_ALPHA=100"
        var image = [];

        if (style.fillColor) {
            image.push("FILL_COLOR=" + createColorString(style.fillColor));
        }

        if (style.fillAlpha) {
            image.push("FILL_ALPHA=" + style.fillAlpha);
        }

        if (style.lineColor) {
            image.push("LINE_COLOR=" + createColorString(style.lineColor));
        }

        if (style.lineWidth) {
            image.push("LINE_WIDTH=" + style.lineWidth);
        }

        if (style.lineAlpha) {
            image.push("LINE_ALPHA=" + style.lineAlpha);
        }

        return image.join(';');
    }

    /**
     * addMarker wrapper for the TerraFly API which allows adding custom markers easier
     * @param {string} markerName - A string to be displayed on the marker
     * @param {coordinate} coordinate - the lon and lat of the point [-80.34808, 25.753566] in [lon, lat] form
     * @param {object} [style] - optional style object  ex. {color: '#00CCFF', font: 'Times New Roman', fontColor: '#FFFFFF', size: 16}
     * @returns a TMarker object
     */
    TLayer.prototype.addMarker = function (markerName, coordinate, style) {
        //reverse coordinates as it is in long, lat form
        var marker = this.AddMarker(coordinate[1], coordinate[0], markerName);
        marker._style = {};
        //Check if a style object exists
        if (style) {
            marker.setStyle(style);
        }

        return marker;
    };

    /**
     * addImgMarker is a wrapper to TerraFly's AddImgMarker api call
     * @param {coordinate} coordinate - is an array with [lon, lat]
     * @param {string} imgUrl - is a string with the url for the image
     * @param {object} style - is a style obj { xOffset: Int, yOffset: Int, borderAlpha: Int}
     * @returns a TMarker object
     */
    TLayer.prototype.addImgMarker = function (coordinate, imgUrl, style) {
        var styleStr = createImgStyle(style);

        return this.AddImgMarker(coordinate[1], coordinate[0], imgUrl, styleStr);
    };

    /**
     * Wrapper function for the layer api call to AddPolygon
     * @param {polygon[]} coordinates -  an array of polygons which are arrays of points. Allows polygon holes
     * ex. [ [[-80.41277, 25.77846], [-80.41278, 25.77779], [-80.412, 25.7778]] ]
     * @param {object} style - a polygon stlye object {'fillColor': '#FFFFFF', 'fillAlpha':50, ect... }
     * @returns a TPolygon object
     */
    TLayer.prototype.addPolygon = function (coordinates, style) {
        var strPoints = createPointString(coordinates),
            strStyle = createStyleString(style),
            polygon;

        polygon = this.AddPolygon(strPoints, strStyle);
        polygon._style = style;
        return polygon;
    };

    /**
     * Creates a new function called style for TPolygons that accept an object as a parameter
     * @param {object} style - Polygon style object
     * ex { 'fillColor': "#ffffff", 'fillAlpha': 50, 'lineColor': "#ffff00", 'lineWidth': 1, 'lineAlpha': 100 }
     * @returns the TPolygon object for chaining
     */
    TPolygon.prototype.setStyle = function (style) {
        var prop,
            styleStr;

        for (prop in style) {
            this._style[prop] = style[prop];
        }

        styleStr = createStyleString(this._style);
        this.UpdateStyle(styleStr);
        return this;
    };

    /**
     * Adds a style function to TMarker class that accepts an object with style information
     * @param {object} style - Marker style object
     * {color: '#00CCFF', font: 'Times New Roman', fontColor: '#FFFFFF', size: 16}
     * @returns the TMarker object for chaining
     */
    TMarker.prototype.setStyle = function (style) {
        var prop,
            styleStr;

        for (prop in style) {
            this._style[prop] = style[prop];
        }
        styleStr = createMarkerStyle(this._style);
        this.SetMarkerStyle(styleStr);
        return this;
    };

    /**
     * Generalized getStyle for TPolygon and TMarkers
     * @returns the style object
     */
    function getStyle() {
        return this._style;
    }

    TPolygon.prototype.getStyle = getStyle;
    TMarker.prototype.getStyle = getStyle;

    /**
     * Constructfor for a MultiPolygon, to create one, please use the API, use addMultiPolygon from the layer
     * @constructor
     * @param {TLayer} layer - Layer for which the polygon is drawn on
     * @param {Array.<polygon>} coordinates - an array of Polygons and allows holes
     * @param {object} style - style object
     */
    function TMultiPolygon(layer, coordinates, style) {
        var i;

        this.polygons = [];
        this.count = 0;

        for (i = 0; i < coordinates.length; i++) {
            this.polygons[i] = layer.addPolygon(coordinates[i], style);
            this.count++;
        }
    }

    if (TerraFly) TerraFly.MultiPolygon = TMultiPolygon;

    /**
     * function to handle clicks
     * @param {function} fn - function to be called when the user is clicked
     */
    TMultiPolygon.prototype.SetOnClickListener = function (fn) {
        var i;
        for (i = 0; i < this.count; i++) {
            this.polygons[i].SetOnClickListener(fn);
        }
    };

    /**
     * Allows you to set a new style for a TMultiPolygon object
     * @param {object} style - a polygon style object
     * @returns a reference to the TMultiPolygon for function chaining
     */
    TMultiPolygon.prototype.setStyle = function (style) {
        var prop,
            i;
        for (prop in style) {
            this._style[prop] = style[prop];
        }
        for (i = 0; i < this.count; i++) {
            this.polygons[i].setStyle(style);
        }
        return this;
    };
    /**
     * A new spatial geometry for TerraFly Map API
     * Creates and manages multiple polygons to create a MultiPolygon type
     * @param {Array.<polygon>} coordinates - are an array of Polygons
     * ex.
     *  [ 
     *      [ [[-80.41277, 25.77846], [-80.41278, 25.77779], [-80.412, 25.7778]] ],
     *      [ [[-80.413, 25.77846], [-80.414, 25.77779], [-80.412, 25.7778]] ]
     *  ]
     * @param {object} style - a polygon style object { 'fillColor': "#ffffff", 'fillAlpha': 50, 'lineColor': "#ffff00", 'lineWidth': 1, 'lineAlpha': 100 }
     * @returns a new TMultiPolygon object
     */
    TLayer.prototype.addMultiPolygon = function (coordinates, style) {
        var multiPolygon =  new TMultiPolygon(this, coordinates, style);
        multiPolygon._style = style;
        return multiPolygon;
    };

    /**
     * Helper method to help create hash url parameters
     * @returns a string of the level and center coordinates in format "level:lat:lon"
     */
    TMap.prototype.getParams = function () {
        var center,
            level;

        center = this.GetCenter();
        level = this.GetLevel();

        return [level, center.Latitude, center.Longitude].join(':');
    }

})();