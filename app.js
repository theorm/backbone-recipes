var App = (function() {
    
    var App = {
        Models: {},
        Collections: {},
        Views: {},
        Routers: {},
        start: function() {
            new App.Routers.Examples();
            Backbone.history.start();
        }
    };
    
    App.Routers.Examples = Backbone.Router.extend({
        routes: {
            "" : "home",
            "pagination" : "pagination",
        },
        home: function() {
            this.enable('');
            var tmpl = $("#home").html();
            $("#main").empty().append(_.template(tmpl));
        },
        pagination: function() {
            this.enable('pagination');
            var tmpl = $("#pagination").html();
            $("#main").empty().append(_.template(tmpl));
            
            var collection = new App.Collections.TwitterSearch();
            new Recipes.Views.Table({
                el: $("#table"),
                collection: collection,
                row_template: _.template("<td><img src='<%= profile_image_url %>'></img><br/>@<%= from_user %></td><td><%= text %></td>")
            });
            new Recipes.Views.Pager({
                el: $("#pager"),
                collection: collection
            });
            var search = new Recipes.Views.SearchBox({
                el: $("#search"),
                collection: collection
            })
            search.$("input").val("backbone.js").trigger("keyup");
        },
        enable: function(section) {
            $("#topbar a").parent("li").removeClass("active");
            $("#topbar a[href='#" + section + "']").parent("li").addClass("active");
        }
    });
    
    // Pagination example using Twitter search
    App.Collections.TwitterSearch = Recipes.Collections.PaginatedCollection.extend({
        query: {},
        url: 'http://search.twitter.com/search.json',
    	parse: function(resp,xhr) {
			this.perpage = resp.results_per_page;
			this.page = resp.page;
			this.total = 50;

			return resp.results;
		},
		fetch : function(options) {
			options || (options = {});
			options.data || (options.data = {});
			options.data = _.extend(options.data,this.query)
			
			if (this.perpage !== undefined)
				options.data.rpp = this.perpage;
			if (this.page !== undefined)
				options.data.page = this.page;

			return Backbone.Collection.prototype.fetch.call(this, options);
		},
		search: function(text) {
		    this.query['q'] = text;
		    this.fetch();
		},
    });
    
    return App;
})();