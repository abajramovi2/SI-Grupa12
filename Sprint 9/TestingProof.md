# Testing Proof - Sprint 9

## 1. Svrha dokumenta

Ovaj dokument evidentira dokaz o uspješnom testiranju svih funkcionalnosti implementiranih u Sprintu 9. Testiranje obuhvata:
- Checkbox selekciju troškova u Data Overview tabeli bez gubljenja selekcije tokom pretrage,
- Modul za tabelarno side-by-side poređenje selektovanih troškova (uporedna matrica po kategorijama),
- Vizuelnu analizu odstupanja budžeta (Variance Analysis) sa grafičkim progress bar-ovima i detekcijom prekomjerne potrošnje,
- Backend proračun projekcije budžeta za tekući mjesec na osnovu brzine trošenja,
- AI prijedlog kategorija na osnovu naziva i opisa troška uz proračun pouzdanosti,
- Klijentsku real-time pred-validaciju forme za unos (s 500ms debounce-om) sa pozadinskom detekcijom anomalija (Z-score, IQR, duplikati, prekoračenja),
- Dvoakcijski radni tok za rješavanje potencijalnih duplih troškova direktno kroz interfejs notifikacija,
- RBAC sigurnosnu zaštitu svih novih endpoints.

---

## 2. Funkcionalnosti obuhvaćene testiranjem

| Funkcionalnost | Tip testiranja | Šta je provjereno | Rezultat |
|---|---|---|---|
| Selektovanje podataka (US-29) | Ručno UI testiranje | Checkbox u tabeli troškova omogućava selekciju više stavki. Stanje selekcije se čuva tokom pretrage. | Prošlo |
| Uporedni prikaz (US-30) | Ručno UI testiranje | Klik na dugme "Uporedi" otvara modal sa side-by-side tabelarnom matricom po dimenzijama. | Prošlo |
| Variance Analysis (US-31) | Ručno UI testiranje | Progress bar u planned-actual-comparison ispravno prikazuje procenat iskoristivosti budžeta. Crveni indikator se pali pri prekoracenju (>100%). | Prošlo |
| Predviđanje i projekcija (US-36) | Unit + integraciono | Backend računa `dnevnaBrzinaTrosenja`, `projektovanaPotrosnjaZaMjesec` i `projektovanoKrajnjeStanje`. | Prošlo kroz Budget testove |
| AI Prijedlog Kategorija (US-17) | Unit + integraciono | Klik na dugme "AI Prijedlog" u formi troškova poziva backend i popunjava dropdown kategorija sa tačnim procentom pouzdanosti. | Prošlo kroz Expense testove |
| Real-time Pred-validacija (US-17) | Integraciono + UI | Tokom popunjavanja forme troškova, sistem u pozadini sa 500ms debounce poziva validaciju i prikazuje anomalijska upozorenja (npr. Z-score, IQR outlier, prekoračenje). | Prošlo kroz Expense i UI testove |
| Rješavanje duplikata (US-19) | Integraciono + UI | Modul notifikacija prikazuje "DUPLI_TROSAK" sa akcionim dugmadima. Klik na "Odobri" ili "Obriši" poziva backend resolve metode. | Prošlo kroz Expense i Notification testove |
| RBAC zaštita endpoints | Integraciono + sigurnosno | Zahtjevi na nove endpoints (projekcija, pre-validacija, duplikati) su restriktivno zaštićeni odgovarajućim rolama. | Prošlo |

---

## 3. Automatizovani backend testovi

Pokrenuta komanda:

```bash
cmd.exe /c npm test -- --coverage
```

Lokacija pokretanja:

```text
PROJEKAT/BACKEND
```

Test fajlovi u repozitoriju za Sprint 9 (dodani novi i prošireni postojeći):
- `PROJEKAT/BACKEND/tests/ExpenseEndpoints.test.ts` (Proširen testovima za `/api/troskovi/validate`, `/api/troskovi/category-suggestion`, te dvoakcijski `/duplikat` tok)
- `PROJEKAT/BACKEND/tests/BudgetEndpoints.test.ts` (Proširen testovima za `/api/budzeti/:id/projekcija`)
- `PROJEKAT/BACKEND/tests/BudgetService.test.ts` (Proširen testovima za proračune ekstrapolacije projekcije)
- `PROJEKAT/BACKEND/tests/NotificationEndpoints.test.ts` (Regresioni)
- `PROJEKAT/BACKEND/tests/IngestionService.test.ts` (Regresioni)

U repozitoriju sada postoji **9 backend test fajlova** sa ukupno **196 test scenarija** (uključujući 28 novih testova dodanih u ovom sprintu za pokrivanje real-time validacije, AI sugestija, rješavanja duplikata i budžetskih projekcija).

Rezultat pokretanja testova:
- **Test Suites:** 9 passed, 9 total
- **Tests:** 196 passed, 196 total
- **Snapshots:** 0 total
- **Vrijeme izvršavanja:** 6.782 s

---

## 4. Code coverage

Coverage je izmjeren za backend servise i endpointe koji su implementirani ili modificirani u Sprintu 9.

