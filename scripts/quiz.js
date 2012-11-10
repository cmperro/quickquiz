var ADD_QUESTION = 'ADD_QUESTION';

function QuestionControl($scope) {
    $scope.questions = [
        {text: 'Is the world round?', choices: ['Yes', 'No', 'Maybe' ]},
        {text: 'Is the world square?', choices: ['Yes', 'No', 'Maybe' ]}
    ];

    $scope.$on(ADD_QUESTION, function (event, newQuestion) {
        console.log(ADD_QUESTION, newQuestion);
        $scope.questions.push(newQuestion);
        console.log($scope.questions);
    });

    $scope.shuffleChoices = function() {
        angular.forEach($scope.questions, function(question) {
            question.choices.push("dcasdfasdf");
        })
        $scope.questions.push({text: "sdfsf", choices: [1,2, 3]});
        console.log($scope.questions)
    };
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

// Procured from: http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
function shuffle(array) {
  var i = array.length, j, tempi, tempj;
  if ( i == 0 ) return false;
  while ( --i ) {
     var j = Math.floor( Math.random() * ( i + 1 ) );
     var tempi = array[i];
     var tempj = array[j];
     array[i] = tempj;
     array[j] = tempi;
   }
  return array;
}
