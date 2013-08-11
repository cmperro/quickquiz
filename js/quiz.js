var quiz = angular.module('quiz', []);

/**
 * Some javascript array augmentation that we use in our app.
 */

// Procured from: http://stackoverflow.com/questions/872310/javascript-swap-array-elements
// In place swap  of the elements in the array at indexA and indexB.
Array.prototype.swap = function(indexA, indexB) {
    if (indexA === indexB) {
        return this;
    }
    this[indexB] = this.splice(indexA, 1, this[indexB])[0];
    return this;
}

// Procured from: http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
Array.prototype.shuffle = function() {
  var i = this.length, j, tempi, tempj;
  if ( i === 0 ) {
      return this;
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
