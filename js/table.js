var Recipes = (function(Recipes) {
    Recipes.Views || (Recipes.Views = {});    
    
    Recipes.Views.TableRow = Backbone.View.extend({
		tagName: 'tr',
		template: _.template('<td><%= id %></td>'),
		initialize: function() {
			this.model.bind('remove',this.remove,this);
			this.model.bind('change',this.render,this);
		},
		render: function() {
			$(this.el).empty();
			$(this.el).append(this.template(this.model.toJSON()));
			return this;
		},
		remove: function(model) {
			$(this.el).hide("slow",function() {
				$(this.el).remove();
			});
		},
	});
    
    Recipes.Views.Table = Backbone.View.extend({
		initialize: function() {
			if (this.options.row === undefined) {
				if (this.options.row_template === undefined) {
					throw 'row_template option is missing';
				}
				this.options.row = Recipes.Views.TableRow.extend({
					template: this.options.row_template
				});
			}
			this.collection.bind('reset',this.render,this);
		},
		render: function() {
			var $body = this.$("tbody");
			$body.empty();
			var row = this.options.row;
			this.collection.each(function(m) {
				var r = new row({model:m});
				$body.append(r.el);
				r.render();
			});
		},
	});
	
	return Recipes;
})(Recipes || {});