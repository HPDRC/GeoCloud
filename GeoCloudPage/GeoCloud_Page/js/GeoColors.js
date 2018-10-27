/*
 * GeoColors.js
 * Contains functions related to colors
 */

/*
 * Generates a range of color hex values
 * example: "#ffffff" to "#000000" with count 6
 * returns ["#ffffff", "#
 */
function hexColorRange(colorHex1, colorHex2, count) {
    var range = [];

    var hex1 = splitColorHex(colorHex1); //splits the string into managable red, green, and blue
    var hex2 = splitColorHex(colorHex2);

    var hexRanges = []; //will hold [ [red range], [blue range], [green range] ]

    for (var i = 0; i < hex1.length; i++) { //create the ranges for each color
        hexRanges.push(hexRange(hex1[i], hex2[i], count));
    }

    for (var i = 0; i < hexRanges[0].length; i++) { //assmble them back together
        range.push("#" + hexRanges[0][i] + hexRanges[1][i] + hexRanges[2][i]);
    }

    return range;
}

/*
 * Helper function for hexColorRange, splits a colorHex into red, green and blue
 * colorHex: example "#ff0044"
 * returns ["ff", "00", "44"]
 */
function splitColorHex(colorHex) {
    var rgbColors = [];

    rgbColors.push(colorHex.slice(1, 3)); // red
    rgbColors.push(colorHex.slice(3, 5)); // green
    rgbColors.push(colorHex.slice(5));    // blue

    return rgbColors;
}

/*
 * Helper function for hexColorRange, takes 2 hex strings and creates a range
 * input hex1 and hex2 "ff", "24", ect count is the range size
 * returns: ["ff", "cc", "aa", ect]
 */
function hexRange(hex1, hex2, count) {
    count = count - 1; // we already have the last value
    var range = [];

    var firstNum = parseInt(hex1, 16); //parse into hexadecimal
    var lastNum = parseInt(hex2, 16);

    var increment = (firstNum - lastNum) / count; //the number to increment the range

    range.push(hex1); //push on the first value

    for (var i = 1; i < count; i++) {
        var value = Math.round(firstNum - (increment * i)) // increment * i gives the value to subtract from firstNum
        var hexString = value.toString(16); //convert to a string hexadecimal
        range.push(hexString.length > 1 ? hexString : "0" + hexString); //check if length is one and add a 0
    }

    range.push(hex2); // lastly push the last value

    return range;
}

/*
 * An algorithm which calculates a contrastColor based on a given hex color string
 */
function contrastColor(color) {
    if (contrastColor.memo[color]) {
        return contrastColor.memo[color];
    } else {
        var d = 0;
        var colorRGB = splitColorHex(color);
        for (var i = 0; i < colorRGB.length; i++) {
            colorRGB[i] = parseInt(colorRGB[i], 16);
        }
        // algorithm based on http://stackoverflow.com/a/1855903
        var a = 1 - (0.299 * colorRGB[0] + 0.587 * colorRGB[1] + 0.114 * colorRGB[2]) / 255;

        var contrast;
        if (a < 0.5) {
            contrast = "#000000";
        } else {
            
            contrast = "#ffffff";
        }

        contrastColor.memo[color] = contrast;
        return contrast;
    }
}
contrastColor.memo = {};


/*
 * creates 3 hex color ranges
 */
function complexColorRange(hex1, hex2, hex3, count) {
    var countL = 0; //count for the left part
    var countR = 0; //count for the right part
    if (count % 2 === 1) { //odd numbers are easy
        countL = countR = Math.ceil(count / 2); //just divide and use the ceiling function
    } else { // but even numbers, one element needs to be hex2
        countL = count / 2;
        countR = countL + 1;
    }
    var colorL = hexColorRange(hex1, hex2, countL);
    var colorR = hexColorRange(hex2, hex3, countR);
    colorL.pop() //pop the top because it the same value at the start of colorR
    return colorL.concat(colorR); //put them together

}