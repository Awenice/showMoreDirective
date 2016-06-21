/**
 * @ngdoc directive
 * @name hit.main.hitShowMore
 *
 * @description
 * Truncates text and permits toggling the hidden part of the truncated text
 *
 * @scope
 * @param {string} text - text for truncating
 * @param {string} charsThreshold - number of visible chars
 * @param {string} wordsThreshold - number of visible words
 * @param {string} lineBreaksThreshold - number of visible paragraph
 * @param {string} customMoreLabel - custom text in for "show more" label. Default - ">>"
 * @param {string} customLessLabel - custom text in for "show less" label. Default - "<<"
 *
 * @example
 * text = "Some text text"
 *
 * <div hit-show-more="text"
 *      hit-show-more-words-threshold="2" or hit-show-more-chars-threshold="2"
 *      or/and hit-show-more-line-breaks-threshold="2"
 *      hit-show-more-full-label="Show more"
 *      hit-show-more-less-label="Show less">
 * </div>
 */

(function () {
    'use strict';

    angular
        .module('hit.main')
        .directive('hitShowMore', hitShowMore);

    hitShowMore.$inject = [
        '$compile',
        'showMoreService'
    ];

    function hitShowMore ($compile,
                          TruncatedText) {
        return {
            restrict: 'A',
            scope: {
                text: '=hitShowMore',
                charsThreshold: '@hitShowMoreCharsThreshold',
                wordsThreshold: '@hitShowMoreWordsThreshold',
                lineBreaksThreshold: '@hitShowMoreLineBreaksThreshold',
                customMoreLabel: '@hitShowMoreFullLabel',
                customLessLabel: '@hitShowMoreLessLabel'
            },
            link: link
        };

        function link ($scope, $element) {
            var threshold = {
                charsThreshold: parseInt($scope.charsThreshold, 10),
                wordsThreshold: parseInt($scope.wordsThreshold, 10),
                lineBreaksThreshold: parseInt($scope.lineBreaksThreshold, 10)
            };

            $scope.open = false;

            $scope.toggleShow = function () {
                $scope.open = !$scope.open;
            };

            $scope.$watch('text', function () {
                $element.empty();
                var truncatedTextObj = new TruncatedText($scope.text, threshold);
                applyText($element, $scope, truncatedTextObj);
            });
        }

        function applyText ($element, $scope, truncatedTextObj) {
            if(truncatedTextObj.hiddenText) {
                applyTruncatedText($element, $scope, truncatedTextObj);
            } else {
                applyNotTruncatedText($element, truncatedTextObj.visibleText);
            }
        }

        function applyTruncatedText ($element, $scope, truncatedTextObj) {
            var el = angular.element('<span>' +
                truncatedTextObj.visibleText +
                '<span class="show-more-link" ' +
                'ng-click="toggleShow()"' +

                'ng-show="!open"> ' +
                ($scope.customMoreLabel ? $scope.customMoreLabel : '>>') +
                '</span>' +
                '<span ng-show="open" class="show-more-truncated-text">' +
                truncatedTextObj.hiddenText +
                '<span class="show-less-link"' +
                'ng-click="toggleShow()"> ' +
                ($scope.customLessLabel ? $scope.customLessLabel : '<<') +
                '</span>' +
                '</span>' +
                '</span>');
            $compile(el)($scope);
            $element.append(el);
        }

        function applyNotTruncatedText ($element, text) {
            $element.append(text);
        }
    }
})();
