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
