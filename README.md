# Angular Session Timeout

Angular Session Timeout is an Angular service for displaying a timeout modal.

## Getting Started

### Prerequisites

It is required to have "angular-modal" installed.

### Installing

Add the following to your dependencies:
```
"angular-modal": "git://github.com/MarkThibault/angular-modal.git",
```

### Usage

Inject into angular module:
```
angular
    .module("app", ["angularSessionTimeout"])
    .run(['angularTimeoutService', 'replaceWithSignoutService', (
            angularTimeoutService: any,
            replaceWithSignoutService: any
        ) => {
            timeoutService.setup({
                backupUserIdleWarningInSeconds: 840, // default idle time if api fails
                backupUserIdleTimeoutCountdownInSeconds: 60, // default countdown if api fails
                getTimeoutSettingsApi: '/api/Account/SessionTimes', // api to get times
                callthrough: () => { replaceWithSignoutService.signOut(); } // method to call when countdown expires
            });
    ])
```

Inject into controller or service:
```
static $inject = ["angularSessionTimeoutService"];
constructor(
    private angularSessionTimeoutService: angularSessionTimeoutService
) {}
```

## Running the tests


## Deployment



## Built With


## Contributing

## Versioning

## Authors

## License

## Acknowledgments
