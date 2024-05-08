import React from 'react';
import Balls from '../../components/balls/balls';
import LoginBox from '../../components/loginbox/loginbox';
import LanguageSelector from '../../components/Language-button/LanguageSelector';

function Login() {
    return (
        <div  className="login">
            <LoginBox />
            <Balls/>
            <LanguageSelector/>
        </div>
    );
}

export default Login;