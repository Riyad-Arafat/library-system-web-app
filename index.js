// Global Varible
const API_URL = "https://riyadelberkawy.pythonanywhere.com";
let bookId = 0;

// // // // // // NAV-BAR
const navBar = `
<nav id=nav-bar>
    <ul>
        <li><a href="#" onclick="onNavigate('#/home'); return false;">Home</a></li>
        <li><a href="#" onclick="onNavigate('#/profile'); return false;">Profile</a></li>
        <li class="logout-btn"><a href="#" onclick="logOut(); return false;">logout</a></li>

    </ul>
</nav>
`;

const loader = `<div class="loader"></div>`;

// // // // // // // // // // // SIGNUP PAGE // // // // // // // // // // // // // // // // // // // // // //
const singupPage = `<div id="signup-page" style="background-image: url('./static/signup.jpeg');">
<h1 class="title">sign up</h1>
<section>
    <form onsubmit = "event.preventDefault(); signUp();">
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

        <button id="signup-btn" onclick="signUp()" style="background-color: bisque;">Sign up</button>
    </form>
    <br/>
    <a href="#" class="btn" onclick="onNavigate('#/login'); return false;">login</a><
</section>
</div>`;

// // // // // // // // // // // // // //  LOGIN PAGE // // // // // // // // // // // // // // // // // // // // // //
const loginPage = `<div id="login-page" style="background-image: url('./static/login.jpg')">
<h1 class="title"> Login </h1>
<section>
    <form onsubmit = "event.preventDefault(); login();">
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

        <button  onclick="login()"  style="background-color: blanchedalmond;">Login</button>

    </form>
    <br/>
    <a href="#" class="btn" onclick="onNavigate('#/signup'); return false;">Signup</a><
</section>

</div>`;

// // // // // // // // // // // // HOME PAGE // // // // // // // // // // // // // // // // // // // // // //

const homePage = `
<header>
  ${navBar}
</header>
  
<div class="search-container">
  <div>
      <input type="text" name="search" placeholder="search" onchange="search()"#/>
  </div>
  ${
    localStorage.getItem("token") && localStorage.getItem("role") === "ADMIN"
      ? `<a type="button" class="btn" href="#open-modal">Add New Book</a>`
      : ""
  }

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
                      <input type="number" min="1900" max="2099" step="1" value="2016" name="pYear" />
                  </div>
                  <div class="inputs-control">
                  <label>Amount</label>
                  <input type="number" min="1" step="1" value="1" name="amount" />
              </div>

                  <button type="button" onclick="bookAction('POST')">Submit</button>

              </form>


          </div>
      </div>
  </div>
</div>
<div id="books-container"></div>

`;

// // // // // BOOK PAGE

const bookPage = `
<header>
  ${navBar}
</header>

<div id="book-view__container" class="container"></div>

`;

// // // PROFILE PAGE

const profilePage = `
    ${navBar}
    <div class="container">

        <div class="profile-view__card">
            <div class="profile-view__img">
                <img src="./static/user-avatar.png" />
            </div>
            <div class="profile-view__body" id="profile-info"></div>
            <div class="profile-view__actions">
                <a class="btn" href="#open-modal">Edit</a>
            </div>

        </div>

    </div>
    <!-- Edit Form -->
    <div id="open-modal" class="modal-window">
        
    </div>


`;

// // ALL APPP ROUTES
const routes = {
  "#/home": homePage,
  "#/login": loginPage,
  "#/signup": singupPage,
  "#/profile": profilePage,
  "#/book": bookPage,
};

function showLoader(id) {
  document.getElementById(id).innerHTML = loader;
}

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
// // // ROUTING FUNCTION
const onNavigate = async (pathname) => {
  window.history.pushState({}, pathname, window.location.origin + pathname);
  document.getElementById("root").innerHTML = routes[pathname];

  if (pathname !== "#/book") {
    bookId = 0;
  }
  if (pathname === "#/book") {
    getOneBook(bookId);
    if (bookId === 0) onNavigate("#/home");
  }
  if (pathname === "#/home") {
    getAllBooks();
  }
  if (pathname === "#/profile") {
    authMe();
  }
};

// // //  RENDER THE PAGE BY ITS URL
window.onload = () => {
  const hash = window.location.hash;
  const token = localStorage.getItem("token") ? true : false;
  if (!token) {
    return onNavigate("#/login");
  }
  if (!hash || !routes[hash]) {
    return onNavigate("#/home");
  } else {
    return Routing();
  }
};

