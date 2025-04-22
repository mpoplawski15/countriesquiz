sap.ui.define([
    "mpp/countries/controller/BaseController",
    "mpp/countries/model/models",
    "../model/DataService",
    "sap/m/MessageToast"  
], (BaseController, Model, DataService, MessageToast) => {
    "use strict";

    return BaseController.extend("mpp.countries.controller.MainMenu", {
        onInit() {
            DataService.init();
            this.setViewModel();
        },

        handlePlay() {
            this.navTo("prepare", {});
        },

        handleOpenSettingsDialog() {
            this.promiseDialog ??= this.loadFragment({
                name: "mpp.countries.view.SettingsDialog"
            });
            this.promiseDialog.then((oDialog) => {
                oDialog.open();
            });
        },

        handleCloseSettingsDialog() {
            this.byId("idRBGSettings").setSelectedIndex(Model.getSelectedLanguageIndex());
            this.byId("idDialogSettings").close();
            Model.resetTempSelectedLanguageIndex();
        },

        handleConfirmSettingsDialog() {
            Model.setLanguage();
            this.byId("idDialogSettings").close();
        },

        handleOpenRankingDialog() {
            var that = this;
            this.promiseRankingDialog ??= this.loadFragment({
                type: "XML",
                name: "mpp.countries.view.RankingDialog"
            });
            this.promiseRankingDialog.then((oDialog) => {
                DataService.fetchRankingData().then(data => {
                    Model.setRankingRecords(data.oData);
                    that.getView().getModel().refresh();
                    var oModel = new sap.ui.model.json.JSONModel(Model.getData());
                    oDialog.setModel(oModel);
                    oDialog.open();
                })
            });
            
            
        },

        handleCloseRankingDialog(){
            this.byId("idDialogRanking").close();
        },

        handleOpenHelpDialog() {
            MessageToast.show("Help dialog opened. Work in progress");
        },

        handleLanguageChange(oEvent) {
            var iSelectedIndex = oEvent.getSource().getSelectedIndex();
            Model.setTempSelectedLanguageIndex(iSelectedIndex);
        },

    });
});