$(document).ready(function(){
	var background = chrome.extension.getBackgroundPage();
	//Code to update popup.html ul with fmFonts from 
	if (localStorage.hasOwnProperty('fmFonts')){
		var fmFonts = JSON.parse(localStorage.fmFonts);
		for (var i = 0; i < fmFonts.length; ++i){
			$('#fontsUl').append('<li>' + fmFonts[i] + '</li>');
		}
	}
});