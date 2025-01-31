import { formatAmount } from "./utils.js";

const TABLE_HEADERS = {
    id: 'ID',
    date: 'Date',
    description: 'Description',
    amount: 'Amount',
    category: 'Category'
};

const COLUMN_WIDTHS = {
    id: 4,
    date: 15,
    description: 30,
    amount: 10,
    category: 15
};

const padColumn = ( text, width ) => {
    return String( text ).padEnd( width );
};

const displayTableHeader = ( expense ) => {
    console.log(
        `${ padColumn( TABLE_HEADERS.id, COLUMN_WIDTHS.id ) }` +
        `${ padColumn( TABLE_HEADERS.date, COLUMN_WIDTHS.date ) }` +
        `${ padColumn( TABLE_HEADERS.description, COLUMN_WIDTHS.description ) }` +
        `${ padColumn( TABLE_HEADERS.amount, COLUMN_WIDTHS.amount ) }` +
        `${ padColumn( TABLE_HEADERS.category, COLUMN_WIDTHS.category ) }`
    );
};

const displayExpenseRow = ( expense ) => {
    try {
        const formattedAmount = formatAmount( expense.amount );

        console.log(
            `${ padColumn( expense.id, COLUMN_WIDTHS.id ) }` +
            `${ padColumn( expense.createdAt, COLUMN_WIDTHS.date ) }` +
            `${ padColumn( expense.description, COLUMN_WIDTHS.description ) }` +
            `${ padColumn( formattedAmount, COLUMN_WIDTHS.amount ) }` +
            `${ padColumn( expense.category, COLUMN_WIDTHS.category ) }`
        );
    } catch ( error ) {
        throw new Error( `Failed to display expense row: ${ error.message }` );
    }
};

export const displayExpenses = ( expenses ) => {
    try {
        displayTableHeader();
        console.log( '-'.repeat( 80 ) );

        expenses.forEach( expense => displayExpenseRow( expense ) );
    } catch ( error ) {
        throw Error( `Failed to display expenses: ${ error.message }` );
    }
};
