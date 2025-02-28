const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const User = require("../user");
const ProductCatalogue = require("./productCatalogue");
const Store = require("./store");

const StoreInventoryTransfer = sequelize.define(
  "StoreInventoryTransfer",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    trans_type: {
      type: DataTypes.ENUM("Production", "Transfer"),
      allowNull: false,
    },
    batch_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    product_code: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: ProductCatalogue,
        key: "product_code",
      },
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Store,
        key: "store_id",
      },
    },
    from_store_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Store,
        key: "store_id",
      },
    },
    to_store_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Nullable in case it's only production-related
      references: {
        model: Store,
        key: "store_id",
      },
    },
    quantity: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    transfer_status: {
      type: DataTypes.ENUM("Pending", "Completed", "Canceled"),
      allowNull: false,
      defaultValue: "Pending",
    },
    transfered_user_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: User,
        key: "user_id",
      },
    },
    received_user_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: User,
        key: "user_id",
      },
    },
    transfer_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    received_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "store_inventory_transfer",
  }
);

// Associations
StoreInventoryTransfer.belongsTo(ProductCatalogue, {
  foreignKey: "product_code",
});
ProductCatalogue.hasMany(StoreInventoryTransfer, {
  foreignKey: "product_code",
});

StoreInventoryTransfer.belongsTo(Store, { foreignKey: "store_id" });
Store.hasMany(StoreInventoryTransfer, { foreignKey: "store_id" });

StoreInventoryTransfer.belongsTo(Store, {
  foreignKey: "from_store_id",
});
Store.hasMany(StoreInventoryTransfer, {
  foreignKey: "from_store_id",
});

StoreInventoryTransfer.belongsTo(Store, {
  foreignKey: "to_store_id",
});
Store.hasMany(StoreInventoryTransfer, {
  foreignKey: "to_store_id",
});

StoreInventoryTransfer.belongsTo(User, {
  foreignKey: "transfered_user_id",
});
User.hasMany(StoreInventoryTransfer, {
  foreignKey: "transfered_user_id",
});

StoreInventoryTransfer.belongsTo(User, {
  foreignKey: "received_user_id",
});
User.hasMany(StoreInventoryTransfer, {
  foreignKey: "received_user_id",
});

module.exports = StoreInventoryTransfer;
