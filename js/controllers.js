quiz.controller('QuestionEditorControl', function($scope, Quiz) {

    $scope.text = '';
    $scope.choices = [];
    $scope.quiz = Quiz;
    $scope.newChoice = '';

    /**
     * Ok kinda hacky to do this in the scope... not sure what's best.
     */
    $scope.moveFocusTo = function(selector) {
        $(selector).focus();
    };

    $scope.addChoice = function () {
        $scope.choices.push($scope.newChoice);
        $scope.newChoice = '';
    };

    $scope.removeChoice = function (index) {
        $scope.choices.splice(index, 1);
    };

    $scope.addQuestion = function () {
        Quiz.addQuestion({
            text: $scope.text,
            choices: $scope.choices
        });
        $scope.text = '';
        $scope.choices = [];
        $scope.newChoice = '';
    };
});

quiz.controller('QuizControl', function($scope, Quiz, Defaults, Persistence) {
    $scope.quiz = Quiz
    $scope.defaults = Defaults

    // See if we already have a quiz from a previous session.
    var default_data = $scope.quiz.data();
    var loaded_data = Persistence.load('quiz', {});
    var combined_data = Persistence.overlay(default_data, loaded_data);
    $scope.quiz.data(combined_data);

    // Save any changes to the quiz.
    $scope.$watch('quiz.data()', function(newValue) {
        Persistence.save('quiz', newValue);
    }, true);
});
