describe('Quiz test', function() {
    beforeEach(module('quiz'));

    it('should start off empty', inject(function(Quiz) {
        expect(Quiz.questions().length).toEqual(0);
    }));

    it('should add a question', inject(function(Quiz) {
        var newQuestion = {
            text: 'my text',
            choices: ['blue', 'red', 'green']
        };
        Quiz.addQuestion(newQuestion);
        expect(Quiz.questions().length).toEqual(1);
        expect(Quiz.questions()[0]).toEqual(newQuestion);
    }));

    it('should remove a question', inject(function(Quiz) {
        var newQuestion = {
            text: 'my text',
            choices: ['blue', 'red', 'green']
        };
        Quiz.addQuestion(newQuestion);
        Quiz.removeQuestion(newQuestion);
        expect(Quiz.questions().length).toEqual(0);
    }));

    it('should clear all questions', inject(function(Quiz) {
        var newQuestion = {
            text: 'my text',
            choices: ['blue', 'red', 'green']
        };
        Quiz.addQuestion(newQuestion);
        Quiz.addQuestion(newQuestion);
        Quiz.addQuestion(newQuestion);
        Quiz.clearQuestions();
        expect(Quiz.questions().length).toEqual(0);
    }));

    it('should add a choice', inject(function(Quiz) {
        var newQuestion = {
            text: 'my text',
            choices: ['blue', 'red', 'green']
        };
        Quiz.addQuestion(newQuestion);
        Quiz.addChoice(newQuestion, 0, 'frogger');
        expect(Quiz.questions()[0].choices[0]).toBe('frogger');
    }));

    it('should remove a choice', inject(function(Quiz) {
        var newQuestion = {
            text: 'my text',
            choices: ['blue', 'red', 'green']
        };
        Quiz.addQuestion(newQuestion);
        Quiz.removeChoice(newQuestion, 0);
        expect(Quiz.questions()[0].choices.length).toBe(2);
        expect(Quiz.questions()[0].choices[0]).toBe('red');
    }));
});

describe('Persistence test', function() {
    beforeEach(function() {
        var store = jasmine.createSpy();
        spyOn(localStorage, 'getItem').andCallFake(function (key) {
            return store[key];
        });
        spyOn(localStorage, 'setItem').andCallFake(function (key, value) {
            return store[key] = value + '';
        });
        module('quiz');
    });

    it('should save and load an object', inject(function(Persistence) {
        var payload = {'dog': 3};
        Persistence.save('myKey', payload);
        expect(Persistence.load('myKey')).toEqual(payload);
    }));

    it('should overwrite keys of the same name and value type', inject(function(Persistence) {
        var bottom = {'dog': 3};
        var top = {'dog': 2};
        expect(Persistence.overlay(bottom, top)).toEqual(top);
    }));

    it('should leave bottom keys alone', inject(function(Persistence) {
        var bottom = {dog: 3, cat:'4'};
        expect(Persistence.overlay(bottom, {dog: 2})).toEqual({dog:2, cat:'4'});
    }));

    it('should recurse throughout the object', inject(function(Persistence) {
        var bottom = {dog: 3, cat:'4', deeper: {foo:5, bar: 7}};
        var top = {dog: 2, deeper: {bar:20}};
        expect(Persistence.overlay(bottom, top)).toEqual({dog:2, cat:'4', deeper:{foo:5, bar: 20}});
    }));

    it('should return the given value if the key is not found', inject(function(Persistence) {
        var not_found = Object();
        expect(Persistence.load('notFound', not_found)).toBe(not_found);
    }));

    it('should be a no-op to overlay the empty object', inject(function(Persistence) {
        var bottom = {cat: 42};
        expect(Persistence.overlay(bottom, {})).toEqual(bottom);
    }));
});
