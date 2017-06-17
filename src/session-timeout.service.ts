﻿import * as ngIdle from "angular-idle";
import * as angularSessionTimeout from "./index.d";

const modalTemplate = require("./sureid-session-timeout-modal.template.html");
let timeoutModal;

export default class TimeoutService {
    static $inject = ["$http", "$rootScope", "Idle", "sureidModalService"];

    constructor(
        private $http: ng.IHttpService,
        private $rootScope: ng.IRootScopeService,
        private Idle: angular.idle.IIdleService,
        private sureidModalService: any
    ) { }

    public setup(setupSettings: angularSessionTimeout.SetupSettings) {
        let applyTimeout = (settings: angularSessionTimeout.TimeoutSettings) => {
            this.onIdleStart(settings.inactiveTimeout, settings.warningDuration);
            this.onIdleTimeout(settings.warningDuration, setupSettings.callthrough);
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
            timeoutModal = this.sureidModalService.openModal({
                template: modalTemplate
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