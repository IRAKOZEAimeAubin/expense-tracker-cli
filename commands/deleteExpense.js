import { createSpinner } from "nanospinner";
import chalkColors from "../utils/chalkColors.js";
import { validateExpenses, validateId } from "../utils/validators.js";
import { safeReadExpenses, safeSaveExpense } from "../utils/dbFile.js";
import { sleep } from "../utils/utils.js";

export default async function deleteExpense ( id ) {
    const spinner = createSpinner( {
        text: chalkColors.info( 'Deleting expense...' )
    } );

    try {
        spinner.start();
        spinner.update( { text: chalkColors.info( 'Validating ID...' ) } );

        const validatedId = validateId( id );
        await sleep( 500 );

        spinner.update( { text: chalkColors.info( 'Reading expenses...' ) } );
        const expenses = await safeReadExpenses();

        let validatedExpenses = validateExpenses( expenses );

        spinner.update( { text: chalkColors.info( 'Locating expense...' ) } );
        const expenseIndex = validatedExpenses.findIndex( expense => expense.id === validatedId );

        if ( expenseIndex === -1 ) {
            throw new Error( `Expense with ID ${ expenseId } not found` );
        }

        validatedExpenses.splice( expenseIndex, 1 );

        spinner.update( { text: chalkColors.info( 'Saving changes...' ) } );
        await safeSaveExpense( validatedExpenses );

        spinner.success( {
            text: chalkColors.success( `Expense with id ${ id } deleted successfully` )
        } );
    } catch ( error ) {
        spinner.error( {
            text: chalkColors.error( `Failed to delete expense: ${ error.message }` )
        } );

        throw error;
    }
}