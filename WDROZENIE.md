# Dwujęzyczna strona Oleksandra Avramchuka — aktualizacja EN/PL

**Punktem wyjścia jest przesłane archiwum `avramchuk-main.zip` (stan z 11.10.2026).**

## Co pozostaje bez zmian
- Wszystkie dotychczasowe dane w `content/site.json`, `content/about.json`, `content/research.json`, `content/books.json`, `content/publications.json`, `content/talks.json`, `content/teaching.json`, `content/cv.json`.
- Zdjęcia, okładki, załączniki, linki, e-mail, dotychczasowy wygląd i zawartość tekstowa EN.
- Globalna wyszukiwarka, powiększanie okładek, nagrody, Public History i News/Contact.
- Aktualny Decap CMS oraz jego istniejące kolekcje.

## Co dochodzi
- `/pl/` i 9 odpowiedników podstron (oraz archiwalna `/pl/books.html`).
- Przełącznik EN | PL na każdej stronie, zachowujący odpowiednią podstronę.
- `bilingual.js` oraz tłumaczenia w `content/pl/*.json`.
- **Dwie grupy pól w istniejącym CMS:** zwykłe angielskie kolekcje (bez zmian) i polskie kolekcje osobno, oznaczone `Polski — ...`.
- Sitemapa, `hreflang`, kanoniczne adresy i istniejąca wyszukiwarka działająca w języku polskim.
- `content/news.json`: pusty dokument startowy, którego nie było w dostarczonym repozytorium. Nowe wpisy można dodawać przez CMS.

## Jak wykonać jedną aktualizację
1. **Najpierw zachowaj kopię** obecnego repozytorium (przed jakąkolwiek zmianą).
2. Z użyciem GitHub Desktop pobierz najnowszą gałąź `main` (`Fetch origin` / `Pull origin`). Jeśli coś zmieniło się po przygotowaniu archiwum, koniecznie porównaj zmienione pliki przed wgraniem aktualizacji.
3. Rozpakuj plik `avramchuk-bilingual-PATCH.zip` i skopiuj **zawartość paczki**, a nie folder zawierający ją, do katalogu lokalnego repozytorium, zachowując podkatalogi `pl/`, `admin/` i `content/pl/`.
4. W GitHub Desktop obejrzyj zmiany: w istniejącym `site.js` i `news-contact.js` są tylko małe poprawki obsługi języka i ścieżek, a w plikach EN HTML dochodzi tylko załadowanie `bilingual.js` i metadane SEO. Nie podmieniaj plików `content/*.json` z wyjątkiem nowego `content/news.json`.
5. Wykonaj **jeden** commit i `Push origin`. Netlify powinno wykonać jeden produkcyjny deploy.
6. Sprawdź `/`, `/pl/`, `/publications.html`, `/pl/publications.html`, `/pl/research.html`, `/pl/talks.html` i `/admin/`. Jeśli coś nie działa, w GitHub Desktop możesz cofnąć pojedynczy commit.

## Co jest wspólne, a co tłumaczone
Publikacje, wykłady i kursy nadal powstają **raz** w angielskich kolekcjach; polskie `content/pl/*.json` przechowują tylko tłumaczenia. Do każdej nowej pozycji można opcjonalnie dopisać osobny polski tytuł/opis; do tego czasu zostanie pokazana w języku oryginału. Okładki, PDF-y, DOI i linki są współdzielone.

W polskiej kolekcji publikacji identyfikatorem jest **dokładny tytuł z wersji oryginalnej** (`source_title`). W przypadku kursów: `original_title`. W przypadku książek i projektów: trwałe `id`. Nie zmieniaj identyfikatorów po stronie polskiej, jeśli chcesz zachować powiązanie tłumaczenia z danymi źródłowymi.

News może mieć również **wiadomości wyłącznie polskie**: pozostaw pole `source_title` puste. Jeśli jest tłumaczeniem wpisu EN, wpisz w nim dokładny angielski tytuł źródłowy.

## Uwaga dotycząca CV
Polska strona CV wyświetla polskie stanowiska i stopnie, ale prowadzi do obecnego angielskiego pliku PDF. Nie tworzyłem polskiego PDF-u, którego nie przesłałeś. Gdy będzie gotowy, można dodać go w CMS w ramach późniejszej aktualizacji.

## Wersja angielska
Nie zmieniono angielskich treści, opisów, nazw publikacji ani obrazów. Pliki HTML EN różnią się jedynie linkami językowymi i podłączeniem przełącznika. Nie korzystaj z tej paczki, jeśli po dacie archiwum wprowadziłeś edycje bez ponownego porównania zmian (`git diff`).
