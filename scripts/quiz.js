var ADD_QUESTION = 'ADD_QUESTION';

function QuestionControl($scope) {
    $scope.questions = [
        {text: 'Is the world round?', choices: ['Yes', 'No', 'Maybe' ]},
        {text: 'Is the world square?', choices: ['Yes', 'No', 'Maybe' ]}
    ];

    $scope.$on(ADD_QUESTION, function (event, newQuestion) {
        $scope.questions.push(newQuestion);
    });

    $scope.shuffleChoices = function() {
        angular.forEach($scope.questions, function(question) {
            question.choices.shuffle();
        })
    };
}

function QuestionEditorControl($scope) {

    $scope.ChoiceAddedEvent = 'ChoiceAdded'

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
  if ( i == 0 ) return false;
  while ( --i ) {
     var j = Math.floor( Math.random() * ( i + 1 ) );
     var tempi = this[i];
     var tempj = this[j];
     this[i] = tempj;
     this[j] = tempi;
   }
  return this;
}

angular.module('quiz', []).directive('sortable', function() {
    return {
        restrict: 'A',
        link: function(scope, iElement, iAttrs) {
            var model = scope.$eval(iAttrs.sortable);
            var start, end, changed;
            changed = false;
            $(iElement).sortable({
                start: function(event, ui) {
                    start = ui.item.index();
                },
                update: function() {
                    changed = true;
                },
                stop: function(event, ui) {
                    end = ui.item.index();
                    if (changed) {
                        scope.$apply(function() {
                            // Swap elements at index start and end
                            var temp = model[start];
                            model[start] = model[end];
                            model[end] = temp;
                        });
                    }
                    changed = false;
                }
            });
        }
    };
}).directive('focusOn', function() {
    return {
        restrict: 'A',
        link: function(scope, iElement, iAttrs) {
            event_name = scope.$eval(iAttrs.focusOn);
            console.log(event_name);
            scope.$on(event_name, function() {
                iElement[0].focus();
            });
        }
    };
});
