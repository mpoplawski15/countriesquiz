sap.ui.define([
    "mpp/countries/model/models",
], function (Models) {
    return {
        init(oContent) {
            this.oContent = oContent;
        },

        checkModes() {
            var bValidationPositive = true;
            if ((this.oContent.getView().byId("idCheckboxCapitals").getSelected() === false)
                && (this.oContent.getView().byId("idCheckboxFlags").getSelected() === false)) bValidationPositive = false;
            return bValidationPositive;
        }
    }
})