import React, { ReactElement, useEffect, useState } from 'react';
import Modal from './Modal';
import SearchInput from './SearchInput';

import * as storage from '../utils/data';

import './Popup.css';

function Popup(): ReactElement {
  const [siteUrl, setSiteUrl] = useState(null);
  const [settingsVisible, setSettingsVisible] = useState(false);

  useEffect(() => {
    storage.getSiteUrl().then(setSiteUrl);
  }, [settingsVisible]); // re-fetch when modal closed

  const closeModal = () => setSettingsVisible(false);
  const openModal = () => setSettingsVisible(true);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    storage.saveSiteUrl(siteUrl);
    closeModal();
  };

  return (
    <div style={{
      width: '300px',
      height: '400px',
      margin: '20px 20px 10px 20px',
      padding: '0',
    }}>
      <Modal
        visible={settingsVisible}
        onClickOutside={closeModal}
      >
        <div style={{
          padding: '20px 20px 10px 20px',
        }}>
          <form onSubmit={handleSubmit}>
            <p>
              <label>
                Your Confluence URL
                <input
                  placeholder="https://myteam.atlassian.net/wiki"
                  style={{ width: '95%' }}
                  type="text"
                  value={siteUrl}
                  onChange={e => setSiteUrl(e.target.value)}
                />
              </label>
            </p>
            <p><button type="submit">Save</button></p>
          </form>
        </div>
      </Modal>

      <SearchInput
        placeholder="Search Confluence..."
        siteUrl={siteUrl}
      />
      <em>
        <span>{siteUrl ? `Searching ${siteUrl} ` : 'Site URL not configured. '}</span>
        <span>(<a href="#" onClick={openModal}>Change?</a>)</span>
      </em>

    </div>
  );
}

export default Popup;
