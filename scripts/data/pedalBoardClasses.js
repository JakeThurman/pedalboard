define([ "helperMethods" ], function (helpers) {
	"use strict";

	var classes = {};

	classes.PedalBoard = function (name, pedals) {
		this.Name = name;
	 
        var thisBoard = this;
        if (!pedals) pedals = [];
  			this.pedals = pedals;
    
		this.Add = function(pedal) {
			thisBoard.pedals.push(pedal);
		};
				
		this.Remove = function(index){
			if (index < 0 || (index + 1) > thisBoard.pedals.length)
				throw new Error("Index is outside of the bounds of the pedals array: " + index);
			
			var pedalToRemove = thisBoard.pedals[index];
			
			var i = 0;
			/* We can't use the delete keyword because it leaves a messy undefined in the array. */			
			thisBoard.pedals = helpers.where(thisBoard.pedals, function () {
				return i++ !== index;
			});
			
			return pedalToRemove;
		};
		
		/* moves the pedal at @oldPedalIndex to @newPedalIndex in this boards pedal array */
		this.Reorder = function(oldPedalIndex, newPedalIndex) {
			/* Validate Input */
			if (oldPedalIndex < 0 || newPedalIndex < 0)
				throw new Error("Indexes cannot be negative! Old: " + oldPedalIndex + " New: " + newPedalIndex);
			if (thisBoard.pedals.length <= oldPedalIndex || thisBoard.pedals.length <= newPedalIndex)
				throw new Error("Pedal index out of bounds. There are " + thisBoard.pedals.length + " pedals on the board. " + oldPedalIndex + " and/or " + newPedalIndex + " were invalid");
			
			/* the pedal to move */
			var movePedal = thisBoard.pedals[oldPedalIndex];
			
			if (oldPedalIndex === newPedalIndex)
				return movePedal; /* putting it in the same place requires no change. */
			
			var moveUp = oldPedalIndex > newPedalIndex;
			var smallerIndex = moveUp
				? newPedalIndex
				: oldPedalIndex;
				
			/* No need to loop through the first part since we'll just copy it straight */
			var orderedPedals = thisBoard.pedals.slice(0, smallerIndex);
			
			/* loop through the rest to find the pedal that we need to move and move it */
			for (var i = smallerIndex; i < thisBoard.pedals.length; i++) {
				/* for move up we add this first */
				if (moveUp && i === newPedalIndex)
					orderedPedals.push(movePedal);
				
				if (i !== oldPedalIndex)
					orderedPedals.push(thisBoard.pedals[i]);
				
				/* for move down we add this after */
				if (!moveUp && i === newPedalIndex)
					orderedPedals.push(movePedal);
			}
			thisBoard.pedals = orderedPedals;
			
			return movePedal;
		};
	};
		
	function getPedals(pedalContainerData){
		var pedals = [];
		helpers.forEach(pedalContainerData.pedals, function (pedalData) {
			var pedal;
			
			/* Create a pedal of correct class */
			if (pedalData.identifier === 2)/* Is a pedal */
				pedal = new classes.Pedal(pedalData);
			else if (pedalData.identifier === 1) {/* This is a pedal line */
				pedalData.fullName = (pedalContainerData.fullName || pedalContainerData.name) + " " + pedalData.name;
				pedal = new classes.PedalLine(pedalData);
			}
			else /* OH NO! This is a pedal brand! */
				throw "Nothing may contain pedal brands. They are the top level. Failed on container id = " + pedalContainerData.id;
			
			/* 
			 * Prepend the container name to the full name & display name.
			 * This will be the name as full name but without the brand name. 
			 */
			if (pedalContainerData.identifier === 1) /* only add to the display name from lines */
				pedal.displayName = (pedalContainerData.displayName || pedalContainerData.name) + " " + (pedal.displayName || pedal.name);
			
			pedal.fullName = (pedalContainerData.fullName || pedalContainerData.name) + " " + pedal.fullName;
			
			/* add the pedal */
			pedals.push(pedal);
		});
		return pedals;
	}
		
	/* Same as a PedalBrand, but can be contained by a brand. */
	classes.PedalLine = function (pedalLineData) {
		for (var key in pedalLineData) {
			if (key === "pedals")
				this[key] = getPedals(pedalLineData);
			else
				this[key] = pedalLineData[key];
		}
	};
		
	classes.PedalBrand = function(pedalBrandData) {
		for (var key in pedalBrandData) {
			if (key === "pedals")
				this[key] = getPedals(pedalBrandData);
			else
				this[key] = pedalBrandData[key];
		}
	};
		
	classes.Pedal = function(pedalData) {
		for (var key in pedalData)
			this[key] = pedalData[key];
		
		/* This will be appended to by parent containers */
		this.fullName = this.name;
	};
	
	classes.PedalType = function(pedalTypeData) {
		this.name = pedalTypeData.name;
		this.id = pedalTypeData.id;
	};

	return classes;
});