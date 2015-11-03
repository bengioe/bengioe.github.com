

d3.selection.prototype.first = function() {
  return d3.select(this[0][0]);
};
d3.selection.prototype.last = function() {
  var last = this.size() - 1;
  return d3.select(this[0][last]);
};


var sections;
var current_section;
var current_graph = undefined;

function build(){

    sections = $("#pres section");
    sections.hide();
    sections.eq(0).show()

    current_section = 0;
    if (location.hash){
        gotoSlide(Number(location.hash.replace('#','')));
    }else{
        gotoSlide(0);
    }
}

function gotoSlide(s){
    if (s == current_section) return;
    sections.eq(current_section).hide();
    current_section = s;

    var onenter = sections.eq(current_section)[0].getAttribute("onenter");
    if (onenter !== null){
        eval(onenter)(sections.eq(current_section)[0]);
    }

    sections.eq(current_section).show();
    location.hash = "#"+current_section;
}

function ttt_random(s){
    console.log("trand",s.graphs);
    for (var k=0;k<s.graphs.length;k++){
        var g = s.graphs[k];
        var w = $(window).width();
        var h = $(window).height();
        console.log(g);

        for (var i=0;i<g.nodes.length;i++){
            //g.nodes[i].x =400; w*0.5+5*Math.random();
            //g.nodes[i].y =400; h*0.5+5*Math.random();
            g.nodes[i].px = g.nodes[i].x;
            g.nodes[i].py = g.nodes[i].y;
            g.nodes[i].x += 55*(2*Math.random()-1);
            g.nodes[i].y += 55*(2*Math.random()-1);
            //g.nodes[i].px = g.nodes[i].x;
            //g.nodes[i].py = g.nodes[i].y;
        }
        g.force.start();
    }

}

function ttt_previous(s){
    if (current_graph === undefined){
        current_graph = s;
        return;
    }
    var w = $(window).width();
    var h = $(window).height();

    for (var i=0;i<s.nodes.length;i++){
        for (var j=0;j<s.nodes.length;j++){
            if (j in current_graph.nodes && current_graph.nodes[j].label == s.nodes[i].label){
                s.nodes[i].px = s.nodes[i].x = current_graph.nodes[j].x;
                s.nodes[i].py = s.nodes[i].y = current_graph.nodes[j].y;
                break;
            }
        }
    }
    s.force.alpha(0.025);
    current_graph = s;
}

function nextSlide(){
    var anim = d3.select(sections[current_section]).selectAll(".animate-enter");
    if (anim[0].length == 0){
        gotoSlide(Math.min(sections.length-1,current_section+1));
    }else{
        anim.first()
            .classed("animate-enter",false)
            .classed("animated", true)
            .transition()
            .duration(500)
            .style("opacity",1)
    }
}

function prevSlide(){
    var anim = d3.select(sections[current_section]).selectAll(".animated");
    if (anim[0].length == 0){
        gotoSlide(Math.max(0,current_section-1));
    }else{
        anim.last()
            .classed("animated", false)
            .classed("animate-enter",true)
            .style("opacity",0)
    }
}


document.onkeydown = function(e){
    console.log(e.keyCode);
    if (e.keyCode >=35 && e.keyCode <=40){
        if (e.keyCode == 39) // right
            nextSlide();
        if (e.keyCode == 37) // left
            prevSlide()
        if (e.keyCode == 40) // up
            nextSlide();
        if (e.keyCode == 38) // down
            prevSlide();
        if (e.keyCode == 36) // home
            gotoSlide(0);
        if (e.keyCode == 35) // end
            gotoSlide(sections.length-1);
    }
    if (e.keyCode == 82) // r
        ttt_random(sections[current_section]);
};

var touchStart = [0,0]

document.addEventListener('touchstart', function(e){
    touchStart = [e.changedTouches[0].pageX,
                  e.changedTouches[0].pageY];
});
document.addEventListener('touchend', function(e){
    var touchEnd = [e.changedTouches[0].pageX,
                    e.changedTouches[0].pageY];
    console.log("touchEnd",touchEnd,touchStart);
    if (touchEnd[0] - touchStart[0] > 150){
        document.onkeydown({keyCode:37});
    }
    else if (touchEnd[0] - touchStart[0] < -150){
        document.onkeydown({keyCode:39});
    }
});


