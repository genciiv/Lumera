# LUMERA — Product Requirements Document (PRD)

## 1. Overview

LUMERA është një platformë SaaS multi-tenant e ndërtuar me MERN,
që ofron module menaxhimi për biznese (si Revo),
me fokus në UI të pastër, ngjyra të lehta dhe përdorshmëri të lartë.

Platforma u shërben bizneseve që duan të menaxhojnë operacionet e tyre
nga një dashboard i vetëm.

---

## 2. Target Users

- Biznese të vogla dhe të mesme
- Agjenci Real Estate
- Dyqane online dhe fizike
- Biznese me inventar

---

## 3. Problem Statement

Bizneset përdorin mjete të shpërndara (Excel, WhatsApp, letra)
që e bëjnë menaxhimin e të dhënave të paqartë dhe joefikas.

---

## 4. Solution

LUMERA ofron:

- Një platformë të vetme
- Role dhe permissions
- Module të ndara sipas nevojës
- Raporte dhe audit logs
- Custom domain për çdo biznes

---

## 5. Monetization

Model abonimi:

- Free
- Basic
- Pro

Në versionin v1, pagesat janë placeholder (request upgrade).

---

## 6. Scope — Versioni 1 (V1)

### 6.1 Core Platform

- Multi-tenant architecture
- Authentication (JWT + refresh tokens)
- Role-Based Access Control (RBAC)
- Dashboard overview
- User management
- Organization settings
- Audit logs
- Domain settings (custom domain)
- Billing page (placeholder)

### 6.2 Modules (V1)

Modulet e përfshira në V1:

- Inventory
- Real Estate CRM
- Ecommerce

---

## 7. Roles & Permissions

### Roles

- PlatformOwner (Super Admin)
- TenantOwner
- Admin
- Staff

### Permissions (High Level)

- PlatformOwner: menaxhon tenants dhe planet
- TenantOwner: kontroll total brenda tenant
- Admin: menaxhon përdorues dhe module
- Staff: akses i kufizuar sipas roleve

---

## 8. Non-Goals (Out of Scope për V1)

- Pagesa reale (Stripe)
- Mobile application
- Chat support
- AI features
- Multi-language support

---

## 9. User Stories

1. Si TenantOwner dua të bëj login dhe të shoh dashboard.
2. Si TenantOwner dua të krijoj përdorues dhe t’u jap role.
3. Si Admin dua të menaxhoj të dhënat e moduleve.
4. Si Staff dua të shoh vetëm çfarë më lejohet.
5. Si Admin dua të shoh audit logs.
6. Si TenantOwner dua të ndryshoj të dhënat e kompanisë.
7. Si TenantOwner dua të vendos domain-in tim.
8. Si PlatformOwner dua të menaxhoj tenants.
9. Si PlatformOwner dua të ndryshoj planet.
10. Si TenantOwner dua të kërkoj upgrade.

---

## 10. Definition of Done

- Login/Register funksional
- Multi-tenant izolim korrekt
- RBAC funksional (API + UI)
- Audit logs aktiv
- Domain settings flow funksional
- Të paktën 1 modul funksional end-to-end
- Deploy live me monitoring bazik
