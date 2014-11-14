/**
 * @license ng-bs-daterangepicker v0.0.8
 * (c) 2013 Luis Farzati http://github.com/luisfarzati/ng-bs-daterangepicker
 * License: MIT
 */
(function (angular) {
    'use strict';

    angular.module('ngBootstrap', []).directive('input', ['$compile', '$parse', function ($compile, $parse) {
        return {
            restrict: 'E',
            require: '?ngModel',
            link: function ($scope, $element, $attributes, ngModel) {
                if ($attributes.type !== 'daterange' || ngModel === null) return;

                var options = {};
                options.format = $attributes.format || 'YYYY-MM-DD HH:mm';
                options.separator = $attributes.separator || ' - ';
                options.minDate = $attributes.minDate && moment($attributes.minDate);
                options.maxDate = $attributes.maxDate && moment($attributes.maxDate);
                options.dateLimit = $attributes.limit && moment.duration.apply(this, $attributes.limit.split(' ').map(function (elem, index) {
                    return index === 0 && parseInt(elem, 10) || elem;
                }));
                options.ranges = $attributes.ranges && $parse($attributes.ranges)($scope);
                options.locale = $attributes.locale && $parse($attributes.locale)($scope);
                options.opens = $attributes.opens && $parse($attributes.opens)($scope);
                if ($attributes.timePicker == "true") {
                    options.timePicker = true;
                }
                options.timePickerIncrement = $attributes.timePickerIncrement || 30;
                if ($attributes.timePicker12Hour == "false") {
                    options.timePicker12Hour = false;
                }
                if ($attributes.singleDatePicker == "true") {
                    options.singleDatePicker = true;
                }

                if ($attributes.singleDatePickerFocus == "start") {
                    options.singleDatePickerFocus = "start";
                } else if ($attributes.singleDatePickerFocus == "end") {
                    options.singleDatePickerFocus = "end";
                }

                if ($attributes.dateLimit == "true") {
                    options.dateLimit = true;
                }
                if ($attributes.showDropdowns == "true") {
                    options.showDropdowns = true;
                }
                if ($attributes.showWeekNumbers == "true") {
                    options.showWeekNumbers = true;
                }
                options.buttonClasses = $attributes.buttonClasses || ['btn', 'btn-small'];
                options.applyClass = $attributes.applyClass || 'btn-success';
                options.cancelClass = $attributes.cancelClass || 'btn-default';

                function format(date) {
                    return date.format(options.format);
                }

                function formatted(dates) {
                    return [format(dates.startDate), format(dates.endDate)].join(options.separator);
                }

                ngModel.$formatters.unshift(function (modelValue) {
                    if (!modelValue) return '';
                    return modelValue;
                });

                ngModel.$parsers.unshift(function (viewValue) {
                    return viewValue;
                });

                ngModel.$render = function () {
                    if (!ngModel.$viewValue || !ngModel.$viewValue.startDate) return;
                    $element.val(formatted(ngModel.$viewValue));
                };

                $scope.$watch($attributes.ngModel, function (modelValue) {
                    if (!modelValue || (!modelValue.startDate)) {
                        ngModel.$setViewValue({startDate: moment().startOf('day'), endDate: moment().endOf('day')});
                        return;
                    }

                    if ($element.data('daterangepicker')) {
                        $element.data('daterangepicker').startDate = modelValue.startDate;
                        $element.data('daterangepicker').endDate = modelValue.endDate;
                        $element.data('daterangepicker').updateView();
                        $element.data('daterangepicker').updateCalendars();
                        $element.data('daterangepicker').updateInputText();
                    }

                });

                $element.daterangepicker(options, function (start, end) {
                    $scope.$apply(function () {
                        ngModel.$setViewValue({startDate: start, endDate: end});
                        ngModel.$render();
                    });
                });
            }
        };
    }]);

})(angular);
