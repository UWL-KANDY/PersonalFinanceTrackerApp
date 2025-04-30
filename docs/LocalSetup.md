# Local Setup with Environment Configuration

This document provides instructions for setting up the project locally.

## Prerequisites

- Node.js (v16 or higher)
- pnpm (v8 or higher)

## Steps to Set Up

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd PersonalFinanceTrackerApp
   ```

2. **Install Dependencies**:
   ```bash
   pnpm install
   ```

3. **Set Up Environment Variables**:
   - Create a `.env` file in the root directory.
   - Add the required variables:
     ```env
     REACT_APP_API_URL=<your-api-url>
     ```

4. **Start the Development Server**:
   ```bash
   pnpm run dev
   ```