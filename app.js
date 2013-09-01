var App = (function() {

    // Application wide ajax error handler
    $(document).ajaxError(function myErrorHandler(event, xhr, ajaxOptions, thrownError) {
		var model;
		try {
			var data = JSON.parse(xhr.responseText);
			model = new Backbone.Model(data);
		} catch(e) {
			if (xhr.responseText != undefined && xhr.responseText != '') {
				text = xhr.responseText;
    			model = new Backbone.Model({'text' : text});
			} else {
			    console.dir(xhr);
    			model = new Backbone.Model({'text' : 'Unknown problem. See console log for details.'});			    
			}
		}
		
		var text = 'An error occured';
		if (xhr.responseText != undefined && xhr.responseText != '')
			text = xhr.responseText;
        var msg = new Recipes.Views.FlashMessage({
            el: $("#messages"),
            model: model,
            template: _.template('<div class="alert alert-danger"><p><%= text || "" %></p></div>')
        });
        msg.render();
	});
	
    
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
            "foursquare-pagination": "foursquare_pagination",
            // "twitter-pagination" : "twitter_pagination",
            "google-pagination" : "google_pagination",
        },
        home: function() {
            this.enable('');
            var tmpl = $("#home").html();
            $("#main").empty().append(_.template(tmpl));
        },
        foursquare_pagination: function() {
            this.enable('foursquare-pagination');            
            var tmpl = $("#pagination").html();
            $("#main").empty().append(_.template(tmpl));
            
            var collection = new App.Collections.FoursquareSearch();
            new Recipes.Views.Table({
                el: $("#table"),
                collection: collection,
                row_template: _.template("<td><% try { %><img src='<%= photo.prefix %>100x100<%= photo.suffix %>'></img><% } catch(e) {} %></td><td><%= venue.name %></td>")
            });
            new Recipes.Views.Pager({
                el: $("#pager"),
                collection: collection
            });
            var search = new Recipes.Views.SearchBox({
                el: $("#search"),
                collection: collection
            });
            search.$("input").val("Brisbane, AU").trigger("keyup");
        },
        twitter_pagination: function() {
            this.enable('twitter-pagination');
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
        google_pagination: function() {
            this.enable('google-pagination');
            var tmpl = $("#pagination").html();
            $("#main").empty().append(_.template(tmpl));
            
            var collection = new App.Collections.GoogleNewsSearch();
            new Recipes.Views.Table({
                el: $("#table"),
                collection: collection,
                row_template: _.template("<td><%= publisher %></td><td><%= title %></td><td><%= content %></td>")
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

    App.Collections.FoursquareSearch = Recipes.Collections.PaginatedCollection.extend({
        query: {
            locale: 'en',
            v: '20130830',
            limit: 30,
            section: 'coffee',
            near: 'Brisbane, AU',
            oauth_token: 'QEJ4AQPTMMNB413HGNZ5YDMJSHTOHZHMLZCAQCCLXIX41OMP'  // Thank you Foursquare for exposing your public token                     
        },
        perpage: 30,
        page: 1,
        url: 'https://api.foursquare.com/v2/venues/explore',
        parse: function(resp, xhr) {
            this.total = parseInt(resp.response.totalResults) || 0;
            return resp.response.groups[0].items;
        },
        fetch: function(options) {
            options || (options = {});
            options.data || (options.data = {});
            options.data = _.extend(options.data,this.query);

            if (this.page != undefined)
                options.data.offset = (this.page-1) * this.perpage;
            options.reset = true;

            return Backbone.Collection.prototype.fetch.call(this, options);
        },
        search: function(text) {
            this.query['near'] = text;
            this.fetch();
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
            options.reset = true;

			return Backbone.Collection.prototype.fetch.call(this, options);
		},
		search: function(text) {
		    this.query['q'] = text;
		    this.fetch();
		},
    });

    // Pagination example using Twitter search
    App.Collections.GoogleNewsSearch = Recipes.Collections.PaginatedCollection.extend({
        query: {},
        url: 'https://ajax.googleapis.com/ajax/services/search/news',
        perpage: 4,
        page: 1,
    	parse: function(resp,xhr) {
            if (resp.responseData.results && resp.responseData.results.length > 0) {
                this.page = resp.responseData.cursor.currentPageIndex + 1;
                this.total = resp.responseData.cursor.estimatedResultCount < 32 ? resp.responseData.cursor.estimatedResultCount : 32;                
            } else {
                this.page = 1;
                this.total = 1;
            }
            console.log(resp.responseData.results)
			return resp.responseData.results;
		},
		fetch : function(options) {
			options || (options = {});
			options.data || (options.data = {});
			options.data = _.extend(options.data,this.query)
			
			options.data.v = '1.0';
			options.data.rsz = this.perpage;
			if (this.page !== undefined)
				options.data.start = (this.page-1) * this.perpage;
            options.dataType = 'jsonp';
            options.reset = true;

			return Backbone.Collection.prototype.fetch.call(this, options);
        },
		search: function(text) {
		    this.query['q'] = text;
		    this.fetch();
		},
    });
    

    return App;
})();