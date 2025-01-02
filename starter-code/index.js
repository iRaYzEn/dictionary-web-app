const themeButton = document.querySelector(".theme__button")
const fontSelect = document.querySelector(".font__select")
const form = document.querySelector(".input__form")
const submitButton = document.querySelector(".input__submit");
const input = document.querySelector(".input__word");
const sectionWord = document.querySelector(".section__word")
const listMeaning = document.querySelector(".list__meaning")

themeButton.addEventListener("click", () => {
    if (!themeButton.classList.contains("theme__button--right")) {
        themeButton.classList.add("theme__button--right")
        themeButton.style.backgroundColor = "var(--purple)"
        document.body.style.backgroundColor = "var(--black-800)"
        document.body.classList.add("dark-mode")
    } else {
        themeButton.classList.remove("theme__button--right")
        themeButton.style.backgroundColor = "var(--gray-500)"
        document.body.style.backgroundColor = "var(--white)"
    }
})

fontSelect.addEventListener("change", () => {
    if (fontSelect.value == "Sans Serif") {
        document.body.style.fontFamily = "inter"
    } else if (fontSelect.value == "Serif") {
        document.body.style.fontFamily = "lora"
    } else if (fontSelect.value == "Mono") {
        document.body.style.fontFamily = "inconsolata"
    }
})

input.addEventListener("focus", () => {
    let lowerSectionWord = document.querySelector(".lower__section-word")
    let section = document.querySelectorAll(".section__part-of-speech")
    let resources = document.querySelector(".resources")
    if (lowerSectionWord && section) {
        section.forEach(sec => {
            sec.remove()
        })
        lowerSectionWord.remove()
        resources.remove()
    }
})

form.addEventListener("submit", (e) => {
    e.preventDefault()
    let query = input.value
    let myData;
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`).then(res => res.json()).then(data => myData = data)
    setTimeout(() => {
        let value = myData[0]
        let lowerSectionWord = ` 
                <div class="lower__section-word">
                    <div>
                        <h1 class="main__word">${value.word}</h1>
                        <h3 class="main__word-phonetic">${value.phonetic}</h3>
                    </div>
                    <div class="button__play-wrapper">
                        <button class="button__play">
                            <img class="icon__play" src="assets/images/icon-play.svg" alt="icon play">
                        </button>
                    </div>
                </div>
`


        value.meanings.forEach(meaning => {
            let partOfSpeech = `
            <section class="section section__part-of-speech">
                <div class="part-of-speech__wrapper">
                    <h4 class="part-of-speech">${meaning.partOfSpeech}</h4>
                    <div class="part-of-speech__line ${meaning.partOfSpeech == "adjective" ? "shorter" : ""}"></div>
                </div>
                <div class="meaning">
                    <p class="meaning__word">Meaning</p>
                    <ul class="list__meaning">
                    ${meaning.definitions.map(def => `<li class="meaning__definition">${def.definition}</li>`).join("")}
                    </ul>
                    <div class="meaning__footer">
                        ${meaning.synonyms.length ? `<p class="meaning__word">Synonyms</p>` : ""}
                        ${meaning.synonyms.map(syn => `<p class="meaning__purple">${syn}</p>`).join("")}
                    </div>
                </div>
            </section>
            `
            sectionWord.insertAdjacentHTML("afterend", partOfSpeech)
        })

        let source = `
        <section class="resources">
            <div class="wrapper resouces__wrapper">

            <p class="source__word">Source</p>
            ${value.sourceUrls.map(url => `<a target=_blank class="source__url" href="${url}">${url}</a>`)}
            </div>
        </section>
`
        const audio = new Audio()
        value.phonetics.map(pho => pho.audio ? audio.src = pho.audio : "")
        document.body.insertAdjacentHTML("afterend", source)
        sectionWord.insertAdjacentHTML("afterend", lowerSectionWord)
        const playBtn = document.querySelector(".button__play");
        playBtn.addEventListener("click", () => {
            audio.play()
        })
    }, 700)

    input.blur()
})


