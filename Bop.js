var data = null;

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === this.DONE) {
    console.log(this.responseText);
  }
});

xhr.open("GET", "https://api-v3.igdb.com/games/?fields=name%2Cgenres.name%2Ccover%2Cpopularity&order=popularity%3Adesc&expand=genres");
xhr.setRequestHeader("cookie", "__cfduid=dd897b918c7f8b6b376ddbca7e3a01ae91583690603");
xhr.setRequestHeader("accept", "application/javascript");
xhr.setRequestHeader("user-key", "8f162befe6fd85ea2381f5edb9144b55");

xhr.send(data);