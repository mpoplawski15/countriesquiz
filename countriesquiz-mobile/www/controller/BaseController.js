sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "mpp/countries/model/models",
    "sap/ui/Device"
], function (Controller, JSONModel, Models, Device) {
    return Controller.extend("mpp.countries.contoller.BaseController", {
        setViewModel(){
            this.getView().setModel(new JSONModel(Models.getData()));
            this.getView().getModel().setSizeLimit(10000);
        },

        getRouter(){
            return this.getOwnerComponent().getRouter();
        },

        navTo(sName, oParameters){
            this.getRouter().navTo(sName, oParameters, !Device.system.phone);
        },

        getResourceBundle(){
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        getText(sText){
            return this.getResourceBundle().getText(sText);
        }
    }
    );
});