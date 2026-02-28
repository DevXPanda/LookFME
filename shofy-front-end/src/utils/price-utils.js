import dayjs from "dayjs";

/**
 * Calculates current price and discount status of a product
 * @param {Object} product - Product object from backend
 * @returns {Object} { currentPrice, originalPrice, discount, isDiscountActive }
 */
export const getProductPrice = (product) => {
    if (!product) return { currentPrice: 0, originalPrice: 0, discount: 0, isDiscountActive: false };

    const { price = 0, discount = 0, offerDate } = product;
    const now = dayjs();

    let isDiscountActive = false;

    if (discount > 0) {
        if (offerDate?.startDate && offerDate?.endDate) {
            const start = dayjs(offerDate.startDate);
            const end = dayjs(offerDate.endDate);
            if (now.isAfter(start) && now.isBefore(end)) {
                isDiscountActive = true;
            }
        } else {
            // If no dates but discount exists, we treat it as active (standard behavior)
            isDiscountActive = true;
        }
    }

    const currentPrice = isDiscountActive
        ? price - (price * discount) / 100
        : price;

    return {
        currentPrice,
        originalPrice: price,
        discount: isDiscountActive ? discount : 0,
        isDiscountActive
    };
};
