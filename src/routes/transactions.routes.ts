/* eslint-disable no-await-in-loop */
import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';

import CreateTransactionService from '../services/CreateTransactionService';
import CreateCategoryService from '../services/CreateCategoryService';
import LoadCSVService from '../services/LoadCSVService';
import TransactionsRepository from '../repositories/TransactionsRepository';
import uploadConfig from '../config/upload';
import CreateMultipleCategoriesFromArray from '../services/CreateMultipleCategoriesFromArray';
import CreateMultipleTransactionsFromArray from '../services/CreateMultipleTransactionsFromArray';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find();
  const balance = await transactionsRepository.getBalance();
  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createCategory = new CreateCategoryService();
  const category_id = (await createCategory.execute({ title: category })).id;

  const createTransaction = new CreateTransactionService();
  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category_id,
  });
  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  transactionsRepository.delete({ id });
  return response.send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const loadCSVService = new LoadCSVService();
    const transactionsArr = await loadCSVService.execute(request.file.filename);
    const createMultipleCategoriesFromArray = new CreateMultipleCategoriesFromArray();
    await createMultipleCategoriesFromArray.execute({
      transactions: transactionsArr,
    });
    const createMultipleTransactionsFromArray = new CreateMultipleTransactionsFromArray();
    const transactions = await createMultipleTransactionsFromArray.execute({
      transactions: transactionsArr,
    });
    return response.json(transactions);
  },
);

export default transactionsRouter;
