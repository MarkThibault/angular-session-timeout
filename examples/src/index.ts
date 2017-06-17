import "./app.scss";
import "./favicon.png";

import * as angular from "angular";
import "../../dist/angular-session-timeout";
import MainController from "./main.controller";

angular
    .module("app", ["angularModalModule", "angularSessionTimeoutModule"])
    .controller("MainController", MainController);