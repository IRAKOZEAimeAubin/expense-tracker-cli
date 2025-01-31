import { createSpinner } from "nanospinner";
import chalkColors from "../utils/chalkColors.js";
import { validateCategory, validateExpenses } from "../utils/validators.js";
import { CATEGORIES } from "../utils/categories.js";
import { safeReadExpenses } from "../utils/dbFile.js";
import { calculateTotal, formatAmount, sleep } from "../utils/utils.js";
import { displayExpenses } from "../utils/table.js";

export default async function listExpenses ( category ) {
    const spinner = createSpinner( { text: chalkColors.info( 'Fetching expenses...' ) } );

    try {
        const validatedCategory = validateCategory( category, CATEGORIES );

        spinner.update( { text: chalkColors.info( 'Reading expenses...' ) } );
        let expenses = await safeReadExpenses();

        expenses = validateExpenses( expenses );

        let filteredExpenses = expenses;
        if ( validatedCategory ) {
            filteredExpenses = expenses.filter( expense => expense.category === validatedCategory );
        }

        spinner.start();
        await sleep();

        if ( filteredExpenses.length === 0 ) {
            const message = validatedCategory
                ? `No expenses found in category: ${ validatedCategory }`
                : 'No expenses found';

            spinner.info( {
                text: chalkColors.info( message )
            } );

            return;
        }

        console.log( '\nExpense List 💸:' );
        displayExpenses( filteredExpenses );

        const total = calculateTotal( filteredExpenses );
        console.log( '\n' + '-'.repeat( 80 ) );
        console.log(
            `Total: ${ formatAmount( total ) } ` +
            `(${ filteredExpenses.length } expenses${ filteredExpenses.length <= 1 ? '' : 's' })`
        );

        spinner.success( {
            text: chalkColors.success( 'Successfully fetched expense(s)!' )
        } );
    } catch ( error ) {
        spinner.error( {
            text: chalkColors.error( `Failed to list expenses: ${ error.message }` )
        } );

        throw error;
    }
}