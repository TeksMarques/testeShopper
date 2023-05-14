export default interface UpdateProduct {
    product_code: string;
    new_price: number;
    name: string;
    price: number;
    valid: boolean;
    error?: string;
}