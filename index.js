#!/usr/bin/env node

import { Command } from "commander";
import addExpense from "./commands/addExpense.js";

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
    .on( 'command:*', () => {
        console.error( chalkColors.error( 'Invalid command' ) );
        console.log( 'Run expense-tracker --help for a list of available commands' );
        process.exit( 1 );
    } );

program.parse();
