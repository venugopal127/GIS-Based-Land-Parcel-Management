const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const supabase = require("../models/db");
const crypto = require("crypto");
require("dotenv").config();

const KNUCT_API = process.env.KNUCT_API_BASE_URL;

// ✅ Seed Words List
const seedWordsList = [
    "Hill", "Bull", "Bag", "Window", "Parrot", "Cloud", "Design", "Zebra",
    "Book", "Cat", "Mobile", "Dog", "Tree", "Computer", "Bottle", "Water"
];

// ✅ Function to get 4 random seed words
const getRandomSeedWords = () => {
    let shuffledWords = [...seedWordsList];
    for (let i = shuffledWords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledWords[i], shuffledWords[j]] = [shuffledWords[j], shuffledWords[i]];
    }
    return shuffledWords.slice(0, 4).map(word => word.toLowerCase());
};

// ✅ Function to Fetch Private Share & Store as Buffer
const storePrivateShareBuffer = async (email, privshareUrl) => {
    try {
        console.log("🔹 Fetching Private Share Image...");
        const response = await axios.get(privshareUrl, { responseType: "arraybuffer" });

        // ✅ Convert image to Buffer
        const imageBuffer = Buffer.from(response.data);

        console.log("✅ Private Share Image Fetched Successfully!");

        // ✅ Store Buffer in Supabase
        const { data, error } = await supabase
            .from("users")
            .update({ privshare_image: imageBuffer })
            .eq("email", email);

        if (error) throw error;
        console.log("✅ Private Share Image Stored Successfully!");
        return true;
    } catch (error) {
        console.error("❌ Error storing Private Share:", error);
        throw new Error("Failed to store Private Share");
    }
};

// ✅ Register User & Generate Wallet
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

        // Generate Passphrase & Seed Words
        const passphrase = crypto.randomUUID();
        const seedWords = getRandomSeedWords();

        const payload = { passphrase, seedWords };

        // ✅ Start Temporary Node
        console.log("🚀 Starting Temporary Node...");
        const startNodeResponse = await axios.get(`${KNUCT_API}/starttempnode`);

        if (startNodeResponse.status === 204) {
            console.log("✅ Node Started Successfully, Proceeding to Wallet Creation");

            console.log("🚀 Creating Wallet...");
            const createWalletResponse = await axios.post(
                `${KNUCT_API}/createwallet`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Cookie": startNodeResponse.headers["set-cookie"]
                    }
                });

            console.log("✅ Wallet Created Successfully:", createWalletResponse.data);
            const { did, privshare } = createWalletResponse.data.data;

            console.log("🔹 Storing DID & Private Share URL in Supabase...");
            await supabase
                .from("users")
                .update({ did, privshare_url: privshare })
                .eq("email", email);

            console.log("✅ DID & Private Share URL Stored Successfully!");

            // ✅ Fetch & Store Private Share Image as Buffer
            const privshareFullUrl = `${KNUCT_API}${privshare}`;
            await storePrivateShareBuffer(email, privshareFullUrl);

            return res.status(201).json({ message: "User registered successfully", did });
        } else {
            console.error("❌ Knuct API failed to start the node", startNodeResponse.status);
            return res.status(500).json({ error: "Knuct API Failed to Start Node" });
        }
    } catch (error) {
        console.error("❌ Registration Error:", error.message);
        return res.status(500).json({ error: "Registration failed", details: error.message });
    }
};

// ✅ Retrieve Private Share Image as Buffer from Supabase
const getPrivateShareBuffer = async (req, res) => {
    const { email } = req.params;

    try {
        console.log(`📥 Fetching Private Share Image for ${email}...`);
        const { data, error } = await supabase
            .from("users")
            .select("privshare_image")
            .eq("email", email)
            .single();

        if (error || !data || !data.privshare_image) {
            console.error("❌ Error retrieving private share:", error);
            return res.status(404).json({ error: "Private share not found" });
        }

        console.log("✅ Private Share Image Retrieved Successfully!");

        // Send Image Buffer as Response
        res.setHeader("Content-Type", "image/png");
        res.send(Buffer.from(data.privshare_image));
    } catch (error) {
        console.error("❌ Error retrieving private share:", error.message);
        res.status(500).json({ error: "Failed to retrieve private share." });
    }
};






// Login Function
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

module.exports = { register, getPrivateShareBuffer,login };
