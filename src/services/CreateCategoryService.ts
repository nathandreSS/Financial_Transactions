import { getRepository } from 'typeorm';
import Category from '../models/Category';

interface Request {
  title: string;
}
class CreateCategory {
  public async execute({ title }: Request): Promise<Category> {
    const categoriesRepository = getRepository(Category);

    const category = await categoriesRepository.findOne({ title });
    if (category) {
      return category;
    }

    const createCategory = categoriesRepository.create({ title });
    const newCategory = await categoriesRepository.save(createCategory);
    return newCategory;
  }
}

export default CreateCategory;
