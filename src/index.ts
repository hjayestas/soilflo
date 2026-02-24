import express, { Application, Request, Response } from 'express';
import { connectWithRetry, sequelize } from "./database";
import { initSiteModel, createSites } from './models/Site';
import { initTruckModel, createTrucks } from './models/Truck';
import { initTicketModel, createTickets, fetchTickets, fetchAllTickets } from './models/Ticket';
import fs from "fs";

const app: Application = express();
const PORT = process.env.PORT || 3000;

(async () => {
  await connectWithRetry();
})();

class Truck {
  id: number;
  license: string;
  siteId: number;

  constructor (id: number, license: string, siteId: number) {
    this.id = id;
    this.license = license;
    this.siteId = siteId;
  }
}

class Site {
  id: number;
  name: string;
  address: string;
  description: string;

  constructor (id: number, name: string, address: string, description: string) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.description = description;
  }
}

class Ticket {
  id: number;
  name: string;
  license: string;
  material: string;
  ticketNumber: number;

  constructor (id: number, name: string, license: string, material: string, ticketNumber: number) {
    this.id = id;
    this.name = name;
    this.license = license;
    this.material = material;
    this.ticketNumber = ticketNumber;
  }
}

app.use(express.json());

app.get('/tickets/summary', async (req: Request, res: Response) => {
  try {
    const tickets = await fetchAllTickets();

    res.json(tickets);
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch tickets" });
  }
});

app.post('/api/v1/tickets', async (req: Request, res: Response) => {
  try {
    const tickets: Ticket[] = req.body || [];

    await createTickets(tickets);

    res.status(200).json({ message: "Tickets created" });
  } catch (error) {
    res.status(400).json({ error: "Failed to create tickets" });
  }
});


app.get('/api/v1/tickets', async (req: Request, res: Response) => {
  try {
    const { name, startDate, endDate, page, pageSize } = req.query;
    const tickets = await fetchTickets(
      name as string,
      startDate ? new Date(startDate as string) : new Date(),
      endDate ? new Date(endDate as string) : new Date(),
      parseInt(page as string) || 1,
      parseInt(pageSize as string) || 50
    );

    res.json(tickets);
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch tickets" });
  }
});

async function _populateTables(): Promise<void> {

  const raw = fs.readFileSync("./SitesJSONData.json", "utf-8");
  const data = JSON.parse(raw);

  const allRecords = Object.values(data).flatMap((value: any) => value);
  createSites(allRecords as Site[]);

  const raw1 = fs.readFileSync("./TrucksJSONData.json", "utf-8");
  const data1 = JSON.parse(raw1);

  const allRecords1 = Object.values(data1).flatMap((value: any) => value);
  createTrucks(allRecords1 as Truck[]);

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