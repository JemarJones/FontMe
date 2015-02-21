var elem;//Used to store the rightclicked element
$(document).ready( function(){
	//Thanks to the adblock creators for the following workaround
	//for the lack of the ability to access the DOM with a contextmenu 
	// in the extensions API
	// Record the last element to be right-clicked
	var fontFam = null;
	$("body").bind("contextmenu", function() {
		fontFam = $(elem).css('font-family');
	}).click(function() {
		fontFam = null;
	});
	//Responding to request for the used font
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (request.requested == "usedFont"){
				//Here we put all the possible fonts in an array and check if
				//theyre available on this page using the checkfont API
				//If they're available we conclude that's the one thats being used.
				var possibleFonts = fontFam.split(",");
				for (var font in possibleFonts){
					var currFont = possibleFonts[font];
					if (checkfont(currFont)){
						currFont = currFont.replace(/["']/g, "").toLowerCase().capitalize();//Making quotes and capitilization uniform
						//Sending a response to the background script and displaying an overlay with the font
						sendResponse({usedFont: currFont});
						createOverlay(currFont);
						break;
					}
				}
			}
		});
	//Creates an overlay that displays the used font
	var createOverlay = function(font){
		var overlay = $('<div></div>');
		overlay.attr('id','fmOverlay');
		overlay.append($('<h1 id="fmTitle"></h1>'));
		overlay.append($('<h2 id="fmFont"></h2>'));
		$('body').prepend(overlay);
		$('#fmTitle').css({"font-family": "arial", "font-size": "35px", "color": "black", "text-decoration": "none"});
		$('fmFont').css({"font-family": font, "color": "black", "background-color": "white", "text-decoration": "none"});
		$('#fmTitle').text('Fonted!');
		$('#fmFont').text(font);
		$('#fmOverlay').slideDown("fast");
	};
	//Dismissing the overlay when the user clicks anywhere
	$('body').on('click',function(){
		$('#fmOverlay').slideUp("fast", function(){
			$(this).remove();
		});
	});
});
//Adding capitilization function to the string prototype
String.prototype.capitalize = function(){
       return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
};
//Adding a listener that captures the element we're hovering over.
//We then refer to this once a right click has taken place.
//A little excessive yes, but no other solution worked.
var captureElement = function(e) {
	elem = document.elementFromPoint(e.clientX, e.clientY);
};
window.addEventListener('mousemove', captureElement, true);
