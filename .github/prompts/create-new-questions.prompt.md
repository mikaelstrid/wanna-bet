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

1. **id** (number): Ett unikt numeriskt löpnummer som identifierar frågan

   - Ska vara unikt för alla frågor oavsett kategori
   - För nya frågor: Sök igenom alla JSON-filer i `data/`-katalogen efter det högsta befintliga `id`-värdet och fortsätt numreringen därifrån
   - Exempel: Om högsta befintliga `id` är 100, ska första nya frågan få `id: 101`
   - **Viktigt**: När en fråga väl har fått ett `id` får det aldrig ändras

2. **rev** (number): Ett numeriskt revisionsnummer för frågan

   - Ska alltid sättas till 1 för nya frågor
   - Ska räknas upp manuellt (inte av systemet) när frågan uppdateras i framtiden
   - Är unikt bara för respektive fråga (olika frågor kan ha samma `rev`-nummer)

3. **question** (string): Själva frågan som ställs till spelarna

   - Ska vara tydlig och lätt att förstå
   - Ska vara på svenska
   - Ska vara formulerad så att svaret är kort och konkret

4. **answer** (string): Det korrekta svaret på frågan

   - Ska vara kort och koncist
   - Får innehålla förklaringar inom parentes om det finns alternativa svar
   - Exempel: "Stockholm", "3 (tre)", "Indien (eller Kina, båda accepteras)"
   - **För frågor där svaret är ett årtal**: Ett intervall runt det korrekta året ska accepteras. Intervallets längd beräknas som 10% av antalet år mellan nuvarande år (2025) och det eftersökta året, avrundat uppåt.
     - Formel: Intervall = ±(ceil(abs(2025 - eftersökt_år) × 0.10) / 2) år
     - Exempel: Om svaret är 1825: Skillnad = 200 år, 10% = 20 år, Intervall = ±10 år → Godkänt svar: 1815-1835
     - Exempel: Om svaret är 1989: Skillnad = 36 år, 10% = 3.6 → 4 år, Intervall = ±2 år → Godkänt svar: 1987-1991
     - Ange svaret som: "1825 (±10 år: 1815-1835)" eller "1989 (±2 år: 1987-1991)"

5. **category** (string): Kategori som frågan tillhör

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

6. **level** (string): Svårighetsgrad för frågan
   - Möjliga värden:
     - `child` - För barn 5-7 år. Enkla frågor om grundläggande saker som barn i den åldern känner till.
     - `tween` - För barn 8-12 år på lågstadiet och mellanstadiet. Frågor om saker som barn lär sig i skolan och i vardagen.
     - `young-teen` - För ungdomar 13-15 år på högstadiet. Mer komplexa frågor som kräver mer kunskap och förståelse.
     - `old-teen` - För ungdomar 16-18 år på gymnasiet. Frågor som kräver djupare kunskap och analytiskt tänkande.
     - `adult` - För vuxna 19+ år. Svårare frågor som kan kräva specialkunskap eller livserfarenhet.

### Valfria Egenskaper (endast för tidsbundna frågor)

7. **start_year** (number): Ungefärligt årtal för början på tidsepoken som frågan gäller

   - Används endast för frågor som är relaterade till en specifik tidsperiod eller händelse
   - Exempel: För frågan "Vilket år föll Berlinmuren?" skulle start_year vara 1989

8. **end_year** (number): Ungefärligt årtal för slutet på tidsepoken som frågan gäller
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
  "id": 101,
  "rev": 1,
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
  "id": 102,
  "rev": 1,
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
    "id": 1,
    "rev": 1,
    "question": "...",
    "answer": "...",
    "category": "...",
    "level": "..."
  },
  {
    "id": 2,
    "rev": 1,
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
   - **KRITISKT**: Svar måste vara 100% verifierbara och korrekta. Gissa ALDRIG eller dra egna slutsatser. Om du är osäker på ett faktum, generera inte frågan.
   - Använd endast väletablerade fakta som kan verifieras från tillförlitliga källor
   - Undvik svar som kan vara tvetydiga eller beroende av tolkning
   - Vid minsta tvivel om korrekthet, hoppa över frågan
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
    "id": 1,
    "rev": 1,
    "question": "Vad heter huvudstaden i Sverige?",
    "answer": "Stockholm",
    "category": "geography",
    "level": "child"
  },
  {
    "id": 2,
    "rev": 1,
    "question": "Vilket år lanserades första iPhone?",
    "answer": "2007",
    "category": "technology-and-innovation",
    "level": "young-teen",
    "start_year": 2007,
    "end_year": 2007
  },
  {
    "id": 3,
    "rev": 1,
    "question": "Hur många hjärtan har en bläckfisk?",
    "answer": "3 (tre)",
    "category": "nature",
    "level": "tween"
  },
  {
    "id": 4,
    "rev": 1,
    "question": "Vem vann Eurovision Song Contest för Sverige 2015?",
    "answer": "Måns Zelmerlöw",
    "category": "popculture",
    "level": "young-teen",
    "start_year": 2015,
    "end_year": 2015
  }
]
```
