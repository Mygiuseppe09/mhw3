/*********************************** GLOBAL VARIABLES ********************************/

const infoRecipeButton = document.querySelector('img#inform_the_user');
const infoBookButton = document.querySelector('img#open_modal_book');
const infoSpotifyButton = document.querySelector('img#open_modal_spotify');
const images = document.querySelectorAll('.image_container');

//spotify
let token;
const clientId = 'f4d332a0401f41f8b07c31c9f36b10da';
const clientSecret = 'a14aab5922ec4d6cb77b0d4c20089522';
const spotifyPlaylistEndopoint = 'https://api.spotify.com/v1/playlists/';
const spotifySearchEndpoint = 'https://api.spotify.com/v1/search?type=track&include_external=audio&q='
const spotifyEndopointToken = 'https://accounts.spotify.com/api/token';
const popGemStudentPlaylistID = '37i9dQZF1DWSoyxGghlqv5';

//Google Books
const googleBookEndopoint = 'https://www.googleapis.com/books/v1/volumes?' +
    'filter=free-ebooks&download=epub&key=AIzaSyDIjGeLo6rDa2ZVtqQCfSCWQckMjy5056M' +
    '&q=';

// Edamam
const edamamEndpoint = 'https://api.edamam.com/api/recipes/v2?' +
    'type=public&app_id=30565b65&app_key=73034aee19d65af9495328a8e3a0fd47' +
    '&imageSize=REGULAR&q=';


/**************************************** FUNCTIONS *****************************************/

function insertSongsIntoWebSite(songs,musicLibrary) {
    //cicliamo l'array
    for (let song of songs) { // si ha: SONG = "TRACK" nel file json
        // prendiamo quello che vogliamo "importare nel nostro sito"
        const songName = song.name;
        const imageSource = song.album.images[1].url; // 300x300
        const preview = song.preview_url;

        // creiamo gli elementi HTML adatti a sfruttare le variabili soprastanti
        const songContainer = document.createElement('div');
        songContainer.classList.add('content_item');

        const songNameContainer = document.createElement('p');
        songNameContainer.classList.add('big_text_style');
        songNameContainer.classList.add('sub_content_item');
        const songImageContainer = document.createElement('img');
        songImageContainer.classList.add('sub_content_item');
        const previewContainer = document.createElement('div');
        previewContainer.classList.add('sub_content_item');
        previewContainer.classList.add('image_container');
        const linkToPreview = document.createElement('a');
        linkToPreview.setAttribute('href', preview);
        linkToPreview.setAttribute('target','_blank');

        // inizializzazione
        songNameContainer.innerText = songName;
        songImageContainer.src = imageSource;
        linkToPreview.innerText = 'PL';

        // formattazione
        previewContainer.appendChild(linkToPreview);
        songContainer.appendChild(songNameContainer);
        songContainer.appendChild(songImageContainer);
        songContainer.appendChild(previewContainer);

        musicLibrary.appendChild(songContainer);
    }
}

function takeOnlyWithMP3(songArray) {
    //songArray = array di "track" nel json
    let filteredArray = [];
    for (let song of songArray) {
        if (song.preview_url != null) {
            filteredArray.push(song);
        }
    }
    return filteredArray;
}

