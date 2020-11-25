// user is the object that is returned from teh GitHub API
// This object has many methods, such as user name, login name, and links to their profile

function userInformationHTML(user) {
    return `
        <h2>${user.name}
            <span class="small-name">
                (@<a href="${user.html_url}" target="_blank">${user.login}</a>)
            </span>
        </h2>
        <div class="gh-content">
            <div class="gh-avatar">
                <a href="${user.html_url}" target="_blank">
                    <img src="${user.avatar_url}" width="80" height="80" alt="${user.login}" />
                </a>
            </div>
            <p>Followers: ${user.followers} - Following ${user.following} <br> Repos: ${user.public_repos}</p>
        </div>`;
}

function repoInformationHTML(repos) {
    if (repos.length == 0) {
        return `<div class="clearfix repo-list>No repos!</div>`;
    }
// Map()method works like a forEach, but returns an array with the results of the function
    var listItemsHTML = repos.map(function(repo){
        return `<li>
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                </li>`;
    });
// Map returns an array, so we use join() on that array to join everything with a new line ("\n")
    return `<div class="clearfix repo-list">
                <p>
                    <strong>Repo List:</strong>
                </p>
                <ul>
                    ${listItemsHTML.join("\n")}
                </ul>
            </div>`;
}

function fetchGitHubInformation(event) {
// These two lines make sure that searching for new github users or an empty user box emptys the list
    $("#gh-user-data").html("");
    $("#gh-repo-data").html("");

    var username = $("#gh-username").val();
    if (!username) {
        $("#gh-user-data").html(`<h2>Please enter GitHub username</h2>`);
        return;
    }

    $("#gh-user-data").html(
        `<div id="loader">
            <img src="assets/css/loader.gif" alt="loading..." />
        </div>`);
// This bit is saying that when the specified username is called, then user information will be displayed
// It is also saying that the repos of the user will be called.
    $.when(
        $.getJSON(`https://api.github.com/users/${username}`),
        $.getJSON(`https://api.github.com/users/${username}/repos`)
    ).then(
// When doing two calls like this, the when() method packs a response up into arrays, and each one is the element of the array
//So we need to put indexes in there for these responses [0]
        function(firstResponse, secondResponse) {
            var userData = firstResponse[0];
            var repoData = secondResponse[0];
            $("#gh-user-data").html(userInformationHTML(userData));
            $("#gh-repo-data").html(repoInformationHTML(repoData));
// This bit is saying that if the username cannot be found, (ie 404 message) it will return a message saying its not found
        }, function(errorResponse) {
            if (errorResponse.status === 404) {
                $("#gh-user-data").html(`<h2>No info found for user ${username}</h2>`);
// This bit is looking for 403 error if access is denied from too many searches.
            } else if(errorResponse.status === 403) {
//X-RateLimit-Reset is a header provided by GitHub to show when we can use it again. It's a UNIX timestamp so it needs to be * 1000 and turned into a date object to be understood
                var resetTime = new Date(errorResponse.getResponseHeader('X-RateLimit-Reset')*1000);
// toLocaleDateString gets the location from the browser to print local time
                $("#gh-user-data").html(`<h4>Too many requests, please wait until ${resetTime.toLocaleTimeString()}</h4>`);
            } else {
// This bit is saying if its a different error, it will log the error in console log then post it as an error message
                console.log(errorResponse);
                $("#gh-user-data").html(
                    `<h2>Error: ${errorResponse.responseJSON.message}</h2>`);
            }
        });
}

// This fetches the Robert-Clark-1990 GitHub and repo info when the page is loaded
$(document).ready(fetchGitHubInformation);