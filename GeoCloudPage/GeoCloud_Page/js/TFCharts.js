/*
 * TerraFly charting library which depends on d3.js
 * Currently has Scatter Plot and Pie charts.
 */
(function (TerraFly, d3) {

    var Chart = {};

    if (!d3) {
        console.error("d3.js is required to create charts");
        return;
    }

    if (!TerraFly) {
        TerraFly = window.TerraFly = {};
    }

    TerraFly.Chart = Chart;

    /*
     * Reusable scatter plot created using d3
     * To create a scatter plot you first do 
     * var chart = TerraFly.Chart.ScatterPlot()
     * This will initilize the default values listed below and return the internal chart function
     * The chart can then be changed by calling its methods like x and y to choose an appropiate 
     * x and y value example. chart.x( function(d) { return d.xValue; }).y( function(d) { return d.yValue; });
     * xLabel and yLabel to set or get the axis labels
     * Once the chart has been edited, using d3, a chart can be drawn at a given node by doing
     * d3.select(CSSselector)      // string with CSS selector for HTML element to place the chart at
     *     .datum(dataArray)       // An array ofdata to be used by the chart
     *     .call(chart)            // chart returned by scatterPlot
     */
    Chart.ScatterPlot = function scatterPlot() {
        var margin = { top: 20, right: 20, bottom: 30, left: 40 },
            width = 500,
            height = 385,
            xValue = function (d) { return d[0]; },
            yValue = function (d) { return d[1]; },
            xScale = d3.scale.linear(),
            yScale = d3.scale.linear(),
            xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(d3.format("s")),
            yAxis = d3.svg.axis().scale(yScale).orient("left").tickFormat(d3.format("s")),
            xAxisLabel = "x",
            yAxisLabel = "y";


        function chart(selection) {
            selection.each(function (data) {

                data = data.map(function (d, i) {
                    return [xValue.call(data, d, i), yValue.call(data, d, i)];
                });

                xScale
                    .domain(d3.extent(data, function (d) { return d[0]; }))
                    .range([0, width - margin.left - margin.right]).nice;

                yScale
                    .domain(d3.extent(data, function (d) { return d[1]; }))
                    .range([height - margin.top - margin.bottom, 0]).nice;

                var svg = d3.select(this).selectAll("svg").data([data]);

                var gEnter = svg.enter().append("svg").append("g");
                gEnter.append("g").attr("class", "x axis");
                gEnter.append("g").attr("class", "y axis");

                svg.attr("width", width)
                    .attr("height", height);

                var g = svg.select("g")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


                g.select(".y.axis")
                    .call(yAxis)
                    .append("text")
                    .attr("class", "y label")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text(yAxisLabel);

                g.select(".x.axis")
                    .attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")")
                    .call(xAxis)
                    .append("text")
                    .attr("class", "x label")
                    .attr("x", width - margin.left - margin.right)
                    .attr("y", -6)
                    .attr("text-anchor", "end")
                    .text(xAxisLabel);

                g.selectAll(".point")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("class", "point")
                    .attr("r", 3.5)
                    .attr("cx", function (d) {
                        return xScale(d[0]);
                    })
                    .attr("cy", function (d) { return yScale(d[1]); });
            });
        }

        chart.margin = function (_) {
            if (!arguments.length) return margin;
            margin = _;
            return chart;
        };

        chart.width = function (_) {
            if (!arguments.length) return width;
            width = _;
            return chart;
        };

        chart.height = function (_) {
            if (!arguments.length) return height;
            height = _;
            return chart;
        };

        chart.x = function (_) {
            if (!arguments.length) return xValue;
            xValue = _;
            return chart;
        };

        chart.y = function (_) {
            if (!arguments.length) return yValue;
            yValue = _;
            return chart;
        };

        chart.xLabel = function (_) {
            if (!arguments.length) return xAxisLabel;
            xAxisLabel = _;
            return chart;
        };

        chart.yLabel = function (_) {
            if (!arguments.length) return yAxisLabel;
            yAxisLabel = _;
            return chart;
        };

        return chart;

    }


    /*
     * Reusable Pie Chart created using d3
     * To create a Pie Chart you first do 
     * var chart = TerraFly.Chart.Pie()
     * This will initilize the default values listed below and return the internal chart function
     * The chart can then be changed by calling its methods like value and label to choose an appropiate 
     * value and label. example: chart.value( function(d) { return d.value; }).label( function(d) { return d.name; });
     * 
     * Once the chart has been configured, using d3, a chart can be drawn at a given node by doing
     * d3.select(CSSselector)      // string with CSS selector for HTML element to place the chart at
     *     .datum(dataArray)       // An array of data to be used by the chart
     *     .call(chart)            // chart returned by scatterPlot
     */
    Chart.Pie = function pieChart() {
        var margin = { top: 10, right: 10, bottom: 10, left: 10 },
            width = 500,
            height = 385,
            color = d3.scale.category20(),
            value = function (d) { return d.value },
            label = function (d) { return d.label },
            pie = d3.layout.pie()
                    .sort(null)
                    .value(function (d) { return d[0]; });


        function chart(selection) {
            var radius = Math.min(width - margin.left - margin.right, height - margin.left - margin.right) / 2,
                arc = d3.svg.arc()
                    .outerRadius(radius - 10)
                    .innerRadius(0);

            selection.each(function (data) {


                data = data.map(function (d, i) {
                    return [value.call(data, d, i), label.call(data, d, i)];
                });

                var svg = d3.select(this).append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .append("g")
                        .attr("transform", "translate(" + (width / 2) + "," + (height / 2 ) + ")");

                var g = svg.selectAll("path")
                            .data(pie(data))
                            .enter()
                            .append("path")
                            .attr("fill", function (d, i) { return color(i); })
                            .attr("d", arc);

                var labels = svg.append("g")
                                .attr('class', 'labels')
                                .selectAll('g.label')
                                .data(pie(data))
                                .enter()
                                .append('g')
                                .attr('class', 'label');
                labels.append('text')
                    .attr("transform", function (d) {
                        var c = arc.centroid(d),
                            x = c[0],
                            y = c[1],
                            h = Math.sqrt(x*x + y*y);
                            return "translate(" + (x/h * (radius)) + "," + (y/h * (radius)) + "),rotate(" + angle(d) + ")";
                    })
                    .attr("dy", ".35em")
                    .style("text-anchor", function(d) {
                        return (d.endAngle + d.startAngle) / 2 > Math.PI ? "end" : "start";
                    })
                    .text(function (d) {
                        return d.data[1]
                    });


            });
        }

        function angle(d) {
            var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
            return a > 90 ? a - 180 : a;
        }

        chart.margin = function (_) {
            if (!arguments.length) return margin;
            margin = _;
            return chart;
        };

        chart.width = function (_) {
            if (!arguments.length) return width;
            width = _;
            return chart;
        };

        chart.height = function (_) {
            if (!arguments.length) return height;
            height = _;
            return chart;
        };

        chart.value = function (_) {
            if (!arguments.length) return value;
            value = _;
            return chart;
        };

        chart.label = function (_) {
            if (!arguments.length) return label;
            label = _;
            return chart;
        };

        return chart;
    }


})(window.TerraFly, window.d3);