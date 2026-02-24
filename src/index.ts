import express, { Application, Request, Response } from 'express';
import { connectWithRetry, sequelize } from "./database";
import { initSiteModel, createSites, Site } from './models/Site';
import { initTruckModel, createTrucks, Truck } from './models/Truck';
import { initTicketModel, createTickets, fetchTickets } from './models/Ticket';
import fs from "fs";

const app: Application = express();
const PORT = process.env.PORT || 3000;

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

    let dispachedTimes = new Set<string>;

    tickets.forEach((ticket: any) => {
      if (ticket.material && ticket.material != "Soil") {
        res.status(409).json({ error: "Material not allowed" });
      }
      if (ticket.dispachedTime && !dispachedTimes.has(ticket.dispachedTime)){
        const key = `${ticket.license}-${ticket.dispachedTime}`;
        dispachedTimes.add(key);
      } else {
        res.status(409).json({ error: "Dispached time conflict for this truck" });
      }
    });

    await createTickets(tickets);

    res.status(200).json({ message: "Tickets created" });
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message || "Failed to create tickets" });
  }
});


app.get('/api/v1/tickets', async (req: Request, res: Response) => {
  try {
    const { name, startDate, endDate, page, pageSize } = req.query;
    const cleanStartDate = startDate ? new Date(startDate as string) : new Date(Date.now() - 24 * 60 * 60 * 1000); // Default to 24 hours ago
    const cleanEndDate = endDate ? new Date(endDate as string) : new Date();
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

    res.json(tickets);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: "Failed to fetch tickets" });
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