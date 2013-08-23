var Recipes = (function(Recipes) {
    Recipes.Collections || (Recipes.Collections = {});
    Recipes.Views || (Recipes.Views = {});
    
    Recipes.Collections.PaginatedCollection = Backbone.Collection.extend({
        perpage: 5,
        page: 1,
        total: 5,
        query: {},
        
		parse: function(resp,xhr) {
		    throw "Not Implemented. Populate 'perpage', 'page' and 'total' from response here.";
		},
		hasNextPage: function() {
		    return this.currentPage() < this.totalPages();
		},
		nextPage: function() {
			if (this.hasNextPage()) {
				this.page += 1;
				return this.fetch();
			}
		},
		hasPreviousPage: function() {
			return this.page > 1;
		},
		previousPage: function() {
			if (this.hasPreviousPage()) {
				this.page -= 1;
				return this.fetch();
			}
		},
		toPage: function(page) {
			if (page <= this.totalPages() && page > 0) {
				this.page = page;
			} else if (page > this.totalPages()) {
			    this.page = this.totalPages();
			} else if (page < 1) {
			    this.page = 0;
			}
			return this.fetch();
		},
		currentPage: function() {
		    return this.page;
		},
		totalPages: function() {
		    return Math.ceil(this.total / this.perpage);
		},
	});
	
	Recipes.Views.Pager = Backbone.View.extend({
		template: _.template('<ul class="pagination"><li class="first"><a href="#">First</a></li><li class="prev"><a href="#">&larr;</a></li><li class="next"><a href="#">&rarr;</a></li><li class="last"><a href="#">Last</a></li></ul>'),
		page_template: _.template('<li class="page"><a href="#"><%= page %></a></li>'),
		events: {
			'click li.first' : 'first',
			'click li.prev' : 'prev',
			'click li.next' : 'next',
			'click li.last' : 'last',			
			'click li.page' : 'page',
		},
		initialize: function() {
			this.options.visible_pages || (this.options.visible_pages = 5);
			this.collection.bind('reset',this.render,this);
		},
		render: function() {
			this.$el.empty();
			this.$el.append(this.template());

			this.$('.first').toggleClass('disabled',!this.collection.hasPreviousPage());
			this.$('.prev').toggleClass('disabled',!this.collection.hasPreviousPage());
			this.$('.next').toggleClass('disabled',!this.collection.hasNextPage());
			this.$('.last').toggleClass('disabled',!this.collection.hasNextPage());
			
			var neighbour = this.$('.prev');
			var template = this.page_template;
			var collection = this.collection;
			
			var minVisiblePage = (Math.floor((this.collection.currentPage() - 1) / this.options.visible_pages) * this.options.visible_pages) + 1;
			var maxVisiblePage = minVisiblePage + this.options.visible_pages;
			if (maxVisiblePage > this.collection.totalPages()) {
			    maxVisiblePage = this.collection.totalPages();
			}

			_.each(_.range(minVisiblePage,maxVisiblePage+1),function(idx) {
				var page = $(template({page:idx}));
				if (collection.currentPage() == idx) {
					page.addClass('active');
				}
				neighbour.after(page);
				neighbour = page;
			});
		},
		first: function(e) {
			if (this.collection.currentPage() != 1) 
				this.collection.toPage(1);
			return false;
		},
		last: function(e) {
			if (this.collection.currentPage() < this.collection.totalPages())
				this.collection.toPage(this.collection.totalPages());
			return false;
		},
		prev: function(e) {
			if (this.collection.currentPage() != 1) 
				this.collection.toPage(this.collection.previousPage());
			return false;
		},
		next: function(e) {
			if (this.collection.currentPage() < this.collection.totalPages())
				this.collection.toPage(this.collection.nextPage());
			return false;
		},
		page: function(e) {
			var el = $(e.currentTarget);
			if (!el.hasClass('active')) {
				var page = parseInt(el.text());
				this.collection.toPage(page);	
			}
			return false;
		},
	});
	
	return Recipes;
})(Recipes || {});