import * as angular from "angular";
import "ng-idle";
import SessionTimeoutService from "./session-timeout.service";

angular
    .module("angularSessionTimeout", [
        "ngIdle"
    ])
    .service("angularSessionTimeoutService", SessionTimeoutService);

export interface SessionTimeout {
    Service: SessionTimeoutService;
}