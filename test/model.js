(function(){

var proxy = Model.extend();
var doc;

module('Model', {

    setup: function(){
        doc = new proxy({
            id     : '1-the-tempest.json',
            title  : "The Tempest",
            author : "Bill Shakespeare",
            length : 123
        }); 
        
        doc.urlRoot = '/test/server/docs';
    }

});



test('initialize', function(){
    var NewModel = Model.extend({
            initialize: function(){
                this.one = 1;
            }
        });

    var model = new NewModel({});
    equal(model.one, 1);
});

test('initialize with attributes and options', function(){

    var NewModel = Model.extend({
            initialize: function(attributes, options){
                this.one = options.one;
            }
        });

    var model = new NewModel({}, {one: 1});
    equal(model.one, 1);

});

test('initialize with parsed attributes', 1, function(){

    var NewModel = Model.extend({
            // Rewritten parse
            parse: function(attrs){
                attrs.value += 1;
                return attrs;
            }
        });

    var model = new NewModel({value: 1}, {parse: true});
    equal(model.get('value'), 2);

});


test('initialize with defaults', 2, function(){

    var NewModel = Model.extend({
            defaults: {
                first_name: 'Unknown'
                , last_name: 'Unknown'
            }
        });

    var model = new NewModel({'first_name': 'John'});
    equal(model.get('first_name'), 'John');
    equal(model.get('last_name'), 'Unknown');

});


test('parse can return null', 1, function(){

    var NewModel = Model.extend({
            // Rewritten parse
            parse: function(attrs){
                attrs.value += 1;
                return null;
            }
        });

    var model = new NewModel({value: 1}, {parse: true});
    deepEqual(model.attributes, {});

});


test('url when using urlRoot, and uri encoding', 2, function(){

    var NewModel = Model.extend({
            urlRoot: '/articles'
        });

    var model = new NewModel();
    equal(model.url(), '/articles');
    model.set({id: '+1+'});
    equal(model.url(), '/articles/%2B1%2B');

});

test("url when using urlRoot as a function to determine urlRoot at runtime", 2, function() {
    var NewModel = Model.extend({
        urlRoot: function() {
            return '/nested/' + this.get('parent_id') + '/articles';
        }
    });

    var model = new NewModel({parent_id: 1});
    equal(model.url(), '/nested/1/articles');
    model.set({id: 2});
    equal(model.url(), '/nested/1/articles/2');
});


test("clone", 10, function() {
    var a = new Model({ 'foo': 1, 'bar': 2, 'baz': 3});
    var b = a.clone();

    equal(a.get('foo'), 1);
    equal(a.get('bar'), 2);
    equal(a.get('baz'), 3);
    equal(b.get('foo'), a.get('foo'), "Foo should be the same on the clone.");
    equal(b.get('bar'), a.get('bar'), "Bar should be the same on the clone.");
    equal(b.get('baz'), a.get('baz'), "Baz should be the same on the clone.");
    a.set({foo : 100});
    equal(a.get('foo'), 100);
    equal(b.get('foo'), 1, "Changing a parent attribute does not change the clone.");


    var foo = new Model({p: 1});
    var bar = new Model({p: 2});

    bar.set(foo.clone().attributes, {unset: true});
    equal(foo.get('p'), 1);
    equal(bar.get('p'), undefined);
});


test("isNew", 6, function() {
    var a = new Model({ 'foo': 1, 'bar': 2, 'baz': 3});

    ok(a.isNew(), "it should be new");

    a = new Model({ 'foo': 1, 'bar': 2, 'baz': 3, 'id': -5 });
    ok(!a.isNew(), "any defined ID is legal, negative or positive");

    a = new Model({ 'foo': 1, 'bar': 2, 'baz': 3, 'id': 0 });
    ok(!a.isNew(), "any defined ID is legal, including zero");
    ok( new Model({          }).isNew(), "is true when there is no id");
    ok(!new Model({ 'id': 2  }).isNew(), "is false for a positive integer");
    ok(!new Model({ 'id': -5 }).isNew(), "is false for a negative integer");
});


test("get", 2, function() {
    equal(doc.get('title'), 'The Tempest');
    equal(doc.get('author'), 'Bill Shakespeare');
});


test("has", 10, function() {
    var model = new Model();

    strictEqual(model.has('name'), false);

    model.set({
        '0': 0,
        '1': 1,
        'true': true,
        'false': false,
        'empty': '',
        'name': 'name',
        'null': null,
        'undefined': undefined
    });

    strictEqual(model.has('0'), true);
    strictEqual(model.has('1'), true);
    strictEqual(model.has('true'), true);
    strictEqual(model.has('false'), true);
    strictEqual(model.has('empty'), true);
    strictEqual(model.has('name'), true);

    model.unset('name');

    strictEqual(model.has('name'), false);
    strictEqual(model.has('null'), false);
    strictEqual(model.has('undefined'), false);
});


test("set and unset", 8, function() {
    var a = new Model({id: 'id', foo: 1, bar: 2, baz: 3});
    var changeCount = 0;

    a.on("change:foo", function() { changeCount += 1; });
    a.set({'foo': 2});
    ok(a.get('foo') == 2, "Foo should have changed.");
    ok(changeCount == 1, "Change count should have incremented.");

    a.set({'foo': 2}); // set with value that is not new shouldn't fire change event
    ok(a.get('foo') == 2, "Foo should NOT have changed, still 2");
    ok(changeCount == 1, "Change count should NOT have incremented.");

    // valid when return param error match: !error
    a.validate = function(attrs) {
        equal(attrs.foo, void 0, "validate:true passed while unsetting");
    };
    a.unset('foo', {validate: true});
    equal(a.get('foo'), void 0, "Foo should have changed");
    delete a.validate;
    ok(changeCount == 2, "Change count should have incremented for unset.");

    a.unset('id');
    equal(a.id, undefined, "Unsetting the id should remove the id property.");
});


test("#2030 - set with failed validate, followed by another set triggers change", function () {
    var attr = 0, main = 0, error = 0;
    var NewModel = Model.extend({
            validate: function (attr) {
                if (attr.x > 1) {
                  error++;
                  return "this is an error";
                }
            }
        });
    var model = new NewModel({x:0});

    model.on('change:x', function () { attr++; });
    model.on('change', function () { main++; });
    model.set({x:2}, {validate:true});
    model.set({x:1}, {validate:true});
    deepEqual([attr, main, error], [1, 1, 1]);
});


test("set triggers changes in the correct order", function() {
    var value = null;
    var model = new Model;

    model.on('last', function(){ value = 'last'; });
    model.on('first', function(){ value = 'first'; });

    model.trigger('first');
    model.trigger('last');
    equal(value, 'last');
});


test("set falsy values in the correct order", 2, function() {
    var model = new Model({result: 'result'});

    model.on('change', function() {
        equal(model.changed.result, void 0);
        equal(model.previous('result'), false);
    });
    model.set({result: void 0}, {silent: true});
    model.set({result: null}, {silent: true});
    model.set({result: false}, {silent: true});
    model.set({result: void 0});
});


test("nested set triggers with the correct options", function() {
    var model = new Model();
    var o1 = {};
    var o2 = {};
    var o3 = {};

    model.on('change', function(model, options) {
        switch (model.get('a')) {
            case 1:
                equal(options, o1);
                return model.set('a', 2, o2);
            case 2:
                equal(options, o2);
                return model.set('a', 3, o3);
            case 3:
                equal(options, o3);
        }
    });

    model.set('a', 1, o1);

});


test("multiple unsets", 1, function() {
    var i = 0;
    var counter = function(){ i++; };
    var model = new Model({a: 1});

    model.on("change:a", counter);

    model.set({a: 2});
    model.unset('a');
    model.unset('a');
    equal(i, 2, 'Unset does not fire an event for missing attributes.');
});



test("set and changedAttributes", 1, function() {
    var model = new Model({a: 1});

    model.on('change', function() {
        ok('a' in model.changedAttributes(), 'changedAttributes should contain changed properties');
    });

    model.unset('a');
});


test("unset and changedAttributes", 1, function() {
    var model = new Model({a: 1});

    model.on('change', function() {
        ok('a' in model.changedAttributes(), 'changedAttributes should contain unset properties');
    });

    model.unset('a');
});


test("using a non-default id attribute.", 5, function() {
    var MongoModel = Model.extend({idAttribute : '_id'});
    var model = new MongoModel({id: 'eye-dee', _id: 25, title: 'Model'});

    equal(model.get('id'), 'eye-dee');
    equal(model.id, 25);
    equal(model.isNew(), false);

    model.unset('_id');
    equal(model.id, undefined);
    equal(model.isNew(), true);
});


test("set an empty string", 1, function() {
    var model = new Model({name : "Model"});

    model.set({name : ''});
    equal(model.get('name'), '');
});


test("setting an object", 1, function() {
    var model = new Model({
        custom: { foo: 1 }
    });

    model.on('change', function() {
        ok(1);
    });

    model.set({
        custom: { foo: 1 } // no change should be fired
    });

    model.set({
        custom: { foo: 2 } // change event should be fired
    });
});


test("clear", 4, function() {
    var changed;
    var model = new Model({id: 1, name : "Model"});

    model.on("change:name", function(){ changed = true; });
    model.on("change", function() {
        var changedAttrs = model.changedAttributes();
        ok('name' in changedAttrs);
    });

    model.clear();
    equal(changed, true);
    equal(model.get('name'), undefined);
    ok(model.isNew());
});


test("defaults", 4, function() {
    var Defaulted = Model.extend({
              defaults: {
                "one": 1,
                "two": 2
              }
        });
    var model = new Defaulted({two: undefined});

    equal(model.get('one'), 1);
    equal(model.get('two'), 2);

    Defaulted = Model.extend({
        defaults: function() {
            return {
                "one": 3,
                "two": 4
            };
        }
    });

    model = new Defaulted({two: undefined});
    equal(model.get('one'), 3);
    equal(model.get('two'), 4);
});


test("change, hasChanged, changedAttributes, previous, previousAttributes", 9, function() {
    var model = new Model({name: "Tim", age: 10});

    deepEqual(model.changedAttributes(), false);

    model.on('change', function() {
        ok(model.hasChanged('name'), 'name changed');
        ok(!model.hasChanged('age'), 'age did not');
        deepEqual(
            model.changedAttributes()
            , {name : 'Rob'}
            , 'changedAttributes returns the changed attrs'
        );
        equal(model.previous('name'), 'Tim');
        ok(
            model.previousAttributes()
            , {name : "Tim", age : 10}
            , 'previousAttributes is correct'
        );
    });

    equal(model.hasChanged(), false);
    equal(model.hasChanged(undefined), false);
    model.set({name : 'Rob'});
    equal(model.get('name'), 'Rob');
});


test("changedAttributes", 3, function() {
    var model = new Model({a: 'a', b: 'b'});

    deepEqual(model.changedAttributes(), false);
    // Diff
    equal(model.changedAttributes({a: 'a'}), false);
    equal(model.changedAttributes({a: 'b'}).a, 'b');
});


test("change with options", 2, function() {
    var value;
    var model = new Model({name: 'Rob'});

    model.on('change', function(model, options) {
        value = options.prefix + model.get('name');
    });

    model.set({name: 'Bob'}, {prefix: 'Mr. '});
    equal(value, 'Mr. Bob');
    model.set({name: 'Sue'}, {prefix: 'Ms. '});
    equal(value, 'Ms. Sue');
});

test("change after initialize", 1, function () {
    var changed = 0;
    var attrs = {id: 1, label: 'c'};
    var obj = new Model(attrs);

    obj.on('change', function() { changed += 1; });
    obj.set(attrs);
    equal(changed, 0);
});


test("validate after save", 2, function() {
    var lastError, model = new Model();

    model.validate = function(attrs) {
        if (attrs.admin) return "Can't change admin status.";
    };

    // Rewrite model.sync
    model.sync = function(method, model, options) {
        options.success.call(this, {admin: true});
    };
    model.on('invalid', function(model, error) {
        lastError = error;
    });
    model.save(null);

    equal(lastError, "Can't change admin status.");
    equal(model.validationError, "Can't change admin status.");
});


test("save within change event", 4, function () {
    var flag = 0;
    var model = new Model({firstName : "Taylor", lastName: "Swift"});

    model.url = '/test/server/person.json';

    model.on('change', function () {
        flag++;
        ok(flag == 1);

        model.save();
        equal(model.get('lastName'), 'Hicks');
    });

    model.on('sync', function(){
        start();
        flag++; 
        ok(flag == 2);
        deepEqual(model.toJSON(), {firstName: "Taylor", lastName: "Hicks"});
    });

    model.set({lastName: 'Hicks'});
    stop();
});



test("save", 4, function() {

    ok(!doc.isNew());
    ok(doc.url(), '/test/server/docs/1-the-tempest.json');

    doc.on('change:title', function(model, value, options){
        equal(value, "Henry V");
    });

    doc.on('sync', function(model, resp, options){
        start();
        equal(doc.get('title'), "Henry V");
    });

    doc.save({title : "Henry V"}, {emulateHTTP: true});
    stop();
});


test("save, fetch, destroy triggers error event when an error occurs", 3, function () {

    var model = new Model();

    model.on('error', function () {
        ok(true);
    });

    model.sync = function (method, model, options) {
        // Trigger error in options.error
        options.error();
    };

    model.save({data: 2, id: 1});
    model.fetch();
    model.destroy();

});


test("save with PATCH", function() {

    doc.clear().set({id: "1-the-tempest.json", a: 1, b: 2, c: 3, d: 4});
    doc.save(null, {emulateHTTP: true});

    ok(!doc.isNew());
    equal(Utils.syncArgs.method, 'update');
    equal(Utils.syncArgs.options.attrs, undefined);

    doc.save({b: 2, d: 4}, {patch: true, emulateHTTP: true});
    equal(Utils.syncArgs.method, 'patch');
    // equal(_.size(Utils.syncArgs.options.attrs), 2);

    equal(Utils.syncArgs.options.attrs.d, 4);
    equal(Utils.syncArgs.options.attrs.a, undefined);
});


test("save with PATCH and different attrs", function() {
    doc.clear()
        .save(
            {id: "1-the-tempest.json", b: 2, d: 4}
            , {patch: true, attrs: {B: 1, D: 3}, emulateHTTP: true}
        );

    doc.on('sync', function(model){
        start();
        ok(Utils.has(doc.attributes, 'title'));
        equal(doc.attributes['author'], "Bill Shakespeare");
    });

    equal(Utils.syncArgs.options.attrs.D, 3);
    equal(Utils.syncArgs.options.attrs.d, undefined);
    deepEqual(doc.attributes, {b: 2, d: 4, id: "1-the-tempest.json"});
    stop();
});





})();
