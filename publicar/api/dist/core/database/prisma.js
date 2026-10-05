"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
require("../config/load-env");
const create_prisma_client_1 = require("./create-prisma-client");
exports.prisma = (0, create_prisma_client_1.createPrismaClient)();
//# sourceMappingURL=prisma.js.map