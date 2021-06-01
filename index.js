// // ALL APPP ROUTES
const routes = {
  "#/home": "./pages/Home/index.html",
  "#/login": "login_Path",
  "#/signup": "./pages/Signup/index.html",
  "#/profile": "profile_Path",
  "#/book": "profile_Path",
};

// // RENDERING PAGE FUNCTION
const renderPage = (path) => {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("root").innerHTML = this.responseText;
    }
    if (this.readyState == 4 && this.status == 404) {
      document.getElementById("root").innerHTML = "404";
    }
  };
  console.log(routes[path]);
  xhttp.open("GET", routes[path], true);
  xhttp.send();
};

// //  RENDER THE PAGE BY ITS URL
window.onload = () => {
  const hash = window.location.hash;
  if (!hash || !routes[hash]) {
    window.history.pushState({}, "#/home", window.location.origin + "#/home");
    renderPage("#/home");
  } else renderPage(window.location.hash);
};
// // ROUTING FUNCTION
const onNavigate = async (pathname) => {
  window.history.pushState({}, pathname, window.location.origin + pathname);
  renderPage(pathname);
};
