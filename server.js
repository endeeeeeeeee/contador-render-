const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

app.use(express.static('public'));

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