import React from 'react';
import Balls from '../../components/balls/balls';
import LoginBox from '../../components/loginbox/loginbox';

function Login() {
    return (
        <div  className="login">
            <LoginBox />
            <Balls/>
        </div>
    );
}

export default Login;