import React from "react";

function Header({ logOut, loggedIn }) {
  return (
    <header className="Header">
      <div className="Logo">Five</div>
      <nav className="Nav">
        {!loggedIn && (
          <>
            <a href="/">Login</a>
            <a href="/create">Create User</a>
          </>
        )}

        {!loggedIn && (
          <>
            <a href="/user/id">User Profile</a>
            <button onClick={() => logOut()}>Log Out</button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
