# Expense Tracker CLI Tool

## Project Note
This project was originally inspired by the [Expense Tracker Challenge](https://roadmap.sh/projects/expense-tracker).

This project is a command-line tool for tracking your daily expenses. It was designed to offer a simple yet powerful way to manage your expenses without the need for a graphical interface. By leveraging popular CLI libraries, the tool provides an intuitive experience that lets you add, view, update, and delete expense entries effortlessly.

The goal of this project is to help you keep track of your spending in a user-friendly manner while maintaining simplicity and reliability.

## Features
- **Add Expenses:**  
  Record a new expense with details such as amount, date, category, and description.
- **List Expenses:**  
  Display all recorded expenses or filter them by criteria such as category or date.
- **Update Expenses:**  
  Modify details of an existing expense entry.
- **Delete Expenses:**  
  Remove an expense from the records.
- **Summary Reports:**  
  Generate basic reports to get insights into your spending habits.
- **Export to CSV File:**  
  Export your expense data to a CSV file for easy sharing or further analysis.

## Prerequisites
- [Node.js](https://nodejs.org/) installed on your system

## Installation
**Clone the repository**
```bash
git clone https://github.com/IRAKOZEAimeAubin/expense-tracker-cli

# Navigate to the project
cd expense-tracker-cli

# Installing dependencies
pnpm install

# You can run the project locally without a global installation
node index.js

# Alternatively, install the tool globally to use it from anywhere
npm install -g

# Other altenatives to global installation
npm run <script>    # add a script to package.json
npm link            # to install locally

# Then, run commands using
expense-tracker <command> # replace <command> with a real command
```

## Usage

> **NOTE:**
> Use `npx expense-tracker <command>` to run the diffent commands without installing the project

- **Add an expense**
```bash
expense-tracker add --description <description> --amount <amount>

# Replace <description> and <amount> with the description and amount of the expense accordingly
# Then, follow the prompts

# Alternatively
expense-tracker add -d <description> -a <amount>
```

- **List all expenses**
```bash
expense-tracker list
```

- **List expenses by category**
```bash
expense-tracker list <category>

# Replace <category> with a category to filter only the category expenses
```

- **Update an expense**
```bash
# Mark expense as in-progress
expense-tracker update --id <id>

# Replace <id> with the id of the expense
# Then, follow the prompts

# Alternatively
expense-tracker update --i <id>
```

- **Delete expense**
```bash
expense-tracker delete --id <id>

# Replace <id> with the id of the expense

# Alternatively
expense-tracker delete --i <id>
```

- **All expenses summary**
```bash
expense-tracker summary
```

- **Expenses summary by month**
```bash
expense-tracker summary --month <month>

# Replace <month> with the required month
# <month> should be a number, i.e. May = 5, etc
```

- **Export expenses to CSV**
```bash
expense-tracker export
```

- **Help**
```bash
expense-tracker <command> --help

# Altenatively, you can also use the following commands to get more info about the tool
expense-tracker <command> -h
expense-tracker --help
expense-tracker -h
expense-tracker
```

### Sample JSON file
```JSON
{
  "expenses": [
    {
      "id": 1,
      "description": "New Shoes",
      "amount": 18,
      "category": "Clothing",
      "createdAt": "2025-01-31",
      "updatedAt": "2025-01-31"
    },
    {
      "id": 2,
      "description": "Lunch",
      "amount": 15,
      "category": "Food",
      "createdAt": "2025-02-03",
      "updatedAt": "2025-02-03"
    },
    {
      "id": 3,
      "description": "Rust Udemy Course",
      "amount": 9.99,
      "category": "Education",
      "createdAt": "2025-02-03",
      "updatedAt": "2025-02-03"
    }
  ]
}
```

### Sample CSV file

```csv
ID,Date,Description,Amount,Category
1,2025-01-31,New Shoes,18,Clothing
2,2025-02-03,Lunch,15,Food
3,2025-02-03,Rust Udemy Course,9.99,Education
```

> **NOTE:**
> - An `expenses.json` file will be created under a directory `db` the first time the `expense-tracker add` command is run.
> - An `expenses.csv` file will be created when the `expense-tracker export` command is run, truncanting the file if it was already present.
