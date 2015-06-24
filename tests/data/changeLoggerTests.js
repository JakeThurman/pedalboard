define([ "changeLogger" ], function ( changeLogger ) {	
	describe("data/changeLogger.js", function () {
		var logger;
		
		beforeEach(function () {
			logger = changeLogger.create();
		});
		
	    describe("log", function () {
		    it("should log changes", function () {
				logger.log("a change was made");
				expect(logger.changes.length).toEqual(1);
			});
			
			it("should throw an exception if no description is provided", function () {
				var thrower = function () {
					logger.log();
				};
				expect(thrower).toThrow();
			});
		});
		
		describe("batch", function () {
			it("should log changes all into one batch", function () {
				logger.batch("a test change", function () {
					logger.log("a change was made");
					logger.log("another change was made");					
				});
				expect(logger.changes.length).toEqual(1);
				expect(logger.changes[0].changes.length).toEqual(2);
			});
			
			it("should be able to handle batches and changes at the same level", function () {
				logger.batch("a test change", function () {
					logger.log("a change was made");
					logger.log("another change was made");					
				});
				logger.log("top level change");
				
				expect(logger.changes.length).toEqual(2);
				expect(logger.changes[0].changes.length).toEqual(2);
			});
			
			it("should log changes into sub batches", function () {
				logger.batch("top batch", function () {
					logger.batch("a test change", function () {
						logger.log("a change was made");
						logger.log("another change was made");					
					});
					logger.log("logged changes in a batch");
				});
				
				expect(logger.changes.length).toEqual(1);
				expect(logger.changes[0].changes.length).toEqual(2);
				expect(logger.changes[0].changes[0].changes.length).toEqual(2);
			});
			
			it("should not throw an exception if no batch name is provided", function () {
				var hit = false;
				var notThrower = function () {
					logger.batch(function () {
						logger.log("something");
						hit = true;
					});
				};
				expect(notThrower).not.toThrow();
				expect(hit).toBe(true);
			});
			
			it("should do nothing if no function is provided", function () {
				expect(logger.batch("name")).toBeUndefined();
			});
		});
		
		describe("dontLog", function () {
		    it("should ignore all changes logged inside of a dontLog function", function () {
				logger.dontLog(function () {
					logger.batch("a test change", function () {
						logger.log("a change was made");
						logger.log("another change was made");					
					});
					
					logger.log("an outside the batch change was made");
				});
				expect(logger.changes.length).toEqual(0);
			});
			
			it("should throw an exception if func is not a function", function () {
				var thrower = function () {
					logger.dontLog('');
				};
				expect(thrower).toThrow();
			});
			
			it("should throw an exception if func is not passed in", function () {
				var thrower = function () {
					logger.dontLog();
				};
				expect(thrower).toThrow();
			});
		});
		
		describe("create", function () {
		    it("should throw an exception if @initialChanges is not an array", function () {
				var thrower = function () {
					changeLogger.create("");
				};
				expect(thrower).toThrow();
			});
		});
	});
});