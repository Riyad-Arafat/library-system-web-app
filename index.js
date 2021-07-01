// // // // // // // // // // // SIGNUP PAGE // // // // // // // // // // // // // // // // // // // // // //
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

// // // // // // // // // // // // // //  LOGIN PAGE // // // // // // // // // // // // // // // // // // // // // //
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

// // // // // // // // // // // // HOME PAGE // // // // // // // // // // // // // // // // // // // // // //
let books = [];

const HomePage = `
  <div>

  <header>
  <nav id=nav-bar>
      <ul>
          <li><a href="#" onclick="onNavigate('#/home'); return false;">Home</a></li>
          <li><a href="#" onclick="onNavigate('#/profile'); return false;">Profile</a></li>
          <li class="logout-btn"><a href="#" onclick="onNavigate('#/home'); return false;">logout</a></li>

      </ul>
  </nav>

</header>

<div class="search-container">
  <div>
      <input type="text" name="search" placeholder="search" onchange="search()"/>
  </div>
<a type="button" class="btn" href="#open-modal">Add New Book</a>

</div>

<div>
  <div id="open-modal" class="modal-window">
      <div>
          <a href="#" title="Close" class="modal-close">Close</a>
          <h1 class="title">Add New Book</h1>

          <div>

              <form>
                  <div class="inputs-control">
                      <label>Title</label>
                      <input type="text" required placeholder="Book Title" name="title">
                  </div>
                  <div class="inputs-control">
                      <label>Author</label>
                      <input type="text" required placeholder="Book Author" name="author">
                  </div>
                  <div class="inputs-control">
                      <label>Category</label>
                      <input type="text" required placeholder="Book Category" name="category">
                  </div>
                  <div class="inputs-control">
                      <label>ISBN</label>
                      <input type="text" required placeholder="Book ISBN" name="isbn">
                  </div>

                  <div class="inputs-control">
                      <label>publishing year</label>
                      <input type="number" min="1900" max="2099" step="1" value="2016" name="pyear" />
                  </div>

                  <button type="button">Submit</button>

              </form>


          </div>
      </div>
  </div>
</div>
    <div id="books-container"></div>
</div>
`;

// // // // // BOOK PAGE

const bookPage = `
<div class="book-view__container">

<div class="book-view__card">
    <div class="book-view__img"></div>
    <div class="book-view__body">
        <div class="item">
            <h3>Title: <span>dfsd</span></h3>
            <h3>ISBN: <span>456</span></h3>
            <h3>Left: <span style="color: red;">111</span></h3>

        </div>
        <div class="item">
            <h3>Author: <span>etw</span></h3>
            <h3>Category: <span>etw</span></h3>

        </div>

    </div>
    <div class="book-view__actions">
        <a class="btn">Book</a>
        <a class="btn" href="#open-modal">Edit</a>


    </div>

</div>

</div>
<!-- Edit Form -->
<div id="open-modal" class="modal-window">
<div>
    <a href="#" title="Close" class="modal-close">Close</a>
    <div>
        <h1 class="title"></h1>

        <form>
            <div class="inputs-control">
                <label>Title</label>
                <input type="text" required placeholder="Book Title" name="title">
            </div>
            <div class="inputs-control">
                <label>Author</label>
                <input type="text" required placeholder="Book Author" name="author">
            </div>
            <div class="inputs-control">
                <label>Category</label>
                <input type="text" required placeholder="Book Category" name="category">
            </div>
            <div class="inputs-control">
                <label>ISBN</label>
                <input type="text" required placeholder="Book ISBN" name="isbn">
            </div>

            <div class="inputs-control">
                <label>publishing year</label>
                <input type="number" min="1900" max="2099" step="1" value="2016" name="pyear" />
            </div>

            <button type="button">Submit</button>

        </form>


    </div>
</div>
</div>

`;

// // ALL APPP ROUTES
const routes = {
  "#/home": HomePage,
  "#/login": loginPage,
  "#/signup": singupPage,
  "#/profile": "profile_Path",
  "#/book": bookPage,
};

const API_URL = "http://127.0.0.1:8000";

let bookId = 0;

// // // // //  URGENT FUNCTIONS // // // // // // // // // // // // // // // // // // // // // //
function Routing() {
  const hash = window.location.hash;
  const token = localStorage.getItem("token") ? true : false;
  const isGuestHash = hash === "#/login" || hash === "#/signup";

  if (isGuestHash && !token) onNavigate(hash);
  if (!isGuestHash && !token) onNavigate("#/login");
  if (isGuestHash && token) onNavigate("#/home");
  if (!isGuestHash && token && routes[hash]) onNavigate(hash);
}

// // //  RENDER THE PAGE BY ITS URL
window.onload = () => {
  const hash = window.location.hash;
  if (!hash || !routes[hash]) {
    onNavigate("#/home");
  } else {
    Routing();
  }
};
// // // ROUTING FUNCTION
const onNavigate = async (pathname) => {
  if (pathname !== "#/book") {
    bookId = 0;
  }
  if (pathname == "#/home") {
    getAlBooks();
  }
  window.history.pushState({}, pathname, window.location.origin + pathname);
  document.getElementById("root").innerHTML = routes[pathname];
};

window.onhashchange = () => Routing();

const onOpenBook = (id) => {
  if (!isNaN(id)) {
    console.log(id);
    onNavigate("#/book");
  }
};

// // // // // // ////

const getAlBooks = async () => {
  let data = [];
  await fetch(`${API_URL}/books/`)
    .then((response) => response.json())
    .then((respons) => (data = respons.data))
    .catch((e) => console.log(e));
  document.getElementById("books-container").innerHTML = data.map(
    (book) =>
      `<div class="card">
      <div class="card-img"></div>
      <div class="card-body">
          <div class="item">
              <h3>Title: <span>${book.title}</span></h3>
              <h3>Author: <span>${book.author}</span></h3>
              <h3>Category: <span>${book.category}</span></h3>

          </div>
          <div class="item">
              <h3>publishing year: <span>${book.pYear}</span></h3>
              <h3>Left: <span style="color: red;">${book.amount}</span></h3>

              
          </div>
          <div class="item">
            <h3>ISBN: <span>${book.isbn}</span></h3>
          </div>

      </div>
      <div class="card-footer">
          <button onclick="onOpenBook(${book.id})" >Open</button>
      </div>
  </div>`
  );
};

const search = async () => {
  let query = document.querySelector("input[name='search']").value;
  let data = [];
  if (query !== "")
    await fetch(`${API_URL}/books/search/q=${query}/`)
      .then((response) => response.json())
      .then((respons) => (data = respons.data))
      .catch((e) => console.log(e));
  else
    await fetch(`${API_URL}/books/`)
      .then((response) => response.json())
      .then((respons) => (data = respons.data))
      .catch((e) => console.log(e));

  document.getElementById("books-container").innerHTML = data.map(
    (book) =>
      `<div class="card">
        <div class="card-img"></div>
        <div class="card-body">
            <div class="item">
                <h3>Title: <span>${book.title}</span></h3>
                <h3>Author: <span>${book.author}</span></h3>
                <h3>Category: <span>${book.category}</span></h3>
  
            </div>
            <div class="item">
                <h3>publishing year: <span>${book.pYear}</span></h3>
                <h3>Left: <span style="color: red;">${book.amount}</span></h3>
  
                
            </div>
            <div class="item">
              <h3>ISBN: <span>${book.isbn}</span></h3>
            </div>
  
        </div>
        <div class="card-footer">
            <button onclick="onOpenBook(${book.id})" >Open</button>
        </div>
    </div>`
  );
};
