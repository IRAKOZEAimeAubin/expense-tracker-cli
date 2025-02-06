import fs from 'fs/promises';
import path from "path";
import { fileURLToPath } from "url";
import { createSpinner } from "nanospinner";
import chalkColors from "../utils/chalkColors.js";
import { safeReadExpenses } from "../utils/dbFile.js";
import { validateExpenses } from "../utils/validators.js";

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );
const csvPath = path.join( __dirname, '..', 'exports', 'expenses.csv' );
const exportDir = path.dirname( csvPath );

export default async function exportToCSV () {
    const spinner = createSpinner( {
        text: chalkColors.info( 'Exporting expenses...' )
    } );

    try {
        spinner.start();

        const headers = [ 'ID', 'Date', 'Description', 'Amount', 'Category' ];

        spinner.update( {
            text: chalkColors.info( 'Reading existing expenses...' )
        } );
        const rawExpenses = await safeReadExpenses();
        const validatedExpenses = validateExpenses( rawExpenses );
        const rows = validatedExpenses.map( expense =>
            [ expense.id, expense.createdAt, expense.description, expense.amount, expense.category ]
        );

        const csvContent = [
            headers.join( ',' ),
            ...rows.map( row => row.join( ',' ) )
        ].join( '\n' );

        spinner.update( {
            text: chalkColors.info( 'Preparing export directory...' )
        } );

        try {
            await fs.access( exportDir );
        } catch ( error ) {
            await fs.mkdir( exportDir, { recursive: true } );
        }

        spinner.update( {
            text: chalkColors.info( 'Exporting to CSV...' )
        } );

        try {
            await fs.access(csvPath)
        } catch (error) {
            await fs.writeFile( csvPath, csvContent, { encoding: 'utf8', flag: 'w' } );
        }

        spinner.success( {
            text: chalkColors.success( 'Expenses exported to CSV successfully' )
        } );

        return csvPath;
    } catch ( error ) {
        spinner.error( {
            text: chalkColors.error( `Failed to export expenses: ${ error.message }` )
        } );

        throw error;
    }
};