const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Mock data for storage monitoring
const mockStorageData = {
	FlashDrive: { total: 64, used: 52 }, // in GB
	MemoryCard: { total: 64, used: 47 },
	BackupDrive: { total: 2, used: 0.7 },
};

Object.values(mockStorageData).forEach((device) => {
	device.free = device.total - device.used;
});

// Secret key for JWT (should be stored securely in production)
const JWT_SECRET = "secret-key";

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

	if (!token) {
		return res.status(401).json({ error: "Access denied. No token provided." });
	}

	jwt.verify(token, JWT_SECRET, (err, user) => {
		if (err) {
			return res.status(403).json({ error: "Invalid or expired token." });
		}
		req.user = user; // Attach the user payload to the request object
		next();
	});
};

// API endpoint to get storage data (protected by authentication)
app.get("/api/storage", authenticateToken, (req, res) => {
	res.json(mockStorageData);
});

// Login endpoint (accepts any username and password)
app.post("/api/login", (req, res) => {
	const { username, password } = req.body;

	// Input validation
	if (!username || !password) {
		return res
			.status(400)
			.json({ error: "Username and password are required." });
	}

	// Generate a token for any username and password
	const token = jwt.sign({ username, role: "read-only" }, JWT_SECRET, {
		expiresIn: "1h",
	}); // Default role: 'read-only'
	res.json({ token });
});

// Start the server
app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
