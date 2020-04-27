import { getRepository, In } from 'typeorm';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

interface InputTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category_id: string | undefined;
}
interface Request {
  transactions: string[];
}
class CreateMultipleTransactionsFromArray {
  public async execute({ transactions }: Request): Promise<Transaction[]> {
    const categoriesTitle = transactions.map(transaction => transaction[3]);
    const categoriesRepository = getRepository(Category);
    const categories = await categoriesRepository.find({
      where: { title: In(categoriesTitle) },
    });
    console.log(`categories: ${categories}`);
    const newTransactions = transactions.map(function (
      transaction,
      index,
    ): InputTransaction {
      const category_id = categories.find(
        category => category.title === transaction[3],
      )?.id;
      if (!category_id) {
        throw new AppError('category_id undefined');
      }
      if (transaction[1] !== 'income' && transaction[1] !== 'outcome') {
        throw new AppError(
          `The type of ${index}° transaction must be income or outcome`,
        );
      }
      const type = transaction[1];
      return {
        title: transaction[0],
        type,
        value: +transaction[2],
        category_id,
      };
    });
    const transactionsRepository = getRepository(Transaction);
    const createdTransictions = transactionsRepository.create(newTransactions);
    await transactionsRepository.save(createdTransictions);
    return createdTransictions;
  }
}

export default CreateMultipleTransactionsFromArray;
