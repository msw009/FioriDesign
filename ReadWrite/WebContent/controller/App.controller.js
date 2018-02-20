sap.ui.define([
	"readwrite/controller/BaseController",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/json/JSONModel",
	"sap/ui/table/Column",
	"sap/ui/unified/Currency",
	"sap/m/Text",
	"sap/ui/model/type/String"
], function (BaseController, ODataModel, JSONModel, Column, Currency, Text, String) {
	"use strict";
	
	return BaseController.extend("readwrite.controller.App", {
		
		onInit : function () {			

			//SET DATA MODEL. 
			var oView = this.getView();
			var oDataModel = new ODataModel("/sap/opu/odata/sap/Z_SFLIGHT_MSW_SRV_SRV/");
			oDataModel.getMetaModel().loaded().then(function(){
				oView.setModel(oDataModel.getMetaModel(), "meta");
			});
			oView.setModel(oDataModel);

			//FILL the table with data. 
			var oTable = oView.byId("table");
			var oBinding = oTable.getBinding("rows");
			var oBusyIndicator = oTable.getNoData();//BUSY IND
			
			oBinding.attachDataRequested(function(){
				oTable.setNoData(oBusyIndicator);
			});
			oBinding.attachDataReceived(function(){
				oTable.setNoData(null); //Use default again ("No Data" in case no data is available)
			});
		},

		
		//Dynamically build the column headers
		columnFactory : function(sId, oContext) {
			var oModel = this.getView().getModel();
			var sName = oContext.getProperty("name");
			var sType = oContext.getProperty("type");
			var sSemantics = oContext.getProperty("sap:semantics");
			var bVisible = oContext.getProperty("sap:visible") != "false";
			var iLen = oContext.getProperty("maxLength");
			var sColumnWidth = "5rem";

			function specialTemplate() {
				var sUnit = oContext.getProperty("sap:unit");
				if (sUnit) {
					var sUnitType = oModel.getMetaModel().getMetaContext("/SFLIGHT/" + sUnit).getProperty()["sap:semantics"];
					if (sUnitType == "currency-code") {
						return new Currency({value: {path: sName, type: new String()}});
					}
				}
				return null;
			}

			iLen = iLen ? parseInt(iLen, 10) : 10;

			if (iLen > 50) {
				sColumnWidth = "15rem";
			} else if (iLen > 9) {
				sColumnWidth = "10rem";
			}

			return new Column(sId, {
				visible: bVisible && sSemantics != "currency-code",
				sortProperty: oContext.getProperty("sap:sortable") == "true" ? sName : null,
				filterProperty: oContext.getProperty("sap:filterable") == "true" ? sName : null,
				width: sColumnWidth,
				label: new sap.m.Label({text: "{/#Sflight/" + sName + "/@sap:label}"}),
				hAlign: sType && sType.indexOf("Decimal") >= 0 ? "End" : "Begin",
				template: specialTemplate() || new Text({text: {path: sName}})
			});
		},
		
		onClickRow: function(oEvent) {
			//Read the index selected, then grab the data at the position of the index. 
			//Dynamic to the layout of the table
			var index = oEvent.getParameter('rowIndex');
		    var oTable = this.getView().byId("table"); 
		    var context = oTable.getContextByIndex(index);
		    var path = context.sPath;
		    var object = oTable.getModel().getProperty(path);
     
			this.getView().byId('carrid').setValue(object.Carrid);
			this.getView().byId('connid').setValue(object.Connid);
		}
		
		
		
	});
});