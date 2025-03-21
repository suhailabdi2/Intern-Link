# InternLink

InternLink is a web application built with React and Vite that helps users find and apply for internships. The application features a search functionality, internship listings, and detailed internship descriptions.

## Features

- Search for internships by title and location
- Filter internships by category and location
- View detailed internship descriptions
- Apply for internships directly from the application
- User authentication and profile management with Clerk
- Responsive design for mobile and desktop

## Technologies Used

- React
- Vite
- Tailwind CSS
- Clerk for authentication
- ESLint for code linting
- Moment.js for date formatting

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/intern-link.git
   cd intern-link
2. Install dependencies
npm install
3. Create a .env file in the root directory and add your Clerk publishable key:
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

### Running the Application
1. Start the development server:
npm run dev
2.Open your browser and navigate to http://localhost:3000.

### Project Structure

intern-link/
├── dist/                   # Build output
├── node_modules/           # Node.js modules
├── public/                 # Public assets
├── src/                    # Source code
│   ├── assets/             # Static assets
│   ├── components/         # React components
│   ├── context/            # React context
│   ├── pages/              # React pages
│   ├── App.jsx             # Main App component
│   ├── index.css           # Global styles
│   ├── main.jsx            # Entry point
├── .env                    # Environment variables
├── .gitignore              # Git ignore file
├── eslint.config.js        # ESLint configuration
├── index.html              # HTML template
├── package.json            # Project metadata and scripts
├── postcss.config.js       # PostCSS configuration
├── README.md               # Project documentation
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite configuration

Feel free to customize this README file according to your project's specific details and requirements.
