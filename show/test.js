

var sections;
var current_section;

function build(){
    console.log("OHAI!");

    sections = $("#pres section");
    console.log(sections);
    sections.hide();
    sections.eq(0).show()

    current_section = 0;
}


document.onkeydown = function(e){
    console.log(e);
    sections.eq(current_section).hide();
    if (e.keyCode == 39){ // right
	current_section = Math.min(sections.length-1,current_section+1);
    }
    if (e.keyCode == 37){ // left
	current_section = Math.max(0,current_section-1);
    }
    if (e.keyCode == 36){ // home
	current_section = 0;
    }
    if (e.keyCode == 35){ // end
	current_section = sections.length-1;
    }
    sections.eq(current_section).show();
};
