define(["helperMethods", "stateReverter"], function (helpers, stateReverter) {
	"use strict";
	
	var actions = {};
	
	/*
	 * Creates a handler for undo/redo events
	 *
	 * @manager: pedalBoardManager instance to act onLine
	 * @logger:  The logger for the manager.
	 */
	actions.create = function (manager, logger) {
		var methods = {};
		var undoneStack = [];
		var undoInProgress = false;
		
		/* For every manager change, reset the stack of undone changes */
		logger.addCallback(function () {
			if (!undoInProgress)
				undoneStack = [];
		});
	
		/*
		 * Undoes the most recent change
		 */
		methods.undo = function () {
			/* Grab the change to undo */
			var change = logger.changes.pop();
			
			/* If there is no change to undo, do nothing */
			if (!change) 
				return;
			
			/* Revert the change */
			undoInProgress = true;
			logger.dontLog(function () {
				stateReverter.revert(change, manager);
			});
			undoInProgress = false;
			
			/* Record the change as undo in case of the case of redo */
			undoneStack.push(change);
		};
		
		/*
		 * Redoes the most recent undo
		 */
		methods.redo = function () {
			/* If there's nothing to do, do nothing */
			if (!undoneStack.length)
				return;
			
			/* Replay the change */
			undoInProgress = true;
			stateReverter.replay(undoneStack.pop(), manager, logger);
			undoInProgress = false;
		};
		
		/* Returns a boolean. True if there are any undoneStack changes (that can be redone) */
		methods.canRedo = function () {
			return !!undoneStack.length; /* !!casts to boolean */
		};
		
		/* Returns a boolean. True if there are any changes (that can be undone) */
		methods.canUndo = function () {
			return !!logger.changes.length; /* !!casts to boolean */
		};
		
		return methods;
	};
	
	return actions;
});