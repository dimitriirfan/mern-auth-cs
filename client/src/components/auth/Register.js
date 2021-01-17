import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import UserContext from '../../context/UserContext'
import Axios from 'axios'
import * as yup from 'yup'
import { useFormik } from 'formik';
import { Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';



const validationSchema = yup.object({
    email: yup
      .string('Enter your email')
      .email('Enter a valid email')
      .required('Email is required'),
    password: yup
      .string('Enter your password')
      .min(8, 'Password should be of minimum 8 characters length')
      .required('Password is required'),
    passwordCheck: yup
      .string("Verify your password")
      .oneOf([yup.ref('password'), null], 'Password does not match')
      .required('Password does not match'),
      
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

function Register() {

    const history = useHistory()
    const [error, setError] = useState()
    const { setUserData } = useContext(UserContext)
    const classes = useStyles();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            passwordCheck: "",
            displayName: ""
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {

                const email = values.email
                const password = values.password
    
                await Axios.post('http://localhost:5000/users/register', values)
                const loginRes = await Axios.post('http://localhost:5000/users/login', {
                    email,
                    password
                })
    
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
                    Sign up
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
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                type='password'
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
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                type='password'
                                fullWidth
                                id='passwordCheck'
                                name='passwordCheck'
                                label='Verfy Password'
                                value={formik.values.passwordCheck}
                                onChange={formik.handleChange}
                                error={formik.touched.passwordCheck && Boolean(formik.errors.passwordCheck)}
                                helperText={formik.touched.passwordCheck && formik.errors.passwordCheck}
                            >
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id='displayName'
                                name='displayName'
                                label='Display Name'
                                value={formik.values.displayName}
                                onChange={formik.handleChange}
                                error={formik.touched.displayName && Boolean(formik.errors.displayName)}
                                helperText={formik.touched.displayName && formik.errors.displayName}
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
                        Sign Up
                    </Button>
                </form>

            </div>
        </Container>
           
    )
}

export default Register
