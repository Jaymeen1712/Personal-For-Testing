import React, { ReactNode } from 'react';

import Header from './header';

interface AuthContainerProps {
  children: ReactNode;
  showSignUpLink?: boolean;
}

const AuthContainer: React.FC<AuthContainerProps> = ({
  showSignUpLink,
  children,
}) => (
  <div className="login-section">
    <div className="login-popup ant-row ant-space-vertical ant-row-middle ant-row-center ">
      <Header showSignUpLink={showSignUpLink} />
      <div className="login-popup-inner m-b-0 p-40">{children}</div>
      {/*TODO:Currently footer section is disable.*/}
      {/*<Footer />*/}
    </div>
  </div>
);

export default AuthContainer;
