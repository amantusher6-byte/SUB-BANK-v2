# SUB Bank v2 — Complete Demo Project

A responsive banking-system learning project built with HTML, CSS, JavaScript and browser localStorage.

## Files
- `index.html` — login/register, dashboard and all page layouts
- `style.css` — responsive design, mobile navigation and dark theme
- `script.js` — demo authentication, local data, deposits, withdrawals, transfers, history, profile and CSV export

## Run in VS Code (Windows)
1. Extract this ZIP.
2. Open the `SUB-Bank-v2-Complete` folder in VS Code.
3. Install the Live Server extension if needed.
4. Right-click `index.html` → **Open with Live Server**.
5. Create a demo account to use the dashboard.

You can also use Python if installed:
```powershell
py -m http.server 5500
```
Open `http://localhost:5500`.

## Features
- Sign up / sign in UI
- Dashboard and demo balance
- Deposit and withdrawal simulation
- Transfer between registered demo accounts in the same browser
- Transaction history, search/filter and CSV export
- Profile edit, dark mode, logout and reset demo data
- Responsive mobile layout

## Important safety note
This is an educational simulation, not a real bank. It does not connect to banks or payment networks. It stores demo data in localStorage, and passwords are stored in plain text for demonstration. Do not use real passwords, personal financial information, or real money. A real deployment requires a secure backend, server-side password hashing, authorization, audit logging, and security review.
