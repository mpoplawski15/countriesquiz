sap.ui.define([
], function () {
    return {
        compareNormalizedStrings(sString1, sString2) {
            const sFirstString = sString1.toLowerCase();
            const sSecondString = sString2.toLowerCase();

            // Normalize strings - remove diacritics (accents)
            const sNormalizedFirstString = sFirstString.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const sNormalizedSecondString = sSecondString.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

            // Remove other special characters if needed
            const sCleanFirstString = sNormalizedFirstString.replace(/[^a-z0-9]/g, '');
            const sCleanSecondString = sNormalizedSecondString.replace(/[^a-z0-9]/g, '');

            return sCleanFirstString === sCleanSecondString;
        },
    }
})