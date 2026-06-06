"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTareaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_tarea_dto_1 = require("./create-tarea.dto");
class UpdateTareaDto extends (0, mapped_types_1.PartialType)(create_tarea_dto_1.CreateTareaDto) {
}
exports.UpdateTareaDto = UpdateTareaDto;
//# sourceMappingURL=update-tarea.dto.js.map