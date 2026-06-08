# Svrha izvještaja

Cilj izvještaja je prikazati konkretne i provjerljive rezultate testiranja, vrste testova koje postoje u sistemu, način pokretanja testova, broj testova koji prolaze, ručno testirane korisničke tokove, poznate testne propuste i dokaze o izvršenju testiranja. 

# Obuhvat testiranja

Testiranje obuhvata funkcionalnosti razvijene kroz sprintove od Sprinta 6 do finalne verzije sistema. Kroz ranije sprintove testirani su osnovni CRUD tokovi za troškove, uvoz podataka, budžeti, izvještaji, AI analiza, notifikacije, poređenje troškova, dashboard, komentari, periodični troškovi i budžetski workflow.

U Sprintu 6 testiranje je obuhvatilo CRUD operacije nad troškovima, validacije, zaštitu zaključanih troškova, RBAC kontrolu i regresionu provjeru UI toka za troškove.

| Metrika | Vrijednost |
|---|---|
| Test suites | 2 passed, 2 total |
| Ukupno test scenarija | 53 passed, 53 total |
| Statements coverage | 100% |
| Branches coverage | 97.72% |
| Functions coverage | 100% |
| Lines coverage | 100% |
| Vrijeme izvršavanja | 3.871 s |

U Sprintu 7 dodani su testovi za CSV/Excel uvoz, validaciju uvezenih redova, historiju uvoza i budžetske funkcionalnosti.

| Metrika | Vrijednost |
|---|---|
| Test suites | 6 passed, 6 total |
| Ukupno test scenarija | 134 passed, 134 total |
| Statements coverage (All files) | 93.8% |
| Branches coverage (All files) | 85.11% |
| Functions coverage (All files) | 98.03% |
| Lines coverage (All files) | 93.73% |
| Vrijeme izvršavanja | 5.437 s |

U Sprintu 8 testirani su Data Overview, filtriranje, sortiranje, historija uvoza, generisanje izvještaja i eksport u XLSX, CSV formate.

| Metrika | Vrijednost |
|---|---|
| Test suites | 9 passed, 9 total |
| Ukupno test scenarija | 168 passed, 168 total |
| Statements coverage (All files) | 94.2% |
| Branches coverage (All files) | 86.3% |
| Functions coverage (All files) | 98.2% |
| Lines coverage (All files) | 94.1% |
| Vrijeme izvršavanja | 6.182 s |

U Sprintu 9 proširen je obuhvat na AI detekciju anomalija, notifikacije, AI prijedloge kategorija, projekcije budžeta i pred-validaciju troškova.

| Metrika | Vrijednost |
|---|---|
| Test suites | 23 passed, 23 total |
| Ukupno test scenarija | 326 passed, 326 total |
| Statements coverage (All files) | 96.2% |
| Branches coverage (All files) | 89.1% |
| Functions coverage (All files) | 99.3% |
| Lines coverage (All files) | 96.1% |
| Vrijeme izvršavanja | 8.423 s |

U Sprintu 10 testirani su dashboard, AI asistent, Executive Summary, komentari, povrat budžeta na doradu, periodični troškovi, sumnjivi obrasci potrošnje i preporuke za optimizaciju.

| Metrika | Vrijednost |
|---|---|
| Test suites | 24 passed, 24 total |
| Ukupno test scenarija | 446 passed, 446 total |
| Statements coverage (All files) | 97.85% |
| Branches coverage (All files) | 92.77% |
| Functions coverage (All files) | 99.18% |
| Lines coverage (All files) | 97.79% |
| Vrijeme izvršavanja | 11.435 s |

# Vrste testiranja u projektu

U projektu postoje sljedeće vrste testiranja:

