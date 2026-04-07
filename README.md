# AFC Speckled Men

A web application for managing and displaying football club data for AFC Speckled Men (formerly Space Filled FC). Built with Angular, Express, and deployed on AWS.

## Project Structure

```
├── space-filled-site/   # Angular frontend
├── backend/             # Express API (TypeScript)
├── cdk/                 # AWS CDK infrastructure
├── docker-compose.yml   # Local DynamoDB
└── Makefile             # Dev & deploy commands
```

### Frontend (`space-filled-site/`)
Angular app with pages for squad, match results, seasons, stats, and an admin dashboard for managing data.

- Angular 15.1.0
- Bootstrap 5.2.3
- FontAwesome 6.4.0

### Backend (`backend/`)
Express API with routes for players, matches, seasons, and stats. Uses JWT-based admin auth.

- Express 4 (TypeScript)
- DynamoDB (single-table design)
- S3 for player images
- Runs as a Lambda function in production

### Infrastructure (`cdk/`)
AWS CDK stack that provisions:
- DynamoDB table
- S3 buckets (player images + frontend hosting)
- Lambda + API Gateway
- CloudFront distribution

## Development

### Prerequisites
- Node.js
- Docker (for local DynamoDB)
- AWS CLI & CDK CLI (for deployment)

### Quick Start

1. Install all dependencies:
```bash
make install
```

2. Start the full local environment (DynamoDB, API on :8841, Angular on :8842):
```bash
make dev
```

3. Stop local services:
```bash
make stop
```

### Other Commands

| Command | Description |
|---------|-------------|
| `make build` | Build backend and frontend |
| `make clean` | Remove build artifacts and stop Docker |

## Deployment

Deploy to AWS using CDK. Requires `ADMIN_PASSWORD` and `JWT_SECRET` environment variables:

```bash
ADMIN_PASSWORD=xxx JWT_SECRET=yyy make deploy
```
