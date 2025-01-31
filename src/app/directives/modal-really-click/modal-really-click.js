/**
 * @author    Martin Micunda {@link http://martinmicunda.com}
 * @copyright Copyright (c) 2015, Martin Micunda
 * @license   GPL-3.0
 */
'use strict';

import {Directive, Inject} from '../../ng-decorators'; // jshint unused: false

const MODAL = new WeakMap();
//start-non-standard
@Directive({
    selector: 'mm-really-click'
})
//end-non-standard
class MmReallyClick {
    constructor($modal) {
        this.restrict = 'A';
        this.scope = {
            mmReallyClick: '&'
        };
        MODAL.set(this, $modal);
    }

    link(scope, element, attrs) {
        element.bind('click', () => {
            const modalInstance = MODAL.get(MmReallyClick.instance).open({
                template: `
                    <div class="modal-header">
                        <button type="button" class="close" ng-click="vm.cancel()">×</button>
                        <h4 class="modal-title">${attrs.mmReallyHeader}</h4>
                    </div>
                    <div class="modal-body">
                        <p>${attrs.mmReallyMessage}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-sm btn-white" ng-click="vm.cancel()">Cancel</button>
                        <button class="btn btn-sm btn-success" ng-click="vm.ok()">OK</button>
                    </div>
                `,
                controller: ['$modalInstance', function($modalInstance) {  // do not use arrow function as 'this' doesn't work
                    const vm = this;

                    vm.ok = () => $modalInstance.close();

                    vm.cancel = () => $modalInstance.dismiss('cancel');
                }],
                controllerAs: 'vm'
            });

            modalInstance.result.then( () => scope.mmReallyClick() );
        });
    }

    //start-non-standard
    @Inject('$modal')
    //end-non-standard
    static directiveFactory($modal){
        MmReallyClick.instance = new MmReallyClick($modal);
        return MmReallyClick.instance;
    }
}
