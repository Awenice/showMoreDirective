/**
 * @ngdoc service
 * @name hit.main.showMoreService
 * @description
 * Service that provides constructor for create object with truncated text.
 *
 * @example
 * var truncatedTextObj = new TruncatedText("test test test", {
 *    wordsThreshold: 2
 *    // or charsThreshold: 2
 *    // or/and lineBreaksThreshold: 2
 * });
 *
 * console.log(truncatedTextObj);
 * // {
 * //   visibleText: "test test";
 * //   hiddenText: " test";
 * // }
 */

(function () {
    'use strict';

    angular
        .module('hit.main')
        .factory('showMoreService', showMoreService);

    showMoreService.$inject = [];

    function showMoreService () {
        TruncatedText.prototype = {
            constructor: TruncatedText,
            getLineBreaksTruncatedText: getLineBreaksTruncatedText,
            isTruncationApplies: isTruncationApplies,
            getTruncatedText: getTruncatedText
        };

        return TruncatedText;

        /**
         * @description
         * Create object with truncated text
         *
         * @param {string} text
         * @param {object} thresholdObj object with threshold options
         * @param {number} thresholdObj.lineBreaksThreshold number of line breaks for threshold
         * @param {number} thresholdObj.charsThreshold number of chars for threshold
         * @param {number} thresholdObj.wordsThreshold number of words for threshold
         *
         * @return {object} TruncatedText
         * @return {object} TruncatedText.visibleText
         * @return {object} TruncatedText.hiddenText
         */
        function TruncatedText (text, thresholdObj) {
            this.visibleText = text;
            this.hiddenText = '';
            this.getLineBreaksTruncatedText(thresholdObj.lineBreaksThreshold);
            if(this.isTruncationApplies(thresholdObj)) {
                this.getTruncatedText(thresholdObj);
            }
        }

        /**
         * @description
         * Truncate text by numbers of line breaks
         *
         * @param {number} lineBreaksThreshold number of line breaks for threshold
         */
        function getLineBreaksTruncatedText (lineBreaksThreshold) {
            var splitText = this.visibleText.split('\n');
            if (lineBreaksThreshold && splitText.length > lineBreaksThreshold) {
                this.visibleText = splitText.slice(0, lineBreaksThreshold).join('\n');
                this.hiddenText = ' ' + splitText.slice(lineBreaksThreshold).join('\n');
            }
        }

        /**
         * @description
         * Check if possible to trim text by numbers of chars or words
         *
         * @param {object} thresholdObj object with threshold options
         */
        function isTruncationApplies (thresholdObj) {
            return isCharsTruncationApplies(this.visibleText, thresholdObj.charsThreshold) ||
                isWordsTruncationApplies(this.visibleText, thresholdObj.wordsThreshold);
        }

        /**
         * @description
         * Truncate text by numbers of chars or words
         *
         * @param {object} thresholdObj object with threshold options
         */
        function getTruncatedText (thresholdObj) {
            if (thresholdObj.charsThreshold) {
                getCharsTruncatedText(this, thresholdObj.charsThreshold);
            } else {
                getWordsTruncatedText(this, thresholdObj.wordsThreshold);
            }
        }

        /**
         * @description
         * Check if possible to trim text by numbers of chars
         *
         * @param {string} text text for truncate
         * @param {number} charsThreshold number of chars for threshold
         */
        function isCharsTruncationApplies (text, charsThreshold) {
            return charsThreshold && text.length > charsThreshold;
        }

        /**
         * @description
         * Check if possible to trim text by numbers of words
         *
         * @param {string} text text for truncate
         * @param {number} wordsThreshold number of words for threshold
         */
        function isWordsTruncationApplies (text, wordsThreshold) {
            return wordsThreshold && text.split(' ').length > wordsThreshold;
        }

        /**
         * @description
         * Truncate text by numbers of chars
         *
         * @param {object} truncatedTextObj object with truncated text
         * @param {number} charsThreshold number of chars for threshold
         */
        function getCharsTruncatedText (truncatedTextObj, charsThreshold) {
            var tempVisibleText = truncatedTextObj.visibleText;
            truncatedTextObj.visibleText = truncatedTextObj.visibleText.substring(0, charsThreshold);
            truncatedTextObj.hiddenText = tempVisibleText.substring(charsThreshold) + truncatedTextObj.hiddenText;
        }

        /**
         * @description
         * Truncate text by numbers of words
         *
         * @param {object} truncatedTextObj object with truncated text
         * @param {number} wordsThreshold number of words for threshold
         */
        function getWordsTruncatedText (truncatedTextObj, wordsThreshold) {
            var splitText = truncatedTextObj.visibleText.split(' ');
            truncatedTextObj.visibleText = splitText.slice(0, wordsThreshold).join(' ');
            truncatedTextObj.hiddenText = ' ' + splitText.slice(wordsThreshold).join(' ') + truncatedTextObj.hiddenText;
        }
    }
})();