| Vrsta testiranja | Opis | Primjeri pokrivenih funkcionalnosti |
|---|---|---|
| Unit testovi | Testiraju pojedinačne funkcije, metode i servise izolovano od ostatka sistema. Cilj je provjeriti poslovnu logiku, validacije i proračune bez direktne zavisnosti od baze ili eksternih servisa. | Validacija troškova, proračun budžeta, AI analiza, detekcija anomalija, komentari i notifikacije. |
| Integracioni testovi | Testiranje kompletnog toka od HTTP zahtjeva do odgovora, uključujući middlewares, autorizaciju i bazu | Expense endpoints, Budget endpoints, Report endpoints, Notification endpoints i AI Analysis endpoints. |
| Regresioni testovi | Provjeravaju da nove izmjene nisu narušile ranije implementirane funkcionalnosti. Pokreću se nakon dodavanja novih modula ili većih izmjena u postojećem kodu. | CRUD troškova nakon dodavanja uvoza, budžeta, izvještaja, AI modula i notifikacija. |
| UI / ručno testiranje | Ručna provjera rada sistema kroz korisnički interfejs, uključujući forme, dugmad, validacione poruke, modale, tabele, grafikone i glavne korisničke tokove. | Kreiranje troška, uvoz fajla, filtriranje, dashboard, AI asistent, komentari i budžetski workflow. |
| Sigurnosno / RBAC testiranje | Provjerava da korisnici mogu pristupiti samo funkcionalnostima koje su dozvoljene njihovom rolom, te da su zaštićeni endpointi blokirani za neovlaštene korisnike. | CRUD troškova, izvještaji, budžeti, notifikacije, dashboard i zaštićeni endpointi. |

# Automatizovani backend testovi

Automatizovani backend testovi se pokreću iz backend direktorija projekta.

**Lokacija:**

```text
PROJEKAT/BACKEND
```

**Komanda za pokretanje testova sa coverage izvještajem:**

```bash
cmd.exe /c npm test -- --coverage
```

Konfiguracija testova nalazi se u fajlu `PROJEKAT/BACKEND/jest.config.cjs`. Test fajlovi su smješteni u direktoriju `PROJEKAT/BACKEND/tests/` sa konvencijom imenovanja `*.test.ts`.

# Rezultat automatizovanih testova u finalnoj verziji

Prema posljednjem izvršenju testova u finalnoj verziji sistema:

| Metrika | Rezultat |
|---|---|
| Test Suites | 24 passed / 24 total |
| Tests | 459 passed / 459 total |
| Snapshots | 0 total |
| Vrijeme izvršavanja | 13.58 s |
| Status | Svi testovi prolaze |

Finalni coverage:

| Coverage kategorija | Rezultat |
|---|---|
| Statements | 95.8% |
| Branches | 83.4% |
| Functions | 93.99% |
| Lines | 96.73% |

Svi rezultati prelaze globalni coverage prag od 80% koji se koristio u ranijim sprintovima za statements, branches, functions i lines coverage. Raniji Testing Proof dokumenti također pokazuju da je coverage kroz sprintove kontinuirano prelazio definisani prag.

<p align="center">
  <img width="1731" height="995" alt="Screenshot 2026-06-08 120909" src="https://github.com/user-attachments/assets/69495cab-07b0-40b1-a420-3e63db9e3402" />
</p>

<p align="center">
  <b>Slika 1. Dokaz finalnog pokretanja testova</b>
</p>

# Ručno UI testiranje

Pored automatizovanih backend testova, za svaki sprint provedeno je ručno testiranje. Ručno testiranje je rađeno kroz korisnički interfejs, jer određeni tokovi zahtijevaju provjeru stvarnog ponašanja aplikacije, prikaza poruka, modala, dugmadi, grafikona i workflowa između korisničkih rola.

