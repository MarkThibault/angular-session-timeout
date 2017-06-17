import SessionTimeoutService from "./session-timeout.service";

describe("TimeoutService", () => {
    let
        // service
        // createNewService is a method so that if properties of injected services needs to change in a specific test,
        // a new controller can be changed after that service property is changed
        // NOTE: services must be injected in the same order as the real controller
        service: SessionTimeoutService,
        createNewService = () => {
            service = new SessionTimeoutService($http, $rootScope, Idle, angularModalService);
        },

        // injected services
        $http: ng.IHttpService,
        $httpBackend: ng.IHttpBackendService,
        $rootScope: ng.IRootScopeService,
        Idle: angular.idle.IIdleService,
        angularModalService: any,
        promiseService: DevScripts.Helpers.PromiseService, // promise service helps resolving service calls

        mockApiCall,
        mockSetup: any = {
            backupUserIdleWarningInSeconds: 20,
            backupUserIdleTimeoutCountdownInSeconds: 10,
            getTimeoutSettingsApi: '/api/Account/SessionTimes',
            callthrough: () => {}
        };

        // spys for services to prevent real ones from being called

    beforeEach(() => {
        angular.mock.module('waiverPortal', 'mock-timeoutService', ($httpProvider) => {
            var index = $httpProvider.interceptors.indexOf('httpResponseInterceptor');

            $httpProvider.interceptors.splice(index, 1);
        });
    });

    beforeEach(inject((_$http_, _$httpBackend_, _$rootScope_, _Idle_, _angularModalService_, _promiseService_) => {
        $http = _$http_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        promiseService = _promiseService_;
        Idle = _Idle_;
        angularModalService = _angularModalService_;

        spyOn($http, "get").and.callThrough();
        spyOn(angularModalService, "openModal").and.returnValue(promiseService.resolve());
        spyOn(Idle, "watch").and.callThrough();
        spyOn(Idle, "unwatch").and.callThrough();
        spyOn(Idle, "setIdle").and.callThrough();
        spyOn(Idle, "setTimeout").and.callThrough();

        mockApiCall = $httpBackend.expectGET('/api/Account/SessionTimes');
        $httpBackend.expectGET('App/WaiverPortal/EmployeeSearch/employee-search.template.html').respond(200, true);

        createNewService();
    }));

    describe("setup", () => {
        it("should send properly formatted data to the get waivers web api endpoint", () => {
            mockApiCall.respond(200, {
                inactiveTimeout: 840,
                warningDuration: 60
            })
            service.setup(mockSetup);
            expect($http.get).toHaveBeenCalledWith('/api/Account/SessionTimes');
            $httpBackend.flush();
            expect(Idle.watch).toHaveBeenCalled();
            expect(Idle.setIdle).toHaveBeenCalledWith(840);
            expect(Idle.setTimeout).toHaveBeenCalledWith(60);
            expect(Idle.getIdle()).toBe(840);
            expect(Idle.getTimeout()).toBe(60);
        });
        it("should send properly formatted data to the get waivers web api endpoint", () => {
            createNewService();
            mockApiCall.respond(400);
            service.setup(mockSetup);
            expect($http.get).toHaveBeenCalledWith('/api/Account/SessionTimes');
            $httpBackend.flush();
            expect(Idle.watch).toHaveBeenCalled();
            expect(Idle.setIdle).toHaveBeenCalledWith(20);
            expect(Idle.setTimeout).toHaveBeenCalledWith(10);
            expect(Idle.getIdle()).toBe(20);
            expect(Idle.getTimeout()).toBe(10);
        });
        //it("should, when the server returns an error response, return a rejected promise", () => {
        //    let rejected = false;

        //    $httpBackend.whenGET('/api/v1.0/employee/waivers/123').respond(400);
        //    service.get('123').then(() => { }, () => { rejected = true; });
        //    $httpBackend.flush();

        //    expect(rejected).toBe(true);
        //});
    });

    describe("unwatch", () => {
        it("should call Idle.unwatch", () => {
            service.unwatch();
            expect(Idle.unwatch).toHaveBeenCalled();
        });
    });

    describe("watch", () => {
        it("should call Idle.watch", () => {
            service.watch();
            expect(Idle.watch).toHaveBeenCalled();
        });
    });
});