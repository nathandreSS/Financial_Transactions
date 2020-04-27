import { getRepository, In } from 'typeorm';
import Category from '../models/Category';

interface Request {
  transactions: string[];
}
class CreateMultipleCategoriesFromArray {
  public async execute({ transactions }: Request): Promise<void> {
    const categories = Array.from(
      new Set(transactions.map(transaction => transaction[3])),
    );

    const categoriesRepository = getRepository(Category);
    const existentCategoriesArr = await categoriesRepository.find({
      where: { title: In(categories) },
    });
    const existentCategoriesTitle = existentCategoriesArr.map(
      category => category.title,
    );
    const nonexistentCategories = categories.filter(
      category => !existentCategoriesTitle.includes(category),
    );
    const categoriesObj = nonexistentCategories.map(category => ({
      title: category,
    }));
    const createdCategories = categoriesRepository.create(categoriesObj);
    await categoriesRepository.save(createdCategories);
  }
}

export default CreateMultipleCategoriesFromArray;
