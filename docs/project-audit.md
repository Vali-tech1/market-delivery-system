# Project Audit — Market & Delivery System
Data: 2026

---

## 1. Përshkrimi i shkurtër i projektit

Market & Delivery System është një aplikacion web që lejon menaxhimin e produkteve dhe porosive për një market online. Sistemi mundëson shfletimin e produkteve, shtimin e produkteve të reja, dhe menaxhimin e të dhënave përmes një backend API dhe databaze PostgreSQL.

### Përdoruesit kryesorë:
- Admin (menaxhon produktet dhe ofertat)
- Klient (shfleton dhe blen produkte)

### Funksionaliteti kryesor:
- CRUD operacione për produkte
- Lidhje me databazën PostgreSQL
- API REST për komunikim frontend-backend
- Strukturë arkitekturore e ndarë (Routes → Controller → Service → Repository)

---

## 2. Çka funksionon mirë?

1. **Arkitektura e ndarë në shtresa (Layered Architecture)**  
   Projekti është i organizuar në mënyrë të mirë me ndarje të qartë:
   - routes
   - controllers
   - services
   - repositories  
   Kjo e bën kodin më të lexueshëm dhe më të mirëmbajtshëm.

2. **Lidhja me PostgreSQL funksionon stabilisht**  
   Backend është i lidhur me databazën dhe query-t funksionojnë si duhet (GET products, insert, etj.).

3. **CRUD për produktet është funksional**  
   Sistemi mund të:
   - listojë produkte
   - shtojë produkte
   - përditësojë produkte
   - fshijë produkte  

---

## 3. Dobësitë e projektit

1. **Validimi i inputit ishte i dobët (fillimisht mungonte)**  
   Sistemi lejonte input të pavlefshëm si:
   - emra bosh
   - çmime negative

2. **Error handling i pamjaftueshëm**  
   Në disa raste aplikacioni mund të crashonte ose të kthente error të paqartë.

3. **Probleme me strukturën fillestare të projektit**  
   Fillimisht:
   - files nuk ishin të organizuara mirë
   - mungonte ndarja e qartë në layers

4. **Probleme me databazën (foreign key errors)**  
   Fillimisht ndodhte:
   - insert i produkteve pa kategori valide
   - gabime në marrëdhëniet mes tabelave

5. **Mungesë e dokumentimit të plotë në fillim**  
   README dhe dokumentimi arkitektural nuk ishin të detajuar.

6. **Probleme me konfigurimin e environment variables (.env)**  
   Gabime në lidhjen me databazën për shkak të:
   - password undefined
   - konfigurim jo korrekt

---

## 4. 3 përmirësime që u implementuan

### Përmirësimi 1 — Strukturë më e mirë e projektit

**Problemi:**  
Fillimisht projekti nuk kishte ndarje të qartë dhe ishte i vështirë për t’u menaxhuar.

**Zgjidhja:**  
U implementua arkitektura:
- routes → controllers → services → repositories

**Pse ka rëndësi:**  
- rrit modularitetin
- e bën kodin më të lexueshëm
- lehtëson debugging dhe zgjerimin e projektit

---

### Përmirësimi 2 — Validimi i inputit

**Problemi:**  
Sistemi pranonte të dhëna të pavlefshme (p.sh. emra bosh, çmime negative).

**Zgjidhja:**  
U shtua validim në service layer:
- emri nuk lejohet bosh
- çmimi duhet të jetë > 0
- stock nuk lejohet negativ

**Pse ka rëndësi:**  
- rrit sigurinë e të dhënave
- shmang gabimet në databazë
- përmirëson user experience

---

### Përmirësimi 3 — Rregullimi i lidhjes me databazën dhe foreign keys

**Problemi:**  
Gabime gjatë insertimit për shkak të:
- category_id që nuk ekzistonte
- mungesë e të dhënave fillestare

**Zgjidhja:**  
- u rregulluan insert queries
- u shtuan kategori fillestare
- u përdor TRUNCATE + RESET IDENTITY për debugging

**Pse ka rëndësi:**  
- siguron integritetin e databazës
- shmang crash të aplikacionit
- garanton që të dhënat janë konsistente

---

## 5. Një pjesë që ende nuk e kuptoj plotësisht

Një pjesë që ende kërkon kuptim më të thellë është:

**Repository Pattern dhe ndarja e përgjegjësive mes Service dhe Repository.**

Edhe pse është implementuar:
- ende ka paqartësi se kur logjika duhet të jetë në service
- dhe kur duhet të jetë në repository

Gjithashtu, konceptet si:
- optimizimi i query-ve në PostgreSQL
- dhe menaxhimi i connection pool

janë fusha që kërkojnë më shumë praktikë dhe kuptim.

---

## Përfundim

Projekti është funksional dhe i ndërtuar mbi një arkitekturë solide.  
Dobësitë fillestare janë identifikuar dhe janë përmirësuar në mënyrë graduale.

Ky auditim tregon se sistemi:
- është i kuptuar nga zhvilluesi
- është përmirësuar në mënyrë të menduar
- dhe është gati për zgjerim në fazat e ardhshme (frontend dhe features të avancuara).
