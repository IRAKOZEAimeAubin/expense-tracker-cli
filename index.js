#!/usr/bin/env node

import { Command } from "commander";
import addExpense from "./commands/addExpense.js";
import listExpenses from "./commands/listExpenses.js";
import chalkColors from "./utils/chalkColors.js";
import deleteExpense from "./commands/deleteExpense.js";
import updateExpense from "./commands/updateExpense.js";
import generateSummary from "./commands/generateSummary.js";
import exportToCSV from "./commands/export.js";

const program = new Command();

program
    .name( 'expense-tracker' )
    .description( 'CLI Expense Tracker.' )
    .version( '1.0.0' );

program
    .command( 'add' )
    .description( 'Create a new expense' )
    .option( '-d, --description <description>', 'description of the expense', 'Miscellaneous' )
    .option( '-a, --amount <amount>', 'expense amount', '0' )
    .action( async ( options ) => {
        try {
            const { description, amount } = options;
            await addExpense( description, amount );
        } catch ( error ) {
            console.error( chalkColors.error( 'Command failed:' ), error.message );
            process.exit( 1 );
        }
    } );

program
    .command( 'list' )
    .description( 'List expenses' )
    .argument( '[category]', 'Filter expenses by category' )
    .action( async ( category ) => {
        try {
            await listExpenses( category );
        } catch ( error ) {
            console.error( chalkColors.error( '\nCommand failed:' ), error.message );
            process.exit( 1 );
        }
    } );

program
    .command( 'update' )
    .description( 'Update an expense' )
    .option( '-i, --id <id>', 'ID of the expense' )
    .action( async ( options ) => {
        try {
            const { id } = options;
            await updateExpense( id );
        } catch ( error ) {
            console.error( chalkColors.error( 'Command failed:' ), error.message );
            process.exit( 1 );
        }
    } );

program
    .command( 'summary' )
    .description( 'Generate expense summary' )
    .option( '-m, --month <month>', 'Generate summary for a specific month' )
    .action( async ( options ) => {
        try {
            const { month } = options;
            const numericalMonth = month ? Number( month ) : undefined;
            await generateSummary( numericalMonth );
        } catch ( error ) {
            console.error( chalkColors.error( 'Command failed:' ), error.message );
            process.exit( 1 );
        }
    } );

program
    .command( 'delete' )
    .description( 'Delete an expense' )
    .option( '-i, --id <id>', 'ID of the expense' )
    .action( async ( options ) => {
        try {
            const { id } = options;
            await deleteExpense( id );
        } catch ( error ) {
            console.error( chalkColors.error( 'Command failed:' ), error.message );
            process.exit( 1 );
        }
    } );

program
    .command( 'export' )
    .description( 'Export expenses to a CSV file' )
    .action( async () => {
        try {
            await exportToCSV();
        } catch ( error ) {
            console.error( chalkColors.error( 'Command failed:' ), error.message );
            process.exit( 1 );
        }
    } );

program
    .on( 'command:*', () => {
        console.error( chalkColors.error( 'Invalid command' ) );
        console.log( 'Run expense-tracker --help for a list of available commands' );
        process.exit( 1 );
    } );

program.parse();
