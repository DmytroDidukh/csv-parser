import React, {Fragment, useState, useRef} from "react";
import {Button} from "@material-ui/core";
import { parse } from "papaparse";

import './App.css';

function App() {

    const [contacts, setContacts] = useState([]);
    const inputRef = useRef(null)

  const handleChange = (e) => {
    e.preventDefault()

    Array.from(e.target.files)
        .filter((file) => file.type === "application/vnd.ms-excel")
        .forEach(async (file) => {
          const text = await file.text();
          const result = parse(text, { header: true });
          console.log(result.data)
          setContacts((prev) => [...prev, ...result.data]);
        });
  };

  return (
    <div className="App">
      <Fragment>
        <input
            className='upload-input'
            onChange={handleChange}
            type="file"
            ref={inputRef}
        />
          <Button variant="contained"
                  color="secondary"
                  onClick={() => inputRef.current.click()}>
              Upload
          </Button>
      </Fragment>
    </div>
  );
}

export default App;
