import UpdateProduct from '../interface/UpdateProduct';
import { DataValidated } from '../interface/DataValidated';
import PackService from '../services/packService';

function priceValidation(
  result: DataValidated,
  new_price: number
): DataValidated | null {
  result.new_price = new_price;
  if (result.cost_price >= new_price || result.cost_price === new_price) {
    result.error = 'O preço é menor do que o custo';
    return result;
  }
  return null;
}

function adjustmentValidation(
  result: DataValidated,
  new_price: number
): DataValidated | null {
  const percent = (new_price / result.sales_price - 1) * 100;
  result.new_price = new_price;
  if (percent > 10) {
    result.error =
      'O novo valor possui um aumento maior que 10% do valor atual';
    return result;
  }
  if (percent < -10) {
    result.error =
      'O novo valor possui um desconto maior que 10% do valor atual';
    return result;
  }
  return null;
}

export async function packValidation(result: DataValidated): Promise<number[]> {
  const pack = new PackService();
  const isPack = await pack.findByPackId(result.code);
  const isProductOfPack = await pack.findByProductId(result.code);
  if (isPack && isPack?.length > 0) {
    const data: number[] = [];
    isPack.map((element) => {
      data.push(element.product_id);
    });
    return data;
  }
  if (isProductOfPack) {
    const data: number[] = [isProductOfPack.dataValues.pack_id];
    return data;
  }
  return [];
}

export function validations(
  result: DataValidated,
  new_price: number
): DataValidated | null {
  const adjustment = adjustmentValidation(result, new_price);
  if (!adjustment) {
    const price = priceValidation(result, new_price);
    if (!price) {
      result.new_price = new_price;
      return null;
    }
    return price;
  }
  return adjustment;
}

export async function rulesValidations(
  result: DataValidated,
  new_price: number,
  products: UpdateProduct[]
): Promise<DataValidated> {
  let error = '';
  const pack = await packValidation(result);
  const validate = validations(result, new_price);
  if (validate) {
    const data = validate;
    return data;
  } else {
    const data = { ...result, newPrice: new_price };
    return data;
  }
}
