quiz.directive('focusOn', function() {
    return {
        restrict: 'A',
        link: function(scope, iElement, iAttrs) {
            var event_name = scope.$eval(iAttrs.focusOn);
            scope.$on(event_name, function() {
                iElement[0].focus();
            });
        }
    };
});

quiz.directive('ngEnter', function() {
    return function(scope, elm, attrs) {
        elm.bind('keypress', function(e) {
            if (e.charCode === 13) {
                scope.$apply(attrs.ngEnter);
            }
        });
    };
});

quiz.directive('ngLostFocus', function() {
    return function(scope, elm, attrs) {
        elm.bind('blur', function(e) {
            scope.$apply(attrs.ngLostFocus);
        });
    };
});

quiz.directive('editable', function($timeout) {
    return {
       restrict: "E",
       scope: {
           edit: '=edit',
           display: '=display',
       },
       template: '<span ng-hide="editMode" ng-click="editMode=true;">{{display}}</span>' +
                 '<input type="text" ng-model="edit" ng-show="editMode" ng-enter="editMode=false" ng-lost-focus="editMode=false" />',
       // Link function adds the editable class because I don't know how to just apply a class
       link: function(scope, elm) {
           elm.addClass('editable');
           scope.editMode = false;
           scope.$watch('editMode', function(value) {
               $timeout(function() {
                 elm.children('input').focus();
               });
           });
       }
    };
});

quiz.directive('sortable', function($timeout) {
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
});

quiz.directive('fixedHeights', function($timeout) {
    // Make sure that the elements are the right size
    return {
        restrict: 'A',
        require: ['ngModel'],
        link: function(scope, element, attrs) {
            scope.$watch(attrs.ngModel, function() {
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
});

quiz.filter('reorder', function() {
    return function(oldorder, orderingFunction, $scope) {
        var neworder = [];
        oldorder.forEach(function(value, index) {
            neworder[orderingFunction(index)] = value;
        });
        return neworder;
    };
});
