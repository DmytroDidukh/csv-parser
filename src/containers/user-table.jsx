import React from "react";
import isDate from "date-fns/isDate";
import isAfter from "date-fns/isAfter";

import UsersTable from "../components/table";
import camelCaseKey from "../utils/camelCaseKey";
import {KEYS} from "../config";

const UsersTableContainer = ({usersData, tableHeaders}) => {

    const handleValidate = (value, key, row) => {
        switch (key) {
            case KEYS.id: {
                return true
            }
            case KEYS.duplicatedWith: {
                return !value.length
            }
            case KEYS.fullName: {
                return /^([a-z,',-]+(\s)[a-z,',-]+)+$/i.test(value)
            }
            case KEYS.phone: {
                const str = value.toString()
                const isValid = /[+\d]?\d{10}/.test(str)

                if (isValid) {
                    return str.length >= 10 ? `+1${str.slice(-10)}` : str
                }

                return isValid
            }
            case KEYS.email: {
                return /\S+@\S+\.\S+/.test(value)
            }
            case KEYS.age: {
                return value >= 21
            }
            case KEYS.experience: {
                return value <= row.age && value >= 0
            }
            case KEYS.yearlyIncome: {
                return value >= 0 && value <= 1000000
            }
            case KEYS.hasChildren: {
                const lowerCaseValue = camelCaseKey(value + '')
                return lowerCaseValue === 'true' || lowerCaseValue === 'false' || lowerCaseValue === ''
            }
            case KEYS.licenseStates: {
                return value.split(',').map(value => value.trim().slice(0, 2).toUpperCase()).join(' | ')
            }
            case KEYS.expirationDate: {
                let date

                if (value.includes('-')) {
                    const [year, month, day] = value.split('-')
                    date = new Date(year, month - 1, day)
                } else if (value.includes('/')) {
                    const [month, day, year] = value.split('/')
                    date = new Date(year, month - 1, day)
                }

                return date instanceof Date && isDate(date) && isAfter(date, new Date())
            }
            case KEYS.licenseNumber: {
                return value.length === 6
            }
            default: {
                return false
            }
        }
    }

    return (
        <UsersTable
            tableHeaders={tableHeaders}
            usersData={usersData}
            handleValidate={handleValidate} />
    )
}

export default UsersTableContainer
