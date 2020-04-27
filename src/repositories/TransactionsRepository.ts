import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TypeSumParams {
  transactions: Transaction[];
  type: 'income' | 'outcome';
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const income = this.typeSum({ transactions, type: 'income' });
    const outcome = this.typeSum({ transactions, type: 'outcome' });
    const total = income - outcome;
    return { income, outcome, total };
  }

  // Sums all transactions with the same type
  private typeSum({ transactions, type }: TypeSumParams): number {
    const value = transactions
      .map(transaction => (transaction.type === type ? transaction.value : 0))
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return value;
  }
}

export default TransactionsRepository;
