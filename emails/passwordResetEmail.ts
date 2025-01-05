import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    
  } from '@react-email/components';
    
    interface passwordResetCodeEmail {
      username: string;
      otp: string;
    }
    
    export default function passwordResetCodeEmail({ username, otp }: passwordResetCodeEmail ) {
      return (
        <Html lang="en" dir="ltr">
          <Head>
            <title>Password Reset Code</title>
            <Font
              fontFamily="Roboto"
              fallbackFontFamily="Verdana"
              webFont={{
                url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
                format: 'woff2',
              }}
              fontWeight={400}
              fontStyle="normal"
            />
          </Head>
          <Preview>Here&apos;s your reset code: {otp}</Preview>
          <Section>
            <Row>
              <Heading as="h2">Hello {username},</Heading>
            </Row>
            <Row>
              <Text>
                Please use the following verification
                code to reset password:
              </Text>
            </Row>
            <Row>
              <Text>{otp}</Text> 
            </Row>
            <Row>
              <Text>
                If you did not request this code, please ignore this email.
              </Text>
            </Row>
            {/* <Row>
              <Button
                href={`http://localhost:3000/verify/${username}`}
                style={{ color: '#61dafb' }}
              >
                Verify here
              </Button>
            </Row> */}
          </Section>
        </Html>
      );
    }