"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvacuationController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const evacuation_service_1 = require("./evacuation.service");
const dto_1 = require("./dto");
let EvacuationController = class EvacuationController {
    evacuationService;
    constructor(evacuationService) {
        this.evacuationService = evacuationService;
    }
    findAll(activeOnly) {
        const active = activeOnly !== 'false';
        return this.evacuationService.findAll(active);
    }
    getAsGeoJSON() {
        return this.evacuationService.getAsGeoJSON();
    }
    getStatistics() {
        return this.evacuationService.getStatistics();
    }
    findOne(id) {
        return this.evacuationService.findOne(id);
    }
    create(dto) {
        return this.evacuationService.create(dto);
    }
    update(id, dto) {
        return this.evacuationService.update(id, dto);
    }
    remove(id) {
        return this.evacuationService.remove(id);
    }
};
exports.EvacuationController = EvacuationController;
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('activeOnly')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EvacuationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('geojson'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EvacuationController.prototype, "getAsGeoJSON", null);
__decorate([
    (0, common_1.Get)('statistics'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EvacuationController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EvacuationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateEvacuationPointDto]),
    __metadata("design:returntype", void 0)
], EvacuationController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateEvacuationPointDto]),
    __metadata("design:returntype", void 0)
], EvacuationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EvacuationController.prototype, "remove", null);
exports.EvacuationController = EvacuationController = __decorate([
    (0, common_1.Controller)('evacuation'),
    __metadata("design:paramtypes", [evacuation_service_1.EvacuationService])
], EvacuationController);
//# sourceMappingURL=evacuation.controller.js.map