| Ručno testirani scenario | Koraci | Očekivani rezultat | Status |
|---|---|---|---|
| Pregled i CRUD troškova | Otvoriti listu troškova, kreirati, urediti i obrisati trošak | Lista se ažurira, validacije rade, zaključani troškovi se ne mogu mijenjati | Pass |
| RBAC kontrola za CRUD | Prijaviti se različitim rolama i pokušati CRUD akcije | Akcije su dostupne samo ovlaštenim korisnicima | Pass |
| Uvoz CSV/XLS/XLSX fajla | Uploadovati validan i nevalidan fajl | Validni redovi se prikazuju za potvrdu, nevalidni se označavaju greškom | Pass |
| Historija uvoza | Otvoriti detalje prethodnog importa | Prikazuju se status, broj redova i greške po redu | Pass |
| Kreiranje i odobravanje budžeta | Kreirati budžet i promijeniti status kao ovlaštena rola | Budžet dobija ispravan status i evidentira se korisnik koji je izvršio akciju | Pass |
| Izvještaji i eksport | Generisati izvještaj i eksportovati XLSX, CSV i PDF | Datoteke se preuzimaju i sadrže očekivane podatke | Pass |
| Pretraga, filtriranje i sortiranje | Kombinovati tekstualnu pretragu, filtere i sortiranje | Tabele se ažuriraju prema zadatim kriterijima | Pass |
| Poređenje troškova | Selektovati više troškova i kliknuti “Uporedi” | Otvara se tabelarno/grafičko poređenje selektovanih stavki | Pass |
| AI pred-validacija troška | Unijeti neuobičajeno visok iznos troška | Sistem prikazuje upozorenje nakon debounce validacije | Pass |
| Notifikacije o anomaliji | Kreirati/anlizirati trošak koji izaziva anomaliju | Kreira se notifikacija sa opisom i preporučenom akcijom | Pass |
| Dashboard | Otvoriti centralni dashboard | Prikazuju se KPI kartice, grafikoni, trendovi i sažeci | Pass |
| Drill-down sa grafikona | Kliknuti na segment grafikona | Prikazuju se pojedinačni troškovi koji čine odabranu sumu | Pass |
| AI asistent | Postaviti pitanje o troškovima, budžetima ili anomalijama | Sistem vraća odgovor na osnovu dostupnih podataka | Pass |
| Komentari na troškove | Dodati komentar i otvoriti historiju komentara | Komentar se prikazuje sa autorom i vremenom | Pass |
| Povrat budžeta na doradu | Finansijski direktor vraća budžet uz komentar | Status prelazi u “Na doradi”, komentar se bilježi i šalje se notifikacija | Pass |
| Ponovna dostava budžeta | Računovođa ispravlja budžet i šalje ponovo | Status prelazi u “Na čekanju”, direktor dobija notifikaciju | Pass |
| Periodični troškovi | Provjeriti dashboard kada očekivani periodični trošak izostane | Sistem prikazuje upozorenje o neevidentiranom periodičnom trošku | Pass |

Ovi scenariji su objedinjeni iz Testing Proof dokumenata za sprintove 6–10, u kojima su kroz svaki sprint evidentirani UI i regresioni testovi za implementirane funkcionalnosti.

# Ključni korisnički tokovi provjereni testiranjem

Tokom završnog testiranja provjereni su ključni korisnički tokovi koji predstavljaju osnovni način korištenja sistema. Fokus testiranja bio je na tome da korisnik može izvršiti kompletne poslovne akcije kroz aplikaciju, a ne samo da se pojedinačne stranice uspješno otvaraju. Ključni korisnički tokovi provjereni su kroz kombinaciju automatizovanih backend testova i ručnog testiranja korisničkog interfejsa. Provjereni su sljedeći tokovi:

- **Upravljanje troškovima**  
  Provjeren je tok pregleda, kreiranja, izmjene, validacije i brisanja troškova. Testirano je da se lista troškova ispravno ažurira nakon akcija korisnika, da se nevalidni podaci odbijaju i da se zaključani troškovi ne mogu mijenjati.

- **Import troškova iz fajla**  
  Provjeren je tok učitavanja CSV, XLS i XLSX fajlova, prikaz preview-a uvoza, označavanje validnih i nevalidnih redova, potvrda importovanja i pregled historije importovanih fajlova.

- **Budžetiranje i odobravanje budžeta**  
  Testirano je kreiranje budžeta, pregled postojećih budžeta, validacija budžetskih podataka, projekcija potrošnje i poređenje planiranog i stvarnog stanja. Posebno je provjeren tok odobravanja budžeta, uključujući povrat na doradu, unos komentara, ponovnu dostavu i pregled historije komentara.

- **AI analiza i detekcija odstupanja**  
  Provjereno je da sistem može detektovati anomalije, duple troškove, sumnjive obrasce potrošnje i izostanak periodičnih troškova. Testirano je i da sistem prikazuje odgovarajuća upozorenja i notifikacije sa opisom problema i preporučenom akcijom.

