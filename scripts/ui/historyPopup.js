define([ "_Popup", "textResources", "jquery", "helperMethods", "moment", "changeTypes", "objectTypes", "stringReplacer" ], function ( _Popup, resources, $, helpers, moment, changeTypes, objectTypes, replacer ) {
	"use strict";
	
	var methods = {};
	
	methods.create = function(changeLog, revertTo) {
		function genChangeText(changeType, objName, otherName) {
			switch (changeType) {
				case changeTypes.addBoard: 
					return replacer.replace(resources.change_AddBoard, objName);
					
				case changeTypes.renamedBoard:
					return replacer.replace(resources.change_RenamedBoard, [ otherName, objName ]);
					
				case changeTypes.deleteBoard:
					return replacer.replace(resources.change_DeleteBoard, objName);
					
				case changeTypes.moveBoard:
					return replacer.replace(resources.change_MoveBoard, objName);
					
				case changeTypes.resizeBoard:
					return replacer.replace(resources.change_ResizeBoard, objName);
					
				case changeTypes.addPedal:
					return replacer.replace(resources.change_AddPedal, [ otherName, objName ]);
					
				case changeTypes.removedPedal:
					return replacer.replace(resources.change_RemovedPedal, [ otherName, objName ]);
					
				case changeTypes.movePedalToTop:
					return replacer.replace(resources.change_MovePedalToTop, [ otherName, objName ]);
					
				case changeTypes.movePedalUp:
					return replacer.replace(resources.change_MovePedalUp, [ otherName, objName ]);
					
				case changeTypes.movePedalToBottom:
					return replacer.replace(resources.change_MovePedalToBottom, [ otherName, objName ]);
					
				case changeTypes.movePedalDown:
					return replacer.replace(resources.change_MovePedalDown, [ otherName, objName ]);
					
				case changeTypes.clearedBoard:
					return replacer.replace(resources.change_ClearedBoard, objName);
					
				default:
					throw new TypeError("@changeType is invalid, was: " + changeType);
			}
		}
	
		/* set up the user language for the moment library */
		moment.locale(window.navigator.userLanguage || window.navigator.language)
	
		var content = $("<div>", { "class": "history-popup" })
		
		/* store all of the moment update intervals here so that we can kill them on close */
		var momentUpdateIntervals = [];
		
		function renderChange(change, isTopLevel) {
			var changeDiv = $("<div>");
			
			var description = $("<div>", { "class": "description" })
				.appendTo(changeDiv);
				
			if (isTopLevel) {
				description
					.addClass("top-level")
					.click(function () {
						revertTo(change.id);
					});
			}
						
			if (change.isBatch) {
				/* The text is the provided description */
				description.text(change.description)
				
				/* So we can lazily render batch changes we need, but not multiple times */
				var renderedSubChanges = false;
				
				var expander = $("<i>", { "class": "float-left fa fa-plus-square" });
				
				expander.add(description)
					.click(function () {
						changeDiv.toggleClass("expanded");
						expander.toggleClass("fa-plus-square")
							.toggleClass("fa-minus-square");
							
						/* Lazily render sub changes */
						if (!renderedSubChanges) {
							helpers.forEach(change.changes, function (subChange) {
								changeDiv.append(renderChange(subChange));
							});
							
							renderedSubChanges = true;
						}
					});
				
				changeDiv.prepend(expander)
					.addClass("batch");
			}
			else {
				/* Generate the resource for this change based */
				description.text(genChangeText(change.changeType, change.objName, change.otherName));
			
				changeDiv.addClass("change");
				
				var timeStamp = $("<div>", { "class": "time-stamp" })
					.text(new moment(change.timeStamp).fromNow())
					.appendTo(changeDiv);
				
				momentUpdateIntervals.push(setInterval(function () { /* every minute, refresh the "from now" */
					timeStamp.text(new moment(change.timeStamp).fromNow());
				}, 60000)); /*60,000ms = 1min*/
			}
			
			return changeDiv;
		}
		
		function appendChange(change) {
			content.append(renderChange(change, true));
		}
		
		helpers.forEach(changeLog, appendChange);
		
		function init(popup) {
			popup.el.appendTo(document.body)
				.addClass("history-popup-outer")
				.draggable({ 
					handle: ".header",
				});
		}
		
		function close(popup) {
			helpers.forEach(momentUpdateIntervals, function (interval) {
				clearInterval(interval);
			});
		}
		
		var popup = _Popup.create(content, {
			title: resources.historyPopupTitle,
			id: "history",
			init: init,
			close: close,
		});
		
		return {
			popup: popup,
			addChange: appendChange,
		}
	};
	
	return methods;
});