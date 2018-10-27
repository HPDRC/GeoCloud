/** 
 * GeoData Object constructor which repersented a dataset on the map 
 * @constructor 
 * @param {TMap} map - TerraFly map 
 * @param {string} name - name of the dataset 
 * @param {string} id - id of dataset 
 * @param {string[]} keys - the column names of the dataset 
 * @param {object[]} records - the values of the dataset 
 */ 
function GeoData(map, name, id, keys, records, info) { 
    this.map = map;
    this.name = name; 
    this.id = id; 
    this.keys = keys; 
    this.records = records; 
    this.info = info? info:null;
    this.drawn = false; 
    if (settings[id]) this._style = settings[id].style; // TODO: look at removing this 
    // object to store functions used for styles 
    this.stylefn = {}; 
 
    //idSet is used for when adding records to make sure no duplicates 
    this.idSet = {};  
    for (var i = 0; i < records.length; i++) { 
        this.idSet[records[i].id] = records[i]; 
    } 
} 
 
/** 
 * addColumn adds a new column to the records 
 * @param {string} name - name of the column 
 * @param {Array.<*>} values - the new values for the column 
 * @throws an error if the name is used already 
 */ 
GeoData.prototype.addColumn = function (name, values) { 
    if (this.keys.indexOf(name) >= 0) { 
        throw new Error("Name is already used"); 
    } 
 
    this.keys.push(name); 
    // TODO change to use a function when passed values 
    for (var i = 0; i < this.records.length; i++) { 
        this.records[i][name] = values[i]; 
    } 
}; 
 
 
/** 
 * addRecords adds new records to the current dataset 
 * used for when new data is loaded when the map has been moved 
 * @param {object[]} records - the new records to be added 
 * @param {object} [style] - optional parameter if the style has changed 
 */ 
GeoData.prototype.addRecords = function (records, style) { 
    for (var i = 0; i < records.length; i++) { 
        var record = records[i]; 
        if (this.idSet[record.id] == undefined) { 
            this.idSet[record.id] = record; 
            this.records.push(record); 
        } 
    } 
 
    if (style) this._style = style; 
    //call to draw the rest and also attach events 
 
    this.draw(); 
}; 
 
/** 
 * setStyle allows you to set a new style for the GeoData 
 * @param {object} style - style object with either function which return a value or literal values 
 */ 
GeoData.prototype.setStyle = function (style) { 
    for (var prop in style) { 
        if (!(prop === "fn")) { 
            if (style.fn && style.fn[prop]) { 
                this.styles(prop, style.fn[prop]); 
            } else if (style[prop].value) { 
                this.styles(prop, style[prop].value); 
            } else { 
                this.styles(prop, style[prop]); 
            } 
        } 
    } 
}; 
 
/** 
 * styles is a method which is called by the draw method to  
 * get the style for a certain property of feature 
 * @param {string} type - a string of the property you want to style 
 * for example fill color of a polygon is 'fillColor' 
 * @param {stylefn} fn - can be a function which is called and passed the record  
 * to determine the style for that type or it can just be a value. 
 * @returns the GeoData object for chaining 
 */ 
GeoData.prototype.styles = function (type, fn) { 
    if (typeof fn !== "function") { 
        var value = fn; 
        fn = function () { 
            return value; 
        }; 
    } 
    this.stylefn[type] = fn; 
 
    return this; 
}; 
 
/** 
 * addEvent adds an event to the dataset and corrects the current 
 * TerraFly event listener API allowing the features to share the  
 * function 
 * @param {string} type - event type, currently only click 
 * @param {boolean} isRecords - true means the event should be applied to records 
 * @param {function} fn - the function to be called when the event happens 
 *      the fn's "this" will refer to the record that was clicked 
 */ 
GeoData.prototype.addEvent = function (type, isRecords, fn) { 
    if (!this.drawn) return; //dataset has not been drawn 
 
    if (!this.handlers) this.handlers = {}; //adds a handlers object 
 
    if (!this.handlers[type]) this.handlers[type] = []; //adds a handlers array for that type 
 
    this.handlers[type].push(fn); //pushes the function into the array 
 
    // called only once  
    if (this.handlers[type].length == 1) { 
        if (isRecords) { 
            for (var i = 0; i < this.records.length; i++) { 
 
                var dispatcher = (function (record, type) { 
                    var that = this; 
                    var handlers = this.handlers[type]; 
                    return function () { 
                        for (var n = 0; n < handlers.length; n++) { 
                            handlers[n].call(record, type); 
                        } 
                    }; 
                }).call(this, this.records[i], type); 
 
                if (type === "click") { 
                    this.records[i]._feature.SetOnClickListener(dispatcher); 
                } 
                if (type === "mouseover") { 
                    this.records[i]._feature.SetOnRolloverListener(dispatcher); 
                } 
                if (!this.records[i]._event) this.records[i]._event = {}; 
                this.records[i]._event[type] = dispatcher; 
            } 
        }  
    } 
}; 
 
/** 
 * Removes events from the GeoData object 
 * @param {string} [type] - optional type of handler if not used, remove all events 
 * @param {function} [handler] - optional function handler used for the event, if not used all events of type are removed 
 */ 