- **Notifikacije i komentari**  
  Provjereno je kreiranje i prikaz notifikacija za anomalije, budžete i druge sistemske događaje. Također je testirano dodavanje komentara na troškove i budžete, kao i prikaz autora, vremena i historije komentara.

- **Izvještaji i finansijske metrike**  
  Testirano je generisanje finansijskih izvještaja, pregled agregiranih podataka, filtriranje po periodu i eksport izvještaja u XLSX, CSV i PDF formatu.

- **Data Overview i poređenje troškova**  
  Provjeren je pregled finansijskih podataka kroz Data Overview modul, uključujući pretragu, filtriranje, sortiranje, modalne detalje entiteta i poređenje selektovanih troškova u tabelarnom i grafičkom prikazu.

- **Dashboard i AI asistent**  
  Testiran je centralni dashboard sa KPI karticama, grafikonima, trendovima, drill-down prikazom i Executive Summary sekcijom. Provjeren je i AI asistent kroz pitanja o troškovima, budžetima, dobavljačima i anomalijama, pri čemu sistem odgovara na osnovu dostupnih podataka.

- **RBAC i pristup po korisničkim rolama**  
  Provjereno je da korisnici mogu pristupiti samo funkcionalnostima koje su dozvoljene njihovom rolom. Testirani su zaštićeni endpointi, stranice i akcije kao što su CRUD operacije, izvještaji, budžeti, dashboard i administrativne funkcionalnosti.

# Poznati testni propusti i ograničenja testiranja

U trenutnom stanju projekta nema poznatih padajućih automatizovanih testova. Svi backend testovi prolaze, što pokazuje da su ključne servisne, integracione i poslovne funkcionalnosti stabilne u okviru postojećeg testnog okruženja. Ipak, postoje određena ograničenja u širini testne pokrivenosti koja su evidentirana kao poznati testni propusti.

| Ograničenje | Objašnjenje | Uticaj / preporuka |
|---|---|---|
| Ograničena automatizovana frontend pokrivenost | Frontend dio aplikacije ima manji broj automatizovanih testova u odnosu na backend. Većina kompleksnih UI tokova, kao što su dashboard, modali, poređenje troškova, notifikacije, komentari i budžetski workflow, provjerena je ručno. | Za budući razvoj preporučuje se dodati više komponentnih i UI testova. |
| Nedostatak potpunih end-to-end testova | Ne postoje automatizovani E2E testovi koji prolaze kroz cijeli korisnički tok od prijave korisnika, preko akcija u interfejsu, do potvrde promjena na backendu i u bazi podataka. | Kompletni korisnički scenariji su trenutno većinom provjereni ručno. Preporučuje se uvođenje Cypress, Playwright ili sličnog alata. |
| RBAC i autentikacija nisu pokriveni kroz kompletne E2E scenarije | RBAC je pokriven kroz backend testove, mock pristup i ručnu provjeru korisničkih rola, ali ne postoje automatizovani browser testovi za svaku rolu. | Za produkcijski nivo sistema preporučuje se dodati sigurnosne E2E scenarije po rolama. |
| AI integracije su testirane kroz mock/fallback logiku | AI funkcionalnosti su testirane kroz servisnu logiku, fallback ponašanje i mockovane odgovore. Takav pristup omogućava stabilne testove, ali ne garantuje identično ponašanje stvarnog eksternog AI servisa. | Kvalitet AI odgovora, posebno kod AI asistenta i preporuka, potrebno je dodatno ručno provjeravati u demo scenarijima. |
| Nisu urađeni load ili stress testovi | Sistem je funkcionalno testiran, ali nije posebno mjereno ponašanje pri velikom broju korisnika, velikom broju troškova, velikim import fajlovima ili čestom pokretanju AI analiza i izvještaja. | Za nastavak projekta preporučuje se uvođenje performansnih testova nad većim datasetima. |

Navedeni testni propusti ne predstavljaju trenutno blokirajuće greške, jer svi postojeći automatizovani backend testovi prolaze. Oni prvenstveno pokazuju oblasti koje bi trebalo unaprijediti ako se projekat nastavi: proširenje frontend automatizovanih testova, uvođenje potpunih E2E scenarija, detaljnije sigurnosno testiranje po rolama, testiranje stvarnih AI integracija, performansno testiranje.
