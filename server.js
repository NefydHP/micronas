const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const jwt = require("jsonwebtoken");
const { exec } = require("child_process");

const app = express();
const DEFAULTPORT = 3000;
const port = 80;
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

function getStorageDataAsync() {
    return new Promise((resolve, reject) => {
        const isWindows = process.platform === "win32";
        const command = isWindows
            ? "wmic logicaldisk get size,freespace,caption"
            : "df -kP";

        exec(command, (error, stdout) => {
            if (error) {
                console.error("Error fetching disk info:", error);
                return reject("Failed to retrieve storage info");
            }

            let storageInfo = {};
            const bytesToGiB = (bytes) => +(bytes / 1073741824).toFixed(2);

            if (isWindows) {
                const lines = stdout.trim().split("\n").slice(1);
                lines.forEach((line) => {
                    const [drive, free, total] = line.trim().split(/\s+/);
                    storageInfo[drive] = {
                        total: bytesToGiB(total),
                        free: bytesToGiB(free),
                        used: bytesToGiB(total - free),
                    };
                });
            } else {
                const lines = stdout.trim().split("\n").slice(1);
                lines.forEach((line) => {
                    const parts = line.split(/\s+/);
                    if (parts.length >= 6) {
                        const mount = parts[5];
                        storageInfo[mount] = {
                            total: bytesToGiB(parts[1] * 1024),
                            used: bytesToGiB(parts[2] * 1024),
                            free: bytesToGiB(parts[3] * 1024),
                        };
                    }
                });
            }
            resolve(storageInfo);
        });
    });
}

app.get("/api/storage", async (req, res) => {
    try {
        const storageInfo = await getStorageDataAsync();
        res.json(storageInfo);
    } catch (error) {
        res.status(500).json({ error });
    }
});

const JWT_SECRET = "secret-key";

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid or expired token." });
        req.user = user;
        next();
    });
};

app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password required." });
    }
    const token = jwt.sign({ username, role: "read-only" }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
});

const IPADDRESS = "0.0.0.0";
app.listen(port, IPADDRESS, () => {
    console.log(`Server running at http://${IPADDRESS}:${port}`);
});
