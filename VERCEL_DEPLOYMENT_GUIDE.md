# 🚀 SmartDine — Vercel Deployment & MongoDB Atlas Setup Guide

Yeh guide step-by-step batati hai ke aap is project ko **Vercel** par kaise deploy karenge aur **Vercel Storage / Marketplace** se **MongoDB** kaise 1-click mein connect karenge.

---

## 1. Step 1: Code ko GitHub par Push Karein

Apne terminal / PowerShell mein repository initialize karein aur GitHub par push karein:

```bash
git init
git add .
git commit -m "feat: complete SmartDine SaaS with MongoDB Atlas & Vercel readiness"
git branch -M main
git remote add origin https://github.com/<your-username>/smartdine.git
git push -u origin main
```

---

## 2. Step 2: Vercel par New Project Import Karein

1. [Vercel Dashboard](https://vercel.com/dashboard) par jayein.
2. **"Add New..."** $\to$ **"Project"** par click karein.
3. Apna GitHub repository (`smartdine`) select karke **"Import"** karein.
4. Framework Preset automatically **Next.js** detect ho jayega.
5. **"Deploy"** par click karein. (Project 1 minute ke andar live ho jayega).

---

## 3. Step 3: Vercel Marketplace se MongoDB Connect Karein (1-Click)

1. Vercel Project Dashboard mein upar **"Storage"** tab par jayein.
2. **"Connect Database"** button par click karein.
3. Marketplace integrations mein se **"MongoDB Atlas"** select karein.
4. **"Connect"** par click karein aur apna MongoDB account link karein (agar nahi hai to free Atlas account create karein).
5. Vercel automatically aapke project ke environment variables mein **`MONGODB_URI`** inject kar dega!
6. Project ko **Redeploy** karein taake new environment variable apply ho jaye.

---

## 4. Step 4: 1-Click Database Initialization (Seed)

MongoDB connect hone ke baad, apne live Vercel URL par is endpoint ko open karein:

👉 **`https://<your-project>.vercel.app/api/seed`**

Yeh endpoint automatically aapke MongoDB Atlas database mein create karega:
* Restaurant Profile (`Haveli & Co. Artisan Grill`)
* Tamam 8 Gourmet Dishes (Burgers, Pizzas, Karahi, Shakes, Fries)
* Complete Variant Groups (Extra cheese, spice levels, crust types, dips)
* Sample Active Orders

---

## 5. Endpoints & Live Testing Checklist

* **Main App (Multi-Role Switcher):** `https://<your-project>.vercel.app/`
* **Direct Table 04 QR Scan:** `https://<your-project>.vercel.app/r/haveli?table=04`
* **Direct Table 08 QR Scan:** `https://<your-project>.vercel.app/r/haveli?table=08`
* **Orders API:** `https://<your-project>.vercel.app/api/orders`
* **Payment Verify API:** `https://<your-project>.vercel.app/api/payments/verify`
* **FBR POS Invoice API:** `https://<your-project>.vercel.app/api/fbr-invoice`
