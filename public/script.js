function showPage(pageId) {
	// hide all pages
	document.querySelectorAll(".page").forEach((page) => {
		page.style.display = "none";
	});

	// also hide the drives page manually
	document.getElementById("drives").style.display = "none";

	// show selected page
	document.getElementById(pageId).style.display = "block";

	// if "drives" page is opened, fetch storage data
	if (pageId === "drives") {
		document.getElementById("drives").style.display = "block"; // Show drives
		fetchStorageData();
	}
}

async function login() {
	const ipAddress = document.getElementById("ipAddress").value;
	const username = document.getElementById("username").value;
	const password = document.getElementById("password").value;

	const response = await fetch("/api/login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ ipAddress, username, password }),
	});

	const data = await response.json();
	if (data.token) {
		localStorage.setItem("token", data.token);
		document.getElementById("login-form").style.display = "none";
		document.getElementById("left-sidebar").style.display = "block";
		showPage("dashboard");

		// ensure menu button appears immediately if on mobile
		if (window.innerWidth <= 800) {
			document.getElementById("menu-button").style.display = "block";
			document.querySelector(".mobile-theme-toggle").style.display = "flex";
			document.querySelector(".mobile-sidebar-logo").style.display = "flex";
		}
	} else {
		alert("Login failed. Please check your credentials.");
	}
}

function logout() {
	const theme = localStorage.getItem("theme"); // Save theme before clearing storage
	localStorage.clear(); // Clear everything else
	localStorage.setItem("theme", theme); // Restore theme setting
	window.location.reload(); // Refresh page
}

// dark theme toggle
document.addEventListener("DOMContentLoaded", () => {
	const themeToggles = document.querySelectorAll("#theme-toggle");

	function applyTheme(isDark) {
		document.body.classList.toggle("dark-mode", isDark);
		localStorage.setItem("theme", isDark ? "dark" : "light");
		themeToggles.forEach((toggle) => (toggle.checked = isDark));
	}

	// Load saved theme
	const isDarkMode = localStorage.getItem("theme") === "dark";
	applyTheme(isDarkMode);

	// Add event listeners to all theme toggles
	themeToggles.forEach((toggle) => {
		toggle.addEventListener("change", () => {
			applyTheme(toggle.checked);
		});
	});
});

// focus on username input if "enter" is clicked while on ipAddress input
document
	.getElementById("ipAddress")
	.addEventListener("keydown", function (event) {
		if (event.key === "Enter") {
			event.preventDefault();
			document.getElementById("username").focus();
		}
	});

// focus on password input if "enter" is clicked while on username input
document
	.getElementById("username")
	.addEventListener("keydown", function (event) {
		if (event.key === "Enter") {
			event.preventDefault();
			document.getElementById("password").focus();
		}
	});

// log in if "enter" is clicked while on password input
document
	.getElementById("password")
	.addEventListener("keydown", function (event) {
		if (event.key === "Enter") {
			event.preventDefault();
			login();
		}
	});

document.getElementById("ipAddress").addEventListener("input", function (e) {
	this.value = this.value.replace(/[^0-9.]/g, "");
});

async function fetchStorageData() {
	const token = localStorage.getItem("token");
	if (!token) return; // stop if not logged in

	const response = await fetch("/api/storage", {
		headers: { Authorization: `Bearer ${token}` },
	});

	if (response.ok) {
		const data = await response.json();
		const storageList = document.getElementById("storage-list");
		storageList.innerHTML = ""; // clear previous data

		let count = 0;
		for (const [name, info] of Object.entries(data)) {
			const storageItem = document.createElement("div");
			storageItem.className = "storage-item";
			count++;
			let emoji = "";

			const progress = (info.used / info.total) * 100;
			let progressColor =
				progress > 75 ? "#ff4d4d" : progress > 50 ? "#ff8f05" : "#76c7c0";

			switch (count) {
				case 1:
					emoji = "📼";
					break;
				case 2:
					emoji = "💾";
					break;
				case 3:
					emoji = "🗃️";
					break;
			}

			storageItem.innerHTML = `
			<a href="#explorer"></a>
			<h2>${emoji} ${name}</h2>
			<p>Total: ${info.total} GB</p>
			<p>Used: ${info.used} GB</p>
			<p>Free: ${info.free} GB</p>
			<div class="progress-bar">
				<div class="progress" style="width: ${progress}%; background: ${progressColor};"></div>
			</div>
		`;
			storageList.appendChild(storageItem);
		}
	} else {
		localStorage.clear();
		alert("Failed to fetch storage data. Please log in again.");
		window.location.reload();
	}
}

// check if user is logged in on page load
window.onload = () => {
	const token = localStorage.getItem("token");

	if (token) {
		document.getElementById("login-form").style.display = "none";
		// force hide mobile menu immediately on load
		document.getElementById("mobile-menu").style.display = "none";

		// only show the correct navigation based on screen width
		if (window.innerWidth <= 800) {
			document.getElementById("menu-button").style.display = "block";
			document.getElementById("left-sidebar").style.display = "none";
		} else {
			document.getElementById("menu-button").style.display = "none";
			document.getElementById("left-sidebar").style.display = "block";
		}
		showPage("dashboard");
	} else {
		document.getElementById("menu-button").style.display = "none"; // hide before login
		document.getElementById("mobile-menu").style.display = "none"; // hide dropdown before login
		document.querySelector(".mobile-theme-toggle").style.display = "none";
		document.querySelector(".mobile-sidebar-logo").style.display = "none";
	}
};

function toggleMenu() {
	const menu = document.getElementById("mobile-menu");
	menu.style.display = menu.style.display === "block" ? "none" : "block";
}

window.onresize = () => {
	if (localStorage.getItem("token")) {
		if (window.innerWidth > 800) {
			// hide on desktop
			document.getElementById("menu-button").style.display = "none";
			document.getElementById("mobile-menu").style.display = "none"; // close menu if open
			document.getElementById("left-sidebar").style.display = "block";
		} else {
			// show on mobile
			document.getElementById("left-sidebar").style.display = "none";
			document.getElementById("menu-button").style.display = "block";
		}
	}
};
