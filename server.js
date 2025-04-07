// server.js
import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.get('/', async (req, res) => {
    // Get the user's IP address (behind proxy or not)
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    ip = ip.split(',')[0].trim(); // 👈 take only the first IP

    try {
        const geoRes = await fetch(`https://ipinfo.io/${ip}/json?token=${process.env.IP_INFO_TOKEN}`);
        const geoData = await geoRes.json();

        console.log("User IP:", ip);
        console.log("User Location:", geoData); // Contains city, region, country, loc (lat,long), etc.

        res.send(`Hello from ${geoData.city}, ${geoData.country}!`);
    } catch (err) {
        console.error("Failed to fetch geolocation:", err);
        res.status(500).send("Could not determine location.");
    }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
