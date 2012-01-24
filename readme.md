Backbone Recipes
================

A set of classes for [backbone.js](http://documentcloud.github.com/backbone/) implementing common patterns that are frequently used in web applications. 
Example provided uses [Twitter's Bootstrap framework]().

## Pagination ##

What's included:
* A `Recipes.Views.Table` - to easily render a table.
* A `Recipes.Views.Pager` - to go through next, previous, first, last and Nth pages.
* A `Recipes.Views.SearchBox` - to filter the collection that backs the table.
* A `Recipes.Collections.PaginatedCollection` - collection class that understands pagination and filtering.

A simple Twitter search that displays results in a paginated table would be implemented like this:

``` javascript
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
search.$("input").trigger("keyup");
``` 

