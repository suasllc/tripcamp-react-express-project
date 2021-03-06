// frontend/src/components/BookingForm/index.js

import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, useHistory, useLocation } from 'react-router-dom';

import * as sessionActions from '../../store/session';
import * as bookingActions from '../../store/booking';

import '../Forms.css';
import { nanoid } from 'nanoid';

export default function BookingFormModal({ thisSpot = undefined, dref = undefined }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const spots = useSelector(state => state.spots.allSpots);
  const date = new Date();
  const today = new Date(date.toLocaleDateString()).toISOString().slice(0, 10);
  date.setDate(date.getDate() + 1);
  const tomorrow = new Date(date.toLocaleDateString()).toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [specialRequest, setSpecialRequest] = useState("");
  const [errors, setErrors] = useState([]);
  const bookingModalRef = useRef(null);
  const history = useHistory();
  const location = useLocation();
  const [spot, setSpot] = useState(null);

  useEffect(() => {
    if (thisSpot) {
      return setSpot(thisSpot);
    }
    if (location.pathname && spots) {
      const path = location.pathname;
      setSpot(spots.find(spot => spot.id === Number(path.slice(path.lastIndexOf('/') + 1))));
    }
  }, [location.pathname, thisSpot]);

  if (!sessionUser) {
    if (bookingModalRef.current)
      bookingModalRef.current.style.display = "none";
    return <Redirect to='/login' />;
  }

  const handleSubmit = e => {
    e.preventDefault();
    setErrors([]);

    return dispatch(bookingActions.createOneBooking({
      booking: {
        userId: sessionUser.id,
        spotId: spot.id,
        startDate,
        endDate,
        guests: numberOfGuests,
        specialRequest
      }
    }))
      .then(res => {
        if (dref && dref.current)
          dref.current.style.display = "none";
        if (bookingModalRef.current)
          bookingModalRef.current.style.display = "none";
        if (!thisSpot)
          history.push('/allspots');
      })
      .catch(res => {
        if (res.data && res.data.errors) setErrors(res.data.errors);
      });
  };

  const handleCancelClick = e => {
    e.preventDefault();
    if (bookingModalRef.current)
      bookingModalRef.current.style.display = "none";
    if (dref && dref.current)
      dref.current.style.display = "none";
    if (!thisSpot)
      history.push('/allspots');
  }

  return (
    // <div className="modal" ref={bookingModalRef}>
    <div className="modal" ref={dref ? dref : bookingModalRef}>
      <form
        className='form-container modal-content'
        onSubmit={handleSubmit}
      >
        <h3>Booking Form</h3>
        <div>
          {
            spot && <>
              <p>Spot:</p>
              <p>{spot.name}</p>
              <p>{spot.streetAddress}</p>
            </>
          }
        </div>
        <ul className='error-messages'>
          {errors.map((error) => <li key={nanoid()}>{error}</li>)}
        </ul>
        <div className="inputs-div">
          <div className="input-div">
            <label>Start Date</label>
            <input
              className='input-date'
              type='date'
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="input-div">
            <label>End Date</label>
            <input
              className='input-date'
              type='date'
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              required
            />
          </div>
          <div className="input-div">
            <label>Number of Guests</label>
            <input
              className='input-number'
              type='number'
              value={numberOfGuests}
              min={1}
              onChange={e => setNumberOfGuests(e.target.value)}
              required
            />
          </div>
          <div className="input-div">
            <label>Special Request</label>
            <textarea
              className='input'
              type='text'
              value={specialRequest}
              onChange={e => setSpecialRequest(e.target.value)}
            // required // this is NOT required
            />
          </div>
        </div>
        <div className="buttons-div">
          <button
            className='button'
            type='submit'
          >Submit</button>
          <button
            className='button button-Reset'
            onClick={handleCancelClick}
          > Cancel </button>
        </div>
      </form>
    </div>
  );
}
