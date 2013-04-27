var quiz = angular.module('quiz', []);

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



/**
 * Onload focus on the question editor.
 */
$(function() {
    $('#questionEditor').focus();
    $('#questionEditor > input').blur(function() {
        angular.element(this.parentNode).scope().$apply(function(scope) {
            scope.editor = false;
        });
    });
});
