sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "mpp/countries/model/models",
    "mpp/countries/model/AuthService",
    "mpp/countries/model/DataService"
], (UIComponent, JSONModel, Device, Model, AuthService, DataService) => {
    "use strict";

    return UIComponent.extend("mpp.countries.Component", {
        metadata: {
            interfaces: ["sap.ui.core.IAsyncContentCreation"],
            manifest: "json"
        },

        init() {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);

            // Initialize services
            AuthService.init();
            DataService.init();

            // add component to the app for native app
            if (window.cordova) {
                window.myAppComponent = this;
            }

            // Create global app model
            const oAppModel = new sap.ui.model.json.JSONModel({
                isLoggedIn: AuthService.isLoggedIn(),
                user: AuthService.getCurrentUser() || {}
            });
            this.setModel(oAppModel, "app");

            // set device model
            const oDeviceModel = new JSONModel(Device);
            oDeviceModel.setDefaultBindingMode("OneWay");
            this.setModel(oDeviceModel, "device");

              // Initialize main local model
              Model.init(this);
              this.setModel(Model.getModel());

            // create the views based on the url/hash
            this.getRouter().initialize();

            // Register for router patterns to handle authentication
            this.getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
        },

        onRouteMatched: function(oEvent) {
            // const routeName = oEvent.getParameter("name");
            // const isLoggedIn = AuthService.isLoggedIn();
            
            // // Define which routes need authentication
            // const protectedRoutes = ["profile", "settings", "addScore"];
            
            // // Public routes - always accessible
            // const publicRoutes = ["login", "register"];
            
            // // Check if the route requires authentication
            // if (protectedRoutes.includes(routeName) && !isLoggedIn) {
            //     // Redirect to login if not authenticated
            //     this.getRouter().navTo("login");
            //     return;
            // }
            
            // // Redirect to home if user is logged in and tries to access login/register
            // if (publicRoutes.includes(routeName) && isLoggedIn) {
            //     this.getRouter().navTo("home");
            //     return;
            // }
            
            // // Update app model
            // const oAppModel = this.getModel("app");
            // oAppModel.setProperty("/isLoggedIn", isLoggedIn);
            // oAppModel.setProperty("/user", AuthService.getCurrentUser() || {});
        },

        getContentDensityClass() {
            return Device.support.touch ? "sapUiSizeCozy" : "sapUiSizeCompact";
        }
    });
});