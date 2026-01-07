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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterDisasterZoneDto = exports.UpdateDisasterZoneDto = exports.CreateDisasterZoneDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateDisasterZoneDto {
    name;
    type;
    riskLevel;
    description;
    geometry;
    centroid;
    area;
    population;
    kelurahan;
    kecamatan;
    mitigation;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, type: { required: true, type: () => Object }, riskLevel: { required: true, type: () => Object }, description: { required: false, type: () => String }, geometry: { required: true, type: () => Object }, centroid: { required: false, type: () => Object }, area: { required: false, type: () => Number, minimum: 0 }, population: { required: false, type: () => Number, minimum: 0 }, kelurahan: { required: false, type: () => String }, kecamatan: { required: false, type: () => String }, mitigation: { required: false, type: () => String } };
    }
}
exports.CreateDisasterZoneDto = CreateDisasterZoneDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDisasterZoneDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.DisasterType),
    __metadata("design:type", String)
], CreateDisasterZoneDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.RiskLevel),
    __metadata("design:type", String)
], CreateDisasterZoneDto.prototype, "riskLevel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDisasterZoneDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateDisasterZoneDto.prototype, "geometry", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateDisasterZoneDto.prototype, "centroid", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateDisasterZoneDto.prototype, "area", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateDisasterZoneDto.prototype, "population", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDisasterZoneDto.prototype, "kelurahan", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDisasterZoneDto.prototype, "kecamatan", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDisasterZoneDto.prototype, "mitigation", void 0);
class UpdateDisasterZoneDto {
    name;
    type;
    riskLevel;
    description;
    geometry;
    centroid;
    area;
    population;
    kelurahan;
    kecamatan;
    mitigation;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String }, type: { required: false, type: () => Object }, riskLevel: { required: false, type: () => Object }, description: { required: false, type: () => String }, geometry: { required: false, type: () => Object }, centroid: { required: false, type: () => Object }, area: { required: false, type: () => Number, minimum: 0 }, population: { required: false, type: () => Number, minimum: 0 }, kelurahan: { required: false, type: () => String }, kecamatan: { required: false, type: () => String }, mitigation: { required: false, type: () => String } };
    }
}
exports.UpdateDisasterZoneDto = UpdateDisasterZoneDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDisasterZoneDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.DisasterType),
    __metadata("design:type", String)
], UpdateDisasterZoneDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.RiskLevel),
    __metadata("design:type", String)
], UpdateDisasterZoneDto.prototype, "riskLevel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDisasterZoneDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateDisasterZoneDto.prototype, "geometry", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateDisasterZoneDto.prototype, "centroid", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateDisasterZoneDto.prototype, "area", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateDisasterZoneDto.prototype, "population", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDisasterZoneDto.prototype, "kelurahan", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDisasterZoneDto.prototype, "kecamatan", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDisasterZoneDto.prototype, "mitigation", void 0);
class FilterDisasterZoneDto {
    type;
    riskLevel;
    kecamatan;
    search;
    page;
    limit;
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: false, type: () => Object }, riskLevel: { required: false, type: () => Object }, kecamatan: { required: false, type: () => String }, search: { required: false, type: () => String }, page: { required: false, type: () => Number, minimum: 1 }, limit: { required: false, type: () => Number, minimum: 1, maximum: 100 } };
    }
}
exports.FilterDisasterZoneDto = FilterDisasterZoneDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.DisasterType),
    __metadata("design:type", String)
], FilterDisasterZoneDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.RiskLevel),
    __metadata("design:type", String)
], FilterDisasterZoneDto.prototype, "riskLevel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterDisasterZoneDto.prototype, "kecamatan", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterDisasterZoneDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], FilterDisasterZoneDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], FilterDisasterZoneDto.prototype, "limit", void 0);
//# sourceMappingURL=disaster-zone.dto.js.map