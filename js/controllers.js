var ADD_QUESTION = 'ADD_QUESTION';
var REQUEST_EDIT = 'EDIT';
var DEFAULT_EDITOR_QUESTION = '';

quiz.controller('QuestionControl', function($scope) {
    $scope.questions = [];
    $scope.newQuestion = {text:'', choices: []};

    $scope.EDIT = REQUEST_EDIT;

    $scope.BULLET_STYLES = {
        // http://en.wikipedia.org/wiki/Unicode_Geometric_Shapes
        circle: function() { return '\u25EF'; },
        none: function() {return '&nbsp;';},
        number: function(index) {
            return (index+1) + '.';
        },
        letter: function(index) {
            return String.fromCharCode('A'.charCodeAt() + index) + '.';
        },
        square: function() { return '\u25A1'; },
    };

    $scope.FONTS = [
        {name: "Times New Roman", style: '"Times New Roman", Georgia, Serif'},
        {name: "Arial", style: 'arial, sans-serif'},
        {name: "Georgia", style: 'Georgia, Serif'},
    ];

    $scope.ORDERINGS = {
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
    };

    // Used during DnD of questions. This is the model of the palceholder
    // object as the user drags the question around.
    $scope.QUESTION_PLACEHOLDER = {
        text: 'PLACEHOLDER',
        choices: ['PLACEHOLDER', 'PLACEHOLDER', 'PLACEHOLDER']
    };

    $scope.CHOICE_PLACEHOLDER = '';

    $scope.directions = 'This quiz contains 9 questions. Good Luck!';

    $scope.style = {
        ordering: $scope.ORDERINGS.down,
        columns: 2,
        font: $scope.FONTS[1],
        choices: {
            bullet: 'circle'
        }
    };

    // Some weak sauce currying here, since I want to be able to swap orderings and columns numbers easily
    $scope.ordering = {
        index: function(index) {
            return $scope.style.ordering.index($scope.style.columns, index);
        },
        data: function(index) {
            return $scope.style.ordering.data($scope.style.columns, index);
        }
    };

    $scope.removeQuestion = function(question) {
        var index = $scope.questions.indexOf(question);
        $scope.questions.splice(index, 1);
    };

    $scope.removeChoice = function(question, index) {
        question.choices.splice(index, 1);
    };

    $scope.addChoice = function(question, index) {
        question.choices.splice(index, 0, '');
    };

    $scope.shuffleChoices = function() {
        angular.forEach($scope.questions, function(question) {
            question.choices.shuffle();
        });
    };

    $scope.clearQuestions = function () {
        console.log("Questions cleared");
        $scope.newQuestion.text = '';
        $scope.questions = [];
    };

    $scope.$on(ADD_QUESTION, function (event, newQuestion) {
        console.log("Received:", newQuestion);
        $scope.questions.push(newQuestion);
    });


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
            console.log("LOADED", variable, $scope[variable]);
        }
        $scope.$watch(variable, function(newValue) {
            localStorage[key] = JSON.stringify(newValue);
        }, true);
    });

    ['test', 'ordering', 'style.choices.bullet', 'style.columns'].forEach(function(variable) {
        $scope.$watch(variable, function(newValue) {
            console.log("CHANGED: ", variable, "=", newValue);
        }, true);
    });
});

quiz.controller('QuestionEditorControl', function($scope) {
    $scope.ChoiceAddedEvent = 'ChoiceAdded';

    function reset() {
        $scope.question = {
            questionText: DEFAULT_EDITOR_QUESTION,
            choices: []
        };
        $scope.choiceText = '';
    }
    reset();

    $scope.questionEditMode = function () {
        return $scope.questionText === DEFAULT_EDITOR_QUESTION;
    };

    $scope.addChoice = function ($event) {
        $scope.newQuestion.choices.push($scope.newChoiceText);
        $scope.newChoiceText = '';
    };

    $scope.removeChoice = function (index) {
        $scope.newQuestion.choices.splice(index, 1);
    };

    $scope.addQuestion = function () {
        var newQuestion = {
            text: $scope.newQuestion.text,
            choices: $scope.newQuestion.choices
        };
        console.log('Adding: ', newQuestion);
        $scope.questions.push(angular.copy(newQuestion));
        $scope.newQuestion.text = '';
        $scope.newQuestion.choices = [];
        console.log('Questions: ', $scope.questions);
    };
});
