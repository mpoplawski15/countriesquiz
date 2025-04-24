document.addEventListener('deviceready', function() {
    console.log("Device ready event fired");
    
    // Wait for SAPUI5 initialization before loading models
    var componentReadyCheck = setInterval(function() {        
        if (window.myAppComponent) {
            console.log("Component found, loading models");
            clearInterval(componentReadyCheck);
            loadJsonModels(window.myAppComponent);
        }
    }, 100);
    
    // Set a timeout to abandon the check if it takes too long
    setTimeout(function() {
        clearInterval(componentReadyCheck);
        console.log("Component check timed out, trying core-level models as fallback");
        loadJsonModels(null);
    }, 5000);
}, false);

function loadJsonModels(component) {
    console.log("Starting to load JSON models");
    
    // Load Europe data
    window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + "www/CountriesEurope.json", 
        function(fileEntry) {
            readJsonFile(fileEntry, "countriesEurope", component);
        }, function(error) {
            console.error("Error resolving CountriesEurope.json:", error);
        });
    
    // Load Asia data
    window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + "www/CountriesAsia.json", 
        function(fileEntry) {
            readJsonFile(fileEntry, "countriesAsia", component);
        }, function(error) {
            console.error("Error resolving CountriesAsia.json:", error);
        });
    
    // Load Africa data
    window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + "www/CountriesAfrica.json", 
        function(fileEntry) {
            readJsonFile(fileEntry, "countriesAfrica", component);
        }, function(error) {
            console.error("Error resolving CountriesAfrica.json:", error);
        });
}

function readJsonFile(fileEntry, modelName, component) {
    fileEntry.file(function(file) {
        var reader = new FileReader();
        reader.onloadend = function() {
            try {
                var data = JSON.parse(this.result);
                var model = new sap.ui.model.json.JSONModel(data);
                
                if (component) {
                    // Set model on the component
                    console.log("Setting " + modelName + " on component");
                    component.setModel(model, modelName);
                } else {
                    // Fallback to core
                    console.log("Setting " + modelName + " on core (fallback)");
                    sap.ui.getCore().setModel(model, modelName);
                }
            } catch(e) {
                console.error("Error parsing JSON for " + modelName, e);
            }
        };
        reader.readAsText(file);
    });
}