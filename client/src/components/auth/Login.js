import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import Axios from 'axios'
import UserContext from '../../context/UserContext'



import * as yup from 'yup'
import { useFormik } from 'formik';
import { Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';

const validationSchema = yup.object({
    email: yup
      .string('Enter your email')
      .email('Enter a valid email')
      .required('Email is required'),
    password: yup
      .string('Enter your password')
      .required('Password is required'),
       
});

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(16),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },

    button: {
        marginTop: theme.spacing(3)
    },

    alert: {
        marginBottom: theme.spacing(3)
    }
}));

function Login() {

    const history = useHistory()
    const { setUserData } = useContext(UserContext)
    const [error, setError] = useState()

    const classes = useStyles();
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            
            try {
                
                const loginRes = await Axios.post('http://localhost:5000/users/login', values)
                console.log(loginRes)
                setUserData({
                    token: loginRes.data.token,
                    user: loginRes.data.user
                })
    
                localStorage.setItem('auth-token', loginRes.data.token)
                history.push('/')

            } catch (err) {
                err.response.data.msg && setError(err.response.data.msg)              
            }
        }
    })
    return (
        <Container component='main' maxWidth='xs'>
            <div className={classes.paper}>
                
                <Typography component='h1' variant='h5'>
                    Login
                </Typography>
                <form onSubmit={formik.handleSubmit} className={classes.form} noValidate>
                    {error && 

                    <Alert variant="filled" severity="error" className={classes.alert} onClose={() => setError(undefined)}>
                        {error}
                    </Alert>

                    }
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id='email'
                                name='email'
                                label='Email'
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            >
                            </TextField>
                        </Grid>
                        
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                type="password"
                                fullWidth
                                id='password'
                                name='password'
                                label='Password'
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                            >
                            </TextField>
                        </Grid>
                    </Grid>
                    <Button
                        className={classes.button}
                        spacing
                        type="submit"
                        variant="contained"
                        fullWidth
                        color='primary'
                    >
                        Login
                    </Button>
                </form>

            </div>
        </Container>
    )
}

export default Login
