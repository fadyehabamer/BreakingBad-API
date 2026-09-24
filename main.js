// breakingbadapi.com has shut down (its domain no longer resolves), so the
// cast list is loaded from the TVmaze API instead: https://www.tvmaze.com/api
// Breaking Bad is show 169 on TVmaze.
const CAST_URL = "https://api.tvmaze.com/shows/169/cast";

const inpsearch = document.getElementById("inp-search"),
      output    = document.getElementById("output"),
      audio = new Audio("theme.m4a")

let cast = [];

window.addEventListener("load" , ()=>{
    audio.play();
    loader();
    fetchcharcters();
} )

function loader (){
    output.innerHTML=
    `
    <div class= "gif-spinner mx-auto" >
        <img src="img/loader.webp">
        <span class="text-white"> Loading...  </span>
    </div>
    `
}

inpsearch.addEventListener("change",()=>{
    render(filterCast(inpsearch.value));
})

async function fetchcharcters(){
    const res = await fetch(CAST_URL);
    cast = await res.json();
    render(filterCast(inpsearch.value));
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
    output.innerHTML=""

    results.forEach(({ person, character }) =>{
        const card = document.createElement("div")
        card.classList.add("col-md-3" , "mb-3" , "img-info")

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
