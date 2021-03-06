import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';

import * as sessionActions from '../../store/session';

export default function ProfileButton({ user }) {
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const dropdownMenuRef = useRef(null);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push('/');
  };

  const userFullName = (user) => {
    let fullname = "";
    if (user.userProfile) {
      if (user.userProfile.firstName)
        fullname += user.userProfile.firstName;
      if (user.userProfile.lastName)
        fullname += " " + user.userProfile.lastName;
    } else {
      fullname = user.username;
    }
    return fullname;
  }

  function DropdownMenu() {
    return (
      <div className="dropdown-menu" ref={dropdownMenuRef}>
        <div className="dropdown-menu-item"><b>{userFullName(user)}</b></div>
        <hr className="hr" />
        <div className="dropdown-menu-item">
          <i className="fas fa-home"></i>
          <Link to='/myhome' >My home </Link>
        </div>
        <hr className="hr" />
        <div className="dropdown-menu-item">
          <i className="fas fa-map-marked-alt"></i>
          <Link to='/spots/create'>Create a Spot</Link>
        </div>
        <hr className="hr" />
        <div className="dropdown-menu-item">
          <i className="fas fa-user-friends"></i>
          <Link to='/users/addfriend'>Add a Friend</Link>
        </div>
        <hr className="hr" />
        <div className="dropdown-menu-item">
          <i className="fas fa-sign-out-alt"></i>
          <Link
            onClick={logout}
            to='/'
          >
            Logout
          </Link>
        </div>
      </div>
    );
  }
  function dropdownShowHide() {
    // if (showMenu) {
    //   dropdownMenuRef.current.classList.remove("hidden");
    //   dropdownMenuRef.current.classList.add("shown")
    // }
    // else {
    //   dropdownMenuRef.current.classList.remove("shown");
    //   dropdownMenuRef.current.classList.add("hidden")
    // }
  }

  useEffect(() => {
    if (!showMenu) return;
    dropdownShowHide();
    const closeMenu = (e) => {
      if (!e.target.className.includes("dropdown-menu"))
        setShowMenu(false);
    };
    document.addEventListener('click', closeMenu);
    // document.addEventListener('mouseover', closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu])

  return (
    <>
      <span
        className="dropdown-menu-parent"
        style={{ marginRight: '10px' }}
      // onClick={() => { setShowMenu(!showMenu); }}
      // onMouseOver={() => { setShowMenu(true); }}
      // onMouseOut={() => { setShowMenu(false); }}
      // onMouseLeave={() =>  setTimeout(() => setShowMenu(false), 1000) }
      >
        <button
          className="fas fa-atom icon-span"
          style={{ marginRight: '10px' }}
        />
        {
          // showMenu &&
          <DropdownMenu />
        }
      </span>
    </>
  );
}