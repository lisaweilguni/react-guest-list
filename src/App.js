/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

const inputSectionStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 100px;
  font-size: 14px;
  gap: 10px;

  h1 {
    padding: 10px 10px 30px 10px;
    font-size: 35px;
  }

  input {
    border: 0;
    padding: 10px;
    border: 1px solid #ccc;
    background-color: transparent;
    margin-left: 15px;
  }

  button {
    width: 160px;
    height: 50px;
    border: none;
    outline: none;
    color: #fff;
    background: #111;
    cursor: pointer;
    position: relative;
    border-radius: 10px;
    text-transform: uppercase;

    &:hover {
      border-color: rgba(255, 255, 255, 1);
      color: black;
      background-color: white;
      border: 2px solid black;
    }
  }
`;

const guestListSectionStyles = css`
  display: flex;
  flex-direction: column;
  align-items: space-between;
  font-size: 14px;
  border-radius: 4px;
  padding: 10px;
  margin: 20px 300px auto 300px;
  gap: 5px;
`;

const guestStyles = css`
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  justify-content: space-between;
  align-items: center;
  background-color: #dcdcdc;
  border: 2px solid #d3d3d3;
  width: 80%;
  padding: 5px;
  padding-left: 20px;
  align-self: center;
  border-radius: 0.2em;

  button {
    display: inline-block;
    padding: 0.3em 1.2em;
    margin: 0 auto;
    border: 2px solid #ed4d4d;
    width: 90px;
    border-radius: 2em;
    box-sizing: border-box;
    text-decoration: none;
    font-weight: 300;
    color: #ed4d4d;
    background-color: white;
    text-align: center;
    transition: all 0.2s;

    &:hover {
      border-color: rgba(255, 255, 255, 1);

      color: white;
      background-color: #ed4d4d;
      border: 2px solid #ed4d4d;
    }
  }
`;

const attendingStyles = css`
  display: flex;
  flex-direction: row;
`;

const hiddenButtonStyle = css`
  display: none;
`;

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);

  // Set base URL for database
  const baseUrl =
    'https://express-guest-list-api-memory-data-store.lisaweilguni.repl.co';

  // Get all guests
  async function fetchGuests() {
    const response = await fetch(`${baseUrl}/guests`);
    const allGuests = await response.json();
    setGuests(allGuests);
    setIsLoading(false);
    setIsDisabled(false);
  }

  useEffect(() => {
    fetchGuests().catch(() => {});
  }, []);

  // Add guest
  async function addGuest() {
    if (firstName && lastName) {
      const response = await fetch(`${baseUrl}/guests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          attending: false,
        }),
      });
      const createdGuest = await response.json();

      const newGuestList = [...guests];
      newGuestList.unshift(createdGuest);
      setGuests(newGuestList);
    }
  }

  // Update attendance
  async function toggleAttendance(id, checkboxResult) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: checkboxResult }),
    });
    const updatedGuest = await response.json();

    let newGuestState = [...guests];
    newGuestState = newGuestState.map((guest) =>
      guest.id === id ? updatedGuest : guest,
    );
    setGuests(newGuestState);
  }
  console.log('guests', guests);
  // Remove guest
  async function removeGuest(id) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    console.log('deleted', deletedGuest);

    const newGuestList = guests.filter((guest) => guest.id !== deletedGuest.id);
    setGuests(newGuestList);
  }

  // Map over guest array to create <div>s for each guest
  const guestNames =
    guests.length &&
    guests.map((guest) => {
      return (
        <div
          value={guest.id}
          key={`guest-${guest.id}`}
          data-test-id="guest"
          css={guestStyles}
        >
          {guest.firstName} {guest.lastName}
          <div css={attendingStyles}>
            <input
              checked={guest.attending}
              aria-label="attending"
              type="checkbox"
              onChange={(event) =>
                toggleAttendance(guest.id, event.currentTarget.checked)
              }
            />
            <div>{guest.attending ? 'attending ✅' : 'not attending 🚫'}</div>
          </div>
          <button onClick={() => removeGuest(guest.id)}>Remove</button>
        </div>
      );
    });

  // Prevent page refresh & clear all input values
  const handleSubmit = (event) => {
    event.preventDefault();

    setFirstName('');
    setLastName('');
  };

  return (
    <>
      {/* Input Section */}
      <div>
        <form css={inputSectionStyles} onSubmit={handleSubmit}>
          <h1>Start your guest list</h1>
          <div>
            <div>
              <label htmlFor="first-name">First name</label>
              <input
                id="first-name"
                value={firstName}
                placeholder="First Name"
                onClick={() => setFirstName('')}
                onChange={(event) => setFirstName(event.currentTarget.value)}
                disabled={isDisabled}
                required
              />
            </div>
            <br />
            <label htmlFor="last-name">Last name</label>
            <input
              id="last-name"
              value={lastName}
              placeholder="Last Name"
              onClick={() => setLastName('')}
              onChange={(event) => setLastName(event.currentTarget.value)}
              onKeyPress={async (event) =>
                event.key === 'Enter' ? await addGuest() : null
              }
              disabled={isDisabled}
              required
            />
          </div>
          <br />
          <input type="submit" value="submit" css={hiddenButtonStyle} />
        </form>
      </div>
      {/* Guest Output */}

      <div css={guestListSectionStyles}>
        {isLoading ? (
          <p>Loading...</p>
        ) : guests.length ? (
          guestNames
        ) : (
          <div>The guest list is currently empty</div>
        )}
      </div>
    </>
  );
}

export default App;
