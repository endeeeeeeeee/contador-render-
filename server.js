const express = require('express');
const { Pool } = require('pg');
const path = require('path'); // <- Agrega esta línea

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
// Estas líneas le dicen al servidor dónde encontrar la página
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/visit', async (req, res) => {
    try {
        await pool.query('CREATE TABLE IF NOT EXISTS visits (count INT)');
        const result = await pool.query('SELECT count FROM visits');
        let count;
        if (result.rows.length === 0) {
            count = 1;
            await pool.query('INSERT INTO visits (count) VALUES ($1)', [count]);
        } else {
            count = result.rows[0].count + 1;
            await pool.query('UPDATE visits SET count = $1', [count]);
        }
        res.json({ count });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error del servidor');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
