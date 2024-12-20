# markupToHTML

## Technologies Used

- **Back-end**: Node.js, fastify.js

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies for back-end.

   - **For the back-end**:
     ```bash
     cd markupTohtml_BE
     npm install
     ```

## Back-end Setup

PORT 8080

1. Navigate to the back-end directory:

   ```bash
   cd markupTohtml_BE
   ```

2. Install back-end dependencies:

   ```bash
   npm install
   ```

3. To run the back-end in development mode:
   ```bash
   npm run start:dev
   ```
   This will start the back-end server with live reloading (usually with tools like `nodemon`), and the back-end will be available at `http://localhost:8080` (or another port depending on your setup).

## Running the Application

- **Back-end**: Run `npm run start:dev` from the `markupTohtml_BE` directory.

After running both servers, your full-stack application should be up and running. The front-end will communicate with the back-end through API calls.

## Scripts

- **For the back-end**:
  - `npm run start:dev`: Starts the back-end server in development mode with `nodemon`.
  - `npm run start`: Starts the back-end server in production mode.

## Troubleshooting

- Ensure that both front-end and back-end are running on different ports to avoid conflicts.
- If you encounter issues with dependencies, try deleting `node_modules` and running `npm install` again.
- Check the terminal logs for any errors that might indicate missing or incorrect configurations.

---

Feel free to update this `README.md` with any additional information specific to your project setup, such as database setup or environment variables.
