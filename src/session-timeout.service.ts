import * as ngIdle from "angular-idle";
import * as angularSessionTimeout from "./index.d";
import * as ngDialog from "ng-dialog";
import * as angularModal from "angular-modal/src/index.d";

const modalTemplate: any = require("./session-timeout-modal.template.html");
let timeoutModal: ngDialog.IDialogOpenResult;

export default class TimeoutService {
    static $inject = ["$http", "$rootScope", "Idle", "angularModalService"];

    constructor(
        private $http: ng.IHttpService,
        private $rootScope: ng.IRootScopeService,
        private Idle: angular.idle.IIdleService,
        private angularModalService: angularModal.ModalService
    ) { }

    public setup(setupSettings: angularSessionTimeout.SetupSettings) {
        let applyTimeout = (settings: angularSessionTimeout.TimeoutSettings) => {
            this.onIdleStart(settings.inactiveTimeoutInSeconds, settings.warningDurationInSeconds);
            this.onIdleTimeout(settings.warningDurationInSeconds, setupSettings.callthrough);
            this.watch();
        };

        if (setupSettings.getTimeoutSettingsApi) {
            this.$http.get(setupSettings.getTimeoutSettingsApi)
                .then((response: any) => {
                    let settings: angularSessionTimeout.TimeoutSettings = response.data;
                    applyTimeout(settings);
                })
                .catch(error => {
                    setupBackup();
                });
        }
        else {
            setupBackup();
        }

        function setupBackup() {
            applyTimeout({
                warningDurationInSeconds: setupSettings.backupUserIdleTimeoutCountdownInSeconds,
                inactiveTimeoutInSeconds: setupSettings.backupUserIdleWarningInSeconds
            });
        }
    };

    public unwatch() {
        this.Idle.unwatch();
    };

    public watch() {
        this.Idle.watch();
    };

    // private
    private onIdleStart(idleTime: number, timeoutTime: number) {
        this.Idle.setIdle(idleTime);
        this.toggleIdleStartWatch = this.$rootScope.$on("IdleStart", () => {
            timeoutModal = this.angularModalService.openModal({
                template: modalTemplate,
                inj: {}
            });
            let toggleOnLocationChange = this.$rootScope.$on("$locationChangeStart", () => {
                timeoutModal.close();
                toggleOnLocationChange();
                toggleOnIdleEnd();
            });
            let toggleOnIdleEnd = this.$rootScope.$on("IdleEnd", () => {
                timeoutModal.close();
                toggleOnIdleEnd();
                toggleOnLocationChange();
            });
        });
    };

    private onIdleTimeout(timeoutTime: number, callthrough?: Function) {
        this.Idle.setTimeout(timeoutTime);
        this.toggleIdleTimeoutWatch = this.$rootScope.$on("IdleTimeout", () => {
            timeoutModal.close();
            callthrough();
            this.unwatch();
        });
    };

    private toggleIdleStartWatch = function () { };

    private toggleIdleTimeoutWatch = function () { };
}