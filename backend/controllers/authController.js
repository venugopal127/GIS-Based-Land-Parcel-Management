const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const supabase = require("../models/db");
require("dotenv").config();

const KNUCT_API = process.env.KNUCT_API_BASE_URL;

const seedWordsList = [
    "Hill", "Bull", "Bag", "Window", "Parrot", "Cloud", "Design", "Zebra",
    "Book", "Cat", "Mobile", "Dog", "Tree", "Computer", "Bottle", "Water"
];

const getRandomSeedWords = () => {
    // Fisher-Yates shuffle to randomly shuffle the words array
    for (let i = seedWordsList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [seedWordsList[i], seedWordsList[j]] = [seedWordsList[j], seedWordsList[i]];
    }

    // Return exactly 4 words
    return seedWordsList.slice(0, 4);
};

const crypto = require("crypto");

const register = async (req, res) => {
    console.log("📌 Received Register Request:", req.body);

    const { name, email, password } = req.body;

    try {
        console.log("🔹 Hashing Password...");
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("✅ Password Hashed");

        console.log("🔹 Inserting User into Supabase...");
        const { data, error } = await supabase
            .from("users")
            .insert([{ name, email, password: hashedPassword }])
            .select("*");

        if (error) {
            console.error("❌ Supabase Insert Error:", error);
            return res.status(500).json({ error: "Database Insert Failed", details: error });
        }

        console.log("✅ User Inserted in Supabase:", data);

        // ✅ Generate a Proper UUID v4 for Passphrase
        const passphrase = crypto.randomUUID(); // Correctly formatted UUID v4

        // ✅ Select 4 random seed words and convert to lowercase
        const seedWords = getRandomSeedWords().map(word => word.toLowerCase());

        // ✅ Format JSON exactly as needed
        const payload = {
            "passphrase": passphrase,
            "seedWords": seedWords
        };

        // 1. Check status of Knuct API before creating the wallet
        try {
            console.log("🚀 Sending request to Knuct API to start the temporary node...");
            const startTempNodeResponse = await axios.get(
                `${KNUCT_API}/starttempnode`,
                
            );

            // Check if the response is 204 (No Content)
            if (startTempNodeResponse.status === 204) {
                console.log("✅ Node Started Successfully, Proceeding to Wallet Creation");

                // 2. Send request to create wallet
                console.log("🚀 Sending request to Knuct API with Payload:", JSON.stringify(payload, null, 2));
                const createWalletResponse = await axios.post(
                    `${KNUCT_API}/createwallet`,
                    payload,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Cookie": startTempNodeResponse.headers["set-cookie"] // Pass the session cookie
                        }
                    });

                console.log("✅ Knuct API Response:", createWalletResponse.data);

                const { did, privshare } = createWalletResponse.data.data;

                // 3. Store DID and Private Share in Supabase
                console.log("🔹 Storing DID & Private Share in Supabase...");
                const updateResponse = await supabase
                    .from("users")
                    .update({ did, privshare_url: privshare })
                    .eq("email", email);

                if (updateResponse.error) {
                    console.error("❌ Supabase Update Error:", updateResponse.error);
                    return res.status(500).json({ error: "Supabase Update Failed", details: updateResponse.error });
                }

                console.log("✅ DID & Wallet successfully stored in Supabase");

                return res.status(201).json({ message: "User registered successfully", did });
            } else {
                console.error("❌ Knuct API did not start the node successfully", startTempNodeResponse.status);
                return res.status(500).json({ error: "Knuct API Failed to Start Node", details: "Status: " + startTempNodeResponse.status });
            }
        } catch (knuctError) {
            console.error("❌ Knuct API Error:", knuctError.response ? knuctError.response.data : knuctError.message);
            return res.status(500).json({ error: "Knuct API Failed", details: knuctError.response ? knuctError.response.data : knuctError.message });
        }

    } catch (error) {
        console.error("❌ Registration Error:", error.message);
        return res.status(500).json({ error: "Registration failed", details: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("🔹 Fetching User from Supabase...");
        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        if (error || !user) {
            console.error("❌ User Not Found:", error);
            return res.status(404).json({ error: "User not found" });
        }

        console.log("✅ User Found:", user.email);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error("❌ Password Mismatch");
            return res.status(401).json({ error: "Invalid credentials" });
        }

        console.log("✅ Password Verified");

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(200).json({ token, user });
    } catch (error) {
        console.error("❌ Login Error:", error.message);
        res.status(500).json({ error: "Login failed" });
    }
};

module.exports = { register, login };
