import { createSpinner } from "nanospinner";
import chalkColors from "../utils/chalkColors.js";
import { safeReadExpenses } from "../utils/dbFile.js";
import { validateExpenses } from "../utils/validators.js";
import { calculateSummaryStatistics, displaySummary, filterExpensesByMonth } from "../utils/utils.js";

export default async function generateSummary ( month ) {
    const spinner = createSpinner( {
        text: chalkColors.info( 'Summarizing expenses' )
    } );

    try {
        spinner.start();

        spinner.update( { text: chalkColors.info( 'Reading expenses...' ) } );
        const rawExpenses = await safeReadExpenses();
        const validatedExpenses = validateExpenses( rawExpenses );

        spinner.update( { text: chalkColors.info( 'Calculating summary...' ) } );
        const filteredExpenses = month
            ? filterExpensesByMonth( validatedExpenses, month )
            : validatedExpenses;

        const summary = calculateSummaryStatistics( filteredExpenses );

        spinner.success( {
            text: chalkColors.success( 'Summary generated successfully' )
        } );

        displaySummary( summary, month );

        return summary;
    } catch ( error ) {
        spinner.error( {
            text: chalkColors.error( `Failed to generate summary: ${ error.message }` )
        } );
        throw error;
    }
}