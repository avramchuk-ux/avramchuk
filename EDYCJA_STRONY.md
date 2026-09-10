# Jak później edytować stronę

Po jednorazowej konfiguracji zapamiętaj tylko adres:

`https://TWOJA-DOMENA/admin/`

## Najczęstsze czynności

### Zmiana tekstu na stronie głównej
1. Wejdź w **Profile & homepage**.
2. Zmień tekst w odpowiednim polu.
3. Kliknij **Publish**.

### Dodanie publikacji
1. Wejdź w **Publications**.
2. W polu **Publication list** kliknij **Add**.
3. Wpisz tytuł, rok i cytowanie.
4. Wybierz typ publikacji.
5. Dodaj tagi; możesz wkleić DOI, link albo załadować PDF.
6. Jeśli pozycja ma być widoczna na stronie głównej, zaznacz **Show on homepage**.
7. Kliknij **Publish**.

### Dodanie książki
1. Wejdź w **Books** → **Books and editions** → **Add**.
2. Dodaj tytuł, status, opis i okładkę.
3. Tylko jedna książka powinna mieć włączone **Featured on homepage**.
4. Kliknij **Publish**.

### Dodanie wykładu / podcastu / wywiadu
1. Wejdź w **Talks & Media**.
2. Kliknij **Add**.
3. Wybierz typ, podaj tytuł, miejsce/outlet, datę i link.
4. Kliknij **Publish**.

### Zmiana zdjęcia
W **Profile & homepage** wybierz **Homepage portrait**. Plik zostanie zapisany automatycznie w `assets/uploads/`. Osobne zdjęcie można ustawić na stronie **About**.

### Podmiana CV
1. Wejdź w **CV**.
2. Przy **CV PDF** wybierz nowy plik.
3. Zmień **Last updated**.
4. Kliknij **Publish**.

## Co dzieje się po kliknięciu Publish?

Nie musisz nic robić na GitHubie. Decap CMS zapisuje zmianę w repozytorium, a Netlify automatycznie publikuje nową wersję strony.

## Czego nie trzeba ruszać

Przy zwykłej aktualizacji nie edytujesz `index.html`, `site.js`, `styles.css` ani `admin/config.yml`. Te pliki zmienia się tylko wtedy, gdy chcesz przebudować wygląd lub dodać nowy typ treści.
