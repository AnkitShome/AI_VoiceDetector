import React from "react";
import { Link } from "react-router-dom";
function Navbar() {
  return (
    <nav
      class="navbar navbar-expand-lg border-bottom"
      style={{ backgroundColor: "#FFF" }}
    >
      <div class="container p-2">
        <Link class="navbar-brand" to="/">
          <img
            className="ms-4"
            src="proj_img/logo2.png"
            style={{ width: "8%" }}
            alt="logo"
          />
        </Link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <form class="d-flex" role="search">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <Link class="nav-link active" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              <li class="nav-item2">
                <Link class="nav-link active" aria-current="page" to="/prof-signup">
                  Professor Signup
                </Link>
              </li>
               
               <li class="nav-item2">
                <Link class="nav-link active" aria-current="page" to="/stud-signup">
                  Student Signup
                </Link>
              </li>
              
            </ul>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
