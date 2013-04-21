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

quiz.directive('editable', function($timeout) {
    var editors = {};
    function safeApply(scope, func) {
        if (scope.$$phase !== '$digest' && scope.$$phase !== '$apply') {
            scope.$apply(function() {
                func();
            });
        } else {
            func();
        }
    }
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, plainDOM, iAttrs, ngModel) {

            // Used by CSS
            plainDOM.addClass('editable');

            // Setup the display
            var display = $('<span>').text(ngModel.$viewValue);

            // Setup the editor
            var editor = $('<input>')
                .attr({
                    'type': 'text',
                    'placeholder': iAttrs.placeholder || ''})
                .hide()
                .keypress(function(e) {
                    if (e.which === 13) {
                        switchToDisplayMode();
                        if (iAttrs.editableDone) {
                            scope.$eval(iAttrs.editableDone);
                        }
                    }
                });

            function switchToEditMode() {
                //console.log('here we go', display.text());
                editor.show().focus();
                display.hide();
            }

            function switchToDisplayMode() {
                editor.hide();
                display.show();
                safeApply(scope, function() {
                    ngModel.$setViewValue(editor.val());
                });
            }

            plainDOM.append(display);
            plainDOM.append(editor);

            scope.$watch(iAttrs.ngModel, function(newValue) {
                display.text(newValue);
                editor.val(newValue);
            });

            function setMode(editMode) {
                if (editMode) {
                    switchToEditMode();
                } else {
                    switchToDisplayMode();
                }
            }

            // Figure out when to know to switch between modes
            if (iAttrs.editableWhen) {
                scope.$watch(iAttrs.editableWhen, function(newVal) {
                    console.log(newVal);
                    if (typeof newVal !== 'undefined') {
                        setMode(newVal);
                    }
                });
                setMode(scope.$eval(iAttrs.editableWhen));
            } else {
                display.bind('click', switchToEditMode);
                editor.bind('blur change', switchToDisplayMode);
                switchToDisplayMode();
            }
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
