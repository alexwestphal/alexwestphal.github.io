var knots = function() {
    var id = function(d) { return d; };
    var pow = Math.pow, sqrt = Math.sqrt, PI = Math.PI, sin = Math.sin, cos = Math.cos;

    return {
        drawChart: function(width, height) {
            var chart = d3.select(".chart")
                .attr({width: width, height: height});

            chart.append("defs")
                .append("marker")
                .attr({id:'cap', orient:'auto', markerWidth:'0.6', markerHeight:'1', refX:'0.6', refY:'0.5'})
                .append("path")
                .attr("d", "M 0, 0.02 V 0.98 M 0.3 0.02 V 0.98 M 0.6 0.02 V 0.98");

            return chart;
        },

        drawGrid: function(chart, width, height) {
            var vgl = [], hgl = [];

            for(var x=10; x<width; x += 10) vgl.push(x);
            for(var y=10; y<height; y += 10) hgl.push(y);

            var grid = chart.append("g")
                .attr("class", "grid");

            grid.append("rect")
                .attr({width: width, height: height});

            grid.append("g").selectAll("line")
                .data(vgl)
                .enter().append("line")
                .attr({x1: id, x2: id, y1: 0, y2: height});

            grid.append("g").selectAll("line")
                .data(hgl)
                .enter().append("line")
                .attr({x1: 0, x2: width, y1: id, y2: id});

            return grid;
        },
        drawKnot: function(chart, paths) {
            var duration = 10000;

            var knot = chart.append("g")
                .attr("class", "knot");

            var section = knot.selectAll("g")
                .data(paths)
                .enter().append("g");

            function animate(path) {
                path.attr("d", function(d) { return d.s; })
                    .transition()
                    .delay(function(d) { return d.t/paths.length*duration; })
                    .duration(duration/paths.length).ease("linear")
                    .each("start", function() { d3.select(this).attr("marker-end", "url(#cap)"); })
                    .each("end", function(d) { if(!d.e) d3.select(this).attr("marker-end", null); })
                    .attrTween("d", function(d) { return function(t) { return d.s + d.f(t); }; });
            }

//            section.append("path")
//                .attr("class", "rope-shadow")
//                .attr("d", function(d) { return d.s + d.f(1); });
            animate(section.append("path").attr("class", "rope-back"));
            animate(section.append("path").attr("class", "rope-front"));

            return knot;
        },

        interpolate: {
            ArcA: function(cx, cy, r, a) {
                return function(t) {
                    var x = (cx - sin(PI*t) * r);
                    var y = (cy - cos(PI*t) * r);
                    return "A"+r+" "+r+","+(t*a)+",0,0,"+x+" "+y;
                }
            },
            ArcC: function(cx, cy, r, a) {
                return function(t) {
                    var x = (cx + sin(PI*t) * r);
                    var y = (cy - cos(PI*t) * r);
                    return "A"+r+" "+r+","+(t*a)+",0,1,"+x+" "+y;
                }
            },
            Cubic: function(x0,y0, x1,y1, x2,y2, x3,y3) {
                function x(t) { return (pow(1-t,3) * x0) + (3 * pow(1-t,2) * t * x1) + (3 * (1-t) * pow(t,2) * x2) + (pow(t,3) * x3); }
                function y(t) { return (pow(1-t,3) * y0) + (3 * pow(1-t,2) * t * y1) + (3 * (1-t) * pow(t,2) * y2) + (pow(t,3) * y3); }
                function dx(t) { return (3 * pow(1-t,2) * (x1 - x0)) + (6 * (1-t) * t * (x2 - x1)) + (3 *pow(t,2) * (x3 - x2)); }
                function dy(t) { return (3 * pow(1-t,2) * (y1 - y0)) + (6 * (1-t) * t * (y2 - y1)) + (3 *pow(t,2) * (y3 - y2)); }

                var l = sqrt(pow(x3-x2,2), pow(y3-y2,2));
                function tx(t) { return x(t) - l * dx(t) / x(t); }
                function ty(t) { return y(t) - l * dy(t) / y(t); }

                return function(t) { return "C "+x1+" "+y1+","+tx(t)+" "+ty(t)+","+x(t)+" "+y(t); };
            },
            Horizontal: function(x0, x1) {
                var xd = x1 - x0;
                return function(t) { return "H" + (x0 + t * xd); }
            },
            Line: function(x0,y0, x1,y1) {
                var xd = x1 - x0, yd = y1 - y0;
                return function(t) { return "L" + (x0 + t * xd) + " " + (y0 + t * yd); }
            },
            Vertical: function(y0, y1) {
                var yd = y1 - y0;
                return function(t) { return "V" + (y0 + t * yd); }
            }
        },
        transform: {
            scale: function(x,y) { y = y || x; return "scale("+x+" "+y+")"; }
        }
    };
}();
