#!/usr/bin/env node

import { Command } from "commander";
import addExpense from "./commands/addExpense.js";
import listExpenses from "./commands/listExpenses.js";
import chalkColors from "./utils/chalkColors.js";
import deleteExpense from "./commands/deleteExpense.js";

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
    .action( ( options ) => {
        try {
            const { description, amount } = options;
            addExpense( description, amount );
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
    .command( 'delete' )
    .description( 'Delete an expense' )
    .option( '-i, --id <id>', 'id of the expense' )
    .action( ( options ) => {
        try {
            const { id } = options;
            deleteExpense( id )
        } catch (error) {
            console.error( chalkColors.error( 'Command failed:' ), error.message );
            process.exit( 1 );
        }
    })

program
    .on( 'command:*', () => {
        console.error( chalkColors.error( 'Invalid command' ) );
        console.log( 'Run expense-tracker --help for a list of available commands' );
        process.exit( 1 );
    } );

program.parse();
