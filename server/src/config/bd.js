const mongoose = require('mongoose');

const crearConeccionBD = () => {
  mongoose
    .connect(process.env.MONGO_URI || 'mongodb://localhost/actividad_2', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Base de datos conectada'))
    .catch((err) => console.log(err));
};
module.exports = crearConeccionBD;
