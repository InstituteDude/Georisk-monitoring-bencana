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
exports.DisastersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const client_1 = require("@prisma/client");
const disasters_service_1 = require("./disasters.service");
const dto_1 = require("./dto");
const guards_1 = require("../auth/guards");
let DisastersController = class DisastersController {
    disastersService;
    constructor(disastersService) {
        this.disastersService = disastersService;
    }
    findAll(filter) {
        return this.disastersService.findAll(filter);
    }
    identify(lat, lng) {
        if (!lat || !lng) {
            return null;
        }
        return this.disastersService.identify(parseFloat(lat), parseFloat(lng));
    }
    getAsGeoJSON(type) {
        return this.disastersService.getAsGeoJSON(type);
    }
    getStatistics() {
        return this.disastersService.getStatistics();
    }
    findByType(type) {
        return this.disastersService.findByType(type);
    }
    findOne(id) {
        return this.disastersService.findOne(id);
    }
    create(dto) {
        return this.disastersService.create(dto);
    }
    update(id, dto) {
        return this.disastersService.update(id, dto);
    }
    remove(id) {
        return this.disastersService.remove(id);
    }
};
exports.DisastersController = DisastersController;
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.FilterDisasterZoneDto]),
    __metadata("design:returntype", void 0)
], DisastersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('identify'),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lng')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DisastersController.prototype, "identify", null);
__decorate([
    (0, common_1.Get)('geojson'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DisastersController.prototype, "getAsGeoJSON", null);
__decorate([
    (0, common_1.Get)('statistics'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DisastersController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('type/:type'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('type', new common_1.ParseEnumPipe(client_1.DisasterType))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DisastersController.prototype, "findByType", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DisastersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), guards_1.RolesGuard),
    (0, guards_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateDisasterZoneDto]),
    __metadata("design:returntype", void 0)
], DisastersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), guards_1.RolesGuard),
    (0, guards_1.Roles)(client_1.Role.ADMIN),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateDisasterZoneDto]),
    __metadata("design:returntype", void 0)
], DisastersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), guards_1.RolesGuard),
    (0, guards_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DisastersController.prototype, "remove", null);
exports.DisastersController = DisastersController = __decorate([
    (0, common_1.Controller)('disasters'),
    __metadata("design:paramtypes", [disasters_service_1.DisastersService])
], DisastersController);
//# sourceMappingURL=disasters.controller.js.map