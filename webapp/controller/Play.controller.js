sap.ui.define([
    "mpp/countries/controller/BaseController",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "mpp/countries/model/models",
    "sap/ui/core/IntervalTrigger",
    "../model/DataService"
], (BaseController, History, MessageToast, JSONModel, Model, IntervalTrigger, DataService) => {
    "use strict";

    return BaseController.extend("mpp.countries.controller.Prepare", {
        onInit() {
            this.setViewModel();
            this.getRouter().getRoute("play").attachPatternMatched(this.onObjectMatched, this);
            this.getView().addEventDelegate({
                onBeforeHide: function (oEvent) {
                },

                onAfterHide: function (oEvent) {
                    this.stopScoreCounter();
                }
            }, this)
        },

        onObjectMatched(oEvent) {
            var sPlayConfiguration = oEvent.getParameter("arguments").playConfiguration;
            var sDecodedPlayConfiguration = window.decodeURIComponent(sPlayConfiguration);
            var oPlayConfiguration = JSON.parse(sDecodedPlayConfiguration);
            Model.setPlayConfiguration(oPlayConfiguration);
            Model.clearButtons();
            this.clearInputField();
            this.buildQuestionsModel();
        },

        handleNavBack() {
            this.navTo("prepare", {}, true);
        },

        buildQuestionsModel() {
            Model.clearCounter();
            var aCountriesData = [],
                aPossibleAnswers = [];
            var sLanguage = sap.ui.getCore().getConfiguration().getLanguage().substring(0, 2);
            var aCountriesRawData = this.getCountriesRawData(Model.getPlayConfiguration().iSelectedRegionIndex);
            this.setQuestionsLimit(Model.getPlayConfiguration().iSelectedLengthIndex, aCountriesRawData.length);
            this.setDifficulty(Model.getPlayConfiguration().iSelectedDifficultyIndex);

            aCountriesRawData.forEach(oCountry => {
                var sFlagPath = oCountry.flag;
                switch (sLanguage) {
                    case "pl":
                        var sCountryName = oCountry.pl.country;
                        var sCapital = oCountry.pl.capital;
                        break;
                    case "en":
                        var sCountryName = oCountry.en.country;
                        var sCapital = oCountry.en.capital;
                        break;
                    default:
                        var sCountryName = oCountry.en.country;
                        var sCapital = oCountry.en.capital;
                };
                aCountriesData.push({ id: oCountry.id, country: sCountryName, capital: sCapital, flagPath: sFlagPath });
                aPossibleAnswers.push({ country: sCountryName, capital: sCapital })
            });
            Model.setCountriesData(aCountriesData);
            Model.setPossibleAnswers(aPossibleAnswers);
            Model.setStartingScore();
            this.setScoreInvterval();
            this.generateQuestion();
        },

        generateQuestion() {
            Model.fillQuestionModel();
            this.getView().getModel().refresh();
            document.addEventListener("click", () => {
                if (Model.getQuestionAnswered()) {
                    Model.setQuestionAnswered(false);
                    Model.clearButtons();
                    this.clearInputField();
                    if (Model.getQuestionsLimit() > Model.getCurrentQuestionNo()) {
                        this.generateQuestion();
                    } else {
                        this.openSummaryDialog();
                    }

                }
            })
        },

        nextQuestion(oEvent) {
            if (Model.getQuestionAnswered()) {
                Model.setQuestionAnswered(false);
                if (Model.getQuestionsLimit() > Model.getCurrentQuestionNo()) {
                    Model.clearButtons();
                    this.clearInputField();
                    this.generateQuestion();
                } else {
                    this.openSummaryDialog();
                }

            }
        },

        openSummaryDialog() {
            this.promiseSummaryDialog ??= this.loadFragment({
                name: "mpp.countries.view.SummaryDialog"
            });
            this.promiseSummaryDialog.then((oDialog) => {
                this.stopScoreCounter();
                oDialog.open();
                this.getView().byId("idScoreText").setHtmlText("<h3>" + this.getText("textYourScore") + ":" + "</h3>" + "<br/>"
                    + "<h4>" + Model.getScoreAsPercentage() + "% " + this.getText("textRightAnwers") + "</h4>" + "<br/>" + "<br/>"
                    + "<h1>" + Model.getScore() + " " + this.getText("textPoints") + "</h1>" + "<br/>" + "<br/>");
            });
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

        handlePlayAgainDialog() {
            Model.clearCounter();
            Model.clearButtons();
            this.clearInputField();
            this.buildQuestionsModel();
            this.byId("idDialogSummary").close();
        },

        handleGoBackDialog() {
            Model.clearCounter();
            this.navTo("prepare", {}, true);
        },

        handleAnswer(oEvent) {
            Model.setQuestionAnswered(true);
            if (Model.checkIfAnswerCorrect(oEvent.getSource().getText()) === true) {
                oEvent.getSource().setType("Accept");
                Model.addOneToCorrectAnswers();
            } else {
                oEvent.getSource().setType("Reject");
                Model.markCorrectAnswer();
                Model.deductFromScore(100);
            };
        },

        handleAnswerFromInputField() {
            if (!Model.getQuestionAnswered()) {
                Model.setQuestionAnswered(true);
                var oInputField = this.getView().byId("idInputField");
                if (Model.checkIfAnswerCorrect(oInputField.getValue()) === true) {
                    oInputField.addStyleClass("correctAnswer");
                    Model.addOneToCorrectAnswers();
                } else {
                    oInputField.addStyleClass("wrongAnswer");
                    Model.setCorrectAnswerVisible(true);
                    Model.deductFromScore(100);
                }
                this.getView().byId("idOkButton").setEnabled(false);
                this.getView().getModel().refresh();
            } else {
                this.nextQuestion()
            }
        },

        handleSaveScore() {
            DataService.saveData({
                regionId: Model.getPlayConfiguration().iSelectedRegionIndex,  // 1 for Europe, 2 for Asia, 3 for Africa
                playerName: "Player Name",
                score: Model.getScore()
            })
            .then(result => {
                console.log("Score saved:", result);
            })
            .catch(error => {
                console.error("Error saving score:", error);
            });
        },

        clearInputField() {
            var oInputField = this.getView().byId("idInputField");
            oInputField.removeStyleClass("correctAnswer");
            oInputField.removeStyleClass("wrongAnswer");
            oInputField.setValue("");
            Model.setCorrectAnswerVisible(false);
            this.getView().byId("idOkButton").setEnabled(true);
        },

        setScoreInvterval() {
            var that = this;
            this.oIntervalTrigger = new IntervalTrigger(100);
            this.oIntervalTrigger.addListener(() => {
                Model.deductFromScore(1);
                that.getView().getModel().refresh();
            });

        },

        stopScoreCounter() {
            if (this.oIntervalTrigger) {
                this.oIntervalTrigger.destroy();
            }
        },

        getCountriesRawData(iSelectedRegionIndex) {
            var aCountriesRawData;
            switch (iSelectedRegionIndex) {
                case 0:
                    aCountriesRawData = this.getOwnerComponent().getModel("countriesEurope").getData()
                    break;
                case 1:
                    aCountriesRawData = this.getOwnerComponent().getModel("countriesAsia").getData()
                    break;
                case 4:
                    aCountriesRawData = this.getOwnerComponent().getModel("countriesAfrica").getData()
                    break;
                default:
                    aCountriesRawData = this.getOwnerComponent().getModel("countriesEurope").getData();
            }
            return aCountriesRawData;
        },

        setQuestionsLimit(iSelectedLengthIndex, iMaxNoOfCountries) {
            switch (iSelectedLengthIndex) {
                case 0:
                    Model.setQuestionsLimit(10);
                    break;
                case 1:
                    Model.setQuestionsLimit(20);
                    break;
                case 2:
                    Model.setQuestionsLimit(50);
                    break;
                case 3:
                    Model.setQuestionsLimit(iMaxNoOfCountries);
                    break;
            }
            if (iMaxNoOfCountries < Model.getQuestionsLimit()) {
                Model.setQuestionsLimit(iMaxNoOfCountries);
            }
        },

        setDifficulty(iSelectedDifficultyIndex) {
            Model.resetAnswersVisibility();
            switch (iSelectedDifficultyIndex) {
                case 0:
                    Model.setABCDButtonsVisible();
                    Model.setScoreMultiplier(1);
                    break;
                case 1:
                    Model.setABCDEFGHButtonsVisible();
                    Model.setScoreMultiplier(1.2);
                    break;
                case 2:
                    Model.setInputFieldVisible();
                    Model.setScoreMultiplier(1.4);
                    break;
            }
        }


    });
});