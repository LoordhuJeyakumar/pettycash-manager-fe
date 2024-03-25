# PettyCash Manager Frontend

## Introduction
PettyCash Manager is a user-friendly web application designed to simplify the management of petty cash funds. With a focus on ease of use, this tool allows users to track expenses, manage reimbursements, and generate reports with ease. The application is built using React and Redux.
## **URLs**

## [Netlify Deployed URL 👈 ](https://imprest-ive-pettycash-manager.netlify.app/)

```bash
https://imprest-ive-pettycash-manager.netlify.app/
```

## [Github repository URL 👈](https://github.com/LoordhuJeyakumar/pettycash-manager-fe)

```bash
https://github.com/LoordhuJeyakumar/pettycash-manager-fe
```


## Features
- **Expense Tracking**: Log and categorize every transaction.
- **Reimbursements**: Easily handle cash reimbursements.
- **Reporting**: Generate detailed reports for better financial oversight.(Comming soon...)
- **User Profile Management**: Control access with a secure user management system.(view and update profile, change password)
- **User authentication**: (signup, login, verification)
- **Account management**: (create, view, update, delete)
- **Cash request management** (create, view, approve, reject)
- **Transaction management** (create, view)

## Dependencies & Technologies Used
-   `ag-charts-react`: For creating charts
-   `ag-grid-react`: For creating grids
-   `axios`: For making HTTP requests
-   `bootstrap`: For styling
-   `chart.js`: For creating charts
-   `framer-motion`: For animations
-   `react`: JavaScript library for building user interfaces
-   `react-dom`: React package for working with the DOM
-   `react-redux`: For state management
-   `react-router-dom`: For routing
-   `react-toastify`: For displaying notifications
-   `redux`: For state management

## Getting Started
To get a local copy up and running, follow these simple steps.

## Installation
1. Clone the repository:

```bash
git clone https://github.com/LoordhuJeyakumar/pettycash-manager-fe.git

```
2. Install the dependencies:
```bash
npm install

```

3. Start the application:
```bash
npm run dev

```

## Usage

The application includes several pages and components:

- `AppRoutes.js`: Defines the application routes.
- `ProtectedRoutes.js`: Defines the protected routes that require user authentication.
- `rootReducer.js`: Combines all the reducers.
- `authInstance.js`: Defines the axios instances for making API requests.
- `authService.js`: Defines the services for user authentication and profile management.
- `accountService.js`: Defines the services for account management.
- `cashRequestService.js`: Defines the services for cash request management.
- `transactionsService.js`: Defines the services for transaction management.

## Application Structure
The application is structured into pages and services and components and routes and redux:
-   **Pages**: Each page corresponds to a route in the application.
-   **Services**: Services contain the business logic for interacting with the backend.
-   **components**: all components.
-   **redux**: Manage all redux store and reducers.

## Contributing

Contributions are welcome. Please fork the repository and create a pull request with your changes.
## License
This project is licensed under the MIT License.
### Prerequisites
- Node.js
- npm

```bash
# Verify Node.js installation
node --version

# Verify npm installation
npm --version
