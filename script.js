// Globale Variablen
const setsPath = "./sets/"; // Pfad zum Ordner, der die Sets enthält
const setSelector = document.getElementById("set-selector");
const gameBoard = document.getElementById("game-board");
const selectedCardDisplay = document.getElementById("selected-card-display");
const chooseRandomCardButton = document.getElementById("choose-random-card");
const imageSizeSlider = document.getElementById("image-size-slider");
const imageSizeLabel = document.getElementById("image-size-label");

let currentSetCharacters = []; // Speichert die Charaktere des aktuellen Sets
let imageSize = 150; // Standardgröße der Bilder (in Pixeln)

// Funktion zum Laden eines Sets
async function loadSet(setName) {
    try {
        gameBoard.innerHTML = ""; // Spielfeld leeren
        const response = await fetch(`${setsPath}${setName}/index.json`);
        if (!response.ok) throw new Error(`Set ${setName} konnte nicht geladen werden.`);

        const characters = await response.json();
        currentSetCharacters = characters; // Liste der Charaktere aktualisieren

        // Den Button aktivieren, nachdem das Set geladen wurde
        chooseRandomCardButton.disabled = false; 

        const totalCharacters = characters.length;

        // Berechne die optimale Anzahl an Spalten
        const columns = Math.ceil(Math.sqrt(totalCharacters));
        const rows = Math.ceil(totalCharacters / columns);

        // Grid-Layout anpassen
        gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

        characters.forEach(character => {
            const characterElement = document.createElement("div");
            characterElement.classList.add("character");

            const img = document.createElement("img");
            img.src = `${setsPath}${setName}/${character}`;
            img.alt = character;
            img.style.width = `${imageSize}px`; // Bildgröße anpassen

            const name = document.createElement("div");
            name.classList.add("character-name");
            name.textContent = character.replace(/\.[^/.]+$/, "");

            // Klick-Event hinzufügen
            characterElement.addEventListener("click", () => {
                characterElement.classList.toggle("inactive");
            });

            characterElement.appendChild(img);
            characterElement.appendChild(name);
            gameBoard.appendChild(characterElement);
        });
    } catch (error) {
        console.error("Fehler beim Laden des Sets:", error);
        alert(`Fehler beim Laden des Sets "${setName}".`);
    }
}

// Funktion zum Laden der Sets im Dropdown
async function loadSets() {
    try {
        const response = await fetch(`${setsPath}index.json`);
        if (!response.ok) throw new Error("index.json konnte nicht geladen werden.");

        const sets = await response.json();

        // Dropdown mit Sets befüllen
        sets.forEach(set => {
            const option = document.createElement("option");
            option.value = set;
            option.textContent = set;
            setSelector.appendChild(option);
        });

        // Den ersten Set automatisch laden, wenn Sets vorhanden sind
        if (sets.length > 0) {
            setSelector.value = sets[0];  // Setze das erste Set als Standard
            loadSet(sets[0]); // Lade das erste Set
        } else {
            alert("Keine Sets gefunden.");
        }
    } catch (error) {
        console.error("Fehler beim Laden der Sets:", error);
        alert("Fehler beim Laden der Sets. Überprüfe die index.json-Datei.");
    }
}

// Funktion zum Zufällig Auswählen einer Karte
function chooseRandomCard() {
    if (currentSetCharacters.length === 0) {
        alert("Kein Set geladen. Bitte wähle ein Set aus.");
        return;
    }

    // Zufälligen Charakter auswählen
    const randomIndex = Math.floor(Math.random() * currentSetCharacters.length);
    const selectedCharacter = currentSetCharacters[randomIndex];

    // Ausgewählte Karte anzeigen
    selectedCardDisplay.innerHTML = `
        <img src="${setsPath}${setSelector.value}/${selectedCharacter}" alt="${selectedCharacter}" style="width: ${imageSize}px;">
        <div>${selectedCharacter.replace(/\.[^/.]+$/, "")}</div>
    `;
}

// Event Listener für das Dropdown
setSelector.addEventListener("change", (event) => {
    loadSet(event.target.value);
});

// Button-Event für die Zufallsauswahl
chooseRandomCardButton.addEventListener("click", chooseRandomCard);

// Event Listener für den Slider
imageSizeSlider.addEventListener("input", (event) => {
    imageSize = event.target.value;
    imageSizeLabel.textContent = `Bildgröße: ${imageSize}px`; // Label anpassen

    // Alle Bilder im Spielfeld aktualisieren
    const images = gameBoard.querySelectorAll("img");
    images.forEach(img => {
        img.style.width = `${imageSize}px`;
    });

    // Bildgröße der zufällig gewählten Karte anpassen
    const selectedImage = selectedCardDisplay.querySelector("img");
    if (selectedImage) {
        selectedImage.style.width = `${imageSize}px`;
    }
});

// Initialisierung: Sets laden
loadSets();
