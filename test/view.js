(function(){

var View = Rocket.View;
var Model = Rocket.Model;

var view;

module('View', {
    setup: function(){
        view = new View({
            id: 'test-view'
            , className: 'test-view'
            , other: 'non-special-option'
        });
    }
});


test('constructor', 3, function(){
    equal(view.el.id, 'test-view');
    equal(view.el.className, 'test-view');
    equal(view.el.other, void 0);
});


test('$', 2, function(){

    var view = new View;
    view.setElement('<p><a><b>test</b></a></p>');
    var result = view.$('a b');

    strictEqual(result[0].innerHTML, 'test');
    ok(result.length === +result.length);
});


test("$el", 3, function() {
    var view = new View;
    view.setElement('<p><a><b>test</b></a></p>');
    strictEqual(view.el.nodeType, 1);

    ok(view.$el instanceof $);
    strictEqual(view.$el[0], view.el);
});


test("initialize", 1, function() {
    var newView = View.extend({
            initialize: function() {
                this.one = 1;
            }
        });

    strictEqual(new newView().one, 1);
});

test("delegateEvents", 6, function() {
    var counter1 = 0, counter2 = 0;

    var view = new View({el: '<div><h1>Header 1</h1></div>'});
    view.increment = function(){ counter1++; };
    view.$el.on('click', function(){ counter2++; });

    var events = {'click h1': 'increment'};

    view.delegateEvents(events);
    view.$('h1').trigger('click');
    equal(counter1, 1);
    equal(counter2, 1);

    view.$('h1').trigger('click');
    equal(counter1, 2);
    equal(counter2, 2);

    view.delegateEvents(events);
    view.$('h1').trigger('click');
    equal(counter1, 3);
    equal(counter2, 3);
});

test("delegate", 2, function() {
    var view = new View({el: '#testElement'});

    view.delegate('click', 'h1', function() {
        ok(true);
    });

    view.delegate('click', function() {
        ok(true);
    });

    view.$('h1').trigger('click');
});

test("delegateEvents allows functions for callbacks", 3, function() {
    var view = new View({el: '<p></p>'});
    view.counter = 0;

    var events = {
            click: function() {
                this.counter++;
            }
        };

    view.delegateEvents(events);
    view.$el.trigger('click');
    equal(view.counter, 1);

    view.$el.trigger('click');
    equal(view.counter, 2);

    view.delegateEvents(events);
    view.$el.trigger('click');
    equal(view.counter, 3);
});


test("delegateEvents ignore undefined methods", 0, function() {
    var view = new View({el: '<p></p>'});

    view.delegateEvents({'click': 'undefinedMethod'});
    view.$el.trigger('click');
});

test("undelegateEvents", 6, function() {
    var counter1 = 0, counter2 = 0;

    var view = new View({el: '#testElement'});
    view.increment = function(){ counter1++; };
    view.$el.on('click', function(){ counter2++; });

    var events = {'click h1': 'increment'};

    view.delegateEvents(events);
    view.$('h1').trigger('click');
    equal(counter1, 1);
    equal(counter2, 1);

    view.undelegateEvents();
    view.$('h1').trigger('click');
    equal(counter1, 1);
    equal(counter2, 2);

    view.delegateEvents(events);
    view.$('h1').trigger('click');
    equal(counter1, 2);
    equal(counter2, 3);
});


test("undelegate", 0, function() {
    var view = new View({el: '#testElement'});

    view.delegate('click', function() { ok(false); });
    view.delegate('click', 'h1', function() { ok(false); });

    view.undelegate('click');

    view.$('h1').trigger('click');
    view.$el.trigger('click');
});


test("undelegate with passed handler", 1, function() {
    var view = new View({el: '#testElement'});
    var listener = function() { ok(false); };

    view.delegate('click', listener);
    view.delegate('click', function() { ok(true); });
    view.undelegate('click', listener);
    view.$el.trigger('click');
});

test("undelegate with selector", 2, function() {
    var view = new View({el: '#testElement'});

    view.delegate('click', function() { ok(true); });
    view.delegate('click', 'h1', function() { ok(false); });
    view.undelegate('click', 'h1');

    view.$('h1').trigger('click');
    view.$el.trigger('click');
});

test("undelegate with handler and selector", 2, function() {
    var view = new View({el: '#testElement'});
    view.delegate('click', function() { ok(true); });
    var handler = function(){ ok(false); };

    view.delegate('click', 'h1', handler);
    view.undelegate('click', 'h1', handler);

    view.$('h1').trigger('click');
    view.$el.trigger('click');
});


test("tagName can be provided as a string", 1, function() {
    var newView = View.extend({
            tagName: 'span'
        });

    equal(new newView().el.tagName, 'SPAN');
});


test("tagName can be provided as a function", 1, function() {
    var newView = View.extend({
            tagName: function() {
                return 'p';
            }
        });

    ok(new newView().$el.is('p'));
});


test("_ensureElement with DOM node el", 1, function() {
    var newView = View.extend({
            el: document.body
        });

    equal(new newView().el, document.body);
});


test("_ensureElement with string el", 3, function() {
    var newView = View.extend({
            el: "body"
        });

    strictEqual(new newView().el, document.body);

    newView = newView.extend({
        el: "#testElement > h1"
    });
    strictEqual(new newView().el, $("#testElement > h1").get(0));

    newView = newView.extend({
        el: "#nonexistent"
    });
    ok(!new newView().el);
});

test("with className and id functions", 2, function() {
    var newView = View.extend({
            className: function() {
                return 'className';
            },
            id: function() {
                return 'id';
            }
        });

    strictEqual(new newView().el.className, 'className');
    strictEqual(new newView().el.id, 'id');
});

test("with attributes", 2, function() {
    var newView = View.extend({
            attributes: {
                id: 'id',
                'class': 'class'
            }
        });

    strictEqual(new newView().el.className, 'class');
    strictEqual(new newView().el.id, 'id');
});


test("with attributes as a function", 1, function() {
    var newView = View.extend({
            attributes: function() {
                return {'class': 'dynamic'};
            }
        });

    strictEqual(new newView().el.className, 'dynamic');
});


test("multiple views per element", 3, function() {
    var count = 0;
    var $el = $('<p></p>');

    var newView = View.extend({
            el: $el,
            events: {
                click: function() {
                    count++;
                }
            }
        });

    var view1 = new newView;
    $el.trigger("click");
    equal(1, count);

    var view2 = new newView;
    $el.trigger("click");
    equal(3, count);

    view1.delegateEvents();
    $el.trigger("click");
    equal(5, count);
});

test("custom events", 2, function() {
    var newView = View.extend({
            el: $('body'),
            events: {
                "fake$event": function() { ok(true); }
            }
        });

    var view = new newView;
    $('body').trigger('fake$event').trigger('fake$event');

    $('body').off('fake$event');
    $('body').trigger('fake$event');
});


test("#1048 - setElement uses provided object.", 2, function() {
    var $el = $('body');

    var view = new View({el: $el});
    ok(view.$el === $el);

    view.setElement($el = $($el));
    ok(view.$el === $el);
});

test("#986 - Undelegate before changing element.", 1, function() {
    var $button1 = $('<button></button>');
    var $button2 = $('<button></button>');

    var newView = View.extend({
            events: {
                click: function(e) {
                    ok(view.el === e.target);
                }
            }
        });

    var view = new newView({el: $button1});
    view.setElement($button2);

    $button1.trigger('click');
    $button2.trigger('click');
});

test("#1172 - Clone attributes object", 2, function() {
    var newView = View.extend({
            attributes: {foo: 'bar'}
        });

    var view1 = new newView({id: 'foo'});
    strictEqual(view1.el.id, 'foo');

    var view2 = new newView();
    ok(!view2.el.id);
});

test("views stopListening", 0, function() {
    var newView = View.extend({
            initialize: function() {
                this.listenTo(this.model, 'all x', function(){ ok(false); });
                // this.listenTo(this.collection, 'all x', function(){ ok(false); });
            }
        });

    var view = new newView({
            model: new Model
            // , collection: new Collection
        });

    view.stopListening();
    view.model.trigger('x');
    // view.collection.trigger('x');
});


test("Provide function for el.", 2, function() {
    var newView = View.extend({
            el: function() {
                return "<p><a></a></p>";
            }
        });

    var view = new newView;
    ok(view.$el.is('p'));
    ok(view.$el.has('a'));
});

test("events passed in options", 1, function() {
    var counter = 0;

    var newView = View.extend({
            el: '#testElement',
            increment: function() {
                counter++;
            }
        });

    var view = new newView({
            events: {
                'click h1': 'increment'
            }
        });

    view.$('h1').trigger('click').trigger('click');
    equal(counter, 2);
});


test("remove", 1, function() {
    var view = new View;
    document.body.appendChild(view.el);

    view.delegate('click', function() { ok(false); });
    view.listenTo(view, 'all x', function() { ok(false); });

    view.remove();
    view.$el.trigger('click');
    view.trigger('x');

    // In IE8 and below, parentNode still exists but is not document.body.
    notEqual(view.el.parentNode, document.body);
});











})();
