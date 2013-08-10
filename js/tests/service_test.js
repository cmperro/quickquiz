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
