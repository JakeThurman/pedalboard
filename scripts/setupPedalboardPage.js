require(["PedalBoardManager", "historyPopup", "upgrader", "tutorial", "defaults", "jquery", "mainPageMenuHandler", "pedalBoardStorage", "StateReverter", "UndoHandler", "ChangeLogger", "batchTypes", "objectTypes", "domReady!"], 
function (PedalBoardManager, historyPopup, upgrader, tutorial, defaults, $, mainPageMenuHandler, pedalBoardStorage, StateReverter, UndoHandler, ChangeLogger, batchTypes, objectTypes) {
    "use strict";
	
	/* Before we do anything else start the upgrade */
	upgrader.upgrade();
	
	/* DOM variables */
   	var mainContentContainer = $("#content-container");
   	var pageMenuButton       = $("#page-main-menu");
	var historyParentNode    = document.body;
	var tutorialInfo = {
		parent:  document.body,
		content: $("#tutorial-content")
			.remove()
			.removeClass("display-none"),
	};
	
	/* Reload from last save */
	var lastSaveData = pedalBoardStorage.Load();
	
	/* Data variables */
	var logger       = new ChangeLogger();
	var manager      = new PedalBoardManager(logger, mainContentContainer);
	var reverter     = new StateReverter(manager, logger, tutorialInfo, historyParentNode);
	
	/* Try to restore. Do this so we can continue even if there is an error. */
	try {
		/* Restore save data */	
		/* Temporarily disable calling back async for the restore calls so we can avoid errors like the redo stack getting cleared */
		logger.CALLBACK_ASYNC = false;
		reverter.replay(lastSaveData.history || defaults.changes); /* If there was no history load the default */
		logger.CALLBACK_ASYNC = true;
	}
	catch (e) {
		/* Log the error, we still need to know this! */
		console.error(e);
	}
	
	/* Setup the undo handler AFTER replay to avoid clearing the redo stack */
	var undoer   = new UndoHandler(reverter, logger, lastSaveData.undo);
	
	/* This is the first load */
	if (!lastSaveData.history) {
		logger.batch(batchTypes.firstLoad, objectTypes.pedalboard, function () {
			manager.Import(defaults.boards);
		});
	}
	
	/* Save on change */
	logger.addCallback(/* @waitForBatchCompletion: */ false, function () {
		pedalBoardStorage.Save(logger.changes, undoer.getUndoneStack());
	});
	
	function openHistory() {
		historyPopup.create(logger, historyParentNode);
	}
	function openTutorial() {
		tutorial.create(logger, tutorialInfo);
	}
	
	/* Setup the main page menu click handler */
   	pageMenuButton.click(function () {
   	    mainPageMenuHandler.handle(manager, undoer, openTutorial, openHistory);
    });
	
	/* Setup ctrl+z undo/ctrl+y redo handler*/
	var zKey = 90, yKey = 89;
	
	$(document).keydown(function(e) {
		if (!e.ctrlKey)
			return;
		switch (e.keyCode) {
			case zKey:
				if (undoer.canUndo()) 
					undoer.undo();
				return false;
				
			case yKey:
				if (undoer.canRedo()) 
					undoer.redo();
				return false;
		}
	});
});
