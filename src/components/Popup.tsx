import React, { ReactElement, useEffect, useState } from "react";

import Modal from "./Modal";
import "./Popup.css";
import Search from "./Search";
import TextInput from "./TextInput";

import "../_ga";
import { trackEvent } from "../analytics";
import * as storage from "../utils/data";

function Popup(): ReactElement {
  const [loaded, setLoaded] = useState(false);
  const [siteUrl, setSiteUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    trackEvent({ category: "searchpopup", action: "clicked" });
  }, []);

  useEffect(() => {
    storage
      .getSiteUrl()
      .then((url) => setSiteUrl(url))
      .then(() => setLoaded(true));
  }, [modalVisible]); // re-fetch when modal closed

  useEffect(() => {
    if (loaded && !siteUrl) {
      setModalVisible(true);
    }
  }, [loaded, siteUrl]);

  return (
    <div
      style={{
        width: "300px",
        height: "400px",
        margin: "20px 20px 10px 20px",
        padding: "0",
      }}
    >
      <Modal
        visible={modalVisible}
        onClickOutside={() => {
          // keep modal shown until siteUrl set
          setModalVisible(!siteUrl);
        }}
      >
        <div
          style={{
            padding: "20px 20px 10px 20px",
          }}
        >
          <div style={{ display: "block" }}>
            <label>
              Your Confluence URL
              <TextInput
                initialValue={siteUrl}
                onSubmit={(url) => {
                  if (url === "" || url.match(new RegExp("^https?://"))) {
                    storage.saveSiteUrl(url);
                  } else {
                    // prepend https?://
                    trackEvent({ category: "setup", action: "adjusted" });
                    storage.saveSiteUrl(`https://${url}`);
                  }
                  setModalVisible(false);
                  trackEvent({ category: "setup", action: "submitted" });
                }}
                placeholder="https://myteam.atlassian.net/wiki"
                small
                withOutline
              />
            </label>
          </div>
          {/* <p><button type="submit">Save</button></p> */}
        </div>
      </Modal>

      <Search siteUrl={siteUrl} />

      <em>
        <span>{siteUrl ? `Searching ${siteUrl} ` : "Site URL not set. "}</span>
        <span>
          (
          <a
            href="#"
            onClick={() => {
              setModalVisible(true);
              trackEvent({ category: "setup", action: "clicked" });
            }}
          >
            Change?
          </a>
          )
        </span>
      </em>
    </div>
  );
}

export default Popup;
