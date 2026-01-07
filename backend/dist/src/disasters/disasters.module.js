"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisastersModule = void 0;
const common_1 = require("@nestjs/common");
const disasters_controller_1 = require("./disasters.controller");
const disasters_service_1 = require("./disasters.service");
let DisastersModule = class DisastersModule {
};
exports.DisastersModule = DisastersModule;
exports.DisastersModule = DisastersModule = __decorate([
    (0, common_1.Module)({
        controllers: [disasters_controller_1.DisastersController],
        providers: [disasters_service_1.DisastersService],
        exports: [disasters_service_1.DisastersService],
    })
], DisastersModule);
//# sourceMappingURL=disasters.module.js.map