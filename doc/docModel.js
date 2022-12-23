import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema({
//   // example
//   item: {
//     type: String,
//     required: true
//   }
// });

const UserSchema = new mongoose.Schema(
  {
    promocode: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: false,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    repeatPassword: {
      type: String,
    },
    phomeNumber: {
      type: String,
      required: true,
    },
    balance: {
      type: Object,
      required: true,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    history: {
      type: Object,
    //   required: true,
    },
    cryptoAddress: {
      type: String,
    //   required: true,
      default: "",
    },
    documents:{
        type: Object,
        default: {}
    }
  },
  {
    timestamps: true,
  }
);

const currencySchema = new mongoose.Schema({
  dollar: {
    type: Object,
    required: true,
    default: {},
  },
  ruble: {
    type: Object,
    required: true,
    default: {},
  },
  euro: {
    type: Object,
    required: true,
    default: {},
  },
  bitcoin: {
    type: Object,
    required: true,
    default: {},
  },
  litecoin: {
    type: Object,
    required: true,
    default: {},
  },
  ethereum: {
    type: Object,
    required: true,
    default: {},
  },
  tether: {
    type: Object,
    required: true,
    default: {},
  },
});

export const Сurrency = mongoose.model("Currency", currencySchema);
export const User = mongoose.model("User", UserSchema);
// export default mongoose.model("User", UserSchema);
