/**
 * @author    Martin Micunda {@link http://martinmicunda.com}
 * @copyright Copyright (c) 2015, Martin Micunda
 * @license   GPL-3.0
 */
'use strict';

/**
 * Stubbing of HTTP requests for backend-less frontend testing
 */
import 'angular-mocks';
import angular from 'angular';
import {Config, Run, Inject} from '../../ng-decorators'; // jshint unused: false

class ConfigurationTest {
    //start-non-standard
    @Config()
    @Inject('$provide', 'localStorageServiceProvider')
    //end-non-standard
    static configFactory($provide, localStorageServiceProvider){
        // TODO: https://github.com/willmendesneto/keepr/blob/master/dist%2Fkeepr.js and http://willmendesneto.github.io/2014/10/28/creating-a-crud-in-a-single-angular-controller/ for crypto locale storage
        // enhance localStorageService
        $provide.decorator('localStorageService', ['$delegate', '$window', function($delegate, $window) {
            $delegate.findLocalStorageItems = function (query) {
                let i, results = [];
                for (i in $window.localStorage) {
                    if ($window.localStorage.hasOwnProperty(i)) {
                        if (i.match(query) || (!query && typeof i === 'string')) {
                            const value = JSON.parse($window.localStorage.getItem(i));
                            results.push(value);
                        }
                    }
                }
                return results;
            };

            return $delegate;
        }]);

        $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
        // use "e-scheduling-test" as a localStorage name prefix so app doesn’t accidently read data from another app using the same variable names
        localStorageServiceProvider.setPrefix('employee-scheduling-test');
    }
}

class OnRunTest {
    //start-non-standard
    @Run()
    @Inject('$httpBackend', 'localStorageService')
    //end-non-standard
    static runFactory($httpBackend, localStorageService){
        $httpBackend.whenGET(/^\w+.*/).passThrough();
        $httpBackend.whenPOST(/^\w+.*/).passThrough();

        // clear all locale storage for employee-scheduling-test
        localStorageService.clearAll();
    }
}
