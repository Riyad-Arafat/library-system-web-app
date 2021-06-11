// // // // SIGNUP PAGE

const singupPage = `<div id="signup-page" style="background-image: url('./static/signup.jpeg');">
<h1 class="title">sign up</h1>
<section>
    <form>
        <br>
        <div class="inputs-control">
            <label>First Name</label>
            <input type="text" required placeholder="first name" name="firstName">
        </div>
        <div class="inputs-control">
            <label> Last Name</label>
            <input type="text" required placeholder="last name" name="lastName">
        </div>
        <div class="inputs-control">
            <label>E-mail</label>
            <input type="email" required placeholder="your e-mail" name="email">
        </div>
        <div class="inputs-control">
            <label>Password</label>
            <input type="password" required placeholder="please, write a strong password" name="password"
                minlength="8" maxlength="15">
        </div>

        <button id="signup-btn" type="button" onclick="signUp()" style="background-color: bisque;">Sign
            up</button>

    </form>
</section>
</div>`;

const signUp = () => {
  let firstName = document.querySelector("input[name='firstName']").value;
  let lastName = document.querySelector("input[name='lastName']").value;
  let email = document.querySelector("input[name='email']").value;
  let password = document.querySelector("input[name='password']").value;

  const data = { firstName, lastName, email, password };
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let respons = JSON.parse(this.response);
      if (respons.satusCode === 200) onNavigate("#/login");
    }
  };
  xhttp.open("POST", `${API_URL}/auth/signup/`, true);
  xhttp.setRequestHeader("accept", "application/json");

  xhttp.send(JSON.stringify(data));
};

// // // LOGIN PAGE
const loginPage = `<div id="login-page" style="background-image: url('./static/login.jpg')">
<h1 class="title"> Login </h1>
<section>
    <form>
        <br>
        <div class="inputs-control">
            <label>E-mail</label>
            <input class="email_class" type="email" required placeholder="your e-mail" name="email">
        </div>
        <br>
        <div class="inputs-control">
            <label>Password</label>
            <input class="password_class" type="password" required placeholder="your password"
                name="password" minlength="8" maxlength="15">
        </div>
        <br>

        <button  onclick="login()" type="button" style="background-color: blanchedalmond;">Submit</button>

    </form>
</section>

</div>`;

const login = () => {
  let email = document.querySelector("input[name='email']").value;
  let password = document.querySelector("input[name='password']").value;

  const data = { email, password };
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let respons = JSON.parse(this.response);
      if (respons.satusCode === 200) {
        localStorage.setItem("token", respons.data.token);
        localStorage.setItem("role", respons.data.role);
        onNavigate("#/home");
      }
    }
  };
  xhttp.open("POST", `${API_URL}/auth/login/`, true);
  xhttp.setRequestHeader("accept", "application/json");

  xhttp.send(JSON.stringify(data));
};

// // ALL APPP ROUTES
const routes = {
  "#/home": "./pages/Home/index.html",
  "#/login": loginPage,
  "#/signup": singupPage,
  "#/profile": "profile_Path",
  "#/book": "book_Path",
};

const API_URL = "http://127.0.0.1:8000";

//////
function Routing() {
  const hash = window.location.hash;
  const token = localStorage.getItem("token") ? true : false;
  const isGuestHash = hash === "#/login" || hash === "#/signup";

  if (isGuestHash && !token) onNavigate(hash);
  if (!isGuestHash && !token) onNavigate("#/login");
  if (isGuestHash && token) onNavigate("#/home");
  if (!isGuestHash && token && routes[hash]) onNavigate(hash);
}

// //  RENDER THE PAGE BY ITS URL
window.onload = () => {
  const hash = window.location.hash;
  if (!hash || !routes[hash]) {
    window.history.pushState({}, "#/home", window.location.origin + "#/home");
    document.getElementById("root").innerHTML = routes["#/home"];
  } else {
    Routing();
  }
};
// // ROUTING FUNCTION
const onNavigate = async (pathname) => {
  window.history.pushState({}, pathname, window.location.origin + pathname);
  document.getElementById("root").innerHTML = routes[pathname];
};

window.onhashchange = () => Routing();
