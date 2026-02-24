import express, { Application, Request, Response } from 'express';
import { connectWithRetry, sequelize } from "./database";
import { initSiteModel, createSites, Site } from './models/Site';
import { initTruckModel, createTrucks, Truck } from './models/Truck';
import { initTicketModel, fetchTickets, TicketCreationAttributes, createTickets } from './models/Ticket';
import fs from "fs";

export const app: Application = express();
const PORT = process.env.PORT || 3000;
const SUPPORTED_MATERIALS = ["Soil"];

(async () => {
  await connectWithRetry();
})();

app.use(express.json());

app.post('/api/v1/tickets', async (req: Request, res: Response) => {
  try {
    const tickets = req.body || [];

    if (tickets.length === 0) {
      return res.status(400).json({ error: "No tickets provided" });
    }

    let dispatchedTimes = new Set<string>();

    let cleanedTickets: TicketCreationAttributes[] = [];

    const errors: any[] = [];

    tickets.forEach((ticket: any) => {

    const ticketErrors: object[] = [];

    if (!ticket.license) ticketErrors.push({status: 400, message: "Missing truck license"});
    if (!ticket.name) ticketErrors.push({status: 400, message: "Missing site name"});
    if (!ticket.material) ticketErrors.push({status: 400, message: "Missing material"});
    if (!ticket.dispatchedTime) ticketErrors.push({status: 400, message: "Missing dispatched time"});

    const dispatchedDate = new Date(ticket.dispatchedTime);
    if (!ticket.dispatchedTime || isNaN(dispatchedDate.getTime())) {
      ticketErrors.push({status: 400, message: "Invalid dispatched time"});
    } else if (dispatchedDate.getTime() > Date.now()) {
      ticketErrors.push({status: 403, message: "Future dispatched time is not allowed"});
    }

    if (!SUPPORTED_MATERIALS.includes(ticket.material)) {
      ticketErrors.push({status: 409, message: "Material not allowed"});
    }

    const key = `${ticket.license}-${dispatchedDate.toISOString()}`;
    if (dispatchedTimes.has(key)) {
      ticketErrors.push({status: 409, message: "Dispatched time conflict for this truck"});
    }

    if (ticketErrors.length > 0) {
      errors.push({ ticket, errors: ticketErrors });
    } else {
      dispatchedTimes.add(key);
      cleanedTickets.push(ticket);
    }
    });

    if (errors.length > 0) {
      return res.status(409).json({ errors });
    }

    await createTickets(cleanedTickets);
    return res.status(201).json({ message: "Tickets created successfully" });


  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: "Truck already dispatched at this time" });
    }
    return res.status(error.message || 500).json({ error: error.message || "Failed to create tickets" });
  }
});


app.get('/api/v1/tickets', async (req: Request, res: Response) => {
  try {
    const { name, startDate, endDate, page, pageSize } = req.query;
    const cleanStartDate = startDate ? new Date(startDate as string) : new Date(Date.now() - 24 * 60 * 60 * 1000); // Default to 24 hours ago
    const cleanEndDate = endDate ? new Date(endDate as string) : new Date();

    if (!name) {
      return res.status(400).json({ error: "Site name is required" });
    }

    if (cleanStartDate > cleanEndDate) {
      return res.status(400).json({ error: "Start date must be before end date" });
    }
    
    if (isNaN(cleanStartDate.getTime()) || isNaN(cleanEndDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const tickets = await fetchTickets(
      name as string,
      cleanStartDate,
      cleanEndDate,
      parseInt(page as string) || 1,
      parseInt(pageSize as string) || 50
    );

    return res.json(tickets);
  } catch (error: any) {
    return res.status(error.message || 500).json({ error: "Failed to fetch tickets" });
  }
});

async function _populateTables(): Promise<void> {

  const rawSites = fs.readFileSync("./SitesJSONData.json", "utf-8");
  const dataSites = JSON.parse(rawSites);

  const siteRecords = Object.values(dataSites).flatMap((value: any) => value);
  createSites(siteRecords as Site[]);

  const rawTrucks = fs.readFileSync("./TrucksJSONData.json", "utf-8");
  const dataTrucks = JSON.parse(rawTrucks);

  const truckRecords = Object.values(dataTrucks).flatMap((value: any) => value);
  createTrucks(truckRecords as Truck[]);

}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

async function main() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database");

    await initSiteModel();
    await initTruckModel();
    await initTicketModel();
    await sequelize.sync({ alter: true });
    await _populateTables();
    console.log("Synced and created tables");
    
    console.log("Running server...");

  } catch (error) {
    console.error("Error:", error);
  }
}

main();