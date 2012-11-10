var ADD_QUESTION = 'ADD_QUESTION';

function QuestionControl($scope) {
    $scope.questions = [
        {text: 'Is the world round?', choices: ['Yes', 'No', 'Maybe' ]},
        {text: 'Is the world square?', choices: ['Yes', 'No', 'Maybe' ]}
    ];

    $scope.$on(ADD_QUESTION, function (event, newQuestion) {
        $scope.questions.push(newQuestion);
    });
}

function QuestionEditorControl($scope) {

    function reset() {
        $scope.questionText = '';
        $scope.choices = [];
        $scope.choiceText = '';
    }
    reset();


    $scope.addChoice = function () {
        $scope.choices.push($scope.choiceText);
        $scope.choiceText = '';
    };

    $scope.addQuestion = function () {
        $scope.$emit(ADD_QUESTION,
                     {text: $scope.questionText, choices: $scope.choices});
        reset();
    };
}
