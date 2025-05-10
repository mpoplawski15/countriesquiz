sap.ui.define([
    "mpp/countries/controller/BaseController",
    "mpp/countries/model/models",
    "../model/DataService",
    "sap/m/MessageToast",
    "../model/AuthService",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
], (BaseController, Model, DataService, MessageToast, AuthService, MessageBox, Fragment) => {
    "use strict";

    return BaseController.extend("mpp.countries.controller.MainMenu", {
        onInit() {
            DataService.init();

            jQuery.sap.delayedCall(1, this, function() {
                this.checkLoginStatus();
              });
        },

        checkLoginStatus: function () {
            var sToken = localStorage.getItem("authToken");
            var sUsername;
            if(localStorage.getItem("user")){
                sUsername = JSON.parse(localStorage.getItem("user")).username;
            }

            if (sToken && sUsername) {
                Model.setUsername(sUsername);
            }
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
                    oDialog.open();
                })
            });
        },

        handleLoginPress: function () {
            if (this.getView().getModel().getData().oUser.loggedIn) {
                this.openUserMenu();
            } else {
                this.openLoginDialog();
            }
        },

        openUserMenu() {
            var oButton = this.byId("loginButton");

            if (!this.oActionSheet) {
                this.oActionSheet = new sap.m.ActionSheet({
                    title: "User Menu",
                    buttons: [
                        new sap.m.Button({
                            text: "View Profile",
                            icon: "sap-icon://person-placeholder",
                            press: this.handleViewProfile.bind(this)
                        }),
                        new sap.m.Button({
                            text: "Log Out",
                            icon: "sap-icon://log-out",
                            press: this.handleLogout.bind(this)
                        })
                    ]
                });
                this.getView().addDependent(this.oActionSheet);
            }
            this.oActionSheet.openBy(oButton);
        },

        handleViewProfile: function () {
            // Implement profile view navigation or dialog
            sap.m.MessageToast.show("Profile view would open here");
        },

        handleLogout: function () {
            // Clear user data and token
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");

            Model.clearUser();

            var oModel = new sap.ui.model.json.JSONModel(Model.getData());
            this.getView().setModel(oModel);

            this.getView().getModel().refresh();
            sap.m.MessageToast.show("Successfully logged out");
        },

        openLoginDialog() {
            var oView = this.getView();

            if (!this.oLoginDialog) {
                // Load the fragment asynchronously
                Fragment.load({
                    id: oView.getId(),
                    name: "mpp.countries.view.RegisterLoginDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    this.oLoginDialog = oDialog;
                    this.oLoginDialog.open();
                }.bind(this));
            } else {
                this.oLoginDialog.open();
            }
        },

        onSubmitPress: function () {
            if (Model.getIsLogin()) {
                this.handleLogin();
            } else {
                this.handleRegistration();
            }
        },

        onForgotPasswordPress: function () {
            sap.m.MessageToast.show("Password recovery functionality would be triggered here");
        },

        onCancelPress: function () {
            this.oLoginDialog.close();
        },

        handleLogin: function () {
            var oRegisterData = Model.getData().oRegister;

            var sUsername = oRegisterData.username;
            var sPassword = oRegisterData.password;
            var bRememberMe = oRegisterData.rememberMe;

            // Validate inputs
            if (!sUsername || !sPassword) {
                sap.m.MessageToast.show("Please enter both username and password");
                return;
            }

            sap.ui.core.BusyIndicator.show(0);

            AuthService.login(sUsername, sPassword)
                .then(response => {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("Login successful!");
                    Model.setUsername(sUsername);
                    this.oLoginDialog.close();
                })
                .catch(error => {
                    sap.ui.core.BusyIndicator.hide();

                    let errorMessage = "Login failed";
                    if (error && error.error) {
                        errorMessage = error.error;
                    }

                    MessageBox.error(errorMessage);
                });
        },

        handleRegistration: function () {
            var oRegisterData = Model.getData().oRegister;
            var sUsername = oRegisterData.username;
            var sPassword = oRegisterData.password;
            var sEmail = oRegisterData.email;
            var sConfirmPassword = oRegisterData.confirmPassword;
            var bTermsAccepted = oRegisterData.termsAccepted;

            // Validate inputs
            if (!sUsername || !sPassword || !sEmail || !sConfirmPassword) {
                sap.m.MessageToast.show("Please fill in all required fields");
                return;
            }

            if (sPassword !== sConfirmPassword) {
                sap.m.MessageToast.show("Passwords do not match");
                return;
            }

            if (!bTermsAccepted) {
                sap.m.MessageToast.show("Please accept the Terms and Conditions");
                return;
            }

            // Email validation using regex
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(sEmail)) {
                sap.m.MessageToast.show("Please enter a valid email address");
                return;
            }

            sap.ui.core.BusyIndicator.show(0);

            AuthService.register(sUsername, sEmail, sPassword)
                .then(response => {
                    sap.ui.core.BusyIndicator.hide();
                    MessageBox.success("Registration successful! Please log in.", {
                        onClose: function () {
                            this.oLoginDialog.close();
                        }.bind(this)
                    });
                })
                .catch(error => {
                    sap.ui.core.BusyIndicator.hide();

                    let errorMessage = "Registration failed";
                    if (error && error.error) {
                        errorMessage = error.error;
                    }

                    MessageBox.error(errorMessage);
                });
        },


        handleToggleLoginRegister() {
            if (Model.getIsLogin()) {
                Model.setIsLogin(false);
            } else {
                Model.setIsLogin(true);
            }
        },

        handleCloseRankingDialog() {
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