export default interface UpdateProduct {
    product_code: string;
    new_price: number;
    valid: boolean;
    error?: string;
}