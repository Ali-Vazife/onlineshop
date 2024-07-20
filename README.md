# E-commerce Shoes Shop

## Overview

Welcome to the **E-commerce Shoes Shop** project! This is a comprehensive backend system for an online shoe store.
- NodeJS - Express - PostgreSQL - Sequelize 

## Demo

https://github.com/Ali-Vazife/onlineshop/assets/124176120/9461a66a-437a-42f7-a8a7-9724f9a1d404

## Features

- **User Authentication**: Secure session-based authentication.
- **Profile Management**: Users can update their profiles and change their passwords.
- **Product Interaction**: Users can like products and add them to their basket.
- **Basket Management**: Users can view and manage the products in their basket.
- **Database Design**: A well-designed and normalized database following best practices.
- **and more** ...

## Database Design

The database is designed with best practices and normalization rules in mind. Below is the Entity-Relationship Diagram (ERD):

![Database ER Diagram](<Database%20ER%20diagram%20(crow's%20foot)%20(13).png>)

The database design for this E-commerce Shoes Shop project showcases several key advantages due to its adherence to normalization principles:

1. **Normalized Schema**: The schema is designed to be in at least Third Normal Form (3NF), minimizing data redundancy and ensuring data integrity. Each entity is represented by a table with only related data stored in it.

2. **Scalability**: The design supports easy addition of new products, categories, and brands, and can be extended with new features without restructuring the database.

3. **Clear Relationships**: Relationships between entities (e.g., users, products, categories) are well-defined using foreign keys, ensuring referential integrity and data consistency.

4. **Efficient Performance**: By reducing redundant data, the design enhances query performance. Proper indexing on frequently queried columns can further boost performance.

5. **Data Integrity**: Foreign keys and constraints ensure that the data remains consistent and valid. For example, each `product` must be associated with a valid `brand`.

6. **Modular Design**: The separation of data into different tables (e.g., `user_account`, `product`, `variant`, `category`) makes the database easier to manage and understand.

### Normalization

- **1NF**
- **2NF**
- **3NF**

This design ensures an efficient, consistent, and scalable database for the E-commerce Shoes Shop application.

Please note that the purchasing functionality is not yet implemented in this project.

## Project Structure

Here's a quick look at the project structure:

```plaintext
project-root/
├── controllers/
│   ├── authController.js
│   ├── errorController.js
│   ├── productController.js
│   ├── userController.js
│   └── ...other controllers
├── dev-data/
│   ├── data/
│   └── mockData.js
├── models/
│   ├── associations.js
│   ├── db.js
│   ├── productModel.js
│   ├── userModel.js
│   └── ...other models
├── public/
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── userRoutes.js
│   ├── basketRoutes.js
│   ├── likeRoutes.js
│   └── viewRoutes.js
├── utils/
│   ├── AppError.js
│   ├── catchAsync.js
│   └── errorHandler.js
├── views/
│   └── ...view templates
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── app.js
├── config.env
├── example.env
├── package-lock.json
├── package.json
└── server.js
```

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/ecommerce-shop.git
   cd ecommerce-shop
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**: Create a `.env` file in the root directory and add the necessary environment variables.

4. **Run the mock data script** (optional):
   ```bash
   node ./dev-data/mockData.js
   ```

## Usage

### Running the Project

- **Development Mode**:

  ```bash
  npm run dev
  ```

- **Production Mode**:
  ```bash
  npm run start:prod
  ```

### Example Commands

- **Starting the server**:

  ```bash
  npm start
  ```

- **Adding mock data**:
  ```bash
  node ./dev-data/mockData.js
  ```
