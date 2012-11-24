var ADD_QUESTION = 'ADD_QUESTION';

function QuestionControl($scope) {
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

    $scope.questions = [
        {text: 'Is the world round?', choices: ['Yes', 'No', 'Maybe' ]},
        {text: 'Is the world square?', choices: ['Yes', 'No', 'Maybe' ]},
        {text: 'Is the world square?', choices: ['Yes', 'No', 'Maybe' ]},
        {text: 'Is the world square?', choices: ['Yes', 'No', 'Maybe' ]},
        {text: 'Is the world square?', choices: ['Yes', 'No', 'Maybe' ]},
        {text: 'Is the world square?', choices: ['Yes', 'No', 'Maybe' ]},
        {text: 'Is the world square?', choices: ['Yes', 'No', 'Maybe' ]},
        {text: 'Favorite animal?', choices: ['Cat', 'Dog', 'Elephant' ]}
    ];

    $scope.style = {
        font: $scope.FONTS[1],
        choices: {
            bullet: 'circle'
        }
    };

    $scope.$on(ADD_QUESTION, function (event, newQuestion) {
        $scope.questions.push(newQuestion);
    });

    $scope.removeQuestion = function(question) {
        var index = $scope.questions.indexOf(question);
        $scope.questions.splice(index, 1);
    };

    $scope.removeChoice = function(question, index) {
        question.choices.splice(index, 1);
    };

    $scope.shuffleChoices = function() {
        angular.forEach($scope.questions, function(question) {
            question.choices.shuffle();
        });
    };

    // Handle persistence across refresh, by saving models to local storage as JSON.
    ['questions', 'style'].forEach(function(variable) {
        var key = 'QuicklyQuiz.' + variable;
        if (localStorage[key]) {
            $scope[variable] = JSON.parse(localStorage[key]);
        }
        $scope.$watch(variable, function(newValue) {
            localStorage[key] = JSON.stringify(newValue);
        }, true);
    });
}

function QuestionEditorControl($scope) {

    $scope.ChoiceAddedEvent = 'ChoiceAdded';

    function reset() {
        $scope.questionText = '';
        $scope.choices = [];
        $scope.choiceText = '';
    }
    reset();


    $scope.addChoice = function ($event) {
        $scope.choices.push($scope.choiceText);
        $scope.choiceText = '';
        $scope.$emit($scope.ChoiceAddedEvent);
    };

    $scope.removeChoice = function (index) {
        $scope.choices.splice(index, 1);
    };

    $scope.addQuestion = function () {
        $scope.$emit(ADD_QUESTION,
                     {text: $scope.questionText, choices: $scope.choices});
        reset();
    };
}

// Procured from: http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
Array.prototype.shuffle = function () {
  var i = this.length, j, tempi, tempj;
  if ( i === 0 ) {
      return false;
  }
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     tempi = this[i];
     tempj = this[j];
     this[i] = tempj;
     this[j] = tempi;
   }
  return this;
};

angular.module('quiz', []).directive('focusOn', function() {
    return {
        restrict: 'A',
        link: function(scope, iElement, iAttrs) {
            var event_name = scope.$eval(iAttrs.focusOn);
            scope.$on(event_name, function() {
                iElement[0].focus();
            });
        }
    };
}).directive('editable', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, plainDOM, iAttrs, ngModel) {

            // Setup the display
            var display = $('<span></span>');
            display.text(ngModel.$modelValue);
            display.bind('click', switchToEditMode);
            function switchToEditMode() {
                editor.val(display.text()).show().focus();
                display.hide();
            }
            plainDOM.append(display);

            // Setup the editor
            var editor = $('<input type="text" ng-model="'+ iAttrs.ngModel + '"></input>');
            editor.hide();
            editor.bind('blur change', switchToDisplayMode);
            function switchToDisplayMode() {
                editor.hide();
                display.show();
                scope.$apply(function() {
                    ngModel.$setViewValue(editor.val());
                });
            }
            plainDOM.append(editor);

            scope.$watch(iAttrs.ngModel, function() {
                display.text(ngModel.$viewValue || '');
            });
        }
    };
}).directive('sortable', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs) {
            var model = scope.$eval(attrs.ngModel);
            element.sortable({
                start: function(event, ui) {
                    ui.item.data('start', ui.item.index());
                },
                update: function(event, ui) {
                    var start = ui.item.data('start'),
                        end = ui.item.index();

                    scope.$apply(function() {
                        //Swap elements at the start and end indicies.
                        var temp = model[start];
                        model[start] = model[end];
                        model[end] = temp;
                    });
                }
            }).disableSelection();
        }
    };
});
