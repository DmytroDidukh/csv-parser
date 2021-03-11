import React, {Fragment, useState, useRef} from "react";
import Button from "@material-ui/core/Button";
import Alert from '@material-ui/lab/Alert';
import {parse} from "papaparse";

import camelCaseKey from "./utils/camelCaseKey";
import checkRequiredColumns from "./utils/checkRequiredColumns";
import UsersTable from "./components/table";
import './App.css';

const App = () => {

    const [usersData, setUsersData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [isValidFormatOrTable, setIsValidFormatOrTable] = useState(true)

    const inputRef = useRef(null)

    const handleChange = async (e) => {
        e.preventDefault()

        const file = e.target.files[0]
        const text = await file.text();
        const {data} = parse(text, {header: true});
        const headersData = Object.keys(data[0])
        const keysForUserObject = headersData.map(key => camelCaseKey(key))

        setTableHeaders(['ID', ...headersData, 'Duplicated With',]);

        if (file.type !== "application/vnd.ms-excel" || !checkRequiredColumns(keysForUserObject)) {
            setIsValidFormatOrTable(false)
            return
        }

        const result = data
            .slice(0, data.length - 1)
            .map((props, i) => {
                const values = Object.values(props)

                return {
                    id: i + 1,
                    ...Object.fromEntries(keysForUserObject.map((key, i) => [[key], values[i]])),
                }
            })
            .map((props, i, arr) => ({
                ...props,
                duplicatedWith: (() => {
                    const duplicates = arr.filter(obj => (obj.email.toLowerCase() === props.email.toLowerCase()
                        || obj.phone.toLowerCase() === props.phone.toLowerCase()) && obj.id !== props.id)

                    if (duplicates.length) {
                        const ids = []
                        duplicates.forEach(item => ids.push(item.id))
                        return ids.join(', ')
                    }

                    return ''
                })(),
            }))

        setUsersData(result);
        setIsValidFormatOrTable(true)
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
                    Import users
                </Button>
            </Fragment>
            {
                isValidFormatOrTable ?
                    <UsersTable
                        tableHeaders={tableHeaders}
                        usersData={usersData}
                    />
                    :
                    <Alert className='alert-error'
                           severity="error">
                        Wrong file format or bad table data
                    </Alert>
            }
        </div>
    );
}

export default App;
