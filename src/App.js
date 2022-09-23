/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

const inputSectionStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200px;
`;

const guestListSectionStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  list-style-type: none;
  text-align: center;
`;

const guestListStyles = css`
  text-align: center;
`;

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [checkBoxValue, setCheckBoxValue] = useState(false);
  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Set base URL for database
  const baseUrl = 'http://localhost:4000';

  // Get all guests
  async function fetchGuest() {
    const response = await fetch(`${baseUrl}/guests`);
    const allGuests = await response.json();
    setGuests(allGuests);
  }

  useEffect(() => {
    fetchGuest().catch(() => {});
  }, []);

  // Add guest
  async function addGuest() {
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
      }),
    });
    const createdGuest = await response.json();

    const newGuestList = [...guests];
    newGuestList.unshift(createdGuest);
    setGuests(newGuestList);
  }

  // Update Guest
  async function updateGuest() {
    const response = await fetch(`${baseUrl}/guests/1`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: true }),
    });
    const updatedGuest = await response.json();
  }

  // Remove guest
  async function removeGuest(id) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    console.log(deletedGuest);

    const newGuestList = guests.filter((g) => g.id !== deletedGuest.id);
    setGuests(newGuestList);
  }

  // Map over guest array to create <div>s for each guest
  const guestNames = guests.map((guest) => {
    return (
      <div
        value={guest.id}
        key={`guest-${guest.id}`}
        data-test-id="guest"
        css={guestListStyles}
      >
        {guest.firstName} {guest.lastName}
        <input
          checked={checkBoxValue}
          type="checkbox"
          aria-label="attending"
          onChange={(event) => setCheckBoxValue(event.currentTarget.checked)}
        />
        <button aria-label="Remove" onClick={() => removeGuest(guest.id)}>
          X
        </button>
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
      {/* Guest Output */}
      <div data-test-id="guest">
        <form css={inputSectionStyles} onSubmit={handleSubmit}>
          <label htmlFor="first-name">First name</label>
          <input
            id="first-name"
            value={firstName}
            onClick={() => setFirstName('')}
            onChange={(event) => setFirstName(event.currentTarget.value)}
            //disabled={isLoading}
          />
          <br />
          <label htmlFor="last-name">Last name</label>
          <input
            id="last-name"
            value={lastName}
            onClick={() => setLastName('')}
            onChange={(event) => setLastName(event.currentTarget.value)}
            onKeyPress={async (event) =>
              event.key === 'Enter' ? await addGuest() : null
            }
            //disabled={isLoading}
          />
          <br />
          <button onClick={addGuest}>Add guest</button>
        </form>
      </div>

      {/* Guest Output */}
      <div css={guestListSectionStyles}>{guestNames}</div>
    </>
  );
}

export default App;
