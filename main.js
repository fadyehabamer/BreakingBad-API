// breakingbadapi.com has shut down (its domain no longer resolves), so the
// cast list is loaded from the TVmaze API instead: https://www.tvmaze.com/api
// Breaking Bad is show 169 on TVmaze.
const CAST_URL = "https://api.tvmaze.com/shows/169/cast";

const inpsearch = document.getElementById("inp-search"),
      output    = document.getElementById("output"),
      musicToggle = document.getElementById("music-toggle"),
      audio = new Audio("theme.m4a")

let cast = [];

function updateMusicToggle(){
    const playing = !audio.paused;
    musicToggle.textContent = playing ? "Pause theme music" : "Play theme music";
    musicToggle.setAttribute("aria-pressed", String(playing));
}

function playMusic(){
    // Browsers block autoplay with sound until the user interacts with the
    // page, in which case play() rejects; the toggle button stays available.
    return audio.play().catch(() => {}).finally(updateMusicToggle);
}

musicToggle.addEventListener("click", ()=>{
    if(audio.paused){
        playMusic();
    }else{
        audio.pause();
        updateMusicToggle();
    }
})

window.addEventListener("load" , ()=>{
    playMusic();
    loader();
    fetchcharcters();
} )

function loader (){
    output.innerHTML=
    `
    <div class="gif-spinner col-auto mx-auto">
        <img src="img/loader.webp" alt="">
        <span class="text-white"> Loading...  </span>
    </div>
    `
}

// Filtering is local, so update results on every keystroke.
inpsearch.addEventListener("input",()=>{
    // Keep the loading/error message until the cast has actually loaded.
    if(!cast.length) return;
    render(filterCast(inpsearch.value));
})

async function fetchcharcters(){
    try{
        const res = await fetch(CAST_URL);
        if(!res.ok) throw new Error(`HTTP ${res.status}`);
        cast = await res.json();
        render(filterCast(inpsearch.value));
    }catch(err){
        console.error(err);
        showMessage("Couldn't load characters. Please try again later.");
    }
}

function showMessage(text){
    output.innerHTML = "";
    const p = document.createElement("p");
    p.className = "col text-white text-center";
    p.textContent = text;
    output.appendChild(p);
}

// Match the search text against both the character and the actor name.
function filterCast(query){
    const q = query.trim().toLowerCase();
    if(!q) return cast;
    return cast.filter(({ person, character }) =>
        character.name.toLowerCase().includes(q) ||
        person.name.toLowerCase().includes(q)
    );
}

function createField(tag, label, value){
    const el = document.createElement(tag);
    const span = document.createElement("span");
    span.textContent = ` ${value || "Unknown"} `;
    el.append(`${label} : `, span);
    return el;
}

// Build cards with DOM APIs / textContent rather than innerHTML so that
// data from the API is never interpreted as markup.
function render(results){
    if(!results.length){
        showMessage("No characters found.");
        return;
    }

    output.innerHTML=""

    results.forEach(({ person, character }) =>{
        const card = document.createElement("div")
        card.classList.add("col-md-3" , "mb-3" , "img-info")
        // Focusable so keyboard and touch users can reveal the details too.
        card.tabIndex = 0

        const image = character.image || person.image;
        const img = document.createElement("img");
        img.className = "img";
        img.src = image ? image.medium : "img/bb-logo.png";
        img.alt = character.name;

        const info = document.createElement("div");
        info.className = "info-display";
        info.append(
            createField("h5", "Name", character.name),
            document.createElement("hr"),
            createField("h6", "Actor", person.name),
            createField("h6", "Actor's birthday", person.birthday)
        );

        card.append(img, info);
        output.appendChild(card)
    })
}
