define(["jquery", "pedalDataAccess", "helperMethods"], function ($, pedalDataAccess, helpers) {
    var methods = {};
		
		methods.render = function (pedal) {
				var pedalType = helpers.single(
    		    helpers.where(pedalDataAccess.types, function (type) {
    				    return type.id === pedal.type;
            }));
		
		    return $("<div>", { "class": "single-pedal-data" })
            .text("$" + pedal.price + " - " + pedal.fullName + ' [' + pedalType.name + '] ');
		};
		
		return methods;
});