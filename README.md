# MICRO NAS - Monitor

This is a web page for users to view, access, and configure their very own MICRO NAS through a user-friendly interface.

![Logo](public/images/banner-orange-darkmode.png)

## Acknowledgements

- [Orange Pi Zero 3](http://www.orangepi.org/html/hardWare/computerAndMicrocontrollers/details/Orange-Pi-Zero-3.html) - The SBC (Single Board Computer) used as the base for the MICRO NAS.
- [Armbian OS](https://github.com/leeboby/armbian-images) - The OS (Operating System) used to operate the MICRO NAS, specifically, the server/headless installation.
- [ZeroTier](https://www.zerotier.com/) - The VN (Virtual Network) used to connect the MICRO NAS over the Wide Area Network for convenient access.

## Authors

- [@NefydHP](https://github.com/NefydHP) - Repository author and Webpage developer
- [@SqueekCheese](https://github.com/SqueekCheese) - Modular Information Card-based Resource Organizer (MICRO) NAS inventor.

# DISCLAIMER

This project is still under beta. Data found in the website may be incomplete or are substitutes.

## Quick Try

**Run Without Installation (Recommended for One-Time Use)**

You can run the website directly using npx (you need to install NodeJS for npx):

```bash
npx micronas-monitor
```

In case of any errors, try running your terminal in administrator mode, or if on
Android Termux, you'll unfortunately need some slightly advanced configuration.

Alternatively on any device, you can install the project and modify the port variable found in server.js to 3000,then run with ```npm run deploy``` or ```node server.js```.

## Deployment

To deploy this project run

```bash
  npm run deploy
```

or

```bash
  node server.js
```

## Installation & Usage

### Prerequisites

Ensure you have Node.js installed. If you don't have it, download and install it from:

🔗 https://nodejs.org/
(Node.js comes with npm and npx by default.)

### Installation Options

**Run Without Installation (Recommended for One-Time Use)**

You can run the tool directly using npx (no installation needed):

```bash
npx micronas-monitor
```

**Install Locally (Recommended for Projects)**

If you want to use the tool in a project, install it locally:

```bash
npm install micronas-monitor
```

Then run it with:

```bash
npx micronas-monitor
```

**Install Globally (Recommended for System-Wide Use)**

To install it globally on your system:

```bash
npm install -g micronas-monitor
```

Now you can run it from anywhere:

```bash
micronas-monitor
```

## Uninstallation

If you no longer need it, remove it with:

**For global installation:**

```bash
npm uninstall -g micronas-monitor
```

**For local installation:**

```bash
npm uninstall micronas-monitor
```

## Features

- Login Page where you can enter your MICRO NAS through IP address, the account you wish to use, and the account password.
- Dashboard for resources and socials.
- Disks Page for viewing and modifying files inside your MICRO NAS.
- Dark mode for less eye strain and an aesthetic change.
- It's also responsive—adapting to most common device sizes and dimensions. Mobile, Desktop, Notebooks, and more!

## Feedback

If you have any feedback, please reach out to us through email at group2.iii.gnhs@gmail.com