function DAG(nodes, links, invisible_links, centerpos,centeredNode){
    var w = $(window).width();
    var h = $(window).height();
    var radius = 30;
    force = d3.layout.force();

    function nsplit(x){
        if (x.length==2){return x;}
        return x.split(":");
    }

    var _links = links;
    if (typeof links === 'string' && links.length > 0)
        _links = links.split(",").map(nsplit);
    if (typeof invisible_links === 'string' && invisible_links.length > 0)
        invisible_links = invisible_links.split(",").map(nsplit);
    var indexes = {};
    for (var i=0;i<nodes.length;i++){
        indexes[nodes[i].label] = i;
    }
    links = [];
    for (var i=0;i<_links.length;i++){
        links.push({source:indexes[_links[i][0]],target:indexes[_links[i][1]]});
    }
    console.log("links",links);
    var section = document.currentScript.parentElement;
    section.graphs = (section.graphs || new Array());
    section.graphs.push({nodes:nodes,links:links});
    section.nodes = nodes;
    section.links = links;


    var svg = d3.select(section).append("svg")
        .attr("class", "background_graph")
        .attr("width", w)
        .attr("height", h);

    var ah_id = 'arrowhead'+Math.random();

    svg.append('defs').append('marker')
        .attr({
            id: ah_id,
            refX: radius,
            refY: 4,
            markerUnits: 'strokeWidth',
            markerWidth: 10,
            markerHeight: 8,
            orient: 'auto'
        }).append('path').attr({
            d: 'M 0 0 L 10 4 L 0 8 Z',
            fill: 'blue'
        });

    var arrows = svg.selectAll("line")
        .data(links).enter()
        .append("line")
        .attr("marker-end", "url(#"+ah_id+")")
        //.attr("class", "foobar_circle")

    console.log("ilinks",invisible_links);
    for (var i=0;i<invisible_links.length;i++){
        links.push({source:indexes[invisible_links[i][0]],
                    target:indexes[invisible_links[i][1]]});
    }

    var circles = svg.selectAll("ellipse")
        .data(nodes).enter()
        .append("ellipse")
        .attr("fill", function(d){if (d.color === undefined){return "#a2a";} return d.color;})
        .attr("ry", radius)
        .attr("rx", function(d){if (d.radius === undefined){return radius;} return d.radius;})
        .call(force.drag)
        .on("mousedown", function() { d3.event.stopPropagation(); });


    var text = svg.selectAll("text")
        .data(nodes).enter()
        .append("text")
        .attr("dy", "0.33em")
        .attr("text-anchor","middle")
        .text(function(d){return d.label;})
        .call(force.drag)
        .on("mousedown", function() { d3.event.stopPropagation(); });

    function centerx(p,alpha){
        if (!p.x) return;
        if (p.label == centeredNode){
            p.x = centerpos[0] * w;
            p.y = centerpos[1] * h; return;
        }
        p.x = p.x + (centerpos[0]*w-p.x) * 0.25*alpha;
        p.y = p.y + (centerpos[1]*h-p.y) * 0.25*alpha;
    }

    force
        .size([w,h])
        .nodes(nodes)
        .links(links)
        .linkDistance(150)
        .linkStrength(1)
        .gravity(0)
        .charge(-4000)
        .on('tick', function(e){
            circles.each(function (d){centerx(d,e.alpha);})
                .attr('cx', function(d){return Math.min(w,Math.max(d.x,0));})
                .attr('cy', function(d){return Math.min(h,Math.max(d.y,0));});
            text.attr('x', function(d){return Math.min(w,Math.max(d.x,0));})
                .attr('y', function(d){return Math.min(h,Math.max(d.y,0))});
            arrows.attr('x1', function(d){return d.source.x;})
                .attr('x2', function(d){return d.target.x;})
                .attr('y1', function(d){return d.source.y;})
                .attr('y2', function(d){return d.target.y;});
            //console.log(nodes[0]);
        })

    force.start();
    section.force = force;
}


function groupLinksGraph(graph){

    var section = document.currentScript.parentElement;
    section.graphs = (section.graphs || new Array());
    section.graphs.push(graph);

    var width = 400, height = 400;

    var color = d3.scale.category20();

    var force = d3.layout.force()
	.charge(-120)
	.linkDistance(30)
	.size([width, height]);

    var svg = d3.select(section).append("svg")
	.attr("width", width)
	.attr("height", height);

    force
	.nodes(graph.nodes)
	.links(graph.links)
	.start();

    var link = svg.selectAll(".link")
	.data(graph.links)
	.enter().append("line")
	.attr("class", "link")
	.style("stroke-width", function(d) { return Math.sqrt(d.value); });

    var node = svg.selectAll(".node")
	.data(graph.nodes)
	.enter().append("circle")
	.attr("class", "node")
	.attr("r", 5)
	.style("fill", function(d) { return color(d.group); })
	.call(force.drag);

    //node.append("title")
    //	.text(function(d) { return d.name; });

    force.on("tick", function() {
	link.attr("x1", function(d) { return d.source.x; })
	    .attr("y1", function(d) { return d.source.y; })
	    .attr("x2", function(d) { return d.target.x; })
	    .attr("y2", function(d) { return d.target.y; });

	node.attr("cx", function(d) { return d.x; })
	    .attr("cy", function(d) { return d.y; });
    });
    section.force = force;
    graph.force = force;
}

//setInterval(function(){location.reload();}, 1000)
