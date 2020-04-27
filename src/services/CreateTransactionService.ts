// import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: string;
  category_id: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category_id,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (type !== 'income') {
      if (type === 'outcome') {
        if (value > (await transactionsRepository.getBalance()).total) {
          throw new AppError('Insuficient Funds', 400);
        }
      } else {
        throw new AppError('Invalid Type', 400);
      }
    }
    const createTransaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    });

    const transaction = await transactionsRepository.save(createTransaction);
    return transaction;
  }
}

export default CreateTransactionService;
