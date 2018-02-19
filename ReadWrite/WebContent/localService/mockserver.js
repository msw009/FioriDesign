sap.ui.define([
	"sap/ui/core/util/MockServer"
], function(MockServer) {
	"use strict";
	return {
		/**
		 * Initializes the mock server.
		 * You can configure the delay with the URL parameter "serverDelay".
		 * The local mock data in this folder is returned instead of the real data for testing.
		 * @public
		 */
		init: function() {
			// create
			var oMockServer = new MockServer({
				rootUri: "/sap/opu/odata/sap/Z_SFLIGHT_MSW_SRV_SRV/"
			});

			// simulate against the metadata and mock data
			var sPath = jQuery.sap.getModulePath("readwrite.localService");
			oMockServer.simulate(sPath + "/metadata.xml", sPath + "/mockdata");
						
			// start
			oMockServer.start();
			jQuery.sap.log.info("Running the app with mock data");
		},
		
		onExit : function () {
			this.oMockServer.destroy();
			this.oMockServer = null;
			MockServer.config({autoRespondAfter: 0});
		}
	};
});