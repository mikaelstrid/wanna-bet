# Skapa Nya Frågor för Wanna Bet

## Syfte

Detta dokument innehåller instruktioner för att generera nya frågor till spelet "Wanna Bet".

## Arbetsflöde

Innan du börjar generera nya frågor, **fråga alltid användaren**:

- Ska de nya frågorna **läggas till** de befintliga frågorna i filen?
- Eller ska alla **befintliga frågor tas bort** först innan de nya frågorna läggs till?
- **Hur många frågor** ska genereras i varje kategori/svårighetsgrad?

Detta är viktigt för att undvika att oavsiktligt skriva över eller duplicera frågor.

**Viktigt**: När du genererar nya frågor, **läs alltid igenom de befintliga frågorna först** för att säkerställa att de nya frågorna är unika och inte duplicerar befintliga frågor. Varje fråga ska vara unik i sin formulering och sitt innehåll.

## Frågans Struktur

Varje fråga ska vara ett JSON-objekt med följande egenskaper:

### Obligatoriska Egenskaper

1. **question** (string): Själva frågan som ställs till spelarna

   - Ska vara tydlig och lätt att förstå
   - Ska vara på svenska
   - Ska vara formulerad så att svaret är kort och konkret

2. **answer** (string): Det korrekta svaret på frågan

   - Ska vara kort och koncist
   - Får innehålla förklaringar inom parentes om det finns alternativa svar
   - Exempel: "Stockholm", "3 (tre)", "Indien (eller Kina, båda accepteras)"

3. **category** (string): Kategori som frågan tillhör

   - Möjliga värden:
     - `geography` - Geografi
     - `history-and-society` - Historia och samhälle
     - `popculture` - Populärkultur
     - `nature-science` - Natur och vetenskap
     - `technology-and-innovation` - Teknologi och innovation
     - `trivia` - Trivia
     - `sports-and-leisure` - Sport och fritid
     - `food-drinks-culture` - Mat, dryck och kultur
     - `nature` - Natur
     - `logic-and-puzzles` - Logik och gåtor

4. **level** (string): Svårighetsgrad för frågan
   - Möjliga värden:
     - `child` - För barn 5-7 år. Enkla frågor om grundläggande saker som barn i den åldern känner till.
     - `tween` - För barn 8-12 år på lågstadiet och mellanstadiet. Frågor om saker som barn lär sig i skolan och i vardagen.
     - `young-teen` - För ungdomar 13-15 år på högstadiet. Mer komplexa frågor som kräver mer kunskap och förståelse.
     - `old-teen` - För ungdomar 16-18 år på gymnasiet. Frågor som kräver djupare kunskap och analytiskt tänkande.
     - `adult` - För vuxna 19+ år. Svårare frågor som kan kräva specialkunskap eller livserfarenhet.

### Valfria Egenskaper (endast för tidsbundna frågor)

5. **start_year** (number): Ungefärligt årtal för början på tidsepoken som frågan gäller

   - Används endast för frågor som är relaterade till en specifik tidsperiod eller händelse
   - Exempel: För frågan "Vilket år föll Berlinmuren?" skulle start_year vara 1989

6. **end_year** (number): Ungefärligt årtal för slutet på tidsepoken som frågan gäller
   - Används endast för frågor som är relaterade till en specifik tidsperiod eller händelse
   - Om frågan gäller ett specifikt år, ska start_year och end_year vara samma
   - Exempel: För frågan "Vilket år föll Berlinmuren?" skulle end_year vara 1989

## Riktlinjer för Klassificering

### När ska start_year och end_year användas?

**Använd tidsstämplar för:**

- Historiska händelser (krig, revolutioner, politiska händelser)
- Kulturella fenomen från specifika perioder (filmer, musik, TV-program)
- Teknologiska innovationer och uppfinningar
- Sportresultat och tävlingar från specifika år
- Personer som var aktiva under en viss period

**Använd INTE tidsstämplar för:**

