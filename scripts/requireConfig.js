requirejs.config({
	baseUrl: "scripts",
	paths: {
			/* Libraries */
			"domReady":                      "lib/domReady",
			"jquery":                        "lib/jquery",
			"jquery-ui":                     "lib/jquery-ui",
			"Chart":                         "lib/Chart",
			"moment":                        "lib/moment",
			
			/* Core */
			"helperMethods":                 "core/helperMethods",
			"textResources":				 "core/textResources",
			"stringReplacer":                "core/stringReplacer",
			
			/* UI Core */
			"_Popup":                        "ui-core/Popup",
			"_OptionMenu":                   "ui-core/OptionMenu",
			
			/* UI */
			"addPedalMenu":                  "ui/addPedalMenu",
			"mainPageMenuHandler":           "ui/mainPageMenuHandler",
			"pedalboardPopup":               "ui/pedalboardPopup",
			"pedalboardPopupOptionsHandler": "ui/pedalboardPopupOptionsHandler",
			"pedalRenderer":                 "ui/pedalRenderer",
			"historyPopup":                  "ui/historyPopup",
			"reportTypeMenu":                "ui/reportTypeMenu",
			"compareToMenu":                 "ui/compareToMenu", 
			"priceRenderer":                 "ui/priceRenderer",
			
			/* Data */
			"pedalBoardClasses":             "data/pedalBoardClasses",
			"pedalBoardStorage":             "data/pedalBoardStorage",
			"pedalDataAccess":               "data/pedalDataAccess",
			"pedalsGetter":                  "data/pedalsGetter",
			"changeLogger":                  "data/changeLogger",
			"changeTypes":                   "data/changeInfo",
			"batchTypes":                    "data/changeInfo",
			"objectTypes":                   "data/changeInfo",
			
			/* Data Classes */
			"PedalBoardManager":             "data/PedalBoardManager",
			"StateReverter":                 "data/StateReverter",
			"UndoHandler":                   "data/UndoHandler",
			
			/* Reporting */
			"reportTypes":                   "reporting/reportTypes",
			"reporter":                      "reporting/reporter",
			"boardDiffEngine":               "reporting/boardDiffEngine",
			"colorEffects":                  "reporting/colorEffects",
	},
	config: {
		moment: {
			noGlobal: true
        }
	}
});

require([ "jquery" ], function ($) {
    $.noConflict();
});