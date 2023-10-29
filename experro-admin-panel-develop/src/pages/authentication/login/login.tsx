import React from 'react';
import { Typography, Button, Row, Col, Form, Input, Select } from 'antd';

import AuthContainer from '../../../components/auth-container';
import useLoginController from './login-controller';
import DownArrowIcon from '../../../images/icons/downarrow-icon';

const { Link } = Typography;

const Login: React.FC = () => {
  const {
    t,
    form,
    onFinish,
    onBlur,
    links,
    showOrganizationPage,
    onSubmitOrganization,
  } = useLoginController();

  return (
    <AuthContainer showSignUpLink={true}>
      {showOrganizationPage ? (
        <>
          <h1 className='h4'>{t('common.labels.select_organization')}</h1>
          <p className="m-b-40 gray-text">
            {t('common.labels.select_organization_description')}
          </p>
          <Form
            layout='vertical'
            name="organization-form"
            form={form}
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}
            onFinish={onSubmitOrganization}>
            <Form.Item
              name="organization"
              className="w-100"
              label={t('common.labels.organization')}
              initialValue={links.data && links.data.items[0].id}>
              {links.data && links.data.items.length > 1 && (
                <Select size="large" suffixIcon={<DownArrowIcon />}>
                  {links.data.items.map((link) => (
                    <Select.Option key={link.linkName} value={link.id}>
                      {link.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }}>
              <Button
                id={t('common.labels.submit')}
                type="primary"
                htmlType="submit"
                className="w-100"
                size="large">
                {t('common.labels.continue')}
              </Button>
            </Form.Item>

            <div className="text-center">
              <Link href="/login" className="secondary-link">
                {t('common.labels.return_to_login_forget_password')}
              </Link>
            </div>
          </Form>
        </>
      ) : (
        <>
          <h1 className='h4'>{t('common.labels.welcome')}</h1>
          <p className="m-b-40">{t('common.labels.sign_into_account')}</p>
          {/*@ts-ignore*/}
          <Form
            layout="vertical"
            name="login-form"
            form={form}
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            autoComplete="off">
            <Form.Item
              name="username"
              label={t('common.labels.email')}
              rules={[
                {
                  required: true,
                  message: t('common.messages.email_required'),
                },
              ]}
              >
              <Input onBlur={onBlur} size={'large'} />
            </Form.Item>
            <Form.Item
              name="password"
              label={t('common.labels.password')}
              // rules={[
              //   {
              //     required: true,
              //     message: t('common.messages.login_password_required'),
              //   },
              // ]}
              >
              <Input.Password size={'large'}></Input.Password>
            </Form.Item>

            <Row gutter={16} className='m-b-24'>
              <Col className="gutter-row" span={12}>
                {/* TODO: temporarily commented */}
                {/*<Form.Item name="remember" valuePropName="checked">*/}
                {/*  <Checkbox>{t('common.labels.remember')}</Checkbox>*/}
                {/*</Form.Item>*/}
              </Col>
              <Col className="gutter-row text-right  lh-normal" span={12}>
                <Link href="/forgot-password">
                  {t('common.labels.forgot_password?')}
                </Link>
              </Col>
            </Row>

            {/*<input type="submit" />*/}

            <Button
              id={t('common.labels.submit')}
              type="primary"
              htmlType="submit"
              className="w-100"
              loading={links?.isLoading ? true : false}
              size="large">
              {t('common.labels.sign_in')}
            </Button>

            {/*TODO:Currently this section is remove*/}
            {/*<Divider plain>{t('common.labels.sign_with')}</Divider>*/}
            {/*<Row gutter={16}>*/}
            {/*  <Col className="gutter-row" span={12}>*/}
            {/*    <Button*/}
            {/*      id={t('google')}*/}
            {/*      name="Google"*/}
            {/*      icon={<GoogleIcon />}*/}
            {/*      size="large"*/}
            {/*      className="w-100">*/}
            {/*      {t('common.labels.google')}*/}
            {/*    </Button>*/}
            {/*  </Col>*/}
            {/*  <Col className="gutter-row" span={12}>*/}
            {/*    <Button*/}
            {/*      id={t('sso')}*/}
            {/*      name="SSO"*/}
            {/*      icon={<KeyIcon />}*/}
            {/*      size="large"*/}
            {/*      className="w-100">*/}
            {/*      {t('common.labels.sso')}*/}
            {/*    </Button>*/}
            {/*  </Col>*/}
            {/*</Row>*/}
          </Form>
        </>
      )}
    </AuthContainer>
  );
};

export default Login;
