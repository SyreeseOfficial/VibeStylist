/**
 * Calculates the Cost Per Wear (CPW) and determines the color class based on value.
 * @param {number|string} price - The purchase price of the item.
 * @param {number} wearCount - The number of times the item has been worn.
 * @returns {{ value: number, colorClass: string }} - The calculated CPW and its associated color class.
 */
export const calculateCPW = (price, wearCount) => {
    const numericPrice = parseFloat(price);
    const numericWears = parseInt(wearCount) || 0;

    // Handle invalid price or zero price if generic
    if (isNaN(numericPrice) || numericPrice <= 0) {
        return { value: 0, colorClass: 'text-slate-400' };
    }

    const cpw = numericPrice / (numericWears === 0 ? 1 : numericWears);
    const displayCpw = numericWears === 0 ? numericPrice : cpw;

    let colorClass = 'text-slate-400';
    if (displayCpw < 1) colorClass = 'text-green-400';
    else if (displayCpw > 10) colorClass = 'text-red-400';

    return { value: displayCpw, colorClass };
};
