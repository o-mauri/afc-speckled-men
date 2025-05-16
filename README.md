# SpaceFilledFC

A web application for managing and displaying football club data, built with Angular and Firebase for the team formally known as space filled now known as AFC Speckled Men.

## Project Structure

The repository consists of two main components:

### 1. Web Application (`space-filled-site/`)
An Angular-based web application that provides the user interface for the football club data.

#### Technologies Used
- Angular 15.1.0
- Bootstrap 5.2.3
- FontAwesome 6.4.0
- Firebase (Hosting)

#### Getting Started

1. Install dependencies:
```bash
cd space-filled-site
npm install
```

2. Run the development server:
```bash
npm start
```

3. Build for production:
```bash
npm run build
```

### 2. Data Processing (`calculations/`)
Python scripts for processing and managing football club data.

#### Files
- `main.py`: Main data processing script
- `addPlayer.py`: Script for adding new player data
- `finalData.json`: Processed data output
- `tmpData.json`: Temporary data storage

## Development

### Prerequisites
- Node.js (for web application)
- Python 3.x (for data processing)
- Firebase CLI (for deployment)

### Setup
1. Clone the repository
2. Install web application dependencies:
```bash
cd space-filled-site
npm install
```

3. Install Python dependencies (if needed):
```bash
pip install -r requirements.txt
```

## Deployment

The web application is deployed using Firebase Hosting. To deploy:

1. Build the application:
```bash
cd space-filled-site
npm run build
```

2. Deploy to Firebase:
```bash
firebase deploy
```
