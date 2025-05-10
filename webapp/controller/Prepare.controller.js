sap.ui.define([
	"mpp/countries/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"mpp/countries/utils/ValidationManager",
	"mpp/countries/model/models"
], (BaseController, History, MessageToast, ValidationManager, Model) => {
	"use strict";

	return BaseController.extend("mpp.countries.controller.Prepare", {
		onInit() {
			ValidationManager.init(this);
			// this.setViewModel();
			this.getRouter().getRoute("prepare").attachPatternMatched(this.onObjectMatched, this);
		},

		onObjectMatched(oEvent) {
			Model.setRegionPlayConfig(0);
			Model.setDifficultyPlayConfig(0);
			Model.setModePlayCapitals(true);
			Model.setModePlayFlags(false);
			Model.setLengthPlayConfig(0);
			this.getView().getModel().refresh();
		},

		handleNavBack() {
			this.navTo("overview", {}, true);
		},

		handlePlay() {
			if (ValidationManager.checkModes()) {
				let oPlayConfig = Model.getPlayConfiguration();
				oPlayConfig.iSelectedRegionIndex = oPlayConfig.iSelectedRegionIndex + 1;
				this.navTo("play", {
					playConfiguration: window.encodeURIComponent(JSON.stringify(oPlayConfig))
				}
					, true);
			} else {
				MessageToast.show(this.getText("noModeErrorMsg"), { duration: 1500 })
			}
		},
	});
});