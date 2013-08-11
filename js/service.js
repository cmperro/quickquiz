/**
 * Defaults and constants that appear throughout the app.
 */
quiz.factory('Defaults', function() {
    return {
        quiz: {
            questions: [],
            directions: 'This quiz contains 9 questions. Good Luck!',
            style: {
                questions: {
                    ordering: 'down', // A key in Defaults.orderings
                    bullet_style: 'number', // A key in Defaults.bullet_styles
                },
                columns: 2,
                font: 'Times New Roman', // A value in Defaults.fonts
                choices: {
                    bullet_style: 'circle', // A key in Defaults.bullet_styles
                }
            },
        },
        newQuestion: {
            text: '',
            choices: []
        },
        bullet_styles: {
            // http://en.wikipedia.org/wiki/Unicode_Geometric_Shapes
            none: function() {return '&nbsp;';},
            circle: function() { return '\u25EF'; },
            number: function(index) { return (index+1) + '.'; },
            letter: function(index) { return String.fromCharCode('A'.charCodeAt() + index) + '.'; },
            square: function() { return '\u25A1'; },
        },
        fonts: {
            "Times New Roman": '"Times New Roman", Georgia, Serif',
            "Arial": 'arial, sans-serif',
            "Georgia": 'Georgia, Serif',
        },
        orderings: {
            across: {
                data: function(number_of_questions, columns, index) {
                    return index;
                },
                index: function(number_of_questions, columns, index) {
                    return index;
                }
            },
            down: {
                data: function(number_of_questions, columns, index) {
                    var rows = Math.ceil(number_of_questions / columns);
                    var newIndex = ((index % rows) * columns) + Math.floor(index / rows);
                    return newIndex;
                },
                index: function(number_of_questions, columns, index) {
                    var rows = Math.ceil(number_of_questions / columns);
                    var offset = index % columns;
                    var newIndex = (rows*offset) + ((index-offset)/columns);
                    return newIndex;
                }
            }
        },
        question_placeholder: {
            text: 'PLACEHOLDER',
            choices: ['PLACEHOLDER', 'PLACEHOLDER', 'PLACEHOLDER']
        },
    };
});

quiz.factory('Persistence', function() {
    var PREFIX = 'QuicklyQuiz';

    function stringType(obj) {
        // The type of the object as a string.
        return Object.prototype.toString.call(obj);
    }

    function storageKey(key) {
        // A prefix applied to everything we store in localStorage.
        return PREFIX + '.' + key;
    }

    // A utility function be used to overlay loaded data onto an already
    // existing object. Returns the bottom object with its keys modified.
    function overlay(bottom, top) {
        var newObject = angular.copy(bottom);
        Object.keys(top).forEach(function(key) {
            var topValue = top[key];
            var topType = stringType(topValue);

            if (!bottom[key]) {
                newObject[key] = topValue;
                return;
            }

            var bottomValue = bottom[key];
            var bottomType = stringType(bottomValue);

            if (topType !== bottomType) {
                throw {error: 'Type mismatch in loading [' + key + ']. Bottom: ' + bottomType + ' Top: ' + topType};
            }

            // topType and bottomType are equal at this point
            if (topType === '[object Object]') {
                // Associative array, recurse
                newObject[key] = overlay(bottomValue, topValue);
            } else {
                // Assume that if it's anything else, we can just copy over
                newObject[key] = topValue;
            }
        });
        return newObject;
    }

    return {
        load: function(key, value_if_empty) {
            var found = localStorage[storageKey(key)];
            if (found) {
                return JSON.parse(found);
            } else {
                return value_if_empty;
            }
        },

        save: function(key, payload) {
            localStorage[storageKey(key)] = JSON.stringify(payload);
        },

        overlay: overlay
    };
});

quiz.factory('Quiz', function(Defaults) {
    var quiz = {};

    // This data object is what gets persisted for a quiz.
    // Therefore, only include serializable data in here.
    // Any state for the quiz that wants to be persisted, goes in here.
    quiz.data = function(newData) {
        if (newData) {
            this._data = newData;
        }
        return this._data
    };

    quiz.data(Defaults.quiz);

    quiz.ordering = {
        // Utility functions for numbering and labeling the quiz questions.
        index: function(index) {
            var ordering_name = quiz.data().style.questions.ordering;
            return Defaults.orderings[ordering_name].index(quiz.data().questions.length, quiz.data().style.columns, index);
        },
        data: function(index) {
            var ordering_name = quiz.data().style.questions.ordering;
            return Defaults.orderings[ordering_name].data(quiz.data().questions.length, quiz.data().style.columns, index);
        }
    };

    quiz.directions = function(newDirections) {
        if (newDirections) {
            this.data().directions = newDirections;
        }
        return this.data().directions;
    };

    /**
     * The font to use for this quiz.
     */
    quiz.font = function() {
        return Defaults.fonts[this.data().style.font];
    },

    /**
     *  The question bullet for the question at the given index.
     */
    quiz.question_bullet = function(index) {
        return Defaults.bullet_styles[this.data().style.questions.bullet_style](index);
    };

    /**
     *  The choice bullet for the choice at the given index.
     */
    quiz.choice_bullet = function(index) {
        return Defaults.bullet_styles[this.data().style.choices.bullet_style](index);
    };

    quiz.style = function() {
        return this.data().style;
    };

    quiz.questions = function() {
        return this.data().questions;
    };

    quiz.addQuestion = function(newQuestion) {
        this.data().questions.push(newQuestion);
    };

    quiz.removeQuestion = function(question) {
        var index = this.data().questions.indexOf(question);
        this.data().questions.splice(index, 1);
    };

    quiz.clearQuestions = function () {
        this.data().questions = [];
    };

    quiz.addChoice = function(question, index, choice) {
        if (!choice) {
            choice = '';
        }
        question.choices.splice(index, 0, choice);
    };

    quiz.removeChoice = function(question, index) {
        question.choices.splice(index, 1);
    };

    quiz.shuffleChoices = function() {
        angular.forEach(this.data().questions, function(question) {
            question.choices.shuffle();
        });
    };

    return quiz;
});
