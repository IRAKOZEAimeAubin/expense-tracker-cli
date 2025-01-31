const MAX_DESCRIPTION_LENGTH = 100;
const MAX_AMOUNT = 1_000_000;

export const validateAmount = ( amount ) => {
    const parsedAmount = parseFloat( amount );

    if ( isNaN( parsedAmount ) ) {
        throw new Error( 'Amount must be a valid number' );
    }

    if ( parsedAmount <= 0 ) {
        throw new Error( 'Amount must be greater than 0' );
    }

    if ( parsedAmount > MAX_AMOUNT ) {
        throw new Error( `Amount cannot exceed ${ MAX_AMOUNT }` );
    }

    if ( !Number.isFinite( parsedAmount ) ) {
        throw new Error( 'Amount must be a finite number' );
    }

    return parsedAmount;
};

export const validateDescription = ( description ) => {
    if ( !description || typeof description !== 'string' ) {
        throw new Error( 'Description is required and must be a string' );
    }

    if ( description.trim().length === 0 ) {
        throw new Error( 'Description cannot be empty' );
    }

    if ( description.length > MAX_DESCRIPTION_LENGTH ) {
        throw new Error( `Description cannot exceed ${ MAX_DESCRIPTION_LENGTH } characters` );
    }

    return description.trim();
};

export const validateCategory = ( category, categories ) => {
    if ( !category ) return null;

    const normalizedCategory = category.trim().toLowerCase();
    const validCategory = categories.find( c => c.toLowerCase() === normalizedCategory );

    if ( !validCategory ) {
        throw new Error(
            `Invalid category: "${ category }"\nAvailable categories: ${ categories.join( ', ' ) }`
        );
    }

    return validCategory;
};

export const validateExpenses = ( expenses ) => {
    if ( !Array.isArray( expenses ) ) {
        throw new Error( 'Invalid expenses data structure' );
    }

    expenses.forEach( ( expense, index ) => {
        if ( !expense.id || !expense.description || !expense.amount || !expense.category || !expense.createdAt ) {
            throw new Error( `Invalid expense data at index ${ index }` );
        }

        if ( typeof expense.amount !== 'number' || !isFinite( expense.amount ) ) {
            throw new Error( `Invalid amount for expense ID ${ expense.id }` );
        }

        if ( new Date( expense.createdAt ).toString() === 'Invalid Date' ) {
            throw new Error( `Invalid date for expense ID ${ expense.id }` );
        }
    } );

    return expenses;
};
