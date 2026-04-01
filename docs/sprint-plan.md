# Sprint 2 Plan — Valdrin Bislimi  
Data: 1 Prill 2026  

---

## Gjendja Aktuale

Në këtë fazë të projektit është ndërtuar baza e sistemit dhe janë vendosur themelet arkitekturore sipas praktikave të inxhinierisë softuerike. Projekti është i organizuar në mënyrë të strukturuar dhe i ndarë në shtresa të qarta, duke mundësuar mirëmbajtje dhe zgjerim të lehtë në të ardhmen.

### Çka funksionon tani?

- Projekti është i organizuar sipas arkitekturës me shtresa:
  - Models (strukturat e të dhënave)
  - Services (logjika e biznesit)
  - Data (qasja në të dhëna)
  - UI (ndërfaqja e përdoruesit)

- Është implementuar **Repository Pattern**, duke ndarë logjikën e biznesit nga qasja në të dhëna

- Është krijuar klasa `FileRepository` për menaxhimin e të dhënave nga file CSV

- Është krijuar `ProductService` që menaxhon operacionet mbi produktet

- Është ndërtuar serveri backend duke përdorur Node.js dhe Express

- Serveri ekzekutohet me sukses dhe përgjigjet ndaj kërkesave HTTP

- Është krijuar një ndërfaqe bazike duke përdorur EJS për shfaqjen e produkteve

- Routing është funksional dhe mundëson navigim drejt faqes së produkteve

- Projekti është versionuar dhe publikuar në GitHub me commit-e të strukturuara

- Dokumentimi fillestar (README, architecture.md, class-diagram.md) është i përfunduar

---

### Çka nuk funksionon?

Megjithëse baza e sistemit është e ndërtuar, disa funksionalitete kryesore ende nuk janë implementuar plotësisht:

- CRUD operacionet (Create, Read, Update, Delete) nuk janë të kompletuara
- Të dhënat nuk lexohen dhe shkruhen ende në mënyrë dinamike nga CSV file
- Nuk është implementuar kërkimi dhe filtrimi i produkteve
- UI nuk përmban forma interaktive për shtim, editim apo fshirje të produkteve
- Nuk ka validim të inputeve nga përdoruesi
- Nuk është implementuar error handling për raste të ndryshme (file mungon, input invalid, etj.)
- Nuk ekzistojnë unit tests për verifikimin e funksionalitetit
- Nuk ka lidhje të plotë ndërmjet UI → Service → Repository → Data

---

### A kompajlohet dhe ekzekutohet programi?

Po ✅  
Programi kompajlohet dhe ekzekutohet pa probleme kritike. Serveri funksionon dhe mund të aksesohet përmes browser-it, duke shfaqur faqen bazike të produkteve.

---

## Plani i Sprintit

Qëllimi i këtij sprinti është transformimi i projektit nga një skelet bazik në një sistem funksional me operacione reale mbi të dhëna.

---

### Feature e Re (çka do të ndërtosh)

Feature kryesore që do të implementohet është:

## 🔍 Kërkimi dhe Filtrimi i Produkteve

#### Përshkrimi:
Përdoruesi do të ketë mundësinë të kërkojë produkte bazuar në emrin e tyre përmes një inputi në UI.

#### Si funksionon:
- Useri shkruan një tekst në fushën e kërkimit
- UI dërgon kërkesën në backend
- Service përpunon kërkesën dhe aplikon filtrimin
- Repository lexon të dhënat nga CSV file
- Rezultatet e filtruara shfaqen në UI

#### Arkitektura e rrjedhës:
UI → Service → Repository → CSV File

#### Qëllimi:
- Të demonstrohet ndarja e qartë e përgjegjësive
- Të implementohet logjikë reale biznesi në Service
- Të përdoret Repository për qasje në të dhëna

---

### Error Handling (çka do të shtosh)

Në këtë sprint do të implementohet trajtimi i plotë i gabimeve për të parandaluar ndërprerjen e programit.

#### Rastet që do të trajtohen:

1. **File mungon**
   - Nëse CSV file nuk ekziston, sistemi do ta krijojë automatikisht
   - Mesazh për përdoruesin:
     "File nuk u gjet, po krijoj file të ri..."

2. **Input i gabuar**
   - Nëse përdoruesi vendos të dhëna jo valide (p.sh. tekst në vend të numrit)
   - Mesazh:
     "Ju lutem shkruani një vlerë valide"

3. **Produkti nuk ekziston**
   - Nëse kërkohet një produkt që nuk ekziston
   - Mesazh:
     "Produkti nuk u gjet"

#### Implementimi:
- try-catch në Repository për operacionet me file
- validim në Service për inputet dhe logjikën
- kontroll në UI për inputet e përdoruesit

#### Qëllimi:
- Programi të mos crashojë në asnjë rast
- Të përmirësohet përvoja e përdoruesit
- Të demonstrohet robustësia e sistemit

---

### Teste (çka do të testosh)

Do të implementohen unit tests për verifikimin e funksionaliteteve kryesore.

#### Testet e planifikuara:

1. **Shtimi i produktit valid**
   - Input korrekt → duhet të shtohet me sukses

2. **Shtimi i produktit invalid**
   - Emër bosh → duhet të refuzohet

3. **Kërkimi i produktit ekzistues**
   - Duhet të kthejë rezultat korrekt

4. **Kërkimi i produktit jo-ekzistues**
   - Duhet të kthejë null ose listë bosh

#### Raste kufitare:
- CSV file bosh
- Input i paplotë
- ID që nuk ekziston

#### Qëllimi:
- Të sigurohet korrektësia e logjikës
- Të parandalohen bug-et
- Të rritet cilësia e kodit

---

## Afati

Deadline: Martë, 8 Prill 2026, ora 08:30

---

## Përfundim

Ky sprint synon të kalojë projektin nga një fazë strukturore në një fazë funksionale, duke implementuar logjikë reale, ndërveprim me përdoruesin dhe trajtim të plotë të gabimeve. Përmes këtij sprinti do të sigurohet që sistemi të jetë i qëndrueshëm, i testueshëm dhe i gatshëm për zgjerime të mëtejshme në fazat e ardhshme.
