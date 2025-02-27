const axios = require("axios");
require("dotenv").config();

const KNUCT_API = process.env.KNUCT_API_BASE_URL;

// Start Temporary Node
exports.startTempNode = async (req, res) => {
    try {
        const response = await axios.get(`${KNUCT_API}/starttempnode`);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Failed to start temporary node" });
    }
};

// Create Wallet & DID
exports.createWallet = async (req, res) => {
    try {
        const passphrase = Math.random().toString(36).substring(7);
        const seedWords = ["apple", "banana", "cherry", "date"];

        const response = await axios.post(`${KNUCT_API}/createwallet`, {
            passphrase,
            seedWords,
        });

        const { did, privshare } = response.data.data;
        res.status(200).json({ did, privshare });
    } catch (error) {
        res.status(500).json({ error: "Failed to create wallet" });
    }
};
