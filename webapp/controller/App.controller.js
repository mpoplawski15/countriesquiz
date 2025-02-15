sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "mpp/countries/model/models"
], (Controller, Model) => {
    "use strict";

    return Controller.extend("mpp.countries.controller.App", {
        onInit() {
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
            Model.init(this);
        }
    });
});