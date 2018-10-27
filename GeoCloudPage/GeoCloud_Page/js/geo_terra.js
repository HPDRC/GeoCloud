"use strict";
var is_debug = true, 
    g_address = "", 
    g_lat = 25.75869, 
    g_lon = -80.37388, 
    g_type = "hybrid", 
    g_level = 9, 
    g_res = null, 
    g_panel = "", 
    g_panel_hide = "", 
    g_debug = 0, 
    g_tflogo = 1, 
    map0 = null, 
    g_legend = "{Cities::~Capitals:Capitals_WorldMap@wm_Capitals-100-5000-.f2;Capitals:Capitals_WorldMap@wm_Capitals-5000-99999-.f2;~Metro:Big_Cities_over_million_WorldMap@wm_Cities_Greater_900K-100-4000-.f2;Metro:Big_Cities_over_million_WorldMap@wm_Cities_Greater_900K-4000-12000-.f2;~Cities:Cities_WorldMap@wm_Cities_75K_to_900K-100-2000-.f3+wm_Cities_Greater_900K-100-2000-.f2+wm_Cities_Unknownpop-100-2000-.f3;Cities:Cities_WorldMap@wm_Cities_75K_to_900K-2000-6000-.f3+wm_Cities_Greater_900K-2000-6000-.f2+wm_Cities_Unknownpop-2000-6000-.f3};{Hubs::~Ports:Marine_Ports_WorldMap@wm_Marine_Ports-100-300-.f3;Ports:Marine_Ports_WorldMap@wm_Marine_Ports-300-10000-.f3;~Railway:Railway_Stations_WorldMap@wm_Railway_Stations-100-300-.f3;Railway:Railway_Stations_WorldMap@wm_Railway_Stations-300-10000-.f3;~Airports:Airports_WorldMap@wm_Airports-100-500-.f3;Airports:Airports_WorldMap@wm_Airports-500-10000-.f3};Landmarks:Cultural_Landmarks_WorldMap@wm_Cultural_Landmarks-100-1500-.f3;Utilities:Utilities_WorldMap@wm_Utilities-100-600-.1_50ff0000;{Roads::~Routes:Routes_WorldMap@wm_Major_Routes-100-800-.2nB3ff8000+wm_Minor_Routes-100-800-.lnB3ffff00+wm_Major_Routes-100-800-.lnB3ff8000+wm_Minor_Routes-100-800-.lnB3ffff00;Routes:Routes_WorldMap@wm_Major_Routes-800-4000-.2nB3ff8000+wm_Minor_Routes-800-4000-.lnB3ffff00+wm_Major_Routes-800-4000-.lnB3ff8000+wm_Minor_Routes-800-4000-.lnB3ffff00;~Railways:Railroad_WorldMap@wm_Railroad_Track-100-2000-.l_5000ff00;Railways:Railroad_WorldMap@wm_Railroad_Track-2000-8000-.l_5000ff00};{Water::Bays:Seas_and_Bays_WorldMap@wm_Seas_Bays-100-3000-.f4;Glaciers:Glaciers_WorldMap@wm_Glacier-100-80000-.t0t6e6e6e000001ffffff||ttt6e6e6e000001ffffff;~Rivers_B:Lake_and_River_contours_WorldMap@wm_Water_Poly-100-3000-.t00806e6e6ef099b3cc70ffffff||0t0806e6e6ef099b3cc70ffffffi;Rivers_B:Lake_and_River_contours_WorldMap@wm_Water_Poly-3000-10000-.t00806e6e6ef099b3cc70ffffff||0t0806e6e6ef099b3cc70ffffffi;~Great_Lakes_L:Great_Lakes_labels_WorldMap@WM_GREAT_LAKES_NAME-100-3000-.l2;Great_Lakes_L:Great_Lakes_labels_WorldMap@WM_GREAT_LAKES_NAME-3000-10000-.l2;~Great_Lakes_B:Great_Lakes_contours_WorldMap@wm_Great_Lakes-100-6000-.t00806e6e6e8099b3ccff000001||0t0806e6e6e8099b3ccff000001;Great_Lakes_B:Great_Lakes_contours_WorldMap@wm_Great_Lakes-6000-99999-.t00806e6e6e8099b3ccff000001||0t0806e6e6e8099b3ccff000001};{Regions::~Admin_L:States_and_Provinces_names_labeled_WorldMap@wm_World_Admin_name-100-3000-.l2;Admin_L:States_and_Provinces_names_labeled_WorldMap@wm_World_Admin_name-3000-10000-.l2;~Admin_B:States_and_Provinces_boundaries_WorldMap@wm_World_Admin-100-1000-.t0080ffffffffe8e8e5ffffffff||tt080323232ffe8e8e5ffffffff;Admin_B:States_and_Provinces_boundaries_WorldMap@wm_World_Admin-1000-10000-.t0080ffffffffe8e8e5ffffffff||tt080323232ffe8e8e5ffffffff;~Countries_L:Nation_names_labeled_WorldMap@nation_name-100-5000-.l2;Countries_L:Nation_names_labeled_WorldMap@nation_name-5000-99999-.l2;~Countries_B:Nations_boundaries_WorldMap@wm_World_Nations-100-100000-.t0080ffffffffe8e8e5ffffffff||tt0806e6e6effe8e8e5ffffffff};{Environment:Hydrology@rtgauges-0-8-%2Bptrim-8-100-%2Bprism-1-100-.t5v};Real_estate:MLS_listings_for_sale_and_rent_in_Miami_area@re1n-0-2-%2Bre2n-0-2-%2Brntn-0-2-%2Brinn-0-4-%2Brldn-0-4-;{Parcels::address:Addresses_from_First_American_Parcel_Data:@FA_Point-0-1-.a;~owner:Property_owner@flpropertiesowner-0-0.5-;owner:Property_owner@flpropertiesowner-0.5-8-;year_built:Year_property_built_or_renovated@flpropertiesyear-0-2-;size:Sizes_of_property_interior_and_lot@flpropertiessize-0-2-;appraisal:Property_value@flpropertiesvalue-0-2-;~lines:Property_lines,_from_First_American,_zoomin:@FA_Parcel-0-0.8-.t00;lines:Property_lines,_from_First_American,_zoomout:@FA_Parcel-0.8-2-.t00};{People::income:Aggregate_Neighborhood_Income_and_number_of_homes,_per_Census-2000@blkgrpy-0.6-8-.d0v%2Bbg_mhinc-0.6-8-;population:People_per_block_per_Census_2000@blk_pop-0-4-};{Services::doctors:Physicians_specialties@physicianspecialty-0-4-;food:Restaurants_from_NavTeq@nv_restrnts-0-8-;~business:Yellow_Pages@nypages-0-1-;business:Yellow_Pages@nypages-1-4-};~Places@annomreal-0-5-+annodhs-0-5-+gnis2-0-5-+hotels-0-5-;Places@annomreal-5-20-+annodhs-5-20-+gnis2-5-20-+hotels-5-20-;{Roads::lines@street-0-30-.l_;~lines@street-30-100-.l_;~names:Roads,_and_streets@street-0-100-._n;OSM-names:Open_Street_Maps@osm-0-100-._n;OSM-lines:Open_Street_Maps@osm-0-100-.l_};{Towns::~towns:Cities,_towns@wtown-0-100-%2Bincorp-0-100-.00v;borders@incorp-0-100-.v00}", 
    debugMsg = null, 
    g_engine = "m"; 
