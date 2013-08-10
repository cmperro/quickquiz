/**
 * Defaults and constants that appear throughout the app.
 */
quiz.factory('Defaults', function() {
    return {
        newQuestion: {
            text: '',
            choices: []
        },
        bullet_styles: {
            // http://en.wikipedia.org/wiki/Unicode_Geometric_Shapes
            circle: function() { return '\u25EF'; },
            none: function() {return '&nbsp;';},
            number: function(index) { return (index+1) + '.'; },
            letter: function(index) { return String.fromCharCode('A'.charCodeAt() + index) + '.'; },
            square: function() { return '\u25A1'; },
        },
        fonts: [
            {name: "Times New Roman", style: '"Times New Roman", Georgia, Serif'},
            {name: "Arial", style: 'arial, sans-serif'},
            {name: "Georgia", style: 'Georgia, Serif'},
        ],
        orderings: {
            across: {
                data: function(columns, index) {
                    return index;
                },
                index: function(columns, index) {
                    return index;
                }
            },
            down: {
                data: function(columns, index) {
                    var rows = Math.ceil($scope.questions.length / columns);
                    var newIndex = ((index % rows) * columns) + Math.floor(index / rows);
                    return newIndex;
                },
                index: function(columns, index) {
                    var rows = Math.ceil($scope.questions.length / columns);
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

quiz.factory('Quiz', function(Defaults) {
    var data = {
        questions: [],
        directions: 'This quiz contains 9 questions. Good Luck!',
        style: {
            ordering: Defaults.orderings.down,
            columns: 2,
            font: Defaults.fonts[0],
            choices: {
                bullet: Defaults.bullet_styles.circle
            }
        },
    };

    return {
        ordering: {
            // Some weak sauce currying here, since I want to be able to swap orderings and columns numbers easily
            index: function(index) {
                return data.style.ordering.index($scope.style.columns, index);
            },
            data: function(index) {
                return data.style.ordering.data($scope.style.columns, index);
            }
        },

        questions: function() {
            return data.questions;
        },

        addQuestion: function(newQuestion) {
            data.questions.push(newQuestion);
        },

        removeQuestion: function(question) {
            var index = data.questions.indexOf(question);
            data.questions.splice(index, 1);
        },

        clearQuestions: function () {
            data.questions = [];
        },

        addChoice: function(question, index, choice) {
            if (!choice) {
                choice = '';
            }
            question.choices.splice(index, 0, choice);
        },

        removeChoice: function(question, index) {
            question.choices.splice(index, 1);
        },

        shuffleChoices: function() {
            angular.forEach(data.questions, function(question) {
                question.choices.shuffle();
            });
        },
    };
});

/** TODO: enable Persistence stuff
    function stringType(obj) {
        return Object.prototype.toString.call(obj);
    }

    function overlay(bottom, top) {
        $.each(top, function(key, topValue) {
            var type = stringType(topValue);

            if (bottom[key]) {
                var bottomValue = bottom[key];

                // Only used for error checking, should really be equal to type
                var bottomType = stringType(bottomValue);
                if (type !== bottomType) {
                    throw {error: 'Type mismatch in loading [' + key + ']. Bottom: ' + bottomType + ' Top: ' + topType};
                }

                if (type === '[object Object]') {
                    // Associative array, recurse
                    overlay(bottomValue, topValue);
                } else {
                    // Assume that if it's anything else, we can just copy over
                    bottom[key] = topValue;
                }
            } else {
                bottom[key] = topValue;
            }
        });
        return bottom;
    }

    // Handle persistence across refresh, by saving models to local storage as JSON.
    ['questions', 'style', 'directions'].forEach(function(variable) {
        var key = 'QuicklyQuiz.' + variable;
        if (localStorage[key]) {
            var locallyStored = JSON.parse(localStorage[key]);
            if (stringType(locallyStored) === '[object Object]') {
                overlay($scope[variable], locallyStored);
            } else {
                $scope[variable] = locallyStored;
            }
        }
        $scope.$watch(variable, function(newValue) {
            localStorage[key] = JSON.stringify(newValue);
        }, true);
    });

    ['test', 'ordering', 'style.choices.bullet', 'style.columns'].forEach(function(variable) {
        $scope.$watch(variable, function(newValue) {
        }, true);
    });
    }
});
**/
