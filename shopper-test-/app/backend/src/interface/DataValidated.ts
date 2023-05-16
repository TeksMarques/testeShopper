export interface DataValidated {
    code: number;
    name: string;
    cost_price: number;
    sales_price: number;
    new_price?: number;
    error?: string;
}