function debug(msg) 
{ 
	if (is_debug) { 
		if (debugMsg == null) { 
			debugMsg = document.getElementById("divDebugMsg"); 
		} 
		debugMsg.innerHTML += msg + "<br />"; 
	} 
} 
 
/** 
 * Called when the page is finished loading, creates the map 
 * and retrieves the dataset list 
 */ 
function on_pageLoad() 
{ 
    getDataSets(); 
	//debug("createMap()"); 
	//getUrlParas(); 
	createMap(); 
} 
 
/** 
 * Retrieves the URL parameters 
 * No longer used as an alternate method is used 
 * See readUriParams() 
 */ 
function getUrlParas() 
{ 
	var url_lat = null, 
    	url_lon = null, 
    	url_res = null, 
    	url_level = null, 
    	url_address = null, 
    	url_panel = null, 
    	url_panel_hide = null, 
    	url_legend = null, 
    	url_type = null, 
    	url_debug = null, 
		url_tflogo = null; 
	 
	url = document.location.href; 
	debug(url); 
	var paraStr = null; 
	if (url.indexOf("#") != -1) { 
		paraStr = url.substring(url.indexOf("#") + 1); 
	} 
	else { 
		paraStr = url.substring(url.indexOf("?") + 1); 
	} 
	debug(paraStr); 
	var queryStr = "&" + paraStr; 
	url_lat = queryStr.getQueryString("lat"); 
	url_lon = queryStr.getQueryString("lon"); 
	url_res = queryStr.getQueryString("res"); 
	url_level = parseInt(queryStr.getQueryString("lvl")); 
	url_address = unescape(queryStr.getQueryString("address")).replace(/\+/g, " "); 
	url_panel = queryStr.getQueryString("panels"); 
	url_panel_hide = queryStr.getQueryString("!panels"); 
	url_legend = queryStr.getQueryString("legend"); 
	url_type = queryStr.getQueryString("type"); 
	url_debug = queryStr.getQueryString("debug"); 
	url_tflogo = queryStr.getQueryString("tflogo"); 
	url_engine = queryStr.getQueryString("fmap"); 
 
	var center = null 
	center = queryStr.getQueryString("cen").split(','); 
 
	url_lat = parseFloat(center[0]); 
	url_lon = parseFloat(center[1]); 
	 
	g_lat = (!url_lat ?g_lat:url_lat); 
	g_lon = (!url_lon ?g_lon:url_lon); 
	g_res = (!url_res ?g_res:url_res); 
	g_level = (!url_level ?g_level:url_level); 
	g_address = (!url_address ?g_address:url_level); 
	g_panel = (!url_panel?g_panel:url_panel); 
	g_panel_hide = (!url_panel_hide?g_panel_hide:url_panel_hide); 
	g_legend = (!url_legend?g_legend:url_legend); 
	g_type = (!url_type?g_type:url_type); 
	g_debug = (!url_debug?g_debug:url_debug); 
	g_tflogo = (url_tflogo=="1"?true:false); 
	g_engine = (!url_engine?g_engine:url_engine); 
} 
 
