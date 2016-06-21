'use strict';

describe('Directive: hit.main.hitShowMore', function () {
    var element, htmlStub, $rootScope, $scope, $compile, text, charsThreshold, wordsThreshold, lineBreaksThreshold,
        customMoreLabel, customLessLabel;

    beforeEach(module('hit.main'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    beforeEach(function () {
        $scope = $rootScope.$new();
        text = '';
        charsThreshold = null;
        wordsThreshold = null;
        lineBreaksThreshold = null;
        customMoreLabel = '';
        customLessLabel = '';
    });

    function createElement () {
        htmlStub = '<div hit-show-more="text" ' +
            'hit-show-more-chars-threshold="' + charsThreshold + '" ' +
            'hit-show-more-words-threshold="' + wordsThreshold + '" ' +
            'hit-show-more-line-breaks-threshold="' + lineBreaksThreshold + '" ' +
            'hit-show-more-full-label="' + customMoreLabel + '" ' +
            'hit-show-more-less-label="' + customLessLabel + '">' +
            '</div>';
        element = angular.element(htmlStub);
        element = $compile(element)(angular.extend($scope, {
            text: text,
            charsThreshold: charsThreshold,
            wordsThreshold: wordsThreshold,
            lineBreaksThreshold: lineBreaksThreshold,
            customMoreLabel: customMoreLabel,
            customLessLabel: customLessLabel
        }));
        $scope.$digest();
    }

    it('should create text without truncate', function () {
        text = 'Test element';
        createElement();

        expect(element.text()).toBe(text);
    });

    it('should create text without truncate, because text shorter then chars limit', function () {
        text = 'Test element';
        charsThreshold = 20;
        createElement();

        expect(element.text()).toBe(text);
    });

    it('should create text without truncate, because text shorter then words limit', function () {
        text = 'Test element';
        wordsThreshold = 5;
        createElement();

        expect(element.text()).toBe(text);
    });

    it('should create text without truncate, because line breaks less then words limit', function () {
        text = 'Test element';
        lineBreaksThreshold = 5;
        createElement();

        expect(element.text()).toBe(text);
    });

    it('should create truncated text, because text longer then chars limit', function () {
        text = 'Test element Test element Test element Test element Test element';
        charsThreshold = 6;
        var truncatedText = text.substring(charsThreshold) + " <<";
        createElement();

        expect(element.find(".show-more-truncated-text").hasClass("ng-hide")).toBeTruthy();
        expect(element.find(".show-more-truncated-text").text()).toBe(truncatedText);

        element.find(".show-more-link").first().trigger("click");
        expect(element.find(".show-more-truncated-text").hasClass("ng-hide")).toBeFalsy();
    });

    it('should create truncated text, because text longer then words limit', function () {
        text = 'Test \n element Test \n element \n Test\n element\n Test\n \n \n element Test element';
        lineBreaksThreshold = 5;
        var truncatedText = ' ' + text.split('\n').slice(lineBreaksThreshold).join('\n') + " <<";
        createElement();

        expect(element.find(".show-more-truncated-text").hasClass("ng-hide")).toBeTruthy();
        expect(element.find(".show-more-truncated-text").text()).toBe(truncatedText);

        element.find(".show-more-link").first().trigger("click");
        expect(element.find(".show-more-truncated-text").hasClass("ng-hide")).toBeFalsy();
    });

    it('should create truncated text, because text longer then words limit', function () {
        text = 'Test element Test element Test element Test element Test element';
        wordsThreshold = 5;
        var truncatedText = ' ' + text.split(' ').slice(wordsThreshold).join(' ') + " <<";
        createElement();

        expect(element.find(".show-more-truncated-text").hasClass("ng-hide")).toBeTruthy();
        expect(element.find(".show-more-truncated-text").text()).toBe(truncatedText);

        element.find(".show-more-link").first().trigger("click");
        expect(element.find(".show-more-truncated-text").hasClass("ng-hide")).toBeFalsy();
    });

    it('should create truncated text with default labels', function () {
        text = 'Test element Test element Test element Test element Test element';
        wordsThreshold = 5;
        createElement();

        expect(element.find(".show-more-link").text()).toBe(' >>');
        expect(element.find(".show-less-link").text()).toBe(' <<');
    });

    it('should create truncated text with custom labels(chars limit)', function () {
        text = 'Test element Test element Test element Test element Test element';
        charsThreshold = 5;
        customMoreLabel = 'Show more';
        customLessLabel = 'Show less';
        createElement();

        expect(element.find(".show-more-link").text()).toBe(' Show more');
        expect(element.find(".show-less-link").text()).toBe(' Show less');
    });

    it('should create truncated text with custom labels(words limit)', function () {
        text = 'Test element Test element Test element Test element Test element';
        wordsThreshold = 5;
        customMoreLabel = 'Show more';
        customLessLabel = 'Show less';
        createElement();

        expect(element.find(".show-more-link").text()).toBe(' Show more');
        expect(element.find(".show-less-link").text()).toBe(' Show less');
    });
});