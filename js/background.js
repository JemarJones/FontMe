$(document).ready(function(){
	// Adding FontMe rightclick item
	chrome.contextMenus.create({title: "FontMe", contexts: ["selection"], onclick: function(result){
		//Sending a request to the content script of the current tab asking for the font that was used
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {requested: "usedFont"}, function(response) {
				//Adding the new font to storage if its not already there
				if (localStorage.hasOwnProperty('fmFonts')){
					var existingFonts = JSON.parse(localStorage.fmFonts);
					var duplicate = false;
					for (var i in existingFonts){
						if (response.usedFont == existingFonts[i]){
							duplicate = true;
							break;
						}
					}
					if (!duplicate){
						localStorage.fmFonts = JSON.stringify(existingFonts.concat(response.usedFont));
					}
				} else{
					h1 = "Fonted Fonts";
					localStorage.fmFonts = JSON.stringify([response.usedFont]);
				}
			});
		});
	}});
});