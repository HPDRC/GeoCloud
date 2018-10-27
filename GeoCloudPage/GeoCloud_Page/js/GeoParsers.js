/** 
 * GeoParsers.js 
 * contains functions used to parse strings into managable javascript objects 
 */ 
(function (TerraFly) { 
     
    var WKT = {}, 
        GeoJSON = {}, 
        XMLDataSet = {}; 
    // Check if TerraFly singleton exists, create one if it doesn't 
    if (!TerraFly) { 
        TerraFly = window.TerraFly = {}; 
    } 
 
    TerraFly.WKT = WKT; 
    TerraFly.GeoJSON = GeoJSON; 
    TerraFly.XMLDataSet = XMLDataSet; 
 
    // For <= IE8 which don't have a native trim method 
    if (!String.prototype.trim) { 
        String.prototype.trim = function () { return this.replace(/^\s+|\s+$/g, ''); }; 
    } 
 
    /** 
     * parsePoint converts a point string in the below format into an array 
     * string = "-80.41277 25.77846" 
     * returns [-80.41277, 25.77846] 
     * TODO maybe modify to parse an array of point strings? 
     * @param {string} string - a WKT point of lon and lat 
     * @returns an array with [lon, lat] 
     */ 
    function parsePoint(string) { 
        var result = [], 
            point = string.split(" "); 
        result[0] = parseFloat(point[0]); 
        result[1] = parseFloat(point[1]); 
        return result; 
    } 
 
    /** 
     * parsePolygon converts a polygon string in the below format into an array of points 
     * string = "(-80.41277 25.77846, -80.41278 25.77779, -80.412 25.7778, -80.41197 25.77847, -80.41277 25.77846)" 
     * or (1 2, 3 4, 5 6), (2 3, 4 5, ... )   polygon with a hole  
     * returns [ [[-80.41277, 25.77846], [-80.41278, 25.77779], [-80.412, 25.7778], [-80.41197, 25.77847], [-80.41277, 25.77846]] ] 
     * returns [ [[1, 2], [3, 4], [5, 6]], [[2, 3], [4, 5], ... ] ] 
     * @param {string} string - a WKT polygon string 
     * @returns an array of polygons with an array of points in [lon, lat] form  
     */ 
    function parsePolygon(string) { 
        var polygon = [], 
            lastPolygon, 
            parts = string.split('),'); //split if there is holes 
        for (var i = 0; i < parts.length - 1; i++) { //handle main polygon and holes 
            polygon.push(parsePoints(parts[i].trim().slice(1))); 
        } 
        lastPolygon = parts[parts.length - 1]; 
        polygon.push(parsePoints(lastPolygon.trim().slice(1, -1))); 
 
        return polygon; 
 
    } 
 
    /** 
     * Helper function for parsePolygon 
     * @param {string} string - an string with a sequence of points seperated by commas 
     * @returns an array of points 
     */ 
    function parsePoints(string) { 
        var parts = string.trim().split(', '), 
            points = []; 
        for (var i = 0; i < parts.length; i++) { 
            points.push(parsePoint(parts[i])); 
        } 
        return points; 
    } 
 
    /** 
     * parseMultiPolygon parses a WKT multipolygon string into an array of polygons 
     * string = "((-80.41277 25.77846, -80.41278 25.77779 )), (( -80.412 25.7778, -80.41197 25.77847, -80.41277 25.77846))" 
     * returns [ [[[-80.41277, 25.77846], [-80.41278, 25.77779]], [ [-80.412, 25.7778], [-80.41197, 25.77847], [-80.41277, 25.77846]]] ] 
     * @param {string} string - A WKT Multipolygon string 
     * @returns The array repersentation of the Multipolygon 
     */ 
    function parseMultiPolygon(string) { 
        var polygons = [], 
            polygonSplit = string.split('),'); 
        for (var i = 0; i < polygonSplit.length - 1; i++) { 
            polygons.push(parsePolygon(polygonSplit[i].trim().slice(1))); 
        } 
        polygons.push(parsePolygon(polygonSplit[polygonSplit.length - 1].trim().slice(1, -1))); 
 
        return polygons; 
    } 
 
    /** 
     * parseSpatial converts a spatial string into a format similar to GeoJSON 
     * string = "POINT (-80.34808 25.753566)",  
     * POLYGON ((-80.41277 25.77846, -80.41278 25.77779, -80.412 25.7778, -80.41197 25.77847, -80.41277 25.77846)) 
     * returns { "type": "Point", "coordinates": [-80.34808, 25.753566] } 
     * { "type": "Polygon", "coordinates": [[-80.41277, 25.77846], [-80.41278, 25.77779], [-80.412, 25.7778], [-80.41197, 25.77847], [-80.41277, 25.77846]]} 
     * @param {string} string - A WKT string  
     * @returns The GeoCloud representation of the spatial data 
     */ 
    WKT.parse = function parseSpatial(string) { 
        var spatial = {}, 
            //start and end of the spatial data types, removes the ( ) 
            start = string.indexOf('(') + 1, 
            end = string.lastIndexOf(')'); 
 
        // checks what spatial type and parses it correctly 
        if (/multipoint/i.test(string)) { 
            throw new Error("Multipoint not supported"); 
        } else if (/point/i.test(string)) { 
            // it is a point type 
            spatial.type = "Point"; 
 
            spatial.coordinates = parsePoint(string.slice(start, end)); 
 
        } else if (/multipolygon/i.test(string)) { 
            spatial.type = "MultiPolygon"; 
 
            spatial.coordinates = parseMultiPolygon(string.slice(start, end)); 
 
        } else if (/polygon/i.test(string)) { 
            // it is a polygon type 
            spatial.type = "Polygon"; 
 
            spatial.coordinates = parsePolygon(string.slice(start, end)); 
 
        } else if (/multilinestring/i.test(string)) { 
            throw new Error("MultiLineString not supported"); 
        } else if (/linestring/i.test(string)) { 
            throw new Error("LineString not supported"); 
        } else { 
            throw new Error("Unknown or unsupported WKT type"); 
        } 
 
        return spatial; 
    } 
 
    /** 
     * Parses GeoJSON feature collection into a GeoCloud format 
     * @param {string} geoJson - The GeoJSON to be parsed 
     * @returns a GeoCloud representation 
     */ 
    GeoJSON.parse = function parseGeoJSON(geoJson) { 
        var featureCol = JSON.parse(geoJson), 
            dataset = {}, 
            keys = [], 
            features = featureCol.features, 
            records; 
 
        dataset.records = []; 
 
        for (var i = 0; i < features.length; i++) { 
            record = {}; 
            record.id = features[i].id || i; 
            record.geometry = features[i].geometry; 
            for (var prop in features[i].properties) { 
                record[prop] = features[i].properties[prop]; 
            } 
            dataset.records.push(record); 
        } 
 
        for (var key in dataset.records[0]) { 
            if (key !== "geometry") { 
                keys.push(key); 
            } 
        } 
        dataset.keys = keys; 
 
        return dataset; 
    } 
 
    /** 
     * Parser for XMLDatasets returned by GeoCloud server 
     * @param {Document} xml - An XML document with the GeoData 
     * @returns a representation of the dataset for GeoCloud 
     */ 
    XMLDataSet.parse = function parseXMLDataSet(xml) { 
        var xmlDataSets = xml.documentElement.getElementsByTagName("Record"), 
            keys = [], //stores the keys to access the objects properties 
            records = [], //store each record 
            dataSetRecord, 
            record, 
            children, 
            nodeName, 
            node, 
            value, 
            spatialNode, 
            spatial, 
            key, 
            i, 
            j; 
 
        if (xmlDataSets == null) { 
            return null; 
        } 
 
        dataSetRecord = xmlDataSets[0]; 
 
        //no records found, perhaps there was no data found within the current map boundary. 
        if (dataSetRecord == null) { 
            return null; 
        } 
 
        //Get the names of the nodes and store as keys 
        for (i = 0; i < dataSetRecord.childNodes.length; i++) { 
            key = dataSetRecord.childNodes[i].nodeName.toLowerCase(); 
            // Spatial data not needed for the table (would be needed to draw on the map) 
            if (key !== "spatial") { 
                keys.push(key); 
            } 
        } 
        //Create a record object to store each record. 
        for (i = 0; i < xmlDataSets.length; i++) { 
            record = {}; //record object to hold key value pairs of data 
            children = xmlDataSets[i].childNodes; 
            for (j = 0; j < children.length; j++) { 
                nodeName = children[j].nodeName.toLowerCase(); 
                if (nodeName != "spatial") { //if it is not spatial data, just assign the value 
                    node = children[j].childNodes[0]; 
                    if (node) { 
                        value = node.textContent || node.nodeValue; 
                        record[nodeName] = isNaN(value) ? value : Number(value); 
                    } else { 
                        record[nodeName] = "N/A"; 
                    } 
                } else { //else it is spatial data and it needs to be parsed into a better format 
                    spatialNode = children[j]; 
                    // Firefox has a 4K character limit for nodeValue and IE doesn't support textContent 
                    spatial = spatialNode.textContent || spatialNode.childNodes[0].nodeValue; 
                    record.geometry = WKT.parse(spatial); 
                } 
            } 
            records.push(record); 
        } 
 
        return { keys: keys, records: records }; 
    } 
 
})(window.TerraFly); 
 
