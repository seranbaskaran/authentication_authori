const container = document.querySelector(".container"),
      signUp = document.querySelector(".signup-link"),
      login = document.querySelector(".login-link"),
      signupBtn=document.querySelector("#signup-btn"),
      loginBtn=document.querySelector("#login-btn");

signUp.addEventListener("click", ( )=>{
    container.classList.add("active");
});
login.addEventListener("click", ( )=>{
    container.classList.remove("active");
});
// Add an event listener to the Signup button
document.getElementById('signup-btn').addEventListener('click', function () {
    const name = document.getElementById("signup-name").value;
      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;
      const type = document.getElementById("types").value;
  
      // Create a JavaScript object or JSON with user data
      const userData = {
        name: name,
        email: email,
        password: password,
        type: type,
      };
      // Make a POST request to your API
      fetch("https://crudcrud.com/api/a76fa981eb364cbdb35b170a2adf814c/User", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((data) => {
        document.getElementById("signup-name").value='';
        document.getElementById("signup-email").value='';
        document.getElementById("signup-password").value='';
        document.getElementById("types").value='';
        container.classList.remove("active");
        console.log(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
});
// Add an event listener to the Login button
document.getElementById('login-btn').addEventListener('click', function () {

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
fetch('https://crudcrud.com/api/a76fa981eb364cbdb35b170a2adf814c/User')
  .then(response => response.json())
  .then((data) => {
    // console.log(data);
    if (data.length > 0) {
      var foundUser = data.find(function (user) {
        return user.email === email && user.password === password;
      });
      if (foundUser) {
        const loginUser = {
          email: foundUser.email,
          name: foundUser.name,
          type: foundUser.type,
        };
        localStorage.clear();
        // Store the loginUser object in localStorage
        localStorage.setItem('loggedInUser', JSON.stringify(loginUser));
        const userType = foundUser.type;
        window.location.href = `./table.html?type=${userType}`;
      } 
      else {
        // User not found, redirect signup page 
        alert('User not found. Please sign up.');
        // You can add code here to redirect the user to the signup page or any other action.
      }
    } 
    else {
      //redirect to the signup page 
      alert('No registered users. Please sign up.');
    }
  });
});
