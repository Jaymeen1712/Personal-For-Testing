import React from 'react';
import { Typography } from 'antd';

import LogoText from '../../../images/icons/logotext';

const { Link } = Typography;

interface AuthContainerProps {
  showSignUpLink?: boolean;
}

const Header: React.FC<AuthContainerProps> = ({ showSignUpLink = false }) => {
  return (
    <div className="login-top-section m-b-40">
      <Link href="/src/pages">
        <LogoText />
      </Link>
    </div>
  );
};

export default Header;
