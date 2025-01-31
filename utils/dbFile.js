import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from "url";

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );
const dbPath = path.join( __dirname, '..', 'db', 'expenses.json' );

async function ensureDbExists () {
    try {
        const dbDir = path.dirname( dbPath );

        try {
            await fs.access( dbDir );
        } catch ( error ) {
            await fs.mkdir( dbDir, { recursive: true } );
        }

        try {
            await fs.access( dbPath );
        } catch ( error ) {
            await fs.writeFile( dbPath, JSON.stringify( { expenses: [] }, null, 2 ), 'utf8' );
        }

    } catch ( error ) {
        throw new Error( `Failed to setup database file: ${ error.message }` );
    }
}

async function readExpenses () {
    await ensureDbExists();

    try {
        const data = await fs.readFile( dbPath, 'utf8' );
        if ( !data.trim() ) {
            return [];
        }

        return JSON.parse( data ).expenses;

    } catch ( error ) {
        if ( error instanceof SyntaxError ) {
            await fs.writeFile( dbPath, JSON.stringify( { expenses: [] }, null, 2 ), 'utf8' );
            return [];
        }
    }
}

async function saveExpense ( expenses ) {
    await fs.writeFile( dbPath, JSON.stringify( { expenses }, null, 2 ), 'utf8' );
}

export const safeReadExpenses = async () => {
    try {
        return await readExpenses();
    } catch ( error ) {
        throw new Error( `Failed to read expenses: ${ error.message }` );
    }
};

export const safeSaveExpense = async ( expenses ) => {
    try {
        await saveExpense( expenses );
    } catch ( error ) {
        throw new Error( `Failed to save expense: ${ error.message }` );
    }
};
