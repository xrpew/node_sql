const express = require('express');
require('dotenv').config();
app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended : false }));
app.use(require('./routes/index'));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});