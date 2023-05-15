export default interface UpdateProduct {
    product_code: string;
    new_price: number;
    currente_price: number;
    name: string;
    valid: boolean;
    error?: string;
}