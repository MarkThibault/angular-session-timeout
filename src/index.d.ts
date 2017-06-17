// Type definitions for Angular Session Timeout
export as namespace angularSessionTimeout;
export = angularSessionTimeout;

declare namespace angularSessionTimeout {
    interface SetupSettings {
        backupUserIdleTimeoutCountdownInSeconds: number;
        backupUserIdleWarningInSeconds: number;
        callthrough?: Function;
        getTimeoutSettingsApi: string;
    }
    interface SessionTimeoutService {
        setup(setupSettings: SetupSettings);
        unwatch();
        watch();
    }
    interface TimeoutSettings {
        inactiveTimeoutInSeconds: number;
        warningDurationInSeconds: number;
    }
}