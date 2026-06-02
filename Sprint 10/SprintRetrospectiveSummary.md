# Sprint Retrospective Summary – Sprint 10

## Šta je išlo dobro

- **Povećanje obima i brzine rada (Velocity)**: U skladu sa povratnom informacijom Product Ownera iz Sprinta 9, tim je drastično povećao obim rada u ovom sprintu. Uspješno je zatvoreno čak 14 korisničkih priča, uključujući 9 novoplaniranih i 3 preostale.
- **Izuzetna pokrivenost testovima**: Kod coverage za sve nove i izmijenjene backend servise i rute iznosi preko 97%, sa ukupno 446 potpuno zelenih testnih scenarija raspoređenih u 24 testna fajla, što ulijeva veliku sigurnost u stabilnost aplikacije.
- **Odlična integracija AI asistenta i naprednih analiza**: AI asistent na bosanskom jeziku, AI Executive Summary i procjena rizika dobavljača su besprijekorno integrisani i vizuelno se uklapaju u novu centralnu Dashboard stranicu.
- **Pravovremena i česta integracija**: Implementirali smo preporuku iz prethodne retrospektive o pravovremenoj isporuci, čime smo spriječili "merge conflict" situacije pred sami kraj sprinta.

## Šta nije išlo dobro

- **Kompleksnost renderovanja Dashboarda**: Zbog velikog broja dinamičkih AI komponenti (asistent, sažetak, preporuke, zavisnost dobavljača) na jednoj stranici, u početnim fazama frontenda došlo je do primjetnog rendering kašnjenja i blokiranja korisničkog interfejsa dok se svi AI odgovori ne učitaju.
- **Simulacija i testiranje AI modela**: Pisanje integracionih testova za AI servise na backendu bilo je izazovno zbog potrebe za mockingom Gemini API-ja u raznim edge-case scenarijima (npr. kada nema dovoljno podataka).

## Šta treba promijeniti

- **Uvođenje skeleton loader-a i asinhronog učitavanja**: Za sve teške AI komponente na Dashboardu potrebno je uvesti loading skeleton-e i potpuno asinhrono učitavanje kako bi se osigurao nesmetan rad ostatka korisničkog interfejsa.
- **Standardizacija mock-ova za eksterne servise**: Razviti jedinstvene i višekratno iskoristive testne helper-e za mockovanje eksternih AI API poziva.

## Koje konkretne akcije tim uvodi u narednom sprintu

- **Uvođenje performansi u Acceptance Criteria**: Pri planiranju budućih vizuelnih i analitičkih modula, eksplicitno definisati performanse renderovanja (npr. asinhrono učitavanje podataka s pozadine bez blokiranja UI niti).
- **Redovni test-driven development (TDD) za servise**: Nastaviti sa praksom pisanja unit testova paralelno sa pisanjem koda kako bi se zadržao visok standard kvaliteta i pokrivenosti.
