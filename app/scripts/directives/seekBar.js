(function(){
  function seekBar($document){

    /**
     * @function calculatePercent
     * @desc Calculates the horizontal percent along the seek bar where the event occurred.
     * @param   {Object} seekBar  holds the element that matches the directive, which we can call jQuery methods on.
     * @param   {Object} event    javascript event object, or click handler
     * @returns {Integer}         the calculated percentage value of where the event occured on the seekbar.
     */
    var calculatePercent = function(seekBar, event) {
      var offsetX = event.pageX - seekBar.offset().left;
      var seekBarWidth = seekBar.width();
      var offsetXPercent = offsetX / seekBarWidth;
      offsetXPercent = Math.max(0, offsetXPercent);
      offsetXPercent = Math.min(1, offsetXPercent);
      return offsetXPercent;
    };

    return {
      templateUrl: '/templates/directives/seek_bar.html',
      replace: true,
      restrict: 'E',
      scope: {},
      link: function(scope, element, attributes){
        scope.value = 0;
        scope.max = 100;

        var seekBar = $(element);

        /**
         * @function percentString
         * @desc calculates a percent based on the value and maximum value of a seek bar
         * @returns {String} as the relevant percentage
         */
        var percentString = function () {
          var value = scope.value;
          var max = scope.max;
          var percent = value / max * 100;
          return percent + "%";
        };

        /**
         * @function fillStyle
         * @desc is a public method that provides the style syntax used to edit the seek bar display
         * @returns {Object} with the css property as the key, and the value a string of the percentage
         */
        scope.fillStyle = function() {
          return {width: percentString()};
        };

        scope.onClickSeekBar = function(event){
          var percent = calculatePercent(seekBar, event);
          scope.value = percent * scope.max;
        };

        scope.trackThumb = function() {
          $document.bind('mousemove.thumb', function(event) {
            var percent = calculatePercent(seekBar, event);
            scope.$apply(function() {
              scope.value = percent * scope.max;
            });
          });

          $document.bind('mouseup.thumb', function() {
            $document.unbind('mousemove.thumb');
            $document.unbind('mouseup.thumb');
          });
        };
      }
    };
  }

  angular
    .module('blocJams')
    .directive('seekBar', ['$document', seekBar]);
})();
