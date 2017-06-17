import * as angularSessionTimeoutService from "../../src/index.d";

export default class MainController {
    disableStartWatch: boolean = true;
    static $inject = ["$scope", "angularSessionTimeoutService"];
    constructor(
        private $scope: ng.IScope,
        private angularSessionTimeoutService: angularSessionTimeoutService
    ) {
        this.angularSessionTimeoutService.setup({
            backupUserIdleTimeoutCountdownInSeconds: 5,
            backupUserIdleWarningInSeconds: 5,
            callthrough: () => { this.watchStopped(); },
            getTimeoutSettingsApi: null
        });
    }

    startWatch() {
        this.disableStartWatch = true;
        this.angularSessionTimeoutService.watch();
    }

    stopWatch() {
        this.disableStartWatch = false;
        this.angularSessionTimeoutService.unwatch();
    }

    private watchStopped() {
        alert("Call through executed.");
        this.disableStartWatch = false;
        this.$scope.$apply();
    }
}