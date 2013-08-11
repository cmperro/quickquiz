quiz.directive('focusOnStart', function() {
    return  {
        link: function(scope, element, attrs) {
            element[0].focus();
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

quiz.directive('contenteditable', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      // view -> model
      elm.bind('blur', function() {
        scope.$apply(function() {
          ctrl.$setViewValue(elm.html());
        });
      });

      // model -> view
      ctrl.$render = function(value) {
        elm.html(value);
      };
    }
  };
});

quiz.directive('fixedHeights', function($timeout) {
    // Make sure that the elements are the right size
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            console.log(attrs.fixedHeights);
            scope.$watch(attrs.fixedHeights, function() {
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