/** 
 * The function that creates a new TerraFly map 
 */ 
function createMap() 
{ 
	var level = 0; 
	if (g_res != null) { 
		level = TGetLevelByResolution(g_res); 
	} 
	else { 
		level = g_level; 
	} 
 
	var uri = document.URL.split("#")[1]; 
    if( uri ) { 
	    var params = readUriParams(uri); 
	    var lat = params.coordinate[0]; 
        var long = params.coordinate[1]; 
        level = params.lvl; 
    } 
 
	var main = document.getElementById("mainContent"); 
	var width = main.scrollWidth - 240; 
	var height = main.scrollHeight; 
 
	var mapContainer = document.getElementById("centerMap"); 
	mapContainer.style.width = width + "px"; 
	mapContainer.style.height = height + "px"; 
    map0 = new tf.apps.GeoCloud.App({ fullURL: window.location.href, container: mapContainer}); 
	//map0 = new TMap(mapContainer, lat || g_lat, long || g_lon, level, on_mapLoad, 0, true, g_engine, g_type); 
} 
 
/** 
 * Shows the various panels on the map 
 */ 
function showPanels() 
{ 
	var strHide = "HIDDEN"; 
    var strShow = "SHOW"; 
    // Initial values 
    var p_nav = strShow, 
        p_zoom = strShow, 
        p_overview = strShow, 
        p_legend = strShow, 
        p_download = strShow, 
        p_measure = strShow, 
        p_type = strShow, 
        p_fullscreen = strShow; 
	 
	// get the panels to show 
	if (g_panel != "") { 
		var panelsToShow = g_panel.spilt('+'); 
		for (var panel in panelsToShow) { 
			if (panel == "nav") { 
				p_nav = strShow; 
			} 
			else if (panel == "zoom") { 
				p_zoom = strShow; 
			} 
			else if (panel == "overview") { 
				p_overview = strShow; 
			} 
			else if (panel == "legend") { 
				p_legend = strShow; 
			} 
			else if (panel == "download") { 
				p_download = strShow; 
			} 
			else if (panel == "measure") { 
				p_measure = strShow; 
			} 
			else if (panel == "type") { 
				p_type = strShow; 
			} 
			else if (panel == "fullscreen") { 
				p_fullscreen = strShow; 
			} 
		} 
	} 
	 
	// get the panels to hide 
	if (g_panel_hide != "") { 
		var panelsToHide = g_panel_hide.spilt('+'); 
		for (var panel in panelsToHide) { 
			if (panel == "nav") { 
				p_nav = strHide; 
			} 
			else if (panel == "zoom") { 
				p_zoom = strHide; 
			} 
			else if (panel == "overview") { 
				p_overview = strHide; 
			} 
			else if (panel == "legend") { 
				p_legend = strHide; 
			} 
			else if (panel == "download") { 
				p_download = strHide; 
			} 
			else if (panel == "measure") { 
				p_measure = strHide; 
			} 
			else if (panel == "type") { 
				p_type = strHide; 
			} 
			else if (panel == "fullscreen") { 
				p_fullscreen = strHide; 
			} 
		} 
	} 
	 
	// set visibility of the panels 
	map0.SetPanelVisibility("FLY", p_nav); 
    map0.SetPanelVisibility("ZOOM", p_zoom); 
    map0.SetPanelVisibility("OVERVIEW", p_overview); 
    map0.SetPanelVisibility("LEGEND", p_legend); 
    map0.SetPanelVisibility("BUY", p_download); 
    map0.SetPanelVisibility("MEASURE", p_measure); 
    map0.SetPanelVisibility("TYPE", p_type); 
	map0.SetLogoVisibility(g_tflogo); 
	 
	//set legend 
	if (p_legend == strShow && g_legend != "") { 
		map0.SetLegend(g_legend); 
	} 
	 
	// set debug status 
	if (g_debug == 0) { 
        map0.ViewDebugPanel(false); 
        map0.ViewTileURL(false); 
    } 
    if (g_debug == 1) { 
        map0.ViewDebugPanel(false); 
        map0.ViewTileURL(true); 
    } 
    if (g_debug == 2) { 
        map0.ViewDebugPanel(true); 
        map0.ViewTileURL(false); 
    } 
    if (g_debug == 3) { 
        map0.ViewDebugPanel(true); 
        map0.ViewTileURL(true); 
    } 
} 
/** 
 * Helper method to retrieve query values from the query string 
 * in a url 
 * No longer used 
 */ 
