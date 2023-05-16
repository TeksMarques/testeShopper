import PackModel from "../database/models/Packs";
import { ModelStatic } from "sequelize";

export default class PackService {
    protected model: ModelStatic<PackModel> = PackModel;
    async findByProductId(product_id: number): Promise<PackModel | null> {
        const result = await this.model.findOne({where: {product_id}})
        return result
    
    }
    async findByPackId(pack_id: number): Promise<PackModel[] | null> {
        const result = await this.model.findAll({where: {pack_id}})
        return result
    
    }
}
