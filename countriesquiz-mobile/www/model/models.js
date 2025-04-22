sap.ui.define([
    "sap/ui/model/json/JSONModel"
], function (JSONModel) {
    return {
        _aLanguageIndexPairs: [{ language: "en", index: 0 }, { language: "pl", index: 1 }],
        _Data: {},
        init: function () {
            this._Data = {
                oConfig: {
                    selectedLanguageIndex: 0,
                    tempSelectedLanguageIndex: 0,
                },
                oPlayConfig: {
                    iSelectedRegionIndex: 0,
                    iSelectedDifficultyIndex: 0,
                    bCapitals: true,
                    bFlags: false,
                    iSelectedLengthIndex: 0
                },
                oButtonStates: {
                    buttonAState: "Default",
                    buttonBState: "Default",
                    buttonCState: "Default",
                    buttonDState: "Default",
                    buttonEState: "Default",
                    buttonFState: "Default",
                    buttonGState: "Default",
                    buttonHState: "Default",
                    buttonAEnabled: true,
                    buttonBEnabled: true,
                    buttonCEnabled: true,
                    buttonDEnabled: true,
                    buttonEEnabled: true,
                    buttonFEnabled: true,
                    buttonGEnabled: true,
                    buttonHEnabled: true,
                    buttonAVisible: false,
                    buttonBVisible: false,
                    buttonCVisible: false,
                    buttonDVisible: false,
                    buttonEVisible: false,
                    buttonFVisible: false,
                    buttonGVisible: false,
                    buttonHVisible: false
                },
                oAnswerData: {
                    bGraphicQuestion: false,
                    sQuestion: "",
                    correctAnswer: "",
                    buttonAText: "",
                    buttonBText: "",
                    buttonCText: "",
                    buttonDText: "",
                    bQuestionAnswered: false
                },
                oCounter: {
                    iCurrentQuestionNo: 0,
                    iCorrectAnswers: 0,
                    iQuestionsLimit: 0,
                    iScore: 0,
                    fScoreMultiplier: 0
                },
                oInputField: {
                    visible: false,
                    styleClass: "",
                    correctAnswerVisible: true,
                },
                oRanking: {
                    europeTopScores: [],
                    asiaTopScores: [],
                    africaTopScores: []
                },
                aCountriesData: [],
                aPossibleAnswers: [],


            }
            this.defineLanguage();
        },

        setQuestionsLimit(iQuestionsLimit) {
            this._Data.oCounter.iQuestionsLimit = iQuestionsLimit;
        },

        getQuestionsLimit() {
            return this._Data.oCounter.iQuestionsLimit;
        },

        setCurrentQuestionNo(iCurrentQuestionNo) {
            this._Data.oCounter.iCurrentQuestionNo = iCurrentQuestionNo;
        },

        getCurrentQuestionNo() {
            return this._Data.oCounter.iCurrentQuestionNo;
        },

        getData() {
            return this._Data;
        },

        fillQuestionModel() {
            var sObjectKey;
            this._Data.oCounter.iCurrentQuestionNo = this._Data.oCounter.iCurrentQuestionNo + 1;
            var iRandomNo = this.getRndInteger(0, this._Data.aCountriesData.length - 1);
            var oChosenCountry = this._Data.aCountriesData.splice(iRandomNo, 1);
            this._Data.oAnswerData.sQuestion = oChosenCountry[0].country;

            this._Data.oAnswerData.sFlagPath = oChosenCountry[0].flagPath;
            if (this._Data.oPlayConfig.bFlags === true && this._Data.oPlayConfig.bCapitals === true) {
                if (this._Data.oAnswerData.bGraphicQuestion === true) {
                    this._Data.oAnswerData.bGraphicQuestion = false;
                    sObjectKey = 'capital';
                } else {
                    this._Data.oAnswerData.bGraphicQuestion = true;
                    sObjectKey = 'country';
                }
            } else if (this._Data.oPlayConfig.bFlags === true) {
                this._Data.oAnswerData.bGraphicQuestion = true;
                sObjectKey = 'country';
            } else if (this._Data.oPlayConfig.bCapitals === true) {
                this._Data.oAnswerData.bGraphicQuestion = false;
                sObjectKey = 'capital';
            }
            this._Data.oAnswerData.correctAnswer = oChosenCountry[0][sObjectKey];
            if (this._Data.oPlayConfig.iSelectedDifficultyIndex === 1) {
                iRandomNo = this.getRndInteger(0, 7);
            } else {
                iRandomNo = this.getRndInteger(0, 3);
            }
            var aUniqueIndexNo = this.getUniqueArray(0, this._Data.aPossibleAnswers.length - 1, 8);
            for (let i = aUniqueIndexNo.length - 1; i >= 0; i--) {
                if (this._Data.aPossibleAnswers[aUniqueIndexNo[i]][sObjectKey] === oChosenCountry[0][sObjectKey]) {
                    aUniqueIndexNo.splice(i, 1);
                }
            }
            switch (iRandomNo) {
                case 0:
                    this._Data.oAnswerData.buttonAText = oChosenCountry[0][sObjectKey];
                    this._Data.oAnswerData.buttonBText = this._Data.aPossibleAnswers[aUniqueIndexNo[0]][sObjectKey];
                    this._Data.oAnswerData.buttonCText = this._Data.aPossibleAnswers[aUniqueIndexNo[1]][sObjectKey];
                    this._Data.oAnswerData.buttonDText = this._Data.aPossibleAnswers[aUniqueIndexNo[2]][sObjectKey];
                    this._Data.oAnswerData.buttonEText = this._Data.aPossibleAnswers[aUniqueIndexNo[3]][sObjectKey];
                    this._Data.oAnswerData.buttonFText = this._Data.aPossibleAnswers[aUniqueIndexNo[4]][sObjectKey];
                    this._Data.oAnswerData.buttonGText = this._Data.aPossibleAnswers[aUniqueIndexNo[5]][sObjectKey];
                    this._Data.oAnswerData.buttonHText = this._Data.aPossibleAnswers[aUniqueIndexNo[6]][sObjectKey];
                    break;
                case 1:
                    this._Data.oAnswerData.buttonBText = oChosenCountry[0][sObjectKey];
                    this._Data.oAnswerData.buttonCText = this._Data.aPossibleAnswers[aUniqueIndexNo[0]][sObjectKey];
                    this._Data.oAnswerData.buttonDText = this._Data.aPossibleAnswers[aUniqueIndexNo[1]][sObjectKey];
                    this._Data.oAnswerData.buttonEText = this._Data.aPossibleAnswers[aUniqueIndexNo[2]][sObjectKey];
                    this._Data.oAnswerData.buttonFText = this._Data.aPossibleAnswers[aUniqueIndexNo[3]][sObjectKey];
                    this._Data.oAnswerData.buttonGText = this._Data.aPossibleAnswers[aUniqueIndexNo[4]][sObjectKey];
                    this._Data.oAnswerData.buttonHText = this._Data.aPossibleAnswers[aUniqueIndexNo[5]][sObjectKey];
                    this._Data.oAnswerData.buttonAText = this._Data.aPossibleAnswers[aUniqueIndexNo[6]][sObjectKey];
                    break;
                case 2:
                    this._Data.oAnswerData.buttonCText = oChosenCountry[0][sObjectKey];
                    this._Data.oAnswerData.buttonDText = this._Data.aPossibleAnswers[aUniqueIndexNo[0]][sObjectKey];
                    this._Data.oAnswerData.buttonEText = this._Data.aPossibleAnswers[aUniqueIndexNo[1]][sObjectKey];
                    this._Data.oAnswerData.buttonFText = this._Data.aPossibleAnswers[aUniqueIndexNo[2]][sObjectKey];
                    this._Data.oAnswerData.buttonGText = this._Data.aPossibleAnswers[aUniqueIndexNo[3]][sObjectKey];
                    this._Data.oAnswerData.buttonHText = this._Data.aPossibleAnswers[aUniqueIndexNo[4]][sObjectKey];
                    this._Data.oAnswerData.buttonAText = this._Data.aPossibleAnswers[aUniqueIndexNo[5]][sObjectKey];
                    this._Data.oAnswerData.buttonBText = this._Data.aPossibleAnswers[aUniqueIndexNo[6]][sObjectKey];
                    break;
                case 3:
                    this._Data.oAnswerData.buttonDText = oChosenCountry[0][sObjectKey];
                    this._Data.oAnswerData.buttonEText = this._Data.aPossibleAnswers[aUniqueIndexNo[0]][sObjectKey];
                    this._Data.oAnswerData.buttonFText = this._Data.aPossibleAnswers[aUniqueIndexNo[1]][sObjectKey];
                    this._Data.oAnswerData.buttonGText = this._Data.aPossibleAnswers[aUniqueIndexNo[2]][sObjectKey];
                    this._Data.oAnswerData.buttonHText = this._Data.aPossibleAnswers[aUniqueIndexNo[3]][sObjectKey];
                    this._Data.oAnswerData.buttonAText = this._Data.aPossibleAnswers[aUniqueIndexNo[4]][sObjectKey];
                    this._Data.oAnswerData.buttonBText = this._Data.aPossibleAnswers[aUniqueIndexNo[5]][sObjectKey];
                    this._Data.oAnswerData.buttonCText = this._Data.aPossibleAnswers[aUniqueIndexNo[6]][sObjectKey];
                    break;
                case 4:
                    this._Data.oAnswerData.buttonEText = oChosenCountry[0][sObjectKey];
                    this._Data.oAnswerData.buttonFText = this._Data.aPossibleAnswers[aUniqueIndexNo[0]][sObjectKey];
                    this._Data.oAnswerData.buttonGText = this._Data.aPossibleAnswers[aUniqueIndexNo[1]][sObjectKey];
                    this._Data.oAnswerData.buttonHText = this._Data.aPossibleAnswers[aUniqueIndexNo[2]][sObjectKey];
                    this._Data.oAnswerData.buttonAText = this._Data.aPossibleAnswers[aUniqueIndexNo[3]][sObjectKey];
                    this._Data.oAnswerData.buttonBText = this._Data.aPossibleAnswers[aUniqueIndexNo[4]][sObjectKey];
                    this._Data.oAnswerData.buttonCText = this._Data.aPossibleAnswers[aUniqueIndexNo[5]][sObjectKey];
                    this._Data.oAnswerData.buttonDText = this._Data.aPossibleAnswers[aUniqueIndexNo[6]][sObjectKey];
                    break;
                case 5:
                    this._Data.oAnswerData.buttonFText = oChosenCountry[0][sObjectKey];
                    this._Data.oAnswerData.buttonGText = this._Data.aPossibleAnswers[aUniqueIndexNo[0]][sObjectKey];
                    this._Data.oAnswerData.buttonHText = this._Data.aPossibleAnswers[aUniqueIndexNo[1]][sObjectKey];
                    this._Data.oAnswerData.buttonAText = this._Data.aPossibleAnswers[aUniqueIndexNo[2]][sObjectKey];
                    this._Data.oAnswerData.buttonBText = this._Data.aPossibleAnswers[aUniqueIndexNo[3]][sObjectKey];
                    this._Data.oAnswerData.buttonCText = this._Data.aPossibleAnswers[aUniqueIndexNo[4]][sObjectKey];
                    this._Data.oAnswerData.buttonDText = this._Data.aPossibleAnswers[aUniqueIndexNo[5]][sObjectKey];
                    this._Data.oAnswerData.buttonEText = this._Data.aPossibleAnswers[aUniqueIndexNo[6]][sObjectKey];
                    break;
                case 6:
                    this._Data.oAnswerData.buttonGText = oChosenCountry[0][sObjectKey];
                    this._Data.oAnswerData.buttonHText = this._Data.aPossibleAnswers[aUniqueIndexNo[0]][sObjectKey];
                    this._Data.oAnswerData.buttonAText = this._Data.aPossibleAnswers[aUniqueIndexNo[1]][sObjectKey];
                    this._Data.oAnswerData.buttonBText = this._Data.aPossibleAnswers[aUniqueIndexNo[2]][sObjectKey];
                    this._Data.oAnswerData.buttonCText = this._Data.aPossibleAnswers[aUniqueIndexNo[3]][sObjectKey];
                    this._Data.oAnswerData.buttonDText = this._Data.aPossibleAnswers[aUniqueIndexNo[4]][sObjectKey];
                    this._Data.oAnswerData.buttonEText = this._Data.aPossibleAnswers[aUniqueIndexNo[5]][sObjectKey];
                    this._Data.oAnswerData.buttonFText = this._Data.aPossibleAnswers[aUniqueIndexNo[6]][sObjectKey];
                    break;
                case 7:
                    this._Data.oAnswerData.buttonHText = oChosenCountry[0][sObjectKey];
                    this._Data.oAnswerData.buttonAText = this._Data.aPossibleAnswers[aUniqueIndexNo[0]][sObjectKey];
                    this._Data.oAnswerData.buttonBText = this._Data.aPossibleAnswers[aUniqueIndexNo[1]][sObjectKey];
                    this._Data.oAnswerData.buttonCText = this._Data.aPossibleAnswers[aUniqueIndexNo[2]][sObjectKey];
                    this._Data.oAnswerData.buttonDText = this._Data.aPossibleAnswers[aUniqueIndexNo[3]][sObjectKey];
                    this._Data.oAnswerData.buttonEText = this._Data.aPossibleAnswers[aUniqueIndexNo[4]][sObjectKey];
                    this._Data.oAnswerData.buttonFText = this._Data.aPossibleAnswers[aUniqueIndexNo[5]][sObjectKey];
                    this._Data.oAnswerData.buttonGText = this._Data.aPossibleAnswers[aUniqueIndexNo[6]][sObjectKey];
                    break;
            }
        },

        clearCounter() {
            this._Data.oCounter.iCurrentQuestionNo = 0;
            this._Data.oCounter.iCorrectAnswers = 0;
            this._Data.oCounter.iScore = 0;
            this._Data.oCounter.fScoreMultiplier = 0;

        },

        setScoreMultiplier(fScoreMultiplier) {
            this._Data.oCounter.fScoreMultiplier = fScoreMultiplier;
        },

        setABCDButtonsVisible() {
            this._Data.oButtonStates.buttonAVisible = true;
            this._Data.oButtonStates.buttonBVisible = true;
            this._Data.oButtonStates.buttonCVisible = true;
            this._Data.oButtonStates.buttonDVisible = true;
        },

        setABCDEFGHButtonsVisible() {
            this._Data.oButtonStates.buttonAVisible = true;
            this._Data.oButtonStates.buttonBVisible = true;
            this._Data.oButtonStates.buttonCVisible = true;
            this._Data.oButtonStates.buttonDVisible = true;
            this._Data.oButtonStates.buttonEVisible = true;
            this._Data.oButtonStates.buttonFVisible = true;
            this._Data.oButtonStates.buttonGVisible = true;
            this._Data.oButtonStates.buttonHVisible = true;
        },

        setInputFieldVisible() {
            this._Data.oInputField.visible = true;
        },

        resetAnswersVisibility() {
            this._Data.oButtonStates.buttonAVisible = false;
            this._Data.oButtonStates.buttonBVisible = false;
            this._Data.oButtonStates.buttonCVisible = false;
            this._Data.oButtonStates.buttonDVisible = false;
            this._Data.oButtonStates.buttonEVisible = false;
            this._Data.oButtonStates.buttonFVisible = false;
            this._Data.oButtonStates.buttonGVisible = false;
            this._Data.oButtonStates.buttonHVisible = false;
            this._Data.oInputField.visible = false;
        },

        setCorrectAnswerVisible(bVisible) {
            this._Data.oInputField.correctAnswerVisible = bVisible;
        },

        checkIfAnswerCorrect(sAnswer) {
            var isAnswercorrect = false;
            if (this._Data.oAnswerData.correctAnswer === sAnswer) {
                isAnswercorrect = true;
            } else {
                isAnswercorrect = false;
            }
            return isAnswercorrect;
        },

        deductFromScore(iScoreToDeduct) {
            if (this._Data.oCounter.iScore > 0) {
                if (this._Data.oCounter.iScore < iScoreToDeduct) {
                    this._Data.oCounter.iScore = 0;
                } else {
                    this._Data.oCounter.iScore = this._Data.oCounter.iScore - iScoreToDeduct;
                }
            }
        },

        setStartingScore() {
            this._Data.oCounter.iScore = 100 * this._Data.oCounter.iQuestionsLimit * this._Data.oCounter.fScoreMultiplier;
        },

        getScore() {
            return this._Data.oCounter.iScore;
        },

        setRankingRecords(data) {
            this._Data.oRanking.europeTopScores = data.aScoresEurope;
            this._Data.oRanking.asiaTopScores = data.aScoresAsia;
            this._Data.oRanking.africaTopScores = data.aScoresAfrica;
        },

        getCorrectAnswer() {
            return this._Data.oAnswerData.correctAnswer;
        },

        markAnswerAsCorrect() {
            this._Data.oInputField.styleClass = "correctAnswer";
        },

        markAnswerAsWrong() {
            this._Data.oInputField.styleClass = "wrongAnswer";
        },

        markCorrectAnswer() {
            if (this._Data.oAnswerData.correctAnswer === this._Data.oAnswerData.buttonAText) {
                this._Data.oButtonStates.buttonAState = "Accept";
            } else if (this._Data.oAnswerData.correctAnswer === this._Data.oAnswerData.buttonBText) {
                this._Data.oButtonStates.buttonBState = "Accept";
            } else if (this._Data.oAnswerData.correctAnswer === this._Data.oAnswerData.buttonCText) {
                this._Data.oButtonStates.buttonCState = "Accept";
            } else if (this._Data.oAnswerData.correctAnswer === this._Data.oAnswerData.buttonDText) {
                this._Data.oButtonStates.buttonDState = "Accept";
            } else if (this._Data.oAnswerData.correctAnswer === this._Data.oAnswerData.buttonEText) {
                this._Data.oButtonStates.buttonEState = "Accept";
            } else if (this._Data.oAnswerData.correctAnswer === this._Data.oAnswerData.buttonFText) {
                this._Data.oButtonStates.buttonFState = "Accept";
            } else if (this._Data.oAnswerData.correctAnswer === this._Data.oAnswerData.buttonGText) {
                this._Data.oButtonStates.buttonGState = "Accept";
            } else if (this._Data.oAnswerData.correctAnswer === this._Data.oAnswerData.buttonHText) {
                this._Data.oButtonStates.buttonHState = "Accept"
            }
        },

        clearButtons() {
            this._Data.oAnswerData.buttonAText = "";
            this._Data.oAnswerData.buttonBText = "";
            this._Data.oAnswerData.buttonCText = "";
            this._Data.oAnswerData.buttonDText = "";
            this._Data.oAnswerData.buttonEText = "";
            this._Data.oAnswerData.buttonFText = "";
            this._Data.oAnswerData.buttonGText = "";
            this._Data.oAnswerData.buttonHText = "";
            this._Data.oButtonStates.buttonAState = "Default";
            this._Data.oButtonStates.buttonBState = "Default";
            this._Data.oButtonStates.buttonCState = "Default";
            this._Data.oButtonStates.buttonDState = "Default";
            this._Data.oButtonStates.buttonEState = "Default";
            this._Data.oButtonStates.buttonFState = "Default";
            this._Data.oButtonStates.buttonGState = "Default";
            this._Data.oButtonStates.buttonHState = "Default";
            this._Data.oButtonStates.buttonAEnabled = true;
            this._Data.oButtonStates.buttonBEnabled = true;
            this._Data.oButtonStates.buttonCEnabled = true;
            this._Data.oButtonStates.buttonDEnabled = true;
            this._Data.oButtonStates.buttonEEnabled = true;
            this._Data.oButtonStates.buttonFEnabled = true;
            this._Data.oButtonStates.buttonGEnabled = true;
            this._Data.oButtonStates.buttonHEnabled = true;
        },

        getRndInteger(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        getUniqueArray(minRange, maxRange, arrayLength) {
            var arrayLength = (arrayLength) ? arrayLength : 10
            var minRange = (minRange !== undefined) ? minRange : 1
            var maxRange = (maxRange !== undefined) ? maxRange : 100
            var numberOfItemsInArray = 0
            var hash = {}
            var array = []

            if (arrayLength > (maxRange - minRange)) throw new Error('Cannot generate unique array: Array length too high')

            while (numberOfItemsInArray < arrayLength) {
                var randomNumber = (Math.random() * (maxRange - minRange + 1) + minRange) << 0

                if (!hash[randomNumber]) {
                    hash[randomNumber] = true
                    array.push(randomNumber)
                    numberOfItemsInArray++
                }
            }
            return array
        },

        defineLanguage() {
            var sLanguage = sap.ui.getCore().getConfiguration().getLanguage().substring(0, 2);
            switch (sLanguage) {
                case 'pl':
                    this._Data.oConfig.selectedLanguageIndex = 1;
                    break;
                case 'en':
                    this._Data.oConfig.selectedLanguageIndex = 0;
                    break;
                default:
                    this._Data.oConfig.selectedLanguageIndex = 0;
            }
        },

        setTempSelectedLanguageIndex(iSelectedIndex) {
            this._Data.oConfig.tempSelectedLanguageIndex = iSelectedIndex;
        },

        setLanguage() {
            this._aLanguageIndexPairs.forEach(oObj => {
                if (oObj.index === this._Data.oConfig.tempSelectedLanguageIndex) {
                    this._Data.oConfig.selectedLanguageIndex = this._Data.oConfig.tempSelectedLanguageIndex;
                    sap.ui.getCore().getConfiguration().setLanguage(oObj.language);
                    return;
                }
            });

        },

        getSelectedLanguageIndex() {
            return this._Data.oConfig.selectedLanguageIndex;
        },

        getTempSelectedLanguageIndex() {
            return this._Data.oConfig.tempSelectedLanguageIndex;
        },

        resetTempSelectedLanguageIndex() {
            this._Data.oConfig.tempSelectedLanguageIndex = this._Data.oConfig.selectedLanguageIndex;
        },

        setRegionPlayConfig(iSelectedRegionIndex) {
            this._Data.oPlayConfig.iSelectedRegionIndex = iSelectedRegionIndex;
        },

        setDifficultyPlayConfig(iSelectedDifficultyIndex) {
            this._Data.oPlayConfig.iSelectedDifficultyIndex = iSelectedDifficultyIndex;
        },

        setModePlayCapitals(bCapitals) {
            this._Data.oPlayConfig.bCapitals = bCapitals;
        },

        setModePlayFlags(bFlags) {
            this._Data.oPlayConfig.bFlags = bFlags;
        },

        setLengthPlayConfig(iSelectedLengthIndex) {
            this._Data.oPlayConfig.iSelectedLengthIndex = iSelectedLengthIndex;
        },

        getPlayConfiguration() {
            return this._Data.oPlayConfig;
        },

        setPlayConfiguration(oPlayConfig) {
            this._Data.oPlayConfig = oPlayConfig;
        },

        getCountriesData() {
            return this._Data.aCountriesData;
        },

        setCountriesData(aCountriesData) {
            this._Data.aCountriesData = aCountriesData;
        },

        setPossibleAnswers(aPossibleAnswers) {
            this._Data.aPossibleAnswers = aPossibleAnswers;
        },

        getQuestionAnswered() {
            return this._Data.oAnswerData.bQuestionAnswered;
        },

        setQuestionAnswered(bQuestionAnswered) {
            this._Data.oAnswerData.bQuestionAnswered = bQuestionAnswered;
            this._Data.oButtonStates.buttonAEnabled = false;
            this._Data.oButtonStates.buttonBEnabled = false;
            this._Data.oButtonStates.buttonCEnabled = false;
            this._Data.oButtonStates.buttonDEnabled = false;
            this._Data.oButtonStates.buttonEEnabled = false;
            this._Data.oButtonStates.buttonFEnabled = false;
            this._Data.oButtonStates.buttonGEnabled = false;
            this._Data.oButtonStates.buttonHEnabled = false;
        },

        addOneToCorrectAnswers() {
            this._Data.oCounter.iCorrectAnswers = this._Data.oCounter.iCorrectAnswers + 1;
        },

        getScoreAsPercentage() {
            return this._Data.oCounter.iScoreAsPercantage = Math.floor((this._Data.oCounter.iCorrectAnswers / this._Data.oCounter.iQuestionsLimit) * 100);
        }

    };
});