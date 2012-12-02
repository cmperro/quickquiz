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

    $scope.shuffleChoices = function() {
        angular.forEach($scope.questions, function(question) {
            question.choices.shuffle();
        });
    };

    $scope.$on(ADD_QUESTION, function (event, newQuestion) {
        $scope.questions.push(newQuestion);
    });


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
            //console.log("CHANGED: ", variable, "=", newValue);
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

// http://stackoverflow.com/questions/3954438/remove-item-from-array-by-value
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax,1 );
        }
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

            plainDOM.addClass('editable');

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
                display.text(ngModel.$viewValue || '\xa0');
            });
        }
    };
}).directive('sortable', function($timeout) {
    return {
        restrict: 'A',
        require: ['ngModel'],
        link: function(scope, element, attrs) {

            var model = scope.$eval(attrs.ngModel);
            var placeholder = scope.$eval(attrs.placeholder);
            var indexMapper = attrs.indexMapper ? scope.$eval(attrs.indexMapper) : function(i) { return i; };

            // Used to map between indicies
            var getModelIndex = function(ui) {
                var index = ui.placeholder.index();
                if (index > ui.item.data('start')) {
                    index -= 1;
                }
                return indexMapper(index);
            };

            // Holds the model object that the dragged element represents
            var draggedModelObject = null;

            element.sortable({
                // Options
                appendTo: document.body,
                forceHelperSize: true,
                forcePlaceholderSize: false,
                helper: 'clone',
                placeholder: 'placeholder',

                // Events
                start: function(event, ui) {
                    ui.item.data('start', ui.item.index());
                    scope.$apply(function() {
                        draggedModelObject = model.splice(getModelIndex(ui), 1, placeholder)[0];
                    });
                },
                change: function(event, ui) {
                    var modelIndex = getModelIndex(ui);
                    scope.$apply(function() {
                        model.remove(placeholder);
                        model.splice(modelIndex, 0, placeholder);
                    });
                },
                stop: function(event, ui) {
                    scope.$apply(function() {
                        var modelIndex = model.indexOf(placeholder);
                        model.splice(modelIndex, 1, draggedModelObject);
                    });
                }
            }).disableSelection();

        }
    };
}).directive('fixedHeights', function($timeout) {
    // Make sure that the elements are the right size
    return {
        restrict: 'A',
        require: ['ngModel'],
        link: function(scope, element, attrs) {
            scope.$watch(attrs.ngModel, function() {
                console.log('fffiirrreee');
                $timeout(function() {
                    element.children().each(function(childIndex) {
                        if (childIndex % 2 === 0) {
                            var rowElements = $(this).add($(this).next());
                            rowElements.css({'height': ''});

                            // Find the tallest element in the set
                            var height = Math.max.apply(null, rowElements.map(
                                function(){
                                    return $(this).height();
                                }
                            ));

                            rowElements.height(height);
                        }
                    });
                });
            }, true);
        }
    };
}).filter('reorder', function() {
    return function(oldorder, orderingFunction, $scope) {
        var neworder = [];
        oldorder.forEach(function(value, index) {
            neworder[orderingFunction(index)] = value;
        });
        return neworder;
    };
});
