"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SynapsPay = exports.Marketplace = exports.Payments = exports.Agent = void 0;
const agent_1 = require("./agent");
const payments_1 = require("./payments");
const marketplace_1 = require("./marketplace");
var agent_2 = require("./agent");
Object.defineProperty(exports, "Agent", { enumerable: true, get: function () { return agent_2.Agent; } });
var payments_2 = require("./payments");
Object.defineProperty(exports, "Payments", { enumerable: true, get: function () { return payments_2.Payments; } });
var marketplace_2 = require("./marketplace");
Object.defineProperty(exports, "Marketplace", { enumerable: true, get: function () { return marketplace_2.Marketplace; } });
class SynapsPay {
    agent;
    payments;
    marketplace;
    constructor() {
        this.agent = agent_1.Agent;
        this.payments = payments_1.Payments;
        this.marketplace = marketplace_1.Marketplace;
    }
}
exports.SynapsPay = SynapsPay;