String.prototype.getQueryString = function(name) 
{ 
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]"); 
	var regexS = "[\\?#&]"+name+"=([^&#]*)"; 
	var regex = new RegExp(regexS, "i"); 
	var results = regex.exec( this ); 
	if( results == null ) 
	{ 
		return ""; 
	} 
	else 
	{ 
		return results[1]; 
	} 
} 
 
/** 
 * creates a URI used to describe the current map and dataset 
 * @returns a uri param of the current map state 
 */ 
function createUriParams() { 
    var loc = mapApp.GetParameters(), 
        ids = getCurrentDataSets(), 
        uri = []; 
 
    uri[0] = loc; 
 
    //dataSetsList
    for (var i = 0; i < ids.length; i++) { 
        uri[i+1] = dataSetsList[ids[i]].data.getParams(); 
    } 

    //userDataset
    var userDataset;
    for (var strIndex in userDatasets) {
        var userDataset = userDatasets[strIndex],
            dataId = userDataset.info[0],
            funcName = userDataset.info[1],
            str = "";


        str = dataId + ":a" + ":" + funcName;
        for(var i = 2; i < userDataset.info.length; ++i) {

            if(toString.apply(userDataset.info[i]) === '[object Array]') {
                str += ":=" + userDataset.info[i][0];
                for(var j = 1; j < userDataset.info[i].length; ++j) {
                    str += "-" + userDataset.info[i][j];
                }
            }
            else {
                str += ":" + userDataset.info[i];
            }
        }
        str.replace(/#/g, "");
        uri[uri.length] = str;
    }

    return encodeURI(uri.join('/')); 
} 
 
/** 
 * Reads parameters of the url, used to restore the map state 
 * @param {string} uri - The uri parameters of the map 
 * @returns a dictionary of the different parameters 
 */ 
function readUriParams(uri) { 
 
    var params = uri.split("/"), 
        hash = {}, 
        loc = params[0], 
        datasets = [], 
        datasetparams; 
 
 
    loc = loc.split(":"); 
     
    hash.lvl = loc[0]; 
    hash.coordinate = [loc[1], loc[2]]; 
 
    for (var i = 1; i < params.length; i++) { 
        datasetparams = params[i].split(":"); 
        for (var j = 0; j < datasetparams.length; ++j) {
            if(datasetparams[j][0] == "=") {
                var arryData = datasetparams[j].substring(1);
                datasetparams[j] = arryData.split("-");
            }
        }
         
        datasets[i - 1] = datasetparams; 
    } 
 
    hash.datasets = datasets; 
 
    return hash; 
} 
 
/** 
 * Restores the map to the specified parameters 
 * stores the dataset syles in the global settings object 
 * @param {string} params - The url parameters for the map 
 */ 
var settings = {}; 
function restoreMapState(params) { 
    var hash = readUriParams(params), 
        datasets = hash.datasets, 
        style; 
 
    for (var i = 0; i < datasets.length; i++) { 
        style = {}; 
        style.fn = {}; 
        var datasetparams = datasets[i]; 
        var id = datasetparams[0]; 
        var styleCode = datasetparams[1]; 
 
        if (styleCode[0] == "m") { //marker 
            style.markerName = datasetparams[2]; 
            style.color = {}; 
            style.fn.markerName = (function () { 
                var markerName = style.markerName; 
                return function (record) { 
                    return record[markerName]; 
                } 
            })(); 
            if (styleCode[1] == "s") { 
                style.color.type = "Single"; 
                style.color.value = "#" + datasetparams[3]; 
            } else if (styleCode[1] == "r") { 
                style.color.type = "Range"; 
                style.color.attribute = datasetparams[3]; 
                var colors = datasetparams[4].split('-'); 
                for (var j in colors) { 
                    colors[j] = "#" + colors[j]; 
                } 
                style.color.value = { _color: colors }; 
            } else { //img 
 
                style.imgMarker = datasetparams[3]; 
 
            } 
 
        } else if (styleCode[0] == "p") { //polygon 
 
            style.lineColor = "#" + datasetparams[2]; 
            style.lineWidth = parseInt(datasetparams[3]); 
            style.lineAlpha = parseInt(datasetparams[4]); 
            style.fillAlpha = parseInt(datasetparams[5]); 
            style.fillColor = {}; 
            if (styleCode[1] == "s") { 
                style.fillColor.type = "Single"; 
                style.fillColor.value = "#" + datasetparams[6]; 
            } else { 
                style.fillColor.type = "Range"; 
                style.fillColor.attribute = datasetparams[6]; 
                style.fillColor.classes = parseInt(datasetparams[7]); 
                var colors = datasetparams[8].split('-'); 
                for (var j in colors) { 
                    colors[j] = "#" + colors[j]; 
                } 
                style.fillColor["_color"] = colors; 
            } 
        } else if (styleCode[0] == "a") { //Analysis Models
            var str = datasetparams[2];
                length = datasetparams.length;

            str += "(id";
            for (var j = 3; j < length; ++j)
            {
                var param = datasetparams[j];
                if(typeof param === "string") {
                    str += ", '" + param + "'";
                }
                else if(toString.apply(param) === '[object Array]') {
                    str += ",param";
                }
                else
                    str += "," + param;
            }
            str += ")";
            eval(str);
            continue;
        }
 
        settings[id] = {}; 
        if (datasetparams[datasetparams.length - 1].split('=').length == 2) { 
            var analysisParams = datasetparams[datasetparams.length - 1].split('='); 
            settings[id].analysis = {}; 
            settings[id].analysis.type = analysisParams[0]; 
            settings[id].analysis.params = analysisParams[1].split(','); 
        } 
 
        settings[id].style = style; 
        addToMap(id); 
    } 
} 
 
/** 
 * generates and displays the url which can be shared 
 * Shows the url Dialog 
 */ 
function getUrl() { 
    var uri = createUriParams(), 
        url = document.URL.split("#")[0]; 
 
    url += "#" + uri 
    dojo.byId("url").value = url; 
 
    dijit.byId("urlDialog").show(); 
} 
 
/** 
 * Restores the map from the iframe for MapQL 
 */ 
function restoreMap() { 
    var frame = document.getElementById('mapFrame'), 
        map = document.getElementById('centerMap'); 
 
    frame.style.display = "none"; 
    map.style.display = "block"; 
} 
 
// Urls for the different MapQL maps 
var SQLMapTypes = { 
    realtor: 'http://tfcore.cs.fiu.edu/map/test_felix/#fmap=m&Lat=25.75869&Lon=-80.37388&res=19.2&Legend=~open_house_around_FIU:open_house@realtor_aournd_FIU+FIU&dlayerfield1=L&DLayerColor1=0x7fe5ff&DLayerLegend1=Wikipedia&DLayerData1=http%3A//vn4.cs.fiu.edu/cgi-bin/arquery.cgi%3Fcategory%3Dwikix2011%26tfaction=shortdisplay%26filetype=.xml&Panels=zoom+nav+overview+measure+download+legend+type&address=FIU%2C+Miami%2C+FL%2033199&vid=&tf_passtrough=%26tfaction%3D%26referer%3Dtfhome', 
    hotel: 'http://tfcore.cs.fiu.edu/map/test_felix/#fmap=m&Lat=25.9936&Lon=-80.2241&res=38.4&Legend=~hotel:hotel@hotel_along_street+collins&dlayerfield1=L&DLayerColor1=0x7fe5ff&DLayerLegend1=Wikipedia&DLayerData1=http%3A//vn4.cs.fiu.edu/cgi-bin/arquery.cgi%3Fcategory%3Dwikix2011%26tfaction=shortdisplay%26filetype=.xml&Panels=zoom+nav+overview+measure+download+legend+type&address=FIU%2C+Miami%2C+FL%2033199&vid=&tf_passtrough=%26tfaction%3D%26referer%3Dtfhome', 
    income: 'http://tfcore.cs.fiu.edu/map/test_felix/#fmap=m&Lat=25.75869&Lon=-80.37388&res=76.8&Legend=~average_income:income@avg_income_opt&dlayerfield1=L&DLayerColor1=0x7fe5ff&DLayerLegend1=Wikipedia&DLayerData1=http%3A//vn4.cs.fiu.edu/cgi-bin/arquery.cgi%3Fcategory%3Dwikix2011%26tfaction=shortdisplay%26filetype=.xml&Panels=zoom+nav+overview+measure+download+legend+type&address=FIU%2C+Miami%2C+FL%2033199&vid=&tf_passtrough=%26tfaction%3D%26referer%3Dtfhome', 
    traffic: 'http://tfcore.cs.fiu.edu/map/test_felix/#fmap=m&Lat=-33.44&Lon=-70.64&res=4.8&Legend=~santiago_traffic:traffic@traffic&dlayerfield1=L&DLayerColor1=0x7fe5ff&DLayerLegend1=Wikipedia&DLayerData1=http%3A//vn4.cs.fiu.edu/cgi-bin/arquery.cgi%3Fcategory%3Dwikix2011%26tfaction=shortdisplay%26filetype=.xml&Panels=zoom+nav+overview+measure+download+legend+type&address=FIU%2C+Miami%2C+FL%2033199&vid=&tf_passtrough=%26tfaction%3D%26referer%3Dtfhome', 
    crimeChanging: 'http://tfcore.cs.fiu.edu/map/test_felix/#fmap=m&Lat=25.75869&Lon=-80.37388&res=38.4&Legend=~crime_changing:crime_changing@zip_crime_delt&dlayerfield1=L&DLayerColor1=0x7fe5ff&DLayerLegend1=Wikipedia&DLayerData1=http%3A//vn4.cs.fiu.edu/cgi-bin/arquery.cgi%3Fcategory%3Dwikix2011%26tfaction=shortdisplay%26filetype=.xml&Panels=zoom+nav+overview+measure+download+legend+type&address=FIU%2C+Miami%2C+FL%2033199&vid=&tf_passtrough=%26tfaction%3D%26referer%3Dtfhome', 
    crimeCluster: 'http://tfcore.cs.fiu.edu/map/test_felix/#fmap=m&Lat=25.75869&Lon=-80.37388&res=38.4&Legend=~crime_cluster:crime_cluster@crime_cluster_with_color&dlayerfield1=L&DLayerColor1=0x7fe5ff&DLayerLegend1=Wikipedia&DLayerData1=http%3A//vn4.cs.fiu.edu/cgi-bin/arquery.cgi%3Fcategory%3Dwikix2011%26tfaction=shortdisplay%26filetype=.xml&Panels=zoom+nav+overview+measure+download+legend+type&address=FIU%2C+Miami%2C+FL%2033199&vid=&tf_passtrough=%26tfaction%3D%26referer%3Dtfhome', 
    incomeStreet: 'http://tfcore.cs.fiu.edu/map/test_felix/#fmap=m&Lat=25.75869&Lon=-80.37388&res=19.2&Legend=~crime_cluster:crime_cluster@income_along_st+8_st&dlayerfield1=L&DLayerColor1=0x7fe5ff&DLayerLegend1=Wikipedia&DLayerData1=http%3A//vn4.cs.fiu.edu/cgi-bin/arquery.cgi%3Fcategory%3Dwikix2011%26tfaction=shortdisplay%26filetype=.xml&Panels=zoom+nav+overview+measure+download+legend+type&address=FIU%2C+Miami%2C+FL%2033199&vid=&tf_passtrough=%26tfaction%3D%26referer%3Dtfhome' 
}; 
 
// example MapQL statements for the above maps 
var SQLStatements = { 
    realtor: "SELECT \n  '/var/www/cgi-bin/house.png' AS T_ICON_PATH, \n  r.price AS T_LABEL,\n  '15' AS T_LABEL_SIZE, \n  r.geo AS GEO \nFROM \n  realtor_20121116 r \nWHERE \n  ST_Distance(r.geo,  GeomFromText('POINT(-80.376283 25.757228)')) < 0.03;", 
    hotel: "SELECT \n  CASE \n    WHEN star >= 1 and star < 2 THEN '/var/www/cgi-bin/hotel_1star.png' \n    WHEN star >= 2 and star < 3 THEN '/var/www/cgi-bin/hotel_2stars.png' \n    WHEN star >= 3 and star < 4 THEN '/var/www/cgi-bin/hotel_3stars.png' \n    WHEN star >= 4 and star < 5 THEN '/var/www/cgi-bin/hotel_2stars.png' \n    WHEN star >= 5 THEN '/var/www/cgi-bin/hotel_2stars.png' \n    ELSE '/var/www/cgi-bin/hotel_0star.png' \n  END AS T_ICON_PATH, \n  h.geo AS GEO \nFROM \n  osm_fl o \nLEFT JOIN \n  hotel_all h \nON \n  ST_Distance(o.geo, h.geo) < 0.05 \nWHERE \n  o.name = 'Florida Turnpike';", 
    income: "SELECT \n  u.geo AS GEO,\n  u.zip AS T_LABEL, \n  '0.7' AS T_OPACITY, \n  '15' AS T_LABEL_SIZE,\n  'color(\"blue\")' AS T_BORDER_COLOR,\n  CASE \n    WHEN avg(i.income) < 30000 THEN 'color(155, 188, 255)' \n    WHEN avg(i.income) >= 30000 and avg(i.income) < 50000 THEN 'color(233, 236, 255)' \n    WHEN avg(i.income) >= 50000 and avg(i.income) < 70000 THEN 'color(255, 225, 198)' \n    WHEN avg(i.income) >= 70000 and avg(i.income) < 90000 THEN 'color(255, 189, 111)' \n    WHEN avg(i.income) >= 90000 and avg(i.income) < 110000 THEN 'color(255, 146, 29)' \n    WHEN avg(i.income) >= 110000 and avg(i.income) < 130000 THEN 'color(255, 69, 0)' \n    WHEN avg(i.income) >= 130000 THEN 'color(\"red\")' \n    else 'color(\"grey\")' \n  END AS T_FILLED_COLOR \nFROM \n  us_zip u left join income i \nON \n  ST_Within(i.geo, u.geo)='t' \nGROUP BY \n  u.geo, u.zip;", 
    traffic: "SELECT \n  CASE \n    WHEN speed >= 50 THEN 'color(155, 188, 255)' \n    WHEN speed >= 40 and speed < 50 THEN 'color(233, 236, 255)' \n    WHEN speed >= 30 and speed < 40 THEN 'color(255, 225, 198)' \n    WHEN speed >= 20 and speed < 30 THEN 'color(255, 189, 111)' \n    WHEN speed >= 10 and speed < 20 THEN 'color(255, 146, 29)' \n    WHEN speed >= 5 and speed < 10 THEN 'color(255, 69, 0)' \n    WHEN speed >= 0 and speed < 5 THEN 'color(\"red\")' \n    else 'color(\"grey\")' \n  END AS T_FILLED_COLOR, \n  '3' AS T_THICKNESS, \n  GEO \nFROM \n  santiago_traffic;", 
    crimeChanging: "SELECT \n  july_zip AS T_LABEL, \n  '15' AS T_LABEL_SIZE, \n  'color(\"blue\")' AS T_BORDER_COLOR, \n  '0.3' AS T_OPACITY, \n  july_geo AS GEO,\n  CASE \n    when final.aug_count - final.july_count < 0 then 'color(\"green\")' \n    when final.aug_count - final.july_count > 0 then 'color(\"red\")' \n    else 'color(\"white\")' \n  end AS T_FILLED_COLOR\nFROM \n(\n  (\n    SELECT \n      count(*) AS july_count, \n      u.geo AS july_geo, \n      u.zip AS july_zip \n    FROM \n      us_zip u \n    LEFT JOIN \n      crime_dade_200807 c \n    ON \n      ST_Intersects(u.geo, c.geo)='t' \n    GROUP BY \n      u.geo, u.zip\n  ) AS july \n  LEFT JOIN \n  (\n    SELECT \n      count(*) AS aug_count, \n      u.geo AS aug_geo, \n      u.zip AS aug_zip \n    FROM \n      us_zip u \n    LEFT JOIN \n      crime_dade_200808 c \n    ON \n      ST_Intersects(u.geo, c.geo)='t' \n    GROUP BY \n      u.geo, u.zip\n  ) AS aug \n  ON  \n    july.july_zip = aug.aug_zip\n) AS final;", 
crimeCluster: "SELECT \n  '15' as  T_LABEL_SIZE, \n  'color('|| to_char(cid * 10, '999')||','||to_char(cid * 10, '999')||', 255)' as  T_LABEL_COLOR, \n  cid as  T_LABEL, \n  GEO \nFROM\n  crime_cluster;", 
    incomeStreet: "SELECT\n  '/var/www/cgi-bin/money.png' AS T_ICON_PATH,\n  '20' AS T_LABEL_SIZE, \n  i.geo AS GEO \nFROM\n  osm_fl o \nLEFT JOIN\n  income i \nON\n  ST_Distance(o.geo, i.geo) < 0.01 \nWHERE\n  o.name like '8th St SW' or o.name like '8th ST SE' or o.name like 'Southwest 8th Street';" 
}; 
 
/** 
 * Dialog to choose MapQL maps 
 */ 
function createSQLRender() { 
    var dialog = dijit.byId("chartDialog"), 
        content = content = dojo.byId("charts"), 
        mapType = document.createElement("select"), 
        render = document.createElement("button"), 
        sqlStatement = document.createElement("textarea"); 
 
    content.innerHTML = ""; 
 
    for (var type in SQLMapTypes) { 
        mapType.add(new Option(type)); 
    } 
 
    mapType.onchange = function () { 
        sqlStatement.innerHTML = SQLStatements[this.value]; 
    }; 
    sqlStatement.cols = 55; 
    sqlStatement.rows = 10; 
    sqlStatement.innerHTML = SQLStatements.realtor; 
    render.className = "btn"; 
    render.onclick = function () { 
        loadSQLMap(mapType.value); 
        dialog.hide(); 
    } 
 
    render.appendChild(document.createTextNode("Render")); 
    content.appendChild(document.createTextNode("Select a predefined SQL statement or create your own")); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(document.createTextNode("Predefined:")); 
    content.appendChild(mapType); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(sqlStatement); 
    content.appendChild(document.createElement("br")); 
    content.appendChild(render); 
 
    dialog.show(); 
 
 
 
} 
 
/** 
 * Loads a MapQL iframe map and hides the main map 
 * @param {string} type - The MapQL map to load 
 */ 
function loadSQLMap(type) { 
    var url = SQLMapTypes[type], 
        frameContainer = document.getElementById('mapFrame'), 
        map = document.getElementById('centerMap'), 
        frame = document.createElement("iframe"); 
 
    frameContainer.innerHTML = ""; 
    frameContainer.appendChild(frame); 
    frame.marginHeight = 0; 
    frame.marginWidth = 0; 
    frame.scrolling = "no"; 
    frame.frameBorder = 0; 
    frameContainer.style.width = frame.style.width = map.style.width; 
    frameContainer.style.height = frame.style.height = map.style.height; 
    map.style.display = "none"; 
    frameContainer.style.display = "inline-block"; 
    frame.src = url;    
} 
 
/** 
 * Used to resize the map and respond to window resizes 
window.onresize = function resizeMap() { 
    var main = document.getElementById("mainContent"); 
    var width = main.clientWidth - 240; 
    var height = main.clientHeight; 
 
    var mapContainer = document.getElementById("centerMap"); 
    mapContainer.style.width = width + "px"; 
    mapContainer.style.height = height + "px"; 
     
    map0.SetSize(width, height); 
}
*/ 

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// declares the namespace of this application, defines its global constants 
 
tf.apps.GeoCloud = { 
 
}; 
 
// the application class 
 
var mapApp;
tf.apps.GeoCloud.App = function (settings) { 
 
    var theThis, urlapiApp, map, singleMapApp; 
 
    function processCustomParameters(parameters) { 
         
    } 
 
    var point; 
    function onCreated(notification) { 
        // retrieves app creation information and object instances 
        mapApp = notification.sender; 
        singleMapApp = notification.sender; 
        map = singleMapApp.GetMap(); 
        processCustomParameters(singleMapApp.GetParameters()); 

        map.ShowPanels(tf.consts.panelNameNoMapScale + tf.consts.charSplitStrings +
                        tf.consts.panelNameNoAddress + tf.consts.charSplitStrings +
                        tf.consts.panelNameNoMapLocation + tf.consts.charSplitStrings +
                        tf.consts.panelNameNoMapRotate + tf.consts.charSplitStrings +
                        tf.consts.panelNameNoUserLocation);
        map.ShowMapCenter(false);
        map.SetGoDBOnDoubleClick(false);
        map.AddListener(tf.consts.mapMoveEndEvent, mapMoved);
        map.AddListener(tf.consts.mapLevelChangeEvent, mapMoved);
        var uri = document.URL.split("#")[1]; 
        if(uri) restoreMapState(uri); 
 
        //-80.3761482"25.76101546016" 
    } 
 
    function initialize() { 
        // url parameters (latitude, longitude, level, resolution, map type, legends, etc.) should only be set to override API defaults 
        // sets perspectivemap to false (perspective map is created, but not activated by default) 
        // loads GeoImages by default, unless other dlayers are specified by URL parameters 
        var defaultParameters = { 
            perspectivemap: false, 
        }; 
 
        tf.GetStyles(tf.styles.GetGraphiteAPIStyleSpecifications()); 
 
        settings = tf.js.GetValidObjectFrom(settings); 
        settings.documentTitle = "GeoCloud"; 
        settings.fullURL = tf.urlapi.ParseURLAPIParameters(settings.fullURL, defaultParameters); 
        settings.fullURL.level = 10;
        settings.parentContainer = settings.container;
        settings.onCreated = onCreated; 
        urlapiApp = tf.urlapi.SingleMapSinglePaneApp(settings); 
    } 
 
    (function actualConstructor(theThisSet) { theThis = theThisSet; initialize(); })(this); 
}; 
