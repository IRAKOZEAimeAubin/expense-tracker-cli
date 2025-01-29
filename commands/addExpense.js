import inquirer from "inquirer";
import { CATEGORIES } from "../utils/categories.js";
import { createSpinner } from "nanospinner";
import chalkColors from "../utils/chalkColors.js";
import { safeReadExpenses, safeSaveExpense } from "../utils/dbFile.js";
import { dateFormatter, generateUniqueId, sleep } from "../utils/utils.js";
import { validateAmount, validateDescription } from "../utils/validators.js";

async function input () {
    const answers = await inquirer.prompt( {
        name: 'category',
        type: 'list',
        message: 'Select the expense category:\n',
        choices: CATEGORIES
    } );

    return answers.category;
}

export default async function addExpense ( description, amount ) {
    const spinner = createSpinner( {
        text: chalkColors.info( 'Validating expense details...' )
    } );

    try {
        const validatedAmount = validateAmount( amount );
        const validatedDescription = validateDescription( description );

        spinner.update( {
            text: chalkColors.info( 'Reading existing expenses...' )
        } );
        const existingExpenses = await safeReadExpenses();

        const category = await input();

        spinner.update( {
            text: chalkColors.info( 'Adding expense...' )
        } );
        await sleep();

        const newExpense = {
            id: generateUniqueId( existingExpenses ),
            description: validatedDescription,
            amount: validatedAmount,
            category,
            createdAt: dateFormatter(),
            updatedAt: dateFormatter(),
        };

        if ( !newExpense.id || !newExpense.amount || !newExpense.category || !newExpense.description ) throw new Error( 'Invalid expense object created' );

        const updatedExpenses = [ ...existingExpenses, newExpense ];

        await safeSaveExpense( updatedExpenses );

        spinner.success( { text: chalkColors.success( `Successfully added 1 expense!` ) } );

        return newExpense;

    } catch ( error ) {
        spinner.error( {
            text: chalkColors.error( `Failed to add expense: ${ error.message }` )
        } );

        throw error;
    }
}