GeoData.prototype.removeEvent = function (type, handler) { 
 
    if (!type) { 
        this.handlers = undefined; 
    } else if (handler) { 
        for (var i = 0; i < this.handlers[type].length; i++) { 
            if (this.handlers[type][i] === handler) { 
                this.handlers[type].splice(i, 1); 
                return true; 
            } 
        } 
    }else { 
        this.handlers[type] = undefined; 
    } 
}; 
 
/** 
 * emitEvent allows GeoData to call functions that were added for events, allowing for  
 * custom events to be called. 
 * @param {string} eventType - a string of the event name 
 * @param {string} [recordId] - an optional integer parameter which calls a specific record's event function 
 */ 
GeoData.prototype.emitEvent = function (eventType, recordId) { 
    if (!this.handlers || !this.handlers[eventType]) { 
        return; 
    } 
 
    if (!isNaN(recordId)) { 
        this.idSet[recordId]._event[eventType](); 
    } else { 
        for (var i = 0; i < this.handlers[eventType].length; i++) { 
            this.handlers[eventType].call(this); 
        } 
    } 
}; 
 
/** 
 * Draws the GeoData on the map 
 * @param {function} fn - a function to be called after done drawing 
 */ 
GeoData.prototype.draw = function (fn) { 
    var self = this, 
        length = self.records.length, 
        index = 0; 
 
    if (!this.layer) { 
        //this.layer = this.map.AddLayer(this.name, this.id, true, false, "0xbbbbbb"); 
        this.layer = this.map.AddFeatureLayer({name:this.name});
    } 
 
    var process = function drawTimeout() { 
        var record = self.records[index], 
            spatial = record.geometry, 
            feature = record._feature; 
 
        if (!feature) { 
            var type = spatial.type; 
 
            feature = GeoDrawFactory[spatial.type](self.layer, spatial.coordinates, record, self.stylefn); 
 
            record._feature = feature; 
        } 
        index++; 
        if (index < length) { 
            setTimeout(process, 0); 
        } else { 
            self.drawn = true; 
            if (fn) fn.call(self); 
            self.emitEvent("drawing.done"); 
        } 
        document.location.replace("#" + createUriParams());
    }; 
    process(); 
}; 
 
 
/** 
 * Remove the layer as well as clean up anything else 
 */ 
GeoData.prototype.undraw = function () { 
    if (!this.drawn) return; 
 
    this.map.RemoveLayer(this.layer); 
    this.layer = undefined; 
    for (var i = 0; i < this.records.length; i++) { 
        this.records[i]._feature = undefined; 
    } 
 
    if (settings[this.id]) { 
        delete settings[this.id]; 
    } 
    // delete events 
    this.removeEvent(); 
}; 
 
/** 
 * Method which converts a GeoData object into GeoJSON 
 * it does not store any styling information 
 * @param {boolean} [noId=false] - to add the id of the feature to the GeoJSON, true for noId 
 * @returns a string which repersents the GeoData as GeoJSON 
 */ 
GeoData.prototype.toGeoJSON = function (noId) { 
    var geoJSON = { 
        type: "FeatureCollection", 
        features: [] 
    }; 
 
    for (var i = 0; i < this.records.length; i++) { 
        var feature = {}; 
         
        feature.type = "Feature"; 
        feature.geometry = this.records[i].geometry; 
 
        if (!noId) { 
            feature.id = this.records[i].id; 
        } 
 
        var props = {}; 
        for (var index in this.keys) { 
            var key = this.keys[index]; 
            if (key !== "id") { 
                props[key] = this.records[i][key]; 
            } 
        } 
 
        feature.properties = props; 
 
        geoJSON.features[i] = feature; 
    } 
 
    return JSON.stringify(geoJSON); 
}; 
 
/** 
 * getParams is a function that returns a string which describe the style 
 * and id of a dataset. Used for GeoCloud's url 
 * @returns a string with the parameters 
 * example: 3:ms:id:ffff00 
 * id: 3, type: marker, color.type: single, markerName: id, color: #ffff00 
 */ 
GeoData.prototype.getParams = function() { 
    var image = []; 
 
    image[0] = this.id; 
 
    if(this.records[0].geometry.type === "Point") { 
        image[1] = "m"; 
        if(this._style.markerName)
            image[2] = this._style.markerName; 
 
        if (this._style.color.type === "Single") { 
            image[1] += "s"; 
            image[3] = this._style.color.value; 
        } else if (this._style.color.type === "Range") { 
            image[1] += "r"; 
            image[3] = this._style.color.attribute; 
            image[4] = this._style.color._color.join("-"); 
        } else { 
            image[1] += "i"; 
            image[3] = this._style.imgMarker; 
        } 
 
    } else { 
        // Polygon 
        image[1] = "p"; 
         
        image[2] = this._style.lineColor; 
        image[3] = this._style.lineWidth; 
        image[4] = this._style.lineAlpha; 
        image[5] = this._style.fillAlpha; 
 
        if (this._style.fillColor.type === "Single") { 
            image[1] += "s"; 
            image[6] = this._style.fillColor.value; 
        } else { 
            image[1] += "r"; 
            image[6] = this._style.fillColor.attribute; 
            image[7] = this._style.fillColor.classes; 
            image[8] = this._style.fillColor._color.join('-'); 
        } 
    } 
 
    return image.join(':').replace(/#/g, ""); 
}