/** 
 * An expression parser used to generate new columns for Datasets based on data for each record 
 */ 
var DataSetExp = {}; 
(function () { 
    /** 
     * Token constructor 
     * @constructor 
     * @param {string} type - The token type like Number, Attribute, Operator, etc 
     * @param {string|number} value - The value of the token 
     * @param {number} index - The index of where the token begins in the expression 
     */ 
    function Token(type, value, index) { 
        this.type = type; 
        this.value = value; 
        this.index = index; 
    } 
 
    /** 
     * An expression tokenizer, converts a string into a sequence of tokens 
     * @param {string} expression - The expression to be tokenized 
     * @returns a sequence of tokens 
     */ 
    function tokenizer(expression) { 
        var tokens = [], 
			token = null, 
			index = 0, 
            // Number regular expression 
			num = /^\d+(.\d+)?/, 
            // Attribute regular expression 
			att = /^\w+/, 
            // operand regular expression 
			op = /^[\+\-\*\/]/, 
            // parentisis regular expression 
			paren = /^[\(\)]/, 
            // space regular expression 
			space = /^\s/; 
 
        while (index < expression.length) { 
 
            if (num.test(expression.substring(index))) { //num 
                var number = num.exec(expression.substring(index))[0]; 
                token = new Token("Number", Number(number), index); 
                tokens.push(token); 
                index = index + number.length; 
            } else if (att.test(expression.substring(index))) { 
                var attribute = att.exec(expression.substring(index))[0]; 
                token = new Token("Attribute", attribute, index); 
                index = index + attribute.length; 
                tokens.push(token); 
            } else if (op.test(expression.substring(index))) { 
                var oper = expression.charAt(index); 
                tokens.push(new Token("Operator", oper, index++)); 
            } else if (paren.test(expression.substring(index))) { 
                var par = expression.charAt(index); 
                tokens.push(new Token("Parenthesis", par, index++)); 
            } else if (space.test(expression.substring(index))) { 
                index++; 
            } else { 
                throw { message: "unknown token", index: index, toString: function () { return this.message; } }; 
 
            } 
 
        } 
        return tokens; 
    } 
    /** 
     * Helper function to determine operation precedence 
     * @param {string} op - An operator symbol 
     * @returns the precedence value 
     */ 
    function opPreced(op) { 
        var op = op.value; 
        switch (op) { 
            case '*': 
            case '/': 
                return 2; 
            case '+': 
            case '-': 
                return 1; 
        } 
        return 0; 
    } 
 
    /** 
     * The Shunting Yard algorithm to convert tokens into infix notation or Reverse Polish Notation 
     * http://en.wikipedia.org/wiki/Shunting-yard_algorithm 
     * @param {Token[]} tokens - A list of Tokens 
     * @returns a list of tokens in infix notation 
     */ 
    function shuntingYard(tokens) { 
        var stack = [], 
			output = [], 
			index = 0; 
        while (index < tokens.length) { 
            var token = tokens[index]; 
 
            if (token.type === "Number") { 
                output.push(token); 
            } else if (token.type === "Attribute") { 
                output.push(token); 
            } else if (token.type === "Operator") { 
                while (stack.length > 0) { 
                    var top = stack[stack.length - 1]; 
                    if (top.type === "Operator" && (opPreced(token) <= opPreced(top))) { 
                        output.push(stack.pop()); 
                    } else { 
                        break; 
                    } 
                } 
                stack.push(token); 
            } else if (token.value === "(") { 
                stack.push(token); 
            } else if (token.value === ")") { 
                var matchParen = false; 
 
                while (stack.length > 0) { 
                    var top = stack.pop(); 
                    if (top.value === "(") { 
                        matchParen = true; 
                        break; 
                    } else { 
                        output.push(top); 
                    } 
                } 
 
                if (!matchParen) { 
                    throw { 
                        stack: stack, top: top, output: output, 
                        toString: function () { return "Error: parentheses mismatch" } 
                    }; 
                } 
            } else { 
                throw "Unknown token"; 
                return; 
            } 
            index++; 
        } 
 
        while (stack.length > 0) { 
            var top = stack.pop(); 
            if (top.type === "Parenthesis") { 
                throw { 
                    stack: stack, top: top, output: output, 
                    toString: function () { return "Error: parentheses mismatch" } 
                }; 
            } 
 
            output.push(top); 
        } 
        return output; 
    } 
 
    /** 
     * Evaluates tokens with the records to produce a new array of new values for the records 
     * @param {Token[]} tokens - The tokens in infix notation to be evaulated 
     * @param {object[]} records - A list of all the records with attributes corresponding to attribute tokens 
     * @returns a list of the evaluated expressions 
     */ 
    function evaluate(tokens, records) { 
        var result = []; 
 
        for (var i = 0; i < records.length; i++) { 
            var record = records[i], 
                stack = [], 
                index = 0; 
 
            while (index < tokens.length) { 
                var token = tokens[index++]; 
                if (token.type === "Number") { 
                    stack.push(token.value); 
                } else if (token.type === "Attribute") { 
                    var att = record[token.value]; 
                    if (att === undefined) { 
                        throw token.value + " does not exist"; 
                    } 
                    if (isNaN(att)) { 
                        throw token.value + " is Not a Number!"; 
                    } 
                    stack.push(att); 
 
                } else if (token.type === "Operator") { 
                    var operand2 = stack.pop(); 
                    var operand1 = stack.pop(); 
                    switch (token.value) { 
                        case "*": 
                            stack.push(operand1 * operand2); 
                            break; 
                        case "/": 
                            stack.push(operand1 / operand2); 
                            break; 
                        case "+": 
                            stack.push(operand1 + operand2); 
                            break; 
                        case "-": 
                            stack.push(operand1 - operand2); 
                            break; 
                    } 
                } 
            } 
            result.push(stack[0]); 
        } 
 
        return result; 
    } 
    /** 
     * The expression parser  
     * @param {string} expression - An expression to be parsed 
     * @param {object[]} records - a list of record objects with attributes to be used in the parser 
     * @returns a list of values evaluated by the expression parser 
     */ 
    this.parse = function (expression, records) { 
        var tokens = tokenizer(expression); 
        var revPol = shuntingYard(tokens); 
        return evaluate(revPol, records); 
    }; 
}).apply(DataSetExp);
