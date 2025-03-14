#!/usr/bin/env node
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const jwt = require("jsonwebtoken");
const app = express();
const port = 80;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const mockStorageData = {
	"Flash Drive": { total: 64, used: 52 },
	"Memory Card": { total: 64, used: 47 },
	"Backup Drive": { total: 256, used: 100 },
};

Object.values(mockStorageData).forEach((device) => {
	device.free = device.total - device.used;
});

const JWT_SECRET = "secret-key";

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({ error: "Access denied. No token provided." });
	}
	jwt.verify(token, JWT_SECRET, (err, user) => {
		if (err) {
			return res.status(403).json({ error: "Invalid or expired token." });
		}
		req.user = user;
		next();
	});
};

app.get("/api/storage", authenticateToken, (req, res) => {
	res.json(mockStorageData);
});

app.post("/api/login", (req, res) => {
	const { ipAddress, username, password } = req.body;

	if (!ipAddress || !username || !password) {
		return res
			.status(400)
			.json({ error: "Ip address, username and password are all required." });
	}

	const token = jwt.sign({ username, role: "read-only" }, JWT_SECRET, {
		expiresIn: "1h",
	});
	res.json({ token });
});

const IPADDRESS = "0.0.0.0";
app.listen(port, IPADDRESS, () => {
	console.log(`🟢 Server running at http://${IPADDRESS}:${port}`);
});
