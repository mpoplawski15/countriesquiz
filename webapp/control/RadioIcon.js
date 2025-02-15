sap.ui.define([
	"sap/m/RadioButton"
], function (RB) {
	"use strict";
	return RB.extend("sap.m.sample.RadioIcon.RadioIcon", {
	metadata : {
        aggregations: {
          image: 'sap.m.Image',
          multiple: false
        },
        defaultAggregation : "image", 
		},
      renderer: function(oRm, oControl) {
        sap.m.RadioButtonRenderer.render(oRm, oControl);
        oControl.getImage().forEach(function(b) {
          oRm.renderControl(b);
        });
      },

      onAfterRendering: function() {
        if (sap.m.RadioButton.prototype.onAfterRendering) {
          sap.m.RadioButton.prototype.onAfterRendering.apply(this, arguments);
        }
        var oRGB = this.$().find('.sapMRbB');
        
          var d = $('<div style="display:flex"></div');
          d.append(this.getImage()[0].$());
          oRGB.append(d);
          
        this.$().find('.sapMImg').css("margin-top", "15px");
        this.$().find('.sapMImg').css("margin-left", "5px");
        this.$().find('.sapMLabel').css("margin-top", "3px");
        this.$().find('.sapMLabel').css("margin-left", "2rem");
      }
	});
});