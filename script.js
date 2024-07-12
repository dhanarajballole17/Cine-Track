const key = 'e4723457';

var searchInput = document.getElementById('Input');
var displaySearchList = document.getElementsByClassName('fav-container');

// Event listener for search input
searchInput.addEventListener('input', findMovies);

// Function to search for movies
async function searchMovies() {
    // Show the loader
    document.getElementById("loader").style.display = "block";

    const query = searchInput.value.trim();
    const url = `http://www.omdbapi.com/?apikey=${key}&s=${query}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Hide the loader
            document.getElementById("loader").style.display = "none";
            
            if (data.Response === "True") {
                displayMovieList(data.Search);
            } else {
                alert('No movies found');
            }
        })
        .catch(error => {
            // Hide the loader
            document.getElementById("loader").style.display = "none";
            console.error('Error fetching data:', error);
        });
}

// Function to find movies on keypress
async function findMovies() {
    const url = `https://www.omdbapi.com/?s=${(searchInput.value).trim()}&page=1&apikey=${key}`
    const res = await fetch(`${url}`);
    const data = await res.json();

    if (data.Search) {
        displayMovieList(data.Search);
    }
}

// Function to display a list of movies
async function displayMovieList(movies) {
    var output = '';
    for (let i of movies) {
        var img = i.Poster != 'N/A' ? i.Poster : 'img/blank-poster.webp';
        var id = i.imdbID;

        // Check if the movie is already in the watchlist
        var isFavorite = isInWatchlist(id);
        var bookmarkClass = isFavorite ? 'filled-bookmark' : 'unfilled-bookmark';

        output += `
        <div class="fav-item">
            <div class="fav-poster">
            <a href="movie.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
            </div>
            <div class="fav-details">
                <div class="fav-details-box">
                    <div>
                        <p class="fav-movie-name"><a href="movie.html?id=${id}">${i.Title}</a></p>
                        <p class="fav-movie-rating"><a href="movie.html?id=${id}">${i.Year}</a></p>
                    </div>
                    <div>
                        <i class="fa-solid fa-bookmark ${bookmarkClass}" style="cursor:pointer;" onClick="toggleWatchlist('${id}')"></i>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
    document.querySelector('.fav-container').innerHTML = output;
}

// Function to load a single movie's details
async function singleMovie() {
    var urlQueryParams = new URLSearchParams(window.location.search);
    var id = urlQueryParams.get('id');
    const url = `https://www.omdbapi.com/?i=${id}&apikey=${key}`
    const res = await fetch(`${url}`);
    const data = await res.json();

    // Check if the movie is already in the watchlist
    var isFavorite = isInWatchlist(id);
    var bookmarkClass = isFavorite ? 'filled-bookmark' : 'unfilled-bookmark';

    var output = `
    <div class="movie-poster">
        <img src=${data.Poster} alt="Movie Poster">
    </div>
    <div class="movie-details">
        <div class="details-header">
            <div class="dh-ls">
                <h2>${data.Title}</h2>
            </div>
            <div class="dh-rs">
                <i class="fa-solid fa-bookmark ${bookmarkClass}" onClick="toggleWatchlist('${id}')" style="cursor: pointer;"></i>
            </div>
        </div>
        <span class="italics-text"><i>${data.Year} &#x2022; ${data.Country} &#x2022; Rating - <span style="font-size: 18px; font-weight: 600;">${data.imdbRating}</span>/10 </i></span>
        <ul class="details-ul">
            <li><strong>Actors: </strong>${data.Actors}</li>
            <li><strong>Director: </strong>${data.Director}</li>
            <li><strong>Writers: </strong>${data.Writer}</li>
        </ul>
        <ul class="details-ul">
            <li><strong>Genre: </strong>${data.Genre}</li>
            <li><strong>Release Date: </strong>${data.DVD}</li>
            <li><strong>Box Office: </strong>${data.BoxOffice}</li>
            <li><strong>Movie Runtime: </strong>${data.Runtime}</li>
        </ul>
        <p style="font-size: 14px; margin-top:10px;">${data.Plot}</p>
        <p style="font-size: 15px; font-style: italic; color: #222; margin-top: 10px;">
            <i class="fa-solid fa-award"></i>
            &thinsp; ${data.Awards}
        </p>
    </div>
    `;
    document.querySelector('.movie-container').innerHTML = output;
}

// Function to toggle movie watchlist status
async function toggleWatchlist(id) {
    if (isInWatchlist(id)) {
        removeFromWatchlist(id);
    } else {
        addToWatchlist(id);
    }
    updateWatchlistIcon(id);
}

// Function to add a movie to the watchlist
async function addToWatchlist(id) {
    if (!isInWatchlist(id)) {
        localStorage.setItem(id, id);
        alert('Added to Watchlist!');
    }
}

// Function to remove a movie from the watchlist
async function removeFromWatchlist(id) {
    localStorage.removeItem(id);
    alert('Movie Removed from Watchlist');
    window.location.reload(); // Reload the page to update the UI
}

// Function to check if a movie is in the watchlist
function isInWatchlist(id) {
    return localStorage.getItem(id) !== null;
}

// Function to update the watchlist icon based on the current status
function updateWatchlistIcon(id) {
    var isFavorite = isInWatchlist(id);
    var iconElements = document.querySelectorAll(`i[onClick="toggleWatchlist('${id}')"]`);

    iconElements.forEach(icon => {
        icon.classList.remove(isFavorite ? 'unfilled-bookmark' : 'filled-bookmark');
        icon.classList.add(isFavorite ? 'filled-bookmark' : 'unfilled-bookmark');
    });
}

// JavaScript: script.js

function initializePage() {
    // Display the loader
    document.getElementById('loader').style.display = 'block';

    // Hide the loader after 3 seconds
    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
    }, 3000);
}

function searchMovies() {
    // Your existing searchMovies function code
}




// Function to load favorite movies
async function favoritesMovieLoader() {
    var output = '';
    for (let i in localStorage) {
        var id = localStorage.getItem(i);
        if (id != null) {
            const url = `https://www.omdbapi.com/?i=${id}&plot=full&apikey=${key}`
            const res = await fetch(`${url}`);
            const data = await res.json();

            var img = data.Poster ? data.Poster : data.Title;

            output += `
            <div class="fav-item">
                <div class="fav-poster">
                    <a href="movie.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
                </div>
                <div class="fav-details">
                    <div class="fav-details-box">
                        <div>
                            <p class="fav-movie-name">${data.Title}</p>
                            <p class="fav-movie-rating">${data.Year} &middot; <span style="font-size: 15px; font-weight: 600;">${data.imdbRating}</span>/10</p>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
    }
    document.querySelector('.fav-container').innerHTML = output;
}
