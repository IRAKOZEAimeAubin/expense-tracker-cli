import { createSpinner } from "nanospinner";
import { validateExpenses, validateId } from "../utils/validators.js";
import { dateFormatter, prepareUpdatePrompts, sleep } from "../utils/utils.js";
import { safeReadExpenses, safeSaveExpense } from "../utils/dbFile.js";
import chalkColors from "../utils/chalkColors.js";

export default async function updateExpense ( id ) {
    const spinner = createSpinner( {
        text: chalkColors.info( 'Initializing expense update...' )
    } );

    try {
        spinner.start();

        spinner.update( { text: chalkColors.info( 'Validating input...' ) } );
        const validatedId = validateId( id );
        await sleep( 1000 );

        spinner.update( { text: chalkColors.info( 'Reading expense database...' ) } );
        const rawExpenses = await safeReadExpenses();
        const validatedExpenses = validateExpenses( rawExpenses );

        spinner.update( { text: chalkColors.info( 'Locating expense...' ) } );
        const expenseIndex = validatedExpenses.findIndex( expense => expense.id === validatedId );

        if ( expenseIndex === -1 ) {
            throw new Error( `Expense with ID ${ validatedId } not found` );
        }

        const existingExpense = validatedExpenses[ expenseIndex ];

        spinner.stop();

        const updateAnswers = await prepareUpdatePrompts( existingExpense );

        if ( !updateAnswers.confirmUpdate ) {
            spinner.stop();
            console.log( chalkColors.warning( 'Expense update cancelled' ) );
            return null;
        }

        spinner.start()
        spinner.update( { text: chalkColors.info( 'Preparing update...' ) } );
        const updatedExpense = {
            ...existingExpense,
            amount: updateAnswers.amount,
            category: updateAnswers.category,
            description: updateAnswers.description,
            updatedAt: dateFormatter()
        };

        spinner.update( { text: chalkColors.info( 'Updating expense...' ) } );
        validatedExpenses[ expenseIndex ] = updatedExpense;

        await safeSaveExpense( validatedExpenses );

        spinner.success( {
            text: chalkColors.success(
                `Successfully updated expense:\n` +
                `  ID: ${ updatedExpense.id }\n` +
                `  Amount: $${ updatedExpense.amount }\n` +
                `  Category: ${ updatedExpense.category }`
            )
        } );

        return updatedExpense;
    } catch ( error ) {
        spinner.error( {
            text: chalkColors.error( `Failed to update expense: ${ error.message }` )
        } );

        throw error;
    }
}