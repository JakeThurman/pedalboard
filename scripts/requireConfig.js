requirejs.config({
		baseUrl: "scripts",
		paths: {
				/* Libraries */
		    "jquery":                        "lib/jquery",
				"jquery-ui":                     "lib/jquery-ui",
				
				/* Core */
				"helperMethods":                 "core/helperMethods",
				"textResources":								 "core/textResources",
				
				/* UI Core */
				"_Popup":                        "ui-core/_Popup",
				"_SavePopup":                    "ui-core/_SavePopup",
				"_OptionMenu":                  "ui-core/_OptionMenu",
				
				/* UI */
				"addPedalPopup":                 "ui/addPedalPopup",
				"mainPageMenuHandler":           "ui/mainPageMenuHandler",
				"pedalboardPopup":               "ui/pedalboardPopup",
				"pedalboardPopupOptionsHandler": "ui/pedalboardPopupOptionsHandler",
				"pedalRenderer":                 "ui/pedalRenderer",
				
				/* Data */
				"pedalBoardClasses":             "data/pedalBoardClasses",
				"pedalBoardManager":             "data/pedalBoardManager",
				"pedalBoardStorage":             "data/pedalBoardStorage",
				"pedalDataAccess":               "data/pedalDataAccess",
				"pedalsGetter":                  "data/pedalsGetter",
		},
});

require(["jquery", "setupPedalboardPage"], function ($, setupPedalboardPage) {
    //No non-amd $ dependencies! yay
    $.noConflict();
		
		setupPedalboardPage.setup();
});