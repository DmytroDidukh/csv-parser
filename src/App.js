import React, {Fragment, useState, useRef} from "react";
import {
    Button,
    TableContainer,
    Paper,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    Table,
} from "@material-ui/core";
import {parse} from "papaparse";

import './App.css';


const camelCaseKey = (key) => key
    .split(' ')
    .map((value, i) => i > 0 ? value[0].toUpperCase() + value.slice(1) : value.toLowerCase())
    .join('')

function App() {

    const [contacts, setContacts] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const inputRef = useRef(null)

    const handleChange = (e) => {
        e.preventDefault()

        Array.from(e.target.files)
            .filter((file) => file.type === "application/vnd.ms-excel")
            .forEach(async (file) => {
                const text = await file.text();
                const {data} = parse(text, {header: true});

                const result = data
                    .slice(0, data.length - 1)
                    .map((props, i) => {
                        const keys = Object.keys(props)
                        const values = Object.values(props)

                        return {
                            id: i + 1,
                            ...Object.fromEntries(keys.map((key, i) => [[camelCaseKey(key)], values[i]])),
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

                setContacts(() => [...result]);
                setTableHeaders(['ID', ...Object.keys(data[0]), 'Duplicated With',]);
            });
    };

    console.log(contacts)

    const handleValidate = (value, key, row) => {
        switch (key) {
            case 'id': {
                return true
            }
            case 'duplicatedWith': {
                return !value.length
            }
            case 'fullName': {
                return /^[a-z,',-]+(\s)[a-z,',-]+$/i.test(value)
            }
            case 'phone': {
                const str = value.toString()
                const isValid = /[+\d]?\d{10}/.test(str)

                if (isValid) {
                    return str.length >= 10 ? `+1${str.slice(-10)}` : str
                }

                return isValid
            }
            case 'email': {
                return /\S+@\S+\.\S+/.test(value)
            }
            case 'age': {
                return value <= 21
            }
            case 'experience': {
                return value <= row.age            }
            case 'yearlyIncome': {
                return value >= 0 && value <= 1000000
            }
            case 'hasChildren': {
                return value !== 'TRUE' || value !== 'FALSE' || value !== ''
            }
            case 'licenseStates': {
                return value.split(',').map(value => value.trim().slice(0, 2).toUpperCase()).join(' | ')
            }
            case 'expirationDate': {
                return value.split(',').map(value => value.trim().slice(0, 2).toUpperCase()).join(' | ')
            }
            default: {
                return false
            }
        }
    }

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
            <Table aria-label="customized table" className='table'>
                <TableHead className='table-head'>
                    <TableRow>
                        {
                            tableHeaders.map(item => (
                                <TableCell align="center">{item}</TableCell>
                            ))
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        contacts.map(row => (
                            <TableRow key={row.id}>
                                {
                                    Object.entries(row).map(([key, value], i) => {
                                        const isValidOrResult = handleValidate(value.toString().trim(), key, row)

                                        return (
                                            <TableCell key={value + key}
                                                       className={!isValidOrResult ? 'not-valid-cell' : ''}
                                                       align="center">
                                                {(key === 'phone' || key === 'licenseStates') && isValidOrResult ? isValidOrResult : value}
                                            </TableCell>
                                        )
                                    })
                                }
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    );
}

export default App;