window.onhashchange = () => Routing();

// // // // // SIGN UP
const signUp = () => {
  let firstName = document.querySelector("input[name='firstName']").value;
  let lastName = document.querySelector("input[name='lastName']").value;
  let email = document.querySelector("input[name='email']").value;
  let password = document.querySelector("input[name='password']").value;

  const data = { firstName, lastName, email, password };

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      onNavigate("#/login");
    }
  };

  xhttp.open("POST", `${API_URL}/auth/signup/`, true);
  xhttp.setRequestHeader("accept", "application/json");
  xhttp.send(JSON.stringify(data));
};

// // // LOGIN
const login = (e) => {
  let email = document.querySelector("input[name='email']").value;
  let password = document.querySelector("input[name='password']").value;

  const data = { email, password };

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let respons = JSON.parse(this.response);
      localStorage.setItem("token", respons.data.token);
      localStorage.setItem("role", respons.data.role);
      if (localStorage.getItem("role") && localStorage.getItem("token")) {
        onNavigate("#/home");
      }
    }
  };
  xhttp.open("POST", `${API_URL}/auth/login/`, true);
  xhttp.setRequestHeader("accept", "application/json");

  xhttp.send(JSON.stringify(data));
};

// /// LOGOUT
const logOut = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  onNavigate("#/login");
};

// /// OPEN BOOK
const onOpenBook = (id) => {
  if (!isNaN(id)) {
    bookId = id;
    onNavigate("#/book");
  }
};

const getOneBook = async (id) => {
  let data;
  const xhttp = new XMLHttpRequest();

  showLoader("book-view__container");
  xhttp.onload = function () {
    let response = JSON.parse(this.response);
    data = response.data;
    document.getElementById("book-view__container").innerHTML = `
  <div class="book-view__card">
    <div class="book-view__img"></div>
    <div class="book-view__body">
        <div class="item">
          <h3>Title: <span>${data.title}</span></h3>
          <h3>ISBN: <span>${data.isbn}</span></h3>
          <h3>Left: <span style="color: red;">${data.amount}</span></h3>

        </div>
        <div class="item">
          <h3>Author: <span>${data.author}</span></h3>
          <h3>Category: <span>${data.category}</span></h3>
          <h3>publishing year: <span>${data.pYear}</span></h3>

        </div>

    </div>
  <div class="book-view__actions" id="book-act">
    ${
      data.users.length > 0 &&
      data.users.find((user) => {
        token = localStorage.getItem("token");
        if (user.token === token) {
          return true;
        }
        return false;
      })
        ? `<a class="btn" onclick="bookingActions('DELETE')" style="background: red;">Return</a>`
        : data.amount > 0
        ? `<a class="btn" onclick="bookingActions('POST')">Book</a>`
        : ""
    }
    ${
      localStorage.getItem("role") === "ADMIN"
        ? `<a class="btn" href="#open-modal">Edit</a>`
        : ""
    }
    
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
              <input type="text" required placeholder="Book Title" name="title" value="${
                data.title
              }"/>
          </div>
          <div class="inputs-control">
              <label>Author</label>
              <input type="text" required placeholder="Book Author" name="author" value="${
                data.author
              }"/>
          </div>
          <div class="inputs-control">
              <label>Category</label>
              <input type="text" required placeholder="Book Category" name="category" value="${
                data.category
              }"/>
          </div>
          <div class="inputs-control">
              <label>ISBN</label>
              <input type="text" required placeholder="Book ISBN" name="isbn" value="${
                data.isbn
              }"/>
          </div>

          <div class="inputs-control">
              <label>Publishing year</label>
              <input type="number" min="1900" max="2099" step="1" name="pYear" value="${
                data.pYear
              }"/>
          </div>
          <div class="inputs-control">
              <label>Amount</label>
              <input type="number" min="1" step="1" name="amount" value="${
                data.amount
              }"/>
          </div>


          <button type="button" onclick="bookAction('PUT')">Submit</button>

      </form>


  </div>
</div>
</div>

</div>

  `;
  };

  xhttp.open("GET", `${API_URL}/book/${id}/`, true);
  xhttp.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("token")}`
  );
  xhttp.setRequestHeader("accept", "application/json");
  xhttp.send();
};

// // // // // // ////

const getAllBooks = async () => {
  let data = [];
  const xhttp = new XMLHttpRequest();
  showLoader("books-container");
  xhttp.onload = function () {
    let response = JSON.parse(this.response);
    data = response.data;
    document.getElementById("books-container").innerHTML = data.map(
      (book) =>
        `<div class="card">
        <div class="card-img"></div>
        <div class="card-body">
            <div class="item">
              <h3>Title: <span>${book.title}</span></h3>
            </div>
            <div class="item">
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
  xhttp.open("GET", `${API_URL}/books/`, true);

  xhttp.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("token")}`
  );
  xhttp.setRequestHeader("accept", "application/json");
  xhttp.send();
};

const search = async () => {
  let query = document.querySelector("input[name='search']").value;
  let data = [];
  showLoader("books-container");

  if (query !== "")
    await fetch(`${API_URL}/books/search/q=${query}/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((response) => response.json())
      .then((respons) => (data = respons.data))
      .catch((e) => console.log(e));
  else
    await fetch(`${API_URL}/books/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
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
            </div>
            <div class="item">
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

////////

const bookingActions = (method) => {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    onNavigate("#/book");
  };
  if (method === "POST")
    xhttp.open("POST", `${API_URL}/book/add/${bookId}/`, true);
  if (method === "DELETE")
    xhttp.open("POST", `${API_URL}/book/delete/${bookId}/`, true);

  xhttp.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("token")}`
  );
  xhttp.setRequestHeader("accept", "application/json");
  xhttp.send();
};