function takeOnlyWithShortTitle(booksArray) {
    let filteredArray = [];

    for (let book of booksArray) {
        if (book.volumeInfo.title.length <= 100)
            filteredArray.push(book);
    }

    return filteredArray;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

/********************************** PROMISE'S HANDLERS ******************************/

function onEdamamJson(json) {
    if (!json)
        console.log(' Documento vuoto... :(  ');
    else {
        console.log(json);
        // Spostiamoci nel nodo HTML che ci interessa "ripempire"
        const modalView = document.querySelector('#recipe_modal_view');
        //inizializziamo la modale ogni qual volta la apriamo
        modalView.innerHTML = '';

        // Costruiamo l'array principale: in questo caso, vogliamo un array di ricette
        let recipes = [];
        shuffleArray(json.hits); // così ogni volta mostro sei ricette diverse

        //riempiamo l'array
        for (let i = 0; i < 6; i++)
            recipes.push(json.hits[i].recipe); //riempiamolo

        for (let recipe of recipes) {
            // prendiamo quello che vogliamo "importare nel nostro sito"
            const recipeTitle = recipe.label;
            const imageSource = recipe.image;
            const ingredients = recipe.ingredientLines; // è una lista

            // creiamo gli elementi HTML adatti a sfruttare le variabili soprastanti
            const recipeContainer = document.createElement('div');
            recipeContainer.classList.add('content_item');
            const titleContainer = document.createElement('p');
            titleContainer.classList.add('big_text_style');
            titleContainer.classList.add('sub_content_item');
            const imageContainer = document.createElement('img');
            imageContainer.classList.add('sub_content_item');
            const ingredientsContainer = document.createElement('p');
            const ingredientBulletPointContainer = document.createElement('ul');
            ingredientsContainer.classList.add('content_text_style');
            ingredientsContainer.classList.add('sub_content_item');
            ingredientBulletPointContainer.classList.add('content_text_style');

            // inizializzazione
            titleContainer.innerText = recipeTitle;
            imageContainer.src = imageSource;
            for (let ingredient of ingredients) {
                const bulletPoint = document.createElement('li');
                bulletPoint.innerText = ingredient;
                ingredientBulletPointContainer.appendChild(bulletPoint);
            }

            // formattazione
            ingredientsContainer.appendChild(ingredientBulletPointContainer);
            recipeContainer.appendChild(titleContainer);
            recipeContainer.appendChild(imageContainer);
            recipeContainer.appendChild(ingredientsContainer);
            modalView.appendChild(recipeContainer);
        }
    }
}

function onSpotifyPlaylistJson(json) {
    if (!json)
        console.log(' Documento vuoto... :(  ');
    else {
        console.log(json);
        // Spostiamoci nel nodo HTML che ci interessa "ripempire"
        const musicLibrary = document.querySelector('#music_library');
        //inizializziamo la librearia ogni qual volta la apriamo
        musicLibrary.innerHTML = '';

        // Costruiamo l'array principale: in questo caso, vogliamo un array di canzoni
        let songs = [];
        // mettiamo in un'array temporaneo le sole tracce (che è quello che ci interessa)
        let temp = [];
        for (let i = 0; i < json.tracks.items.length; i++)
            temp.push(json.tracks.items[i].track);

        let filteredArray = takeOnlyWithMP3(temp); //prendo solo quelle con la preview
        shuffleArray(filteredArray); // così ogni volta mostro sei canzoni diverse della Playlist

        //riempiamo l'array
        for (let i = 0; i < 6; i++)
            songs.push(filteredArray[i]);

        insertSongsIntoWebSite(songs,musicLibrary);
    }
}

function onSpotifySearchJson(json) {
    if (!json)
        console.log(' Documento vuoto... :(  ');
    else {
        console.log(json);
        // Spostiamoci nel nodo HTML che ci interessa "ripempire"
        const library = document.querySelector('#searched_music_library');
        //inizializziamolo ogni qual volta lo apriamo
        library.innerHTML = '';

        // Costruiamo l'array principale: in questo caso, vogliamo un array di canzoni
        let songs = [];
        let filteredArray = takeOnlyWithMP3(json.tracks.items); //prendo solo quelle con la preview
        shuffleArray(filteredArray); // così ogni volta mostro 20 canzoni diverse della Playlist

        //riempiamo l'array
        for (let i = 0; i < 20; i++)
            songs.push(filteredArray[i]);

        insertSongsIntoWebSite(songs,library);
    }
}

function onGoogleBookJson(json) {
    if (!json)
        console.log(' Documento vuoto... :(  ');
    else {
        console.log(json);

        // Spostiamoci nel nodo HTML che ci interessa "ripempire"
        const library = document.querySelector('#book_library');
        //inizializziamolo ogni qual volta lo apriamo
        library.innerHTML = '';

        // Costruiamo l'array principale: in questo caso, vogliamo un array di libri
        let temp = json.items;
        let books = takeOnlyWithShortTitle(temp);
        //cicliamo l'array
        for (let book of books) {
            // prendiamo quello che vogliamo "importare nel nostro sito"
            const title = book.volumeInfo.title;
            const imageSource = book.volumeInfo.imageLinks.thumbnail;
            const downloadLink = book.accessInfo.epub.downloadLink;

            // creiamo gli elementi HTML adatti a sfruttare le variabili soprastanti
            const bookContainer = document.createElement('div');
            bookContainer.classList.add('content_item');

            const titleContainer = document.createElement('p');
            titleContainer.classList.add('content_text_style');
            titleContainer.classList.add('sub_content_item');
            const ImageContainer = document.createElement('img');
            ImageContainer.classList.add('sub_content_item');
            const downloadContainer = document.createElement('div');
            downloadContainer.classList.add('sub_content_item');
            downloadContainer.classList.add('image_container');
            const linkToDownload = document.createElement('a');
            linkToDownload.setAttribute('href', downloadLink);
            linkToDownload.setAttribute('target','_blank');

            // inizializzazione
            titleContainer.innerText = title;
            ImageContainer.src = imageSource;
            linkToDownload.innerText = 'DOWNLOAD';

            // formattazione
            downloadContainer.appendChild(linkToDownload);
            bookContainer.appendChild(titleContainer);
            bookContainer.appendChild(ImageContainer);
            bookContainer.appendChild(downloadContainer);

            library.appendChild(bookContainer);
        }
    }
}

function getToken(json) {
    console.log(json);
    token = json.access_token;
    console.log('token: ' + token);
}

function onTokenResponse(response) {
    console.log(response);
    return response.json();
}

function onResponse(response) {
    console.log(response);
    return response.json();
}

/************************************* EVENT'S HANDLERS ******************************/

function openPopup (event)  {
    const popup = document.querySelector('#API_Information');
    popup.classList.remove('hidden');
    event.currentTarget.removeEventListener('click', openPopup);
    event.currentTarget.addEventListener('click', closePopup);
}

function closePopup (event) {
    const popup = document.querySelector('#API_Information');
    popup.classList.add('hidden');

    event.currentTarget.removeEventListener('click', closePopup);
    event.currentTarget.addEventListener('click', openPopup);
}

function openRecipeModalView (event) {
    const modalView = document.querySelector('#recipe_modal_view');
    modalView.classList.remove('hidden');
    document.body.classList.add('no_scroll');

    const closeButton = document.querySelector('#close_button');
    closeButton.classList.remove('hidden');
    closeButton.addEventListener('click', closeRecipeModalView);

    const fetchPromise = fetch(edamamEndpoint + event.currentTarget.dataset.id);
    const jsonPromise = fetchPromise.then(onResponse);
    jsonPromise.then(onEdamamJson);
}

function closeRecipeModalView () {
    const modalView = document.querySelector('#recipe_modal_view');
    modalView.classList.add('hidden');
    document.querySelector('#close_button').classList.add('hidden');
    document.body.classList.remove('no_scroll');
}

function openBookModalView() {
    const bookModalView = document.querySelector('#book_modal_view');
    bookModalView.classList.remove('hidden');
    document.body.classList.add('no_scroll');

    const closeButton = document.querySelector('#close_button');
    closeButton.classList.remove('hidden');
    closeButton.addEventListener('click', closeBookModalView);

    // Aggiungo event listener al form per la ricerca
    const form = document.querySelector('#google_search_bar');
    form.addEventListener('submit', searchBooks);
}

function closeBookModalView () {
    const bookModalView = document.querySelector('#book_modal_view');
    bookModalView.classList.add('hidden');
    document.querySelector('#close_button').classList.add('hidden');
    document.body.classList.remove('no_scroll');
}

function openSpotifyModalView() {
    const spotifyModalView = document.querySelector('#spotify_modal_view');
    spotifyModalView.classList.remove('hidden');
    document.body.classList.add('no_scroll');

    const closeButton = document.querySelector('#close_button');
    closeButton.classList.remove('hidden');
    closeButton.addEventListener('click', closeSpotifyModalView);

    // richiedo l'accesso alla playlist "Pop Gem Student"
    fetch(spotifyPlaylistEndopoint + popGemStudentPlaylistID,
        {
            headers:
                {
                    'Authorization': 'Bearer ' + token
                }
        }).then(onResponse).then(onSpotifyPlaylistJson);

    // Aggiungo event listener al form per la ricerca
    const form = document.querySelector('#spotify_search_bar');
    form.addEventListener('submit', searchSongs);
}

function closeSpotifyModalView () {
    const spotifyModalView = document.querySelector('#spotify_modal_view');
    spotifyModalView.classList.add('hidden');
    document.querySelector('#close_button').classList.add('hidden');
    document.body.classList.remove('no_scroll');
}

function searchSongs (event) {
    event.preventDefault();

    // leggiamo l'ingresso
    const input = document.querySelector('#spotify_input').value;
    if (input) {
        const encodedInput = encodeURIComponent(input);

        const textResult = document.querySelector('#songs_results_text');
        textResult.innerText = 'Risultati trovati per: ' + '"' + input + '"';

        fetch(spotifySearchEndpoint + encodedInput,
        {
            headers:
                {
                    'Authorization': 'Bearer ' + token
                }
        }).then(onResponse).then(onSpotifySearchJson);

        const breakBetweenLibraries = document.querySelector('#separe_libraries')
        breakBetweenLibraries.classList.remove('hidden');
    }
}

function searchBooks (event) {
    event.preventDefault();

    // leggiamo l'ingresso
    const input = document.querySelector('#google_input').value;
    if (input) {
        const encodedInput = encodeURIComponent(input);

        const textResult = document.querySelector('#books_results_text');
        textResult.innerText = 'Risultati trovati per: ' + '"' + input + '"';

        fetch(googleBookEndopoint + encodedInput).then(onResponse).then(onGoogleBookJson);
    }
}

/********************************************************************************************/
infoRecipeButton.addEventListener('click', openPopup);
infoBookButton.addEventListener('click', openBookModalView);
infoSpotifyButton.addEventListener('click', openSpotifyModalView);

for (let image of images) {
    image.addEventListener('click', openRecipeModalView);
}

// richiedo il token direttamente all'avvio della pagina
fetch(spotifyEndopointToken,
    {
        method: "post",
        body: 'grant_type=client_credentials',
        headers:
            {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
            }
    }
).then(onTokenResponse).then(getToken);