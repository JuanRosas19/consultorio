const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path')
const crearConeccionBD = require('./config/bd');
const router = require('./router/router');
const app = express();

app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

//Rutas
app.use('/api', router);
app.use('/', express.static(path.join(__dirname, './frontend/dist')))

// Iniciar servidor
app.listen(app.get('port'), () => {
  console.log(`Servidor escuchando en el puerto: ${app.get('port')}`);
  crearConeccionBD();
});
