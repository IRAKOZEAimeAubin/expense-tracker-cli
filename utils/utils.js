import inquirer from "inquirer";
import { CATEGORIES } from "./categories.js";
import chalkColors from "./chalkColors.js";

export const dateFormatter = () => {
    return new Intl.DateTimeFormat( 'en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    } ).format( new Date( Date.now() ) );
};

export const sleep = ( ms = 2000 ) => new Promise( ( r ) => setTimeout( r, ms ) );

export const generateUniqueId = ( existingExpenses ) => {
    if ( !Array.isArray( existingExpenses ) ) throw new Error( 'Invalid expenses data structure' );

    try {
        return existingExpenses.length > 0 ? Math.max( ...existingExpenses.map( expense => expense.id ) ) + 1 : 1;
    } catch ( error ) {
        throw new Error( 'Failed to generate unique ID' );
    }
};

export const formatAmount = ( amount ) => {
    try {
        if ( typeof amount !== 'number' || !isFinite( amount ) ) {
            throw new Error( 'Invalid amount' );
        }

        return new Intl.NumberFormat( 'en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        } ).format( amount );
    } catch ( error ) {
        throw new Error( `Failed to format amount: ${ error.message }` );
    }
};

export const calculateTotal = ( expenses ) => {
    try {
        return expenses.reduce( ( sum, expense ) => {
            if ( typeof expense.amount !== 'number' || !isFinite( expense.amount ) ) {
                throw new Error( `Invalid amount for expense ID ${ expense.id }` );
            }
            return sum + expense.amount;
        }, 0 );
    } catch ( error ) {
        throw new Error( `Failed to calculate total: ${ error.message }` );
    }
};

export async function prepareUpdatePrompts ( existingExpense ) {
    return inquirer.prompt( [
        {
            type: 'number',
            name: 'amount',
            message: 'Enter new amount:',
            default: existingExpense.amount,
            validate: value => value > 0 || 'Amount must be positive'
        },
        {
            type: 'list',
            name: 'category',
            message: 'Select the expense category:\n',
            choices: CATEGORIES,
            default: existingExpense.category
        },
        {
            type: 'input',
            name: 'description',
            message: 'Enter new description:',
            default: existingExpense.description,
        },
        {
            type: 'confirm',
            name: 'confirmUpdate',
            message: 'Are you sure you want to update this expense?',
            default: true
        }
    ] );
}

export function filterExpensesByMonth ( expenses, month ) {
    const numericalMonth = Number( month );

    if ( isNaN( numericalMonth ) || numericalMonth < 1 || numericalMonth > 12 ) {
        throw new Error( 'Invalid month. Please provide a number between 1 and 12.' );
    }

    return expenses.filter( expense => {
        const expenseDate = new Date( expense.createdAt );
        return expenseDate.getMonth() === numericalMonth - 1;
    } );
}

export function calculateSummaryStatistics ( expenses ) {
    if ( expenses.length === 0 ) {
        return {
            totalExpenses: 0,
            averageExpense: 0,
            expenseCount: 0,
            categorySummary: {},
        };
    }

    const totalExpenses = calculateTotal( expenses );

    const categorySummary = expenses.reduce( ( summary, expense ) => {
        summary[ expense.category ] = ( summary[ expense.category ] || 0 ) + expense.amount;
        return summary;
    }, {} );

    return {
        totalExpenses: Number( totalExpenses.toFixed( 2 ) ),
        averageExpense: Number( ( totalExpenses / expenses.length ).toFixed( 2 ) ),
        expenseCount: expenses.length,
        categorySummary
    };
}

export function displaySummary ( summary, month ) {
    console.log( chalkColors.info(
        month
            ? `Expense Summary for Month ${ month } 📊:`
            : 'Overall Expense Summary 📊:'
    ) );

    console.log( chalkColors.info( `Total Expenses: $${ summary.totalExpenses }` ) );
    console.log( chalkColors.info( `Number of Expenses: ${ summary.expenseCount }` ) );
    console.log( chalkColors.info( `Average Expense: $${ summary.averageExpense }` ) );

    console.log( chalkColors.info( '\nCategory Breakdown:' ) );
    Object.entries( summary.categorySummary ).forEach( ( [ category, amount ] ) => {
        console.log( chalkColors.info( `\t${ category }: $${ amount.toFixed( 2 ) }` ) );
    } );
}
