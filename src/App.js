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

  function addGuest() {
    const newState = [`${firstName} ${lastName}`, ...guests];
    setGuests(newState);
  }

  const guestNames = guests.map((guest) => {
    return (
      <div value={guest} key={guest} data-test-id="guest" css={guestListStyles}>
        {guest}
      </div>
    );
  });

  const handleKeyPress = (event) => {
    if (event.keyCode === 13) {
      addGuest();
    }
  };

  function removeGuest() {
    const newState = [...guests];
    newState.shift();
    setGuests(newState);
  }

  return (
    <>
      {/* Guest Output */}
      <div data-test-id="guest">
        <form
          css={inputSectionStyles}
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <label htmlFor="first-name">First name</label>
          <input
            id="first-name"
            value={firstName}
            onClick={() => setFirstName('')}
            onChange={(event) => setFirstName(event.currentTarget.value)}
          />
          <br />
          <label htmlFor="last-name">Last name</label>
          <input
            id="last-name"
            value={lastName}
            onClick={() => setLastName('')}
            onChange={(event) => setLastName(event.currentTarget.value)}
            onKeyPress={handleKeyPress}
          />
          <br />
          <button onClick={addGuest}>Add guest</button>
        </form>
      </div>

      {/* Guest Output */}
      <div css={guestListSectionStyles}>
        <div>{guestNames}</div>

        <input
          checked={checkBoxValue}
          type="checkbox"
          aria-label="attending"
          onChange={(event) => setCheckBoxValue(event.currentTarget.checked)}
        />
        <button aria-label="Remove" onClick={() => removeGuest()}>
          Remove
        </button>
      </div>
    </>
  );
}

export default App;
