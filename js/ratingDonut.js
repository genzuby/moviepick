function ratingChart(rating, svgObj, type) {
  var width = 100,
    height = 100;

  var outerRadius = width / 2;
  var innerRadius = 30;

  var pie = d3.layout.pie().value(function(d) {
    return d;
  });

  var endAng = function(d) {
    return (d / 100) * Math.PI * 2;
  };

  var bgArc = d3.svg
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .startAngle(0)
    .endAngle(Math.PI * 2);

  var conerRad = 0;
  type === "HEADER" ? (conerRad = 15) : 0;
  var dataArc = d3.svg
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .cornerRadius(conerRad)
    .startAngle(0);

  var data = rating;

  var svg = d3
    .select(svgObj)
    .append("svg:svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 100 100")
    .classed("svg-content", true);

  var path = svg
    .selectAll("g")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  path
    .append("path")
    .attr("d", bgArc)
    .style("stroke-width", 5)
    .attr("fill", "rgba(255,255,255,0.2)");

  path
    .append("path")
    .attr("fill", "#fa7000")
    .transition()
    .ease("ease-in-out")
    .duration(750)
    .attrTween("d", arcTween);

  path
    .append("text")
    .attr("fill", "#000")
    .attr("class", "ratingtext")
    .attr("tex-anchor", "middle")
    .attr("x", -15)
    .attr("y", 9)
    .text(data)
    .attr("fill", "#fff")
    .transition()
    .duration(800);

  function arcTween(d) {
    var interpolate = d3.interpolate(d.startAngle, endAng(d.data));
    return function(t) {
      d.endAngle = interpolate(t);
      return dataArc(d);
    };
  }
}
