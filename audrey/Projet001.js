//Changement du texte (div) pour générer une insulte

function newpage1(){
	var img = document.getElementById("maxime")
	img.style.display = "inline"
	insultemaxime ()
}
function insultemaxime () {
	var textDiv = document.getElementById("monInsulte")
	var hiddenMaxime = document.getElementById ("frontpage")
	hiddenMaxime.style.display = "none"
	insulte1 = ["un fucking", "le plus useless", "un caca de", "un osti de", "un espèce de", "un maudit", "un petit", "un tas de", 
	"un amateur de", "un bidule pour", "un verre à moitié plein de", "un satané"]
	insulte3 = ["citrouille", "patate", "lama", "lépreux", "mouette", "chimpanzé", "moufette"]
	var insulteIntermediaire = " " + insulte3 [Math.floor(Math.random()*insulte3.length)]
	insulte2 = ["joueur de poker", "nain", "troglodyte", "poney miniature", "weakling intolérant au lactose", "arriéré mental aux yeux bleus", "cunt", "reject", "yogourt moisi", "déchet", "marde", "patapouf", 
	"vomi de" + insulteIntermediaire, "jus de" + insulteIntermediaire, "pet", "fish", "compteur de grain de maïs", "twat", "sphincter de" + insulteIntermediaire, 
	"débile", "retard", "noob", "weakling", "rat d'égoût", "contenant à" + insulteIntermediaire, "tabarnak de" + insulteIntermediaire ]	
	textDiv.innerHTML = "Tu es" + "<br>" + insulte1 [Math.floor(Math.random()*insulte1.length)]+ " " + insulte2 [Math.floor(Math.random()*insulte2.length)] + "<br>" + "!!! " + "<br>" + "&nbsp;"
}
function newpage2(){
	var img = document.getElementById("patrick")
	img.style.display = "inline"
	insultepatrick()
}
function insultepatrick(){
	var textDiv = document.getElementById("monInsulte")
	var hiddenPatrick = document.getElementById ("frontpage")
	hiddenPatrick.style.display = "none"
	insulte1 = ["le pire", "un fucking", "le plus useless", "un caca de", "un osti de", "un espèce de", "un maudit", "un petit", 
	"un amateur de", "un verre à moitié plein de", "un satané", "le pire", "le pire", "le pire", "le pire", "le pire"]
	insulte3 = ["citrouille", "patate", "lama", "lépreux", "mouette", "chimpanzé", "moufette"]
	var insulteIntermediaire = " " + insulte3 [Math.floor(Math.random()*insulte3.length)]
	insulte2 = ["starfish","cycliste", "chou-fleur", "tueur de plantes", "coloc", "gros obèse morbide",  "criss d'asthmatique", "cunt", "reject", "yogourt moisi", "déchet", "tas de marde", "patapouf", 
	"vomi de" + insulteIntermediaire, "jus de" + insulteIntermediaire, "pet", "fish", "compteur de grain de maïs", "twat", "sphincter de" + insulteIntermediaire, 
	"débile", "retard", "noob", "weakling", "rat d'égoût", "contenant à" + insulteIntermediaire, "tabarnak de" + insulteIntermediaire, "poil de" + insulteIntermediaire]
	textDiv.innerHTML = "Tu es" + "<br>" + insulte1 [Math.floor(Math.random()*insulte1.length)]+ " " + insulte2 [Math.floor(Math.random()*insulte2.length)] + "<br>" + "!!! " + "<br>" + "&nbsp;"
}