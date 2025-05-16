sap.ui.define([
    "mpp/countries/controller/BaseController",
    "mpp/countries/model/models",
    "../model/DataService",
    "sap/m/MessageToast",
    "../model/AuthService",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], (BaseController, Model, DataService, MessageToast, AuthService, MessageBox, Fragment, JSONModel) => {
    "use strict";

    return BaseController.extend("mpp.countries.controller.MainMenu", {
        onInit() {
            DataService.init();
            AuthService.init();

            // Initialize email verification model
            this.oEmailVerificationModel = new JSONModel({
                email: ""
            });
            this.getView().setModel(this.oEmailVerificationModel, "emailVerification");

            jQuery.sap.delayedCall(1, this, function () {
                this.checkLoginStatus();
            });
        },

        checkLoginStatus: function () {
            if (AuthService.isLoggedIn()) {
                var oUser = AuthService.getCurrentUser();
                if (oUser && oUser.username) {
                    Model.setUsername(oUser.username);
                }
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
                            text: "{i18n>viewProfile}",
                            icon: "sap-icon://person-placeholder",
                            press: this.handleViewProfile.bind(this)
                        }),
                        new sap.m.Button({
                            text: "{i18n>logOut}",
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
            AuthService.logout();
            Model.clearUser();
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
                if (AuthService.isRememberMeEnabled()) {
                    var oRegisterData = Model.getData().oRegister;
                    oRegisterData.rememberMe = true;
                    Model.updateModel();
                }

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

            AuthService.login(sUsername, sPassword, bRememberMe)
                .then(response => {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("Login successful!");
                    Model.setUsername(sUsername);
                    this.oLoginDialog.close();
                })
                .catch(error => {
                    sap.ui.core.BusyIndicator.hide();

                    // Check if this is an email verification error
                    if (error && error.emailVerification) {
                        this.oLoginDialog.close();
                        this.oEmailVerificationModel.setProperty("/email", error.email);
                        this.openEmailVerificationDialog();
                        return;
                    }


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
                    this.oLoginDialog.close();

                    MessageBox.success("Registration successful! Please check your email to verify your account.", {
                        onClose: function () {
                            // Set verification email for the dialog
                            this.oEmailVerificationModel.setProperty("/email", sEmail);
                            // this.openEmailVerificationDialog();

                            // Set the remember me flag to true after registration for better UX
                            var oRegisterData = Model.getData().oRegister;
                            oRegisterData.rememberMe = true;
                            // Switch to login view
                            Model.setIsLogin(true);
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

        // Email verification dialog methods
        openEmailVerificationDialog: function () {
            var oView = this.getView();

            if (!this.oEmailVerificationDialog) {
                // Load the fragment asynchronously
                Fragment.load({
                    id: oView.getId(),
                    name: "mpp.countries.view.EmailVerificationDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    this.oEmailVerificationDialog = oDialog;
                    this.oEmailVerificationDialog.open();
                }.bind(this));
            } else {
                this.oEmailVerificationDialog.open();
            }
        },

        onCloseVerificationDialog: function () {
            this.oEmailVerificationDialog.close();
        },

        onResendVerificationPress: function () {
            const oResourceBundle = this.getResourceBundle();
            const email = this.oEmailVerificationModel.getProperty("/email");

            if (!email) {
                MessageToast.show(oResourceBundle.getText("emailAddressMissing"));
                return;
            }

            sap.ui.core.BusyIndicator.show(0);

            AuthService.resendVerificationEmail(email)
                .then(response => {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show(oResourceBundle.getText("emailSentSuccess", [email]));
                })
                .catch(error => {
                    sap.ui.core.BusyIndicator.hide();

                    let errorMessage = oResourceBundle.getText("resendFailedGeneric");

                    // Handle rate limit error with more user-friendly message
                    if (error && error.status === 429) {
                        try {
                            if (error.retryAfter) {
                                // Format the waiting time in a user-friendly way
                                let waitTime;
                                const seconds = error.retryAfter;

                                if (seconds < 60) {
                                    waitTime = seconds + " " + oResourceBundle.getText("seconds");
                                } else {
                                    const minutes = Math.ceil(seconds / 60);
                                    if (minutes > 1) {
                                        waitTime = minutes + " " + oResourceBundle.getText("minutes");
                                    } else {
                                        waitTime = minutes + " " + oResourceBundle.getText("minute")
                                    }
                                }
                                errorMessage = oResourceBundle.getText("rateLimitExceeded", [waitTime]);
                            }
                        } catch (e) {
                            // Use default error message if parsing fails
                        }
                    } else if (error && error.error) {
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