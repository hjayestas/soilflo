# interview-takehome

SoilFLO Interview takehome

## Instructions

- Run Docker Desktop
- Run in a terminal `docker compose up` and both the application and postgres will install and start

## Endpoints

- GET `/api/v1/tickets` parameters `name`, `startDate`, `endDate`, `page`, `pageSize`

Example:
- URL: http://localhost:3000/api/v1/tickets?startDate=Tue Feb 23 2026 04:59:49 GMT+0000&endDate=Wed Feb 24 2026 04:59:49 GMT+0000&name=APPLIDECK

---------

- POST `/api/v1/tickets` body `tickerNumber`, `name`, `license`, `material`, `dispatchedTime`

Example:
- URL: http://localhost:3000/api/v1/tickets
- Body: [
    {
        "name": "ZILCH",
        "license": "kdd7yh",
        "material": "Soil",
        "dispatchedTime": "Tue Feb 23 2026 04:59:49 GMT+0000"
    },
    {
        "name": "APPLIDECK",
        "license": "kdd7yh",
        "material": "Soil",
        "dispatchedTime": "Tue Feb 23 2026 04:59:49 GMT+0000"
    }
]

## Next steps
- Add unit, integration and postman tests: I wanted to add a couple tests to cover for at least the happy path on each type to help validate. I created a file for each endpoint where I intend to add unit test with different parameters.