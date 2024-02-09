import React, { useEffect, useState } from "react";

import Modal from "./Modal";
import "./Popup.css";
import Search from "./Search";
import TextInput from "./TextInput";

import { Category, trackEvent } from "../analytics";
import * as storage from "../storage";

export default function Popup(): React.ReactElement {
  const [loaded, setLoaded] = useState(false);
  const [siteUrl, setSiteUrl] = useState(null);
  const [shortcut, setShortcut] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    chrome.commands.getAll((commands) => {
      // note: this assumes only one command is defined in manifest.json
      if (commands.length !== 0 && commands[0].shortcut !== "") {
        setShortcut(commands[0].shortcut.replace("Command", "⌘"));
      }
    });
  }, []);

  useEffect(() => {
    trackEvent({ category: Category.Popup, action: "open" });
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
        flex: 1,
        flexDirection: "column",
        flexGrow: 1,
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
                    trackEvent({ category: Category.Config, action: "fixed" });
                    storage.saveSiteUrl(`https://${url}`);
                  }
                  setModalVisible(false);
                  trackEvent({ category: Category.Config, action: "submit" });
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

      {siteUrl && (
        <div>
          <p>
            <em>
              <span>
                <span style={{ fontSize: "1.1em", fontFamily: "system-ui" }}>Searching {siteUrl} </span>(
                <a
                  href="#"
                  title="Click to change your Confluence site."
                  onClick={() => {
                    setModalVisible(true);
                    trackEvent({ category: Category.Popup, action: "click", label: "config" });
                  }}
                >
                  Edit
                </a>
                )
              </span>
            </em>
          </p>
          <p>
            <em>
              <span>Shortcut: </span>
            </em>
            <span>
              {shortcut ? (
                <span
                  style={{ fontSize: "1.1em", fontFamily: "system-ui" }}
                  title="This is configured in your browser settings."
                >
                  {shortcut}
                </span>
              ) : (
                <em>
                  (
                  <a
                    href="chrome://extensions/shortcuts"
                    title="This is configured in your browser settings."
                    rel="noreferrer"
                    target="_blank"
                    onClick={() => {
                      chrome.tabs.create({ url: "chrome://extensions/shortcuts" }, ({ windowId }) => {
                        chrome.windows.update(windowId, { focused: true });
                      });
                    }}
                  >
                    Not set
                  </a>
                  )
                </em>
              )}
            </span>
          </p>
          <br />
        </div>
      )}
    </div>
  );
}
