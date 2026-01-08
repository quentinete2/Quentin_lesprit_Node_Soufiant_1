const { Model } = require('sequelize');

const Product = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
        }
    }

    Product.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Product',
        tableName: 'products',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Product;
};

module.exports = Product;

