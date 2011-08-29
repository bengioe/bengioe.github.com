
var site = new (function (){
        /* ==X== goes <h3>...
           double newline goes <br/>
           *X* goes italic
           [link] goes <a h=link>link</a>
           [link text] goes <a h=link>text</a>
         */
        function process(i,e){
            $(e).html($(e).html().replace(/==(.+)==/g,"<h3>$1</h3><p>").
                   replace(/\n\n/g,"<p/><p>").
                   replace(/\_([\S]+)\_/g,"<b>$1</b>").
                   replace(/\*([\S]+)\*/g,"<i>$1</i>").
                   replace(/\[([\S]+)\]/g,'<a href="$1">$1</a>').
                   replace(/\[([\S]+)(.+)\]/g,'<a href="$1">$2</a>').
                   replace(/\{([\S]+)(.+)\}/g,'<a href="$1" class="internal_link">$2</a>')
                   );
        }
        function activateClick(i,e){
            $(e).click(function(){
                    $(".bodypart").hide(0);
                    $($(this).attr("href")).show(0);
                });
        }
	this.init = function (){
	    //$("#menu").html("OK!")
	    $(".bodypart").hide(0);
	    $("#home").show(0);
            $(".bodypart").each(process);
            $(".menulink > a").each(activateClick);
            $(".internal_link").each(activateClick);
	};
    })();