# interview-takehome

SoilFLO Interview takehome

## Instructions

- Run Docker Desktop
- Run in a terminal `docker compose up` and both the application and postgres will install and start

## Endpoints

GET `/api/v1/tickets` parameters `name`, `startDate`, `endDate`, `page`, `pageSize`
POST `/api/v1/tickets` body `tickerNumber`, `name`, `license`, `material`

## Next steps
- Add unit and postman tests