const bookAction = (method) => {
  let title = document.querySelector("input[name='title']").value;
  let author = document.querySelector("input[name='author']").value;
  let isbn = document.querySelector("input[name='isbn']").value;
  let category = document.querySelector("input[name='category']").value;
  let pYear = document.querySelector("input[name='pYear']").value;
  let amount = document.querySelector("input[name='amount']").value;

  const data = { title, author, isbn, category, pYear, amount };
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      if (method === "POST") onNavigate("#/home");
      if (method === "PUT") onNavigate("#/book");
    }
  };
  if (method === "POST") xhttp.open(method, `${API_URL}/books/`, true);
  if (method === "PUT") xhttp.open(method, `${API_URL}/book/${bookId}/`, true);
  xhttp.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("token")}`
  );
  xhttp.setRequestHeader("accept", "application/json");

  xhttp.send(JSON.stringify(data));
};

///////

const authMe = async () => {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    data = JSON.parse(this.response);
    document.getElementById("profile-info").innerHTML = `
    <div class="item">
        <h3>FirstName: <span>${data.firstName}</span></h3>
        <h3>LasstName: <span>${data.lastName}</span></h3>
        <h3>E-mail: <span>${data.email}</span></h3>

    </div>
    <div class="item">
        <h3>Books: <span style="color: red;">${
          data.books.length || 0
        }</span></h3>
    </div>
    `;
    document.getElementById("open-modal").innerHTML = `
    <div>
    <a href="#" title="Close" class="modal-close">Close</a>
    <div>
        <h1 class="title"></h1>

        <form>
            <div class="inputs-control">
                <label>FirstName</label>
                <input type="text" required placeholder="FirstName" name="firstName" value="${data.firstName}">
            </div>
            <div class="inputs-control">
                <label>LastName</label>
                <input type="text" required placeholder="LastName" name="lastName" value="${data.lastName}">
            </div>
            <div class="inputs-control">
                <label>E-Mail</label>
                <input type="email" required placeholder="E-Mail" name="email" value="${data.email}">
            </div>

            <button type="button" onclick="updateUser()">Submit</button>

        </form>


    </div>
</div>
    `;
  };
  xhttp.open("POST", `${API_URL}/auth/me/`, true);

  xhttp.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("token")}`
  );
  xhttp.setRequestHeader("accept", "application/json");
  xhttp.send();
};

const updateUser = () => {
  let firstName = document.querySelector("input[name='firstName']").value;
  let lastName = document.querySelector("input[name='lastName']").value;
  let email = document.querySelector("input[name='email']").value;

  const data = { firstName, lastName, email };
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      onNavigate("#/profile");
    }
  };
  xhttp.open("PUT", `${API_URL}/auth/me/`, true);

  xhttp.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("token")}`
  );
  xhttp.setRequestHeader("accept", "application/json");

  xhttp.send(JSON.stringify(data));
};
