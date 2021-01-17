import React from 'react'
import {Link} from 'react-router-dom'
import AuthOptions from '../auth/AuthOptions'
import AppBar from '@material-ui/core/AppBar';
import { FormHelperText, makeStyles, Toolbar, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    header: {
        flexGrow: 1
    },

    title: {
        flexGrow: 1
    }
}))

function Header() {

    const classes = useStyles();
    return (
        // <header id='header'>
        //     <Link to="/"><h1 className='title'>MERN</h1></Link>
        //     <AuthOptions></AuthOptions>
        // </header>
        <div className={classes.header}>
            <AppBar>
                <Toolbar>
                    <Typography variant="h5" className={classes.title}>MERN</Typography>
                    <AuthOptions></AuthOptions>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Header
