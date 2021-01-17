import { Button } from '@material-ui/core';
import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'
import UserContext from '../../context/UserContext'

function AuthOptions() {

    const {userData, setUserData} = useContext(UserContext)
    
    const history = useHistory();
    const register = () => { history.push("/register") }
    const login = () => { history.push("/login") }
    const logout = () => { 
        setUserData({
            token: undefined, 
            user: undefined
        })
        localStorage.setItem('auth-token', '')
    }

    return (
        <nav className='auth-options'>
            {
                userData.user ? 
                <Button color='inherit' onClick={logout}>Logout</Button> : (
                    <>
                        <Button color='inherit' onClick={register}>Register</Button>
                        <Button color='inherit' onClick={login}>Login</Button>
                    </>
                )
            }
        </nav>
    )
}

export default AuthOptions
