

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
    var w = $(window).width();
    var h = $(window).height();

    for (var i=0;i<s.nodes.length;i++){
        s.nodes[i].x =400; w*0.5+5*Math.random();
        s.nodes[i].y =400; h*0.5+5*Math.random();
        s.nodes[i].px = s.nodes[i].py = 0;
    }
    s.force.start();
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


document.onkeydown = function(e){
    if (e.keyCode >=35 && e.keyCode <=39){
        if (e.keyCode == 39) // right
            gotoSlide(Math.min(sections.length-1,current_section+1));
        if (e.keyCode == 37) // left
            gotoSlide(Math.max(0,current_section-1));
        if (e.keyCode == 36) // home
            gotoSlide(0);
        if (e.keyCode == 35) // end
            gotoSlide(sections.length-1);
    }
};


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

//setInterval(function(){location.reload();}, 5000)
