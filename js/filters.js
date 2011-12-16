var Recipes = (function(Recipes) {
    Recipes.Views || (Recipes.Views = {});

    Recipes.Views.SearchBox = Backbone.View.extend({
        events: {
            "keyup input": "search"
        },
        initialize: function() {
            if (this.collection === undefined) {
                throw "SearchBox needs a collections to search";
            }
            if (this.collection.search === undefined) {
                throw "SearchBox needs a collections with implemented 'search' method.";
            }
        },
        search: function() {
            this.collection.search(this.$("input").val());
        },
    });
    
    return Recipes;
})(Recipes || {});