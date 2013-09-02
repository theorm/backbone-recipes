var Recipes = (function(Recipes) {
    Recipes.Views || (Recipes.Views = {});    

    Recipes.Views.FlashMessage = Backbone.View.extend({
		initialize: function() {
			if (this.template === undefined && this.options.template === undefined) {
				throw '"template" option is missing';
			}
			if (this.options.template != undefined) {
			    this.template = this.options.template;
			}
			if (this.options.timeout != undefined) {
			    this.timeout = this.options.timeout;
			} else {
    			this.timeout = 3000;			    
			}
		},
		render: function() {
				console.log(this.model.toJSON());
		    var message = $(this.template(this.model.toJSON()));
		    message.css("display", "none");
		    this.$el.empty().append(message);
		    var timeout = this.timeout;
		    message.fadeIn('slow',function() {
		        setTimeout(function() {
    		        message.fadeOut('slow',function() {
    		           message.remove(); 
    		        });		            
		        },timeout);
		    });
		},
	});


	return Recipes;
})(Recipes || {});