define(["_Popup", "addPedalPopup", "_OptionMenu", "jquery", "helperMethods", "textResources", "pedalRenderer", "jquery-ui"], function (_Popup, addPedalPopup, _OptionMenu, $, helpers, resources, pedalRenderer) {
		var methods = {};
		
		/*Make sure the window nextNewPedalBoardIdoardId value is setup*/
		if (window && !window.nextNewPedalBoardId)
			 window.nextNewPedalBoardId = 1;
		
		/*Params: (for callbacks: note the dom is auto-updated)
		 *  @title: The inital title for the pedal board
		 *  @appendTo: the main dom object to append and limit this board to.
		 *  @callbacks: object with callback functions
		 *      Params:
		 *          @addPedal: 
		 *		    	    Params: @pedal: the new pedal object
		 *          @deletePedal: 
		 *			         Params: @pedal: the deleted pedal object
		 *          @deleteBoard: 
		 *               Params: @board: the _Popup pedalboard dom object deleted.
		 *          @rename:
		 *               Params: @name:  the new name of the board.
		 *                       @board: the _Popup pedalboard dom object renamed.
		 *          @clear: 
		 *		        	 Params: @board: the _Popup pedalboard dom object cleared.
		 */
		methods.create =  function (title, appendTo, callbacks) {
			 if (!callbacks) { callbacks = {}; }
		
			 var content = $("<div>", { "class": "pedal-board" });
		
			 var menuButton = $('<svg class="float-right menu-icon" version="1.1" x="0px" y="0px" viewBox="0 0 70.627 62.27" enable-background="new 0 0 70.627 62.27" xml:space="preserve">' + 
			 		  "<g>" +
	 		 		 			 "<rect width='70.627' height='12.669'/>" +
								 "<rect y='24.8' width='70.627' height='12.67'/>" + 
	               "<rect y='49.601' width='70.627' height='12.669'/>" + 
			  	  "</g>" +
			 "</svg>");
					 
	 		 var popup = _Popup.create(content, {
					  renameable: true,
						rename: callbacks.rename,
					  resizable: true,
						moveable: true,
						//TODO: movecontain: methods.toAppendTo,
						id: "pedal-board-" + window.nextNewPedalBoardId++,
						title: title,
						header: menuButton,
						init: init
			 });
			 
			 /*Make the pedals sortable*/
			 content.sortable({
			     containment: ".output-box",
					 axis: "y"
			 });
			 
			 var allPedals = [];			 
			 function addPedalToBoard(pedal) {
			 		 var newPedal = pedalRenderer.render(pedal)
					 		 .appendTo(content);
					 
					 allPedals.push(newPedal);
					 
			 		 /*Call back!*/
					 if (callbacks.addPedal)
			 		 		callbacks.addPedal(pedal);
							
					unflip();
			 }
			 
			 function unflip(flipIfNeeded) {
			  	if (menuButton[0].classList.contains("flipped"))
			 		    menuButton[0].classList.remove("flipped");
			    
			    else if (flipIfNeeded)
			 		    menuButton[0].classList.add("flipped");
			 };
			 
			 var optionsMenu;
			 
			 menuButton.click(function () {			 
          unflip(true);
					
					if (optionsMenu) {
					    optionsMenu.remove();
							optionsMenu = undefined;
							return;
					}
					
					var deleteLink = $("<div>")
					    .text(resources.deletePedalBoard)
  					  .click(function () {
                  if (!confirm(resources.singleBoardDeleteConfirm))
                      return;
							
                  if(callbacks.deleteBoard)
  					          callbacks.deleteBoard(popup);
								  
                  popup.el.remove();
  					  });
						
				  var addPedal = $("<div>")
					    .text(resources.addPedalToBoard)
							.click(function () {
							    addPedalPopup.create(menuButton, popup.options.id, addPedalToBoard, unflip);
							});
							
					var clearLink = $("<div>")
							.text(resources.clearPedalsFromBoard)
							.click(function () {
							    if (!confirm(resources.clearPedalsFromBoardConfirm))
									    return;
											
									helpers.forEach(allPedals, function (pedal) {
  					          pedal.remove();
  			          });
									
                  if (callbacks.clear)
									    callbacks.clear();
					    });
					
					optionsMenu = _OptionMenu.create(addPedal.add(clearLink).add(deleteLink), menuButton);
					
			    $(document).one("click", function () {
					    if (optionsMenu) {
							    unflip();
                  optionsMenu = undefined;
							}
					});
			 });
			 
			 function init(popup) {
  			 	popup.el.appendTo(appendTo);
			 }
							 
			 /*return the popup*/
			 return popup;
		};
		
		return methods;
});
