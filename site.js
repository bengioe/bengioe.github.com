
var site = new (function (){
    /* ==X== goes <h3>...
       double newline goes <br/>
       *X* goes italic
       [link] goes <a h=link>link</a>
       [link text] goes <a h=link>text</a>
    */
    function eprocess(html){
        return html.replace(/==(.+)==/g,"<h3>$1</h3><p>").
            replace(/\n\n/g,"<p/><p>").
            replace(/\_([\S]+)\_/g,"<b>$1</b>").
            replace(/\*([\S]+)\*/g,"<i>$1</i>").
            replace(/\[([\S]+)\]/g,'<a href="$1">$1</a>').
            replace(/\[([\S]+)(.+)\]/g,'<a href="$1">$2</a>').
            replace(/\{([\S]+)(.+)\}/g,'<a href="$1" class="internal_link">$2</a>');
    }
    function process(i,e){
        $(e).html(eprocess($(e).html()));
    }
    function loadBit(rl){
        $("#bitPage").show(0);
        $("#bitPage").html("<center>Loading...</center>");
        $.get(rl, function(data){
            $("#bitPage").html(eprocess(data));
            $("#bitPage .internal_link").each(activateClick);
        },'text');
    }
    function activateClick(i,e){
        $(e).click(function(){
            $(".bodypart").hide(0);
            var rl = $(this).attr("href");
            if (rl.search("#thought-")>=0){
                loadBit(rl.replace("#thought-","thoughts/"));
            }else{
                $(rl).show(0);
            }
        });
    }
    function changeHash(e) {
	$(".bodypart").hide(0);
        var urlbit = window.location.href.split("#").pop();
        if (urlbit==""){
	    $("#home").show(0);
        }if (urlbit.search("thought-")>=0){
	    loadBit(urlbit.replace("thought-","thoughts/"));
        }else{
	    $("#"+urlbit).show(0);
        }
    }
    this.init = function (){
	$(window).bind( 'hashchange', changeHash);
	console.log("OK");
	//$("#menu").html("OK!")
	$(".bodypart").hide(0);
        $(".bodypart").each(process);
	changeHash(0);
        $(".menulink > a").each(activateClick);
        $(".internal_link").each(activateClick);
    };
})();
