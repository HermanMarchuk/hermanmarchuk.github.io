var Blog = Backbone.Model.extend({
    defaults: {
        author: '',
        title: '',
        url: ''
    }
});

var Blogs = Backbone.Collection.extend({});

var blogs = new Blogs();

var BlogView = Backbone.View.extend({
    model: new Blog(),
    tagName: 'tr',
    initialize: function() {
        this.template = _.template($('.blogs-list-template').html());
    },
    events: {
        'click .edit-blog': 'edit',
        'click .update-blog': 'update',
        'click .cancel': 'cancel',
        'click .delete-blog': 'delete'
    },
    edit: function() {
        var author = this.$('.author').html();
        var title = this.$('.title').html();
        var url = this.$('.url').html();
        this.$('.edit-blog, .delete-blog').hide();
        this.$('.update-blog, .cancel').show();
        this.$('.author').html($('<input type="text" class="form-control author-update">').val(author));
        this.$('.title').html($('<input type="text" class="form-control title-update">').val(title));
        this.$('.url').html($('<input type="text" class="form-control url-update">').val(url));
    },
    update: function() {
        this.model.set({
            'author': $('.author-update').val(),
            'title': $('.title-update').val(),
            'url': $('.url-update').val()
        });
    },
    cancel: function() {
        blogsView.render();
    },
    delete: function() {
        this.model.destroy();
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

var BlogsView = Backbone.View.extend({
    model: blogs,
    el: $('.blogs-list'),
    initialize: function() {
        this.model.on('add', this.render, this);
        this.model.on('change', this.render, this);
        this.model.on('remove', this.render, this);
    },
    render: function() {
        var self = this;
        this.$el.html('');
        _.each(this.model.toArray(), function(blog) {
            var blogView = new BlogView({ model: blog });
            self.$el.append(blogView.render().$el);
        });
        return this;
    }
});

var blogsView = new BlogsView();

$(document).ready(function() {
    $('.add-blog').on('click', function() {
        var blog = new Blog({
            author: $('.author-input').val(),
            title: $('.title-input').val(),
            url: $('.url-input').val()
        });
        blogs.add(blog);
        $('.author-input, .title-input, .url-input').val('');
    });
});
