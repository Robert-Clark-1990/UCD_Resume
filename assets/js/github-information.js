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



function fetchGitHubInformation(event) {

    var username = $("#gh-username").val();
    if (!username) {
        $("#gh-user-data").html(`<h2>Please enter GitHub username</h2>`);
        return;
    }

    $("gh-user-data").html(
        `<div id="loader">
            <img src="assets/css/loader.gif" alt="loading..." />
        </div>`);
// This bit is saying that when the specified username is called, then user information will be displayed
    $.when(
        $.getJSON(`https://api.github.com/users/${username}`)
    ).then(
        function(response) {
            var userData = response;
            $("#gh-user-data").html(userInformationHTML(userData));
// This bit is saying that if the username cannot be found, (ie 404 message) it will return a message saying its not found
        }, function(errorResponse) {
            if (errorResponse.status === 404) {
                $("#gh-user-data").html(`<h2>No info found for user ${username}</h2>`);
            } else {
// This bit is saying if its a different error, it will log the error in console log then post it as an error message
                console.log(errorResponse);
                $("#gh-user-data").html(
                    `<h2>Error: ${errorResponse.responseJSON.message}</h2>`);
            }
        });
}
