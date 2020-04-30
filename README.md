# Financial Transactions With Database

Financial Transactions With Database is an API that register financial transactions in a Database.

## Getting started

To execute this project it will be necessary to install the following programs:

#### Docker:
  How to install Docker on Windows -> https://docs.docker.com/docker-for-windows/install/
  How to install Docker on Ubuntu -> https://docs.docker.com/engine/install/ubuntu/
  How to install Docker on Mac -> https://docs.docker.com/docker-for-mac/install/

  after install the docker, create a container with:
  ```shell
     docker run --name gostack_postgres -e POSTGRES_PASSWORD=(CHOOSE YOUR PASSWORD) -p 5432: 5432
  ```

#### DBeaver:
  DBeaver installer download to Windows Mac an Linux -> https://dbeaver.io/download/

#### NodeJS:
  Install NodeJS -> https://nodejs.org/en/download/

#### Yarn:
  ##### How to install yarn on Windows -> https://classic.yarnpkg.com/en/docs/install/#windows-stable
  ##### How to install yarn on Ubuntu -> https://classic.yarnpkg.com/en/docs/install/#debian-stable
  ##### How to install yarn on Mac -> https://classic.yarnpkg.com/en/docs/install/#mac-stable

## Installing dependencies and configuring the ormconfig.json

- Clone the project in a directory of your choice
- In the project folder open the terminal and type
```shell
  yarn
```
- Wait to install all dependencies
- If you are not using a virtual machine to run Docker go to the ormconfig.json file in the project folder and change the host value to "localhost".

## Creating a database in DBeaver

- With the DBeaver open go to the new connection in the upper left corner and choose postgres.
- The host value is the same value of the host in ormconfig.json file.
- The password value is the same password wich you choosed on creation of the container.
- Go to the PostgresSQL tab and select the option "show all databases" and click in finish.
- Go to the recent created connection and create a new database with the name financial_transactions.

## Running the migrations

- In the project folder run the following command in the terminal:
  ```shell
    yarn typeorm migration:run
  ```

## Running the server

- In the project folder run the following command in the terminal:
  ```shel
    yarn dev:server
  ```

## Routes

- ##### To create a new transaction use the route:
  ##### POST: http://localhost:3333/transaction
  ##### body (JSON):
  ```json

    "title": string
    "value": number
    "type": "income" or "outcome"
    "category": string
  ```

- ##### To list all transactions and the balance use the route:
  ##### GET: http://localhost:3333/transactions

- ##### To delete a transaction use the route:
  ##### DELETE: http://localhost:3333/(id of the transaction)

- ##### To create multiple transactions with a CSV file use the route:
  ##### POST: http://localhost:3333/import
  ##### body (Multipart/form-data):
  ``` json
  "file": (csv file).
  ```


