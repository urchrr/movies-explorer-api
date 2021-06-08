const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator(x) {
        return validator.isEmail(x);
      },
      message: 'Введите корректный емейл',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
},
{
  versionKey: false, // You should be aware of the outcome after set to false
});

module.exports = mongoose.model('user', userSchema);