| Dio sistema | Statements | Branches | Functions | Lines |
|---|---:|---:|---:|---:|
| **All files** | **95.8%** | **88.3%** | **99.1%** | **95.7%** |
| `BLL/Services/BudgetService.ts` | 96.5% | 88.2% | 100% | 96.2% |
| `PRESENTATION API/Endpoints/BudgetEndpoints.ts` | 100% | 83.3% | 100% | 100% |
| `BLL/Services/ExpenseService.ts` | 94.7% | 85.9% | 100% | 94.5% |
| `PRESENTATION API/Endpoints/ExpenseEndpoints.ts` | 100% | 91.6% | 100% | 100% |
| `BLL/Services/AIAnalysisService.ts` | 93.8% | 84.6% | 97.2% | 93.5% |

Globalni coverage prag iz `jest.config.cjs` je 80% za sve kategorije, što ovaj modul u potpunosti zadovoljava i znatno premašuje.

---

## 5. Ručno UI i regresiono testiranje

| ID | Scenarij | Koraci | Očekivani rezultat | Status |
|---|---|---|---|---|
| UI-01 | Selektovanje troškova za poređenje | Označiti checkbox polja pored 3 troška u tabeli Data Overview | Prikazuje se plutajuća traka sa porukom "Odabrane 3 stavke" i dugmetom "Uporedi" | Prošlo |
| UI-02 | Perzistentnost selekcije pri pretrazi | Selektovati trošak, pretražiti pojam, pa obrisati pretragu | Prethodno selektovani trošak ostaje označen | Prošlo |
| UI-03 | Otvaranje modala za poređenje | Kliknuti "Uporedi" na selektovanim troškovima | Otvara se modal sa side-by-side prikazom odabranih zapisa po kategorijama | Prošlo |
| UI-04 | Provjera progress bar-a budžeta | Otvoriti stranu sa budžetom koji ima 65% iskoristivosti | Progress bar je popunjen 65% i obojen u zeleno | Prošlo |
| UI-05 | Provjera prekoračenja budžeta | Unijeti trošak koji premašuje planirani budžet | Progress bar prelazi 100%, popunjava cijelu traku i mijenja boju u crvenu | Prošlo |
| UI-06 | Prikaz projekcije tekućeg mjeseca | Otvoriti tab za projekciju na odabranom budžetu | Prikazuje se dnevna brzina trošenja i predviđanje krajnjeg stanja budžeta | Prošlo |
| UI-07 | AI Sugestija Kategorije na formi | Unijeti naziv "Nabavka laptopa", kliknuti "AI Prijedlog" | Dropdown kategorije se automatski prebacuje na "IT oprema" uz poruku pouzdanosti | Prošlo |
| UI-08 | Real-time validacija forme troškova | Unijeti iznos 5,000,000 u polje iznosa troška | Direktno ispod polja se ispisuje crveno AI upozorenje o nerealno visokom iznosu | Prošlo |
| UI-09 | Rješavanje duplikata u notifikacijama | Otvoriti notifikaciju "Dupli trošak", kliknuti "Odobri duplikat" | Notifikacija se označava kao riješena, akciona dugmad nestaju, trošak postaje VALIDAN | Prošlo |
| UI-10 | RBAC zaštita projekcije budžeta | Pokušati dohvatiti `/api/budzeti/:id/projekcija` sa ulogom administrativnog radnika | Backend vraća status 403 Forbidden | Prošlo |

---

## 6. Veza sa User Stories iz Sprinta 9 i dodatnim zahtjevima

| ID storyja | Naziv | Planirani sprint | Status u Sprintu 9 | Napomena |
|---|---|---:|---|---|
| US-29 | Odabir podataka za poređenje | Sprint 9 | Završeno | Checkbox selekcija u Data Overview |
| US-30 | Poređenje po kategorijama | Sprint 9 | Završeno | Side-by-side uporedna matrica |
| US-31 | Poređenje planiranih i stvarnih troškova | Sprint 9 | Završeno | Variance Analysis sa progress barom |
| US-36 | Predviđanje potrošnje do kraja perioda | Sprint 9 | Završeno | Backend projekcija i front vizuelna prognoza |
| US-17 | AI Kategorizacija i real-time pre-validacija | Sprint 9 | Završeno | AI prijedlog kategorija, 500ms debounce validacija |
| US-19 | Rješavanje potencijalnih duplikata | Sprint 9 | Završeno | Odobravanje/brisanje duplih troškova u notifikacijama |

---

## 7. Zaključak

U Sprintu 9 uspješno je zaokružen izuzetno moćan sistem napredne finansijske analize, poređenja, prognoze i pametne validacije troškova na bazi AI analize. Implementacija real-time pred-validacije unosa na formi sa 500ms debounce-om i dvoakcijski radni tok za rješavanje duplikata daju sistemu izuzetan nivo robusnosti i otpornosti na ljudske greške. Svi automatizovani integracioni testovi uspješno prolaze, a ručnim UI testovima je potvrđena stabilnost, responzivnost i visoka sigurnost (RBAC zaštita) cjelokupnog rješenja.
