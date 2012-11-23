var ADD_QUESTION = 'ADD_QUESTION';

function QuestionControl($scope) {
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

angular.module('quiz', []).directive('sortable', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, iElement, iAttrs) {
            var model = scope.$eval(iAttrs.ngModel);
            var start, end, changed;
            changed = false;
            console.log(iAttrs.sortable, iElement.find(iAttrs.sortable));
            iElement.find(iAttrs.sortable).sortable({
                connectWith: iAttrs.sortable,
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
}).directive('columnize', function($timeout) {
    var COLUMN_CLASS = 'column';
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs) {
            scope.$watch(attrs.ngModel, function() {
                console.log('changed');
                $timeout(function(){
                    // Layout into columns
                    left = $('<div>').attr({
                        style: "width:50%;float:left",
                        class: COLUMN_CLASS
                    });
                    var right = left.clone();
                    element.children().each(function(index, child) {
                        if (index % 2 === 0) {
                            left.append($(child));
                        }
                    });
                    right.append(element.children());
                    var columns = $(left).add(right);
                    element.append(columns);

                    // Implement DnD, model updating sorting
                    var model = scope.$eval(attrs.ngModel);
                    var start, end, changed;
                    changed = false;
                    if (columns.hasClass('ui-sortable')) {
                        console.log("Found sortable");
                    }
                    console.log("column class match", $('.' + COLUMN_CLASS));
                    columns.sortable({
                        connectWith: '.' + COLUMN_CLASS,
                        start: function(event, ui) {
                            start = ui.item.index();
                        },
                        update: function() {
                            changed = true;
                        },
                        stop: function(event, ui) {
                            end = ui.item.index();
                            if (changed) {
                                //Swap elements at index start and end
                                var temp = model[start];
                                model[start] = model[end];
                                model[end] = temp;
                            }
                            changed = false;
                        }
                    }).disableSelection();
                },0);
            });
        }
    };
});

