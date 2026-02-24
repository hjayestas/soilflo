# interview-takehome

SoilFLO Interview takehome

## Instructions

- Run Docker Desktop
- Run in a terminal `docker compose up` and both the application and postgres will install and start

## Endpoints

GET `/api/v1/tickets` parameters `name`, `startDate`, `endDate`, `page`, `pageSize`
POST `/api/v1/tickets` body `tickerNumber`, `name`, `license`, `material`, `dispatchedTime`

## Next steps
- Add unit, integration and postman tests: I wanted to add a couple tests to cover for at least the happy path on each type to help validate.