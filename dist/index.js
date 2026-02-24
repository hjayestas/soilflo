"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importDefault(require("express"));
const database = require("./database");
const Site = require("./models/Site");
const Truck = require("./models/Truck");
const Ticket = require("./models/Ticket");
const fs = __importDefault(require("fs"));
const app = (0, express.default)();
const PORT = process.env.PORT || 3000;

(async () => {
    await (0, database.connectWithRetry)();
})();

app.post('/tickets', async (req, res) => {
    try {
        const tickets = req.body.tickets || [];
        console.log("Received tickets:", tickets);
        await (0, Ticket.createTickets)(tickets);
        res.status(200).json({ message: "Tickets created" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create tickets" });
    }
});
app.get('/tickets', async (req, res) => {
    try {
        const { siteName, startDate, endDate, page, pageSize } = req.query;
        const tickets = await (0, Ticket.fetchTickets)(siteName, startDate ? new Date(startDate) : new Date(), endDate ? new Date(endDate) : new Date(), parseInt(page) || 1, parseInt(pageSize) || 50);
        res.json(tickets);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch tickets" });
    }
});
app.get('/trucks', async (req, res) => {
    try {
        const trucks = await (0, Truck.fetchTrucks)();
        res.json(trucks);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch trucks" });
    }
});
app.get('/sites', async (req, res) => {
    try {
        const sites = await (0, Site.fetchSites)();
        res.json(sites);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch sites" });
    }
});
async function _populateTables() {
    const raw = fs.default.readFileSync("./SitesJSONData.json", "utf-8");
    const data = JSON.parse(raw);
    const allRecords = Object.values(data).flatMap((value) => value);
    (0, Site.createSites)(allRecords);
    const raw1 = fs.default.readFileSync("./TrucksJSONData.json", "utf-8");
    const data1 = JSON.parse(raw1);
    const allRecords1 = Object.values(data1).flatMap((value) => value);
    (0, Truck.createTrucks)(allRecords1);
}
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
async function main() {
    try {
        await database.sequelize.authenticate();
        console.log("Connected to database");
        await (0, Site.initSiteModel)();
        await (0, Truck.initTruckModel)();
        await (0, Ticket.initTicketModel)();
        await database.sequelize.sync({ alter: true });
        await _populateTables();
        console.log("Synced and created tables");
        console.log("Running server...");
    }
    catch (error) {
        console.error("Error:", error);
    }
}
main();
//# sourceMappingURL=index.js.map