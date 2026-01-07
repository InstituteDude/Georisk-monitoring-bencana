"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvacuationModule = void 0;
const common_1 = require("@nestjs/common");
const evacuation_controller_1 = require("./evacuation.controller");
const evacuation_service_1 = require("./evacuation.service");
let EvacuationModule = class EvacuationModule {
};
exports.EvacuationModule = EvacuationModule;
exports.EvacuationModule = EvacuationModule = __decorate([
    (0, common_1.Module)({
        controllers: [evacuation_controller_1.EvacuationController],
        providers: [evacuation_service_1.EvacuationService],
        exports: [evacuation_service_1.EvacuationService],
    })
], EvacuationModule);
//# sourceMappingURL=evacuation.module.js.map