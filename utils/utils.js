export const dateFormatter = () => {
    return new Intl.DateTimeFormat( undefined, {
        year: 'numeric',
        month: 'long',
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