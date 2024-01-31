## About this project

This is an basic ecommerce website built in nodejs.

## Setup this project locally

### Server Setup

- Run 'cd server'
- Add .env file
- Copy .env.example to .env
- Add DATABASE_URL - URL for mongodb server
- Run 'npm install'
- Run 'npm run dev'

## Routes

- /api/items (GET) - Get a list of all the items
- /api/cart/add (POST) - Add Items to the cart
- /api/cart/checkout (POST) - Checkout from the cart and validate coupons
- /discount/generate (POST) - Generate a discount code

## Running test cases

- Run 'npm run test'

## Tech Stack

- [Typescript](https://www.typescriptlang.org/) - Language
- [Express.js](https://expressjs.com/) - Backend
- [MongoDB](https://www.mongodb.com/) - Database
- [Prisma](https://www.prisma.io/) - ORM
- [Jest](https://jestjs.io/) - Unit Testing