- Frågor om djur och natur (generellt tidlösa)
- Geografiska fakta (länder, huvudstäder, berg, floder - om de inte är nya eller har förändrats)
- Generell vetenskap och matematik
- Logiska gåtor och pussel
- Mat och matlagning (om det inte är en specifik historisk rätt)

### Exempel på Klassificering

#### Fråga med tidsstämpel:

```json
{
  "question": "Vilket år föll Berlinmuren?",
  "answer": "1989",
  "category": "history-and-society",
  "level": "young-teen",
  "start_year": 1989,
  "end_year": 1989
}
```

#### Fråga utan tidsstämpel:

```json
{
  "question": "Vilket är världens största landlevande däggdjur?",
  "answer": "Elefanten",
  "category": "nature",
  "level": "child"
}
```

## Filstruktur

Frågor ska sparas i JSON-filer i katalogen `data/` enligt följande struktur:

- `data/geography.json` - Geografifrågor
- `data/history-and-society.json` - Historia och samhällsfrågor
- `data/popculture.json` - Populärkulturfrågor
- `data/nature-science.json` - Natur- och vetenskapsfrågor
- `data/technology-and-innovation.json` - Teknologi- och innovationsfrågor
- `data/trivia.json` - Triviafrågor
- `data/sports-and-leisure.json` - Sport- och fritidsfrågor
- `data/food-drinks-culture.json` - Mat-, dryck- och kulturfrågor
- `data/nature.json` - Naturfrågor
- `data/logic-and-puzzles.json` - Logik- och gåtfrågor

Varje fil ska innehålla en array av frågobjekt:

```json
[
  {
    "question": "...",
    "answer": "...",
    "category": "...",
    "level": "..."
  },
  {
    "question": "...",
    "answer": "...",
    "category": "...",
    "level": "...",
    "start_year": ...,
    "end_year": ...
  }
]
```

## Kvalitetskrav

1. **Tydlighet**: Frågan ska vara tydlig och entydig
2. **Korrekthet**: Svaret ska vara faktamässigt korrekt
3. **Svårighet**: Svårighetsgraden ska vara lämplig för målgruppen
4. **Balans**: Försök att skapa en balans mellan olika svårighetsgrader
5. **Variation**: Variera typen av frågor inom varje kategori
6. **Tidlöshet**: Undvik frågor som snabbt blir inaktuella (om inte tidsstämplar används)
7. **Kulturell relevans**: Frågor ska vara relevanta för en svensk publik
8. **Icke-självavslöjande**: Frågeställningen får inte innehålla svaret eller direkt avslöja svaret. Spelarna ska behöva använda sina kunskaper för att besvara frågan
9. **Logisk härledbarhet**: Frågor får inte ha tvetydiga svar som baseras på språkliga trick eller ordlekar. Detta är särskilt viktigt för kategorin "logic-and-puzzles" där alla svar måste gå att härleda logiskt utifrån matematiska eller logiska principer.
   - ❌ Exempel på dålig fråga: "Om du har 3 äpplen och tar bort 2, hur många har du då?" (Svaret "2 de du tog" baseras på en språklig tolkning av "tar bort", inte logik)
   - ✅ Exempel på bra fråga: "Vad är nästa tal i serien: 2, 4, 8, 16, 32, ...?" (Svaret "64" kan härledas logiskt från mönstret)

## Exempel på Kompletta Frågor

```json
[
  {
    "question": "Vad heter huvudstaden i Sverige?",
    "answer": "Stockholm",
    "category": "geography",
    "level": "child"
  },
  {
    "question": "Vilket år lanserades första iPhone?",
    "answer": "2007",
    "category": "technology-and-innovation",
    "level": "young-teen",
    "start_year": 2007,
    "end_year": 2007
  },
  {
    "question": "Hur många hjärtan har en bläckfisk?",
    "answer": "3 (tre)",
    "category": "nature",
    "level": "tween"
  },
  {
    "question": "Vem vann Eurovision Song Contest för Sverige 2015?",
    "answer": "Måns Zelmerlöw",
    "category": "popculture",
    "level": "young-teen",
    "start_year": 2015,
    "end_year": 2015
  }
]
```
