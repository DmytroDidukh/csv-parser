import React from "react";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";

import {KEYS} from "../config";

const UsersTable = ({usersData, tableHeaders, handleValidate}) => {

    return (
        <Table aria-label="customized table" className='table'>
            <TableHead className='table-head'>
                <TableRow>
                    {
                        tableHeaders.map(item => (
                            <TableCell key={item} align="center">{item}</TableCell>
                        ))
                    }
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    usersData.map(row => (
                        <TableRow key={row.id}>
                            {
                                Object.entries(row).map(([key, value]) => {
                                    const isValidOrResult = handleValidate(value.toString().trim(), key, row)

                                    return (
                                        <TableCell key={value + key}
                                                   className={isValidOrResult ? '' : 'not-valid-cell'}
                                                   align="center">
                                            {(key === KEYS.phone || key === KEYS.licenseStates) && isValidOrResult ? isValidOrResult : value}
                                        </TableCell>
                                    )
                                })
                            }
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}

export default UsersTable
