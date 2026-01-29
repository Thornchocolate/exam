# exam/
├─ server.js
├─ database
└─ public/
├─ index.html Vieša paieška + rezervacijos
├─ login.html Prisijungimas
├─ register.html Registracija
└─ admin.html Admin panel (kategorijos + knygos)


## Diegimas

1. Paleisti MySQL ir importuoti `database.sql`:

```bash
mysql -u root -p < database.sql


Įdiegti Node.js priklausomybes:

npm install express mysql2 body-parser bcryptjs express-session


Paleisti serverį:

node server.js


Naršyklėje atidaryti:

http://localhost:3000/login.html


Prisijungimas: admin / admin

Funkcionalumas
Admin
 Pridėti naujas knygas
 Pridėti naujas kategorijas
 Logout

Vieša sritis
 Paieška pagal knygos pavadinimą
 Rezervacija (tik prisijungusiems vartotojams)

Vartotojai
 Registracija
 Prisijungimas / Logout
 Session valdymas
Pastabos
 Slaptažodžiai saugomi bcrypt maišos formatu
 Minimalus egzaminui veikiantis variantas
 Rezervacijų pratęsimas dar neįdiegtas